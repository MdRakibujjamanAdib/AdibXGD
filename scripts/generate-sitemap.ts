import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// This script generates a sitemap.xml dynamically from the projects and blogs data.
// We are scraping the IDs dynamically to add them as paths.

const siteUrl = 'https://adibx.me';

const getFiles = (dir: string): string[] => {
    return fs.readdirSync(dir).filter(file => file.endsWith('.ts'));
};

const generateSitemap = () => {
    const projectsDir = path.resolve(__dirname, '../src/data/projects');
    const blogsDir = path.resolve(__dirname, '../src/data/blogs');

    const projects = getFiles(projectsDir).map(file => {
        // file names are the ids in our new structure, e.g. 3-point-lighting.ts
        const id = file.replace('.ts', '');
        return `${siteUrl}/projects/${id}`;
    });

    const blogs = getFiles(blogsDir).map(file => {
        const id = file.replace('.ts', '');
        return `${siteUrl}/blogs/${id}`;
    });

    const staticPages = [
        siteUrl,
        `${siteUrl}/about`,
        `${siteUrl}/projects`,
        `${siteUrl}/services`,
        `${siteUrl}/contact`,
        `${siteUrl}/blogs`,
    ];

    const allUrls = [...staticPages, ...projects, ...blogs];

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${allUrls
            .map(url => {
                return `
    <url>
      <loc>${url}</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
      <changefreq>daily</changefreq>
      <priority>${url === siteUrl ? '1.0' : '0.8'}</priority>
    </url>`;
            })
            .join('')}
</urlset>
`;

    // Ensure public directory exists
    const publicDir = path.resolve(__dirname, '../public');
    if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir);
    }

    fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap);
    console.log('Sitemap successfully generated at public/sitemap.xml');
};

generateSitemap();
