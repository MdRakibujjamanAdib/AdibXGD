/// <reference types="vite/client" />
export interface Project {
  id: string;
  title: string;
  shortTitle?: string; // Short label displayed on homepage recent cards (e.g. 'Gadget N Gadget')
  category: '3D' | 'Web & Automation' | 'Brand Identity' | 'Video Editing' | 'UI/UX Design';
  role?: string;
  summary: string;
  description: string;
  thumbnail: string;
  thumbnails?: string[];
  images?: string[]; // For 3D, Branding, etc.
  videoUrl?: string; // For Video Editing (YouTube embed)
  demoUrl?: string;
  repoUrl?: string;
  tags: string[];
  date: string;
  featured?: boolean;
  featuredOrder?: number; // 1-based order for display on home screen (1 is top/first)
  seo?: {
    keywords?: string[];
    meta?: Array<{ name?: string; property?: string; content: string }>;
  };
}

// Dynamically import all individual project files from the projects/ folder
const projectModules = import.meta.glob('./projects/*.ts', { eager: true });

export const projects: Project[] = Object.entries(projectModules)
  .filter(([path]) => !path.includes('_template') && !path.endsWith('index.ts'))
  .map(([_, module]: [string, any]) => module.default as Project)
  .filter((p): p is Project => Boolean(p && p.id && p.title));
