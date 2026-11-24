import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const baseUrl = 'https://adibx.me';
const authorName = 'Md Rakibujjaman Adib';

interface RouteMeta {
  path: string;
  title: string;
  description: string;
  keywords?: string[];
  image: string;
  type: 'website' | 'article';
  date?: string;
  category?: string;
  author?: string;
  contentHtml?: string;
  schema?: Record<string, any>;
}

function ensureDir(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function resolveAbsoluteUrl(imgPath: string): string {
  if (!imgPath) return `${baseUrl}/MdRakibujamanAdib.jpg`;
  if (imgPath.startsWith('http://') || imgPath.startsWith('https://')) return imgPath;
  const clean = imgPath.startsWith('/') ? imgPath : `/${imgPath}`;
  return `${baseUrl}${clean.replace(/ /g, '%20')}`;
}

async function getBlogs(): Promise<RouteMeta[]> {
  const blogsDir = path.resolve(__dirname, '../src/data/blogs');
  if (!fs.existsSync(blogsDir)) return [];

  const files = fs.readdirSync(blogsDir).filter(f => f.endsWith('.ts') && !f.startsWith('_') && f !== 'index.ts');
  const routes: RouteMeta[] = [];

  for (const file of files) {
    const fullPath = path.join(blogsDir, file);
    try {
      const module = await import(pathToFileURL(fullPath).href);
      const blog = module.default;
      if (!blog || (!blog.slug && !blog.id)) continue;

      const slug = blog.slug || blog.id;
      const cleanTitle = (blog.title || '').replace(/\s*\|\s*Md Rakibujjaman Adib/gi, '').trim();
      const pageTitle = `${cleanTitle} | ${authorName}`;
      const description = blog.subtitle || blog.summary || 'Technical engineering insight by Md Rakibujjaman Adib.';
      const absImage = resolveAbsoluteUrl(blog.coverImage || blog.image);
      const url = `${baseUrl}/blogs/${slug}`;

      const schema = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        '@id': `${url}#article`,
        'isPartOf': { '@id': `${baseUrl}/#website` },
        'mainEntityOfPage': { '@type': 'WebPage', '@id': url },
        'headline': cleanTitle,
        'description': description,
        'image': [absImage],
        'datePublished': blog.isoDate || new Date().toISOString(),
        'dateModified': blog.isoDate || new Date().toISOString(),
        'author': {
          '@type': 'Person',
          '@id': `${baseUrl}/#person`,
          'name': blog.author?.name || authorName,
          'url': `${baseUrl}/about`,
          'jobTitle': 'Creative Technologist & AI Architect'
        },
        'publisher': {
          '@type': 'Person',
          '@id': `${baseUrl}/#person`,
          'name': authorName,
          'url': baseUrl,
          'logo': {
            '@type': 'ImageObject',
            'url': `${baseUrl}/favicon.svg`
          }
        },
        'articleSection': blog.category || 'Insights',
        'keywords': (blog.tags || []).join(', '),
        'inLanguage': 'en-US'
      };

      const contentHtml = `
<article id="article-content" style="max-width:900px;margin:40px auto;padding:0 20px;font-family:system-ui,sans-serif;color:#111;">
  <header style="margin-bottom:32px;">
    <span style="font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#e62e05;">${blog.category || 'Article'}</span>
    <h1 style="font-size:32px;font-weight:800;margin:12px 0 16px 0;line-height:1.2;">${blog.title}</h1>
    <p style="font-size:18px;color:#555;line-height:1.5;">${blog.subtitle || blog.summary}</p>
    <div style="font-size:14px;color:#777;margin-top:16px;">
      By <strong>${blog.author?.name || authorName}</strong> &bull; ${blog.date || ''} &bull; ${blog.readTime || ''}
    </div>
  </header>
  <div class="article-body" style="font-size:16px;line-height:1.7;">
    ${blog.content || ''}
  </div>
</article>
`;

      routes.push({
        path: `blogs/${slug}`,
        title: pageTitle,
        description,
        keywords: blog.tags || [],
        image: absImage,
        type: 'article',
        date: blog.isoDate || blog.date,
        category: blog.category,
        author: blog.author?.name || authorName,
        contentHtml,
        schema
      });
    } catch (err) {
      console.warn(`[prerender] Failed to parse blog ${file}:`, err);
    }
  }

  return routes;
}

async function getProjects(): Promise<RouteMeta[]> {
  const projectsDir = path.resolve(__dirname, '../src/data/projects');
  if (!fs.existsSync(projectsDir)) return [];

  const files = fs.readdirSync(projectsDir).filter(f => f.endsWith('.ts') && !f.startsWith('_') && f !== 'index.ts');
  const routes: RouteMeta[] = [];

  for (const file of files) {
    const fullPath = path.join(projectsDir, file);
    try {
      const module = await import(pathToFileURL(fullPath).href);
      const project = module.default;
      if (!project || (!project.id && !project.title)) continue;

      const id = project.id || file.replace(/\.ts$/, '');
      const cleanTitle = (project.title || '').replace(/\s*\|\s*Md Rakibujjaman Adib/gi, '').trim();
      const pageTitle = `${cleanTitle} | ${authorName}`;
      const description = project.summary || 'Engineering and design project by Md Rakibujjaman Adib.';
      const absImage = resolveAbsoluteUrl(project.thumbnail || (project.images && project.images[0]) || '');
      const url = `${baseUrl}/projects/${id}`;

      const schema = {
        '@context': 'https://schema.org',
        '@type': 'CreativeWork',
        '@id': `${url}#project`,
        'name': cleanTitle,
        'headline': cleanTitle,
        'description': description,
        'image': [absImage],
        'datePublished': project.date || new Date().toISOString().substring(0, 10),
        'creator': {
          '@type': 'Person',
          '@id': `${baseUrl}/#person`,
          'name': authorName,
          'url': `${baseUrl}/about`
        },
        'inLanguage': 'en-US'
      };

      const contentHtml = `
<article id="project-content" style="max-width:900px;margin:40px auto;padding:0 20px;font-family:system-ui,sans-serif;color:#111;">
  <header style="margin-bottom:32px;">
    <span style="font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#e62e05;">${project.category || 'Project'}</span>
    <h1 style="font-size:32px;font-weight:800;margin:12px 0 16px 0;line-height:1.2;">${project.title}</h1>
    <p style="font-size:18px;color:#555;line-height:1.5;">${project.summary || ''}</p>
    <div style="font-size:14px;color:#777;margin-top:16px;">
      Role: <strong>${project.role || 'Developer & Designer'}</strong> &bull; Date: ${project.date || ''}
    </div>
  </header>
  <div class="project-body" style="font-size:16px;line-height:1.7;">
    ${project.description || ''}
  </div>
</article>
`;

      routes.push({
        path: `projects/${id}`,
        title: pageTitle,
        description,
        keywords: project.tags || [],
        image: absImage,
        type: 'article',
        date: project.date,
        category: project.category,
        author: authorName,
        contentHtml,
        schema
      });
    } catch (err) {
      console.warn(`[prerender] Failed to parse project ${file}:`, err);
    }
  }

  return routes;
}

function getStaticRoutes(): RouteMeta[] {
  return [
    {
      path: '',
      title: 'Md Rakibujjaman Adib | Web Developer & Brand Designer',
      description: "I'm Md Rakibujjaman Adib, a Web Developer & Creative Technologist. Explore my portfolio in visual brand identity, automation, and 3D design.",
      image: resolveAbsoluteUrl('/MdRakibujamanAdib.jpg'),
      type: 'website',
    },
    {
      path: 'about',
      title: 'About | Md Rakibujjaman Adib',
      description: 'Learn about Md Rakibujjaman Adib: Erasmus+ Scholar at Windesheim UAS (Netherlands), Founder of MCT Labs, and Co-Founder of Green D.',
      image: resolveAbsoluteUrl('/MdRakibujamanAdib.jpg'),
      type: 'website',
    },
    {
      path: 'projects',
      title: 'Projects | Md Rakibujjaman Adib',
      description: 'Explore engineering projects in Web Development, Serious Games, 3D CGI, and AI Systems built by Md Rakibujjaman Adib.',
      image: resolveAbsoluteUrl('/images/OG%20Image%20of%20Md%20Rakibujjaman%20Adib,%20Designer,%20Web%20Devloper,%203D%20Artist.jpg'),
      type: 'website',
    },
    {
      path: 'blogs',
      title: 'Knowledge & Insights | Md Rakibujjaman Adib',
      description: 'Technical architectural breakdowns and deep dives into Game Development, Autonomous AI, Computer Graphics, and Edge IoT.',
      image: resolveAbsoluteUrl('/images/hero-canal.jpg'),
      type: 'website',
    },
    {
      path: 'services',
      title: 'Services | Md Rakibujjaman Adib',
      description: 'Full-stack web engineering, 3D product rendering, brand identity design, and AI automation services.',
      image: resolveAbsoluteUrl('/images/OG%20Image%20of%20Md%20Rakibujjaman%20Adib,%20Designer,%20Web%20Devloper,%203D%20Artist.jpg'),
      type: 'website',
    },
    {
      path: 'achievements',
      title: 'Achievements & Honors | Md Rakibujjaman Adib',
      description: 'Podium finishes, Erasmus+ Scholarship at Windesheim UAS, and programming contest championships earned by Md Rakibujjaman Adib.',
      image: resolveAbsoluteUrl('/images/OG%20Image%20of%20Md%20Rakibujjaman%20Adib,%20Designer,%20Web%20Devloper,%203D%20Artist.jpg'),
      type: 'website',
    },
    {
      path: 'contact',
      title: 'Contact | Md Rakibujjaman Adib',
      description: 'Get in touch with Md Rakibujjaman Adib for software engineering, game development, brand design, and technical consulting.',
      image: resolveAbsoluteUrl('/MdRakibujamanAdib.jpg'),
      type: 'website',
    },
    {
      path: 'terms',
      title: 'Terms & Conditions | Md Rakibujjaman Adib',
      description: 'Terms of Service, Copyright and Originality Protections, Startup Free Prototype Initiative, and Milestone Payment Policies by Md Rakibujjaman Adib.',
      image: resolveAbsoluteUrl('/images/OG%20Image%20of%20Md%20Rakibujjaman%20Adib,%20Designer,%20Web%20Devloper,%203D%20Artist.jpg'),
      type: 'website',
    },
    {
      path: 'privacy',
      title: 'Privacy Policy & NDA | Md Rakibujjaman Adib',
      description: 'Data Privacy Policy, Mutual Non-Disclosure, and Portfolio Showcase Rights by Md Rakibujjaman Adib.',
      image: resolveAbsoluteUrl('/images/OG%20Image%20of%20Md%20Rakibujjaman%20Adib,%20Designer,%20Web%20Devloper,%203D%20Artist.jpg'),
      type: 'website',
    },
  ];
}

function renderHtml(template: string, meta: RouteMeta): string {
  const canonicalUrl = meta.path ? `${baseUrl}/${meta.path}` : baseUrl;
  const keywordsStr = meta.keywords && meta.keywords.length > 0 ? meta.keywords.join(', ') : 'Md Rakibujjaman Adib, Web Developer, AI Architect, Game Developer, Brand Designer';

  let html = template;

  // 1. Replace Title
  html = html.replace(/<title>.*?<\/title>/i, `<title>${meta.title}</title>`);

  // 2. Replace or Inject Meta Description
  if (/<meta\s+name="description"\s+content=".*?"\s*\/?>/i.test(html)) {
    html = html.replace(/<meta\s+name="description"\s+content=".*?"\s*\/?>/i, `<meta name="description" content="${meta.description}" />`);
  } else {
    html = html.replace('</head>', `  <meta name="description" content="${meta.description}" />\n</head>`);
  }

  // 3. Replace or Inject Canonical Link
  if (/<link\s+rel="canonical"\s+href=".*?"\s*\/?>/i.test(html)) {
    html = html.replace(/<link\s+rel="canonical"\s+href=".*?"\s*\/?>/i, `<link rel="canonical" href="${canonicalUrl}" />`);
  } else {
    html = html.replace('</head>', `  <link rel="canonical" href="${canonicalUrl}" />\n</head>`);
  }

  // 4. Update OpenGraph Tags
  html = html.replace(/<meta\s+property="og:title"\s+content=".*?"\s*\/?>/i, `<meta property="og:title" content="${meta.title}" />`);
  html = html.replace(/<meta\s+property="og:description"\s+content=".*?"\s*\/?>/i, `<meta property="og:description" content="${meta.description}" />`);
  html = html.replace(/<meta\s+property="og:url"\s+content=".*?"\s*\/?>/i, `<meta property="og:url" content="${canonicalUrl}" />`);
  html = html.replace(/<meta\s+property="og:type"\s+content=".*?"\s*\/?>/i, `<meta property="og:type" content="${meta.type}" />`);
  html = html.replace(/<meta\s+property="og:image"\s+content=".*?"\s*\/?>/i, `<meta property="og:image" content="${meta.image}" />`);

  // 5. Update Twitter Card Tags
  html = html.replace(/<meta\s+name="twitter:title"\s+content=".*?"\s*\/?>/i, `<meta name="twitter:title" content="${meta.title}" />`);
  html = html.replace(/<meta\s+name="twitter:description"\s+content=".*?"\s*\/?>/i, `<meta name="twitter:description" content="${meta.description}" />`);
  html = html.replace(/<meta\s+name="twitter:image"\s+content=".*?"\s*\/?>/i, `<meta name="twitter:image" content="${meta.image}" />`);

  // 6. Inject Schema JSON-LD if provided
  if (meta.schema) {
    const schemaScript = `\n  <script type="application/ld+json">\n${JSON.stringify(meta.schema, null, 2)}\n  </script>\n`;
    html = html.replace('</head>', `${schemaScript}</head>`);
  }

  // 7. Inject Noscript / Fallback Content for Crawlers
  if (meta.contentHtml) {
    const noscriptContent = `\n  <noscript>\n${meta.contentHtml}\n  </noscript>\n`;
    html = html.replace('</body>', `${noscriptContent}</body>`);
  }

  return html;
}

async function runPrerender() {
  const distDir = path.resolve(__dirname, '../dist');
  const indexHtmlPath = path.join(distDir, 'index.html');

  if (!fs.existsSync(indexHtmlPath)) {
    console.error(`[prerender] Error: dist/index.html not found! Run 'vite build' first.`);
    process.exit(1);
  }

  const template = fs.readFileSync(indexHtmlPath, 'utf8');

  const staticRoutes = getStaticRoutes();
  const blogRoutes = await getBlogs();
  const projectRoutes = await getProjects();

  const allRoutes = [...staticRoutes, ...blogRoutes, ...projectRoutes];

  console.log(`[prerender] Generating static HTML and OpenGraph metadata for ${allRoutes.length} routes...`);

  let count = 0;
  for (const meta of allRoutes) {
    const rendered = renderHtml(template, meta);

    if (!meta.path) {
      // Root route: overwrite dist/index.html with populated root metadata
      fs.writeFileSync(indexHtmlPath, rendered, 'utf8');
      count++;
      continue;
    }

    // 1. Directory route: dist/<path>/index.html
    const routeDir = path.join(distDir, meta.path);
    ensureDir(routeDir);
    fs.writeFileSync(path.join(routeDir, 'index.html'), rendered, 'utf8');

    // 2. Clean URL file: dist/<path>.html
    ensureDir(path.dirname(path.join(distDir, `${meta.path}.html`)));
    fs.writeFileSync(path.join(distDir, `${meta.path}.html`), rendered, 'utf8');

    count++;
  }

  console.log(`[prerender] Successfully generated static pages & OpenGraph previews for ${count} routes.`);
}

runPrerender();
