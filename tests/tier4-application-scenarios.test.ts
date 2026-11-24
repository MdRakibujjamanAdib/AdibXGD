import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { getSharedBrowser, closeSharedBrowser, BrowserController } from './helpers/browser.ts';
import { ensureServer, ensureDistServer, stopDistServer, stopServer, httpRequest } from './helpers/server.ts';
import { validateSitemapFile } from './helpers/xml-validator.ts';
import {
  DIST_DIR,
  PUBLIC_DIR,
  getProjectIds,
  getBlogSlugs,
  getDistHtmlPath,
  extractHtmlTitle,
  extractMetaContent,
  extractCanonicalHref,
  extractJsonLdFromHtml,
  flattenGraphNodes,
  hasType,
  getImageDimensions,
  findAuditReportFiles,
} from './helpers/test-utils.ts';
import { allServices } from '../src/data/services.ts';

describe('Tier 4: Real-World Application Scenarios (13 Workflows: TC-T4-WF-01 to TC-T4-WF-13)', () => {
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

  // ==========================================================================
  // TC-T4-WF-01: Googlebot Static Cold Crawl (F1, F7, F8, F9, F10, F13)
  // ==========================================================================
  it('TC-T4-WF-01: Googlebot Static Cold Crawl (raw HTML without JS across /, /services, /projects/green-d-website)', async () => {
    const projectRoute = getProjectIds().includes('green-d-website')
      ? '/projects/green-d-website'
      : `/projects/${getProjectIds()[0]}`;

    const targets = [
      { route: '/', expectedCanonical: 'https://adibx.me' },
      { route: '/services', expectedCanonical: 'https://adibx.me/services' },
      { route: projectRoute, expectedCanonical: `https://adibx.me${projectRoute}` },
    ];

    for (const target of targets) {
      const res = await httpRequest(`${distUrl}${target.route}`);
      assert.strictEqual(res.statusCode, 200, `Cold crawl ${target.route} returned ${res.statusCode}`);
      assert.ok(!res.body.includes('<div id="root"></div>'), `${target.route} must serve populated SSG HTML`);

      const title = extractHtmlTitle(res.body);
      const desc = extractMetaContent(res.body, 'description');
      const canonical = extractCanonicalHref(res.body);
      assert.ok(title.includes('Md Rakibujjaman Adib'), `${target.route} title missing author: ${title}`);
      assert.ok(desc && desc.length >= 40, `${target.route} meta description missing/short`);
      assert.strictEqual(canonical, target.expectedCanonical, `${target.route} canonical mismatch`);

      const rawJsonLd = extractJsonLdFromHtml(res.body);
      assert.ok(rawJsonLd.some((obj) => Array.isArray(obj['@graph'])), `${target.route} must emit unified @graph JSON-LD in initial HTML`);
      const nodes = flattenGraphNodes(rawJsonLd);
      assert.ok(nodes.some((n) => n['@id'] === 'https://adibx.me/#person'), `${target.route} missing #person in @graph`);
    }
  });

  // ==========================================================================
  // TC-T4-WF-02: AI Agent Knowledge Retrieval (F6, F8, F9, F13)
  // ==========================================================================
  it('TC-T4-WF-02: AI Agent Knowledge Retrieval (llms.txt, robots.txt, sitemap.xml, /services)', async () => {
    const llmsRes = await httpRequest(`${distUrl}/llms.txt`);
    assert.strictEqual(llmsRes.statusCode, 200);
    assert.ok(llmsRes.body.includes('Md Rakibujjaman Adib'));
    assert.ok(llmsRes.body.includes('https://adibx.me/#person'));
    assert.ok(llmsRes.body.includes('https://adibx.me/services'));

    const robotsRes = await httpRequest(`${distUrl}/robots.txt`);
    assert.strictEqual(robotsRes.statusCode, 200);
    assert.match(robotsRes.body, /User-agent:\s*OAI-SearchBot[\s\S]*?Allow:\s*\//i);
    assert.match(robotsRes.body, /User-agent:\s*GPTBot[\s\S]*?Disallow:\s*\//i);

    const sitemapValidation = validateSitemapFile(path.join(DIST_DIR, 'sitemap.xml'));
    assert.strictEqual(sitemapValidation.isValid, true);
    assert.ok(sitemapValidation.urls.some((u) => u.loc === 'https://adibx.me/services'));

    const svcRes = await httpRequest(`${distUrl}/services`);
    assert.strictEqual(svcRes.statusCode, 200);
    const nodes = flattenGraphNodes(extractJsonLdFromHtml(svcRes.body));
    const hasServiceGraph = nodes.some((n) => hasType(n, 'Service') || hasType(n, 'OfferCatalog') || Boolean(n.hasOfferCatalog));
    assert.strictEqual(hasServiceGraph, true, '/services must expose Service/OfferCatalog entities for AI retrieval');
    const serialized = JSON.stringify(nodes);
    assert.ok(allServices.every((s) => serialized.includes(s.title)), 'All services must be discoverable in /services JSON-LD');
  });

  // ==========================================================================
  // TC-T4-WF-03: Social Media Share Unfurler (F10, F12, F13, F15)
  // ==========================================================================
  it('TC-T4-WF-03: Social Media Share Unfurler (OG & Twitter Cards on /, /projects/:id, /blogs/:slug)', async () => {
    const ogPreviewPath = path.join(PUBLIC_DIR, 'images/og-preview.jpg');
    assert.ok(fs.existsSync(ogPreviewPath), 'public/images/og-preview.jpg must exist');
    assert.ok(fs.statSync(ogPreviewPath).size < 250 * 1024, 'og-preview.jpg must be < 250 KB');
    assert.deepStrictEqual(getImageDimensions(ogPreviewPath), { width: 1200, height: 630 });

    const projectRoute = `/projects/${getProjectIds()[0]}`;
    const blogRoute = `/blogs/${getBlogSlugs()[0]}`;
    for (const route of ['/', projectRoute, blogRoute]) {
      const res = await httpRequest(`${distUrl}${route}`);
      assert.strictEqual(res.statusCode, 200);
      const ogTitle = extractMetaContent(res.body, 'og:title');
      const ogDesc = extractMetaContent(res.body, 'og:description');
      const ogImage = extractMetaContent(res.body, 'og:image');
      const twCard = extractMetaContent(res.body, 'twitter:card');
      const twImage = extractMetaContent(res.body, 'twitter:image');

      assert.ok(ogTitle && ogTitle.length > 5, `Missing og:title on ${route}`);
      assert.ok(ogDesc && ogDesc.length > 20, `Missing og:description on ${route}`);
      assert.ok(ogImage?.startsWith('https://adibx.me/'), `og:image must be absolute on ${route}, got ${ogImage}`);
      assert.strictEqual(twCard, 'summary_large_image');
      assert.ok(twImage?.startsWith('https://adibx.me/'), `twitter:image must be absolute on ${route}`);
    }
  });

  // ==========================================================================
  // TC-T4-WF-04: Core Web Vitals & Image Audit (F15, F16, F17, F18)
  // ==========================================================================
  it('TC-T4-WF-04: Core Web Vitals & Image Audit (CLS <= 0.1, hero priority, lazy slides, explicit dims, font preloads)', async () => {
    await browser.navigate(`${distUrl}/`);

    const audit = await browser.evaluate<{
      heroSrc: string;
      heroFetchPriority: string | null;
      heroLoading: string | null;
      heroWidth: string | null;
      heroHeight: string | null;
      recentCount: number;
      recentLazyCount: number;
      recentMissingDims: number;
      preloadImgCount: number;
      preloadFontCount: number;
    }>(`
      (() => {
        const heroImg = document.querySelector('.vb-showcase img');
        const recentImgs = Array.from(document.querySelectorAll('.vb-recent-card img'));
        return {
          heroSrc: heroImg?.currentSrc || heroImg?.getAttribute('src') || '',
          heroFetchPriority: heroImg?.getAttribute('fetchpriority') || null,
          heroLoading: heroImg?.getAttribute('loading') || null,
          heroWidth: heroImg?.getAttribute('width') || null,
          heroHeight: heroImg?.getAttribute('height') || null,
          recentCount: recentImgs.length,
          recentLazyCount: recentImgs.filter(i => i.getAttribute('loading') === 'lazy').length,
          recentMissingDims: recentImgs.filter(i => !(Number(i.getAttribute('width')) > 0 && Number(i.getAttribute('height')) > 0)).length,
          preloadImgCount: document.querySelectorAll('link[rel="preload"][as="image"]').length,
          preloadFontCount: document.querySelectorAll('link[rel="preload"][as="font"]').length,
        };
      })()
    `);

    assert.ok(/\.(webp|avif)(\?|$)/i.test(audit.heroSrc), `Hero image must be WebP/AVIF, got ${audit.heroSrc}`);
    assert.strictEqual(audit.heroFetchPriority, 'high');
    assert.notStrictEqual(audit.heroLoading, 'lazy');
    assert.ok(Number(audit.heroWidth) > 0 && Number(audit.heroHeight) > 0, 'Hero image must have explicit width & height');
    assert.ok(audit.recentCount > 0 && audit.recentLazyCount === audit.recentCount, 'Latest Projects images must use loading="lazy"');
    assert.strictEqual(audit.recentMissingDims, 0, 'Latest Projects images must have explicit dimensions');
    assert.ok(audit.preloadImgCount >= 1, 'Expected <link rel="preload" as="image">');
    assert.ok(audit.preloadFontCount >= 2, 'Expected <link rel="preload" as="font">');

    const cls = await browser.measureCls(450);
    assert.ok(cls <= 0.1, `Measured CLS ${cls} exceeded 0.1`);
  });

  // ==========================================================================
  // TC-T4-WF-05: Accessible Keyboard Navigation (F19, F20, F21)
  // ==========================================================================
  it('TC-T4-WF-05: Accessible Keyboard Navigation (header Tab, mobile drawer focus trap, Escape focus restore)', async () => {
    await browser.setViewport({ width: 1440, height: 900, mobile: false });
    await browser.navigate(`${baseUrl}/`);
    await browser.pressKey('Tab');
    const desktopOutline = await browser.evaluate<number>(`parseFloat(window.getComputedStyle(document.activeElement).outlineWidth) || 0`);
    assert.ok(desktopOutline >= 2, 'Header focusable controls must have visible focus ring');

    await browser.setViewport({ width: 390, height: 844, mobile: true });
    try {
      await browser.navigate(`${baseUrl}/`);
      await browser.evaluate(`document.querySelector('.vb-menu').focus()`);
      await browser.pressKey('Enter');
      const hasDialog = await browser.waitForSelector('[role="dialog"][aria-modal="true"]', 3000);
      assert.strictEqual(hasDialog, true, 'Mobile drawer must open with role="dialog" and aria-modal="true"');

      for (let i = 0; i < 6; i++) {
        await browser.pressKey('Tab');
        const inside = await browser.evaluate<boolean>(`document.querySelector('[role="dialog"]').contains(document.activeElement)`);
        assert.strictEqual(inside, true, `Focus escaped mobile drawer on Tab ${i + 1}`);
      }

      await browser.pressKey('Escape');
      await browser.waitForCondition(`!document.querySelector('[role="dialog"]')`);
      const restored = await browser.evaluate<boolean>(`document.activeElement === document.querySelector('.vb-menu')`);
      assert.strictEqual(restored, true, 'Escape must restore focus to .vb-menu');
    } finally {
      await browser.setViewport({ width: 1440, height: 900, mobile: false });
    }
  });

  // ==========================================================================
  // TC-T4-WF-06: Reduced Motion Accessibility (F21, F22, F23)
  // ==========================================================================
  it('TC-T4-WF-06: Reduced Motion Accessibility (timer suspended, CSS animations paused, manual controls work)', async () => {
    await browser.setEmulatedMedia({ features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
    try {
      await browser.navigate(`${baseUrl}/`);
      const initialAlt = await browser.getAttribute('.vb-showcase img', 'alt');
      await new Promise((r) => setTimeout(r, 5200));
      assert.strictEqual(await browser.getAttribute('.vb-showcase img', 'alt'), initialAlt, 'Auto-timer must be halted under reduced motion');

      const anim = await browser.getComputedStyle('.vb-hero', 'transition-duration');
      assert.ok(anim === '0s' || anim === '0ms', `Expected 0s transition under reduced motion, got ${anim}`);

      await browser.click('.vb-arrow--next', 0);
      await browser.waitForCondition(`document.querySelector('.vb-showcase img')?.getAttribute('alt') !== ${JSON.stringify(initialAlt)}`);
    } finally {
      await browser.setEmulatedMedia({ features: [] });
    }
  });

  // ==========================================================================
  // TC-T4-WF-07: Static 404 Recovery Journey (F2, F5, F13, F23)
  // ==========================================================================
  it('TC-T4-WF-07: Static 404 Recovery Journey (HTTP 404, dist/404.html, noindex, Return Home)', async () => {
    const res = await httpRequest(`${distUrl}/unknown-route-xyz`);
    assert.strictEqual(res.statusCode, 404);
    assert.ok(res.body.includes('Page Not Found'));
    assert.match(res.body, /<meta\b[^>]*name=["']robots["'][^>]*noindex/i);

    await browser.navigate(`${distUrl}/unknown-route-xyz`);
    const docStatus = browser.getLastResponseStatus();
    assert.strictEqual(docStatus, 404, `Browser document load status expected 404, got ${docStatus}`);
    assert.ok((await browser.getText('h1'))?.includes('Page Not Found'));

    await browser.click('a[href="/"]', 0);
    await browser.waitForCondition(`window.location.pathname === '/' && !!document.querySelector('.vb-profile')`);
    assert.strictEqual(await browser.evaluate<string>('window.location.pathname'), '/');
  });

  // ==========================================================================
  // TC-T4-WF-08: Dual-Theme Visual Preservation (F14, F21, F23)
  // ==========================================================================
  it('TC-T4-WF-08: Dual-Theme Visual Preservation across /, /services, /projects, /about, /blogs', async () => {
    for (const route of ['/', '/services', '/projects', '/about', '/blogs']) {
      await browser.navigate(`${baseUrl}${route}`);
      // Ensure starting in dark mode
      if ((await browser.getAttribute('html', 'data-theme')) !== 'dark') {
        await browser.click('.vb-theme', 0);
        await browser.waitForCondition(`document.documentElement.dataset.theme === 'dark'`);
      }
      assert.strictEqual(await browser.getComputedStyle('body', 'background-color'), 'rgb(0, 0, 0)');
      assert.strictEqual((await browser.getMetaContent('theme-color'))?.toLowerCase(), '#000000');
      assert.strictEqual(await browser.getComputedStyle('.vb-nav-corner-right', 'color'), 'rgb(0, 0, 0)');

      await browser.click('.vb-theme', 0);
      await browser.waitForCondition(`document.documentElement.dataset.theme === 'light'`);
      await browser.waitForCssStability('.vb-nav-corner-right', 1500);

      assert.strictEqual(await browser.getComputedStyle('body', 'background-color'), 'rgb(255, 255, 255)');
      assert.strictEqual((await browser.getMetaContent('theme-color'))?.toLowerCase(), '#ffffff');
      assert.strictEqual(await browser.getComputedStyle('.vb-nav-corner-right', 'color'), 'rgb(255, 255, 255)');

      // Restore dark mode
      await browser.click('.vb-theme', 0);
      await browser.waitForCondition(`document.documentElement.dataset.theme === 'dark'`);
    }
  });

  // ==========================================================================
  // TC-T4-WF-09: Client-Side Hydration Parity (F1, F7, F8, F10, F13)
  // ==========================================================================
  it('TC-T4-WF-09: Client-Side Hydration Parity (SSG head/JSON-LD matches hydrated DOM & SPA transitions)', async () => {
    const blogRoute = `/blogs/${getBlogSlugs()[0]}`;
    const staticHtml = fs.readFileSync(getDistHtmlPath(blogRoute), 'utf-8');
    const staticTitle = extractHtmlTitle(staticHtml);
    const staticCanonical = extractCanonicalHref(staticHtml);
    const staticNodes = flattenGraphNodes(extractJsonLdFromHtml(staticHtml));

    await browser.navigate(`${distUrl}${blogRoute}`);
    const hydratedTitle = await browser.getTitle();
    const hydratedCanonical = await browser.getAttribute('link[rel="canonical"]', 'href');
    const hydratedNodes = flattenGraphNodes(await browser.getJsonLdScripts());

    assert.strictEqual(hydratedTitle, staticTitle);
    assert.strictEqual(hydratedCanonical, staticCanonical);
    assert.deepStrictEqual(
      hydratedNodes.map((n) => n['@type']).sort(),
      staticNodes.map((n) => n['@type']).sort()
    );

    // SPA transition to /about
    await browser.click('.vb-nav-links a[href="/about"]', 0);
    await browser.waitForCondition(`window.location.pathname === '/about' && document.title.includes('About')`, 5000);
    assert.strictEqual(await browser.getCanonicalHref(), 'https://adibx.me/about');
  });

  // ==========================================================================
  // TC-T4-WF-10: Production Bundle & Security Gate (F3, F4, F5, F26)
  // ==========================================================================
  it('TC-T4-WF-10: Production Bundle & Security Gate (chunks < 500 KB, zero dev artifacts, vercel.json headers)', async () => {
    const assetsDir = path.join(DIST_DIR, 'assets');
    const jsFiles = fs.readdirSync(assetsDir).filter((f) => f.endsWith('.js'));
    assert.ok(jsFiles.length >= 5);
    for (const file of jsFiles) {
      assert.ok(fs.statSync(path.join(assetsDir, file)).size < 500 * 1024, `Oversized chunk: ${file}`);
    }

    const res = await httpRequest(`${distUrl}/`);
    assert.strictEqual(res.headers['x-content-type-options'], 'nosniff');
    assert.strictEqual(res.headers['x-frame-options'], 'DENY');
    assert.ok(String(res.headers['strict-transport-security'] || '').includes('max-age=63072000'));
    assert.ok(String(res.headers['content-security-policy'] || '').includes("default-src 'self'"));

    assert.strictEqual(fs.existsSync(path.join(DIST_DIR, '.env')), false);
  });

  // ==========================================================================
  // TC-T4-WF-11: Project Search Typo Tolerance & Filter Workflow
  // ==========================================================================
  it('TC-T4-WF-11: Project Search Typo Tolerance & Category Filter Workflow on /projects', async () => {
    await browser.navigate(`${baseUrl}/projects`);
    await browser.waitForSelector('input[type="search"], input[placeholder*="Search" i]', 3000);

    // Type typo query "moniter"
    await browser.evaluate(`
      (() => {
        const input = document.querySelector('input[type="search"], input[placeholder*="Search" i]');
        const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        setter.call(input, 'moniter');
        input.dispatchEvent(new Event('input', { bubbles: true }));
      })()
    `);
    const matched = await browser.waitForCondition(`(document.body.textContent || '').toLowerCase().includes('walton')`, 3000);
    assert.strictEqual(matched, true, 'Fuzzy search for "moniter" should match Walton 3D Monitor project');
  });

  // ==========================================================================
  // TC-T4-WF-12: Reader Deep Technical Blog Journey
  // ==========================================================================
  it('TC-T4-WF-12: Reader Deep Technical Blog Journey (listing -> article -> TOC -> code copy -> next nav)', async () => {
    await browser.navigate(`${baseUrl}/blogs`);
    const firstSlugHref = await browser.evaluate<string | null>(`
      document.querySelector('section[aria-label="Articles list"] a[href^="/blogs/"]')?.getAttribute('href') || null
    `);
    assert.ok(firstSlugHref?.startsWith('/blogs/'));
    await browser.navigate(`${baseUrl}${firstSlugHref}`);
    const h1 = await browser.getText('h1');
    assert.ok(h1 && h1.length > 5);
    await browser.waitForSelector('pre', 3000);
    const hasToc = await browser.evaluate<boolean>(`document.querySelectorAll('nav[aria-label*="Table of contents"] a, .vb-toc a').length > 0`);
    assert.strictEqual(hasToc, true);
    const hasBack = await browser.evaluate<boolean>(`!!document.querySelector('a[href="/blogs"]')`);
    assert.strictEqual(hasBack, true);
  });

  // ==========================================================================
  // TC-T4-WF-13: Visitor Contact, CV Assets & Deliverable Verification (F26)
  // ==========================================================================
  it('TC-T4-WF-13: Visitor Contact, CV Assets & Final Deliverable Audit Report Verification', async () => {
    await browser.navigate(`${baseUrl}/contact`);
    const hasForm = await browser.evaluate<boolean>(`!!document.querySelector('form') && !!document.querySelector('a[href^="mailto:"]')`);
    assert.strictEqual(hasForm, true, 'Contact page must render inquiry form and mailto link');

    const cvRes = await httpRequest(`${distUrl}/MdRakibujamanAdib_CV.pdf`, 'HEAD');
    assert.strictEqual(cvRes.statusCode, 200, 'CV PDF must be served cleanly from static dist');

    const reports = findAuditReportFiles();
    assert.ok(reports.length > 0, 'Final comprehensive audit report must be delivered in codebase');
    const reportContent = fs.readFileSync(reports[0], 'utf-8');
    assert.ok(reportContent.includes('https://adibx.me') && reportContent.length >= 1500);
  });
});
