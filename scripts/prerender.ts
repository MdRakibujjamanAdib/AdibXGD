import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const siteUrl = 'https://adibx.me';

const getFiles = (dir: string): string[] => {
    return fs.readdirSync(dir).filter(file => file.endsWith('.ts'));
};

const escapeHtml = (unsafe: string) => {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
};

const generateMetaTags = (title: string, description: string, image: string, url: string) => {
    const defaultImage = "https://adibx.me/images/OG%20Image%20of%20Md%20Rakibujjaman%20Adib,%20Designer,%20Web%20Devloper,%203D%20Artist.jpg";
    const absoluteImage = image ? (image.startsWith('http') ? image : `${siteUrl}${image.startsWith('/') ? '' : '/'}${image}`) : defaultImage;

    return `
  <title>${escapeHtml(title)}</title>
  
  <meta name="description" content="${escapeHtml(description)}" />
  
  <!-- OpenGraph Tags -->
  <meta property="og:type" content="article" />
  <meta property="og:url" content="${url}" />
  <meta property="og:site_name" content="Md Rakibujjaman Adib" />
  <meta property="og:title" content="${escapeHtml(title)}" />
  <meta property="og:description" content="${escapeHtml(description)}" />
  <meta property="og:image" content="${absoluteImage}" />

  <!-- Twitter Card Tags -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:creator" content="@MdRakibujjamanAdib" />
  <meta name="twitter:title" content="${escapeHtml(title)}" />
  <meta name="twitter:description" content="${escapeHtml(description)}" />
  <meta name="twitter:image" content="${absoluteImage}" />`;
};

const prerender = async () => {
    console.log('🚀 Starting prerender process for dynamic SEO tags...');
    const distDir = path.resolve(__dirname, '../dist');
    const indexHtmlPath = path.join(distDir, 'index.html');

    if (!fs.existsSync(indexHtmlPath)) {
        console.error('❌ Error: dist/index.html not found. Make sure to run `vite build` first.');
        process.exit(1);
    }

    const templateHtml = fs.readFileSync(indexHtmlPath, 'utf-8');

    const injectMeta = (html: string, metaTags: string) => {
        // Replace everything between <title> and </head> with our new tags, while keeping standard tags
        const headStart = html.indexOf('<head>') + 6;
        const headContent = html.substring(headStart, html.indexOf('</head>'));

        // Remove existing title, description, keywords, og: and twitter: tags to prevent duplicates
        let cleanedHead = headContent
            .replace(/<title>.*?<\/title>/gi, '')
            .replace(/<meta name="description".*?>/gi, '')
            .replace(/<meta name="keywords".*?>/gi, '')
            .replace(/<meta property="og:.*?".*?>/gi, '')
            .replace(/<meta name="twitter:.*?".*?>/gi, '');

        cleanedHead += metaTags;

        return html.substring(0, headStart) + cleanedHead + html.substring(html.indexOf('</head>'));
    };

    // Process Projects
    const projectsDir = path.resolve(__dirname, '../src/data/projects');
    const projectFiles = getFiles(projectsDir);

    for (const file of projectFiles) {
        const id = file.replace('.ts', '');
        try {
            const modulePath = path.join(projectsDir, file);
            const moduleUrl = pathToFileURL(modulePath).href;
            const module = await import(moduleUrl);
            const project = module.default;

            const url = `${siteUrl}/projects/${id}`;
            const metaTags = generateMetaTags(
                `${project.title} | Md Rakibujjaman Adib`,
                project.summary,
                project.thumbnail || project.images?.[0] || '',
                url
            );

            const finalHtml = injectMeta(templateHtml, metaTags);

            // Create directory and save file
            const targetDir = path.join(distDir, 'projects', id);
            fs.mkdirSync(targetDir, { recursive: true });
            fs.writeFileSync(path.join(targetDir, 'index.html'), finalHtml);
            console.log(`✅ Prerendered SEO for project: ${id}`);
        } catch (error) {
            console.error(`❌ Error prerendering project ${id}:`, error);
        }
    }

    // Process Blogs
    const blogsDir = path.resolve(__dirname, '../src/data/blogs');
    const blogFiles = getFiles(blogsDir);

    for (const file of blogFiles) {
        const id = file.replace('.ts', '');
        try {
            const modulePath = path.join(blogsDir, file);
            const moduleUrl = pathToFileURL(modulePath).href;
            const module = await import(moduleUrl);
            const blog = module.default;

            const url = `${siteUrl}/blogs/${id}`;
            const metaTags = generateMetaTags(
                `${blog.title} | Md Rakibujjaman Adib`,
                blog.summary,
                blog.image || '',
                url
            );

            const finalHtml = injectMeta(templateHtml, metaTags);

            // Create directory and save file
            const targetDir = path.join(distDir, 'blogs', id);
            fs.mkdirSync(targetDir, { recursive: true });
            fs.writeFileSync(path.join(targetDir, 'index.html'), finalHtml);
            console.log(`✅ Prerendered SEO for blog: ${id}`);
        } catch (error) {
            console.error(`❌ Error prerendering blog ${id}:`, error);
        }
    }

    console.log('✨ SEO prerendering complete!');
};

prerender();
