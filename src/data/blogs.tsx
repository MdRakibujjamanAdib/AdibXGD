/// <reference types="vite/client" />
export interface Blog {
    id: string;
    slug: string;
    title: string;
    date: string;
    category: string;
    summary: string;
    content: string; // This expects HTML as a string
    image: string;
    link: string;
    seo?: {
        keywords?: string[];
        meta?: Array<{ name?: string; property?: string; content: string }>;
    };
}

// Dynamically import all object files from the blogs folder
const blogModules = import.meta.glob('./blogs/*.ts', { eager: true });

export const blogs: Blog[] = Object.values(blogModules).map(
    (module: any) => module.default as Blog
);
