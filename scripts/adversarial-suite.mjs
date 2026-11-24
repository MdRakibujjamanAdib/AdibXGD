import { spawn, spawnSync } from 'child_process';
import http from 'http';
import fs from 'fs';
import path from 'path';

const PORT = 9224;
const SERVER_PORT = 3000;
const BASE_URL = `http://localhost:${SERVER_PORT}`;
const USER_DATA_DIR = path.join(process.env.TEMP || 'C:\\temp', 'edge_cdp_adv_' + Date.now());

function findBrowserBinary() {
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
  throw new Error('No supported browser found (Edge or Chrome). Set BROWSER_PATH environment variable.');
}

function probeAdibxServer(url, timeoutMs = 1500) {
  return new Promise((resolve) => {
    try {
      const u = new URL(url);
      const req = http.request(
        {
          hostname: u.hostname,
          port: u.port || 80,
          path: u.pathname || '/',
          method: 'GET',
          timeout: timeoutMs,
        },
        (res) => {
          let body = '';
          res.setEncoding('utf8');
          res.on('data', (chunk) => {
            if (body.length < 65536) body += chunk;
          });
          res.on('end', () => {
            const up = Boolean(res.statusCode && res.statusCode < 500);
            const isAdibx = up && (
              body.includes('Md Rakibujjaman Adib') ||
              body.includes('adibx.me') ||
              body.includes('vb-hero')
            );
            resolve({ up, isAdibx, statusCode: res.statusCode });
          });
        }
      );
      req.on('error', () => resolve({ up: false, isAdibx: false }));
      req.on('timeout', () => {
        req.destroy();
        resolve({ up: false, isAdibx: false });
      });
      req.end();
    } catch {
      resolve({ up: false, isAdibx: false });
    }
  });
}

async function ensureLocalServer() {
  const existing = await probeAdibxServer(BASE_URL, 1200);
  if (existing.up) {
    if (!existing.isAdibx) {
      throw new Error(`Port ${SERVER_PORT} is occupied by a non-ADIBX.ME server (status ${existing.statusCode}).`);
    }
    return null;
  }

  console.log(`Starting Vite dev server on ${BASE_URL}...`);
  const cmd = process.platform === 'win32' ? 'npx.cmd' : 'npx';
  const proc = spawn(cmd, ['vite', '--port', String(SERVER_PORT), '--host', '127.0.0.1', '--strictPort'], {
    cwd: process.cwd(),
    shell: process.platform === 'win32',
    stdio: 'ignore',
  });

  const start = Date.now();
  while (Date.now() - start < 30000) {
    await new Promise(r => setTimeout(r, 400));
    const probe = await probeAdibxServer(BASE_URL, 1000);
    if (probe.isAdibx) {
      return proc;
    }
  }

  try {
    if (process.platform === 'win32' && proc.pid) {
      spawnSync('taskkill', ['/pid', String(proc.pid), '/f', '/t'], { stdio: 'ignore' });
    } else {
      proc.kill();
    }
  } catch {}
  throw new Error(`Failed to start Vite dev server on ${BASE_URL}`);
}

function getJson(url) {
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

class CDPClient {
  constructor(wsUrl) {
    this.wsUrl = wsUrl;
    this.ws = null;
    this.id = 1;
    this.callbacks = new Map();
    this.eventListeners = new Map();
  }

  async connect() {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(this.wsUrl);
      this.ws.onopen = () => resolve();
      this.ws.onerror = (err) => reject(err);
      this.ws.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        if (msg.id && this.callbacks.has(msg.id)) {
          const { resolve, reject } = this.callbacks.get(msg.id);
          this.callbacks.delete(msg.id);
          if (msg.error) {
            reject(new Error(msg.error.message || JSON.stringify(msg.error)));
          } else {
            resolve(msg.result);
          }
        } else if (msg.method && this.eventListeners.has(msg.method)) {
          for (const cb of this.eventListeners.get(msg.method)) {
            cb(msg.params);
          }
        }
      };
    });
  }

  once(event, timeoutMs = 15000) {
    return new Promise((resolve, reject) => {
      let listeners = this.eventListeners.get(event);
      if (!listeners) {
        listeners = new Set();
        this.eventListeners.set(event, listeners);
      }
      const handler = (params) => {
        clearTimeout(timer);
        listeners.delete(handler);
        resolve(params);
      };
      const timer = setTimeout(() => {
        listeners.delete(handler);
        reject(new Error(`Timed out waiting for ${event}`));
      }, timeoutMs);
      listeners.add(handler);
    });
  }

  send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = this.id++;
      this.callbacks.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  async eval(expression) {
    const res = await this.send('Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise: true,
    });
    if (res.exceptionDetails) {
      throw new Error(`Eval failed: ${res.exceptionDetails.text} (${JSON.stringify(res.exceptionDetails.exception)})`);
    }
    return res.result?.value;
  }

  async waitForHydration(timeoutMs = 15000) {
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
      try {
        const ready = await this.eval(`
          (() => {
            if (document.readyState !== 'complete') return false;
            const hero = document.querySelector('.vb-hero');
            const nav = document.querySelector('.vb-hero > nav.vb-nav');
            return Boolean(hero && nav);
          })()
        `);
        if (ready) return true;
      } catch {}
      await new Promise(r => setTimeout(r, 100));
    }
    throw new Error(`Timed out waiting for hydration after ${timeoutMs}ms`);
  }

  async screenshot(filePath) {
    const res = await this.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(filePath, Buffer.from(res.data, 'base64'));
  }

  close() {
    if (this.ws) this.ws.close();
  }
}

async function main() {
  let spawnedServerProc = null;
  let browserProc = null;
  let client = null;

  try {
    spawnedServerProc = await ensureLocalServer();

    console.log('Starting headless browser...');
    const browserBinary = findBrowserBinary();
    browserProc = spawn(browserBinary, [
      '--headless=new',
      `--remote-debugging-port=${PORT}`,
      `--user-data-dir=${USER_DATA_DIR}`,
      '--no-first-run',
      '--disable-gpu',
      '--disable-extensions',
      '--mute-audio',
    ]);

    let connected = false;
    let version = null;
    for (let i = 0; i < 30; i++) {
      await new Promise(r => setTimeout(r, 200));
      try {
        version = await getJson(`http://127.0.0.1:${PORT}/json/version`);
        if (version?.webSocketDebuggerUrl) {
          connected = true;
          break;
        }
      } catch (e) {}
    }

    if (!connected) {
      throw new Error('Failed to connect to CDP endpoint');
    }

    console.log('Connected to CDP:', version.Browser);

    const targets = await getJson(`http://127.0.0.1:${PORT}/json/list`);
    const pageTarget = targets.find(t => t.type === 'page') || (await getJson(`http://127.0.0.1:${PORT}/json/new`));

    client = new CDPClient(pageTarget.webSocketDebuggerUrl);
    await client.connect();

    await client.send('Page.enable');
    await client.send('DOM.enable');
    await client.send('CSS.enable');
    await client.send('Runtime.enable');

    const viewports = [
      { name: 'desktop-wide', width: 1920, height: 1080, dpr: 1 },
      { name: 'desktop', width: 1440, height: 900, dpr: 1 },
      { name: 'desktop-compact', width: 1280, height: 800, dpr: 1 },
      { name: 'desktop-1240', width: 1240, height: 800, dpr: 1 },
      { name: 'desktop-boundary', width: 1200, height: 800, dpr: 1 },
      { name: 'tablet-landscape', width: 1024, height: 768, dpr: 2 },
      { name: 'tablet-boundary', width: 810, height: 800, dpr: 2 },
      { name: 'mobile-boundary', width: 809, height: 800, dpr: 2 },
      { name: 'tablet-portrait', width: 768, height: 1024, dpr: 2 },
      { name: 'mobile-large', width: 428, height: 926, dpr: 3 },
      { name: 'mobile-standard', width: 390, height: 844, dpr: 3 },
      { name: 'mobile-small', width: 360, height: 740, dpr: 2 },
      { name: 'mobile-minimum', width: 320, height: 568, dpr: 2 },
      { name: 'mobile-fold', width: 280, height: 653, dpr: 2 }
    ];

    console.log(`\n--- Navigating to ${BASE_URL}/projects ---`);
    const loadPromise = client.once('Page.loadEventFired', 15000).catch(() => null);
    await client.send('Page.navigate', { url: `${BASE_URL}/projects` });
    await loadPromise;
    await client.waitForHydration(15000);

    let failureCount = 0;
    function assert(desc, condition, details = '') {
      if (condition) {
        console.log(`  ✓ ${desc}`);
      } else {
        console.error(`  ✗ FAIL: ${desc} ${details}`);
        failureCount++;
      }
    }

    for (const vp of viewports) {
      console.log(`\nTesting viewport: ${vp.name} (${vp.width}x${vp.height})`);
      await client.send('Emulation.setDeviceMetricsOverride', {
        width: vp.width,
        height: vp.height,
        deviceScaleFactor: vp.dpr,
        mobile: vp.width < 1024,
      });
      await client.eval('new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)))');

      // Reset scroll
      await client.eval('window.scrollTo(0, 0)');
      await client.eval('new Promise(r => requestAnimationFrame(r))');

      // Test Target Element existence (.vb-nav directly under .vb-hero)
      const targetNavInfo = await client.eval(`
        (() => {
          const el = document.querySelector('.vb-hero > nav.vb-nav[aria-label="Portfolio navigation"]');
          if (!el) return null;
          const rect = el.getBoundingClientRect();
          const style = window.getComputedStyle(el);
          return {
            exists: true,
            position: style.position,
            top: style.top,
            left: style.left,
            zIndex: style.zIndex,
            display: style.display,
            width: rect.width,
            height: rect.height,
            boundingTop: rect.top,
            boundingLeft: rect.left,
            hasWordmark: !!el.querySelector('.vb-wordmark'),
            hasTheme: !!el.querySelector('.vb-theme'),
            hasCornerRight: !!el.querySelector('.vb-nav-corner-right'),
            hasCornerBottom: !!el.querySelector('.vb-nav-corner-bottom'),
          };
        })()
      `);

      assert(`${vp.name}: Target nav element exists matching selector`, targetNavInfo !== null);
      if (targetNavInfo) {
        assert(`${vp.name}: Nav has position fixed`, targetNavInfo.position === 'fixed', `got ${targetNavInfo.position}`);
        assert(`${vp.name}: Nav top matches var(--vb-gap)`, targetNavInfo.top === (vp.width >= 1600 ? '16px' : '12px'), `got ${targetNavInfo.top}`);
        assert(`${vp.name}: Nav left matches var(--vb-gap)`, targetNavInfo.left === (vp.width >= 1600 ? '16px' : '12px'), `got ${targetNavInfo.left}`);
        assert(`${vp.name}: Nav zIndex >= 50`, parseInt(targetNavInfo.zIndex, 10) >= 50, `got ${targetNavInfo.zIndex}`);
        assert(`${vp.name}: Nav has right corner cutout`, targetNavInfo.hasCornerRight);
        assert(`${vp.name}: Nav has bottom corner cutout`, targetNavInfo.hasCornerBottom);
        assert(`${vp.name}: Nav has wordmark`, targetNavInfo.hasWordmark);
        assert(`${vp.name}: Nav has theme toggle`, targetNavInfo.hasTheme);
      }

      // Check horizontal overflow
      const overflowInfo = await client.eval(`
        (() => {
          const root = document.documentElement;
          return {
            scrollWidth: root.scrollWidth,
            clientWidth: root.clientWidth,
            hasOverflow: root.scrollWidth > window.innerWidth + 1
          };
        })()
      `);
      assert(`${vp.name}: No horizontal overflow`, !overflowInfo.hasOverflow, `scrollWidth: ${overflowInfo.scrollWidth}, clientWidth: ${overflowInfo.clientWidth}`);

      // Check sticky/fixed overlay behavior when scrolled
      await client.eval('window.scrollTo(0, 800)');
      await client.eval('new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)))');

      const scrolledNavInfo = await client.eval(`
        (() => {
          const el = document.querySelector('.vb-hero > nav.vb-nav[aria-label="Portfolio navigation"]');
          if (!el) return null;
          const rect = el.getBoundingClientRect();
          return {
            boundingTop: rect.top,
            boundingLeft: rect.left,
            scrollY: window.scrollY
          };
        })()
      `);

      const expectedTop = vp.width >= 1600 ? 16 : 12;
      assert(
        `${vp.name}: Nav remains pinned at top after 800px scroll`,
        scrolledNavInfo !== null && Math.abs(scrolledNavInfo.boundingTop - expectedTop) <= 1,
        scrolledNavInfo ? `boundingTop: ${scrolledNavInfo.boundingTop}, expected: ${expectedTop}` : 'nav element was null'
      );

      // Check viewport frame
      const frameInfo = await client.eval(`
        (() => {
          const f = document.querySelector('.vb-viewport-frame');
          if (!f) return null;
          const style = window.getComputedStyle(f);
          return {
            position: style.position,
            pointerEvents: style.pointerEvents,
            borderWidth: style.borderTopWidth,
            zIndex: style.zIndex
          };
        })()
      `);
      assert(`${vp.name}: Viewport frame has position fixed`, frameInfo?.position === 'fixed');
      assert(`${vp.name}: Viewport frame has pointer-events none`, frameInfo?.pointerEvents === 'none');

      // Viewport-specific layout checks
      if (vp.width >= 1200) {
        // Desktop checks
        const desktopInfo = await client.eval(`
          (() => {
            const rows = document.querySelectorAll('.vb-project-link-row');
            const showcase = document.querySelector('.vb-hero > .vb-showcase');
            const showcaseStyle = showcase ? window.getComputedStyle(showcase) : null;
            const showcaseRect = showcase ? showcase.getBoundingClientRect() : null;
            const rightCol = showcase ? showcase.nextElementSibling : null;
            const rightColRect = rightCol ? rightCol.getBoundingClientRect() : null;
            return {
              rowCount: rows.length,
              showcaseVisible: showcaseStyle ? showcaseStyle.display !== 'none' : false,
              hasActiveRow: !!document.querySelector('.vb-project-link-row.is-active'),
              isTwoColumn: showcaseRect && rightColRect ? (showcaseRect.width > 300 && rightColRect.width > 300 && rightColRect.left > showcaseRect.left) : false
            };
          })()
        `);
        assert(`${vp.name}: Desktop link rows rendered (>= 1)`, desktopInfo.rowCount > 0, `got ${desktopInfo.rowCount}`);
        assert(`${vp.name}: Desktop showcase is visible`, desktopInfo.showcaseVisible);
        assert(`${vp.name}: Has active project row`, desktopInfo.hasActiveRow);
        assert(`${vp.name}: Two-column desktop grid is properly split`, desktopInfo.isTwoColumn);
      } else {
        // Mobile & tablet checks
        const nonDesktopInfo = await client.eval(`
          (() => {
            const cards = document.querySelectorAll('.vb-mobile-card');
            const menuBtn = document.querySelector('.vb-hero > .vb-menu');
            const menuStyle = menuBtn ? window.getComputedStyle(menuBtn) : null;
            const navLinks = document.querySelector('.vb-hero > nav.vb-nav .vb-nav-links');
            const navLinksStyle = navLinks ? window.getComputedStyle(navLinks) : null;
            const showcase = document.querySelector('.vb-hero > .vb-showcase');
            const showcaseStyle = showcase ? window.getComputedStyle(showcase) : null;
            const firstCard = cards[0];
            let cardAspect = null;
            let isSquare = false;
            let tabCutout = null;
            if (firstCard) {
              const cr = firstCard.getBoundingClientRect();
              cardAspect = cr.height > 0 ? Number((cr.width / cr.height).toFixed(2)) : null;
              isSquare = firstCard.classList.contains('is-square');
              tabCutout = {
                hasRightCorner: !!firstCard.querySelector('.vb-mobile-tab-corner-right'),
                hasBottomCorner: !!firstCard.querySelector('.vb-mobile-tab-corner-bottom'),
                hasTitle: !!firstCard.querySelector('.vb-mobile-card-title')
              };
            }
            let isTwoColumn = false;
            if (cards.length >= 2) {
              const r0 = cards[0].getBoundingClientRect();
              const r1 = cards[1].getBoundingClientRect();
              isTwoColumn = Math.abs(r0.top - r1.top) < 5 && r1.left > r0.left;
            }
            return {
              cardCount: cards.length,
              showcaseHidden: showcaseStyle ? showcaseStyle.display === 'none' : true,
              hasMenuButton: !!menuBtn,
              menuButtonVisible: menuStyle ? menuStyle.display !== 'none' : false,
              navLinksVisible: navLinksStyle ? navLinksStyle.display !== 'none' : false,
              cardAspect,
              isSquare,
              tabCutout,
              isTwoColumn
            };
          })()
        `);

        assert(`${vp.name}: Mobile cards rendered (>= 1)`, nonDesktopInfo.cardCount > 0, `got ${nonDesktopInfo.cardCount}`);
        assert(`${vp.name}: Showcase is hidden on mobile/tablet`, nonDesktopInfo.showcaseHidden);
        const expectedAspect = nonDesktopInfo.isSquare ? 1.0 : 16 / 9;
        assert(
          `${vp.name}: Mobile card aspect ratio matches CSS (${nonDesktopInfo.isSquare ? '1:1' : '16:9'})`,
          nonDesktopInfo.cardAspect !== null && Math.abs(nonDesktopInfo.cardAspect - expectedAspect) <= 0.08,
          `got ${nonDesktopInfo.cardAspect}, expected ~${expectedAspect.toFixed(2)}`
        );

        if (vp.width >= 810) {
          // Tablet landscape (810px - 1199px)
          assert(`${vp.name}: Tablet project cards arranged in 2 columns`, nonDesktopInfo.isTwoColumn);
          assert(`${vp.name}: Tablet nav links are visible`, nonDesktopInfo.navLinksVisible);
          assert(`${vp.name}: Tablet menu button is hidden`, !nonDesktopInfo.menuButtonVisible);
        } else {
          // Mobile & tablet portrait (< 810px)
          assert(`${vp.name}: Mobile project cards arranged in 1 column`, !nonDesktopInfo.isTwoColumn);
          assert(`${vp.name}: Mobile nav links are hidden`, !nonDesktopInfo.navLinksVisible);
          assert(`${vp.name}: Mobile menu button is visible`, nonDesktopInfo.menuButtonVisible);
        }

        if (nonDesktopInfo.tabCutout) {
          assert(`${vp.name}: Card tab has right concave corner cutout`, nonDesktopInfo.tabCutout.hasRightCorner);
          assert(`${vp.name}: Card tab has bottom concave corner cutout`, nonDesktopInfo.tabCutout.hasBottomCorner);
          assert(`${vp.name}: Card tab has title`, nonDesktopInfo.tabCutout.hasTitle);
        }
      }
    }

    // Interactive tests:
    console.log('\n--- Interactive Tests ---');

    // 1. Mobile Menu Open / Close
    await client.send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 3,
      mobile: true,
    });
    await client.eval('window.scrollTo(0, 0)');
    await client.eval('new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)))');

    const initialMenuText = await client.eval(`
      document.querySelector('.vb-hero > .vb-menu span')?.textContent
    `);
    assert('Mobile menu initial text is Menu', initialMenuText === 'Menu', `got ${initialMenuText}`);

    // Click menu button
    await client.eval(`
      document.querySelector('.vb-hero > .vb-menu')?.click()
    `);
    await new Promise(r => setTimeout(r, 350));

    const openMenuState = await client.eval(`
      (() => {
        const portal = document.querySelector('.vb-menu-close-tab')?.closest('.fixed.inset-0') || document.querySelector('.vb-mobile-panel');
        const btn = document.querySelector('.vb-hero > .vb-menu');
        const links = portal ? Array.from(portal.querySelectorAll('a')) : [];
        return {
          isOpen: !!portal,
          btnText: btn?.querySelector('span')?.textContent,
          ariaExpanded: btn?.getAttribute('aria-expanded'),
          linkCount: links.length
        };
      })()
    `);
    assert('Menu modal/panel opens after clicking Menu', openMenuState.isOpen);
    assert('Menu button changes text to Close', openMenuState.btnText === 'Close', `got ${openMenuState.btnText}`);
    assert('aria-expanded is true', openMenuState.ariaExpanded === 'true');
    assert('Menu contains navigation links (>= 4 items)', openMenuState.linkCount >= 4, `got ${openMenuState.linkCount}`);

    // Click close tab
    await client.eval(`
      (document.querySelector('.vb-menu-close-tab') || document.querySelector('.vb-hero > .vb-menu'))?.click()
    `);
    await new Promise(r => setTimeout(r, 350));
    const closedMenuState = await client.eval(`
      (() => {
        const portal = document.querySelector('.vb-menu-close-tab')?.closest('.fixed.inset-0') || document.querySelector('.vb-mobile-panel');
        const btn = document.querySelector('.vb-hero > .vb-menu');
        return {
          isOpen: !!portal,
          btnText: btn?.querySelector('span')?.textContent,
          ariaExpanded: btn?.getAttribute('aria-expanded')
        };
      })()
    `);
    assert('Menu modal/panel unmounts after clicking Close', !closedMenuState.isOpen);
    assert('Menu button reverts text to Menu', closedMenuState.btnText === 'Menu');

    // 2. Day/Night Theme Toggle
    const initialTheme = await client.eval(`
      (() => {
        const hero = document.querySelector('.vb-hero');
        const btn = document.querySelector('.vb-hero > nav.vb-nav .vb-theme');
        return {
          theme: hero?.getAttribute('data-theme'),
          ariaPressed: btn?.getAttribute('aria-pressed')
        };
      })()
    `);

    await client.eval(`
      document.querySelector('.vb-hero > nav.vb-nav .vb-theme')?.click()
    `);
    await new Promise(r => setTimeout(r, 350));

    const toggledTheme = await client.eval(`
      (() => {
        const hero = document.querySelector('.vb-hero');
        const btn = document.querySelector('.vb-hero > nav.vb-nav .vb-theme');
        return {
          theme: hero?.getAttribute('data-theme'),
          ariaPressed: btn?.getAttribute('aria-pressed')
        };
      })()
    `);
    assert('Theme attribute toggled', toggledTheme.theme !== initialTheme.theme, `was ${initialTheme.theme}, now ${toggledTheme.theme}`);
    assert('aria-pressed toggled', toggledTheme.ariaPressed !== initialTheme.ariaPressed);

    // Toggle back to dark
    if (toggledTheme.theme !== 'dark') {
      await client.eval(`document.querySelector('.vb-hero > nav.vb-nav .vb-theme')?.click()`);
      await new Promise(r => setTimeout(r, 200));
    }

    // 3. Desktop Hover interaction
    await client.send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false,
    });
    await client.eval('window.scrollTo(0, 0)');
    await client.eval('new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)))');

    const initialDesktopState = await client.eval(`
      (() => {
        const activeLabel = document.querySelector('.vb-project-label span')?.textContent;
        const activeImg = document.querySelector('.vb-showcase img')?.getAttribute('src');
        return { activeLabel, activeImg };
      })()
    `);

    // Hover over the second project row using real CDP mouse move
    const row2Coords = await client.eval(`
      (() => {
        const rows = document.querySelectorAll('.vb-project-link-row');
        if (rows.length > 1) {
          const r = rows[1].getBoundingClientRect();
          return { x: Math.round(r.left + r.width / 2), y: Math.round(r.top + r.height / 2) };
        }
        return null;
      })()
    `);

    if (row2Coords) {
      await client.send('Input.dispatchMouseEvent', {
        type: 'mouseMoved',
        x: row2Coords.x,
        y: row2Coords.y,
      });
    } else {
      console.error('row2Coords is null');
    }
    await new Promise(r => setTimeout(r, 450));

    const hoveredDesktopState = await client.eval(`
      (() => {
        const activeLabel = document.querySelector('.vb-project-label span')?.textContent;
        const activeImg = document.querySelector('.vb-showcase img')?.getAttribute('src');
        const rows = document.querySelectorAll('.vb-project-link-row');
        const row1Active = rows[0]?.classList.contains('is-active');
        const row2Active = rows[1]?.classList.contains('is-active');
        return { activeLabel, activeImg, row1Active, row2Active };
      })()
    `);

    assert('Hovering project row 2 updates bottom-right project label', hoveredDesktopState.activeLabel !== initialDesktopState.activeLabel, `initial: ${initialDesktopState.activeLabel}, hovered: ${hoveredDesktopState.activeLabel}`);
    assert('Hovering project row 2 updates active class', hoveredDesktopState.row2Active && !hoveredDesktopState.row1Active);

    console.log(`\n========================================`);
    console.log(`Results: ${failureCount === 0 ? 'ALL ASSERTIONS PASSED' : `${failureCount} FAILURES DETECTED`}`);
    console.log(`========================================`);

    process.exitCode = failureCount === 0 ? 0 : 1;
  } finally {
    if (client) {
      try { client.close(); } catch {}
    }
    if (browserProc) {
      try {
        if (process.platform === 'win32' && browserProc.pid) {
          spawnSync('taskkill', ['/pid', String(browserProc.pid), '/f', '/t'], { stdio: 'ignore' });
        } else {
          browserProc.kill();
        }
      } catch {}
    }
    if (spawnedServerProc) {
      try {
        if (process.platform === 'win32' && spawnedServerProc.pid) {
          spawnSync('taskkill', ['/pid', String(spawnedServerProc.pid), '/f', '/t'], { stdio: 'ignore' });
        } else {
          spawnedServerProc.kill('SIGTERM');
        }
      } catch {}
    }
    try {
      fs.rmSync(USER_DATA_DIR, { recursive: true, force: true });
    } catch {}
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
