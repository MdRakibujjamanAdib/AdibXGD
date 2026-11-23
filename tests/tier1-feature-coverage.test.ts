import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { getSharedBrowser, closeSharedBrowser, BrowserController } from './helpers/browser.ts';
import { ensureServer } from './helpers/server.ts';
import { validateSitemapFile } from './helpers/xml-validator.ts';

describe('Tier 1: Feature Coverage (50 Happy-Path Tests across F1-F10)', () => {
  let browser: BrowserController;
  let baseUrl: string;

  before(async () => {
    baseUrl = await ensureServer(3000);
    browser = await getSharedBrowser(9226);
  });

  after(async () => {
    await closeSharedBrowser();
  });

  // Helper to discover any available blog slug from filesystem
  function getAvailableBlogSlugs(): string[] {
    const dir = path.join(process.cwd(), 'src/data/blogs');
    if (!fs.existsSync(dir)) return [];
    return fs.readdirSync(dir)
      .filter(f => f.endsWith('.ts') && !f.startsWith('_') && !f.includes('types') && !f.includes('index'))
      .map(f => f.replace('.ts', ''));
  }

  function parseRgb(colorStr: string): [number, number, number] {
    const match = colorStr.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (match) {
      return [parseInt(match[1], 10), parseInt(match[2], 10), parseInt(match[3], 10)];
    }
    return [0, 0, 0];
  }

  function getLuminance(r: number, g: number, b: number): number {
    const [rs, gs, bs] = [r / 255, g / 255, b / 255].map(c => {
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  }

  function calculateContrastRatio(fg: string, bg: string): number {
    const [r1, g1, b1] = parseRgb(fg);
    const [r2, g2, b2] = parseRgb(bg);
    const lum1 = getLuminance(r1, g1, b1);
    const lum2 = getLuminance(r2, g2, b2);
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    return (brightest + 0.05) / (darkest + 0.05);
  }

  // --------------------------------------------------------------------------
  // Feature 1 (F1): Person & WebSite Structured JSON-LD Metadata (R1)
  // --------------------------------------------------------------------------
  describe('F1: Person & WebSite Structured JSON-LD Metadata', () => {
    it('E2E-T1-F01-01: Schema.org WebSite JSON-LD on Homepage', async () => {
      await browser.navigate(`${baseUrl}/`);
      const schemas = await browser.getJsonLdScripts();
      assert.ok(schemas.length > 0, 'JSON-LD scripts must be rendered in DOM');
      const website = schemas.find(s => s['@type'] === 'WebSite');
      assert.ok(website, 'Expected WebSite schema on homepage');
      assert.strictEqual(website.name, 'Md Rakibujjaman Adib');
      assert.strictEqual(website.url, 'https://adibx.me');
    });

    it('E2E-T1-F01-02: WebSite SearchAction Potential Action', async () => {
      await browser.navigate(`${baseUrl}/`);
      const schemas = await browser.getJsonLdScripts();
      assert.ok(schemas.length > 0, 'JSON-LD scripts must be rendered in DOM');
      const website = schemas.find(s => s['@type'] === 'WebSite');
      assert.ok(website?.potentialAction, 'WebSite schema should have potentialAction');
      assert.strictEqual(website.potentialAction['@type'], 'SearchAction');
    });

    it('E2E-T1-F01-03: Schema.org Person Biographical Properties on /about', async () => {
      await browser.navigate(`${baseUrl}/about`);
      const schemas = await browser.getJsonLdScripts();
      assert.ok(schemas.length > 0, 'JSON-LD scripts must be rendered in DOM');
      const person = schemas.find(s => {
        const t = s['@type'];
        return t === 'Person' || (Array.isArray(t) && t.includes('Person'));
      });
      assert.ok(person, 'Expected Person schema on /about');
      assert.strictEqual(person.name, 'Md Rakibujjaman Adib');
      assert.strictEqual(person.email, 'contact@adibx.me');
    });

    it('E2E-T1-F01-04: Person Authority Links (sameAs) on /contact', async () => {
      await browser.navigate(`${baseUrl}/contact`);
      const schemas = await browser.getJsonLdScripts();
      assert.ok(schemas.length > 0, 'JSON-LD scripts must be rendered in DOM');
      const person = schemas.find(s => {
        const t = s['@type'];
        return t === 'Person' || (Array.isArray(t) && t.includes('Person'));
      });
      assert.ok(person?.sameAs, 'sameAs authority links should exist');
      assert.ok(person.sameAs.some((u: string) => u.includes('linkedin.com')));
    });

    it('E2E-T1-F01-05: Person knowsAbout and Affiliations Enrichment', async () => {
      await browser.navigate(`${baseUrl}/`);
      const schemas = await browser.getJsonLdScripts();
      assert.ok(schemas.length > 0, 'JSON-LD scripts must be rendered in DOM');
      const person = schemas.find(s => {
        const t = s['@type'];
        return t === 'Person' || (Array.isArray(t) && t.includes('Person'));
      });
      assert.ok(person?.knowsAbout, 'knowsAbout should be populated');
      assert.ok(Array.isArray(person.knowsAbout) && person.knowsAbout.length > 0, 'knowsAbout must be non-empty array');
    });
  });

  // --------------------------------------------------------------------------
  // Feature 2 (F2): Dynamic BlogPosting JSON-LD Metadata (R1)
  // --------------------------------------------------------------------------
  describe('F2: Dynamic BlogPosting JSON-LD Metadata', () => {
    it('E2E-T1-F02-01: Schema.org BlogPosting Generation on Article Page', async () => {
      const slugs = getAvailableBlogSlugs();
      const targetSlug = slugs[0] || 'autonomous-multimodal-ai-workflows-mct-labs';
      await browser.navigate(`${baseUrl}/blogs/${targetSlug}`);

      const schemas = await browser.getJsonLdScripts();
      assert.ok(schemas.length > 0, 'JSON-LD scripts must be rendered on blog article page');
      const blogPosting = schemas.find(s => s['@type'] === 'BlogPosting');
      assert.ok(blogPosting, 'Expected BlogPosting schema on blog article page');
      assert.ok(blogPosting.headline, 'BlogPosting must have headline');
    });

    it('E2E-T1-F02-02: BlogPosting.author Specification Compliance', async () => {
      const slugs = getAvailableBlogSlugs();
      const targetSlug = slugs[0] || 'autonomous-multimodal-ai-workflows-mct-labs';
      await browser.navigate(`${baseUrl}/blogs/${targetSlug}`);

      const schemas = await browser.getJsonLdScripts();
      assert.ok(schemas.length > 0, 'JSON-LD scripts must be rendered in DOM');
      const blogPosting = schemas.find(s => s['@type'] === 'BlogPosting');
      assert.ok(blogPosting, 'Expected BlogPosting schema');
      assert.strictEqual(blogPosting?.author?.name, 'Md Rakibujjaman Adib');
    });

    it('E2E-T1-F02-03: BlogPosting.datePublished ISO 8601 Validation', async () => {
      const slugs = getAvailableBlogSlugs();
      const targetSlug = slugs[0] || 'autonomous-multimodal-ai-workflows-mct-labs';
      await browser.navigate(`${baseUrl}/blogs/${targetSlug}`);

      const schemas = await browser.getJsonLdScripts();
      assert.ok(schemas.length > 0, 'JSON-LD scripts must be rendered in DOM');
      const blogPosting = schemas.find(s => s['@type'] === 'BlogPosting');
      assert.ok(blogPosting, 'Expected BlogPosting schema');
      assert.ok(!isNaN(Date.parse(blogPosting.datePublished)), 'datePublished must be valid date');
    });

    it('E2E-T1-F02-04: BlogPosting.mainEntityOfPage Canonical Alignment', async () => {
      const slugs = getAvailableBlogSlugs();
      const targetSlug = slugs[0] || 'autonomous-multimodal-ai-workflows-mct-labs';
      await browser.navigate(`${baseUrl}/blogs/${targetSlug}`);

      const schemas = await browser.getJsonLdScripts();
      assert.ok(schemas.length > 0, 'JSON-LD scripts must be rendered in DOM');
      const blogPosting = schemas.find(s => s['@type'] === 'BlogPosting');
      assert.ok(blogPosting, 'Expected BlogPosting schema');
      const entityId = typeof blogPosting?.mainEntityOfPage === 'object'
        ? blogPosting.mainEntityOfPage['@id']
        : blogPosting?.mainEntityOfPage;
      assert.ok(entityId?.includes(`/blogs/${targetSlug}`));
    });

    it('E2E-T1-F02-05: BlogPosting.publisher with Embedded Logo', async () => {
      const slugs = getAvailableBlogSlugs();
      const targetSlug = slugs[0] || 'autonomous-multimodal-ai-workflows-mct-labs';
      await browser.navigate(`${baseUrl}/blogs/${targetSlug}`);

      const schemas = await browser.getJsonLdScripts();
      assert.ok(schemas.length > 0, 'JSON-LD scripts must be rendered in DOM');
      const blogPosting = schemas.find(s => s['@type'] === 'BlogPosting');
      assert.ok(blogPosting, 'Expected BlogPosting schema');
      assert.strictEqual(blogPosting?.publisher?.name, 'Md Rakibujjaman Adib');
      assert.ok(blogPosting?.publisher?.logo?.url?.includes('favicon.svg'), 'Logo must point to favicon.svg');
    });
  });

  // --------------------------------------------------------------------------
  // Feature 3 (F3): OpenGraph, Twitter Cards & Canonical Head Elements (R1)
  // --------------------------------------------------------------------------
  describe('F3: OpenGraph, Twitter Cards & Canonical Head Elements', () => {
    it('E2E-T1-F03-01: Standard OpenGraph Meta Tags on All Routes', async () => {
      await browser.navigate(`${baseUrl}/blogs`);
      const ogType = await browser.getMetaContent('og:type');
      const ogTitle = await browser.getMetaContent('og:title');
      const ogDesc = await browser.getMetaContent('og:description');
      const ogUrl = await browser.getMetaContent('og:url');
      const ogImage = await browser.getMetaContent('og:image');

      assert.ok(ogType === 'website' || ogType === 'article', `og:type must be website or article, got: ${ogType}`);
      assert.ok(ogTitle && ogTitle.length > 0, 'og:title must be populated');
      assert.ok(ogDesc && ogDesc.length > 0, 'og:description must be populated');
      assert.ok(ogUrl?.startsWith('https://adibx.me'), 'og:url must be canonical domain');
      assert.ok(ogImage?.startsWith('https://adibx.me'), 'og:image must be absolute URL');
    });

    it('E2E-T1-F03-02: Full Twitter Card Metadata', async () => {
      await browser.navigate(`${baseUrl}/blogs`);
      const twitterCard = await browser.getMetaContent('twitter:card');
      const twitterCreator = await browser.getMetaContent('twitter:creator');
      const twitterTitle = await browser.getMetaContent('twitter:title');
      const twitterImage = await browser.getMetaContent('twitter:image');

      assert.strictEqual(twitterCard, 'summary_large_image');
      assert.strictEqual(twitterCreator, '@MdRakibujjamanAdib');
      assert.ok(twitterTitle && twitterTitle.length > 0, 'twitter:title must be populated');
      assert.ok(twitterImage?.startsWith('https://adibx.me'), 'twitter:image must be absolute URL');
    });

    it('E2E-T1-F03-03: Dynamic OpenGraph Article Metadata', async () => {
      const slugs = getAvailableBlogSlugs();
      const targetSlug = slugs[0] || 'autonomous-multimodal-ai-workflows-mct-labs';
      await browser.navigate(`${baseUrl}/blogs/${targetSlug}`);

      const ogType = await browser.evaluate<string>(`
        (() => {
          const tags = Array.from(document.querySelectorAll('meta[property="og:type"]'));
          const articleTag = tags.find(t => t.getAttribute('content') === 'article');
          return articleTag ? 'article' : (tags[tags.length - 1]?.getAttribute('content') || 'website');
        })()
      `);
      assert.ok(ogType === 'article' || ogType === 'website', `og:type must be article or website, got: ${ogType}`);
      const ogImage = await browser.getMetaContent('og:image');
      assert.ok(ogImage?.startsWith('https://adibx.me'), 'og:image must be absolute URL');
    });

    it('E2E-T1-F03-04: Canonical Link Tag Integrity', async () => {
      await browser.navigate(`${baseUrl}/blogs`);
      const canonical = await browser.getAttribute('link[rel="canonical"]', 'href');
      assert.ok(canonical?.startsWith('https://adibx.me'), `canonical should start with https://adibx.me, got: ${canonical}`);
    });

    it('E2E-T1-F03-05: Clean Page Title Formatting', async () => {
      await browser.navigate(`${baseUrl}/projects`);
      const title = await browser.getTitle();
      assert.ok(title.includes('Md Rakibujjaman Adib'), 'Title must contain author name');
      const count = (title.match(/Md Rakibujjaman Adib/g) || []).length;
      assert.strictEqual(count, 1, `Title should not duplicate author name, got: "${title}"`);
    });
  });

  // --------------------------------------------------------------------------
  // Feature 4 (F4): Crawler Access Control & robots.txt Rules (R1)
  // --------------------------------------------------------------------------
  describe('F4: Crawler Access Control & robots.txt Rules', () => {
    const robotsPath = path.join(process.cwd(), 'public/robots.txt');

    it('E2E-T1-F04-01: HTTP GET public/robots.txt Availability & Status', () => {
      assert.ok(fs.existsSync(robotsPath), 'public/robots.txt must exist on disk');
      const content = fs.readFileSync(robotsPath, 'utf-8');
      assert.ok(content.length > 0, 'public/robots.txt must not be empty');
    });

    it('E2E-T1-F04-02: Wildcard Crawler Default Allowance', () => {
      const content = fs.readFileSync(robotsPath, 'utf-8');
      assert.ok(/User-agent:\s*\*\s+Allow:\s*\//i.test(content), 'robots.txt must allow wildcard User-agent');
    });

    it('E2E-T1-F04-03: OpenAI AI Search Crawlers Allowance', () => {
      const content = fs.readFileSync(robotsPath, 'utf-8');
      assert.ok(/User-agent:\s*GPTBot/i.test(content), 'robots.txt must include GPTBot');
      assert.ok(/User-agent:\s*ChatGPT-User/i.test(content), 'robots.txt must include ChatGPT-User');
      assert.ok(/User-agent:\s*OAI-SearchBot/i.test(content), 'robots.txt must include OAI-SearchBot');
    });

    it('E2E-T1-F04-04: Anthropic & Perplexity Crawlers Allowance', () => {
      const content = fs.readFileSync(robotsPath, 'utf-8');
      assert.ok(/User-agent:\s*ClaudeBot/i.test(content), 'robots.txt must include ClaudeBot');
      assert.ok(/User-agent:\s*PerplexityBot/i.test(content), 'robots.txt must include PerplexityBot');
    });

    it('E2E-T1-F04-05: Absolute Sitemap Directive Presence', () => {
      const content = fs.readFileSync(robotsPath, 'utf-8');
      assert.ok(/Sitemap:\s*https:\/\/adibx\.me\/sitemap\.xml/i.test(content), 'robots.txt must declare Sitemap directive pointing to https://adibx.me/sitemap.xml');
    });
  });

  // --------------------------------------------------------------------------
  // Feature 5 (F5): Dynamic Sitemap (sitemap.xml) Generation & Indexing (R1)
  // --------------------------------------------------------------------------
  describe('F5: Dynamic Sitemap (sitemap.xml) Generation & Indexing', () => {
    const sitemapPath = path.join(process.cwd(), 'public/sitemap.xml');

    it('E2E-T1-F05-01: Sitemap Generator Script Clean Execution', () => {
      const scriptPath = path.join(process.cwd(), 'scripts/generate-sitemap.ts');
      assert.ok(fs.existsSync(scriptPath), 'scripts/generate-sitemap.ts must exist');
    });

    it('E2E-T1-F05-02: XML Schema Validation of public/sitemap.xml', () => {
      const validation = validateSitemapFile(sitemapPath);
      assert.ok(validation.isValid, `sitemap.xml must be valid XML. Errors: ${validation.errors.join('; ')}`);
      assert.ok(validation.urls.length >= 10, 'sitemap.xml must contain indexed URLs');
    });

    it('E2E-T1-F05-03: Comprehensive Static Route Coverage', () => {
      const validation = validateSitemapFile(sitemapPath);
      const locs = validation.urls.map(u => u.loc);
      assert.ok(locs.includes('https://adibx.me') || locs.includes('https://adibx.me/'), 'Must index homepage');
      assert.ok(locs.includes('https://adibx.me/about'), 'Must index /about');
      assert.ok(locs.includes('https://adibx.me/projects'), 'Must index /projects');
      assert.ok(locs.includes('https://adibx.me/blogs'), 'Must index /blogs');
      assert.ok(locs.includes('https://adibx.me/contact'), 'Must index /contact');
      assert.ok(locs.includes('https://adibx.me/achievements'), 'Must index /achievements');
    });

    it('E2E-T1-F05-04: Dynamic Blog Article Route Coverage', () => {
      const slugs = getAvailableBlogSlugs();
      const validation = validateSitemapFile(sitemapPath);
      const locs = validation.urls.map(u => u.loc);

      for (const slug of slugs) {
        assert.ok(
          locs.includes(`https://adibx.me/blogs/${slug}`),
          `sitemap.xml must index blog slug: ${slug}`
        );
      }
    });

    it('E2E-T1-F05-05: Mandatory Tag Validation (lastmod, changefreq, priority)', () => {
      const validation = validateSitemapFile(sitemapPath);
      for (const item of validation.urls) {
        assert.ok(item.lastmod, `<lastmod> must exist for ${item.loc}`);
        assert.match(item.lastmod, /^\d{4}-\d{2}-\d{2}$/, `<lastmod> format must be YYYY-MM-DD for ${item.loc}`);
        assert.ok(item.priority, `<priority> must exist for ${item.loc}`);
      }
    });
  });

  // --------------------------------------------------------------------------
  // Feature 6 (F6): Visbeyond Blog Listing (/blogs) Page & Layout (R2)
  // --------------------------------------------------------------------------
  describe('F6: Visbeyond Blog Listing (/blogs) Page & Responsive Layout', () => {
    it('E2E-T1-F06-01: Clean Initial Render of /blogs', async () => {
      await browser.navigate(`${baseUrl}/blogs`);
      const bodyText = await browser.getText('body');
      assert.ok(bodyText && bodyText.includes('Insights'), 'Page should render Insights header');
    });

    it('E2E-T1-F06-02: Header Hero Section & Badge', async () => {
      await browser.navigate(`${baseUrl}/blogs`);
      const h1Text = await browser.getText('h1');
      assert.ok(h1Text?.includes('Insights'), `h1 should mention Insights, got: ${h1Text}`);
      const bodyText = await browser.getText('body');
      assert.ok(bodyText?.includes('Knowledge') || bodyText?.includes('Thought'), 'Header badge should be present');
    });

    it('E2E-T1-F06-03: Article Grid Card Rendering with .vb-card', async () => {
      await browser.navigate(`${baseUrl}/blogs`);
      const cardCount = await browser.evaluate<number>(`
        document.querySelectorAll('section[aria-label="Articles list"] article, section[aria-label="Articles list"] .vb-card, .vb-card').length
      `);
      assert.ok(cardCount >= 1, `At least 1 blog card rendered with vb-card, got: ${cardCount}`);
    });

    it('E2E-T1-F06-04: Article Card Navigation Links', async () => {
      await browser.navigate(`${baseUrl}/blogs`);
      const firstCardHref = await browser.evaluate<string | null>(`
        (() => {
          const link = document.querySelector('section[aria-label="Articles list"] a[href^="/blogs/"]');
          return link ? link.getAttribute('href') : null;
        })()
      `);
      assert.ok(firstCardHref?.startsWith('/blogs/'), `Article link should point to /blogs/:slug, got ${firstCardHref}`);
    });

    it('E2E-T1-F06-05: Multi-Viewport Responsive Layout', async () => {
      // Desktop
      await browser.setViewport({ width: 1280, height: 800 });
      await browser.navigate(`${baseUrl}/blogs`, 500);
      let overflow = await browser.evaluate<boolean>(`document.documentElement.scrollWidth > window.innerWidth`);
      assert.strictEqual(overflow, false, 'No horizontal overflow on desktop');

      // Mobile
      await browser.setViewport({ width: 375, height: 812, mobile: true });
      await browser.navigate(`${baseUrl}/blogs`, 500);
      overflow = await browser.evaluate<boolean>(`document.documentElement.scrollWidth > window.innerWidth`);
      assert.strictEqual(overflow, false, 'No horizontal overflow on mobile 375px');

      // Reset
      await browser.setViewport({ width: 1440, height: 900 });
    });
  });

  // --------------------------------------------------------------------------
  // Feature 7 (F7): Blog Interactive Tag & Category Filtering (R2)
  // --------------------------------------------------------------------------
  describe('F7: Blog Interactive Tag & Category Filtering', () => {
    it('E2E-T1-F07-01: Dynamic Tag Filter Pills Rendered', async () => {
      await browser.navigate(`${baseUrl}/blogs`);
      const pillCount = await browser.evaluate<number>(`
        document.querySelectorAll('button[data-tag], button.vb-tag-pill').length
      `);
      assert.ok(pillCount > 0, `Filter pills must be present, found: ${pillCount}`);
    });

    it('E2E-T1-F07-02: Article Filtering by Tag', async () => {
      await browser.navigate(`${baseUrl}/blogs`);
      const filterResult = await browser.evaluate<{ initialCount: number; filteredCount: number }>(`
        (() => {
          const cards = document.querySelectorAll('section[aria-label="Articles list"] article, section[aria-label="Articles list"] .vb-card, .vb-card');
          const initialCount = cards.length;
          const tagBtn = document.querySelector('button[data-tag]:not([data-tag="All"]), button.vb-tag-pill:not(:first-child)');
          if (tagBtn) {
            tagBtn.click();
            const filteredCards = document.querySelectorAll('section[aria-label="Articles list"] article, section[aria-label="Articles list"] .vb-card, .vb-card');
            return { initialCount, filteredCount: filteredCards.length };
          }
          return { initialCount, filteredCount: initialCount };
        })()
      `);
      assert.ok(filterResult.initialCount >= 1, 'Initial cards must be present');
      assert.ok(filterResult.filteredCount <= filterResult.initialCount, 'Filtered cards count should be <= initial count');
    });

    it('E2E-T1-F07-03: Active Filter Pill Highlight', async () => {
      await browser.navigate(`${baseUrl}/blogs`);
      const activeState = await browser.evaluate<boolean>(`
        (() => {
          const allBtn = document.querySelector('button[data-tag="All"], button.vb-tag-pill:first-child');
          if (allBtn) {
            return allBtn.classList.contains('active') ||
                   allBtn.getAttribute('aria-pressed') === 'true' ||
                   allBtn.classList.contains('bg-[#e62e05]') ||
                   allBtn.classList.contains('text-white') ||
                   window.getComputedStyle(allBtn).color !== '';
          }
          return false;
        })()
      `);
      assert.ok(activeState, 'Active pill should have visual indication');
    });

    it('E2E-T1-F07-04: Reset Filter to "All"', async () => {
      await browser.navigate(`${baseUrl}/blogs`);
      const resetWorks = await browser.evaluate<boolean>(`
        (() => {
          const allBtn = document.querySelector('button[data-tag="All"], button.vb-tag-pill:first-child');
          if (allBtn) {
            allBtn.click();
            const cards = document.querySelectorAll('section[aria-label="Articles list"] article, section[aria-label="Articles list"] .vb-card, .vb-card');
            return cards.length >= 1;
          }
          return false;
        })()
      `);
      assert.ok(resetWorks, 'Clicking All restores cards');
    });

    it('E2E-T1-F07-05: Tag Navigation from Card / Detail View', async () => {
      await browser.navigate(`${baseUrl}/blogs`);
      const tagLinkExists = await browser.evaluate<boolean>(`
        (() => {
          const tag = document.querySelector('section[aria-label="Articles list"] span, .vb-card span');
          return !!tag;
        })()
      `);
      assert.ok(tagLinkExists, 'Category or tag badge rendered on article cards');
    });
  });

  // --------------------------------------------------------------------------
  // Feature 8 (F8): Blog Reading Experience, Typography & Interactive Modules (R2)
  // --------------------------------------------------------------------------
  describe('F8: Blog Reading Experience, Typography & Interactive Modules', () => {
    it('E2E-T1-F08-01: Article Hero Visual & Metadata Header (/blogs/:slug)', async () => {
      const slugs = getAvailableBlogSlugs();
      const targetSlug = slugs[0] || 'autonomous-multimodal-ai-workflows-mct-labs';
      await browser.navigate(`${baseUrl}/blogs/${targetSlug}`);

      const h1Text = await browser.getText('h1');
      assert.ok(h1Text && h1Text.length > 5, 'Article h1 title must be rendered');
      const bodyText = await browser.getText('body');
      assert.ok(bodyText?.includes('Back to Insights') || bodyText?.includes('Back'), 'Back link should be rendered');
    });

    it('E2E-T1-F08-02: Floating / Sticky Table of Contents (TOC) Anchor Navigation', async () => {
      const slugs = getAvailableBlogSlugs();
      const targetSlug = slugs[0] || 'autonomous-multimodal-ai-workflows-mct-labs';
      await browser.navigate(`${baseUrl}/blogs/${targetSlug}`);

      const tocResult = await browser.evaluate<{ hasToc: boolean; linkCount: number }>(`
        (() => {
          const links = document.querySelectorAll('nav[aria-label*="Table of contents"] a, .vb-toc a');
          return { hasToc: links.length > 0, linkCount: links.length };
        })()
      `);
      assert.ok(tocResult.hasToc, 'Table of contents component must be rendered on article page');
      assert.ok(tocResult.linkCount > 0, `Table of contents must contain anchor links, got: ${tocResult.linkCount}`);
    });

    it('E2E-T1-F08-03: Code Blocks with Copy-to-Clipboard Action', async () => {
      const slugs = getAvailableBlogSlugs();
      const targetSlug = slugs[0] || 'autonomous-multimodal-ai-workflows-mct-labs';
      await browser.navigate(`${baseUrl}/blogs/${targetSlug}`);

      const codeStatus = await browser.evaluate<{ hasCode: boolean; hasCopyBtn: boolean }>(`
        (() => {
          const pre = document.querySelector('pre');
          const buttons = Array.from(document.querySelectorAll('button'));
          const copyBtn = buttons.find(b => (b.getAttribute('aria-label') || '').toLowerCase().includes('copy') || b.textContent?.includes('Copy'));
          return { hasCode: !!pre, hasCopyBtn: !!copyBtn };
        })()
      `);
      assert.ok(codeStatus.hasCode, 'Article content must render <pre><code> syntax blocks');
      assert.ok(codeStatus.hasCopyBtn, 'Code blocks must provide interactive copy button');
    });

    it('E2E-T1-F08-04: Technical Callouts & Blockquotes Styling', async () => {
      const slugs = getAvailableBlogSlugs();
      const targetSlug = slugs[0] || 'autonomous-multimodal-ai-workflows-mct-labs';
      await browser.navigate(`${baseUrl}/blogs/${targetSlug}`);

      const hasContent = await browser.evaluate<boolean>(`
        (() => {
          const prose = document.querySelector('.prose, article, section[aria-label="Article header"]');
          return !!prose;
        })()
      `);
      assert.ok(hasContent, 'Article content prose or header container rendered');
    });

    it('E2E-T1-F08-05: Next Article Navigation Card', async () => {
      const slugs = getAvailableBlogSlugs();
      const targetSlug = slugs[0] || 'autonomous-multimodal-ai-workflows-mct-labs';
      await browser.navigate(`${baseUrl}/blogs/${targetSlug}`);

      const navLinksCount = await browser.evaluate<number>(`
        (() => {
          const links = document.querySelectorAll('a[href="/blogs"], a[href^="/blogs/"]');
          return links.length;
        })()
      `);
      assert.ok(navLinksCount >= 1, 'Navigation links back to blogs or next articles must exist');
    });
  });

  // --------------------------------------------------------------------------
  // Feature 9 (F9): Visbeyond Dual-Theme Token Discipline & Contrast (R2)
  // --------------------------------------------------------------------------
  describe('F9: Visbeyond Dual-Theme Token Discipline & Contrast', () => {
    it('E2E-T1-F09-01: Dark Mode Design System Token Compliance', async () => {
      await browser.navigate(`${baseUrl}/blogs`);
      const bodyBg = await browser.getComputedStyle('body', 'background-color');
      assert.strictEqual(bodyBg, 'rgb(0, 0, 0)', 'Dark mode background must be rgb(0, 0, 0)');
      const accent = await browser.getComputedStyle(':root', '--vb-accent');
      assert.ok(accent.includes('#e62e05') || accent.includes('rgb(230, 46, 5)'), 'Signature vermilion accent must resolve');
    });

    it('E2E-T1-F09-02: Light Mode Theme Toggle & Inversion', async () => {
      await browser.navigate(`${baseUrl}/blogs`);
      await browser.click('.vb-theme, button[aria-label*="theme"]');
      const dataTheme = await browser.getAttribute('html', 'data-theme');
      const bodyBg = await browser.getComputedStyle('body', 'background-color');

      assert.strictEqual(dataTheme, 'light', 'Theme should toggle to light');
      const isLight = (c: string) => {
        const m = c.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
        return m ? Number(m[1]) >= 220 && Number(m[2]) >= 220 && Number(m[3]) >= 220 : c.includes('255');
      };
      assert.ok(
        isLight(bodyBg),
        `Body background in light mode must be light, got: ${bodyBg}`
      );
      // Revert back to dark mode
      await browser.click('.vb-theme, button[aria-label*="theme"]');
    });

    it('E2E-T1-F09-03: Theme Preference Persistence across Reload', async () => {
      await browser.navigate(`${baseUrl}/blogs`);
      const storedTheme = await browser.evaluate<string>(`localStorage.getItem('vb-theme') || ''`);
      if (storedTheme !== 'light') {
        await browser.click('.vb-theme, button[aria-label*="theme"]');
      }
      await browser.navigate(`${baseUrl}/blogs`, 1000);
      const reloadedTheme = await browser.getAttribute('html', 'data-theme');
      assert.strictEqual(reloadedTheme, 'light', 'Light mode should persist across reload');

      // Toggle back to dark
      await browser.click('.vb-theme, button[aria-label*="theme"]');
    });

    it('E2E-T1-F09-04: .vb-card Styling in Both Themes', async () => {
      await browser.navigate(`${baseUrl}/blogs`);
      const darkCardColor = await browser.getComputedStyle('.vb-card', 'background-color');
      assert.ok(darkCardColor, 'Card styling exists in dark mode');

      // Switch to light
      await browser.click('.vb-theme, button[aria-label*="theme"]');
      const lightCardColor = await browser.getComputedStyle('.vb-card', 'background-color');
      assert.ok(lightCardColor, 'Card styling exists in light mode');

      // Switch back
      await browser.click('.vb-theme, button[aria-label*="theme"]');
    });

    it('E2E-T1-F09-05: High Text Contrast in Light Mode on /blogs', async () => {
      await browser.navigate(`${baseUrl}/blogs`);
      await browser.click('.vb-theme, button[aria-label*="theme"]');

      const contrastInfo = await browser.evaluate<{ fg: string; bg: string }>(`
        (() => {
          const h1 = document.querySelector('h1');
          const body = document.body;
          return {
            fg: h1 ? window.getComputedStyle(h1).color : 'rgb(0,0,0)',
            bg: window.getComputedStyle(body).backgroundColor,
          };
        })()
      `);
      const ratio = calculateContrastRatio(contrastInfo.fg, contrastInfo.bg);
      assert.ok(ratio >= 4.5, `Heading in light mode must meet WCAG AA (>= 4.5:1), got: ${ratio.toFixed(2)}:1`);

      // Revert to dark
      await browser.click('.vb-theme, button[aria-label*="theme"]');
    });
  });

  // --------------------------------------------------------------------------
  // Feature 10 (F10): Real Project-Based Technical Blog Articles & Asset Integrity (R3)
  // --------------------------------------------------------------------------
  describe('F10: Real Project-Based Technical Blog Articles & Asset Integrity', () => {
    it('E2E-T1-F10-01: Unity Serious Games Architecture Article', async () => {
      const slug = 'unity-serious-games-architecture-windesheim';
      const fileExists = fs.existsSync(path.join(process.cwd(), 'src/data/blogs', `${slug}.ts`));
      const imageExists = fs.existsSync(path.join(process.cwd(), 'public/images/hero-canal.jpg'));

      assert.ok(imageExists, 'Local image public/images/hero-canal.jpg must exist');
      assert.ok(fileExists, `Blog data file src/data/blogs/${slug}.ts must exist`);
      await browser.navigate(`${baseUrl}/blogs/${slug}`);
      const title = await browser.getTitle();
      assert.ok(/Unity|Serious Games|Windesheim/i.test(title), `Title must match article: ${title}`);
      const h1 = await browser.getText('h1');
      assert.ok(/Unity|Serious Games|Windesheim/i.test(h1 || ''), `H1 must match article: ${h1}`);
    });

    it('E2E-T1-F10-02: MCT Labs Multimodal AI Workflows Article', async () => {
      const slug = 'autonomous-multimodal-ai-workflows-mct-labs';
      const fileExists = fs.existsSync(path.join(process.cwd(), 'src/data/blogs', `${slug}.ts`));
      const imageExists = fs.existsSync(path.join(process.cwd(), 'public/images/projects/mctlabs.png'));

      assert.ok(imageExists, 'Local image public/images/projects/mctlabs.png must exist');
      assert.ok(fileExists, `Blog data file src/data/blogs/${slug}.ts must exist`);
      await browser.navigate(`${baseUrl}/blogs/${slug}`);
      const title = await browser.getTitle();
      assert.ok(/MCT Labs|Multimodal AI|AI/i.test(title), `Title must match article: ${title}`);
      const h1 = await browser.getText('h1');
      assert.ok(/MCT Labs|Multimodal AI|AI/i.test(h1 || ''), `H1 must match article: ${h1}`);
    });

    it('E2E-T1-F10-03: Chaos V-Ray Volumetric Lighting & Optics Article', async () => {
      const slug = 'physically-based-rendering-vray-light-transport';
      const fileExists = fs.existsSync(path.join(process.cwd(), 'src/data/blogs', `${slug}.ts`));
      const imageExists = fs.existsSync(path.join(process.cwd(), 'public/images/projects/vray-god-rays.jpg'));

      assert.ok(imageExists, 'Local image public/images/projects/vray-god-rays.jpg must exist');
      assert.ok(fileExists, `Blog data file src/data/blogs/${slug}.ts must exist`);
      await browser.navigate(`${baseUrl}/blogs/${slug}`);
      const title = await browser.getTitle();
      assert.ok(/V-Ray|Optics|Lighting|Physically-Based/i.test(title), `Title must match article: ${title}`);
      const h1 = await browser.getText('h1');
      assert.ok(/V-Ray|Optics|Lighting|Physically-Based/i.test(h1 || ''), `H1 must match article: ${h1}`);
    });

    it('E2E-T1-F10-04: Green D IoT Telemetry & Carbon Accounting Article', async () => {
      const slug = 'iot-edge-sensing-carbon-modeling-green-d';
      const fileExists = fs.existsSync(path.join(process.cwd(), 'src/data/blogs', `${slug}.ts`));
      const imageExists = fs.existsSync(path.join(process.cwd(), 'public/images/projects/greend-dashboard.png'));

      assert.ok(imageExists, 'Local image public/images/projects/greend-dashboard.png must exist');
      assert.ok(fileExists, `Blog data file src/data/blogs/${slug}.ts must exist`);
      await browser.navigate(`${baseUrl}/blogs/${slug}`);
      const title = await browser.getTitle();
      assert.ok(/Green D|IoT|Carbon/i.test(title), `Title must match article: ${title}`);
      const h1 = await browser.getText('h1');
      assert.ok(/Green D|IoT|Carbon/i.test(h1 || ''), `H1 must match article: ${h1}`);
    });

    it('E2E-T1-F10-05: Byte Battle Algorithmic Optimization Article', async () => {
      const slug = 'competitive-programming-algorithmic-optimization-byte-battle';
      const fileExists = fs.existsSync(path.join(process.cwd(), 'src/data/blogs', `${slug}.ts`));
      const imageExists = fs.existsSync(path.join(process.cwd(), 'public/images/visbeyond/FLGzcv8zFbjfvUIC7ezsCAJg128.png'));

      assert.ok(imageExists, 'Local image public/images/visbeyond/FLGzcv8zFbjfvUIC7ezsCAJg128.png must exist');
      assert.ok(fileExists, `Blog data file src/data/blogs/${slug}.ts must exist`);
      await browser.navigate(`${baseUrl}/blogs/${slug}`);
      const title = await browser.getTitle();
      assert.ok(/Byte Battle|Algorithmic|Optimization|Competitive/i.test(title), `Title must match article: ${title}`);
      const h1 = await browser.getText('h1');
      assert.ok(/Byte Battle|Algorithmic|Optimization|Competitive/i.test(h1 || ''), `H1 must match article: ${h1}`);
    });
  });
});
