
/// <reference types="vite/client" />
export interface Project {
  id: string;
  title: string;
  category: '3D' | 'Web & Automation' | 'Brand Identity' | 'Video Editing';
  role?: string;
  summary: string;
  description: string;
  thumbnail: string;
  images?: string[]; // For 3D, Branding, etc.
  videoUrl?: string; // For Video Editing (YouTube embed)
  demoUrl?: string;
  repoUrl?: string;
  tags: string[];
  date: string;
  featured?: boolean;
  seo?: {
    keywords?: string[];
    meta?: Array<{ name?: string; property?: string; content: string }>;
  };
}

// Dynamically import all object files from the projects folder
const projectModules = import.meta.glob('./projects/*.ts', { eager: true });

export const projects: Project[] = Object.values(projectModules).map(
  (module: any) => module.default as Project
);
