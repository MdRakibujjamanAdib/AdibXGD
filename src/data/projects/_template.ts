import type { Project } from '../projects.ts';

/**
 * PROJECT TEMPLATE:
 * Duplicate this file and rename it (e.g. `my-awesome-project.ts`).
 *
 * Fields:
 * - `featured: true` -> Displays on the Home page carousel and featured bento grid!
 * - `featured: false` -> Appears in /projects listing only.
 */
const project: Project = {
  id: "my-new-project-id",
  title: "Project Display Title",
  shortTitle: "Short Label", // Optional concise label for homepage cards
  category: "Web & Automation", // '3D' | 'Web & Automation' | 'Brand Identity' | 'Video Editing'
  role: "Lead Developer / Designer",
  featured: false, // Set to true to display on Home screen!
  featuredOrder: 1, // Optional ordering for home screen (1 is first/top)
  summary: "A brief one or two sentence summary of the project.",
  description: "<p>Detailed HTML or narrative description of the project.</p>",
  thumbnail: "/images/projects/your-thumbnail.jpg",
  images: [
    "/images/projects/your-image-1.jpg",
    "/images/projects/your-image-2.jpg"
  ],
  demoUrl: "https://adibx.me/projects",
  repoUrl: "https://github.com/your-username/your-repo",
  tags: [
    "Tag 1",
    "Tag 2"
  ],
  date: "2026-01-01",
  seo: {
    keywords: ["keyword 1", "keyword 2"]
  }
};

export default project;
