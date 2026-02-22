import fs from 'fs';
import path from 'path';

// Define your site's base URL
const BASE_URL = 'https://adibx.me';

// List of static routes
const staticRoutes = [
    '/',
    '/projects',
    '/blogs',
    '/about',
    '/contact',
    '/achievements'
];

// Dynamically generate XML for static routes
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticRoutes
        .map((route) => {
            return `
    <url>
      <loc>${BASE_URL}${route}</loc>
      <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>${route === '/' ? '1.0' : '0.8'}</priority>
    </url>`;
        })
        .join('')}
</urlset>
`;

// Write the sitemap to the public directory
const publicDir = path.resolve(process.cwd(), 'public');
fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap, 'utf-8');

console.log('Sitemap successfully generated at public/sitemap.xml');
