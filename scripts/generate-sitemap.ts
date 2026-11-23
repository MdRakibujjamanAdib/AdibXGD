import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const siteUrl = 'https://adibx.me';
const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format

interface SitemapEntry {
    url: string;
    lastmod: string;
    changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
    priority: string;
}

/**
 * Safely discovers valid data files, filtering out definitions, indexes, drafts, and test files.
 */
const getFiles = (dir: string): string[] => {
    if (!fs.existsSync(dir)) return [];
    return fs.readdirSync(dir).filter(file => {
        if (!file.endsWith('.ts') && !file.endsWith('.tsx')) return false;
        if (file.endsWith('.d.ts')) return false;
        if (file.startsWith('_')) return false;
        const baseName = file.replace(/\.(ts|tsx)$/, '');
        if (/^(index|types|schema|constants)$/i.test(baseName)) return false;
        if (baseName.includes('.test') || baseName.includes('.spec')) return false;
        return true;
    });
};

/**
 * Extracts the true published / modified date from a data file.
 * Handles isoDate, article:published_time, and date strings in a timezone-safe manner.
 */
const extractDate = (filePath: string, fallbackDate: string): string => {
    try {
        const content = fs.readFileSync(filePath, 'utf8');

        // 1. Check for isoDate: 'YYYY-MM-DD...'
        const isoFieldMatch = content.match(/isoDate:\s*['"]([^'"]+)['"]/);
        if (isoFieldMatch) {
            const val = isoFieldMatch[1].trim();
            if (/^\d{4}-\d{2}-\d{2}/.test(val)) return val.substring(0, 10);
        }

        // 2. Check for article:published_time content: 'YYYY-MM-DD...'
        const pubTimeMatch = content.match(/article:published_time['"]\s*,\s*content:\s*['"]([^'"]+)['"]/);
        if (pubTimeMatch) {
            const val = pubTimeMatch[1].trim();
            if (/^\d{4}-\d{2}-\d{2}/.test(val)) return val.substring(0, 10);
        }

        // 3. Check for date: '...'
        const dateMatch = content.match(/date:\s*['"]([^'"]+)['"]/);
        if (dateMatch) {
            const val = dateMatch[1].trim();
            // If already YYYY-MM-DD
            if (/^\d{4}-\d{2}-\d{2}$/.test(val)) return val;
            // Otherwise parse with Date and format in calendar YYYY-MM-DD
            const d = new Date(val);
            if (!isNaN(d.getTime())) {
                const year = d.getFullYear();
                const month = String(d.getMonth() + 1).padStart(2, '0');
                const day = String(d.getDate()).padStart(2, '0');
                return `${year}-${month}-${day}`;
            }
        }
    } catch {
        // fallback to default
    }
    return fallbackDate;
};

/**
 * Extracts project ID from file content to avoid route mismatches where id != filename.
 */
const extractProjectId = (filePath: string, fallback: string): string => {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const match = content.match(/id:\s*['"]([^'"]+)['"]/);
        if (match) return match[1].trim();
    } catch {
        // fallback
    }
    return fallback;
};

/**
 * Extracts blog slug from file content to match react-router slug lookup.
 */
const extractBlogSlug = (filePath: string, fallback: string): string => {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const slugMatch = content.match(/slug:\s*['"]([^'"]+)['"]/);
        if (slugMatch) return slugMatch[1].trim();
        const idMatch = content.match(/id:\s*['"]([^'"]+)['"]/);
        if (idMatch) return idMatch[1].trim();
    } catch {
        // fallback
    }
    return fallback;
};

const generateSitemap = () => {
    const projectsDir = path.resolve(__dirname, '../src/data/projects');
    const blogsDir = path.resolve(__dirname, '../src/data/blogs');

    const projectEntries: SitemapEntry[] = getFiles(projectsDir).map(file => {
        const filePath = path.join(projectsDir, file);
        const fallback = file.replace(/\.(ts|tsx)$/, '');
        const id = extractProjectId(filePath, fallback);
        const date = extractDate(filePath, today);
        return {
            url: `${siteUrl}/projects/${id}`,
            lastmod: date,
            changefreq: 'monthly',
            priority: '0.6',
        };
    });

    const blogEntries: SitemapEntry[] = getFiles(blogsDir).map(file => {
        const filePath = path.join(blogsDir, file);
        const fallback = file.replace(/\.(ts|tsx)$/, '');
        const slug = extractBlogSlug(filePath, fallback);
        const date = extractDate(filePath, today);
        return {
            url: `${siteUrl}/blogs/${slug}`,
            lastmod: date,
            changefreq: 'monthly',
            priority: '0.7',
        };
    });

    // Static pages matching all active routes defined in App.tsx
    const staticPages: SitemapEntry[] = [
        { url: siteUrl, lastmod: today, changefreq: 'weekly', priority: '1.0' },
        { url: `${siteUrl}/about`, lastmod: today, changefreq: 'monthly', priority: '0.8' },
        { url: `${siteUrl}/projects`, lastmod: today, changefreq: 'weekly', priority: '0.8' },
        { url: `${siteUrl}/services`, lastmod: today, changefreq: 'weekly', priority: '0.8' },
        { url: `${siteUrl}/blogs`, lastmod: today, changefreq: 'weekly', priority: '0.8' },
        { url: `${siteUrl}/achievements`, lastmod: today, changefreq: 'monthly', priority: '0.8' },
        { url: `${siteUrl}/contact`, lastmod: today, changefreq: 'monthly', priority: '0.8' },
    ];

    const allEntries: SitemapEntry[] = [...staticPages, ...projectEntries, ...blogEntries];

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allEntries
    .map(
        entry => `  <url>
    <loc>${entry.url}</loc>
    <lastmod>${entry.lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`
    )
    .join('\n')}
</urlset>
`;

    const publicDir = path.resolve(__dirname, '../public');
    if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir, { recursive: true });
    }

    fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap, 'utf8');
    console.log(`Sitemap successfully generated at public/sitemap.xml with ${allEntries.length} routes.`);
};

generateSitemap();
