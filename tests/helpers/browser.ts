import { spawn, spawnSync, ChildProcess } from 'child_process';
import http from 'http';
import net from 'net';
import fs from 'fs';
import path from 'path';

export interface ViewportOptions {
  width: number;
  height: number;
  deviceScaleFactor?: number;
  mobile?: boolean;
}

export interface BrowserOptions {
  port?: number;
  headless?: boolean;
  browserPath?: string;
  userDataDir?: string;
}

export interface NavigateOptions {
  timeoutMs?: number;
  waitForSelector?: string;
  waitForHydration?: boolean;
  waitForCssStability?: boolean;
  settleMs?: number;
}

export interface EmulatedMediaFeature {
  name: string;
  value: string;
}

export interface EmulatedMediaOptions {
  media?: string;
  features?: EmulatedMediaFeature[];
}

export type KeyEventType = 'keyDown' | 'keyUp' | 'rawKeyDown' | 'char';

export interface KeyEventOptions {
  key?: string;
  code?: string;
  windowsVirtualKeyCode?: number;
  nativeVirtualKeyCode?: number;
  text?: string;
  unmodifiedText?: string;
  modifiers?: number;
}

export type NamedKey =
  | 'Tab'
  | 'ShiftTab'
  | 'Escape'
  | 'Enter'
  | 'ArrowDown'
  | 'ArrowUp'
  | 'ArrowLeft'
  | 'ArrowRight'
  | 'Space';

export interface NetworkEntry {
  requestId: string;
  url: string;
  method: string;
  type: string;
  status?: number;
  statusText?: string;
  headers?: Record<string, string>;
  mimeType?: string;
  encodedDataLength?: number;
  failed?: boolean;
  errorText?: string;
  timestamp: number;
}

function getJson<T = any>(url: string): Promise<T> {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

function findBrowserBinary(preferredPath?: string): string {
  if (preferredPath && fs.existsSync(preferredPath)) {
    return preferredPath;
  }
  if (process.env.BROWSER_PATH && fs.existsSync(process.env.BROWSER_PATH)) {
    return process.env.BROWSER_PATH;
  }

  const candidates = [
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }

  throw new Error(
    'No supported browser found (Edge or Chrome). Please set BROWSER_PATH environment variable.'
  );
}

function isPortFree(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.unref();
    server.once('error', () => resolve(false));
    server.once('listening', () => {
      server.close(() => resolve(true));
    });
    server.listen(port, '127.0.0.1');
  });
}

function findFreePort(): Promise<number> {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.unref();
    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => {
      const addr = server.address();
      const port = typeof addr === 'object' && addr ? addr.port : 9227;
      server.close(() => resolve(port));
    });
  });
}

export class BrowserController {
  private browserProc: ChildProcess | null = null;
  private ws: WebSocket | null = null;
  private id = 1;
  private callbacks = new Map<number, { resolve: (val: any) => void; reject: (err: any) => void }>();
  private eventListeners = new Map<string, Set<(params: any) => void>>();
  private networkEntries: NetworkEntry[] = [];
  private networkIndex = new Map<string, NetworkEntry>();
  private pageErrors: string[] = [];
  private lastNavigationStartIdx = 0;
  private userDataDir: string;
  private port: number;
  private isClosing = false;
  private unhealthy = false;
  private browserPath?: string;

  constructor(port = 9226, userDataDir?: string) {
    this.port = port;
    this.userDataDir = userDataDir || path.join(process.env.TEMP || 'C:\\temp', `cdp_test_${Date.now()}_${Math.floor(Math.random() * 100000)}`);
  }

  public isConnected(): boolean {
    return Boolean(this.ws && this.ws.readyState === WebSocket.OPEN && !this.isClosing && !this.unhealthy);
  }

  public async launch(browserPath?: string): Promise<void> {
    this.isClosing = false;
    this.unhealthy = false;
    this.browserPath = browserPath;
    const binary = findBrowserBinary(browserPath);

    if (!(await isPortFree(this.port))) {
      this.port = await findFreePort();
    }

    this.browserProc = spawn(binary, [
      '--headless=new',
      `--remote-debugging-port=${this.port}`,
      `--user-data-dir=${this.userDataDir}`,
      '--no-first-run',
      '--disable-gpu',
      '--disable-extensions',
      '--disable-background-networking',
      '--disable-background-timer-throttling',
      '--disable-backgrounding-occluded-windows',
      '--disable-renderer-backgrounding',
      '--disable-sync',
      '--disable-default-apps',
      '--mute-audio',
      '--no-default-browser-check',
      '--window-size=1440,900',
    ], {
      stdio: 'ignore',
    });

    // Wait for CDP endpoint to become available
    let connected = false;
    for (let i = 0; i < 40; i++) {
      await new Promise(r => setTimeout(r, 150));
      try {
        const version = await getJson(`http://127.0.0.1:${this.port}/json/version`);
        if (version?.webSocketDebuggerUrl) {
          connected = true;
          break;
        }
      } catch {
        // Retry
      }
    }

    if (!connected) {
      await this.close();
      throw new Error(`Failed to connect to CDP endpoint on port ${this.port}`);
    }

    // Connect to a page target
    const targets = await getJson<Array<{ type: string; webSocketDebuggerUrl: string }>>(`http://127.0.0.1:${this.port}/json/list`);
    let pageTarget = targets.find(t => t.type === 'page');
    if (!pageTarget) {
      pageTarget = await getJson(`http://127.0.0.1:${this.port}/json/new`);
    }

    if (!pageTarget?.webSocketDebuggerUrl) {
      await this.close();
      throw new Error('No page target available via CDP');
    }

    await this.connectWs(pageTarget.webSocketDebuggerUrl);
    this.setupNetworkListeners();

    this.on('Runtime.exceptionThrown', (params) => {
      const desc = params?.exceptionDetails?.exception?.description || params?.exceptionDetails?.text || 'Uncaught exception';
      this.pageErrors.push(desc);
    });

    await this.send('Page.enable');
    await this.send('DOM.enable');
    await this.send('CSS.enable');
    await this.send('Runtime.enable');
    await this.send('Network.enable');
  }

  private setupNetworkListeners(): void {
    this.on('Network.requestWillBeSent', (params) => {
      const entry: NetworkEntry = {
        requestId: params.requestId,
        url: params.request?.url || '',
        method: params.request?.method || 'GET',
        type: params.type || 'Other',
        timestamp: Date.now(),
      };
      this.networkEntries.push(entry);
      this.networkIndex.set(params.requestId, entry);
    });

    this.on('Network.responseReceived', (params) => {
      let entry = this.networkIndex.get(params.requestId);
      if (!entry) {
        entry = {
          requestId: params.requestId,
          url: params.response?.url || '',
          method: 'GET',
          type: params.type || 'Other',
          timestamp: Date.now(),
        };
        this.networkEntries.push(entry);
        this.networkIndex.set(params.requestId, entry);
      }
      entry.status = params.response?.status;
      entry.statusText = params.response?.statusText;
      entry.headers = params.response?.headers;
      entry.mimeType = params.response?.mimeType;
      if (params.type) {
        entry.type = params.type;
      }
    });

    this.on('Network.loadingFinished', (params) => {
      const entry = this.networkIndex.get(params.requestId);
      if (entry) {
        entry.encodedDataLength = params.encodedDataLength;
      }
    });

    this.on('Network.loadingFailed', (params) => {
      const entry = this.networkIndex.get(params.requestId);
      if (entry) {
        entry.failed = true;
        entry.errorText = params.errorText;
      }
    });
  }

  private connectWs(wsUrl: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(wsUrl);
      this.ws.onopen = () => resolve();
      this.ws.onclose = () => {
        if (!this.isClosing) {
          for (const [, cb] of this.callbacks.entries()) {
            cb.reject(new Error('CDP WebSocket connection closed unexpectedly'));
          }
        } else {
          for (const [, cb] of this.callbacks.entries()) {
            cb.resolve(undefined);
          }
        }
        this.callbacks.clear();
      };
      this.ws.onerror = (err: any) => {
        for (const [, cb] of this.callbacks.entries()) {
          cb.reject(new Error(`CDP WebSocket error: ${err?.message || 'unknown'}`));
        }
        this.callbacks.clear();
        reject(err);
      };
      this.ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data.toString());
          if (msg.id && this.callbacks.has(msg.id)) {
            const { resolve, reject } = this.callbacks.get(msg.id)!;
            this.callbacks.delete(msg.id);
            if (msg.error) {
              reject(new Error(msg.error.message || JSON.stringify(msg.error)));
            } else {
              resolve(msg.result);
            }
          } else if (msg.method) {
            const handlers = this.eventListeners.get(msg.method);
            if (handlers && handlers.size > 0) {
              for (const handler of Array.from(handlers)) {
                try {
                  handler(msg.params);
                } catch (handlerErr) {
                  console.error(`Error in CDP event handler for ${msg.method}:`, handlerErr);
                }
              }
            }
          }
        } catch (e) {
          console.error('Error handling CDP WebSocket message:', e);
        }
      };
    });
  }

  public on(event: string, handler: (params: any) => void): () => void {
    let handlers = this.eventListeners.get(event);
    if (!handlers) {
      handlers = new Set();
      this.eventListeners.set(event, handlers);
    }
    handlers.add(handler);
    return () => this.off(event, handler);
  }

  public off(event: string, handler: (params: any) => void): void {
    const handlers = this.eventListeners.get(event);
    if (handlers) {
      handlers.delete(handler);
    }
  }

  public once(event: string, timeoutMs = 15000): Promise<any> {
    return new Promise((resolve, reject) => {
      let settled = false;
      const off = this.on(event, (params) => {
        if (!settled) {
          settled = true;
          clearTimeout(timer);
          off();
          resolve(params);
        }
      });
      const timer = setTimeout(() => {
        if (!settled) {
          settled = true;
          off();
          reject(new Error(`Timed out waiting for CDP event '${event}' after ${timeoutMs}ms`));
        }
      }, timeoutMs);
    });
  }

  public send(method: string, params: Record<string, any> = {}, timeoutMs = 15000): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
        return reject(new Error('WebSocket is not open'));
      }
      const id = this.id++;
      const timer = setTimeout(() => {
        if (this.callbacks.has(id)) {
          this.callbacks.delete(id);
          this.unhealthy = true;
          reject(new Error(`CDP command '${method}' timed out after ${timeoutMs}ms`));
        }
      }, timeoutMs);

      this.callbacks.set(id, {
        resolve: (val) => { clearTimeout(timer); resolve(val); },
        reject: (err) => { clearTimeout(timer); reject(err); },
      });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  public async evaluate<T = any>(expression: string): Promise<T> {
    const res = await this.send('Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise: true,
    });
    if (res?.exceptionDetails) {
      const desc = res.exceptionDetails.exception?.description || res.exceptionDetails.text;
      throw new Error(`Eval failed: ${desc}`);
    }
    return res?.result?.value as T;
  }

  public async relaunch(): Promise<void> {
    await this.close();
    this.id = 1;
    this.callbacks.clear();
    this.networkEntries = [];
    this.networkIndex.clear();
    this.pageErrors = [];
    this.lastNavigationStartIdx = 0;
    this.userDataDir = path.join(process.env.TEMP || 'C:\\temp', `cdp_test_${Date.now()}_${Math.floor(Math.random() * 100000)}`);
    await this.launch(this.browserPath);
  }

  public async navigate(url: string, waitMsOrOptions?: number | NavigateOptions): Promise<void> {
    if (!this.isConnected()) {
      await this.relaunch();
    }

    const opts: NavigateOptions =
      typeof waitMsOrOptions === 'number'
        ? { settleMs: waitMsOrOptions }
        : (waitMsOrOptions ?? {});

    const timeoutMs = opts.timeoutMs ?? 15000;
    const shouldWaitHydration = opts.waitForHydration !== false;

    this.lastNavigationStartIdx = this.networkEntries.length;

    const domPromise = this.once('Page.domContentEventFired', Math.min(timeoutMs, 5000)).catch(() => null);
    const loadPromise = this.once('Page.loadEventFired', Math.min(timeoutMs, 5000)).catch(() => null);
    const navRes = await this.send('Page.navigate', { url }, timeoutMs);

    if (navRes?.loaderId) {
      await Promise.race([loadPromise, domPromise]);
    }

    await this.waitForCondition(`document.readyState === 'complete' || document.readyState === 'interactive'`, timeoutMs);

    if (shouldWaitHydration) {
      await this.waitForHydration(timeoutMs);
      // Allow React post-commit effects (e.g. SEO/Helmet title & JSON-LD sync) to flush
      await this.evaluate<void>('new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)))').catch(() => undefined);
    }

    if (opts.waitForSelector) {
      await this.waitForSelector(opts.waitForSelector, timeoutMs);
    }

    if (opts.waitForCssStability) {
      await this.waitForCssStability(opts.waitForSelector || '.vb-hero, main, body', Math.min(timeoutMs, 3000));
    }

    if (opts.settleMs && opts.settleMs > 0) {
      await new Promise(r => setTimeout(r, opts.settleMs));
    }
  }

  public async setScriptExecutionDisabled(disabled: boolean): Promise<void> {
    await this.send('Emulation.setScriptExecutionDisabled', { value: disabled });
  }

  public async setUserAgent(userAgent: string): Promise<void> {
    await this.send('Network.setUserAgentOverride', { userAgent });
  }

  public clearPageErrors(): void {
    this.pageErrors = [];
  }

  public getPageErrors(): string[] {
    return [...this.pageErrors];
  }

  public async measureCls(durationMs = 400): Promise<number> {
    return await this.evaluate<number>(`
      new Promise(resolve => {
        if (typeof PerformanceObserver === 'undefined') return resolve(0);
        let cls = 0;
        let sessionValue = 0;
        let sessionEntries = [];
        try {
          const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              if (!entry.hadRecentInput) {
                const first = sessionEntries[0];
                const last = sessionEntries[sessionEntries.length - 1];
                if (sessionValue && entry.startTime - last.startTime < 1000 && entry.startTime - first.startTime < 5000) {
                  sessionValue += entry.value;
                  sessionEntries.push(entry);
                } else {
                  sessionValue = entry.value;
                  sessionEntries = [entry];
                }
                if (sessionValue > cls) cls = sessionValue;
              }
            }
          });
          observer.observe({ type: 'layout-shift', buffered: true });
          setTimeout(() => {
            try { observer.disconnect(); } catch {}
            resolve(Number(cls.toFixed(6)));
          }, ${durationMs});
        } catch {
          resolve(0);
        }
      })
    `);
  }

  public async waitForHydration(timeoutMs = 10000): Promise<boolean> {
    const start = Date.now();
    const hydrated = await this.waitForCondition(`
      (() => {
        const root = document.getElementById('root');
        if (!root || root.children.length === 0) return false;
        const text = (root.textContent || '').trim();
        const hasSemanticDom = root.querySelectorAll('nav, section, article, header, footer, h1, h2, a, button, img').length > 0;
        return text.length > 0 || hasSemanticDom;
      })()
    `, timeoutMs);

    if (!hydrated) return false;

    const remaining = Math.max(200, timeoutMs - (Date.now() - start));
    try {
      await Promise.race([
        this.evaluate<void>('document.fonts ? document.fonts.ready.then(() => undefined) : Promise.resolve()'),
        new Promise(r => setTimeout(r, Math.min(remaining, 1500))),
      ]);
    } catch {
      // Ignore font readiness failures on blocked/offline resources
    }

    return true;
  }

  public async waitForCssStability(selector = '.vb-hero, main, body', timeoutMs = 3000): Promise<boolean> {
    const start = Date.now();
    let previousSnapshot: string | null = null;
    let stableMatches = 0;

    while (Date.now() - start < timeoutMs) {
      try {
        const snapshot = await this.evaluate<string | null>(`
          (() => {
            const el = document.querySelector(${JSON.stringify(selector)}) || document.body;
            if (!el) return null;
            const style = window.getComputedStyle(el);
            const bodyStyle = window.getComputedStyle(document.body);
            const rect = el.getBoundingClientRect();
            const runningFinite = (document.getAnimations ? document.getAnimations() : []).filter(a => {
              if (a.playState !== 'running') return false;
              const timing = a.effect && a.effect.getComputedTiming ? a.effect.getComputedTiming() : null;
              return timing && timing.iterations !== Infinity;
            }).length;
            if (runningFinite > 0) return 'animating:' + runningFinite;
            return JSON.stringify({
              bg: style.backgroundColor,
              bodyBg: bodyStyle.backgroundColor,
              color: style.color,
              opacity: style.opacity,
              transform: style.transform,
              w: Math.round(rect.width),
              h: Math.round(rect.height),
              t: Math.round(rect.top),
              l: Math.round(rect.left)
            });
          })()
        `);

        if (snapshot && !snapshot.startsWith('animating:')) {
          if (snapshot === previousSnapshot) {
            stableMatches++;
            if (stableMatches >= 1) {
              return true;
            }
          } else {
            stableMatches = 0;
            previousSnapshot = snapshot;
          }
        } else {
          stableMatches = 0;
          previousSnapshot = null;
        }
      } catch {
        // Retry until timeout
      }
      await new Promise(r => setTimeout(r, 60));
    }

    return false;
  }

  public async setViewport(options: ViewportOptions): Promise<void> {
    await this.send('Emulation.setDeviceMetricsOverride', {
      width: options.width,
      height: options.height,
      deviceScaleFactor: options.deviceScaleFactor ?? 1,
      mobile: options.mobile ?? (options.width < 1024),
    });
    await this.evaluate<void>('new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)))');
  }

  public async setEmulatedMedia(options: EmulatedMediaOptions): Promise<void> {
    await this.send('Emulation.setEmulatedMedia', {
      media: options.media ?? '',
      features: options.features ?? [],
    });
    await this.evaluate<void>('new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)))');
  }

  public async dispatchKeyEvent(type: KeyEventType, options: KeyEventOptions = {}): Promise<void> {
    await this.send('Input.dispatchKeyEvent', {
      type,
      ...options,
    });
  }

  public async pressKey(key: NamedKey): Promise<void> {
    const keyMap: Record<NamedKey, { key: string; code: string; windowsVirtualKeyCode: number; text?: string; shift?: boolean }> = {
      Tab: { key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 },
      ShiftTab: { key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9, shift: true },
      Escape: { key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 },
      Enter: { key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13, text: '\r' },
      ArrowDown: { key: 'ArrowDown', code: 'ArrowDown', windowsVirtualKeyCode: 40 },
      ArrowUp: { key: 'ArrowUp', code: 'ArrowUp', windowsVirtualKeyCode: 38 },
      ArrowLeft: { key: 'ArrowLeft', code: 'ArrowLeft', windowsVirtualKeyCode: 37 },
      ArrowRight: { key: 'ArrowRight', code: 'ArrowRight', windowsVirtualKeyCode: 39 },
      Space: { key: ' ', code: 'Space', windowsVirtualKeyCode: 32, text: ' ' },
    };

    const spec = keyMap[key];
    if (!spec) {
      throw new Error(`Unsupported key in pressKey: ${key}`);
    }

    if (spec.shift) {
      await this.dispatchKeyEvent('keyDown', {
        key: 'Shift',
        code: 'ShiftLeft',
        windowsVirtualKeyCode: 16,
        nativeVirtualKeyCode: 16,
        modifiers: 8,
      });
      await this.dispatchKeyEvent('keyDown', {
        key: spec.key,
        code: spec.code,
        windowsVirtualKeyCode: spec.windowsVirtualKeyCode,
        nativeVirtualKeyCode: spec.windowsVirtualKeyCode,
        modifiers: 8,
      });
      await this.dispatchKeyEvent('keyUp', {
        key: spec.key,
        code: spec.code,
        windowsVirtualKeyCode: spec.windowsVirtualKeyCode,
        nativeVirtualKeyCode: spec.windowsVirtualKeyCode,
        modifiers: 8,
      });
      await this.dispatchKeyEvent('keyUp', {
        key: 'Shift',
        code: 'ShiftLeft',
        windowsVirtualKeyCode: 16,
        nativeVirtualKeyCode: 16,
        modifiers: 0,
      });
    } else {
      await this.dispatchKeyEvent('keyDown', {
        key: spec.key,
        code: spec.code,
        windowsVirtualKeyCode: spec.windowsVirtualKeyCode,
        nativeVirtualKeyCode: spec.windowsVirtualKeyCode,
        ...(spec.text ? { text: spec.text, unmodifiedText: spec.text } : {}),
      });
      await this.dispatchKeyEvent('keyUp', {
        key: spec.key,
        code: spec.code,
        windowsVirtualKeyCode: spec.windowsVirtualKeyCode,
        nativeVirtualKeyCode: spec.windowsVirtualKeyCode,
      });
    }

    await this.evaluate<void>('new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)))');
  }

  public clearNetworkLog(): void {
    this.networkEntries = [];
    this.networkIndex.clear();
    this.lastNavigationStartIdx = 0;
  }

  public getNetworkEntries(urlPattern?: string | RegExp): NetworkEntry[] {
    if (!urlPattern) {
      return [...this.networkEntries];
    }
    return this.networkEntries.filter(entry =>
      typeof urlPattern === 'string'
        ? entry.url.includes(urlPattern)
        : urlPattern.test(entry.url)
    );
  }

  public getLastNavigationEntries(): NetworkEntry[] {
    return this.networkEntries.slice(this.lastNavigationStartIdx);
  }

  public getLastDocumentResponse(): NetworkEntry | undefined {
    const entries = this.getLastNavigationEntries();
    for (let i = entries.length - 1; i >= 0; i--) {
      if (entries[i].type === 'Document' && typeof entries[i].status === 'number') {
        return entries[i];
      }
    }
    for (let i = this.networkEntries.length - 1; i >= 0; i--) {
      if (this.networkEntries[i].type === 'Document' && typeof this.networkEntries[i].status === 'number') {
        return this.networkEntries[i];
      }
    }
    return undefined;
  }

  public getLastResponseStatus(): number | null {
    const doc = this.getLastDocumentResponse();
    return typeof doc?.status === 'number' ? doc.status : null;
  }

  public getResponseHeaders(urlPattern: string | RegExp): Record<string, string> | null {
    const matches = this.getNetworkEntries(urlPattern);
    for (let i = matches.length - 1; i >= 0; i--) {
      if (matches[i].headers) {
        return matches[i].headers!;
      }
    }
    return null;
  }

  public getAssetSize(urlPattern: string | RegExp): number | null {
    const matches = this.getNetworkEntries(urlPattern);
    for (let i = matches.length - 1; i >= 0; i--) {
      if (typeof matches[i].encodedDataLength === 'number') {
        return matches[i].encodedDataLength!;
      }
    }
    return null;
  }

  public async blockUrls(urls: string[]): Promise<void> {
    await this.send('Network.setBlockedURLs', { urls });
  }

  public async getTitle(): Promise<string> {
    return (await this.evaluate<string>('document.title')) || '';
  }

  public async getText(selector: string): Promise<string | null> {
    return await this.evaluate<string | null>(`
      (() => {
        const el = document.querySelector(${JSON.stringify(selector)});
        return el ? el.textContent : null;
      })()
    `);
  }

  public async getAttribute(selector: string, attr: string): Promise<string | null> {
    return await this.evaluate<string | null>(`
      (() => {
        const el = document.querySelector(${JSON.stringify(selector)});
        return el ? el.getAttribute(${JSON.stringify(attr)}) : null;
      })()
    `);
  }

  public async isVisible(selector: string): Promise<boolean> {
    return await this.evaluate<boolean>(`
      (() => {
        const el = document.querySelector(${JSON.stringify(selector)});
        if (!el) return false;
        const rect = el.getBoundingClientRect();
        const style = window.getComputedStyle(el);
        return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0' && rect.width > 0 && rect.height > 0;
      })()
    `);
  }

  public async click(selector: string, waitMs = 300): Promise<void> {
    const coords = await this.evaluate<{ x: number; y: number } | null>(`
      (() => {
        const el = document.querySelector(${JSON.stringify(selector)});
        if (!el) return null;
        el.scrollIntoView({ block: 'center', inline: 'center' });
        const rect = el.getBoundingClientRect();
        return { x: Math.round(rect.left + rect.width / 2), y: Math.round(rect.top + rect.height / 2) };
      })()
    `);

    if (!coords) {
      // Fallback: invoke .click() directly via javascript
      await this.evaluate(`
        (() => {
          const el = document.querySelector(${JSON.stringify(selector)});
          if (el) el.click();
        })()
      `);
    } else {
      await this.send('Input.dispatchMouseEvent', {
        type: 'mousePressed',
        x: coords.x,
        y: coords.y,
        button: 'left',
        clickCount: 1,
      });
      await this.send('Input.dispatchMouseEvent', {
        type: 'mouseReleased',
        x: coords.x,
        y: coords.y,
        button: 'left',
        clickCount: 1,
      });
    }

    if (waitMs > 0) {
      await new Promise(r => setTimeout(r, waitMs));
    }
  }

  public async getComputedStyle(selector: string, property: string): Promise<string> {
    return (await this.evaluate<string>(`
      (() => {
        const el = document.querySelector(${JSON.stringify(selector)});
        if (!el) return '';
        return window.getComputedStyle(el).getPropertyValue(${JSON.stringify(property)});
      })()
    `)) || '';
  }

  public async getMetaContent(nameOrProperty: string): Promise<string | null> {
    return await this.evaluate<string | null>(`
      (() => {
        const key = ${JSON.stringify(nameOrProperty)};
        const el =
          document.querySelector('meta[data-rh="true"][name="' + key + '"]') ||
          document.querySelector('meta[data-rh="true"][property="' + key + '"]') ||
          document.querySelector('meta[name="' + key + '"]') ||
          document.querySelector('meta[property="' + key + '"]');
        return el ? el.getAttribute('content') : null;
      })()
    `);
  }

  public async getCanonicalHref(): Promise<string | null> {
    return await this.evaluate<string | null>(`
      (() => {
        const el =
          document.querySelector('link[data-rh="true"][rel="canonical"]') ||
          document.querySelector('link[rel="canonical"]');
        return el ? el.getAttribute('href') : null;
      })()
    `);
  }

  public async ensureTheme(theme: 'dark' | 'light'): Promise<void> {
    const current = await this.evaluate<string | null>(`
      (() => {
        try { localStorage.setItem('vb-theme', ${JSON.stringify(theme)}); } catch {}
        return document.documentElement.dataset.theme || null;
      })()
    `);
    if (current !== theme) {
      await this.click('.vb-theme, button[aria-label*="theme"]', 0);
      await this.waitForCondition(`document.documentElement.dataset.theme === ${JSON.stringify(theme)}`, 3000);
    }
  }

  public async getJsonLdScripts(): Promise<any[]> {
    return await this.evaluate<any[]>(`
      (() => {
        const scripts = document.querySelectorAll('script[type="application/ld+json"]');
        const results = [];
        scripts.forEach(s => {
          try {
            const parsed = JSON.parse(s.textContent || '');
            if (Array.isArray(parsed)) {
              results.push(...parsed);
            } else if (parsed) {
              results.push(parsed);
            }
          } catch (e) {}
        });
        return results;
      })()
    `);
  }

  public async waitForSelector(selector: string, timeoutMs = 5000): Promise<boolean> {
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
      try {
        const found = await this.evaluate<boolean>(`!!document.querySelector(${JSON.stringify(selector)})`);
        if (found) return true;
      } catch {
        // Target may be transitioning; keep polling until timeout
      }
      await new Promise(r => setTimeout(r, 50));
    }
    return false;
  }

  public async waitForCondition(expression: string, timeoutMs = 5000): Promise<boolean> {
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
      try {
        const result = await this.evaluate<boolean>(expression);
        if (result) return true;
      } catch {}
      await new Promise(r => setTimeout(r, 50));
    }
    return false;
  }

  public async close(): Promise<void> {
    this.isClosing = true;
    if (this.ws) {
      try {
        this.ws.close();
      } catch {}
      this.ws = null;
    }

    this.eventListeners.clear();

    if (this.browserProc) {
      try {
        if (process.platform === 'win32' && this.browserProc.pid) {
          spawnSync('taskkill', ['/pid', String(this.browserProc.pid), '/f', '/t'], { stdio: 'ignore' });
        } else {
          this.browserProc.kill();
        }
      } catch {}
      this.browserProc = null;
    }

    // Clean up temporary user data directory
    try {
      if (fs.existsSync(this.userDataDir)) {
        fs.rmSync(this.userDataDir, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 });
      }
    } catch {}
  }
}

// Module-level shared singleton for suite convenience
let sharedBrowser: BrowserController | null = null;

export async function getSharedBrowser(port = 9226): Promise<BrowserController> {
  if (sharedBrowser && !sharedBrowser.isConnected()) {
    await sharedBrowser.close();
    sharedBrowser = null;
  }
  if (!sharedBrowser) {
    sharedBrowser = new BrowserController(port);
    await sharedBrowser.launch();
  }
  return sharedBrowser;
}

export async function closeSharedBrowser(): Promise<void> {
  if (sharedBrowser) {
    await sharedBrowser.close();
    sharedBrowser = null;
  }
}

// Lifecycle listeners to prevent zombie processes
process.on('exit', () => {
  closeSharedBrowser();
});
process.on('SIGINT', () => {
  closeSharedBrowser();
  process.exit(1);
});
