import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { getSharedBrowser, closeSharedBrowser, BrowserController } from './helpers/browser.ts';
import { ensureServer, stopServer } from './helpers/server.ts';
import { ROOT_DIR } from './helpers/test-utils.ts';

const ADVERSARIAL_VIEWPORTS = [
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
  { name: 'mobile-fold', width: 280, height: 653, dpr: 2 },
];

describe('Tier 5: Adversarial Coverage Hardening (16 Stress & DOM Robustness Tests)', () => {
  let browser: BrowserController;
  let baseUrl: string;

  before(async () => {
    baseUrl = await ensureServer(3000);
    browser = await getSharedBrowser(9226);
    await browser.navigate(`${baseUrl}/`);
    await browser.evaluate(`(() => { localStorage.clear(); localStorage.setItem('vb-theme', 'dark'); })()`);
  });

  after(async () => {
    await closeSharedBrowser();
    stopServer();
  });

  for (const vp of ADVERSARIAL_VIEWPORTS) {
    it(`E2E-T5-VP-${vp.name}: ${vp.width}x${vp.height} layout, pinned nav, corner cutouts & zero overflow on /projects`, async () => {
      try {
        await browser.setViewport({ width: vp.width, height: vp.height, deviceScaleFactor: vp.dpr, mobile: vp.width < 1024 });
        await browser.navigate(`${baseUrl}/projects`);
        await browser.evaluate('window.scrollTo(0, 0)');

        const navInfo = await browser.evaluate<{
          exists: boolean;
          position: string;
          top: string;
          left: string;
          zIndex: number;
          hasWordmark: boolean;
          hasTheme: boolean;
          hasCornerRight: boolean;
          hasCornerBottom: boolean;
          overflow: boolean;
        }>(`
          (() => {
            const el = document.querySelector('.vb-hero > nav.vb-nav[aria-label="Portfolio navigation"]');
            if (!el) return { exists: false, position: '', top: '', left: '', zIndex: 0, hasWordmark: false, hasTheme: false, hasCornerRight: false, hasCornerBottom: false, overflow: true };
            const s = window.getComputedStyle(el);
            return {
              exists: true,
              position: s.position,
              top: s.top,
              left: s.left,
              zIndex: parseInt(s.zIndex, 10) || 0,
              hasWordmark: !!el.querySelector('.vb-wordmark'),
              hasTheme: !!el.querySelector('.vb-theme'),
              hasCornerRight: !!el.querySelector('.vb-nav-corner-right'),
              hasCornerBottom: !!el.querySelector('.vb-nav-corner-bottom'),
              overflow: document.documentElement.scrollWidth > window.innerWidth + 1,
            };
          })()
        `);

        assert.strictEqual(navInfo.exists, true, `${vp.name}: nav.vb-nav missing`);
        assert.strictEqual(navInfo.position, 'fixed', `${vp.name}: nav must be fixed`);
        const expectedGap = vp.width >= 1600 ? '16px' : '12px';
        assert.strictEqual(navInfo.top, expectedGap, `${vp.name}: nav top expected ${expectedGap}, got ${navInfo.top}`);
        assert.strictEqual(navInfo.left, expectedGap, `${vp.name}: nav left expected ${expectedGap}, got ${navInfo.left}`);
        assert.ok(navInfo.zIndex >= 50, `${vp.name}: nav zIndex < 50`);
        assert.strictEqual(navInfo.hasWordmark && navInfo.hasTheme, true);
        assert.strictEqual(navInfo.hasCornerRight && navInfo.hasCornerBottom, true);
        assert.strictEqual(navInfo.overflow, false, `${vp.name}: horizontal overflow detected`);

        // Verify pinned after 800px scroll
        await browser.evaluate('window.scrollTo(0, 800)');
        await browser.evaluate<void>('new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)))');
        const scrolledTop = await browser.evaluate<number>(`document.querySelector('.vb-hero > nav.vb-nav').getBoundingClientRect().top`);
        const expectedNum = vp.width >= 1600 ? 16 : 12;
        assert.ok(Math.abs(scrolledTop - expectedNum) <= 1, `${vp.name}: nav drifted after 800px scroll (${scrolledTop} vs ${expectedNum})`);

        if (vp.width >= 1200) {
          const desktopOk = await browser.evaluate<boolean>(`
            (() => {
              const rows = document.querySelectorAll('.vb-project-link-row');
              const sc = document.querySelector('.vb-hero > .vb-showcase');
              return rows.length > 0 && !!sc && window.getComputedStyle(sc).display !== 'none';
            })()
          `);
          assert.strictEqual(desktopOk, true, `${vp.name}: desktop showcase/rows invalid`);
        } else {
          const mobileCardOk = await browser.evaluate<{ count: number; aspectOk: boolean; twoCol: boolean; menuVisible: boolean; navLinksVisible: boolean }>(`
            (() => {
              const cards = document.querySelectorAll('.vb-mobile-card');
              const first = cards[0];
              let aspectOk = false;
              if (first) {
                const r = first.getBoundingClientRect();
                const ratio = r.width / r.height;
                const expected = first.classList.contains('is-square') ? 1.0 : 16 / 9;
                aspectOk = Math.abs(ratio - expected) <= 0.1;
              }
              const twoCol = cards.length >= 2 && Math.abs(cards[0].getBoundingClientRect().top - cards[1].getBoundingClientRect().top) < 5;
              const menuBtn = document.querySelector('.vb-hero > .vb-menu');
              const navLinks = document.querySelector('.vb-hero > nav.vb-nav .vb-nav-links');
              return {
                count: cards.length,
                aspectOk,
                twoCol,
                menuVisible: menuBtn ? window.getComputedStyle(menuBtn).display !== 'none' : false,
                navLinksVisible: navLinks ? window.getComputedStyle(navLinks).display !== 'none' : false,
              };
            })()
          `);
          assert.ok(mobileCardOk.count > 0 && mobileCardOk.aspectOk, `${vp.name}: mobile/tablet cards or aspect ratio broken`);
          if (vp.width >= 810) {
            assert.strictEqual(mobileCardOk.twoCol, true, `${vp.name}: tablet should be 2 columns`);
            assert.strictEqual(mobileCardOk.navLinksVisible, true, `${vp.name}: tablet nav links should be visible`);
          } else {
            assert.strictEqual(mobileCardOk.twoCol, false, `${vp.name}: mobile should be 1 column`);
            assert.strictEqual(mobileCardOk.menuVisible, true, `${vp.name}: mobile menu button should be visible`);
          }
        }
      } finally {
        await browser.setViewport({ width: 1440, height: 900, mobile: false });
      }
    });
  }

  it('E2E-T5-SVG-01: StudioIcons.tsx exact mathematical cubic-bezier inverted corner SVG paths remain intact', () => {
    const src = fs.readFileSync(path.join(ROOT_DIR, 'src/components/ui/StudioIcons.tsx'), 'utf-8');
    const requiredPaths = [
      'M 0 0 L 0 18 C 0 8.059 8.059 0 18 0 Z',
      'M 18 18 L 18 0 C 18 9.941 9.941 18 0 18 Z',
      'M 18 18 L 0 18 C 9.941 18 18 9.941 18 0 Z',
      'M 18 0 L 0 0 C 9.941 0 18 8.059 18 18 Z',
      'M 0 18 L 0 0 C 0 9.941 8.059 18 18 18 Z',
    ];
    for (const p of requiredPaths) {
      assert.ok(src.includes(p), `Missing/modified inverted corner SVG path: ${p}`);
    }
  });

  it('E2E-T5-STRESS-02: Rapid theme toggling and desktop project hover stress test without errors', async () => {
    browser.clearPageErrors();
    await browser.setViewport({ width: 1440, height: 900, mobile: false });
    await browser.navigate(`${baseUrl}/projects`);

    for (let i = 0; i < 4; i++) {
      await browser.click('.vb-theme', 0);
    }
    const finalTheme = await browser.getAttribute('html', 'data-theme');
    assert.strictEqual(finalTheme, 'dark');

    const initialLabel = await browser.getText('.vb-project-label span');
    const row2 = await browser.evaluate<{ x: number; y: number } | null>(`
      (() => {
        const rows = document.querySelectorAll('.vb-project-link-row');
        if (rows.length < 2) return null;
        const r = rows[1].getBoundingClientRect();
        return { x: Math.round(r.left + r.width / 2), y: Math.round(r.top + r.height / 2) };
      })()
    `);
    assert.ok(row2, 'Expected >= 2 project link rows');
    await browser.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: row2.x, y: row2.y });
    await browser.waitForCondition(`document.querySelector('.vb-project-label span')?.textContent !== ${JSON.stringify(initialLabel)}`);
    assert.deepStrictEqual(browser.getPageErrors(), []);
  });
});
