/// <reference types="vite/client" />

export interface BlogTocItem {
  id: string;
  title: string;
  level?: 2 | 3;
}

export interface BlogAuthor {
  name: string;
  role: string;
  avatar: string;
  bio?: string;
  url?: string;
}

export interface Blog {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  summary: string;
  category: string;
  tags: string[];
  date: string;
  isoDate: string;
  readTime: string;
  author: BlogAuthor;
  coverImage: string;
  coverImageAlt: string;
  content: string;
  tableOfContents?: BlogTocItem[];
  featured?: boolean;
  seo?: {
    keywords?: string[];
    meta?: Array<{ name?: string; property?: string; content: string }>;
  };
  // Backward compatibility aliases
  image: string;
  link: string;
}

// Dynamically import all object files from the blogs folder
const blogModules = import.meta.glob('./blogs/*.ts', { eager: true });

export const blogs: Blog[] = Object.values(blogModules)
  .map((module: any) => {
    const raw = (module.default || module) as Partial<Blog> & Record<string, any>;
    const slug = raw.slug || raw.id || '';
    const coverImage = raw.coverImage || raw.image || '';
    const link = raw.link || `/blogs/${slug}`;

    return {
      ...raw,
      id: raw.id || slug,
      slug,
      subtitle: raw.subtitle || '',
      summary: raw.summary || '',
      category: raw.category || 'General',
      tags: raw.tags || (raw.seo?.keywords ? raw.seo.keywords : []),
      date: raw.date || '',
      isoDate: raw.isoDate || (raw.date && !isNaN(new Date(raw.date).getTime()) ? new Date(raw.date).toISOString() : ''),
      readTime: raw.readTime || '5 min read',
      author: raw.author || {
        name: 'Md Rakibujjaman Adib',
        role: 'Erasmus+ Game Developer & AI Architect',
        avatar: '/MdRakibujamanAdib.jpg',
      },
      coverImage,
      coverImageAlt: raw.coverImageAlt || raw.title || '',
      content: raw.content || '',
      tableOfContents: raw.tableOfContents || [],
      featured: Boolean(raw.featured),
      // Backward compatibility aliases
      image: raw.image || coverImage,
      link,
    } as Blog;
  })
  .sort((a, b) => new Date(b.isoDate || b.date).getTime() - new Date(a.isoDate || a.date).getTime());
