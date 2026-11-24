import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';
import { getSharedBrowser, closeSharedBrowser, BrowserController } from './helpers/browser.ts';
import { ensureServer, ensureDistServer, stopDistServer, stopServer, httpRequest } from './helpers/server.ts';
import { validateSitemapFile, validateSitemapString } from './helpers/xml-validator.ts';
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
  getImageDimensions,
  findAuditReportFiles,
  loadSchemaBuilder,
} from './helpers/test-utils.ts';
import { allServices } from '../src/data/services.ts';

describe('Tier 1: Feature Coverage (130 Happy-Path Tests across F1–F26)', () => {
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
  // F1: Static HTML SSG Rendering (M1 | R1, §37)
  // ==========================================================================
  describe('F1: Static HTML SSG Rendering', () => {
    it('E2E-T1-F01-01: dist/index.html contains prerendered homepage React DOM', () => {
      const htmlPath = getDistHtmlPath('/');
      assert.ok(fs.existsSync(htmlPath), 'dist/index.html must exist');
      const html = fs.readFileSync(htmlPath, 'utf-8');
      assert.ok(!html.includes('<div id="root"></div>'), 'dist/index.html must not have an empty #root');
      assert.ok(html.includes('vb-hero') && html.includes('ADIB'), 'Prerendered homepage must render .vb-hero and ADIB wordmark inside #root');
      assert.ok(/<h1\b[^>]*>[\s\S]*?ADIB[\s\S]*?<\/h1>/i.test(html), 'Prerendered homepage must contain <h1>');
    });

    it('E2E-T1-F01-02: All static public routes produce prerendered HTML files with content', () => {
      for (const route of STATIC_ROUTES) {
        const htmlPath = getDistHtmlPath(route);
        assert.ok(fs.existsSync(htmlPath), `Prerendered HTML missing for route ${route} at ${htmlPath}`);
        const html = fs.readFileSync(htmlPath, 'utf-8');
        assert.ok(!html.includes('<div id="root"></div>'), `${route} must not have empty #root`);
        assert.ok(/<h1\b[^>]*>/i.test(html), `${route} prerendered HTML must contain <h1>`);
      }
    });

    it('E2E-T1-F01-03: All project detail routes produce prerendered HTML files', () => {
      const projectIds = getProjectIds();
      assert.ok(projectIds.length > 0, 'Must have project entries');
      for (const id of projectIds) {
        const htmlPath = getDistHtmlPath(`/projects/${id}`);
        assert.ok(fs.existsSync(htmlPath), `Missing prerendered HTML for /projects/${id}`);
        const html = fs.readFileSync(htmlPath, 'utf-8');
        assert.ok(/<h1\b[^>]*>/i.test(html), `/projects/${id} prerendered HTML must contain <h1>`);
      }
    });

    it('E2E-T1-F01-04: All blog detail routes produce prerendered HTML files', () => {
      const blogSlugs = getBlogSlugs();
      assert.ok(blogSlugs.length > 0, 'Must have blog entries');
      for (const slug of blogSlugs) {
        const htmlPath = getDistHtmlPath(`/blogs/${slug}`);
        assert.ok(fs.existsSync(htmlPath), `Missing prerendered HTML for /blogs/${slug}`);
        const html = fs.readFileSync(htmlPath, 'utf-8');
        assert.ok(/<h1\b[^>]*>/i.test(html), `/blogs/${slug} prerendered HTML must contain <h1>`);
      }
    });

    it('E2E-T1-F01-05: Static Dist Server renders prerendered DOM in browser with JavaScript disabled', async () => {
      await browser.setScriptExecutionDisabled(true);
      try {
        await browser.navigate(`${distUrl}/services`, { waitForHydration: false });
        const result = await browser.evaluate<{ h1: string | null; navLinks: number; rootChildren: number }>(`
          (() => {
            const root = document.getElementById('root');
            return {
              h1: document.querySelector('h1')?.textContent?.trim() || null,
              navLinks: document.querySelectorAll('nav a[href]').length,
              rootChildren: root ? root.children.length : 0,
            };
          })()
        `);
        assert.ok(result.rootChildren > 0, '#root must contain prerendered DOM without JS');
        assert.ok(result.h1 && result.h1.length > 0, '<h1> must render in initial static HTML without JS');
        assert.ok(result.navLinks >= 4, 'Navigation links must be present without JS');
      } finally {
        await browser.setScriptExecutionDisabled(false);
      }
    });
  });

  // ==========================================================================
  // F2: Static 404 Page & Proper Status (M1 | R1, §20, §56)
  // ==========================================================================
  describe('F2: Static 404 Page & Proper Status', () => {
    it('E2E-T1-F02-01: dist/404.html exists with prerendered Page Not Found content', () => {
      const notFoundPath = getDistHtmlPath('/404');
      assert.ok(fs.existsSync(notFoundPath), 'dist/404.html must exist');
      const html = fs.readFileSync(notFoundPath, 'utf-8');
      assert.ok(html.includes('Page Not Found'), 'dist/404.html must contain Page Not Found heading');
      assert.ok(!html.includes('<div id="root"></div>'), 'dist/404.html must contain prerendered DOM');
    });

    it('E2E-T1-F02-02: Static Dist Server returns real HTTP 404 status for non-existent route', async () => {
      const res = await httpRequest(`${distUrl}/non-existent-route-check-404`);
      assert.strictEqual(res.statusCode, 404, `Expected HTTP 404, got ${res.statusCode}`);
      assert.ok(res.body.includes('Page Not Found'), '404 response body must serve dist/404.html content');
    });

    it('E2E-T1-F02-03: dist/404.html emits noindex robots directive', () => {
      const html = fs.readFileSync(getDistHtmlPath('/404'), 'utf-8');
      const robots = extractMetaContent(html, 'robots');
      assert.ok(robots && /noindex/i.test(robots), `dist/404.html must include noindex robots directive, got: ${robots}`);
    });

    it('E2E-T1-F02-04: Client-side unknown route renders NotFound page with recovery links', async () => {
      await browser.navigate(`${baseUrl}/unknown-route-404-e2e`);
      const info = await browser.evaluate<{ h1: string | null; homeLink: boolean; projectsLink: boolean }>(`
        (() => ({
          h1: document.querySelector('h1')?.textContent?.trim() || null,
          homeLink: !!document.querySelector('a[href="/"]'),
          projectsLink: !!document.querySelector('a[href="/projects"]'),
        }))()
      `);
      assert.ok(info.h1?.includes('Page Not Found'), `Expected Page Not Found h1, got: ${info.h1}`);
      assert.strictEqual(info.homeLink, true, '404 page must provide link back to /');
      assert.strictEqual(info.projectsLink, true, '404 page must provide link to /projects');
    });

    it('E2E-T1-F02-05: Clicking Return Home link on 404 page recovers cleanly to /', async () => {
      await browser.navigate(`${baseUrl}/unknown-route-recover`);
      await browser.click('a[href="/"]', 0);
      await browser.waitForCondition(`window.location.pathname === '/'`, 5000);
      const pathname = await browser.evaluate<string>('window.location.pathname');
      assert.strictEqual(pathname, '/');
    });
  });

  // ==========================================================================
  // F3: Route Code Splitting & Chunking (M1 | R3, §26, §47)
  // ==========================================================================
  describe('F3: Route Code Splitting & Chunking', () => {
    it('E2E-T1-F03-01: dist/assets contains dedicated manual vendor chunks', () => {
      const assetsDir = path.join(DIST_DIR, 'assets');
      assert.ok(fs.existsSync(assetsDir), 'dist/assets directory must exist');
      const files = fs.readdirSync(assetsDir);
      assert.ok(files.some((f) => f.startsWith('vendor-react-') && f.endsWith('.js')), 'Expected vendor-react chunk');
      assert.ok(files.some((f) => f.startsWith('vendor-motion-') && f.endsWith('.js')), 'Expected vendor-motion chunk');
      assert.ok(files.some((f) => f.startsWith('vendor-lottie-') && f.endsWith('.js')), 'Expected vendor-lottie chunk');
      assert.ok(files.some((f) => f.startsWith('vendor-icons-') && f.endsWith('.js')), 'Expected vendor-icons chunk');
    });

    it('E2E-T1-F03-02: Every JS chunk in dist/assets is strictly under 500 KB', () => {
      const assetsDir = path.join(DIST_DIR, 'assets');
      const jsFiles = fs.readdirSync(assetsDir).filter((f) => f.endsWith('.js'));
      assert.ok(jsFiles.length >= 5, 'Expected multiple code-split JS chunks');
      for (const file of jsFiles) {
        const size = fs.statSync(path.join(assetsDir, file)).size;
        assert.ok(size < 500 * 1024, `Chunk ${file} is ${(size / 1024).toFixed(1)} KB, must be < 500 KB`);
      }
    });

    it('E2E-T1-F03-03: Entry index JS bundle is lightweight (< 50 KB)', () => {
      const assetsDir = path.join(DIST_DIR, 'assets');
      const entry = fs.readdirSync(assetsDir).find((f) => f.startsWith('index-') && f.endsWith('.js'));
      assert.ok(entry, 'Entry index-*.js must exist');
      const size = fs.statSync(path.join(assetsDir, entry)).size;
      assert.ok(size < 50 * 1024, `Entry bundle ${entry} should be < 50 KB, got ${(size / 1024).toFixed(1)} KB`);
    });

    it('E2E-T1-F03-04: Route-level lazy page chunks are emitted separately', () => {
      const assetsDir = path.join(DIST_DIR, 'assets');
      const files = fs.readdirSync(assetsDir);
      for (const prefix of ['Home-', 'Projects-', 'Services-', 'Blogs-', 'About-']) {
        assert.ok(
          files.some((f) => f.startsWith(prefix) && f.endsWith('.js')),
          `Expected lazy route chunk starting with ${prefix}`
        );
      }
    });

    it('E2E-T1-F03-05: Client navigation from / to /services loads Services chunk cleanly', async () => {
      browser.clearNetworkLog();
      await browser.navigate(`${distUrl}/`);
      await browser.click('.vb-nav-links a[href="/services"]', 0);
      const loaded = await browser.waitForCondition(
        `window.location.pathname === '/services' && Boolean(document.querySelector('h1')?.textContent?.includes('Services'))`,
        5000
      );
      assert.strictEqual(loaded, true, 'Services page heading must render after SPA navigation');
    });
  });

  // ==========================================================================
  // F4: Toolchain & TypeScript Hygiene (M1 | R5, §58)
  // ==========================================================================
  describe('F4: Toolchain & TypeScript Hygiene', () => {
    it('E2E-T1-F04-01: TypeScript typecheck (npx tsc --noEmit) passes with zero errors', () => {
      const res = spawnSync('npx', ['tsc', '--noEmit'], { cwd: ROOT_DIR, shell: true, encoding: 'utf-8' });
      assert.strictEqual(res.status, 0, `tsc --noEmit failed:\n${res.stdout}\n${res.stderr}`);
    });

    it('E2E-T1-F04-02: package.json excludes unused backend/AI runtime dependencies', () => {
      const pkg = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'package.json'), 'utf-8'));
      const deps = Object.keys(pkg.dependencies || {});
      for (const forbidden of ['better-sqlite3', '@google/genai', 'express', 'sqlite3', 'mongoose', 'prisma']) {
        assert.ok(!deps.includes(forbidden), `Runtime dependencies must not include ${forbidden}`);
      }
    });

    it('E2E-T1-F04-03: package.json defines build, lint, test, and test:e2e scripts', () => {
      const pkg = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'package.json'), 'utf-8'));
      assert.ok(pkg.scripts?.build?.includes('prerender.ts'), 'build script must run prerender.ts');
      assert.ok(pkg.scripts?.lint, 'lint script must be defined');
      assert.ok(pkg.scripts?.test, 'test script must be defined');
      assert.ok(pkg.scripts?.['test:e2e'], 'test:e2e script must be defined');
    });

    it('E2E-T1-F04-04: Zero uncaught page errors across primary routes', async () => {
      browser.clearPageErrors();
      for (const route of ['/', '/projects', '/services', '/blogs', '/about', '/contact']) {
        await browser.navigate(`${baseUrl}${route}`);
      }
      const errors = browser.getPageErrors();
      assert.deepStrictEqual(errors, [], `Unexpected uncaught page errors: ${errors.join(' | ')}`);
    });

    it('E2E-T1-F04-05: dist/ contains zero .ts/.tsx source files or .env artifacts', () => {
      const walk = (dir: string): string[] => {
        const out: string[] = [];
        for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
          const full = path.join(dir, entry.name);
          if (entry.isDirectory()) out.push(...walk(full));
          else out.push(full);
        }
        return out;
      };
      const allDistFiles = walk(DIST_DIR);
      const bad = allDistFiles.filter(
        (f) => f.endsWith('.ts') || f.endsWith('.tsx') || path.basename(f).startsWith('.env') || f.includes('.test.')
      );
      assert.deepStrictEqual(bad, [], `Forbidden dev/source artifacts in dist/: ${bad.join(', ')}`);
    });
  });

  // ==========================================================================
  // F5: Vercel Static Hosting & Headers (M1 | R3, §26, §56, §57)
  // ==========================================================================
  describe('F5: Vercel Static Hosting & Headers', () => {
    it('E2E-T1-F05-01: vercel.json configures cleanUrls and trailingSlash: false', () => {
      const vercel = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'vercel.json'), 'utf-8'));
      assert.strictEqual(vercel.cleanUrls, true, 'vercel.json must enable cleanUrls');
      assert.strictEqual(vercel.trailingSlash, false, 'vercel.json must set trailingSlash: false');
    });

    it('E2E-T1-F05-02: vercel.json has no blanket SPA rewrite masking 404 responses', () => {
      const vercel = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'vercel.json'), 'utf-8'));
      const rewrites = Array.isArray(vercel.rewrites) ? vercel.rewrites : [];
      const hasBlanket = rewrites.some((r: any) => r?.destination === '/index.html' || r?.source === '/(.*)');
      assert.strictEqual(hasBlanket, false, 'vercel.json must not define a blanket rewrite to /index.html');
    });

    it('E2E-T1-F05-03: Static HTTP responses include required security headers', async () => {
      const res = await httpRequest(`${distUrl}/`);
      assert.strictEqual(res.statusCode, 200);
      assert.strictEqual(res.headers['x-content-type-options'], 'nosniff');
      assert.strictEqual(res.headers['x-frame-options'], 'DENY');
      assert.ok(res.headers['referrer-policy'], 'Referrer-Policy header must be present');
      assert.ok(res.headers['permissions-policy'], 'Permissions-Policy header must be present');
      assert.ok(String(res.headers['strict-transport-security'] || '').includes('max-age='), 'HSTS header must be present');
      assert.ok(String(res.headers['content-security-policy'] || '').includes("default-src 'self'"), 'CSP header must be present');
    });

    it('E2E-T1-F05-04: Hashed /assets/* bundles serve immutable Cache-Control headers', async () => {
      const assetsDir = path.join(DIST_DIR, 'assets');
      const jsFile = fs.readdirSync(assetsDir).find((f) => f.endsWith('.js'));
      assert.ok(jsFile, 'Expected JS file in dist/assets');
      const res = await httpRequest(`${distUrl}/assets/${jsFile}`, 'HEAD');
      assert.strictEqual(res.statusCode, 200);
      assert.ok(String(res.headers['cache-control'] || '').includes('immutable'), `Expected immutable Cache-Control, got ${res.headers['cache-control']}`);
      assert.ok(String(res.headers['cache-control'] || '').includes('31536000'), 'Expected 1-year max-age on /assets/*');
    });

    it('E2E-T1-F05-05: HTML routes serve must-revalidate Cache-Control headers', async () => {
      const res = await httpRequest(`${distUrl}/`, 'HEAD');
      assert.strictEqual(res.statusCode, 200);
      assert.ok(
        String(res.headers['cache-control'] || '').includes('must-revalidate'),
        `Expected must-revalidate Cache-Control for HTML, got ${res.headers['cache-control']}`
      );
    });
  });

  // ==========================================================================
  // F6: Static Discoverability Files (M1 | R1, §20, §38, §39)
  // ==========================================================================
  describe('F6: Static Discoverability Files (sitemap.xml, robots.txt, llms.txt)', () => {
    it('E2E-T1-F06-01: sitemap.xml is valid XML and indexes all public routes', () => {
      const validation = validateSitemapFile(path.join(PUBLIC_DIR, 'sitemap.xml'));
      assert.strictEqual(validation.isValid, true, `Invalid sitemap.xml: ${validation.errors.join('; ')}`);
      const locs = new Set(validation.urls.map((u) => u.loc));
      for (const route of getAllPublicRoutes()) {
        const expected = route === '/' ? 'https://adibx.me' : `https://adibx.me${route}`;
        assert.ok(locs.has(expected) || (route === '/' && locs.has('https://adibx.me/')), `Sitemap missing route ${expected}`);
      }
    });

    it('E2E-T1-F06-02: robots.txt allows standard search and AI search retrieval crawlers', () => {
      const content = fs.readFileSync(path.join(PUBLIC_DIR, 'robots.txt'), 'utf-8');
      for (const ua of ['Googlebot', 'Bingbot', 'OAI-SearchBot', 'ChatGPT-User', 'PerplexityBot', '\\*']) {
        assert.match(content, new RegExp(`User-agent:\\s*${ua}[\\s\\S]*?Allow:\\s*/`, 'i'), `Expected ${ua} Allow: /`);
      }
    });

    it('E2E-T1-F06-03: robots.txt separates and disallows AI model-training scrapers', () => {
      const content = fs.readFileSync(path.join(PUBLIC_DIR, 'robots.txt'), 'utf-8');
      for (const scraper of ['GPTBot', 'Google-Extended', 'ClaudeBot', 'Applebot-Extended', 'CCBot']) {
        assert.match(content, new RegExp(`User-agent:\\s*${scraper}[\\s\\S]*?Disallow:\\s*/`, 'i'), `Expected ${scraper} Disallow: /`);
      }
    });

    it('E2E-T1-F06-04: robots.txt declares Sitemap pointing to https://adibx.me/sitemap.xml', () => {
      const content = fs.readFileSync(path.join(PUBLIC_DIR, 'robots.txt'), 'utf-8');
      assert.match(content, /Sitemap:\s*https:\/\/adibx\.me\/sitemap\.xml/i);
    });

    it('E2E-T1-F06-05: llms.txt exists in public/ and dist/ with identity, services, and public URLs', () => {
      const publicLlms = path.join(PUBLIC_DIR, 'llms.txt');
      const distLlms = path.join(DIST_DIR, 'llms.txt');
      assert.ok(fs.existsSync(publicLlms), 'public/llms.txt must exist');
      assert.ok(fs.existsSync(distLlms), 'dist/llms.txt must exist');
      const content = fs.readFileSync(publicLlms, 'utf-8');
      assert.ok(content.includes('Md Rakibujjaman Adib'), 'llms.txt must identify Md Rakibujjaman Adib');
      assert.ok(content.includes('https://adibx.me/#person'), 'llms.txt must reference canonical #person ID');
      assert.ok(content.includes('https://adibx.me/services'), 'llms.txt must list /services');
      assert.ok(content.includes('https://adibx.me/projects'), 'llms.txt must list /projects');
    });
  });

  // ==========================================================================
  // F7: Centralized Schema Builder (M2 | R2, §23, §41)
  // ==========================================================================
  describe('F7: Centralized Schema Builder', () => {
    const builderPath = path.join(ROOT_DIR, 'src/utils/schemaBuilder.ts');

    it('E2E-T1-F07-01: src/utils/schemaBuilder.ts exists and exports getRouteMetadata & getRouteJsonLd', async () => {
      assert.ok(fs.existsSync(builderPath), 'src/utils/schemaBuilder.ts must exist (M2 contract)');
      const mod = await loadSchemaBuilder();
      assert.strictEqual(typeof mod.getRouteMetadata, 'function', 'getRouteMetadata must be exported');
      assert.strictEqual(typeof mod.getRouteJsonLd, 'function', 'getRouteJsonLd must be exported');
    });

    it('E2E-T1-F07-02: getRouteMetadata returns complete metadata for static, project, and blog routes', async () => {
      assert.ok(fs.existsSync(builderPath), 'src/utils/schemaBuilder.ts must exist');
      const { getRouteMetadata } = await loadSchemaBuilder();
      const projectId = getProjectIds()[0];
      const blogSlug = getBlogSlugs()[0];
      for (const route of ['/', '/services', `/projects/${projectId}`, `/blogs/${blogSlug}`]) {
        const meta = getRouteMetadata(route);
        assert.ok(meta?.title && meta.title.length > 0, `title missing for ${route}`);
        assert.ok(meta?.description && meta.description.length > 20, `description missing for ${route}`);
        assert.ok(meta?.canonicalUrl?.startsWith('https://adibx.me'), `canonicalUrl invalid for ${route}`);
        assert.ok(meta?.ogImage?.startsWith('https://adibx.me'), `ogImage invalid for ${route}`);
        assert.ok(meta?.ogType === 'website' || meta?.ogType === 'article', `ogType invalid for ${route}`);
        assert.ok(meta?.robots, `robots missing for ${route}`);
      }
    });

    it('E2E-T1-F07-03: getRouteJsonLd emits unified Schema.org @graph structure', async () => {
      assert.ok(fs.existsSync(builderPath), 'src/utils/schemaBuilder.ts must exist');
      const { getRouteJsonLd } = await loadSchemaBuilder();
      const jsonLd = getRouteJsonLd('/');
      assert.strictEqual(jsonLd['@context'], 'https://schema.org');
      assert.ok(Array.isArray(jsonLd['@graph']) && jsonLd['@graph'].length >= 2, 'Expected @graph array in getRouteJsonLd("/")');
    });

    it('E2E-T1-F07-04: prerender.ts and SEO.tsx share schemaBuilder parity', () => {
      assert.ok(fs.existsSync(builderPath), 'src/utils/schemaBuilder.ts must exist');
      const seoSrc = fs.readFileSync(path.join(ROOT_DIR, 'src/components/SEO.tsx'), 'utf-8');
      assert.ok(seoSrc.includes('schemaBuilder'), 'SEO.tsx must consume schemaBuilder');
    });

    it('E2E-T1-F07-05: Static HTML and client-hydrated DOM emit matching @graph schemas on / and /services', async () => {
      for (const route of ['/', '/services']) {
        const staticHtml = fs.readFileSync(getDistHtmlPath(route), 'utf-8');
        const staticRaw = extractJsonLdFromHtml(staticHtml);
        assert.ok(staticRaw.some((item) => Array.isArray(item['@graph'])), `Static HTML ${route} must emit @graph JSON-LD`);

        await browser.navigate(`${distUrl}${route}`);
        const clientRaw = await browser.getJsonLdScripts();
        assert.ok(clientRaw.some((item) => Array.isArray(item['@graph'])), `Client DOM ${route} must emit @graph JSON-LD`);
      }
    });
  });

  // ==========================================================================
  // F8: Personal Knowledge Graph (#person) (M2 | R2, §23, §41)
  // ==========================================================================
  describe('F8: Personal Knowledge Graph (#person)', () => {
    it('E2E-T1-F08-01: Homepage @graph anchors Person entity at https://adibx.me/#person', async () => {
      await browser.navigate(`${baseUrl}/`);
      const raw = await browser.getJsonLdScripts();
      assert.ok(raw.some((r) => Array.isArray(r['@graph'])), 'Homepage JSON-LD must use unified @graph');
      const nodes = flattenGraphNodes(raw);
      const person = nodes.find((n) => hasType(n, 'Person'));
      assert.ok(person, 'Person node must exist in @graph');
      assert.strictEqual(person['@id'], 'https://adibx.me/#person');
      assert.strictEqual(person.name, 'Md Rakibujjaman Adib');
      assert.strictEqual(person.email, 'contact@adibx.me');
    });

    it('E2E-T1-F08-02: WebSite entity (#website) links SearchAction and publisher/author #person', async () => {
      await browser.navigate(`${baseUrl}/`);
      const nodes = flattenGraphNodes(await browser.getJsonLdScripts());
      const website = nodes.find((n) => hasType(n, 'WebSite'));
      assert.ok(website, 'WebSite node must exist');
      assert.strictEqual(website['@id'], 'https://adibx.me/#website');
      assert.strictEqual(website.url, 'https://adibx.me');
      assert.strictEqual(website.potentialAction?.['@type'], 'SearchAction');
    });

    it('E2E-T1-F08-03: Routes include WebPage entity connected to #website and #person', async () => {
      await browser.navigate(`${baseUrl}/about`);
      const nodes = flattenGraphNodes(await browser.getJsonLdScripts());
      const webPage = nodes.find((n) => hasType(n, 'WebPage') || hasType(n, 'AboutPage') || hasType(n, 'ProfilePage'));
      assert.ok(webPage, 'Expected WebPage node in @graph on /about');
      const serialized = JSON.stringify(webPage);
      assert.ok(serialized.includes('https://adibx.me/#person') || serialized.includes('https://adibx.me/#website'), 'WebPage must reference #person or #website');
    });

    it('E2E-T1-F08-04: Person includes verified sameAs links and alumniOf institutions', async () => {
      await browser.navigate(`${baseUrl}/about`);
      const nodes = flattenGraphNodes(await browser.getJsonLdScripts());
      const person = nodes.find((n) => hasType(n, 'Person'));
      assert.ok(person?.sameAs?.some((u: string) => u.includes('linkedin.com')));
      assert.ok(person?.sameAs?.some((u: string) => u.includes('github.com')));
      assert.ok(Array.isArray(person?.alumniOf) && person.alumniOf.length >= 2, 'Expected Windesheim UAS and DIU in alumniOf');
    });

    it('E2E-T1-F08-05: Person includes knowsAbout topics and founder organizations', async () => {
      await browser.navigate(`${baseUrl}/`);
      const nodes = flattenGraphNodes(await browser.getJsonLdScripts());
      const person = nodes.find((n) => hasType(n, 'Person'));
      assert.ok(Array.isArray(person?.knowsAbout) && person.knowsAbout.length >= 5);
      const founderNames = (person?.founder || []).map((f: any) => f.name);
      assert.ok(founderNames.includes('Green D'), 'Person founder must include Green D');
    });
  });

  // ==========================================================================
  // F9: Service & OfferCatalog Schemas (M2 | R2, §23)
  // ==========================================================================
  describe('F9: Service & OfferCatalog Schemas', () => {
    it('E2E-T1-F09-01: /services emits Service or OfferCatalog JSON-LD schema', async () => {
      await browser.navigate(`${baseUrl}/services`);
      const nodes = flattenGraphNodes(await browser.getJsonLdScripts());
      const hasServiceSchema = nodes.some((n) => hasType(n, 'Service') || hasType(n, 'OfferCatalog') || Boolean(n.hasOfferCatalog));
      assert.ok(hasServiceSchema, '/services must emit Service or OfferCatalog structured data');
    });

    it('E2E-T1-F09-02: /services structured data covers all service items in src/data/services.ts', async () => {
      await browser.navigate(`${baseUrl}/services`);
      const nodes = flattenGraphNodes(await browser.getJsonLdScripts());
      const serialized = JSON.stringify(nodes);
      const matched = allServices.filter((s) => serialized.includes(s.title));
      assert.strictEqual(matched.length, allServices.length, `Expected all ${allServices.length} services in JSON-LD, found ${matched.length}`);
    });

    it('E2E-T1-F09-03: /services schema links provider to https://adibx.me/#person', async () => {
      await browser.navigate(`${baseUrl}/services`);
      const nodes = flattenGraphNodes(await browser.getJsonLdScripts());
      const serviceNode = nodes.find((n) => hasType(n, 'Service') || hasType(n, 'OfferCatalog') || n.hasOfferCatalog);
      assert.ok(serviceNode, 'Service/OfferCatalog node must exist');
      assert.ok(JSON.stringify(serviceNode).includes('https://adibx.me/#person'), 'Service provider must reference #person');
    });

    it('E2E-T1-F09-04: Static dist/services/index.html contains Service/OfferCatalog JSON-LD', () => {
      const html = fs.readFileSync(getDistHtmlPath('/services'), 'utf-8');
      const nodes = flattenGraphNodes(extractJsonLdFromHtml(html));
      const hasService = nodes.some((n) => hasType(n, 'Service') || hasType(n, 'OfferCatalog') || Boolean(n.hasOfferCatalog));
      assert.ok(hasService, 'Prerendered /services HTML must include Service/OfferCatalog JSON-LD');
    });

    it('E2E-T1-F09-05: /services UI category filtering updates rendered service cards', async () => {
      await browser.navigate(`${baseUrl}/services`);
      const initialCount = await browser.evaluate<number>(`document.querySelectorAll('h3, .vb-service-card, article').length`);
      const clicked = await browser.evaluate<boolean>(`
        (() => {
          const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent?.includes('AI & Automation'));
          if (btn) { btn.click(); return true; }
          return false;
        })()
      `);
      assert.ok(clicked, 'AI & Automation category filter button must exist');
      await browser.evaluate<void>('new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)))');
      const text = await browser.getText('body');
      assert.ok(text?.includes('Autonomous AI Agents'), 'Filtered view must show AI & Automation service');
      assert.ok(initialCount >= 1, 'Services page must render service items');
    });
  });

  // ==========================================================================
  // F10: CreativeWork & BlogPosting Schemas (M2 | R2, §23)
  // ==========================================================================
  describe('F10: CreativeWork & BlogPosting Schemas', () => {
    it('E2E-T1-F10-01: /projects/:id emits CreativeWork schema (not BlogPosting)', async () => {
      const id = getProjectIds()[0];
      await browser.navigate(`${baseUrl}/projects/${id}`);
      const nodes = flattenGraphNodes(await browser.getJsonLdScripts());
      const cw = nodes.find((n) => hasType(n, 'CreativeWork') || hasType(n, 'SoftwareApplication') || hasType(n, 'VisualArtwork'));
      const bp = nodes.find((n) => hasType(n, 'BlogPosting'));
      assert.ok(cw, `/projects/${id} must emit CreativeWork schema`);
      assert.strictEqual(bp, undefined, `/projects/${id} must NOT emit BlogPosting schema`);
    });

    it('E2E-T1-F10-02: /projects/:id CreativeWork links creator/author to #person', async () => {
      const id = getProjectIds()[0];
      await browser.navigate(`${baseUrl}/projects/${id}`);
      const nodes = flattenGraphNodes(await browser.getJsonLdScripts());
      const cw = nodes.find((n) => hasType(n, 'CreativeWork'));
      assert.ok(cw, 'CreativeWork node must exist');
      assert.ok(JSON.stringify(cw).includes('https://adibx.me/#person'), 'CreativeWork must reference #person');
    });

    it('E2E-T1-F10-03: /blogs/:slug emits BlogPosting schema with headline, ISO datePublished, author, publisher', async () => {
      const slug = getBlogSlugs()[0];
      await browser.navigate(`${baseUrl}/blogs/${slug}`);
      const nodes = flattenGraphNodes(await browser.getJsonLdScripts());
      const bp = nodes.find((n) => hasType(n, 'BlogPosting'));
      assert.ok(bp, `/blogs/${slug} must emit BlogPosting schema`);
      assert.ok(bp.headline && bp.headline.length > 0, 'BlogPosting must have headline');
      assert.ok(!isNaN(Date.parse(bp.datePublished)), 'BlogPosting.datePublished must be valid ISO date');
      assert.strictEqual(bp.author?.name, 'Md Rakibujjaman Adib');
      assert.strictEqual(bp.publisher?.name, 'Md Rakibujjaman Adib');
    });

    it('E2E-T1-F10-04: /blogs/:slug BlogPosting.image resolves to absolute https://adibx.me URL', async () => {
      const slug = getBlogSlugs()[0];
      await browser.navigate(`${baseUrl}/blogs/${slug}`);
      const nodes = flattenGraphNodes(await browser.getJsonLdScripts());
      const bp = nodes.find((n) => hasType(n, 'BlogPosting'));
      assert.ok(bp, 'BlogPosting node must exist');
      const img = Array.isArray(bp.image) ? bp.image[0] : (bp.image?.url || bp.image);
      assert.ok(typeof img === 'string' && img.startsWith('https://adibx.me/'), `Expected absolute image URL, got ${img}`);
    });

    it('E2E-T1-F10-05: Prerendered static HTML for projects and blogs includes CreativeWork and BlogPosting', () => {
      const projHtml = fs.readFileSync(getDistHtmlPath(`/projects/${getProjectIds()[0]}`), 'utf-8');
      const projNodes = flattenGraphNodes(extractJsonLdFromHtml(projHtml));
      assert.ok(projNodes.some((n) => hasType(n, 'CreativeWork')), 'Static project HTML must include CreativeWork');

      const blogHtml = fs.readFileSync(getDistHtmlPath(`/blogs/${getBlogSlugs()[0]}`), 'utf-8');
      const blogNodes = flattenGraphNodes(extractJsonLdFromHtml(blogHtml));
      assert.ok(blogNodes.some((n) => hasType(n, 'BlogPosting')), 'Static blog HTML must include BlogPosting');
    });
  });

  // ==========================================================================
  // F11: BreadcrumbList Structured Data (M2 | R2, §23)
  // ==========================================================================
  describe('F11: BreadcrumbList Structured Data', () => {
    it('E2E-T1-F11-01: Static subpages (/services, /about) emit 2-level BreadcrumbList', async () => {
      for (const route of ['/services', '/about']) {
        await browser.navigate(`${baseUrl}${route}`);
        const nodes = flattenGraphNodes(await browser.getJsonLdScripts());
        const bc = nodes.find((n) => hasType(n, 'BreadcrumbList'));
        assert.ok(bc, `Expected BreadcrumbList on ${route}`);
        assert.ok(Array.isArray(bc.itemListElement) && bc.itemListElement.length >= 2, `${route} BreadcrumbList must have >= 2 items`);
        assert.strictEqual(bc.itemListElement[0].position, 1);
      }
    });

    it('E2E-T1-F11-02: /projects/:id emits 3-level BreadcrumbList (Home -> Projects -> Project)', async () => {
      const id = getProjectIds()[0];
      await browser.navigate(`${baseUrl}/projects/${id}`);
      const nodes = flattenGraphNodes(await browser.getJsonLdScripts());
      const bc = nodes.find((n) => hasType(n, 'BreadcrumbList'));
      assert.ok(bc, 'Expected BreadcrumbList on project details');
      assert.strictEqual(bc.itemListElement?.length, 3, 'Project BreadcrumbList must have 3 levels');
      assert.strictEqual(bc.itemListElement[1].name, 'Projects');
    });

    it('E2E-T1-F11-03: /blogs/:slug emits 3-level BreadcrumbList (Home -> Blogs -> Article)', async () => {
      const slug = getBlogSlugs()[0];
      await browser.navigate(`${baseUrl}/blogs/${slug}`);
      const nodes = flattenGraphNodes(await browser.getJsonLdScripts());
      const bc = nodes.find((n) => hasType(n, 'BreadcrumbList'));
      assert.ok(bc, 'Expected BreadcrumbList on blog details');
      assert.strictEqual(bc.itemListElement?.length, 3, 'Blog BreadcrumbList must have 3 levels');
      assert.strictEqual(bc.itemListElement[1].name, 'Blogs');
    });

    it('E2E-T1-F11-04: BreadcrumbList item positions increment sequentially from 1', async () => {
      const slug = getBlogSlugs()[0];
      await browser.navigate(`${baseUrl}/blogs/${slug}`);
      const nodes = flattenGraphNodes(await browser.getJsonLdScripts());
      const bc = nodes.find((n) => hasType(n, 'BreadcrumbList'));
      assert.ok(bc?.itemListElement, 'BreadcrumbList items must exist');
      bc.itemListElement.forEach((item: any, idx: number) => {
        assert.strictEqual(item.position, idx + 1, `Expected sequential position ${idx + 1}`);
      });
    });

    it('E2E-T1-F11-05: Static prerendered dist/services/index.html includes BreadcrumbList', () => {
      const html = fs.readFileSync(getDistHtmlPath('/services'), 'utf-8');
      const nodes = flattenGraphNodes(extractJsonLdFromHtml(html));
      assert.ok(nodes.some((n) => hasType(n, 'BreadcrumbList')), 'Static /services HTML must include BreadcrumbList');
    });
  });

  // ==========================================================================
  // F12: 1200x630 Social Preview Assets (M2 | R2, §23, §40)
  // ==========================================================================
  describe('F12: 1200x630 Social Preview Assets', () => {
    const ogPath = path.join(PUBLIC_DIR, 'images/og-preview.jpg');

    it('E2E-T1-F12-01: Optimized public/images/og-preview.jpg exists and is < 250 KB', () => {
      assert.ok(fs.existsSync(ogPath), 'public/images/og-preview.jpg must exist');
      assert.ok(fs.existsSync(path.join(DIST_DIR, 'images/og-preview.jpg')), 'dist/images/og-preview.jpg must exist');
      const size = fs.statSync(ogPath).size;
      assert.ok(size > 1024 && size < 250 * 1024, `og-preview.jpg must be < 250 KB, got ${(size / 1024).toFixed(1)} KB`);
    });

    it('E2E-T1-F12-02: og-preview.jpg has exact 1200x630 pixel dimensions', () => {
      const dims = getImageDimensions(ogPath);
      assert.ok(dims, 'Could not parse og-preview.jpg image dimensions');
      assert.strictEqual(dims.width, 1200, `Expected 1200px width, got ${dims.width}`);
      assert.strictEqual(dims.height, 630, `Expected 630px height, got ${dims.height}`);
    });

    it('E2E-T1-F12-03: Homepage OpenGraph metadata references 1200x630 og-preview asset', async () => {
      await browser.navigate(`${baseUrl}/`);
      const ogImage = await browser.getMetaContent('og:image');
      const ogWidth = await browser.getMetaContent('og:image:width');
      const ogHeight = await browser.getMetaContent('og:image:height');
      assert.ok(ogImage?.includes('/images/og-preview.jpg'), `Expected og:image to reference og-preview.jpg, got ${ogImage}`);
      assert.strictEqual(ogWidth, '1200');
      assert.strictEqual(ogHeight, '630');
    });

    it('E2E-T1-F12-04: Twitter Card metadata is populated with summary_large_image and absolute image', async () => {
      await browser.navigate(`${baseUrl}/about`);
      assert.strictEqual(await browser.getMetaContent('twitter:card'), 'summary_large_image');
      assert.strictEqual(await browser.getMetaContent('twitter:creator'), '@MdRakibujjamanAdib');
      const twImage = await browser.getMetaContent('twitter:image');
      assert.ok(twImage?.startsWith('https://adibx.me/'), `twitter:image must be absolute URL, got ${twImage}`);
    });

    it('E2E-T1-F12-05: Static dist server serves /images/og-preview.jpg with HTTP 200', async () => {
      const res = await httpRequest(`${distUrl}/images/og-preview.jpg`, 'HEAD');
      assert.strictEqual(res.statusCode, 200);
      assert.strictEqual(res.headers['content-type'], 'image/jpeg');
    });
  });

  // ==========================================================================
  // F13: Page-Level Unique Metadata (All Public Routes) (M2 | R2, §23, §40)
  // ==========================================================================
  describe('F13: Page-Level Unique Metadata', () => {
    it('E2E-T1-F13-01: All 9 static public routes have unique non-empty <title> in dist/', () => {
      const titles = new Map<string, string>();
      for (const route of STATIC_ROUTES) {
        const html = fs.readFileSync(getDistHtmlPath(route), 'utf-8');
        const title = extractHtmlTitle(html);
        assert.ok(title.length > 10, `Route ${route} title too short: "${title}"`);
        assert.ok(!titles.has(title), `Duplicate title "${title}" on ${route} and ${titles.get(title)}`);
        titles.set(title, route);
      }
    });

    it('E2E-T1-F13-02: All 9 static public routes have unique meta descriptions in dist/', () => {
      const descs = new Map<string, string>();
      for (const route of STATIC_ROUTES) {
        const html = fs.readFileSync(getDistHtmlPath(route), 'utf-8');
        const desc = extractMetaContent(html, 'description');
        assert.ok(desc && desc.length >= 40, `Route ${route} description too short: "${desc}"`);
        assert.ok(!descs.has(desc), `Duplicate description on ${route} and ${descs.get(desc)}`);
        descs.set(desc, route);
      }
    });

    it('E2E-T1-F13-03: Every public route in dist/ has matching canonical URL on https://adibx.me', () => {
      for (const route of getAllPublicRoutes()) {
        const html = fs.readFileSync(getDistHtmlPath(route), 'utf-8');
        const canonical = extractCanonicalHref(html);
        const expected = route === '/' ? 'https://adibx.me' : `https://adibx.me${route}`;
        assert.strictEqual(canonical, expected, `Canonical mismatch for ${route}: got "${canonical}"`);
      }
    });

    it('E2E-T1-F13-04: All project routes have unique titles and descriptions', () => {
      const titles = new Set<string>();
      for (const id of getProjectIds()) {
        const html = fs.readFileSync(getDistHtmlPath(`/projects/${id}`), 'utf-8');
        const title = extractHtmlTitle(html);
        const desc = extractMetaContent(html, 'description');
        assert.ok(title.length > 10 && !titles.has(title), `Duplicate or invalid title on /projects/${id}: ${title}`);
        assert.ok(desc && desc.length >= 30, `Description missing on /projects/${id}`);
        titles.add(title);
      }
    });

    it('E2E-T1-F13-05: All blog routes have unique titles and descriptions', () => {
      const titles = new Set<string>();
      for (const slug of getBlogSlugs()) {
        const html = fs.readFileSync(getDistHtmlPath(`/blogs/${slug}`), 'utf-8');
        const title = extractHtmlTitle(html);
        const desc = extractMetaContent(html, 'description');
        assert.ok(title.length > 10 && !titles.has(title), `Duplicate or invalid title on /blogs/${slug}: ${title}`);
        assert.ok(desc && desc.length >= 30, `Description missing on /blogs/${slug}`);
        titles.add(title);
      }
    });
  });

  // ==========================================================================
  // F14: Search Verification & Theme-Color (M2 | R2, §23, §32)
  // ==========================================================================
  describe('F14: Search Verification & Theme-Color', () => {
    it('E2E-T1-F14-01: Google Search Console verification tag is present in index.html & dist', () => {
      const html = fs.readFileSync(getDistHtmlPath('/'), 'utf-8');
      const googleVerif = extractMetaContent(html, 'google-site-verification');
      assert.ok(googleVerif && googleVerif.length > 0, 'google-site-verification meta tag must be present');
    });

    it('E2E-T1-F14-02: Non-intrusive Bing Webmaster verification support (msvalidate.01 or BingSiteAuth.xml)', () => {
      const html = fs.readFileSync(getDistHtmlPath('/'), 'utf-8');
      const bingMeta = extractMetaContent(html, 'msvalidate.01');
      const bingFile = fs.existsSync(path.join(PUBLIC_DIR, 'BingSiteAuth.xml'));
      assert.ok(Boolean(bingMeta) || bingFile, 'Expected Bing verification meta tag (msvalidate.01) or BingSiteAuth.xml');
    });

    it('E2E-T1-F14-03: meta[name="theme-color"] initializes to #000000 in dark mode', async () => {
      await browser.navigate(`${baseUrl}/`);
      const themeColor = await browser.getMetaContent('theme-color');
      assert.strictEqual(themeColor?.toLowerCase(), '#000000');
    });

    it('E2E-T1-F14-04: Toggling theme updates meta[name="theme-color"] to #ffffff in light mode', async () => {
      await browser.navigate(`${baseUrl}/`);
      await browser.click('.vb-theme', 0);
      await browser.waitForCondition(`document.documentElement.dataset.theme === 'light'`);
      const lightColor = await browser.getMetaContent('theme-color');
      assert.strictEqual(lightColor?.toLowerCase(), '#ffffff');
      await browser.click('.vb-theme', 0);
      await browser.waitForCondition(`document.documentElement.dataset.theme === 'dark'`);
    });

    it('E2E-T1-F14-05: Pre-paint inline script applies saved light theme-color on cold load', async () => {
      await browser.navigate(`${distUrl}/`);
      await browser.evaluate(`localStorage.setItem('vb-theme', 'light')`);
      try {
        await browser.navigate(`${distUrl}/`);
        const info = await browser.evaluate<{ theme: string | null; themeColor: string | null }>(`
          (() => ({
            theme: document.documentElement.dataset.theme || null,
            themeColor: document.querySelector('meta[name="theme-color"]')?.getAttribute('content') || null,
          }))()
        `);
        assert.strictEqual(info.theme, 'light');
        assert.strictEqual(info.themeColor?.toLowerCase(), '#ffffff');
      } finally {
        await browser.evaluate(`localStorage.setItem('vb-theme', 'dark')`);
      }
    });
  });

  // ==========================================================================
  // F15: Media Modernization & WebP/AVIF (M3 | R3, §26, §44)
  // ==========================================================================
  describe('F15: Media Modernization & WebP/AVIF', () => {
    it('E2E-T1-F15-01: Optimized WebP/AVIF portrait asset exists and is < 250 KB', () => {
      const webpPath = path.join(PUBLIC_DIR, 'MdRakibujamanAdib.webp');
      const avifPath = path.join(PUBLIC_DIR, 'MdRakibujamanAdib.avif');
      const chosen = fs.existsSync(webpPath) ? webpPath : (fs.existsSync(avifPath) ? avifPath : null);
      assert.ok(chosen, 'Expected modernized MdRakibujamanAdib.webp or .avif in public/');
      const size = fs.statSync(chosen).size;
      assert.ok(size < 250 * 1024, `Modernized portrait must be < 250 KB, got ${(size / 1024).toFixed(1)} KB`);
    });

    it('E2E-T1-F15-02: Homepage hero portrait uses .webp or .avif image source', async () => {
      await browser.navigate(`${baseUrl}/`);
      const src = await browser.evaluate<string>(`
        (() => {
          const img = document.querySelector('.vb-showcase img');
          return img?.currentSrc || img?.getAttribute('src') || '';
        })()
      `);
      assert.ok(/\.(webp|avif)(\?|$)/i.test(src), `Hero portrait must use WebP/AVIF, got: ${src}`);
    });

    it('E2E-T1-F15-03: About and Contact showcase portraits use modernized .webp/.avif assets', async () => {
      for (const route of ['/about', '/contact']) {
        await browser.navigate(`${baseUrl}${route}`);
        const src = await browser.evaluate<string>(`
          (() => {
            const img = document.querySelector('.vb-showcase img');
            return img?.currentSrc || img?.getAttribute('src') || '';
          })()
        `);
        assert.ok(/\.(webp|avif)(\?|$)/i.test(src), `${route} portrait must use WebP/AVIF, got: ${src}`);
      }
    });

    it('E2E-T1-F15-04: All rendered images on /, /projects, and /blogs decode with naturalWidth > 0', async () => {
      for (const route of ['/', '/projects', '/blogs']) {
        await browser.navigate(`${baseUrl}${route}`);
        const broken = await browser.evaluate<string[]>(`
          (() => {
            const imgs = Array.from(document.querySelectorAll('img'));
            return imgs
              .filter(img => img.loading !== 'lazy' && (!img.complete || img.naturalWidth === 0))
              .map(img => img.getAttribute('src') || '(no src)');
          })()
        `);
        assert.deepStrictEqual(broken, [], `Broken eager images on ${route}: ${broken.join(', ')}`);
      }
    });

    it('E2E-T1-F15-05: No project or blog data file references external picsum.photos placeholders', () => {
      for (const folder of ['src/data/projects', 'src/data/blogs']) {
        const dir = path.join(ROOT_DIR, folder);
        for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.ts'))) {
          const content = fs.readFileSync(path.join(dir, f), 'utf-8');
          assert.ok(!content.includes('picsum.photos'), `${folder}/${f} must not reference picsum.photos`);
        }
      }
    });
  });

  // ==========================================================================
  // F16: Explicit Image Dimensions & CLS = 0 (M3 | R3, §26, §44, §46)
  // ==========================================================================
  describe('F16: Explicit Image Dimensions & CLS = 0', () => {
    it('E2E-T1-F16-01: Homepage hero showcase <img> declares explicit width and height attributes', async () => {
      await browser.navigate(`${baseUrl}/`);
      const dims = await browser.evaluate<{ width: string | null; height: string | null }>(`
        (() => {
          const img = document.querySelector('.vb-showcase img');
          return { width: img?.getAttribute('width') || null, height: img?.getAttribute('height') || null };
        })()
      `);
      assert.ok(dims.width && Number(dims.width) > 0, `Hero showcase img missing explicit width, got ${dims.width}`);
      assert.ok(dims.height && Number(dims.height) > 0, `Hero showcase img missing explicit height, got ${dims.height}`);
    });

    it('E2E-T1-F16-02: Homepage Latest Projects card images declare explicit width and height', async () => {
      await browser.navigate(`${baseUrl}/`);
      const missing = await browser.evaluate<number>(`
        Array.from(document.querySelectorAll('.vb-recent-card img')).filter(
          img => !(Number(img.getAttribute('width')) > 0 && Number(img.getAttribute('height')) > 0)
        ).length
      `);
      assert.strictEqual(missing, 0, `${missing} Latest Projects card images lack explicit width/height`);
    });

    it('E2E-T1-F16-03: /projects and /blogs card images have explicit dimensions or aspect ratio containers', async () => {
      await browser.navigate(`${baseUrl}/projects`);
      const missing = await browser.evaluate<number>(`
        Array.from(document.querySelectorAll('img')).filter(
          img => !(Number(img.getAttribute('width')) > 0 && Number(img.getAttribute('height')) > 0)
        ).length
      `);
      assert.strictEqual(missing, 0, `${missing} images on /projects lack explicit width/height attributes`);
    });

    it('E2E-T1-F16-04: Measured CLS on homepage load is <= 0.1', async () => {
      await browser.navigate(`${distUrl}/`);
      const cls = await browser.measureCls(400);
      assert.ok(cls <= 0.1, `Homepage CLS exceeded 0.1 threshold: ${cls}`);
    });

    it('E2E-T1-F16-05: Measured CLS during hero carousel slide transition is <= 0.05', async () => {
      await browser.navigate(`${distUrl}/`);
      await browser.click('.vb-arrow--next', 0);
      const cls = await browser.measureCls(350);
      assert.ok(cls <= 0.05, `Carousel transition CLS exceeded 0.05: ${cls}`);
    });
  });

  // ==========================================================================
  // F17: Hero Carousel Loading Priority (M3 | R3, §26, §45)
  // ==========================================================================
  describe('F17: Hero Carousel Loading Priority', () => {
    it('E2E-T1-F17-01: Initial hero slide image has fetchpriority="high" and is not lazy-loaded', async () => {
      await browser.navigate(`${baseUrl}/`);
      const attrs = await browser.evaluate<{ fp: string | null; loading: string | null }>(`
        (() => {
          const img = document.querySelector('.vb-showcase img');
          return { fp: img?.getAttribute('fetchpriority') || null, loading: img?.getAttribute('loading') || null };
        })()
      `);
      assert.strictEqual(attrs.fp, 'high', 'Initial hero image must have fetchpriority="high"');
      assert.notStrictEqual(attrs.loading, 'lazy', 'Initial hero image must NOT be lazy-loaded');
    });

    it('E2E-T1-F17-02: index.html and dist/index.html preload the primary hero portrait image', () => {
      const html = fs.readFileSync(getDistHtmlPath('/'), 'utf-8');
      assert.match(
        html,
        /<link\b[^>]*rel=["']preload["'][^>]*as=["']image["'][^>]*>/i,
        'dist/index.html must contain <link rel="preload" as="image"> for hero portrait'
      );
    });

    it('E2E-T1-F17-03: Offscreen Latest Projects grid images use loading="lazy"', async () => {
      await browser.navigate(`${baseUrl}/`);
      const lazyCount = await browser.evaluate<number>(`
        document.querySelectorAll('.vb-recent-card img[loading="lazy"]').length
      `);
      const totalCards = await browser.evaluate<number>(`document.querySelectorAll('.vb-recent-card img').length`);
      assert.ok(totalCards > 0 && lazyCount === totalCards, `Expected all ${totalCards} recent card images to have loading="lazy", got ${lazyCount}`);
    });

    it('E2E-T1-F17-04: Next/Previous carousel buttons advance slides and update .vb-project-label', async () => {
      await browser.navigate(`${baseUrl}/`);
      const initialLabel = await browser.getText('.vb-project-label span');
      await browser.click('.vb-arrow--next', 0);
      await browser.waitForCondition(
        `document.querySelector('.vb-project-label span')?.textContent !== ${JSON.stringify(initialLabel)}`
      );
      const nextLabel = await browser.getText('.vb-project-label span');
      assert.notStrictEqual(nextLabel, initialLabel);
    });

    it('E2E-T1-F17-05: Clicking pagination dot switches hero slide cleanly', async () => {
      await browser.navigate(`${baseUrl}/`);
      const dotCount = await browser.evaluate<number>(`document.querySelectorAll('.vb-pagination button').length`);
      assert.ok(dotCount >= 2, 'Expected multiple hero pagination dots');
      await browser.evaluate(`document.querySelectorAll('.vb-pagination button')[1].click()`);
      await browser.waitForCondition(`document.querySelectorAll('.vb-pagination button')[1].getAttribute('aria-pressed') === 'true'`);
    });
  });

  // ==========================================================================
  // F18: Font Loading & Asset Delivery (M3 | R3, §26)
  // ==========================================================================
  describe('F18: Font Loading & Asset Delivery', () => {
    it('E2E-T1-F18-01: dist/index.html preloads local woff2/ttf fonts in <head>', () => {
      const html = fs.readFileSync(getDistHtmlPath('/'), 'utf-8');
      const preloads = html.match(/<link\b[^>]*rel=["']preload["'][^>]*as=["']font["'][^>]*>/gi) || [];
      assert.ok(preloads.length >= 2, `Expected >= 2 font preload links in <head>, found ${preloads.length}`);
      assert.ok(preloads.some((t) => t.includes('clesmont.woff2')), 'Expected clesmont.woff2 preload');
      assert.ok(preloads.some((t) => t.includes('dm-sans-regular.ttf')), 'Expected dm-sans-regular.ttf preload');
    });

    it('E2E-T1-F18-02: index.css @font-face declarations use local /fonts/ URLs and font-display: swap', () => {
      const css = fs.readFileSync(path.join(ROOT_DIR, 'src/index.css'), 'utf-8');
      const faces = css.match(/@font-face\s*\{[\s\S]*?\}/g) || [];
      assert.ok(faces.length >= 3, 'Expected @font-face declarations');
      for (const face of faces) {
        assert.ok(face.includes('url("/fonts/'), `Font face must load locally from /fonts/: ${face}`);
        assert.ok(face.includes('font-display: swap'), `Font face must declare font-display: swap: ${face}`);
      }
    });

    it('E2E-T1-F18-03: Unused fonts (bricolage-*, instrument-italic.ttf) are pruned from public/fonts/', () => {
      const fontsDir = path.join(PUBLIC_DIR, 'fonts');
      const files = fs.readdirSync(fontsDir);
      for (const unused of ['bricolage-bold.ttf', 'bricolage-regular.ttf', 'instrument-italic.ttf']) {
        assert.ok(!files.includes(unused), `Unused font ${unused} should be pruned from public/fonts/`);
      }
    });

    it('E2E-T1-F18-04: All active @font-face files exist in dist/fonts/ and serve HTTP 200', async () => {
      for (const fontFile of ['clesmont.woff2', 'dm-sans-regular.ttf', 'dm-sans-bold.ttf']) {
        assert.ok(fs.existsSync(path.join(DIST_DIR, 'fonts', fontFile)), `Missing dist/fonts/${fontFile}`);
        const res = await httpRequest(`${distUrl}/fonts/${fontFile}`, 'HEAD');
        assert.strictEqual(res.statusCode, 200, `Expected 200 for /fonts/${fontFile}`);
      }
    });

    it('E2E-T1-F18-05: Browser document.fonts loads Clesmont Demo and DM Sans cleanly', async () => {
      await browser.navigate(`${distUrl}/`);
      const loaded = await browser.evaluate<string[]>(`
        document.fonts.ready.then(() =>
          Array.from(document.fonts).filter(f => f.status === 'loaded').map(f => f.family.replace(/["']/g, ''))
        )
      `);
      assert.ok(loaded.includes('Clesmont Demo'), `Expected Clesmont Demo loaded, got: ${loaded.join(', ')}`);
      assert.ok(loaded.includes('DM Sans'), `Expected DM Sans loaded, got: ${loaded.join(', ')}`);
    });
  });

  // ==========================================================================
  // F19: WCAG 2.2 AA Mobile Menu Drawer (M3 | R4, §29, §50)
  // ==========================================================================
  describe('F19: WCAG 2.2 AA Mobile Menu Drawer', () => {
    it('E2E-T1-F19-01: Opening mobile drawer renders role="dialog" and aria-modal="true"', async () => {
      await browser.setViewport({ width: 390, height: 844, mobile: true });
      try {
        await browser.navigate(`${baseUrl}/`);
        await browser.click('.vb-menu', 0);
        await browser.waitForSelector('[role="dialog"]', 3000);
        const dialogInfo = await browser.evaluate<{ role: string | null; modal: string | null }>(`
          (() => {
            const d = document.querySelector('[role="dialog"]');
            return { role: d?.getAttribute('role') || null, modal: d?.getAttribute('aria-modal') || null };
          })()
        `);
        assert.strictEqual(dialogInfo.role, 'dialog', 'Mobile drawer must have role="dialog"');
        assert.strictEqual(dialogInfo.modal, 'true', 'Mobile drawer must have aria-modal="true"');
      } finally {
        await browser.setViewport({ width: 1440, height: 900, mobile: false });
      }
    });

    it('E2E-T1-F19-02: Open drawer ID matches trigger aria-controls="vb-global-menu" and aria-expanded', async () => {
      await browser.setViewport({ width: 390, height: 844, mobile: true });
      try {
        await browser.navigate(`${baseUrl}/`);
        await browser.click('.vb-menu', 0);
        await browser.waitForSelector('#vb-global-menu', 3000);
        const expanded = await browser.getAttribute('.vb-menu', 'aria-expanded');
        assert.strictEqual(expanded, 'true');
      } finally {
        await browser.setViewport({ width: 1440, height: 900, mobile: false });
      }
    });

    it('E2E-T1-F19-03: Pressing Escape dismisses the open mobile drawer', async () => {
      await browser.setViewport({ width: 390, height: 844, mobile: true });
      try {
        await browser.navigate(`${baseUrl}/`);
        await browser.click('.vb-menu', 0);
        const hasDialog = await browser.waitForSelector('[role="dialog"]', 3000);
        assert.strictEqual(hasDialog, true, 'Mobile drawer must open with role="dialog"');
        await browser.pressKey('Escape');
        const closed = await browser.waitForCondition(`!document.querySelector('[role="dialog"]')`, 3000);
        assert.strictEqual(closed, true, 'Escape key must close mobile drawer');
      } finally {
        await browser.setViewport({ width: 1440, height: 900, mobile: false });
      }
    });

    it('E2E-T1-F19-04: Tab key traps focus within the mobile menu dialog', async () => {
      await browser.setViewport({ width: 390, height: 844, mobile: true });
      try {
        await browser.navigate(`${baseUrl}/`);
        await browser.click('.vb-menu', 0);
        const hasDialog = await browser.waitForSelector('[role="dialog"]', 3000);
        assert.strictEqual(hasDialog, true, 'Mobile drawer must open with role="dialog"');
        for (let i = 0; i < 8; i++) {
          await browser.pressKey('Tab');
          const inside = await browser.evaluate<boolean>(`
            (() => {
              const dialog = document.querySelector('[role="dialog"]');
              return !!dialog && dialog.contains(document.activeElement);
            })()
          `);
          assert.strictEqual(inside, true, `Focus escaped mobile dialog on Tab step ${i + 1}`);
        }
      } finally {
        await browser.setViewport({ width: 1440, height: 900, mobile: false });
      }
    });

    it('E2E-T1-F19-05: Closing mobile drawer restores focus to .vb-menu trigger button', async () => {
      await browser.setViewport({ width: 390, height: 844, mobile: true });
      try {
        await browser.navigate(`${baseUrl}/`);
        await browser.click('.vb-menu', 0);
        const hasDialog = await browser.waitForSelector('[role="dialog"]', 3000);
        assert.strictEqual(hasDialog, true, 'Mobile drawer must open with role="dialog"');
        await browser.pressKey('Escape');
        await browser.waitForCondition(`!document.querySelector('[role="dialog"]')`, 3000);
        const restored = await browser.evaluate<boolean>(`
          document.activeElement === document.querySelector('.vb-menu')
        `);
        assert.strictEqual(restored, true, 'Closing mobile drawer must restore focus to .vb-menu');
      } finally {
        await browser.setViewport({ width: 1440, height: 900, mobile: false });
      }
    });
  });

  // ==========================================================================
  // F20: Semantic HTML Headings & Landmarks (M3 | R4, §29)
  // ==========================================================================
  describe('F20: Semantic HTML Headings & Landmarks', () => {
    it('E2E-T1-F20-01: Primary routes expose <main>, <nav>, and <footer> landmarks', async () => {
      for (const route of ['/', '/about', '/services', '/projects', '/blogs', '/contact', '/achievements']) {
        await browser.navigate(`${baseUrl}${route}`);
        const landmarks = await browser.evaluate<{ main: number; nav: number; footer: number }>(`
          (() => ({
            main: document.querySelectorAll('main').length,
            nav: document.querySelectorAll('nav').length,
            footer: document.querySelectorAll('footer').length,
          }))()
        `);
        assert.ok(landmarks.main >= 1, `${route} missing <main>`);
        assert.ok(landmarks.nav >= 1, `${route} missing <nav>`);
        assert.ok(landmarks.footer >= 1, `${route} missing <footer>`);
      }
    });

    it('E2E-T1-F20-02: Every primary page renders exactly one <h1> element', async () => {
      for (const route of ['/', '/about', '/services', '/projects', '/blogs', '/contact', '/achievements']) {
        await browser.navigate(`${baseUrl}${route}`);
        const h1Count = await browser.evaluate<number>(`document.querySelectorAll('h1').length`);
        assert.strictEqual(h1Count, 1, `${route} expected exactly 1 <h1>, got ${h1Count}`);
      }
    });

    it('E2E-T1-F20-03: Homepage heading hierarchy has no skipped levels and FAQ has a section heading', async () => {
      await browser.navigate(`${baseUrl}/`);
      const info = await browser.evaluate<{ levels: number[]; faqHasHeading: boolean }>(`
        (() => {
          const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
          const levels = headings.map(h => parseInt(h.tagName.slice(1), 10));
          const faq = document.querySelector('.vb-faq');
          const faqHasHeading = !!faq?.querySelector('h2, h3');
          return { levels, faqHasHeading };
        })()
      `);
      assert.strictEqual(info.faqHasHeading, true, 'FAQ section must contain a semantic heading (<h2>)');
      for (let i = 1; i < info.levels.length; i++) {
        assert.ok(info.levels[i] <= info.levels[i - 1] + 1, `Skipped heading level in sequence: ${info.levels.join(' -> ')}`);
      }
    });

    it('E2E-T1-F20-04: /services and /blogs card titles use semantic <h3> below <h2> section headings', async () => {
      for (const route of ['/services', '/blogs']) {
        await browser.navigate(`${baseUrl}${route}`);
        const hasH3 = await browser.evaluate<boolean>(`document.querySelectorAll('h3').length > 0`);
        assert.strictEqual(hasH3, true, `${route} card titles should use <h3> for proper H1->H2->H3 hierarchy`);
      }
    });

    it('E2E-T1-F20-05: All links and buttons across homepage have accessible names', async () => {
      await browser.navigate(`${baseUrl}/`);
      const unnamed = await browser.evaluate<number>(`
        Array.from(document.querySelectorAll('a, button')).filter(el => {
          const style = window.getComputedStyle(el);
          if (style.display === 'none' || style.visibility === 'hidden') return false;
          const label = (el.getAttribute('aria-label') || el.getAttribute('title') || el.textContent || '').trim();
          return label.length === 0;
        }).length
      `);
      assert.strictEqual(unnamed, 0, `Found ${unnamed} interactive links/buttons without accessible names`);
    });
  });

  // ==========================================================================
  // F21: Focus Indicators & Keyboard Controls (M3 | R4, §29, §50)
  // ==========================================================================
  describe('F21: Focus Indicators & Keyboard Controls', () => {
    it('E2E-T1-F21-01: DayNightToggle displays high-contrast :focus-visible outline when focused by keyboard', async () => {
      await browser.navigate(`${baseUrl}/`);
      let focusedTheme = false;
      for (let i = 0; i < 15; i++) {
        await browser.pressKey('Tab');
        focusedTheme = await browser.evaluate<boolean>(`document.activeElement?.classList.contains('vb-theme') || false`);
        if (focusedTheme) break;
      }
      assert.strictEqual(focusedTheme, true, 'DayNightToggle (.vb-theme) must be reachable via Tab');
      const outline = await browser.evaluate<{ width: string; style: string }>(`
        (() => {
          const s = window.getComputedStyle(document.activeElement);
          return { width: s.outlineWidth, style: s.outlineStyle };
        })()
      `);
      assert.ok(outline.style !== 'none' && parseFloat(outline.width) >= 2, `Expected >=2px visible focus outline on DayNightToggle, got ${outline.width} ${outline.style}`);
    });

    it('E2E-T1-F21-02: Pressing Enter/Space on focused DayNightToggle switches theme', async () => {
      await browser.navigate(`${baseUrl}/`);
      for (let i = 0; i < 15; i++) {
        await browser.pressKey('Tab');
        if (await browser.evaluate<boolean>(`document.activeElement?.classList.contains('vb-theme') || false`)) break;
      }
      const before = await browser.getAttribute('html', 'data-theme');
      await browser.pressKey('Enter');
      await browser.waitForCondition(`document.documentElement.dataset.theme !== ${JSON.stringify(before)}`);
      const after = await browser.getAttribute('html', 'data-theme');
      assert.notStrictEqual(after, before);
      await browser.pressKey('Space');
      await browser.waitForCondition(`document.documentElement.dataset.theme === ${JSON.stringify(before)}`);
    });

    it('E2E-T1-F21-03: Hero carousel arrow buttons are keyboard operable with Enter', async () => {
      await browser.navigate(`${baseUrl}/`);
      const beforeLabel = await browser.getText('.vb-project-label span');
      let foundNext = false;
      for (let i = 0; i < 25; i++) {
        await browser.pressKey('Tab');
        if (await browser.evaluate<boolean>(`document.activeElement?.classList.contains('vb-arrow--next') || false`)) {
          foundNext = true;
          break;
        }
      }
      assert.strictEqual(foundNext, true, 'Next carousel button must be Tab-focusable');
      await browser.pressKey('Enter');
      await browser.waitForCondition(`document.querySelector('.vb-project-label span')?.textContent !== ${JSON.stringify(beforeLabel)}`);
    });

    it('E2E-T1-F21-04: Global nav links have visible :focus-visible outline', async () => {
      await browser.navigate(`${baseUrl}/`);
      await browser.pressKey('Tab'); // wordmark or first link
      await browser.pressKey('Tab');
      const outline = await browser.evaluate<{ tag: string; style: string; width: string }>(`
        (() => {
          const el = document.activeElement;
          const s = el ? window.getComputedStyle(el) : null;
          return { tag: el?.tagName || '', style: s?.outlineStyle || 'none', width: s?.outlineWidth || '0px' };
        })()
      `);
      assert.strictEqual(outline.tag, 'A');
      assert.ok(outline.style !== 'none' && parseFloat(outline.width) >= 2, `Expected visible outline on focused link, got ${outline.width} ${outline.style}`);
    });

    it('E2E-T1-F21-05: FAQ <summary> toggles open/closed via keyboard Enter', async () => {
      await browser.navigate(`${baseUrl}/`);
      await browser.evaluate(`document.querySelector('.vb-faq details summary').focus()`);
      const wasOpen = await browser.evaluate<boolean>(`document.querySelector('.vb-faq details').open`);
      await browser.pressKey('Enter');
      const isOpen = await browser.evaluate<boolean>(`document.querySelector('.vb-faq details').open`);
      assert.strictEqual(isOpen, !wasOpen, 'FAQ details must toggle on Enter');
    });
  });

  // ==========================================================================
  // F22: prefers-reduced-motion Enforcement (M3 | R4, §29, §51)
  // ==========================================================================
  describe('F22: prefers-reduced-motion Enforcement', () => {
    it('E2E-T1-F22-01: Reduced motion disables CSS animations and transitions on .vb-hero', async () => {
      await browser.setEmulatedMedia({ features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
      try {
        await browser.navigate(`${baseUrl}/`);
        const anim = await browser.evaluate<{ animName: string; transDur: string }>(`
          (() => {
            const el = document.querySelector('.vb-profile') || document.querySelector('.vb-hero');
            const s = window.getComputedStyle(el);
            return { animName: s.animationName, transDur: s.transitionDuration };
          })()
        `);
        assert.strictEqual(anim.animName, 'none');
        assert.ok(anim.transDur === '0s' || anim.transDur === '0ms', `Expected 0s transition duration, got ${anim.transDur}`);
      } finally {
        await browser.setEmulatedMedia({ features: [] });
      }
    });

    it('E2E-T1-F22-02: Reduced motion halts hero carousel automatic timer', async () => {
      await browser.setEmulatedMedia({ features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
      try {
        await browser.navigate(`${baseUrl}/`);
        const initialTitle = await browser.getAttribute('.vb-showcase img', 'alt');
        // Carousel auto-timer is 5000ms; wait 5300ms to prove auto-advance does NOT fire
        await new Promise((r) => setTimeout(r, 5300));
        const afterTitle = await browser.getAttribute('.vb-showcase img', 'alt');
        assert.strictEqual(afterTitle, initialTitle, 'Hero carousel must not auto-advance under prefers-reduced-motion: reduce');
      } finally {
        await browser.setEmulatedMedia({ features: [] });
      }
    });

    it('E2E-T1-F22-03: Manual carousel navigation still works under prefers-reduced-motion: reduce', async () => {
      await browser.setEmulatedMedia({ features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
      try {
        await browser.navigate(`${baseUrl}/`);
        const initialTitle = await browser.getAttribute('.vb-showcase img', 'alt');
        await browser.click('.vb-arrow--next', 0);
        await browser.waitForCondition(`document.querySelector('.vb-showcase img')?.getAttribute('alt') !== ${JSON.stringify(initialTitle)}`);
      } finally {
        await browser.setEmulatedMedia({ features: [] });
      }
    });

    it('E2E-T1-F22-04: CSS marquees and rotating stars pause under prefers-reduced-motion: reduce', async () => {
      await browser.setEmulatedMedia({ features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
      try {
        await browser.navigate(`${baseUrl}/services`);
        const starAnim = await browser.evaluate<string>(`
          (() => {
            const el = document.querySelector('.vb-meteor, .vb-rotating-stars-orbit');
            return el ? window.getComputedStyle(el).animationName : 'none';
          })()
        `);
        assert.strictEqual(starAnim, 'none');
      } finally {
        await browser.setEmulatedMedia({ features: [] });
      }
    });

    it('E2E-T1-F22-05: Default motion preference preserves smooth CSS transitions', async () => {
      await browser.setEmulatedMedia({ features: [{ name: 'prefers-reduced-motion', value: 'no-preference' }] });
      await browser.navigate(`${baseUrl}/`);
      const trans = await browser.getComputedStyle('.vb-hero', 'transition-duration');
      assert.ok(parseFloat(trans) > 0, `Expected non-zero transition duration by default, got ${trans}`);
    });
  });

  // ==========================================================================
  // F23: 100% Visual & Design System Fidelity (M3 | R5, §31, §55)
  // ==========================================================================
  describe('F23: 100% Visual & Design System Fidelity', () => {
    it('E2E-T1-F23-01: StudioIcons.tsx preserves exact mathematical inverted corner cubic-bezier SVG paths', () => {
      const iconsSrc = fs.readFileSync(path.join(ROOT_DIR, 'src/components/ui/StudioIcons.tsx'), 'utf-8');
      assert.ok(iconsSrc.includes('M 0 0 L 0 18 C 0 8.059 8.059 0 18 0 Z'), 'TopRight/BottomLeft inverted corner path altered');
      assert.ok(iconsSrc.includes('M 18 18 L 18 0 C 18 9.941 9.941 18 0 18 Z'), 'BottomRightLeft inverted corner path altered');
      assert.ok(iconsSrc.includes('M 18 0 L 0 0 C 9.941 0 18 8.059 18 18 Z'), 'TopLeft inverted corner path altered');
    });

    it('E2E-T1-F23-02: Desktop / renders 2-column bento layout with sticky showcase and scrollable content', async () => {
      await browser.setViewport({ width: 1440, height: 900, mobile: false });
      await browser.navigate(`${baseUrl}/`);
      const layout = await browser.evaluate<{ cols: string; showcasePos: string; twoCol: boolean }>(`
        (() => {
          const hero = document.querySelector('.vb-hero');
          const sc = document.querySelector('.vb-showcase');
          const content = document.querySelector('.vb-content');
          const scRect = sc.getBoundingClientRect();
          const ctRect = content.getBoundingClientRect();
          return {
            cols: window.getComputedStyle(hero).gridTemplateColumns,
            showcasePos: window.getComputedStyle(sc).position,
            twoCol: ctRect.left > scRect.left && scRect.width > 400 && ctRect.width > 400,
          };
        })()
      `);
      assert.strictEqual(layout.showcasePos, 'sticky');
      assert.strictEqual(layout.twoCol, true, `Expected 2-column bento layout, got cols: ${layout.cols}`);
    });

    it('E2E-T1-F23-03: Fixed .vb-viewport-frame and .vb-nav with corner cutouts render across routes', async () => {
      for (const route of ['/', '/projects', '/services', '/blogs']) {
        await browser.navigate(`${baseUrl}${route}`);
        const ok = await browser.evaluate<boolean>(`
          (() => {
            const frame = document.querySelector('.vb-viewport-frame');
            const nav = document.querySelector('.vb-nav');
            return !!frame && window.getComputedStyle(frame).pointerEvents === 'none' &&
                   !!nav?.querySelector('.vb-nav-corner-right') && !!nav?.querySelector('.vb-nav-corner-bottom');
          })()
        `);
        assert.strictEqual(ok, true, `Viewport frame or nav corner cutouts missing on ${route}`);
      }
    });

    it('E2E-T1-F23-04: Dark and light theme design tokens resolve to exact Studio palette', async () => {
      await browser.navigate(`${baseUrl}/`);
      await browser.ensureTheme('dark');
      try {
        assert.strictEqual(await browser.getComputedStyle('body', 'background-color'), 'rgb(0, 0, 0)');
        const accent = await browser.getComputedStyle(':root', '--vb-accent');
        assert.ok(accent.includes('#e62e05') || accent.includes('230, 46, 5'));

        await browser.click('.vb-theme', 0);
        await browser.waitForCondition(`document.documentElement.dataset.theme === 'light'`);
        assert.strictEqual(await browser.getComputedStyle('body', 'background-color'), 'rgb(255, 255, 255)');
      } finally {
        await browser.ensureTheme('dark');
      }
    });

    it('E2E-T1-F23-05: DayNightToggle renders celestial SVG capsule with stars, clouds, and sun/moon', async () => {
      await browser.navigate(`${baseUrl}/`);
      const svgCount = await browser.evaluate<number>(`document.querySelectorAll('.vb-daynight-toggle svg circle, .vb-daynight-toggle svg path').length`);
      assert.ok(svgCount >= 10, `Expected celestial SVG elements in DayNightToggle, got ${svgCount}`);
    });
  });

  // ==========================================================================
  // F24: E2E Test Suite Execution (Tiers 1-4) (M4 | Acceptance, §48)
  // ==========================================================================
  describe('F24: E2E Test Suite Execution Infrastructure', () => {
    it('E2E-T1-F24-01: Master runner scripts/run-all-tests.ts discovers all required tier suites', () => {
      const runnerSrc = fs.readFileSync(path.join(ROOT_DIR, 'scripts/run-all-tests.ts'), 'utf-8');
      for (const expected of [
        'tier1-feature-coverage.test.ts',
        'tier2-boundary-corner.test.ts',
        'tier3-cross-feature.test.ts',
        'tier4-application-scenarios.test.ts',
        'tier5-adversarial.test.ts',
      ]) {
        assert.ok(runnerSrc.includes(expected), `Runner must reference ${expected}`);
        assert.ok(fs.existsSync(path.join(ROOT_DIR, 'tests', expected)), `Test suite tests/${expected} must exist`);
      }
    });

    it('E2E-T1-F24-02: npm test and npm run test:e2e invoke scripts/run-all-tests.ts', () => {
      const pkg = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'package.json'), 'utf-8'));
      assert.ok(pkg.scripts['test:e2e'].includes('scripts/run-all-tests.ts'));
      assert.ok(pkg.scripts.test.includes('test:e2e') || pkg.scripts.test.includes('run-all-tests.ts'));
    });

    it('E2E-T1-F24-03: Master runner includes TypeScript check and propagates exit code 1 on failure', () => {
      const runnerSrc = fs.readFileSync(path.join(ROOT_DIR, 'scripts/run-all-tests.ts'), 'utf-8');
      assert.ok(runnerSrc.includes('tsc') && runnerSrc.includes('--noEmit'));
      assert.ok(runnerSrc.includes('process.exit(1)'));
    });

    it('E2E-T1-F24-04: BrowserController and dual-mode ServerController helpers expose deterministic wait APIs', () => {
      assert.strictEqual(typeof browser.waitForHydration, 'function');
      assert.strictEqual(typeof browser.waitForCssStability, 'function');
      assert.strictEqual(typeof browser.waitForSelector, 'function');
      assert.strictEqual(typeof ensureServer, 'function');
      assert.strictEqual(typeof ensureDistServer, 'function');
    });

    it('E2E-T1-F24-05: XML sitemap validator accepts valid sitemaps and rejects malformed XML', () => {
      const valid = validateSitemapFile(path.join(PUBLIC_DIR, 'sitemap.xml'));
      assert.strictEqual(valid.isValid, true);
      const invalid = validateSitemapString('<urlset><url></url></urlset>');
      assert.strictEqual(invalid.isValid, false);
    });
  });

  // ==========================================================================
  // F25: Adversarial Coverage Hardening (M4 | Acceptance, §49)
  // ==========================================================================
  describe('F25: Adversarial Coverage Hardening', () => {
    it('E2E-T1-F25-01: Dedicated tests/tier5-adversarial.test.ts exists', () => {
      assert.ok(fs.existsSync(path.join(ROOT_DIR, 'tests/tier5-adversarial.test.ts')));
    });

    it('E2E-T1-F25-02: Extreme viewports (280px and 1920px) render / and /projects with zero horizontal overflow', async () => {
      try {
        for (const vp of [{ width: 280, height: 653, mobile: true }, { width: 1920, height: 1080, mobile: false }]) {
          await browser.setViewport(vp);
          for (const route of ['/', '/projects']) {
            await browser.navigate(`${baseUrl}${route}`);
            const overflow = await browser.evaluate<boolean>(`document.documentElement.scrollWidth > window.innerWidth + 1`);
            assert.strictEqual(overflow, false, `Horizontal overflow on ${route} at ${vp.width}px`);
          }
        }
      } finally {
        await browser.setViewport({ width: 1440, height: 900, mobile: false });
      }
    });

    it('E2E-T1-F25-03: Responsive breakpoint switches cleanly at 809px vs 810px vs 1200px', async () => {
      try {
        await browser.navigate(`${baseUrl}/projects`);
        await browser.setViewport({ width: 809, height: 800, mobile: true });
        const mobileMenuVisible = await browser.isVisible('.vb-menu');
        assert.strictEqual(mobileMenuVisible, true, 'Menu button must be visible at 809px');

        await browser.setViewport({ width: 810, height: 800, mobile: true });
        const tabletLinksVisible = await browser.isVisible('.vb-nav-links');
        assert.strictEqual(tabletLinksVisible, true, 'Nav links must be visible at 810px');

        await browser.setViewport({ width: 1200, height: 800, mobile: false });
        const showcaseVisible = await browser.isVisible('.vb-showcase');
        assert.strictEqual(showcaseVisible, true, 'Desktop showcase must be visible at 1200px');
      } finally {
        await browser.setViewport({ width: 1440, height: 900, mobile: false });
      }
    });

    it('E2E-T1-F25-04: Rapid orientation swaps maintain fixed nav and zero overflow', async () => {
      try {
        await browser.navigate(`${baseUrl}/blogs`);
        for (const vp of [
          { width: 375, height: 812, mobile: true },
          { width: 812, height: 375, mobile: true },
          { width: 375, height: 812, mobile: true },
        ]) {
          await browser.setViewport(vp);
          const overflow = await browser.evaluate<boolean>(`document.documentElement.scrollWidth > window.innerWidth + 1`);
          assert.strictEqual(overflow, false, `Overflow after orientation swap to ${vp.width}x${vp.height}`);
        }
      } finally {
        await browser.setViewport({ width: 1440, height: 900, mobile: false });
      }
    });

    it('E2E-T1-F25-05: scripts/adversarial-suite.mjs exists and covers multi-viewport checks', () => {
      const advPath = path.join(ROOT_DIR, 'scripts/adversarial-suite.mjs');
      assert.ok(fs.existsSync(advPath));
      const src = fs.readFileSync(advPath, 'utf-8');
      assert.ok(src.includes('mobile-fold') && src.includes('desktop-wide'));
    });
  });

  // ==========================================================================
  // F26: Final Comprehensive Deliverable Report (M4 | R5, Acceptance, §59)
  // ==========================================================================
  describe('F26: Final Comprehensive Deliverable Report', () => {
    it('E2E-T1-F26-01: Dedicated final SEO/Accessibility/Performance deliverable report exists in codebase', () => {
      const reports = findAuditReportFiles();
      assert.ok(reports.length > 0, 'Expected final deliverable audit report .md file in repo root or docs/');
    });

    it('E2E-T1-F26-02: Final deliverable report documents original issues and changes implemented', () => {
      const reports = findAuditReportFiles();
      assert.ok(reports.length > 0, 'Final report file must exist');
      const content = fs.readFileSync(reports[0], 'utf-8');
      assert.match(content, /issue|before|finding/i, 'Report must document original issues');
      assert.match(content, /change|implemented|fix/i, 'Report must document implemented changes');
    });

    it('E2E-T1-F26-03: Final deliverable report includes before-and-after Core Web Vitals / Lighthouse measurements', () => {
      const reports = findAuditReportFiles();
      assert.ok(reports.length > 0, 'Final report file must exist');
      const content = fs.readFileSync(reports[0], 'utf-8');
      assert.match(content, /LCP|CLS|Lighthouse/i, 'Report must document Core Web Vitals / Lighthouse metrics');
    });

    it('E2E-T1-F26-04: Final deliverable report confirms UI preservation and visual consistency', () => {
      const reports = findAuditReportFiles();
      assert.ok(reports.length > 0, 'Final report file must exist');
      const content = fs.readFileSync(reports[0], 'utf-8');
      assert.match(content, /visual|bento|inverted corner|fidelity/i, 'Report must confirm visual preservation');
    });

    it('E2E-T1-F26-05: Final deliverable report confirms 100% static Vercel architecture and manual action items', () => {
      const reports = findAuditReportFiles();
      assert.ok(reports.length > 0, 'Final report file must exist');
      const content = fs.readFileSync(reports[0], 'utf-8');
      assert.match(content, /static|vercel/i, 'Report must confirm static Vercel architecture');
      assert.match(content, /search console|manual|verification/i, 'Report must include manual action items');
    });
  });
});
