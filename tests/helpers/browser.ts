import { spawn, spawnSync, ChildProcess } from 'child_process';
import http from 'http';
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

export class BrowserController {
  private browserProc: ChildProcess | null = null;
  private ws: WebSocket | null = null;
  private id = 1;
  private callbacks = new Map<number, { resolve: (val: any) => void; reject: (err: any) => void }>();
  private userDataDir: string;
  private port: number;

  constructor(port = 9226, userDataDir?: string) {
    this.port = port;
    this.userDataDir = userDataDir || path.join(process.env.TEMP || 'C:\\temp', `cdp_test_${Date.now()}_${Math.floor(Math.random() * 10000)}`);
  }

  public async launch(browserPath?: string): Promise<void> {
    const binary = findBrowserBinary(browserPath);

    this.browserProc = spawn(binary, [
      '--headless=new',
      `--remote-debugging-port=${this.port}`,
      `--user-data-dir=${this.userDataDir}`,
      '--no-first-run',
      '--disable-gpu',
      '--disable-extensions',
      '--disable-background-networking',
      '--disable-sync',
      '--disable-default-apps',
      '--mute-audio',
      '--no-default-browser-check',
      '--window-size=1440,900',
    ]);

    // Wait for CDP endpoint to become available
    let connected = false;
    for (let i = 0; i < 30; i++) {
      await new Promise(r => setTimeout(r, 200));
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
      this.browserProc.kill();
      throw new Error(`Failed to connect to CDP endpoint on port ${this.port}`);
    }

    // Connect to a page target
    const targets = await getJson<Array<{ type: string; webSocketDebuggerUrl: string }>>(`http://127.0.0.1:${this.port}/json/list`);
    let pageTarget = targets.find(t => t.type === 'page');
    if (!pageTarget) {
      pageTarget = await getJson(`http://127.0.0.1:${this.port}/json/new`);
    }

    if (!pageTarget?.webSocketDebuggerUrl) {
      throw new Error('No page target available via CDP');
    }

    await this.connectWs(pageTarget.webSocketDebuggerUrl);

    await this.send('Page.enable');
    await this.send('DOM.enable');
    await this.send('CSS.enable');
    await this.send('Runtime.enable');
  }

  private connectWs(wsUrl: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(wsUrl);
      this.ws.onopen = () => resolve();
      this.ws.onclose = () => {
        for (const [, cb] of this.callbacks.entries()) {
          cb.reject(new Error('CDP WebSocket connection closed unexpectedly'));
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
          }
        } catch (e) {
          console.error('Error handling CDP WebSocket message:', e);
        }
      };
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

  public async navigate(url: string, waitMs = 1200): Promise<void> {
    await this.send('Page.navigate', { url });
    await new Promise(r => setTimeout(r, waitMs));
  }

  public async setViewport(options: ViewportOptions): Promise<void> {
    await this.send('Emulation.setDeviceMetricsOverride', {
      width: options.width,
      height: options.height,
      deviceScaleFactor: options.deviceScaleFactor ?? 1,
      mobile: options.mobile ?? (options.width < 1024),
    });
    await new Promise(r => setTimeout(r, 150));
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
        const el = document.querySelector('meta[name="' + ${JSON.stringify(nameOrProperty)} + '"]') ||
                   document.querySelector('meta[property="' + ${JSON.stringify(nameOrProperty)} + '"]');
        return el ? el.getAttribute('content') : null;
      })()
    `);
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
      const found = await this.evaluate<boolean>(`!!document.querySelector(${JSON.stringify(selector)})`);
      if (found) return true;
      await new Promise(r => setTimeout(r, 100));
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
      await new Promise(r => setTimeout(r, 100));
    }
    return false;
  }

  public async close(): Promise<void> {
    if (this.ws) {
      try {
        this.ws.close();
      } catch {}
      this.ws = null;
    }

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
        fs.rmSync(this.userDataDir, { recursive: true, force: true });
      }
    } catch {}
  }
}

// Module-level shared singleton for suite convenience
let sharedBrowser: BrowserController | null = null;

export async function getSharedBrowser(port = 9226): Promise<BrowserController> {
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
