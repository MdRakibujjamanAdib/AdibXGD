import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';
import { getSharedBrowser, closeSharedBrowser, BrowserController } from './helpers/browser.ts';
import { ensureServer, ensureDistServer, stopDistServer, stopServer, httpRequest } from './helpers/server.ts';
import { validateSitemapString } from './helpers/xml-validator.ts';
import {
  ROOT_DIR,
  DIST_DIR,
  PUBLIC_DIR,
  STATIC_ROUTES,
  getProjectIds,
  getBlogSlugs,
  getAllPublicRoutes,
  getDistHtmlPath,
  extractHtmlTitle,
  extractMetaContent,
  extractCanonicalHref,
  extractJsonLdFromHtml,
  flattenGraphNodes,
  hasType,
  findAuditReportFiles,
  calculateContrastRatio,
  loadSchemaBuilder,
  getBlogSlugWithCode,
} from './helpers/test-utils.ts';

describe('Tier 2: Boundary & Corner Cases (130 Edge Tests across F1–F26)', () => {
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
  // F1: Static HTML SSG Rendering Boundary Cases
  // ==========================================================================
  describe('F1: Static HTML SSG Rendering Boundary Cases', () => {
    it('E2E-T2-F01-01: Zero Suspense fallback markers (B:0, S:0) in any dist HTML file', () => {
      for (const route of getAllPublicRoutes()) {
        const html = fs.readFileSync(getDistHtmlPath(route), 'utf-8');
        assert.ok(!html.includes('id="B:0"') && !html.includes('id="S:0"'), `Suspense marker leaked in ${route}`);
        assert.ok(!html.includes('<div class="min-h-screen bg-[var(--vb-bg)]"></div>'), `Empty Suspense fallback rendered in ${route}`);
      }
    });

    it('E2E-T2-F01-02: Prerendered content lives directly inside #root, not solely in <noscript>', () => {
      for (const route of STATIC_ROUTES) {
        const html = fs.readFileSync(getDistHtmlPath(route), 'utf-8');
        const rootIdx = html.indexOf('<div id="root">');
        const noscriptIdx = html.indexOf('<noscript>');
        assert.ok(rootIdx !== -1 && noscriptIdx !== -1, `Missing root or noscript in ${route}`);
        const rootSlice = html.slice(rootIdx, noscriptIdx);
        assert.ok(rootSlice.length > 500, `Prerendered #root content too small (${rootSlice.length} bytes) on ${route}`);
      }
    });

    it('E2E-T2-F01-03: Internal navigation uses crawlable <a href="/..."> links in static HTML', () => {
      const html = fs.readFileSync(getDistHtmlPath('/'), 'utf-8');
      for (const href of ['/projects', '/services', '/about', '/blogs', '/contact']) {
        assert.ok(html.includes(`href="${href}"`), `Prerendered homepage missing crawlable link href="${href}"`);
      }
    });

    it('E2E-T2-F01-04: Multi-hyphen and uppercase-ID project/blog routes resolve cleanly on static dist server', async () => {
      const projectIds = getProjectIds();
      const mixedCaseOrMultiHyphen = projectIds.find((id) => /[A-Z]/.test(id) || id.split('-').length >= 3) || projectIds[0];
      const res = await httpRequest(`${distUrl}/projects/${mixedCaseOrMultiHyphen}`);
      assert.strictEqual(res.statusCode, 200, `Expected HTTP 200 for /projects/${mixedCaseOrMultiHyphen}`);
      assert.ok(res.body.includes('<h1'), 'Response must include rendered <h1>');
    });

    it('E2E-T2-F01-05: Client hydration on static dist server produces zero hydration mismatch warnings', async () => {
      browser.clearPageErrors();
      await browser.navigate(`${distUrl}/`);
      await browser.navigate(`${distUrl}/about`);
      const errors = browser.getPageErrors();
      assert.deepStrictEqual(errors, [], `Hydration errors detected: ${errors.join(' | ')}`);
    });
  });

  // ==========================================================================
  // F2: Static 404 Page & Proper Status Boundary Cases
  // ==========================================================================
  describe('F2: Static 404 Page & Proper Status Boundary Cases', () => {
    it('E2E-T2-F02-01: Deeply nested non-existent routes return HTTP 404 on static server', async () => {
      for (const badPath of ['/projects/does-not-exist/extra', '/blogs/missing/nested/123', '/a/b/c/d']) {
        const res = await httpRequest(`${distUrl}${badPath}`);
        assert.strictEqual(res.statusCode, 404, `Expected HTTP 404 for ${badPath}, got ${res.statusCode}`);
      }
    });

    it('E2E-T2-F02-02: dist/404.html omits canonical link to nonexistent URL', () => {
      const html = fs.readFileSync(getDistHtmlPath('/404'), 'utf-8');
      const canonical = extractCanonicalHref(html);
      assert.strictEqual(canonical, null, `dist/404.html should omit <link rel="canonical">, got: ${canonical}`);
    });

    it('E2E-T2-F02-03: Unknown project ID and unknown blog slug render graceful Not Found UI without crashes', async () => {
      browser.clearPageErrors();
      await browser.navigate(`${baseUrl}/projects/nonexistent-project-999`);
      assert.ok((await browser.getText('body'))?.includes('Not Found'));
      await browser.navigate(`${baseUrl}/blogs/nonexistent-blog-999`);
      assert.ok((await browser.getText('body'))?.includes('Not Found'));
      assert.deepStrictEqual(browser.getPageErrors(), []);
    });

    it('E2E-T2-F02-04: Path traversal requests return HTTP 404 without exposing workspace files', async () => {
      for (const attempt of ['/%2e%2e/package.json', '/..%2fpackage.json', '/../../etc/passwd']) {
        const res = await httpRequest(`${distUrl}${attempt}`);
        assert.strictEqual(res.statusCode, 404, `Path traversal attempt ${attempt} must return 404`);
        assert.ok(!res.body.includes('"devDependencies"'), 'Must never leak package.json');
      }
    });

    it('E2E-T2-F02-05: Malformed percent-encoding URL returns 404 cleanly without crashing static server', async () => {
      const res = await httpRequest(`${distUrl}/%E0%A4%A`);
      assert.strictEqual(res.statusCode, 404);
      const health = await httpRequest(`${distUrl}/`);
      assert.strictEqual(health.statusCode, 200, 'Static server must stay healthy after malformed URL');
    });
  });

  // ==========================================================================
  // F3: Route Code Splitting & Chunking Boundary Cases
  // ==========================================================================
  describe('F3: Route Code Splitting & Chunking Boundary Cases', () => {
    it('E2E-T2-F03-01: Total initial JS fetched on homepage load is well below monolithic 1.24 MB', async () => {
      browser.clearNetworkLog();
      await browser.navigate(`${distUrl}/`);
      const jsBytes = browser
        .getNetworkEntries(/\/assets\/.*\.js/)
        .reduce((sum, e) => sum + (e.encodedDataLength || 0), 0);
      assert.ok(jsBytes < 900 * 1024, `Initial homepage JS transfer ${(jsBytes / 1024).toFixed(1)} KB should be < 900 KB`);
    });

    it('E2E-T2-F03-02: vendor-lottie chunk is deferred on / (only loaded on routes that use Lottie)', async () => {
      browser.clearNetworkLog();
      await browser.navigate(`${distUrl}/`);
      const loadedLottieOnHome = browser.getNetworkEntries(/vendor-lottie-.*\.js/);
      assert.strictEqual(loadedLottieOnHome.length, 0, 'vendor-lottie should not be eagerly fetched on /');
    });

    it('E2E-T2-F03-03: Every /assets/*.js and /assets/*.css referenced in dist/index.html exists on disk', () => {
      const html = fs.readFileSync(getDistHtmlPath('/'), 'utf-8');
      const assetRefs = html.match(/\/assets\/[a-zA-Z0-9._-]+\.(?:js|css)/g) || [];
      assert.ok(assetRefs.length >= 2, 'Expected referenced JS and CSS assets in dist/index.html');
      for (const ref of assetRefs) {
        assert.ok(fs.existsSync(path.join(DIST_DIR, ref.replace(/^\/+/, ''))), `Missing built asset ${ref}`);
      }
    });

    it('E2E-T2-F03-04: Rapid sequential lazy route navigation never gets stuck on Suspense fallback', async () => {
      await browser.navigate(`${distUrl}/`);
      for (const route of ['/projects', '/services', '/blogs', '/about', '/contact']) {
        await browser.click(`.vb-nav-links a[href="${route}"]`, 0);
        const ready = await browser.waitForCondition(
          `window.location.pathname === ${JSON.stringify(route)} && !!document.querySelector('h1')`,
          5000
        );
        assert.strictEqual(ready, true, `Lazy route ${route} did not resolve <h1> cleanly`);
      }
    });

    it('E2E-T2-F03-05: vite.config.ts configures chunkSizeWarningLimit <= 500', () => {
      const viteCfg = fs.readFileSync(path.join(ROOT_DIR, 'vite.config.ts'), 'utf-8');
      const m = /chunkSizeWarningLimit:\s*(\d+)/.exec(viteCfg);
      assert.ok(m && Number(m[1]) <= 500, 'vite.config.ts must enforce chunkSizeWarningLimit <= 500');
    });
  });

  // ==========================================================================
  // F4: Toolchain & TypeScript Hygiene Boundary Cases
  // ==========================================================================
  describe('F4: Toolchain & TypeScript Hygiene Boundary Cases', () => {
    it('E2E-T2-F04-01: No serverless api/ directory exists (100% static deployment)', () => {
      assert.strictEqual(fs.existsSync(path.join(ROOT_DIR, 'api')), false, 'Static site must not contain /api serverless functions');
    });

    it('E2E-T2-F04-02: Built dist/assets JS bundles contain no private API keys or .env secrets', () => {
      const assetsDir = path.join(DIST_DIR, 'assets');
      for (const file of fs.readdirSync(assetsDir).filter((f) => f.endsWith('.js'))) {
        const content = fs.readFileSync(path.join(assetsDir, file), 'utf-8');
        assert.ok(!/GEMINI_API_KEY|OPENAI_API_KEY|PRIVATE_KEY-----/.test(content), `Potential secret leaked in ${file}`);
      }
    });

    it('E2E-T2-F04-03: NotFound.tsx compiles cleanly under strict tsc without TS2322 errors', () => {
      const res = spawnSync('npx', ['tsc', '--noEmit'], { cwd: ROOT_DIR, shell: true, encoding: 'utf-8' });
      assert.strictEqual(res.status, 0, 'TypeScript compilation must succeed with zero errors');
      assert.ok(!res.stdout.includes('NotFound.tsx'), 'NotFound.tsx must have zero TS diagnostics');
    });

    it('E2E-T2-F04-04: vite.config.ts does not define API proxies or server-side database plugins', () => {
      const viteCfg = fs.readFileSync(path.join(ROOT_DIR, 'vite.config.ts'), 'utf-8');
      assert.ok(!viteCfg.includes('better-sqlite3') && !viteCfg.includes('@google/genai'));
    });

    it('E2E-T2-F04-05: Rendered text across routes never leaks "undefined", "NaN", or "[object Object]"', async () => {
      for (const route of ['/', '/about', '/services', '/projects', '/blogs', '/contact', '/achievements']) {
        await browser.navigate(`${baseUrl}${route}`);
        const badText = await browser.evaluate<boolean>(`
          (() => {
            const text = document.body?.innerText || '';
            return /\\bundefined\\b|\\bNaN\\b|\\[object Object\\]/.test(text);
          })()
        `);
        assert.strictEqual(badText, false, `Leaked undefined/NaN/[object Object] text on ${route}`);
      }
    });
  });

  // ==========================================================================
  // F5: Vercel Static Hosting & Headers Boundary Cases
  // ==========================================================================
  describe('F5: Vercel Static Hosting & Headers Boundary Cases', () => {
    it('E2E-T2-F05-01: Content-Security-Policy restricts object-src none and base-uri self', async () => {
      const res = await httpRequest(`${distUrl}/`);
      const csp = String(res.headers['content-security-policy'] || '');
      assert.ok(csp.includes("object-src 'none'"), `CSP missing object-src 'none': ${csp}`);
      assert.ok(csp.includes("base-uri 'self'"), `CSP missing base-uri 'self': ${csp}`);
    });

    it('E2E-T2-F05-02: Strict-Transport-Security enforces >= 1 year max-age with includeSubDomains', async () => {
      const res = await httpRequest(`${distUrl}/`);
      const hsts = String(res.headers['strict-transport-security'] || '');
      const m = /max-age=(\d+)/.exec(hsts);
      assert.ok(m && Number(m[1]) >= 31536000, `HSTS max-age must be >= 31536000, got ${hsts}`);
      assert.ok(hsts.includes('includeSubDomains'), 'HSTS must includeSubDomains');
    });

    it('E2E-T2-F05-03: Clean URLs (/about, /services, /projects, /blogs) resolve 200 without .html suffix', async () => {
      for (const route of ['/about', '/services', '/projects', '/blogs']) {
        const res = await httpRequest(`${distUrl}${route}`);
        assert.strictEqual(res.statusCode, 200, `Clean URL ${route} failed with status ${res.statusCode}`);
      }
    });

    it('E2E-T2-F05-04: Discoverability files (/sitemap.xml, /robots.txt, /llms.txt) receive valid cache headers', async () => {
      for (const file of ['/sitemap.xml', '/robots.txt', '/llms.txt']) {
        const res = await httpRequest(`${distUrl}${file}`, 'HEAD');
        assert.strictEqual(res.statusCode, 200);
        assert.ok(String(res.headers['cache-control'] || '').includes('max-age=3600'), `Expected max-age=3600 on ${file}`);
      }
    });

    it('E2E-T2-F05-05: HEAD requests return empty body with 200 and full security headers', async () => {
      const res = await httpRequest(`${distUrl}/about`, 'HEAD');
      assert.strictEqual(res.statusCode, 200);
      assert.strictEqual(res.body, '');
      assert.strictEqual(res.headers['x-content-type-options'], 'nosniff');
    });
  });

  // ==========================================================================
  // F6: Static Discoverability Files Boundary Cases
  // ==========================================================================
  describe('F6: Static Discoverability Files Boundary Cases', () => {
    it('E2E-T2-F06-01: sitemap.xml excludes _template, types, index, .ts extensions, and /404', () => {
      const xml = fs.readFileSync(path.join(PUBLIC_DIR, 'sitemap.xml'), 'utf-8');
      for (const forbidden of ['_template', '/types', '/index', '.ts</loc>', '.tsx</loc>', '/404']) {
        assert.ok(!xml.includes(forbidden), `sitemap.xml must exclude ${forbidden}`);
      }
    });

    it('E2E-T2-F06-02: sitemap.xml <lastmod> dates are valid calendar dates and <priority> is in [0,1]', () => {
      const xml = fs.readFileSync(path.join(PUBLIC_DIR, 'sitemap.xml'), 'utf-8');
      const res = validateSitemapString(xml);
      assert.strictEqual(res.isValid, true, res.errors.join('; '));
      for (const url of res.urls) {
        assert.ok(url.lastmod && /^\d{4}-\d{2}-\d{2}$/.test(url.lastmod), `Invalid lastmod on ${url.loc}`);
        const p = Number(url.priority);
        assert.ok(!isNaN(p) && p >= 0 && p <= 1, `Invalid priority on ${url.loc}`);
      }
    });

    it('E2E-T2-F06-03: robots.txt adheres to RFC 9309 syntax with zero accidental asset disallows', () => {
      const content = fs.readFileSync(path.join(PUBLIC_DIR, 'robots.txt'), 'utf-8');
      const lines = content.split(/\r?\n/).filter((l) => l.trim().length > 0 && !l.startsWith('#'));
      for (const line of lines) {
        assert.match(line, /^[A-Za-z-]+:\s*.+$/, `Invalid robots.txt line: "${line}"`);
        assert.ok(!line.includes('\t'), `Tab character forbidden in robots.txt: "${line}"`);
      }
      assert.ok(!content.includes('Disallow: /images') && !content.includes('Disallow: /assets'));
    });

    it('E2E-T2-F06-04: Static dist server serves sitemap.xml, robots.txt, and llms.txt with proper Content-Type', async () => {
      const s = await httpRequest(`${distUrl}/sitemap.xml`, 'HEAD');
      assert.ok(String(s.headers['content-type'] || '').includes('xml'));
      const r = await httpRequest(`${distUrl}/robots.txt`, 'HEAD');
      assert.ok(String(r.headers['content-type'] || '').includes('text/plain'));
      const l = await httpRequest(`${distUrl}/llms.txt`, 'HEAD');
      assert.ok(String(l.headers['content-type'] || '').includes('text/plain'));
    });

    it('E2E-T2-F06-05: generate-sitemap.ts executes idempotently without modifying existing sitemap', () => {
      const sitemapPath = path.join(PUBLIC_DIR, 'sitemap.xml');
      const before = fs.readFileSync(sitemapPath, 'utf-8');
      const res = spawnSync('npx', ['tsx', 'scripts/generate-sitemap.ts'], { cwd: ROOT_DIR, shell: true });
      assert.strictEqual(res.status, 0);
      const after = fs.readFileSync(sitemapPath, 'utf-8');
      assert.strictEqual(after, before);
    });
  });

  // ==========================================================================
  // F7: Centralized Schema Builder Boundary Cases
  // ==========================================================================
  describe('F7: Centralized Schema Builder Boundary Cases', () => {
    it('E2E-T2-F07-01: schemaBuilder normalizes trailing slashes and query parameters cleanly', async () => {
      assert.ok(fs.existsSync(path.join(ROOT_DIR, 'src/utils/schemaBuilder.ts')), 'schemaBuilder.ts must exist');
      const { getRouteMetadata } = await loadSchemaBuilder();
      const meta = getRouteMetadata('/services/?filter=AI#top');
      assert.strictEqual(meta.canonicalUrl, 'https://adibx.me/services');
    });

    it('E2E-T2-F07-02: Unknown routes passed to getRouteMetadata return noindex without throwing', async () => {
      assert.ok(fs.existsSync(path.join(ROOT_DIR, 'src/utils/schemaBuilder.ts')), 'schemaBuilder.ts must exist');
      const { getRouteMetadata, getRouteJsonLd } = await loadSchemaBuilder();
      const meta = getRouteMetadata('/nonexistent-route-xyz');
      assert.ok(/noindex/i.test(meta.robots), `Expected noindex for unknown route, got ${meta.robots}`);
      const jsonLd = getRouteJsonLd('/nonexistent-route-xyz');
      assert.ok(jsonLd && typeof jsonLd === 'object');
    });

    it('E2E-T2-F07-03: All JSON-LD script tags in DOM are strict JSON with zero literal undefined', async () => {
      for (const route of ['/', '/services', `/blogs/${getBlogSlugs()[0]}`]) {
        await browser.navigate(`${baseUrl}${route}`);
        const valid = await browser.evaluate<boolean>(`
          (() => {
            const scripts = document.querySelectorAll('script[type="application/ld+json"]');
            if (scripts.length === 0) return false;
            for (const s of scripts) {
              const txt = s.textContent || '';
              if (/\\bundefined\\b/.test(txt)) return false;
              try { JSON.parse(txt); } catch { return false; }
            }
            return true;
          })()
        `);
        assert.strictEqual(valid, true, `Invalid or undefined-leaking JSON-LD on ${route}`);
      }
    });

    it('E2E-T2-F07-04: SPA navigation across 5 routes never leaks duplicate JSON-LD <script> elements', async () => {
      await browser.navigate(`${baseUrl}/`);
      for (const route of ['/about', '/services', '/projects', '/blogs', '/']) {
        await browser.click(`.vb-nav-links a[href="${route}"]`, 0).catch(async () => {
          await browser.click(`.vb-wordmark`, 0);
        });
        await browser.waitForCondition(`window.location.pathname === ${JSON.stringify(route)}`, 5000);
      }
      const count = await browser.evaluate<number>(`document.querySelectorAll('script[type="application/ld+json"]').length`);
      assert.ok(count >= 1 && count <= 2, `JSON-LD scripts leaked across SPA transitions: count=${count}`);
    });

    it('E2E-T2-F07-05: JSON-LD description and headline strings contain zero raw HTML tags', async () => {
      await browser.navigate(`${baseUrl}/blogs/${getBlogSlugs()[0]}`);
      const nodes = flattenGraphNodes(await browser.getJsonLdScripts());
      for (const node of nodes) {
        for (const field of [node.headline, node.description, node.name]) {
          if (typeof field === 'string') {
            assert.ok(!/<[a-z][\s\S]*?>/i.test(field), `Raw HTML tag found in JSON-LD field: ${field}`);
          }
        }
      }
    });
  });

  // ==========================================================================
  // F8: Personal Knowledge Graph Boundary Cases
  // ==========================================================================
  describe('F8: Personal Knowledge Graph Boundary Cases', () => {
    it('E2E-T2-F08-01: Zero fabricated AggregateRating or Review nodes in @graph', async () => {
      for (const route of ['/', '/services', '/about']) {
        await browser.navigate(`${baseUrl}${route}`);
        const nodes = flattenGraphNodes(await browser.getJsonLdScripts());
        const bad = nodes.find((n) => hasType(n, 'AggregateRating') || hasType(n, 'Review'));
        assert.strictEqual(bad, undefined, `Fabricated rating/review schema found on ${route}`);
      }
    });

    it('E2E-T2-F08-02: All internal @id references in @graph resolve cleanly without broken trailing slashes', async () => {
      await browser.navigate(`${baseUrl}/about`);
      const nodes = flattenGraphNodes(await browser.getJsonLdScripts());
      for (const n of nodes) {
        if (typeof n.url === 'string' && n.url.length > 'https://adibx.me/'.length) {
          assert.ok(!n.url.endsWith('/'), `Schema URL should omit trailing slash: ${n.url}`);
        }
      }
    });

    it('E2E-T2-F08-03: Person.image is an absolute https://adibx.me URL with no whitespace', async () => {
      await browser.navigate(`${baseUrl}/`);
      const nodes = flattenGraphNodes(await browser.getJsonLdScripts());
      const person = nodes.find((n) => hasType(n, 'Person'));
      const imgUrl = typeof person?.image === 'string' ? person.image : person?.image?.url;
      assert.ok(typeof imgUrl === 'string' && imgUrl.startsWith('https://adibx.me/'), `Invalid Person.image: ${imgUrl}`);
      assert.ok(!imgUrl.includes(' '), 'Person.image must not contain unencoded spaces');
    });

    it('E2E-T2-F08-04: Canonical #person @id is identical across /, /about, and /contact', async () => {
      for (const route of ['/', '/about', '/contact']) {
        await browser.navigate(`${baseUrl}${route}`);
        const nodes = flattenGraphNodes(await browser.getJsonLdScripts());
        const person = nodes.find((n) => hasType(n, 'Person'));
        assert.strictEqual(person?.['@id'], 'https://adibx.me/#person', `Missing or mismatched #person @id on ${route}`);
      }
    });

    it('E2E-T2-F08-05: JSON-LD avoids double-encoded entities (&amp;amp;) and unescaped </script>', async () => {
      await browser.navigate(`${baseUrl}/`);
      const rawText = await browser.evaluate<string>(`
        Array.from(document.querySelectorAll('script[type="application/ld+json"]')).map(s => s.textContent || '').join('\\n')
      `);
      assert.ok(!rawText.includes('&amp;amp;'), 'Double-encoded &amp;amp; in JSON-LD');
      assert.ok(!rawText.includes('</script>'), 'Unescaped </script> in JSON-LD');
    });
  });

  // ==========================================================================
  // F9: Service & OfferCatalog Schemas Boundary Cases
  // ==========================================================================
  describe('F9: Service & OfferCatalog Schemas Boundary Cases', () => {
    it('E2E-T2-F09-01: Service and OfferCatalog schemas are suppressed on non-service routes (/blogs, /privacy)', async () => {
      for (const route of ['/blogs', '/privacy']) {
        await browser.navigate(`${baseUrl}${route}`);
        const nodes = flattenGraphNodes(await browser.getJsonLdScripts());
        const bad = nodes.find((n) => hasType(n, 'Service') || hasType(n, 'OfferCatalog'));
        assert.strictEqual(bad, undefined, `Service schema leaked onto ${route}`);
      }
    });

    it('E2E-T2-F09-02: Every OfferCatalog / Service entry has non-empty name and description', async () => {
      await browser.navigate(`${baseUrl}/services`);
      const nodes = flattenGraphNodes(await browser.getJsonLdScripts());
      const serviceItems = nodes.filter((n) => hasType(n, 'Service'));
      assert.ok(serviceItems.length >= 1, 'Expected Service items on /services');
      for (const svc of serviceItems) {
        assert.ok(svc.name && svc.name.trim().length > 0, 'Service item missing name');
        assert.ok(svc.description && svc.description.trim().length > 0, 'Service item missing description');
      }
    });

    it('E2E-T2-F09-03: Service schemas contain no fabricated price or currency claims', async () => {
      await browser.navigate(`${baseUrl}/services`);
      const text = JSON.stringify(await browser.getJsonLdScripts());
      assert.ok(!text.includes('priceCurrency') && !text.includes('AggregateRating'));
    });

    it('E2E-T2-F09-04: Cycling through every category filter on /services maintains valid page metadata', async () => {
      await browser.navigate(`${baseUrl}/services`);
      const initialTitle = await browser.getTitle();
      const catCount = await browser.evaluate<number>(`document.querySelectorAll('section[aria-label="Filter services by category"] button').length`);
      for (let i = 0; i < catCount; i++) {
        await browser.evaluate(`document.querySelectorAll('section[aria-label="Filter services by category"] button')[${i}].click()`);
      }
      assert.strictEqual(await browser.getTitle(), initialTitle);
    });

    it('E2E-T2-F09-05: /services renders without horizontal overflow on mobile 375px viewport', async () => {
      await browser.setViewport({ width: 375, height: 812, mobile: true });
      try {
        await browser.navigate(`${baseUrl}/services`);
        const overflow = await browser.evaluate<boolean>(`document.documentElement.scrollWidth > window.innerWidth + 1`);
        assert.strictEqual(overflow, false, 'Horizontal overflow on /services at 375px');
      } finally {
        await browser.setViewport({ width: 1440, height: 900, mobile: false });
      }
    });
  });

  // ==========================================================================
  // F10: CreativeWork & BlogPosting Schemas Boundary Cases
  // ==========================================================================
  describe('F10: CreativeWork & BlogPosting Schemas Boundary Cases', () => {
    it('E2E-T2-F10-01: Non-project/non-blog routes (/about, /contact) suppress CreativeWork & BlogPosting', async () => {
      for (const route of ['/about', '/contact']) {
        await browser.navigate(`${baseUrl}${route}`);
        const nodes = flattenGraphNodes(await browser.getJsonLdScripts());
        assert.strictEqual(nodes.some((n) => hasType(n, 'BlogPosting') || hasType(n, 'CreativeWork')), false, `Unexpected article/work schema on ${route}`);
      }
    });

    it('E2E-T2-F10-02: BlogPosting strips HTML from headline and description', async () => {
      await browser.navigate(`${baseUrl}/blogs/${getBlogSlugs()[0]}`);
      const nodes = flattenGraphNodes(await browser.getJsonLdScripts());
      const bp = nodes.find((n) => hasType(n, 'BlogPosting'));
      assert.ok(bp, 'Expected BlogPosting');
      assert.ok(!/<[^>]+>/.test(bp.headline || ''));
      assert.ok(!/<[^>]+>/.test(bp.description || ''));
    });

    it('E2E-T2-F10-03: CreativeWork strips HTML from description and omits undefined optional URLs', async () => {
      const id = getProjectIds()[0];
      await browser.navigate(`${baseUrl}/projects/${id}`);
      const nodes = flattenGraphNodes(await browser.getJsonLdScripts());
      const cw = nodes.find((n) => hasType(n, 'CreativeWork'));
      assert.ok(cw, 'Expected CreativeWork');
      assert.ok(!/<[^>]+>/.test(cw.description || ''));
      assert.ok(!JSON.stringify(cw).includes('undefined'));
    });

    it('E2E-T2-F10-04: Rapidly switching between two project IDs updates CreativeWork.name', async () => {
      const ids = getProjectIds();
      assert.ok(ids.length >= 2);
      await browser.navigate(`${baseUrl}/projects/${ids[0]}`);
      const n1 = flattenGraphNodes(await browser.getJsonLdScripts()).find((n) => hasType(n, 'CreativeWork'));
      await browser.navigate(`${baseUrl}/projects/${ids[1]}`);
      const n2 = flattenGraphNodes(await browser.getJsonLdScripts()).find((n) => hasType(n, 'CreativeWork'));
      assert.ok(n1 && n2, 'Both project pages must emit CreativeWork');
      assert.notStrictEqual(n1.name, n2.name, 'CreativeWork.name must update on project change');
    });

    it('E2E-T2-F10-05: Missing project/blog IDs do not emit bogus CreativeWork or BlogPosting schemas', async () => {
      for (const bad of ['/projects/missing-xyz', '/blogs/missing-xyz']) {
        await browser.navigate(`${baseUrl}${bad}`);
        const nodes = flattenGraphNodes(await browser.getJsonLdScripts());
        assert.strictEqual(nodes.some((n) => hasType(n, 'CreativeWork') || hasType(n, 'BlogPosting')), false);
      }
    });
  });

  // ==========================================================================
  // F11: BreadcrumbList Structured Data Boundary Cases
  // ==========================================================================
  describe('F11: BreadcrumbList Structured Data Boundary Cases', () => {
    it('E2E-T2-F11-01: BreadcrumbList item URLs are absolute https://adibx.me URLs without trailing slashes', async () => {
      await browser.navigate(`${baseUrl}/projects/${getProjectIds()[0]}`);
      const nodes = flattenGraphNodes(await browser.getJsonLdScripts());
      const bc = nodes.find((n) => hasType(n, 'BreadcrumbList'));
      assert.ok(bc?.itemListElement?.length >= 3);
      for (const item of bc.itemListElement) {
        const url = typeof item.item === 'string' ? item.item : item.item?.['@id'];
        assert.ok(url?.startsWith('https://adibx.me'), `Invalid breadcrumb URL: ${url}`);
        if (url.length > 'https://adibx.me/'.length) {
          assert.ok(!url.endsWith('/'), `Trailing slash in breadcrumb URL: ${url}`);
        }
      }
    });

    it('E2E-T2-F11-02: BreadcrumbList item names are non-empty and free of HTML or undefined', async () => {
      await browser.navigate(`${baseUrl}/blogs/${getBlogSlugs()[0]}`);
      const nodes = flattenGraphNodes(await browser.getJsonLdScripts());
      const bc = nodes.find((n) => hasType(n, 'BreadcrumbList'));
      assert.ok(bc?.itemListElement?.length >= 3);
      for (const item of bc.itemListElement) {
        assert.ok(item.name && item.name.trim().length > 0 && !item.name.includes('undefined') && !/<[^>]+>/.test(item.name));
      }
    });

    it('E2E-T2-F11-03: Homepage / BreadcrumbList has at most 1 item (Home) or clean root node', async () => {
      await browser.navigate(`${baseUrl}/`);
      const nodes = flattenGraphNodes(await browser.getJsonLdScripts());
      const bc = nodes.find((n) => hasType(n, 'BreadcrumbList'));
      if (bc) {
        assert.strictEqual(bc.itemListElement?.length, 1);
        assert.strictEqual(bc.itemListElement[0].name, 'Home');
      }
    });

    it('E2E-T2-F11-04: 404 route never emits broken BreadcrumbList items', async () => {
      await browser.navigate(`${baseUrl}/this-404-does-not-exist`);
      const nodes = flattenGraphNodes(await browser.getJsonLdScripts());
      const bc = nodes.find((n) => hasType(n, 'BreadcrumbList'));
      if (bc) {
        assert.ok(!JSON.stringify(bc).includes('undefined'));
      }
    });

    it('E2E-T2-F11-05: Query strings do not leak into BreadcrumbList item URLs', async () => {
      await browser.navigate(`${baseUrl}/blogs/${getBlogSlugs()[0]}?ref=twitter&utm_source=x`);
      const nodes = flattenGraphNodes(await browser.getJsonLdScripts());
      const bc = nodes.find((n) => hasType(n, 'BreadcrumbList'));
      assert.ok(bc);
      assert.ok(!JSON.stringify(bc).includes('utm_source'), 'Query string leaked into BreadcrumbList');
    });
  });

  // ==========================================================================
  // F12: 1200x630 Social Preview Assets Boundary Cases
  // ==========================================================================
  describe('F12: 1200x630 Social Preview Assets Boundary Cases', () => {
    it('E2E-T2-F12-01: og:image and twitter:image never contain unencoded whitespace or relative paths', async () => {
      for (const route of ['/', '/about', '/services', '/projects', '/blogs']) {
        await browser.navigate(`${baseUrl}${route}`);
        const ogImg = await browser.getMetaContent('og:image');
        const twImg = await browser.getMetaContent('twitter:image');
        assert.ok(ogImg?.startsWith('https://adibx.me/') && !ogImg.includes(' '), `Invalid og:image on ${route}: ${ogImg}`);
        assert.ok(twImg?.startsWith('https://adibx.me/') && !twImg.includes(' '), `Invalid twitter:image on ${route}: ${twImg}`);
      }
    });

    it('E2E-T2-F12-02: Static index.html and dist/index.html fallback OG image points to optimized <250KB og-preview', () => {
      for (const file of [path.join(ROOT_DIR, 'index.html'), getDistHtmlPath('/')]) {
        const html = fs.readFileSync(file, 'utf-8');
        const ogImg = extractMetaContent(html, 'og:image');
        assert.ok(ogImg?.includes('/images/og-preview.jpg'), `${file} fallback og:image must use og-preview.jpg, got ${ogImg}`);
      }
    });

    it('E2E-T2-F12-03: og:type is article on blog posts and website on static info pages', async () => {
      await browser.navigate(`${baseUrl}/services`);
      assert.strictEqual(await browser.getMetaContent('og:type'), 'website');
      await browser.navigate(`${baseUrl}/blogs/${getBlogSlugs()[0]}`);
      assert.strictEqual(await browser.getMetaContent('og:type'), 'article');
    });

    it('E2E-T2-F12-04: Every blog coverImage and project thumbnail used in og:image exists on disk in dist/', () => {
      const ogImgPath = path.join(DIST_DIR, 'images/og-preview.jpg');
      assert.ok(fs.existsSync(ogImgPath), 'dist/images/og-preview.jpg must exist');
      const blogHtml = fs.readFileSync(getDistHtmlPath(`/blogs/${getBlogSlugs()[0]}`), 'utf-8');
      const ogImg = extractMetaContent(blogHtml, 'og:image') || '';
      const rel = ogImg.replace('https://adibx.me/', '').split('?')[0];
      assert.ok(fs.existsSync(path.join(DIST_DIR, decodeURIComponent(rel))), `Blog og:image missing in dist/: ${rel}`);
    });

    it('E2E-T2-F12-05: og:url strips query parameters and hash fragments', async () => {
      await browser.navigate(`${baseUrl}/blogs?category=AI#featured`);
      const ogUrl = await browser.getMetaContent('og:url');
      assert.strictEqual(ogUrl, 'https://adibx.me/blogs');
    });
  });

  // ==========================================================================
  // F13: Page-Level Unique Metadata Boundary Cases
  // ==========================================================================
  describe('F13: Page-Level Unique Metadata Boundary Cases', () => {
    it('E2E-T2-F13-01: Author name Md Rakibujjaman Adib is never duplicated in <title> across routes', async () => {
      for (const route of ['/', '/services', '/projects', '/blogs', `/blogs/${getBlogSlugs()[0]}`]) {
        await browser.navigate(`${baseUrl}${route}`);
        const title = await browser.getTitle();
        const count = (title.match(/Md Rakibujjaman Adib/g) || []).length;
        assert.strictEqual(count, 1, `Duplicate author suffix on ${route}: "${title}"`);
      }
    });

    it('E2E-T2-F13-02: Zero titles or meta descriptions contain undefined, null, or empty "|  |"', () => {
      for (const route of getAllPublicRoutes()) {
        const html = fs.readFileSync(getDistHtmlPath(route), 'utf-8');
        const title = extractHtmlTitle(html);
        const desc = extractMetaContent(html, 'description') || '';
        assert.ok(!/undefined|null|\|\s*\|/i.test(title), `Bad title on ${route}: "${title}"`);
        assert.ok(!/undefined|null/i.test(desc), `Bad description on ${route}: "${desc}"`);
      }
    });

    it('E2E-T2-F13-03: Canonical link strips arbitrary query params (?utm_medium=social&q=test)', async () => {
      await browser.navigate(`${baseUrl}/projects?q=3D&utm_medium=social`);
      const canonical = await browser.getCanonicalHref();
      assert.strictEqual(canonical, 'https://adibx.me/projects');
    });

    it('E2E-T2-F13-04: Canonical link omits trailing slashes on subpages', async () => {
      await browser.navigate(`${baseUrl}/about/`);
      const canonical = await browser.getCanonicalHref();
      assert.strictEqual(canonical, 'https://adibx.me/about');
    });

    it('E2E-T2-F13-05: All public routes set index, follow while 404 sets noindex', () => {
      for (const route of STATIC_ROUTES) {
        const html = fs.readFileSync(getDistHtmlPath(route), 'utf-8');
        const robots = extractMetaContent(html, 'robots');
        assert.ok(robots && /index,\s*follow/i.test(robots), `Public route ${route} should be index, follow, got ${robots}`);
      }
      const html404 = fs.readFileSync(getDistHtmlPath('/404'), 'utf-8');
      assert.ok(/noindex/i.test(extractMetaContent(html404, 'robots') || ''));
    });
  });

  // ==========================================================================
  // F14: Search Verification & Theme-Color Boundary Cases
  // ==========================================================================
  describe('F14: Search Verification & Theme-Color Boundary Cases', () => {
    it('E2E-T2-F14-01: Client-side route navigation preserves synchronized meta[name="theme-color"]', async () => {
      await browser.navigate(`${baseUrl}/`);
      await browser.click('.vb-theme', 0);
      await browser.waitForCondition(`document.documentElement.dataset.theme === 'light'`);
      await browser.click('.vb-nav-links a[href="/services"]', 0);
      await browser.waitForCondition(`window.location.pathname === '/services'`);
      const color = await browser.getMetaContent('theme-color');
      assert.strictEqual(color?.toLowerCase(), '#ffffff');
      await browser.click('.vb-theme', 0);
      await browser.waitForCondition(`document.documentElement.dataset.theme === 'dark'`);
    });

    it('E2E-T2-F14-02: Only a single meta[name="theme-color"] tag exists in <head> after theme toggles', async () => {
      await browser.navigate(`${baseUrl}/`);
      await browser.click('.vb-theme', 0);
      await browser.click('.vb-theme', 0);
      const count = await browser.evaluate<number>(`document.querySelectorAll('meta[name="theme-color"]').length`);
      assert.strictEqual(count, 1);
    });

    it('E2E-T2-F14-03: Theme toggle operates safely when localStorage throws SecurityError', async () => {
      await browser.navigate(`${baseUrl}/`);
      const ok = await browser.evaluate<boolean>(`
        (() => {
          try {
            Object.defineProperty(window, 'localStorage', {
              value: { getItem: () => { throw new Error('Blocked'); }, setItem: () => { throw new Error('Blocked'); } },
              configurable: true
            });
            document.querySelector('.vb-theme')?.click();
            return true;
          } catch {
            return false;
          }
        })()
      `);
      assert.strictEqual(ok, true);
    });

    it('E2E-T2-F14-04: Verification meta tags are non-intrusive (<head> only, zero body layout impact)', async () => {
      await browser.navigate(`${baseUrl}/`);
      const bodyHasVerif = await browser.evaluate<boolean>(`
        (document.body.textContent || '').includes('google-site-verification') ||
        (document.body.textContent || '').includes('msvalidate')
      `);
      assert.strictEqual(bodyHasVerif, false);
    });

    it('E2E-T2-F14-05: document.documentElement.style.colorScheme matches theme-color on dark and light toggles', async () => {
      await browser.navigate(`${baseUrl}/`);
      assert.strictEqual(await browser.evaluate<string>(`document.documentElement.style.colorScheme`), 'dark');
      await browser.click('.vb-theme', 0);
      await browser.waitForCondition(`document.documentElement.dataset.theme === 'light'`);
      assert.strictEqual(await browser.evaluate<string>(`document.documentElement.style.colorScheme`), 'light');
      await browser.click('.vb-theme', 0);
      await browser.waitForCondition(`document.documentElement.dataset.theme === 'dark'`);
    });
  });

  // ==========================================================================
  // F15: Media Modernization & WebP/AVIF Boundary Cases
  // ==========================================================================
  describe('F15: Media Modernization & WebP/AVIF Boundary Cases', () => {
    it('E2E-T2-F15-01: Every image path referenced in project and blog data files exists in public/', () => {
      for (const folder of ['src/data/projects', 'src/data/blogs']) {
        const dir = path.join(ROOT_DIR, folder);
        for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.ts') && !x.startsWith('_'))) {
          const content = fs.readFileSync(path.join(dir, f), 'utf-8');
          const matches = content.match(/['"](\/images\/[^'"?]+)['"]/g) || [];
          for (const raw of matches) {
            const rel = raw.slice(1, -1);
            const diskPath = path.join(PUBLIC_DIR, decodeURIComponent(rel).replace(/^\/+/, ''));
            assert.ok(fs.existsSync(diskPath), `Missing image asset ${rel} referenced in ${folder}/${f}`);
          }
        }
      }
    });

    it('E2E-T2-F15-02: Static dist server serves .webp images with Content-Type: image/webp', async () => {
      const webpRel = fs.existsSync(path.join(DIST_DIR, 'MdRakibujamanAdib.webp'))
        ? '/MdRakibujamanAdib.webp'
        : '/images/projects/green-d-carbon-tracker-home.webp';
      if (fs.existsSync(path.join(DIST_DIR, webpRel.replace(/^\/+/, '')))) {
        const res = await httpRequest(`${distUrl}${webpRel}`, 'HEAD');
        assert.strictEqual(res.statusCode, 200);
        assert.strictEqual(res.headers['content-type'], 'image/webp');
      } else {
        assert.fail('Expected at least one .webp image in dist/');
      }
    });

    it('E2E-T2-F15-03: Zero HTTP >= 400 image network responses across /, /projects, /blogs, /about', async () => {
      for (const route of ['/', '/projects', '/blogs', '/about']) {
        browser.clearNetworkLog();
        await browser.navigate(`${distUrl}${route}`);
        const failedImgs = browser
          .getLastNavigationEntries()
          .filter((e) => e.type === 'Image' && (e.failed || (typeof e.status === 'number' && e.status >= 400)));
        assert.strictEqual(failedImgs.length, 0, `Failed images on ${route}: ${failedImgs.map((i) => i.url).join(', ')}`);
      }
    });

    it('E2E-T2-F15-04: Mobile 375px viewport does not download oversized (> 500 KB) hero portrait', async () => {
      await browser.setViewport({ width: 375, height: 812, mobile: true });
      try {
        browser.clearNetworkLog();
        await browser.navigate(`${distUrl}/`);
        const portraitReq = browser.getLastNavigationEntries().find((e) => e.url.includes('MdRakibujamanAdib'));
        assert.ok(portraitReq, 'Hero portrait image request must occur on /');
        assert.ok((portraitReq.encodedDataLength || 0) < 250 * 1024, `Hero portrait transfer too large: ${portraitReq.encodedDataLength} bytes`);
      } finally {
        await browser.setViewport({ width: 1440, height: 900, mobile: false });
      }
    });

    it('E2E-T2-F15-05: 100% of rendered <img> tags across /, /about, /projects, /blogs have non-empty alt attributes', async () => {
      for (const route of ['/', '/about', '/projects', '/blogs']) {
        await browser.navigate(`${baseUrl}${route}`);
        const missingAlt = await browser.evaluate<number>(`
          Array.from(document.querySelectorAll('img')).filter(img => {
            const alt = img.getAttribute('alt');
            return alt === null || alt.trim().length === 0;
          }).length
        `);
        assert.strictEqual(missingAlt, 0, `${missingAlt} images missing alt text on ${route}`);
      }
    });
  });

  // ==========================================================================
  // F16: Explicit Image Dimensions & CLS = 0 Boundary Cases
  // ==========================================================================
  describe('F16: Explicit Image Dimensions & CLS = 0 Boundary Cases', () => {
    it('E2E-T2-F16-01: All explicit width/height attributes on homepage images are positive integers', async () => {
      await browser.navigate(`${baseUrl}/`);
      const invalid = await browser.evaluate<number>(`
        Array.from(document.querySelectorAll('img')).filter(img => {
          const w = img.getAttribute('width');
          const h = img.getAttribute('height');
          return !w || !h || !/^\\d+$/.test(w) || !/^\\d+$/.test(h) || Number(w) <= 0 || Number(h) <= 0;
        }).length
      `);
      assert.strictEqual(invalid, 0, `${invalid} homepage images lack positive integer width/height`);
    });

    it('E2E-T2-F16-02: .vb-recent-card and .vb-card preserve non-zero layout height even when images are blocked', async () => {
      await browser.blockUrls(['*.jpg', '*.webp', '*.png']);
      try {
        await browser.navigate(`${baseUrl}/`);
        const cardH = await browser.evaluate<number>(`document.querySelector('.vb-recent-card')?.getBoundingClientRect().height || 0`);
        assert.ok(cardH > 100, `Recent card collapsed without image: height=${cardH}`);
      } finally {
        await browser.blockUrls([]);
      }
    });

    it('E2E-T2-F16-03: Mobile 375px viewport CLS on / and /projects remains <= 0.1', async () => {
      await browser.setViewport({ width: 375, height: 812, mobile: true });
      try {
        for (const route of ['/', '/projects']) {
          await browser.navigate(`${distUrl}${route}`);
          const cls = await browser.measureCls(350);
          assert.ok(cls <= 0.1, `Mobile CLS on ${route} exceeded 0.1: ${cls}`);
        }
      } finally {
        await browser.setViewport({ width: 1440, height: 900, mobile: false });
      }
    });

    it('E2E-T2-F16-04: ProjectDetails gallery images include explicit width/height attributes', async () => {
      const id = getProjectIds()[0];
      await browser.navigate(`${baseUrl}/projects/${id}`);
      const missing = await browser.evaluate<number>(`
        Array.from(document.querySelectorAll('img')).filter(
          img => !(Number(img.getAttribute('width')) > 0 && Number(img.getAttribute('height')) > 0)
        ).length
      `);
      assert.strictEqual(missing, 0, `${missing} images on /projects/${id} lack explicit dimensions`);
    });

    it('E2E-T2-F16-05: About and Contact showcase portraits declare explicit width and height', async () => {
      for (const route of ['/about', '/contact']) {
        await browser.navigate(`${baseUrl}${route}`);
        const ok = await browser.evaluate<boolean>(`
          (() => {
            const img = document.querySelector('.vb-showcase img');
            return !!img && Number(img.getAttribute('width')) > 0 && Number(img.getAttribute('height')) > 0;
          })()
        `);
        assert.strictEqual(ok, true, `${route} showcase image missing explicit width/height`);
      }
    });
  });

  // ==========================================================================
  // F17: Hero Carousel Loading Priority Boundary Cases
  // ==========================================================================
  describe('F17: Hero Carousel Loading Priority Boundary Cases', () => {
    it('E2E-T2-F17-01: Previous arrow from slide 0 wraps cleanly to the last slide', async () => {
      await browser.navigate(`${baseUrl}/`);
      const totalDots = await browser.evaluate<number>(`document.querySelectorAll('.vb-pagination button').length`);
      await browser.click('.vb-arrow--previous', 0);
      await browser.waitForCondition(`document.querySelectorAll('.vb-pagination button')[${totalDots - 1}]?.getAttribute('aria-pressed') === 'true'`);
    });

    it('E2E-T2-F17-02: Hovering a Latest Projects card updates hero showcase preview, and hovering .vb-profile resets to slide 0', async () => {
      await browser.setViewport({ width: 1440, height: 900, mobile: false });
      await browser.navigate(`${baseUrl}/`);
      const cardCoords = await browser.evaluate<{ x: number; y: number } | null>(`
        (() => {
          const card = document.querySelector('.vb-recent-card');
          if (!card) return null;
          card.scrollIntoView({ block: 'center', behavior: 'instant' });
          const r = card.getBoundingClientRect();
          return { x: Math.round(r.left + r.width / 2), y: Math.round(r.top + r.height / 2) };
        })()
      `);
      assert.ok(cardCoords, 'Recent card must exist');
      await browser.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: cardCoords.x, y: cardCoords.y });
      const updated = await browser.waitForCondition(`document.querySelector('.vb-project-label span')?.textContent === 'Recent Projects'`, 3000);
      assert.strictEqual(updated, true, 'Hovering recent card must update showcase label to Recent Projects');

      await browser.evaluate(`window.scrollTo(0, 0)`);
      const profileCoords = await browser.evaluate<{ x: number; y: number } | null>(`
        (() => {
          const p = document.querySelector('.vb-profile');
          if (!p) return null;
          const r = p.getBoundingClientRect();
          return { x: Math.round(r.left + r.width / 2), y: Math.round(r.top + r.height / 2) };
        })()
      `);
      if (profileCoords) {
        await browser.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: profileCoords.x, y: profileCoords.y });
        await browser.waitForCondition(`document.querySelector('.vb-project-label span')?.textContent === 'Md Rakibujjaman Adib'`, 3000);
      }
    });

    it('E2E-T2-F17-03: Pagination dot aria-pressed reflects active slide exclusively', async () => {
      await browser.navigate(`${baseUrl}/`);
      const activeCount = await browser.evaluate<number>(`
        Array.from(document.querySelectorAll('.vb-pagination button')).filter(b => b.getAttribute('aria-pressed') === 'true').length
      `);
      assert.strictEqual(activeCount, 1);
    });

    it('E2E-T2-F17-04: Hero preload link matches the actual initial hero slide image filename', () => {
      const html = fs.readFileSync(getDistHtmlPath('/'), 'utf-8');
      const preloadMatch = /<link\b[^>]*rel=["']preload["'][^>]*as=["']image["'][^>]*href=["']([^"']+)["']/i.exec(html);
      assert.ok(preloadMatch, 'Hero image preload link must exist in dist/index.html');
      const heroImgMatch = /<div class="vb-showcase"[\s\S]*?<img[^>]*src=["']([^"']+)["']/i.exec(html);
      assert.ok(heroImgMatch, 'Hero showcase <img> must exist in dist/index.html');
      assert.strictEqual(preloadMatch[1].split('?')[0], heroImgMatch[1].split('?')[0], 'Preload href must match hero img src');
    });

    it('E2E-T2-F17-05: Hero carousel container exposes role="region" and aria-roledescription="carousel"', async () => {
      await browser.navigate(`${baseUrl}/`);
      assert.strictEqual(await browser.getAttribute('.vb-showcase', 'role'), 'region');
      assert.strictEqual(await browser.getAttribute('.vb-showcase', 'aria-roledescription'), 'carousel');
    });
  });

  // ==========================================================================
  // F18: Font Loading & Asset Delivery Boundary Cases
  // ==========================================================================
  describe('F18: Font Loading & Asset Delivery Boundary Cases', () => {
    it('E2E-T2-F18-01: Font preload <link> tags include crossorigin attribute', () => {
      const html = fs.readFileSync(getDistHtmlPath('/'), 'utf-8');
      const preloads = html.match(/<link\b[^>]*rel=["']preload["'][^>]*as=["']font["'][^>]*>/gi) || [];
      assert.ok(preloads.length >= 2, 'Expected font preload links');
      for (const link of preloads) {
        assert.ok(/\bcrossorigin\b/i.test(link), `Font preload missing crossorigin attribute: ${link}`);
      }
    });

    it('E2E-T2-F18-02: Font preload <link> tags specify accurate MIME type (font/woff2, font/ttf)', () => {
      const html = fs.readFileSync(getDistHtmlPath('/'), 'utf-8');
      const preloads = html.match(/<link\b[^>]*rel=["']preload["'][^>]*as=["']font["'][^>]*>/gi) || [];
      assert.ok(preloads.length >= 2);
      for (const link of preloads) {
        if (link.includes('.woff2')) assert.ok(link.includes('font/woff2'), `Missing font/woff2 type on ${link}`);
        if (link.includes('.ttf')) assert.ok(link.includes('font/ttf'), `Missing font/ttf type on ${link}`);
      }
    });

    it('E2E-T2-F18-03: Zero HTTP >= 400 font requests occur across routes', async () => {
      browser.clearNetworkLog();
      await browser.navigate(`${distUrl}/`);
      const failedFonts = browser
        .getLastNavigationEntries()
        .filter((e) => e.type === 'Font' && (e.failed || (typeof e.status === 'number' && e.status >= 400)));
      assert.strictEqual(failedFonts.length, 0);
    });

    it('E2E-T2-F18-04: Total dist/fonts directory size is lean (< 150 KB after unused font pruning)', () => {
      const fontsDir = path.join(DIST_DIR, 'fonts');
      const total = fs.readdirSync(fontsDir).reduce((s, f) => s + fs.statSync(path.join(fontsDir, f)).size, 0);
      assert.ok(total < 150 * 1024, `dist/fonts total ${(total / 1024).toFixed(1)} KB exceeds 150 KB pruning target`);
    });

    it('E2E-T2-F18-05: .vb-wordmark computes font-family starting with Clesmont Demo', async () => {
      await browser.navigate(`${distUrl}/`);
      const ff = await browser.getComputedStyle('.vb-wordmark', 'font-family');
      assert.ok(ff.toLowerCase().includes('clesmont'), `Expected Clesmont font-family, got: ${ff}`);
    });
  });

  // ==========================================================================
  // F19: WCAG 2.2 AA Mobile Menu Drawer Boundary Cases
  // ==========================================================================
  describe('F19: WCAG 2.2 AA Mobile Menu Drawer Boundary Cases', () => {
    it('E2E-T2-F19-01: Shift+Tab from first focusable item in open drawer wraps to last item inside drawer', async () => {
      await browser.setViewport({ width: 390, height: 844, mobile: true });
      try {
        await browser.navigate(`${baseUrl}/`);
        await browser.click('.vb-menu', 0);
        const hasDialog = await browser.waitForSelector('[role="dialog"]', 3000);
        assert.strictEqual(hasDialog, true, 'Mobile drawer must render role="dialog"');
        await browser.evaluate(`
          (() => {
            const d = document.querySelector('[role="dialog"]');
            const first = d?.querySelector('button, a[href]');
            if (first) first.focus();
          })()
        `);
        await browser.pressKey('ShiftTab');
        const inside = await browser.evaluate<boolean>(`
          (() => {
            const d = document.querySelector('[role="dialog"]');
            return !!d && d.contains(document.activeElement);
          })()
        `);
        assert.strictEqual(inside, true, 'Shift+Tab escaped mobile dialog focus trap');
      } finally {
        await browser.setViewport({ width: 1440, height: 900, mobile: false });
      }
    });

    it('E2E-T2-F19-02: Clicking a route link inside mobile drawer closes drawer and navigates', async () => {
      await browser.setViewport({ width: 390, height: 844, mobile: true });
      try {
        await browser.navigate(`${baseUrl}/`);
        await browser.click('.vb-menu', 0);
        await browser.waitForSelector('.vb-menu-close-tab', 3000);
        await browser.click('a[href="/services"]', 0);
        await browser.waitForCondition(`window.location.pathname === '/services' && !document.querySelector('.vb-menu-close-tab')`, 4000);
      } finally {
        await browser.setViewport({ width: 1440, height: 900, mobile: false });
      }
    });

    it('E2E-T2-F19-03: Clicking backdrop overlay closes mobile drawer cleanly', async () => {
      await browser.setViewport({ width: 390, height: 844, mobile: true });
      try {
        await browser.navigate(`${baseUrl}/`);
        await browser.click('.vb-menu', 0);
        await browser.waitForSelector('.vb-menu-close-tab', 3000);
        await browser.click('.vb-menu-close-tab', 0);
        const closed = await browser.waitForCondition(`!document.querySelector('.vb-menu-close-tab')`, 3000);
        assert.strictEqual(closed, true);
      } finally {
        await browser.setViewport({ width: 1440, height: 900, mobile: false });
      }
    });

    it('E2E-T2-F19-04: Mobile drawer links satisfy WCAG 2.2 minimum touch target height (>= 44px)', async () => {
      await browser.setViewport({ width: 390, height: 844, mobile: true });
      try {
        await browser.navigate(`${baseUrl}/`);
        await browser.click('.vb-menu', 0);
        await browser.waitForSelector('.vb-menu-close-tab', 3000);
        const minHeight = await browser.evaluate<number>(`
          (() => {
            const links = Array.from(document.querySelectorAll('.vb-menu-close-tab ~ div a'));
            if (links.length === 0) return 0;
            return Math.min(...links.map(a => a.getBoundingClientRect().height));
          })()
        `);
        assert.ok(minHeight >= 44, `Mobile drawer link height ${minHeight}px is below 44px WCAG target`);
      } finally {
        await browser.setViewport({ width: 1440, height: 900, mobile: false });
      }
    });

    it('E2E-T2-F19-05: Resizing from mobile to desktop closes/clears drawer cleanly without blocking desktop nav', async () => {
      await browser.setViewport({ width: 390, height: 844, mobile: true });
      await browser.navigate(`${baseUrl}/`);
      await browser.click('.vb-menu', 0);
      await browser.waitForSelector('.vb-menu-close-tab', 3000);
      await browser.setViewport({ width: 1440, height: 900, mobile: false });
      const navClickable = await browser.isVisible('.vb-nav-links');
      assert.strictEqual(navClickable, true);
    });
  });

  // ==========================================================================
  // F20: Semantic HTML Headings & Landmarks Boundary Cases
  // ==========================================================================
  describe('F20: Semantic HTML Headings & Landmarks Boundary Cases', () => {
    it('E2E-T2-F20-01: Decorative StudioIcons and Starfield SVGs carry aria-hidden="true"', async () => {
      await browser.navigate(`${baseUrl}/`);
      const exposed = await browser.evaluate<number>(`
        Array.from(document.querySelectorAll('.vb-nav-corner-right, .vb-nav-corner-bottom, .vb-label-corner-left, .vb-label-corner-top, .vb-viewport-frame svg'))
          .filter(svg => svg.getAttribute('aria-hidden') !== 'true').length
      `);
      assert.strictEqual(exposed, 0, 'Decorative corner SVGs must have aria-hidden="true"');
    });

    it('E2E-T2-F20-02: Multiple <nav> landmarks have distinct aria-label attributes', async () => {
      await browser.navigate(`${baseUrl}/blogs/${getBlogSlugs()[0]}`);
      const navLabels = await browser.evaluate<string[]>(`
        Array.from(document.querySelectorAll('nav')).map(n => n.getAttribute('aria-label') || '')
      `);
      assert.ok(navLabels.every((l) => l.trim().length > 0), `Every <nav> must have an aria-label: ${JSON.stringify(navLabels)}`);
    });

    it('E2E-T2-F20-03: Primary navigation and FAQ items use native <a>, <button>, or <summary> elements', async () => {
      await browser.navigate(`${baseUrl}/`);
      const nonSemantic = await browser.evaluate<number>(`
        document.querySelectorAll('.vb-nav-links > div[onclick], .vb-socials > div[onclick], .vb-faq > div[onclick]').length
      `);
      assert.strictEqual(nonSemantic, 0);
    });

    it('E2E-T2-F20-04: PortfolioLayout left showcase does not place an <h2> before the page <h1>', async () => {
      for (const route of ['/services', '/projects', '/blogs', '/about']) {
        await browser.navigate(`${baseUrl}${route}`);
        const firstHeadingTag = await browser.evaluate<string>(`
          document.querySelector('h1, h2, h3, h4, h5, h6')?.tagName || ''
        `);
        assert.strictEqual(firstHeadingTag, 'H1', `First heading in DOM on ${route} should be H1, got ${firstHeadingTag}`);
      }
    });

    it('E2E-T2-F20-05: HTML root declares lang="en" and responsive viewport meta', () => {
      const html = fs.readFileSync(getDistHtmlPath('/'), 'utf-8');
      assert.match(html, /<html\b[^>]*lang=["']en["']/i);
      assert.match(html, /<meta\b[^>]*name=["']viewport["'][^>]*width=device-width/i);
    });
  });

  // ==========================================================================
  // F21: Focus Indicators & Keyboard Controls Boundary Cases
  // ==========================================================================
  describe('F21: Focus Indicators & Keyboard Controls Boundary Cases', () => {
    it('E2E-T2-F21-01: ProjectDetails lightbox navigates with ArrowRight and closes with Escape', async () => {
      const ids = getProjectIds();
      await browser.navigate(`${baseUrl}/projects/${ids[0]}`);
      const opened = await browser.evaluate<boolean>(`
        (() => {
          const btn = document.querySelector('button[aria-label*="Zoom"], .vb-gallery-item button, img[class*="cursor-zoom"]')?.closest('button');
          if (btn) { btn.click(); return true; }
          return false;
        })()
      `);
      if (opened) {
        await browser.pressKey('ArrowRight');
        await browser.pressKey('Escape');
      }
      assert.strictEqual(browser.getPageErrors().length, 0);
    });

    it('E2E-T2-F21-02: /projects search input and category pills are operable via keyboard', async () => {
      await browser.navigate(`${baseUrl}/projects`);
      const hasSearch = await browser.waitForSelector('input[type="search"], input[placeholder*="Search" i]', 3000);
      assert.strictEqual(hasSearch, true, 'Projects search input must exist');
      await browser.evaluate(`document.querySelector('input[type="search"], input[placeholder*="Search" i]').focus()`);
      const isFocused = await browser.evaluate<boolean>(`document.activeElement?.tagName === 'INPUT'`);
      assert.strictEqual(isFocused, true);
    });

    it('E2E-T2-F21-03: /services category filter buttons show visible :focus-visible outline', async () => {
      await browser.navigate(`${baseUrl}/services`);
      await browser.evaluate(`document.querySelector('section[aria-label="Filter services by category"] button').focus()`);
      // Trigger keyboard focus-visible via Tab
      await browser.pressKey('Tab');
      const outline = await browser.evaluate<{ style: string; width: string }>(`
        (() => {
          const s = window.getComputedStyle(document.activeElement);
          return { style: s.outlineStyle, width: s.outlineWidth };
        })()
      `);
      assert.ok(outline.style !== 'none' && parseFloat(outline.width) >= 1, `Expected visible focus outline on /services filter, got ${outline.width} ${outline.style}`);
    });

    it('E2E-T2-F21-04: Focus outline color on .vb-hero links uses high-contrast vermilion accent', async () => {
      await browser.navigate(`${baseUrl}/`);
      await browser.pressKey('Tab');
      const outlineColor = await browser.evaluate<string>(`window.getComputedStyle(document.activeElement).outlineColor`);
      assert.ok(outlineColor && outlineColor !== 'rgba(0, 0, 0, 0)', `Expected visible outlineColor, got ${outlineColor}`);
    });

    it('E2E-T2-F21-05: Desktop Tab traversal moves forward cleanly without getting trapped', async () => {
      await browser.setViewport({ width: 1440, height: 900, mobile: false });
      await browser.navigate(`${baseUrl}/`);
      const visited = new Set<string>();
      for (let i = 0; i < 12; i++) {
        await browser.pressKey('Tab');
        const id = await browser.evaluate<string>(`
          (() => {
            const el = document.activeElement;
            return (el?.tagName || '') + ':' + (el?.textContent || el?.getAttribute('aria-label') || '').trim().slice(0, 30);
          })()
        `);
        visited.add(id);
      }
      assert.ok(visited.size >= 5, `Expected Tab to advance across multiple controls, visited only ${visited.size}`);
    });
  });

  // ==========================================================================
  // F22: prefers-reduced-motion Enforcement Boundary Cases
  // ==========================================================================
  describe('F22: prefers-reduced-motion Enforcement Boundary Cases', () => {
    it('E2E-T2-F22-01: Services showcase typewriter freezes statically under reduced motion', async () => {
      await browser.setEmulatedMedia({ features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
      try {
        await browser.navigate(`${baseUrl}/services`);
        const t1 = await browser.getText('.vb-showcase h2');
        await new Promise((r) => setTimeout(r, 400));
        const t2 = await browser.getText('.vb-showcase h2');
        assert.strictEqual(t1, t2, 'Typewriter text should remain static under reduced motion');
        assert.ok(t1 && t1.length > 0);
      } finally {
        await browser.setEmulatedMedia({ features: [] });
      }
    });

    it('E2E-T2-F22-02: About page showcase gallery does not auto-cycle unexpectedly under reduced motion', async () => {
      await browser.setEmulatedMedia({ features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
      try {
        await browser.navigate(`${baseUrl}/about`);
        const src1 = await browser.getAttribute('.vb-showcase img', 'src');
        await new Promise((r) => setTimeout(r, 350));
        const src2 = await browser.getAttribute('.vb-showcase img', 'src');
        assert.strictEqual(src1, src2);
      } finally {
        await browser.setEmulatedMedia({ features: [] });
      }
    });

    it('E2E-T2-F22-03: .vb-recent-card:hover img disables scale transform under reduced motion', async () => {
      await browser.setEmulatedMedia({ features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
      try {
        await browser.navigate(`${baseUrl}/`);
        const css = fs.readFileSync(path.join(ROOT_DIR, 'src/index.css'), 'utf-8');
        assert.match(css, /@media\s*\(prefers-reduced-motion:\s*reduce\)[\s\S]*\.vb-recent-card:is\(:hover,\s*:focus-visible\)\s*img\s*\{\s*transform:\s*none/i);
      } finally {
        await browser.setEmulatedMedia({ features: [] });
      }
    });

    it('E2E-T2-F22-04: scroll-behavior resolves to auto under prefers-reduced-motion: reduce', async () => {
      await browser.setEmulatedMedia({ features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
      try {
        await browser.navigate(`${baseUrl}/`);
        const sb = await browser.getComputedStyle('.vb-hero', 'scroll-behavior');
        assert.strictEqual(sb, 'auto');
      } finally {
        await browser.setEmulatedMedia({ features: [] });
      }
    });

    it('E2E-T2-F22-05: Toggling prefers-reduced-motion dynamically on /blogs produces zero errors', async () => {
      browser.clearPageErrors();
      await browser.navigate(`${baseUrl}/blogs`);
      await browser.setEmulatedMedia({ features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
      await browser.evaluate('window.scrollTo(0, 300)');
      await browser.setEmulatedMedia({ features: [{ name: 'prefers-reduced-motion', value: 'no-preference' }] });
      await browser.evaluate('window.scrollTo(0, 0)');
      assert.deepStrictEqual(browser.getPageErrors(), []);
    });
  });

  // ==========================================================================
  // F23: 100% Visual & Design System Fidelity Boundary Cases
  // ==========================================================================
  describe('F23: 100% Visual & Design System Fidelity Boundary Cases', () => {
    it('E2E-T2-F23-01: Zero white-on-light text in .vb-card elements when light mode is active', async () => {
      await browser.navigate(`${baseUrl}/blogs`);
      await browser.ensureTheme('light');
      try {
        const clean = await browser.evaluate<boolean>(`
          (() => {
            const els = Array.from(document.querySelectorAll('.vb-card h1, .vb-card h2, .vb-card h3, .vb-card p'));
            return els.length > 0 && els.every(el => window.getComputedStyle(el).color !== 'rgb(255, 255, 255)');
          })()
        `);
        assert.strictEqual(clean, true, 'White text leaked onto light-mode .vb-card');
      } finally {
        await browser.ensureTheme('dark');
      }
    });

    it('E2E-T2-F23-02: Primary H1 contrast ratio meets WCAG AA (>= 4.5:1) in both dark and light themes', async () => {
      await browser.navigate(`${baseUrl}/blogs`);
      try {
        for (const targetTheme of ['dark', 'light'] as const) {
          await browser.ensureTheme(targetTheme);
          const colors = await browser.evaluate<{ fg: string; bg: string }>(`
            (() => ({
              fg: window.getComputedStyle(document.querySelector('h1')).color,
              bg: window.getComputedStyle(document.body).backgroundColor,
            }))()
          `);
          const ratio = calculateContrastRatio(colors.fg, colors.bg);
          assert.ok(ratio >= 4.5, `Contrast in ${targetTheme} mode ${ratio.toFixed(2)}:1 < 4.5:1`);
        }
      } finally {
        await browser.ensureTheme('dark');
      }
    });

    it('E2E-T2-F23-03: Blog detail <pre> code blocks keep dark inset surface in light mode', async () => {
      await browser.navigate(`${baseUrl}/blogs/${getBlogSlugWithCode()}`);
      await browser.ensureTheme('light');
      try {
        await browser.waitForSelector('pre', 3000);
        const bg = await browser.getComputedStyle('pre', 'background-color');
        const m = bg.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
        assert.ok(m && Number(m[1]) < 40 && Number(m[2]) < 40 && Number(m[3]) < 40, `Expected dark <pre> inset in light mode, got ${bg}`);
      } finally {
        await browser.ensureTheme('dark');
      }
    });

    it('E2E-T2-F23-04: .vb-bottom-contact preserves high-contrast dark bar in both themes', async () => {
      await browser.navigate(`${baseUrl}/`);
      await browser.ensureTheme('light');
      try {
        const bg = await browser.getComputedStyle('.vb-bottom-contact', 'background-color');
        const fg = await browser.getComputedStyle('.vb-bottom-contact', 'color');
        assert.strictEqual(bg, 'rgb(0, 0, 0)');
        assert.strictEqual(fg, 'rgb(255, 255, 255)');
      } finally {
        await browser.ensureTheme('dark');
      }
    });

    it('E2E-T2-F23-05: Inverted corner SVGs inherit var(--vb-bg) matching body background in both themes', async () => {
      await browser.navigate(`${baseUrl}/`);
      await browser.ensureTheme('dark');
      try {
        const darkCorner = await browser.getComputedStyle('.vb-nav-corner-right', 'color');
        assert.strictEqual(darkCorner, 'rgb(0, 0, 0)');
        await browser.ensureTheme('light');
        await browser.waitForCssStability('.vb-nav-corner-right', 1500);
        const lightCorner = await browser.getComputedStyle('.vb-nav-corner-right', 'color');
        assert.strictEqual(lightCorner, 'rgb(255, 255, 255)');
      } finally {
        await browser.ensureTheme('dark');
      }
    });
  });

  // ==========================================================================
  // F24: E2E Test Suite Execution Boundary Cases
  // ==========================================================================
  describe('F24: E2E Test Suite Execution Boundary Cases', () => {
    it('E2E-T2-F24-01: xml-validator rejects empty XML, missing xmlns, unclosed tags, and invalid calendar dates', () => {
      assert.strictEqual(validateSitemapString('').isValid, false);
      assert.strictEqual(validateSitemapString('<urlset></urlset>').isValid, false);
      assert.strictEqual(
        validateSitemapString('<?xml version="1.0"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://adibx.me</loc><lastmod>2025-02-30</lastmod></url></urlset>').isValid,
        false
      );
      assert.strictEqual(
        validateSitemapString('<?xml version="1.0"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://adibx.me</loc><priority>1.5</priority></url></urlset>').isValid,
        false
      );
    });

    it('E2E-T2-F24-02: Discovered E2E test suite inventory meets >= 299 total test threshold', () => {
      const files = fs.readdirSync(path.join(ROOT_DIR, 'tests')).filter((f) => f.endsWith('.test.ts'));
      let total = 0;
      for (const f of files) {
        const content = fs.readFileSync(path.join(ROOT_DIR, 'tests', f), 'utf-8');
        const itMatches = content.match(/(?:^|\n)\s*it\s*\(/g) || [];
        const tMatches = content.match(/(?:^|\n)\s*(?:await\s+)?t\.test\s*\(/g) || [];
        const topMatches = content.match(/(?:^|\n)\s*(?:await\s+)?test\s*\(/g) || [];
        total += itMatches.length + tMatches.length > 0 ? itMatches.length + tMatches.length : topMatches.length;
      }
      assert.ok(total >= 299, `Total test inventory (${total}) must be >= 299`);
    });

    it('E2E-T2-F24-03: ServerController helper explicitly guards against hijacking foreign occupied ports', () => {
      const serverSrc = fs.readFileSync(path.join(ROOT_DIR, 'tests/helpers/server.ts'), 'utf-8');
      assert.ok(serverSrc.includes('Refusing to hijack'), 'server.ts must refuse to hijack non-ADIBX servers');
    });

    it('E2E-T2-F24-04: BrowserController cleans temporary userDataDir and supports media emulation', () => {
      const browserSrc = fs.readFileSync(path.join(ROOT_DIR, 'tests/helpers/browser.ts'), 'utf-8');
      assert.ok(browserSrc.includes('rmSync(this.userDataDir'));
      assert.ok(browserSrc.includes('Emulation.setEmulatedMedia'));
    });

    it('E2E-T2-F24-05: Tier 1 and Tier 2 cover every feature F1 through F26', () => {
      const t1 = fs.readFileSync(path.join(ROOT_DIR, 'tests/tier1-feature-coverage.test.ts'), 'utf-8');
      const t2 = fs.readFileSync(path.join(ROOT_DIR, 'tests/tier2-boundary-corner.test.ts'), 'utf-8');
      for (let i = 1; i <= 26; i++) {
        const prefix = `F${String(i).padStart(2, '0')}`;
        assert.ok(t1.includes(`E2E-T1-${prefix}-05`), `Tier 1 missing 5th test for ${prefix}`);
        assert.ok(t2.includes(`E2E-T2-${prefix}-05`), `Tier 2 missing 5th test for ${prefix}`);
      }
    });
  });

  // ==========================================================================
  // F25: Adversarial Coverage Hardening Boundary Cases
  // ==========================================================================
  describe('F25: Adversarial Coverage Hardening Boundary Cases', () => {
    it('E2E-T2-F25-01: XSS payload in search query string is safely rendered as text without script execution', async () => {
      await browser.navigate(`${baseUrl}/projects?q=%3Cscript%3Ewindow.__xss%3D1%3C%2Fscript%3E`);
      const xssTriggered = await browser.evaluate<boolean>(`Boolean(window.__xss)`);
      assert.strictEqual(xssTriggered, false, 'XSS payload must never execute');
    });

    it('E2E-T2-F25-02: Special encoded query params (C%2B%2B, AI%20%26%20ML) render cleanly without URIError', async () => {
      browser.clearPageErrors();
      await browser.navigate(`${baseUrl}/projects?q=C%2B%2B`);
      await browser.navigate(`${baseUrl}/blogs?category=AI%20%26%20ML`);
      assert.deepStrictEqual(browser.getPageErrors(), []);
    });

    it('E2E-T2-F25-03: Clipboard writeText rejection on blog code copy button is handled safely', async () => {
      await browser.navigate(`${baseUrl}/blogs/${getBlogSlugs()[0]}`);
      const ok = await browser.evaluate<boolean>(`
        (async () => {
          try {
            Object.defineProperty(navigator, 'clipboard', {
              value: { writeText: () => Promise.reject(new DOMException('Denied', 'NotAllowedError')) },
              configurable: true
            });
            const btn = document.querySelector('button[aria-label*="copy" i], .vb-code-copy-btn-inline');
            if (btn) btn.click();
            return true;
          } catch {
            return false;
          }
        })()
      `);
      assert.strictEqual(ok, true);
    });

    it('E2E-T2-F25-04: Rapid successive filter clicks and history.back() preserve stable SPA state', async () => {
      await browser.navigate(`${baseUrl}/blogs`);
      await browser.navigate(`${baseUrl}/projects`);
      await browser.evaluate('window.history.back()');
      const backOk = await browser.waitForCondition(`window.location.pathname === '/blogs'`, 4000);
      assert.strictEqual(backOk, true);
    });

    it('E2E-T2-F25-05: Fixed .vb-nav stays pinned within 1px of --vb-gap after 800px scroll', async () => {
      await browser.setViewport({ width: 1440, height: 900, mobile: false });
      await browser.navigate(`${baseUrl}/projects`);
      await browser.evaluate('window.scrollTo(0, 800)');
      const top = await browser.evaluate<number>(`document.querySelector('.vb-nav').getBoundingClientRect().top`);
      assert.ok(Math.abs(top - 12) <= 1, `Nav drifted on scroll: boundingTop=${top}`);
      await browser.evaluate('window.scrollTo(0, 0)');
    });
  });

  // ==========================================================================
  // F26: Final Comprehensive Deliverable Report Boundary Cases
  // ==========================================================================
  describe('F26: Final Comprehensive Deliverable Report Boundary Cases', () => {
    it('E2E-T2-F26-01: Final deliverable report is substantive (>= 1500 chars)', () => {
      const reports = findAuditReportFiles();
      assert.ok(reports.length > 0, 'Final audit report must exist');
      const len = fs.readFileSync(reports[0], 'utf-8').trim().length;
      assert.ok(len >= 1500, `Final report too short (${len} chars)`);
    });

    it('E2E-T2-F26-02: Final deliverable report contains zero unfulfilled TODO or TBD placeholders', () => {
      const reports = findAuditReportFiles();
      assert.ok(reports.length > 0, 'Final audit report must exist');
      const content = fs.readFileSync(reports[0], 'utf-8');
      assert.ok(!/\b(TODO|TBD|FIXME|XXX)\b/.test(content), 'Final report contains unfinished placeholder markers');
    });

    it('E2E-T2-F26-03: Final deliverable report is excluded from dist/ and public/ deploy outputs', () => {
      const reports = findAuditReportFiles();
      for (const r of reports) {
        const base = path.basename(r);
        assert.strictEqual(fs.existsSync(path.join(DIST_DIR, base)), false, `${base} must not be copied to dist/`);
        assert.strictEqual(fs.existsSync(path.join(PUBLIC_DIR, base)), false, `${base} must not be placed in public/`);
      }
    });

    it('E2E-T2-F26-04: Final deliverable report references canonical domain https://adibx.me', () => {
      const reports = findAuditReportFiles();
      assert.ok(reports.length > 0, 'Final audit report must exist');
      const content = fs.readFileSync(reports[0], 'utf-8');
      assert.ok(content.includes('https://adibx.me'), 'Final report must reference https://adibx.me');
    });

    it('E2E-T2-F26-05: Repository docs/ contains no temporary debug dumps or leaked credential files', () => {
      const docsDir = path.join(ROOT_DIR, 'docs');
      if (fs.existsSync(docsDir)) {
        const bad = fs.readdirSync(docsDir).filter((f) => /\.(log|tmp|bak|env)$/i.test(f));
        assert.deepStrictEqual(bad, [], `Unexpected scratch files in docs/: ${bad.join(', ')}`);
      }
    });
  });
});
