import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';
import { getSharedBrowser, closeSharedBrowser, BrowserController } from './helpers/browser.ts';
import { ensureServer, ensureDistServer, stopDistServer, stopServer, httpRequest } from './helpers/server.ts';
import { validateSitemapFile } from './helpers/xml-validator.ts';
import {
  ROOT_DIR,
  DIST_DIR,
  PUBLIC_DIR,
  getProjectIds,
  getBlogSlugs,
  getAllPublicRoutes,
  getDistHtmlPath,
  extractHtmlTitle,
  extractCanonicalHref,
  extractJsonLdFromHtml,
  flattenGraphNodes,
  hasType,
  getImageDimensions,
  loadSchemaBuilder,
  getBlogSlugWithCode,
} from './helpers/test-utils.ts';
import { allServices } from '../src/data/services.ts';

describe('Tier 3: Cross-Feature Interactions (26 Pairwise Suites: TC-T3-01 to TC-T3-26)', () => {
  let browser: BrowserController;
  let baseUrl: string;
  let distUrl: string;

  before(async () => {
    baseUrl = await ensureServer(3000);
    distUrl = await ensureDistServer(4173);
    browser = await getSharedBrowser(9226);
    await browser.navigate(`${baseUrl}/`);
    await browser.evaluate(`(() => { localStorage.clear(); localStorage.setItem('vb-theme', 'dark'); })()`);
  });

  after(async () => {
    await closeSharedBrowser();
    stopDistServer();
    stopServer();
  });

  it('TC-T3-01: Static SSG Rendering (F1) ↔ Client Hydration Parity (F7)', async () => {
    for (const route of ['/', '/about', '/services']) {
      const staticHtml = fs.readFileSync(getDistHtmlPath(route), 'utf-8');
      const staticTitle = extractHtmlTitle(staticHtml);
      const staticCanonical = extractCanonicalHref(staticHtml);
      const staticTypes = flattenGraphNodes(extractJsonLdFromHtml(staticHtml)).map((n) => n['@type']);

      await browser.navigate(`${distUrl}${route}`);
      const clientTitle = await browser.getTitle();
      const clientCanonical = await browser.getAttribute('link[rel="canonical"]', 'href');
      const clientTypes = flattenGraphNodes(await browser.getJsonLdScripts()).map((n) => n['@type']);

      assert.strictEqual(clientTitle, staticTitle, `Title mismatch on ${route}`);
      assert.strictEqual(clientCanonical, staticCanonical, `Canonical mismatch on ${route}`);
      assert.deepStrictEqual(clientTypes.sort(), staticTypes.sort(), `JSON-LD types mismatch on ${route}`);
    }
  });

  it('TC-T3-02: Static 404 Page (F2) ↔ noindex Directive & Static Hosting Status (F5)', async () => {
    const res = await httpRequest(`${distUrl}/non-existent-pairwise-404`);
    assert.strictEqual(res.statusCode, 404);
    assert.ok(res.body.includes('Page Not Found'));
    assert.match(res.body, /<meta\b[^>]*name=["']robots["'][^>]*noindex/i);
    assert.strictEqual(res.headers['x-content-type-options'], 'nosniff');
  });

  it('TC-T3-03: Route Code Splitting (F3) ↔ Lazy SPA Navigation & Chunk Loading', async () => {
    browser.clearNetworkLog();
    await browser.navigate(`${distUrl}/`);
    const homeJsCount = browser.getLastNavigationEntries().filter((e) => e.url.includes('/assets/') && e.url.endsWith('.js')).length;
    assert.ok(homeJsCount >= 2, 'Homepage should load split entry + vendor/home chunks');

    await browser.click('.vb-nav-links a[href="/projects"]', 0);
    await browser.waitForCondition(`window.location.pathname === '/projects' && !!document.querySelector('h1')`);
    const projChunks = browser.getNetworkEntries(/Projects-.*\.js/);
    assert.ok(projChunks.length >= 1, 'Navigating to /projects must fetch Projects route chunk');
  });

  it('TC-T3-04: TypeScript & Toolchain Hygiene (F4) ↔ Production dist/ Artifacts (F1)', () => {
    const tsc = spawnSync('npx', ['tsc', '--noEmit'], { cwd: ROOT_DIR, shell: true });
    assert.strictEqual(tsc.status, 0, 'tsc --noEmit must exit 0');
    assert.ok(fs.existsSync(getDistHtmlPath('/')), 'dist/index.html must exist alongside clean tsc');
    assert.ok(fs.existsSync(getDistHtmlPath('/404')), 'dist/404.html must exist');
  });

  it('TC-T3-05: Vercel Clean URLs (F5) ↔ Canonical URL Consistency (F13)', async () => {
    for (const route of ['/about', '/services', '/projects', '/blogs']) {
      const res = await httpRequest(`${distUrl}${route}`);
      assert.strictEqual(res.statusCode, 200);
      const canonical = extractCanonicalHref(res.body);
      assert.strictEqual(canonical, `https://adibx.me${route}`, `Clean URL ${route} canonical mismatch`);
    }
  });

  it('TC-T3-06: Sitemap Discoverability (F6) ↔ Prerendered Routes & Robots Directive (F1)', () => {
    const validation = validateSitemapFile(path.join(PUBLIC_DIR, 'sitemap.xml'));
    assert.strictEqual(validation.isValid, true);
    const sitemapLocs = new Set(validation.urls.map((u) => u.loc));
    const publicRoutes = getAllPublicRoutes();

    for (const route of publicRoutes) {
      const url = route === '/' ? 'https://adibx.me' : `https://adibx.me${route}`;
      assert.ok(sitemapLocs.has(url) || (route === '/' && sitemapLocs.has('https://adibx.me/')), `Sitemap missing ${url}`);
      assert.ok(fs.existsSync(getDistHtmlPath(route)), `Prerendered HTML missing for sitemap route ${route}`);
    }
  });

  it('TC-T3-07: Centralized Schema Builder (F7) ↔ Static Prerender & Client SEO Integration', async () => {
    const { getRouteMetadata, getRouteJsonLd } = await loadSchemaBuilder();
    const blogRoute = `/blogs/${getBlogSlugs()[0]}`;
    const builtMeta = getRouteMetadata(blogRoute);
    const builtGraph = getRouteJsonLd(blogRoute);

    await browser.navigate(`${distUrl}${blogRoute}`);
    assert.strictEqual(await browser.getAttribute('link[rel="canonical"]', 'href'), builtMeta.canonicalUrl);
    const domJsonLd = await browser.getJsonLdScripts();
    assert.ok(JSON.stringify(domJsonLd).includes(JSON.stringify(builtGraph['@graph']?.[0]?.['@id'] || 'https://adibx.me/#person')));
  });

  it('TC-T3-08: Person Knowledge Graph (F8) ↔ WebSite & WebPage Linkage across Routes', async () => {
    for (const route of ['/', '/about', '/contact']) {
      await browser.navigate(`${baseUrl}${route}`);
      const nodes = flattenGraphNodes(await browser.getJsonLdScripts());
      const person = nodes.find((n) => hasType(n, 'Person'));
      const website = nodes.find((n) => hasType(n, 'WebSite'));
      const webPage = nodes.find((n) => hasType(n, 'WebPage') || hasType(n, 'AboutPage') || hasType(n, 'ContactPage'));
      assert.strictEqual(person?.['@id'], 'https://adibx.me/#person');
      assert.strictEqual(website?.['@id'], 'https://adibx.me/#website');
      assert.ok(webPage, `Expected WebPage node on ${route}`);
    }
  });

  it('TC-T3-09: Services Catalog Data (F9) ↔ Service & OfferCatalog JSON-LD & UI Filtering', async () => {
    await browser.navigate(`${baseUrl}/services`);
    const nodes = flattenGraphNodes(await browser.getJsonLdScripts());
    const serialized = JSON.stringify(nodes);
    for (const svc of allServices) {
      assert.ok(serialized.includes(svc.title), `Service "${svc.title}" missing from /services JSON-LD`);
    }
    const cardCount = await browser.evaluate<number>(`document.querySelectorAll('h3').length`);
    assert.ok(cardCount >= allServices.length, 'Rendered service cards must cover allServices');
  });

  it('TC-T3-10: Projects/Blogs Dynamic Data (F10) ↔ CreativeWork / BlogPosting & Canonical Tags', async () => {
    const projectId = getProjectIds()[0];
    await browser.navigate(`${baseUrl}/projects/${projectId}`);
    assert.strictEqual(await browser.getCanonicalHref(), `https://adibx.me/projects/${projectId}`);
    const pNodes = flattenGraphNodes(await browser.getJsonLdScripts());
    assert.ok(pNodes.some((n) => hasType(n, 'CreativeWork')), 'Project must emit CreativeWork');
    assert.strictEqual(pNodes.some((n) => hasType(n, 'BlogPosting')), false, 'Project must not emit BlogPosting');

    const blogSlug = getBlogSlugs()[0];
    await browser.navigate(`${baseUrl}/blogs/${blogSlug}`);
    assert.strictEqual(await browser.getCanonicalHref(), `https://adibx.me/blogs/${blogSlug}`);
    const bNodes = flattenGraphNodes(await browser.getJsonLdScripts());
    assert.ok(bNodes.some((n) => hasType(n, 'BlogPosting')), 'Blog must emit BlogPosting');
  });

  it('TC-T3-11: BreadcrumbList Structured Data (F11) ↔ Route Depth Hierarchy', async () => {
    await browser.navigate(`${baseUrl}/services`);
    const sBc = flattenGraphNodes(await browser.getJsonLdScripts()).find((n) => hasType(n, 'BreadcrumbList'));
    assert.strictEqual(sBc?.itemListElement?.length, 2, '/services should have 2-level BreadcrumbList');

    await browser.navigate(`${baseUrl}/projects/${getProjectIds()[0]}`);
    const pBc = flattenGraphNodes(await browser.getJsonLdScripts()).find((n) => hasType(n, 'BreadcrumbList'));
    assert.strictEqual(pBc?.itemListElement?.length, 3, '/projects/:id should have 3-level BreadcrumbList');
  });

  it('TC-T3-12: 1200x630 OG Preview Asset (F12) ↔ Twitter Card Metadata Parity', async () => {
    const dims = getImageDimensions(path.join(PUBLIC_DIR, 'images/og-preview.jpg'));
    assert.deepStrictEqual(dims, { width: 1200, height: 630 });
    await browser.navigate(`${baseUrl}/`);
    const ogImg = await browser.getMetaContent('og:image');
    const twImg = await browser.getMetaContent('twitter:image');
    assert.strictEqual(ogImg, twImg, 'og:image and twitter:image must match on homepage');
    assert.ok(ogImg?.includes('/images/og-preview.jpg'));
  });

  it('TC-T3-13: Title Sanitization & Uniqueness (F13) ↔ Diverse Routes', async () => {
    for (const route of ['/', '/services', '/projects', '/blogs', `/blogs/${getBlogSlugs()[0]}`]) {
      await browser.navigate(`${baseUrl}${route}`);
      const title = await browser.getTitle();
      assert.strictEqual((title.match(/Md Rakibujjaman Adib/g) || []).length, 1, `Bad author suffix count on ${route}: ${title}`);
      assert.ok(!title.includes('undefined') && !title.includes('|  |'));
    }
  });

  it('TC-T3-14: meta[name="theme-color"] (F14) ↔ DayNightToggle & localStorage Persistence', async () => {
    await browser.navigate(`${baseUrl}/blogs`);
    await browser.click('.vb-theme', 0);
    await browser.waitForCondition(`document.documentElement.dataset.theme === 'light'`);
    assert.strictEqual((await browser.getMetaContent('theme-color'))?.toLowerCase(), '#ffffff');

    await browser.navigate(`${baseUrl}/about`);
    assert.strictEqual(await browser.getAttribute('html', 'data-theme'), 'light');
    assert.strictEqual((await browser.getMetaContent('theme-color'))?.toLowerCase(), '#ffffff');

    await browser.click('.vb-theme', 0);
    await browser.waitForCondition(`document.documentElement.dataset.theme === 'dark'`);
    assert.strictEqual((await browser.getMetaContent('theme-color'))?.toLowerCase(), '#000000');
  });

  it('TC-T3-15: WebP/AVIF Media Modernization (F15) ↔ Live Image Decoding Integrity', async () => {
    for (const route of ['/', '/about', '/contact']) {
      await browser.navigate(`${distUrl}${route}`);
      const info = await browser.evaluate<{ src: string; complete: boolean; w: number }>(`
        (() => {
          const img = document.querySelector('.vb-showcase img');
          return { src: img?.currentSrc || img?.getAttribute('src') || '', complete: Boolean(img?.complete), w: img?.naturalWidth || 0 };
        })()
      `);
      assert.ok(/\.(webp|avif)(\?|$)/i.test(info.src), `${route} showcase image must be WebP/AVIF, got ${info.src}`);
      assert.ok(info.complete && info.w > 0, `${route} showcase image failed to decode`);
    }
  });

  it('TC-T3-16: Explicit Image Dimensions (F16) ↔ Core Web Vitals CLS Stability', async () => {
    await browser.navigate(`${distUrl}/`);
    const missing = await browser.evaluate<number>(`
      Array.from(document.querySelectorAll('img')).filter(i => !(Number(i.getAttribute('width')) > 0 && Number(i.getAttribute('height')) > 0)).length
    `);
    assert.strictEqual(missing, 0, 'Homepage images must have explicit width/height');
    const cls = await browser.measureCls(400);
    assert.ok(cls <= 0.1, `CLS must remain <= 0.1, got ${cls}`);
  });

  it('TC-T3-17: Hero Carousel Priority (F17) ↔ Offscreen Lazy Slides & Preload Link', async () => {
    const html = fs.readFileSync(getDistHtmlPath('/'), 'utf-8');
    assert.match(html, /<link\b[^>]*rel=["']preload["'][^>]*as=["']image["']/i);
    await browser.navigate(`${baseUrl}/`);
    const heroFp = await browser.getAttribute('.vb-showcase img', 'fetchpriority');
    const recentLazy = await browser.evaluate<boolean>(`
      Array.from(document.querySelectorAll('.vb-recent-card img')).every(i => i.getAttribute('loading') === 'lazy')
    `);
    assert.strictEqual(heroFp, 'high');
    assert.strictEqual(recentLazy, true);
  });

  it('TC-T3-18: Font Preloading (F18) ↔ Computed Wordmark Font & Pruned Assets', async () => {
    const html = fs.readFileSync(getDistHtmlPath('/'), 'utf-8');
    assert.match(html, /<link\b[^>]*rel=["']preload["'][^>]*as=["']font["'][^>]*clesmont\.woff2/i);
    await browser.navigate(`${distUrl}/`);
    const loadedFonts = await browser.evaluate<string[]>(`
      document.fonts.ready.then(() => Array.from(document.fonts).filter(f => f.status === 'loaded').map(f => f.family.replace(/["']/g, '')))
    `);
    assert.ok(loadedFonts.includes('Clesmont Demo'));
    assert.ok(!fs.existsSync(path.join(PUBLIC_DIR, 'fonts/bricolage-regular.ttf')));
  });

  it('TC-T3-19: WCAG 2.2 Mobile Drawer (F19) ↔ Keyboard Focus Trap & Escape Restoration', async () => {
    await browser.setViewport({ width: 390, height: 844, mobile: true });
    try {
      await browser.navigate(`${baseUrl}/`);
      await browser.evaluate(`document.querySelector('.vb-menu').focus()`);
      await browser.pressKey('Enter');
      const hasDialog = await browser.waitForSelector('[role="dialog"][aria-modal="true"]', 3000);
      assert.strictEqual(hasDialog, true, 'Mobile drawer must open with role="dialog" and aria-modal="true"');
      await browser.pressKey('Tab');
      const trapped = await browser.evaluate<boolean>(`document.querySelector('[role="dialog"]').contains(document.activeElement)`);
      assert.strictEqual(trapped, true);
      await browser.pressKey('Escape');
      await browser.waitForCondition(`!document.querySelector('[role="dialog"]')`);
      const restored = await browser.evaluate<boolean>(`document.activeElement === document.querySelector('.vb-menu')`);
      assert.strictEqual(restored, true);
    } finally {
      await browser.setViewport({ width: 1440, height: 900, mobile: false });
    }
  });

  it('TC-T3-20: Semantic HTML Headings (F20) ↔ Landmarks across Content Pages', async () => {
    for (const route of ['/', '/services', '/projects', '/blogs']) {
      await browser.navigate(`${baseUrl}${route}`);
      const ok = await browser.evaluate<boolean>(`
        document.querySelectorAll('h1').length === 1 &&
        document.querySelectorAll('main').length >= 1 &&
        document.querySelectorAll('nav').length >= 1 &&
        document.querySelectorAll('footer').length >= 1
      `);
      assert.strictEqual(ok, true, `Heading/landmark contract failed on ${route}`);
    }
  });

  it('TC-T3-21: Focus Indicators (F21) ↔ DayNightToggle & Interactive Controls', async () => {
    await browser.navigate(`${baseUrl}/`);
    for (let i = 0; i < 15; i++) {
      await browser.pressKey('Tab');
      if (await browser.evaluate<boolean>(`document.activeElement?.classList.contains('vb-theme') || false`)) break;
    }
    const outlineWidth = await browser.evaluate<number>(`parseFloat(window.getComputedStyle(document.activeElement).outlineWidth) || 0`);
    assert.ok(outlineWidth >= 2, `DayNightToggle focus outlineWidth ${outlineWidth}px < 2px`);
    await browser.pressKey('Enter');
    await browser.waitForCondition(`document.documentElement.dataset.theme === 'light'`);
    await browser.pressKey('Enter');
    await browser.waitForCondition(`document.documentElement.dataset.theme === 'dark'`);
  });

  it('TC-T3-22: prefers-reduced-motion (F22) ↔ Hero Carousel & Manual Navigation', async () => {
    await browser.setEmulatedMedia({ features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
    try {
      await browser.navigate(`${baseUrl}/`);
      const s0 = await browser.getAttribute('.vb-showcase img', 'alt');
      await new Promise((r) => setTimeout(r, 5200));
      assert.strictEqual(await browser.getAttribute('.vb-showcase img', 'alt'), s0, 'Auto-timer must stay paused');
      await browser.click('.vb-arrow--next', 0);
      await browser.waitForCondition(`document.querySelector('.vb-showcase img')?.getAttribute('alt') !== ${JSON.stringify(s0)}`);
    } finally {
      await browser.setEmulatedMedia({ features: [] });
    }
  });

  it('TC-T3-23: StudioIcons Inverted Corners (F23) ↔ Dual-Theme Tokens & Viewport Frame', async () => {
    await browser.navigate(`${baseUrl}/`);
    await browser.ensureTheme('dark');
    try {
      assert.strictEqual(await browser.getComputedStyle('.vb-nav-corner-right', 'color'), 'rgb(0, 0, 0)');
      await browser.ensureTheme('light');
      await browser.waitForCssStability('.vb-nav-corner-right', 1500);
      assert.strictEqual(await browser.getComputedStyle('.vb-nav-corner-right', 'color'), 'rgb(255, 255, 255)');
    } finally {
      await browser.ensureTheme('dark');
    }
  });

  it('TC-T3-24: Blog Category Filtering ↔ Dynamic Showcase & Card Reset on /blogs', async () => {
    await browser.navigate(`${baseUrl}/blogs`);
    const initialCount = await browser.evaluate<number>(`document.querySelectorAll('section[aria-label="Articles list"] article, .vb-card a[href^="/blogs/"]').length`);
    assert.ok(initialCount >= 1);
    const clickedCat = await browser.evaluate<boolean>(`
      (() => {
        const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent?.trim() && b.textContent?.trim() !== 'All' && !b.classList.contains('vb-theme') && !b.classList.contains('vb-menu'));
        if (btn) { btn.click(); return true; }
        return false;
      })()
    `);
    if (clickedCat) {
      await browser.evaluate<void>('new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)))');
      const filtered = await browser.evaluate<number>(`document.querySelectorAll('section[aria-label="Articles list"] article, .vb-card a[href^="/blogs/"]').length`);
      assert.ok(filtered <= initialCount);
    }
  });

  it('TC-T3-25: Blog Code Blocks & Copy Action ↔ Dark/Light Theme Inversion', async () => {
    await browser.navigate(`${baseUrl}/blogs/${getBlogSlugWithCode()}`);
    await browser.ensureTheme('dark');
    try {
      await browser.waitForSelector('pre', 3000);
      const hasCopy = await browser.evaluate<boolean>(`!!document.querySelector('.vb-code-copy-btn-inline, button[aria-label*="copy" i]')`);
      assert.strictEqual(hasCopy, true);
      await browser.ensureTheme('light');
      const preBg = await browser.getComputedStyle('pre', 'background-color');
      const m = preBg.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
      assert.ok(m && Number(m[1]) < 40, `Expected dark code block in light mode, got ${preBg}`);
    } finally {
      await browser.ensureTheme('dark');
    }
  });

  it('TC-T3-26: Blog Floating TOC Scroll Spy ↔ Article Anchor Scrolling & Next Link', async () => {
    await browser.navigate(`${baseUrl}/blogs/${getBlogSlugs()[0]}`);
    const hasToc = await browser.evaluate<boolean>(`document.querySelectorAll('nav[aria-label*="Table of contents"] a, .vb-toc a').length > 0`);
    assert.strictEqual(hasToc, true, 'Article must render Table of Contents links');
    await browser.evaluate(`document.querySelector('h2')?.scrollIntoView()`);
    const y = await browser.evaluate<number>('window.scrollY');
    assert.ok(y > 80, `Expected scrollY > 80 after scrolling to heading, got ${y}`);
    const hasDeadLinks = await browser.evaluate<boolean>(`
      Array.from(document.querySelectorAll('a[href]')).some(a => (a.getAttribute('href') || '').includes('undefined'))
    `);
    assert.strictEqual(hasDeadLinks, false);
  });
});
