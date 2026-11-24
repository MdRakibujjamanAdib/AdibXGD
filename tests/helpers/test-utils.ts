import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';

export const ROOT_DIR = process.cwd();
export const DIST_DIR = path.join(ROOT_DIR, 'dist');
export const PUBLIC_DIR = path.join(ROOT_DIR, 'public');

export const STATIC_ROUTES = [
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

export function getProjectFiles(): string[] {
  const dir = path.join(ROOT_DIR, 'src/data/projects');
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.ts') && !f.startsWith('_') && !/^(index|types)$/i.test(f.replace(/\.ts$/, '')));
}

export function getProjectIds(): string[] {
  const dir = path.join(ROOT_DIR, 'src/data/projects');
  return getProjectFiles().map((file) => {
    const content = fs.readFileSync(path.join(dir, file), 'utf-8');
    const match = /id:\s*['"]([^'"]+)['"]/.exec(content);
    return match ? match[1].trim() : file.replace(/\.ts$/, '');
  });
}

export function getBlogFiles(): string[] {
  const dir = path.join(ROOT_DIR, 'src/data/blogs');
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.ts') && !f.startsWith('_') && !/^(index|types)$/i.test(f.replace(/\.ts$/, '')));
}

export function getBlogSlugs(): string[] {
  const dir = path.join(ROOT_DIR, 'src/data/blogs');
  return getBlogFiles().map((file) => {
    const content = fs.readFileSync(path.join(dir, file), 'utf-8');
    const slugMatch = /slug:\s*['"]([^'"]+)['"]/.exec(content);
    if (slugMatch) return slugMatch[1].trim();
    const idMatch = /id:\s*['"]([^'"]+)['"]/.exec(content);
    return idMatch ? idMatch[1].trim() : file.replace(/\.ts$/, '');
  });
}

export function getBlogSlugWithCode(): string {
  const dir = path.join(ROOT_DIR, 'src/data/blogs');
  for (const file of getBlogFiles()) {
    const content = fs.readFileSync(path.join(dir, file), 'utf-8');
    if (content.includes('<pre')) {
      const slugMatch = /slug:\s*['"]([^'"]+)['"]/.exec(content);
      return slugMatch ? slugMatch[1].trim() : file.replace(/\.ts$/, '');
    }
  }
  return getBlogSlugs()[0];
}

export function getAllPublicRoutes(): string[] {
  return [
    ...STATIC_ROUTES,
    ...getProjectIds().map((id) => `/projects/${id}`),
    ...getBlogSlugs().map((slug) => `/blogs/${slug}`),
  ];
}

export function getDistHtmlPath(route: string): string {
  if (route === '/') return path.join(DIST_DIR, 'index.html');
  if (route === '/404') return path.join(DIST_DIR, '404.html');
  const clean = route.replace(/^\/+/, '').replace(/\/+$/, '');
  return path.join(DIST_DIR, clean, 'index.html');
}

export function extractHtmlTitle(html: string): string {
  const m = /<title[^>]*>([\s\S]*?)<\/title>/i.exec(html);
  return m ? decodeBasicEntities(m[1].trim()) : '';
}

export function extractMetaContent(html: string, nameOrProp: string): string | null {
  const escaped = nameOrProp.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const metaTags = html.match(/<meta\b[^>]*>/gi) || [];
  for (const tag of metaTags) {
    const attrMatch = new RegExp(`(?:name|property)=["']${escaped}["']`, 'i').test(tag);
    if (!attrMatch) continue;
    const contentMatch = /content=["']([^"']*)["']/i.exec(tag);
    if (contentMatch) {
      return decodeBasicEntities(contentMatch[1]);
    }
  }
  return null;
}

export function extractCanonicalHref(html: string): string | null {
  const linkTags = html.match(/<link\b[^>]*>/gi) || [];
  for (const tag of linkTags) {
    if (/rel=["']canonical["']/i.test(tag)) {
      const hrefMatch = /href=["']([^"']*)["']/i.exec(tag);
      if (hrefMatch) return decodeBasicEntities(hrefMatch[1]);
    }
  }
  return null;
}

export function extractJsonLdFromHtml(html: string): any[] {
  const results: any[] = [];
  const regex = /<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let m: RegExpExecArray | null;
  while ((m = regex.exec(html)) !== null) {
    try {
      const parsed = JSON.parse(m[1].trim());
      if (Array.isArray(parsed)) {
        results.push(...parsed);
      } else if (parsed) {
        results.push(parsed);
      }
    } catch {
      // Leave invalid JSON out; explicit validity tests catch parse errors
    }
  }
  return results;
}

export function flattenGraphNodes(items: any[]): any[] {
  const nodes: any[] = [];
  for (const item of items) {
    if (!item || typeof item !== 'object') continue;
    if (Array.isArray(item['@graph'])) {
      nodes.push(...flattenGraphNodes(item['@graph']));
    } else {
      nodes.push(item);
    }
  }
  return nodes;
}

export function hasType(node: any, expectedType: string): boolean {
  const t = node?.['@type'];
  return t === expectedType || (Array.isArray(t) && t.includes(expectedType));
}

export function decodeBasicEntities(str: string): string {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'");
}

export function getImageDimensions(filePath: string): { width: number; height: number } | null {
  if (!fs.existsSync(filePath)) return null;
  const buf = fs.readFileSync(filePath);
  const ext = path.extname(filePath).toLowerCase();

  // PNG
  if (ext === '.png' && buf.length >= 24 && buf.toString('ascii', 1, 4) === 'PNG') {
    return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
  }

  // JPEG (scan SOF0..SOF3 markers)
  if ((ext === '.jpg' || ext === '.jpeg') && buf.length >= 4 && buf[0] === 0xff && buf[1] === 0xd8) {
    let offset = 2;
    while (offset + 8 < buf.length) {
      if (buf[offset] !== 0xff) {
        offset++;
        continue;
      }
      const marker = buf[offset + 1];
      if (marker === 0xd9 || marker === 0xda) break;
      if (marker >= 0xc0 && marker <= 0xc3) {
        const height = buf.readUInt16BE(offset + 5);
        const width = buf.readUInt16BE(offset + 7);
        return { width, height };
      }
      const segLen = buf.readUInt16BE(offset + 2);
      if (segLen < 2) break;
      offset += 2 + segLen;
    }
  }

  // WebP (VP8 / VP8L / VP8X)
  if (ext === '.webp' && buf.length >= 30 && buf.toString('ascii', 0, 4) === 'RIFF' && buf.toString('ascii', 8, 12) === 'WEBP') {
    const chunk = buf.toString('ascii', 12, 16);
    if (chunk === 'VP8X' && buf.length >= 30) {
      const width = 1 + (buf[24] | (buf[25] << 8) | (buf[26] << 16));
      const height = 1 + (buf[27] | (buf[28] << 8) | (buf[29] << 16));
      return { width, height };
    }
    if (chunk === 'VP8 ' && buf.length >= 30) {
      const width = buf.readUInt16LE(26) & 0x3fff;
      const height = buf.readUInt16LE(28) & 0x3fff;
      return { width, height };
    }
    if (chunk === 'VP8L' && buf.length >= 25) {
      const bits = buf.readUInt32LE(21);
      const width = (bits & 0x3fff) + 1;
      const height = ((bits >> 14) & 0x3fff) + 1;
      return { width, height };
    }
  }

  return null;
}

export function findAuditReportFiles(): string[] {
  const candidates: string[] = [];
  const excludedRoot = new Set(['readme.md', 'project-editing-guide.md', 'claude.md', 'agents.md', 'gemini.md']);
  const excludedDocs = new Set(['blog-cover-sources.md', 'blog-implementation-report.md']);

  for (const entry of fs.readdirSync(ROOT_DIR)) {
    if (entry.toLowerCase().endsWith('.md') && !excludedRoot.has(entry.toLowerCase())) {
      candidates.push(path.join(ROOT_DIR, entry));
    }
  }

  const docsDir = path.join(ROOT_DIR, 'docs');
  if (fs.existsSync(docsDir)) {
    for (const entry of fs.readdirSync(docsDir)) {
      if (entry.toLowerCase().endsWith('.md') && !excludedDocs.has(entry.toLowerCase())) {
        candidates.push(path.join(docsDir, entry));
      }
    }
  }

  return candidates;
}

export function parseRgb(colorStr: string): [number, number, number] {
  const match = colorStr.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (match) {
    return [parseInt(match[1], 10), parseInt(match[2], 10), parseInt(match[3], 10)];
  }
  return [0, 0, 0];
}

export function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r / 255, g / 255, b / 255].map((c) =>
    c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  );
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

export function calculateContrastRatio(fg: string, bg: string): number {
  const [r1, g1, b1] = parseRgb(fg);
  const [r2, g2, b2] = parseRgb(bg);
  const lum1 = getLuminance(r1, g1, b1);
  const lum2 = getLuminance(r2, g2, b2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

export async function loadSchemaBuilder(): Promise<{
  getRouteMetadata: (routePath: string) => {
    title: string;
    description: string;
    canonicalUrl: string;
    ogImage: string;
    ogType: string;
    robots: string;
  };
  getRouteJsonLd: (routePath: string) => Record<string, any>;
}> {
  const builderPath = path.join(ROOT_DIR, 'src/utils/schemaBuilder.ts');
  if (!fs.existsSync(builderPath)) {
    throw new Error('src/utils/schemaBuilder.ts does not exist yet (M2 deliverable)');
  }
  return await import(pathToFileURL(builderPath).href);
}
