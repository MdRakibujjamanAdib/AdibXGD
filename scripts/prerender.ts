import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'https://adibx.me';

function ensureDir(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function stripFallbackSeoTags(template: string, hasHelmetScript: boolean): string {
  let stripped = template
    .replace(/<title>[\s\S]*?<\/title>\s*/gi, '')
    .replace(/<link\s+rel="canonical"[^>]*>\s*/gi, '')
    .replace(
      /<meta\s+name="(?:description|robots|language|geo\.[^"]+|ICBM|keywords|author|twitter:[^"]+)"[^>]*>\s*/gi,
      ''
    )
    .replace(/<meta\s+property="(?:og|article):[^"]+"[^>]*>\s*/gi, '');

  if (hasHelmetScript) {
    stripped = stripped.replace(/<script\s+id="seo-jsonld-schema"[^>]*>[\s\S]*?<\/script>\s*/gi, '');
  }

  return stripped;
}

function normalizeHelmetHeadTags(headTags: string, route: string): string {
  const is404 = route === '/404';
  const canonicalUrl = `${BASE_URL}${route === '/' ? '' : route}`;

  let normalized = headTags.replace(
    /(<meta\b[^>]*property="og:url"[^>]*content=")[^"]*(")/gi,
    `$1${is404 ? BASE_URL : canonicalUrl}$2`
  );

  if (is404) {
    normalized = normalized.replace(/<link\b[^>]*rel="canonical"[^>]*>\s*/gi, '');
    if (/name="robots"/i.test(normalized)) {
      normalized = normalized.replace(
        /(<meta\b[^>]*name="robots"[^>]*content=")[^"]*(")/gi,
        '$1noindex, follow$2'
      );
    } else {
      normalized += '\n  <meta name="robots" content="noindex, follow" />';
    }
  } else {
    normalized = normalized.replace(
      /(<link\b[^>]*rel="canonical"[^>]*href=")[^"]*(")/gi,
      `$1${canonicalUrl}$2`
    );
  }

  return normalized;
}

async function runPrerender() {
  const rootDir = path.resolve(__dirname, '..');
  const distDir = path.join(rootDir, 'dist');
  const indexHtmlPath = path.join(distDir, 'index.html');

  if (!fs.existsSync(indexHtmlPath)) {
    console.error(`[prerender] Error: dist/index.html not found! Run 'vite build' first.`);
    process.exit(1);
  }

  const rawTemplate = fs.readFileSync(indexHtmlPath, 'utf8');
  if (!rawTemplate.includes('<div id="root"></div>')) {
    console.error('[prerender] Error: dist/index.html is missing <div id="root"></div> placeholder.');
    process.exit(1);
  }

  const vite = await createServer({
    root: rootDir,
    server: {
      middlewareMode: true,
      hmr: false,
      watch: null,
    },
    appType: 'custom',
  });

  try {
    const { render } = (await vite.ssrLoadModule('/src/entry-server.tsx')) as {
      render: (url: string) => Promise<{
        html: string;
        helmet?: {
          title?: { toString: () => string };
          meta?: { toString: () => string };
          link?: { toString: () => string };
          script?: { toString: () => string };
        };
      }>;
    };

    const { projects } = (await vite.ssrLoadModule('/src/data/projects.ts')) as {
      projects: Array<{ id: string }>;
    };
    const { blogs } = (await vite.ssrLoadModule('/src/data/blogs.ts')) as {
      blogs: Array<{ slug: string }>;
    };

    const staticRoutes = [
      '/',
      '/about',
      '/projects',
      '/services',
      '/blogs',
      '/achievements',
      '/contact',
      '/terms',
      '/privacy',
    ];
    const projectRoutes = projects.map((p) => `/projects/${p.id}`);
    const blogRoutes = blogs.map((b) => `/blogs/${b.slug}`);

    const publicRoutes = [...staticRoutes, ...projectRoutes, ...blogRoutes];
    const allRoutes = [...publicRoutes, '/404'];

    console.log(
      `[prerender] Pre-rendering ${publicRoutes.length} public routes + /404 (${allRoutes.length} total)...`
    );

    let count = 0;
    for (const route of allRoutes) {
      const { html: appHtml, helmet } = await render(route);

      if (!appHtml || appHtml.trim().length < 100) {
        throw new Error(`[prerender] Route "${route}" produced empty or trivial SSR HTML.`);
      }
      if (
        appHtml.includes('id="B:0"') ||
        appHtml.includes('id="S:0"') ||
        appHtml.trim() === '<div class="min-h-screen bg-[var(--vb-bg)]"></div>' ||
        (!appHtml.includes('<h1') && !appHtml.includes('<section') && !appHtml.includes('<main'))
      ) {
        throw new Error(
          `[prerender] Route "${route}" rendered Suspense fallback instead of actual page content.`
        );
      }

      const helmetScriptStr = helmet?.script?.toString() || '';
      const rawHelmetTags = [
        helmet?.title?.toString() || '',
        helmet?.meta?.toString() || '',
        helmet?.link?.toString() || '',
        helmetScriptStr,
      ]
        .filter(Boolean)
        .join('\n  ');

      const helmetTags = normalizeHelmetHeadTags(rawHelmetTags, route);
      const cleanTemplate = stripFallbackSeoTags(rawTemplate, Boolean(helmetScriptStr.trim()));

      let pageHtml = cleanTemplate.replace('</head>', `  ${helmetTags}\n</head>`);
      pageHtml = pageHtml.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`);

      if (route === '/') {
        fs.writeFileSync(indexHtmlPath, pageHtml, 'utf8');
      } else if (route === '/404') {
        fs.writeFileSync(path.join(distDir, '404.html'), pageHtml, 'utf8');
      } else {
        const cleanRoute = route.replace(/^\/+/, '');
        const routeDir = path.join(distDir, cleanRoute);
        ensureDir(routeDir);
        fs.writeFileSync(path.join(routeDir, 'index.html'), pageHtml, 'utf8');
      }

      count++;
    }

    console.log(
      `[prerender] Successfully pre-rendered ${publicRoutes.length} public routes + 404.html (${count} files written).`
    );
  } finally {
    await vite.close();
  }
}

runPrerender().catch((err) => {
  console.error('[prerender] Fatal error:', err);
  process.exit(1);
});
