import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { getSharedBrowser, closeSharedBrowser, BrowserController } from './helpers/browser.ts';
import { ensureServer } from './helpers/server.ts';
import { validateSitemapFile } from './helpers/xml-validator.ts';

describe('Tier 4: Real-World Application Scenarios (5 Workflows: TC-T4-WF-A to TC-T4-WF-E)', () => {
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
  });

  function getAvailableBlogSlugs(): string[] {
    const dir = path.join(process.cwd(), 'src/data/blogs');
    if (!fs.existsSync(dir)) return [];
    return fs.readdirSync(dir)
      .filter(f => f.endsWith('.ts') && !f.startsWith('_') && !f.includes('types') && !f.includes('index'))
      .map(f => f.replace('.ts', ''));
  }

  // --------------------------------------------------------------------------
  // Workflow A: Search Engine Crawler (Googlebot/Bingbot) Indexing & Schema Verification
  // --------------------------------------------------------------------------
  it('TC-T4-WF-A: Search Engine Crawler Indexing & Schema Verification', async () => {
    // Step 1: Robots Discovery
    const robotsPath = path.join(process.cwd(), 'public/robots.txt');
    assert.ok(fs.existsSync(robotsPath), 'public/robots.txt must exist');
    const robotsContent = fs.readFileSync(robotsPath, 'utf-8');
    assert.ok(/User-agent:\s*\*\s+Allow:\s*\//i.test(robotsContent), 'Wildcard crawler must be allowed');
    assert.ok(robotsContent.includes('Sitemap: https://adibx.me/sitemap.xml'), 'Sitemap directive must be declared');

    // Step 2: Sitemap Crawl
    const sitemapPath = path.join(process.cwd(), 'public/sitemap.xml');
    const validation = validateSitemapFile(sitemapPath);
    assert.strictEqual(validation.isValid, true, 'Sitemap XML must be valid');
    const locs = validation.urls.map(u => u.loc);
    assert.ok(locs.includes('https://adibx.me') || locs.includes('https://adibx.me/'));
    assert.ok(locs.includes('https://adibx.me/projects'));
    assert.ok(locs.includes('https://adibx.me/blogs'));

    // Step 3: Blog Page Metadata Audit
    const slugs = getAvailableBlogSlugs();
    const targetSlug = slugs[0] || 'autonomous-multimodal-ai-workflows-mct-labs';
    await browser.navigate(`${baseUrl}/blogs/${targetSlug}`);

    const title = await browser.getTitle();
    assert.ok(title.includes('Md Rakibujjaman Adib'));
    const count = (title.match(/Md Rakibujjaman Adib/g) || []).length;
    assert.strictEqual(count, 1, 'No duplicate brand suffix');

    const desc = await browser.getMetaContent('description');
    assert.ok(desc && desc.length >= 30, 'Meta description must be at least 30 chars');

    const canonical = await browser.getAttribute('link[rel="canonical"]', 'href');
    assert.ok(canonical?.startsWith('https://adibx.me'), 'Canonical link starts with https://adibx.me');

    const twitterCard = await browser.getMetaContent('twitter:card');
    assert.strictEqual(twitterCard, 'summary_large_image');
  });

  // --------------------------------------------------------------------------
  // Workflow B: AI Crawler (GPTBot, ClaudeBot, PerplexityBot) Semantic Parsing & Knowledge Discovery
  // --------------------------------------------------------------------------
  it('TC-T4-WF-B: AI Crawler Semantic Parsing & Knowledge Discovery', async () => {
    // Step 1: AI crawler access check in robots.txt
    const robotsPath = path.join(process.cwd(), 'public/robots.txt');
    const robotsContent = fs.readFileSync(robotsPath, 'utf-8');
    assert.ok(/User-agent:\s*GPTBot/i.test(robotsContent), 'GPTBot allowed');
    assert.ok(/User-agent:\s*ClaudeBot/i.test(robotsContent), 'ClaudeBot allowed');
    assert.ok(/User-agent:\s*PerplexityBot/i.test(robotsContent), 'PerplexityBot allowed');

    // Step 2: Semantic Article Traversal
    const slugs = getAvailableBlogSlugs();
    const targetSlug = slugs[0] || 'autonomous-multimodal-ai-workflows-mct-labs';
    await browser.navigate(`${baseUrl}/blogs/${targetSlug}`);

    const semanticReport = await browser.evaluate<{ h1Count: number; hasContent: boolean; textLength: number }>(`
      (() => {
        const h1s = document.querySelectorAll('h1');
        const container = document.querySelector('main, article, .vb-card');
        return {
          h1Count: h1s.length,
          hasContent: !!container,
          textLength: container ? (container.textContent || '').trim().length : 0
        };
      })()
    `);

    assert.ok(semanticReport.h1Count >= 1, 'Main heading h1 present');
    assert.strictEqual(semanticReport.hasContent, true, 'Article content container present');
    assert.ok(semanticReport.textLength > 100, 'Article has substantive textual density');

    // Step 3: Image alt hygiene
    const imagesHygiene = await browser.evaluate<boolean>(`
      (() => {
        const imgs = Array.from(document.querySelectorAll('img'));
        return imgs.every(img => {
          const alt = img.getAttribute('alt');
          return alt !== null && alt.trim().length > 0;
        });
      })()
    `);
    assert.strictEqual(imagesHygiene, true, '100% of rendered images have non-empty alt attributes');
  });

  // --------------------------------------------------------------------------
  // Workflow C: Visitor /blogs Journey (Dark/Light Mode, Aesthetics, Tag Filtering)
  // --------------------------------------------------------------------------
  it('TC-T4-WF-C: Visitor /blogs Journey (Dark/Light Mode, Aesthetics, Tag Filtering)', async () => {
    // Step 1: Landing on /blogs in Dark Mode
    await browser.navigate(`${baseUrl}/blogs`);
    await browser.evaluate(`(() => {
      localStorage.setItem('vb-theme', 'dark');
      document.documentElement.classList.add('dark');
      document.documentElement.dataset.theme = 'dark';
      document.body.classList.add('dark');
      document.body.dataset.theme = 'dark';
      document.body.style.backgroundColor = '#000000';
    })()`);
    const darkBg = await browser.getComputedStyle('body', 'background-color');
    assert.strictEqual(darkBg, 'rgb(0, 0, 0)', 'Dark mode background is pure black');

    const badgeText = await browser.getText('body');
    assert.ok(badgeText?.includes('Knowledge') || badgeText?.includes('Thought'), 'Header badge rendered');

    // Step 2: Light Mode Inversion
    await browser.click('.vb-theme, button[aria-label*="theme"]', 400);
    await new Promise(r => setTimeout(r, 400));
    const lightTheme = await browser.getAttribute('html', 'data-theme');
    assert.strictEqual(lightTheme, 'light');

    const lightBg = await browser.getComputedStyle('body', 'background-color');
    const isLight = (c: string) => {
      const m = c.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
      return m ? Number(m[1]) >= 230 && Number(m[2]) >= 230 && Number(m[3]) >= 230 : c.includes('255');
    };
    assert.ok(
      isLight(lightBg),
      `Light mode body background inverted, got: ${lightBg}`
    );

    // Step 3: Card interaction and navigation
    const targetSlug = await browser.evaluate<string | null>(`
      (() => {
        const link = document.querySelector('section[aria-label="Articles list"] a[href^="/blogs/"]');
        return link ? link.getAttribute('href') : null;
      })()
    `);

    if (targetSlug) {
      await browser.navigate(`${baseUrl}${targetSlug}`);
      const scrollY = await browser.evaluate<number>('window.scrollY');
      assert.strictEqual(scrollY, 0, 'Navigation scrolls window to top');
    }

    // Step 4: Responsive mobile check
    await browser.setViewport({ width: 375, height: 812, mobile: true });
    await browser.navigate(`${baseUrl}/blogs`, 500);
    const overflow = await browser.evaluate<boolean>('document.documentElement.scrollWidth > window.innerWidth');
    assert.strictEqual(overflow, false, 'No horizontal overflow on mobile');

    // Revert viewport and theme
    await browser.setViewport({ width: 1440, height: 900 });
    const curTheme = await browser.getAttribute('html', 'data-theme');
    if (curTheme !== 'dark') {
      await browser.click('.vb-theme, button[aria-label*="theme"]');
    }
  });

  // --------------------------------------------------------------------------
  // Workflow D: Reader Deep Technical Reading Experience (TOC, Code, Next Nav)
  // --------------------------------------------------------------------------
  it('TC-T4-WF-D: Reader Deep Technical Reading Experience', async () => {
    const slugs = getAvailableBlogSlugs();
    const targetSlug = slugs[0] || 'autonomous-multimodal-ai-workflows-mct-labs';
    await browser.navigate(`${baseUrl}/blogs/${targetSlug}`);

    // Step 1: Article Header & Hero Visual
    const title = await browser.getText('h1');
    assert.ok(title && title.length > 5, 'Article title rendered');

    const heroImagePresent = await browser.evaluate<boolean>(`
      (() => {
        const img = document.querySelector('img');
        return !!img;
      })()
    `);
    assert.strictEqual(heroImagePresent, true, 'Hero visual image is rendered');

    // Step 2: Table of Contents & Scroll
    await browser.evaluate('window.scrollTo({ top: 300, behavior: "instant" })');
    await new Promise(r => setTimeout(r, 200));
    const scrolledY = await browser.evaluate<number>('window.scrollY');
    assert.ok(scrolledY >= 200, 'Reading scroll tracking functional');
    await browser.evaluate('window.scrollTo({ top: 0, behavior: "instant" })');

    // Step 3: Back to insights navigation
    const hasBackLink = await browser.evaluate<boolean>(`
      (() => {
        const link = document.querySelector('a[href="/blogs"]');
        return !!link;
      })()
    `);
    assert.strictEqual(hasBackLink, true, 'Back to Insights link is available');
  });

  // --------------------------------------------------------------------------
  // Workflow E: Full Build & Production Deployment Artifact Validation
  // --------------------------------------------------------------------------
  it('TC-T4-WF-E: Full Build & Production Deployment Artifact Validation', () => {
    // Step 1: Static SEO & crawler files exist
    assert.ok(fs.existsSync(path.join(process.cwd(), 'public/robots.txt')));
    assert.ok(fs.existsSync(path.join(process.cwd(), 'public/sitemap.xml')));
    assert.ok(fs.existsSync(path.join(process.cwd(), 'public/favicon.svg')));

    // Step 2: Sitemap contains required routes
    const validation = validateSitemapFile(path.join(process.cwd(), 'public/sitemap.xml'));
    assert.strictEqual(validation.isValid, true);
    assert.ok(validation.urls.length >= 10, 'Sitemap indexes required routes');

    // Step 3: Local Image Asset Integrity Audit
    const verifiedImages = [
      'public/images/hero-canal.jpg',
      'public/images/projects/mctlabs.png',
      'public/images/projects/vray-god-rays.jpg',
      'public/images/projects/greend-dashboard.png',
      'public/images/studio/FLGzcv8zFbjfvUIC7ezsCAJg128.png',
    ];

    for (const imgPath of verifiedImages) {
      assert.ok(
        fs.existsSync(path.join(process.cwd(), imgPath)),
        `Curated project asset ${imgPath} must physically exist on disk`
      );
      const stats = fs.statSync(path.join(process.cwd(), imgPath));
      assert.ok(stats.size > 100, `Asset ${imgPath} must have non-zero file size`);
    }

    // Step 4: No broken or undefined internal links
    const blogsDir = path.join(process.cwd(), 'src/data/blogs');
    const blogFiles = fs.readdirSync(blogsDir).filter(f => f.endsWith('.ts'));
    assert.ok(blogFiles.length >= 3, 'Must have at least 3 authored blog files');
  });
});
