import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';
import type { Blog } from '../src/data/blogs';
import type { Project } from '../src/data/projects';

const root = fileURLToPath(new URL('..', import.meta.url));
const siteUrl = 'https://adibx.me';
const staticPaths = ['/', '/about', '/projects', '/services', '/blogs', '/achievements', '/contact', '/terms', '/privacy'];

function sitemapDate(value: string): string | undefined {
  if (!value || Number.isNaN(Date.parse(value))) return undefined;
  // Preserve the editorial calendar date when the timestamp includes a time zone.
  return value.match(/^\d{4}-\d{2}-\d{2}/)?.[0] ?? new Date(value).toISOString().slice(0, 10);
}

async function generateSitemap() {
  const vite = await createServer({
    root,
    server: { middlewareMode: true, hmr: false, watch: null },
    appType: 'custom',
  });

  try {
    const { projects } = await vite.ssrLoadModule('/src/data/projects.ts') as { projects: Project[] };
    const { blogs } = await vite.ssrLoadModule('/src/data/blogs.ts') as { blogs: Blog[] };
    const entries = [
      ...staticPaths.map(route => ({ route, date: undefined })),
      ...projects.map(project => ({ route: `/projects/${project.id}`, date: sitemapDate(project.date) })),
      ...blogs.map(blog => ({ route: `/blogs/${blog.slug}`, date: sitemapDate(blog.isoDate || blog.date) })),
    ];

    const urls = entries.map(({ route, date }) => {
      const url = (route === '/' ? siteUrl : new URL(route, siteUrl).href).replace(/&/g, '&amp;');
      const lastmod = date ? `\n    <lastmod>${date}</lastmod>` : '';
      return `  <url>\n    <loc>${url}</loc>${lastmod}\n  </url>`;
    });
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`;

    fs.writeFileSync(path.join(root, 'public', 'sitemap.xml'), sitemap);
    const dist = path.join(root, 'dist');
    if (fs.existsSync(dist)) fs.writeFileSync(path.join(dist, 'sitemap.xml'), sitemap);
    console.log(`Generated sitemap with ${entries.length} routes.`);
  } finally {
    await vite.close();
  }
}

generateSitemap().catch(error => {
  console.error('Sitemap generation failed:', error);
  process.exitCode = 1;
});
