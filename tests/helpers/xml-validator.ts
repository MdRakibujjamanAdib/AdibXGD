import fs from 'fs';

export interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: string;
  priority?: string;
}

export interface SitemapValidationResult {
  isValid: boolean;
  errors: string[];
  urls: SitemapUrl[];
  rawXml: string;
}

export function validateSitemapString(xml: string): SitemapValidationResult {
  const errors: string[] = [];
  const urls: SitemapUrl[] = [];

  if (!xml || xml.trim().length === 0) {
    return { isValid: false, errors: ['XML content is empty'], urls: [], rawXml: xml };
  }

  // Check XML Declaration
  if (!xml.startsWith('<?xml')) {
    errors.push('Missing XML declaration (expected "<?xml ... ?>")');
  }

  // Check Root Tag
  if (!xml.includes('<urlset') || !xml.includes('</urlset>')) {
    errors.push('Missing or unclosed <urlset> root element');
  }

  if (!xml.includes('xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"') &&
      !xml.includes("xmlns='http://www.sitemaps.org/schemas/sitemap/0.9'")) {
    errors.push('Root <urlset> missing required sitemaps.org xmlns attribute');
  }

  // Check Tag Balance for basic malformed XML
  const tagStack: string[] = [];
  const tagRegex = /<\/?([a-zA-Z0-9_\-]+)(?:\s+[^>]*?)?(\/?)>/g;
  let match: RegExpExecArray | null;

  while ((match = tagRegex.exec(xml)) !== null) {
    const fullTag = match[0];
    const tagName = match[1];
    const isSelfClosing = match[2] === '/' || fullTag.endsWith('/>');
    const isClosing = fullTag.startsWith('</');

    if (fullTag.startsWith('<?') || fullTag.startsWith('<!--')) {
      continue;
    }

    if (isSelfClosing) {
      continue;
    }

    if (isClosing) {
      const last = tagStack.pop();
      if (last !== tagName) {
        errors.push(`Mismatched closing tag </${tagName}>, expected </${last}>`);
      }
    } else {
      tagStack.push(tagName);
    }
  }

  if (tagStack.length > 0) {
    errors.push(`Unclosed XML tags remaining: ${tagStack.join(', ')}`);
  }

  // Extract <url> blocks
  const urlBlockRegex = /<url\b[^>]*>([\s\S]*?)<\/url>/g;
  let urlMatch: RegExpExecArray | null;

  const validChangefreqs = new Set(['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never']);

  while ((urlMatch = urlBlockRegex.exec(xml)) !== null) {
    const block = urlMatch[1];

    const locMatch = /<loc\b[^>]*>([\s\S]*?)<\/loc>/.exec(block);
    const lastmodMatch = /<lastmod\b[^>]*>([\s\S]*?)<\/lastmod>/.exec(block);
    const changefreqMatch = /<changefreq\b[^>]*>([\s\S]*?)<\/changefreq>/.exec(block);
    const priorityMatch = /<priority\b[^>]*>([\s\S]*?)<\/priority>/.exec(block);

    if (!locMatch) {
      errors.push('<url> node missing mandatory <loc> tag');
      continue;
    }

    const loc = locMatch[1].trim();
    const lastmod = lastmodMatch ? lastmodMatch[1].trim() : undefined;
    const changefreq = changefreqMatch ? changefreqMatch[1].trim() : undefined;
    const priority = priorityMatch ? priorityMatch[1].trim() : undefined;

    // Validate loc
    if (!loc.startsWith('https://') && !loc.startsWith('http://')) {
      errors.push(`Invalid URL protocol in <loc>: ${loc}`);
    }

    // Validate lastmod if present
    if (lastmod) {
      const isValidCalendarDate = (() => {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(lastmod)) return false;
        const d = new Date(lastmod);
        if (isNaN(d.getTime())) return false;
        return d.toISOString().slice(0, 10) === lastmod;
      })();

      if (!isValidCalendarDate) {
        errors.push(`Invalid <lastmod> format (must be valid YYYY-MM-DD calendar date): "${lastmod}" in URL ${loc}`);
      }
    }

    // Validate changefreq if present
    if (changefreq && !validChangefreqs.has(changefreq)) {
      errors.push(`Invalid <changefreq> value "${changefreq}" in URL ${loc}`);
    }

    // Validate priority if present
    if (priority) {
      const num = parseFloat(priority);
      if (isNaN(num) || num < 0.0 || num > 1.0) {
        errors.push(`Invalid <priority> value "${priority}" in URL ${loc} (must be 0.0 to 1.0)`);
      }
    }

    urls.push({ loc, lastmod, changefreq, priority });
  }

  return {
    isValid: errors.length === 0,
    errors,
    urls,
    rawXml: xml,
  };
}

export function validateSitemapFile(filePath: string): SitemapValidationResult {
  if (!fs.existsSync(filePath)) {
    return {
      isValid: false,
      errors: [`Sitemap file does not exist at ${filePath}`],
      urls: [],
      rawXml: '',
    };
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  return validateSitemapString(content);
}
