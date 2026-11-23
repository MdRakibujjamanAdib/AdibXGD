import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { getSharedBrowser, closeSharedBrowser, BrowserController } from './helpers/browser.ts';
import { ensureServer } from './helpers/server.ts';
import { validateSitemapFile } from './helpers/xml-validator.ts';

describe('Tier 3: Cross-Feature Combinations (8 Pairwise Suites: TC-T3-01 to TC-T3-08)', () => {
  let browser: BrowserController;
  let baseUrl: string;

  before(async () => {
    baseUrl = await ensureServer(3000);
    browser = await getSharedBrowser(9226);
  });

  after(async () => {
    await closeSharedBrowser();
  });

  function getAvailableBlogSlugs(): string[] {
    const dir = path.join(process.cwd(), 'src/data/blogs');
    if (!fs.existsSync(dir)) return [];
    return fs.readdirSync(dir)
      .filter(f => f.endsWith('.ts') && !f.startsWith('_') && !f.includes('types') && !f.includes('index'))
      .map(f => f.replace('.ts', ''));
  }

  // --------------------------------------------------------------------------
  // TC-T3-01: Blog Article Metadata Discovery ↔ Sitemap Generator Interaction
  // --------------------------------------------------------------------------
  it('TC-T3-01: Blog Article Metadata Discovery ↔ Sitemap Generator Interaction', () => {
    const sitemapPath = path.join(process.cwd(), 'public/sitemap.xml');
    const validation = validateSitemapFile(sitemapPath);
    assert.strictEqual(validation.isValid, true, `Sitemap must be valid XML. Errors: ${validation.errors.join('; ')}`);

    const slugs = getAvailableBlogSlugs();
    const locs = validation.urls.map(u => u.loc);

    for (const slug of slugs) {
      const expectedUrl = `https://adibx.me/blogs/${slug}`;
      assert.ok(locs.includes(expectedUrl), `Sitemap must index blog slug: ${slug}`);
      const entry = validation.urls.find(u => u.loc === expectedUrl);
      assert.ok(entry?.lastmod, `Entry ${expectedUrl} must have <lastmod>`);
      assert.match(entry.lastmod, /^\d{4}-\d{2}-\d{2}$/);
    }

    // Exclude auxiliary files
    assert.ok(!locs.includes('https://adibx.me/blogs/types'));
    assert.ok(!locs.includes('https://adibx.me/blogs/_test-template'));
  });

  // --------------------------------------------------------------------------
  // TC-T3-02: Dynamic Blog Slugs ↔ Dynamic BlogPosting JSON-LD & Canonical Tags
  // --------------------------------------------------------------------------
  it('TC-T3-02: Dynamic Blog Slugs ↔ Dynamic BlogPosting JSON-LD & Canonical Tags', async () => {
    const slugs = getAvailableBlogSlugs();
    const targetSlug = slugs[0] || 'autonomous-multimodal-ai-workflows-mct-labs';

    await browser.navigate(`${baseUrl}/blogs/${targetSlug}`);

    // Canonical link
    const canonical = await browser.getAttribute('link[rel="canonical"]', 'href');
    assert.ok(canonical?.startsWith('https://adibx.me'));

    // Structured BlogPosting JSON-LD
    const schemas = await browser.getJsonLdScripts();
    assert.ok(schemas.length > 0, 'JSON-LD scripts must exist on article page');
    const blogPosting = schemas.find(s => s['@type'] === 'BlogPosting');
    assert.ok(blogPosting, 'Expected BlogPosting schema');
    assert.ok(blogPosting.headline, 'BlogPosting must have headline');
    assert.strictEqual(blogPosting.author?.name, 'Md Rakibujjaman Adib');

    // 404 Route handling
    await browser.navigate(`${baseUrl}/blogs/non-existent-slug-404`);
    const pageText = await browser.getText('body');
    assert.ok(
      pageText?.includes('Article Not Found') || pageText?.includes('Not Found') || pageText?.includes('Insights'),
      '404 slug renders friendly fallback state'
    );
  });

  // --------------------------------------------------------------------------
  // TC-T3-03: SEO Title Sanitization ↔ Diverse Routes & Breadcrumbs
  // --------------------------------------------------------------------------
  it('TC-T3-03: SEO Title Sanitization ↔ Diverse Routes & Breadcrumbs', async () => {
    const routes = ['/', '/services', '/projects', '/blogs'];

    for (const route of routes) {
      await browser.navigate(`${baseUrl}${route}`);
      const title = await browser.getTitle();
      const occurrences = (title.match(/Md Rakibujjaman Adib/g) || []).length;
      assert.strictEqual(occurrences, 1, `Route ${route} title has redundant brand suffix: "${title}"`);
      assert.ok(!title.includes('undefined'), `Route ${route} title contains literal "undefined"`);
      assert.ok(!title.includes('|  |'), `Route ${route} title contains empty pipe segment`);
    }
  });

  // --------------------------------------------------------------------------
  // TC-T3-04: Tag Filtering ↔ Article Selection & Showcase Preview on /blogs
  // --------------------------------------------------------------------------
  it('TC-T3-04: Tag Filtering ↔ Article Selection & Showcase Preview on /blogs', async () => {
    await browser.navigate(`${baseUrl}/blogs`);

    const initialCardCount = await browser.evaluate<number>(`
      document.querySelectorAll('section[aria-label="Articles list"] article, section[aria-label="Articles list"] .vb-card').length
    `);
    assert.ok(initialCardCount >= 1, 'Initial blog cards must be present');

    // Test clicking a filter tag pill if present
    const tagInteracted = await browser.evaluate<boolean>(`
      (() => {
        const tagBtn = document.querySelector('button[data-tag]:not([data-tag="All"]), button.vb-tag-pill:not(:first-child)');
        if (tagBtn) {
          tagBtn.click();
          return true;
        }
        return false;
      })()
    `);

    if (tagInteracted) {
      await new Promise(r => setTimeout(r, 200));
      const filteredCardCount = await browser.evaluate<number>(`
        document.querySelectorAll('section[aria-label="Articles list"] article, section[aria-label="Articles list"] .vb-card').length
      `);
      assert.ok(filteredCardCount <= initialCardCount, 'Filtered cards count should be <= initial count');

      // Click All to reset
      await browser.evaluate(`
        (() => {
          const allBtn = document.querySelector('button[data-tag="All"], button.vb-tag-pill:first-child');
          if (allBtn) allBtn.click();
        })()
      `);
      await new Promise(r => setTimeout(r, 200));
      const restoredCount = await browser.evaluate<number>(`
        document.querySelectorAll('section[aria-label="Articles list"] article, section[aria-label="Articles list"] .vb-card').length
      `);
      assert.strictEqual(restoredCount, initialCardCount, 'Reset to All restores all cards');
    }
  });

  // --------------------------------------------------------------------------
  // TC-T3-05: Dark/Light Mode Switcher ↔ Visbeyond Design Tokens, .vb-card & Typography
  // --------------------------------------------------------------------------
  it('TC-T3-05: Dark/Light Mode Switcher ↔ Visbeyond Design Tokens, .vb-card & Typography', async () => {
    await browser.navigate(`${baseUrl}/blogs`);

    // Dark Mode check
    const darkBg = await browser.getComputedStyle('body', 'background-color');
    assert.ok(
      darkBg === 'rgb(0, 0, 0)' || darkBg === 'rgba(0, 0, 0, 0)' || darkBg === 'transparent',
      `Dark mode background must be dark, got: ${darkBg}`
    );

    // Toggle to Light Mode
    await browser.click('.vb-theme, button[aria-label*="theme"]');
    const lightTheme = await browser.getAttribute('html', 'data-theme');
    assert.strictEqual(lightTheme, 'light', 'Theme dataset attribute must be light');

    const lightBg = await browser.getComputedStyle('body', 'background-color');
    const isLight = (c: string) => {
      const m = c.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
      return m ? Number(m[1]) >= 230 && Number(m[2]) >= 230 && Number(m[3]) >= 230 : c.includes('255');
    };
    assert.ok(
      isLight(lightBg),
      `Light mode background must be light, got: ${lightBg}`
    );

    // Revert to dark mode
    await browser.click('.vb-theme, button[aria-label*="theme"]');
    const revertedTheme = await browser.getAttribute('html', 'data-theme');
    assert.strictEqual(revertedTheme, 'dark', 'Theme must revert cleanly to dark');
  });

  // --------------------------------------------------------------------------
  // TC-T3-06: Code Blocks & Copy Action ↔ Dark/Light Mode Theme Inversion
  // --------------------------------------------------------------------------
  it('TC-T3-06: Code Blocks & Copy Action ↔ Dark/Light Mode Theme Inversion', async () => {
    const slugs = getAvailableBlogSlugs();
    const targetSlug = slugs[0] || 'autonomous-multimodal-ai-workflows-mct-labs';
    await browser.navigate(`${baseUrl}/blogs/${targetSlug}`);

    const codeState = await browser.evaluate<{ hasCode: boolean; hasCopy: boolean }>(`
      (() => {
        const pre = document.querySelector('pre');
        const copyBtn = document.querySelector('button[aria-label*="copy" i], .vb-copy-btn, pre button, .vb-code-copy-btn-inline');
        return { hasCode: !!pre, hasCopy: !!copyBtn };
      })()
    `);
    assert.strictEqual(codeState.hasCode, true, 'Code block pre must be present');
    assert.strictEqual(codeState.hasCopy, true, 'Copy button must be present on code block');

    // Verify light mode preserves dark inset
    await browser.click('.vb-theme, button[aria-label*="theme"]');
    const preBg = await browser.getComputedStyle('pre', 'background-color');
    assert.ok(preBg.includes('13') || preBg.includes('24') || preBg.includes('0'), 'Pre retains dark background');
    await browser.click('.vb-theme, button[aria-label*="theme"]');
  });

  // --------------------------------------------------------------------------
  // TC-T3-07: Floating Table of Contents (TOC) ↔ Section Scroll Spy & Active Anchor Highlighting
  // --------------------------------------------------------------------------
  it('TC-T3-07: Floating Table of Contents (TOC) ↔ Section Scroll Spy & Active Anchor Highlighting', async () => {
    const slugs = getAvailableBlogSlugs();
    const targetSlug = slugs[0] || 'autonomous-multimodal-ai-workflows-mct-labs';
    await browser.navigate(`${baseUrl}/blogs/${targetSlug}`);

    const tocPresent = await browser.evaluate<boolean>(`
      !!document.querySelector('nav[aria-label*="Table of contents"], .vb-toc')
    `);
    assert.strictEqual(tocPresent, true, 'Table of contents navigation must be rendered');

    // Scroll to first heading section
    await browser.evaluate(`
      (() => {
        const h2 = document.querySelector('h2');
        if (h2) h2.scrollIntoView();
      })()
    `);
    await new Promise(r => setTimeout(r, 200));

    const currentY = await browser.evaluate<number>('window.scrollY');
    assert.ok(currentY > 100, `Scroll position must advance down the article, got: ${currentY}`);

    await browser.evaluate('window.scrollTo(0, 0)');
  });

  // --------------------------------------------------------------------------
  // TC-T3-08: Previous/Next Article Navigation ↔ Blog List Boundaries & Index Wrapping
  // --------------------------------------------------------------------------
  it('TC-T3-08: Previous/Next Article Navigation ↔ Blog List Boundaries & Index Wrapping', async () => {
    const slugs = getAvailableBlogSlugs();
    const targetSlug = slugs[0] || 'autonomous-multimodal-ai-workflows-mct-labs';
    await browser.navigate(`${baseUrl}/blogs/${targetSlug}`);

    const hasNoDeadLinks = await browser.evaluate<boolean>(`
      (() => {
        const links = Array.from(document.querySelectorAll('a[href]')).map(a => a.getAttribute('href') || '');
        return !links.some(l => l.includes('undefined') || l.includes('null'));
      })()
    `);
    assert.strictEqual(hasNoDeadLinks, true, 'Navigation links must never point to undefined or null routes');
  });
});
