
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
}

export const projects: Project[] = [
  // 3D Projects (Multiple renders)
  {
    id: "cyberpunk-city",
    title: "Neon Cyberpunk City",
    category: "3D",
    role: "3D Artist",
    summary: "A futuristic city environment rendered in Blender with volumetric lighting.",
    description: "This project explores the aesthetic of a cyberpunk dystopia. Created using Blender and rendered with Cycles, it features procedural textures, volumetric fog, and high-poly assets. The goal was to capture the mood of a rainy, neon-lit night.",
    thumbnail: "https://picsum.photos/seed/cyberpunk/800/600",
    images: [
      "https://picsum.photos/seed/cyberpunk1/800/600",
      "https://picsum.photos/seed/cyberpunk2/800/600",
      "https://picsum.photos/seed/cyberpunk3/800/600"
    ],
    tags: ["Blender", "3D", "Cyberpunk", "Environment"],
    date: "2024-01-15",

  },
  {
    id: "mech-warrior",
    title: "Mech Warrior Model",
    category: "3D",
    role: "Modeler",
    summary: "High-fidelity hard surface modeling of a combat mech.",
    description: "A detailed hard-surface modeling project focusing on mechanical joints and realistic wear and tear. Texturing was done in Substance Painter.",
    thumbnail: "https://picsum.photos/seed/mech/800/600",
    images: [
      "https://picsum.photos/seed/mech1/800/600",
      "https://picsum.photos/seed/mech2/800/600"
    ],
    tags: ["Maya", "Substance Painter", "Hard Surface"],
    date: "2023-11-20"
  },

  // Brand Identity (Multiple photo placement)
  {
    id: "green-d-branding",
    title: "Green D Identity",
    category: "Brand Identity",
    role: "Lead Designer",
    summary: "Complete visual identity for a sustainable tech startup.",
    description: "Green D needed a brand that communicated sustainability, technology, and trust. The color palette revolves around deep greens and clean whites, with a logo that combines a leaf motif with digital circuitry.",
    thumbnail: "/images/Projects Images/Green-D-Branding.png",
    images: [
      "/images/Projects Images/img (1).png",
      "/images/Projects Images/img (2).png",
      "/images/Projects Images/img (3).png",
      "/images/Projects Images/img (4).png",
      "/images/Projects Images/img.png"
    ],
    tags: ["Branding", "Logo Design", "Identity"],
    date: "2024-02-01",
    featured: true
  },

  // Web & Automation (Project description area)
  {
    id: "mct-labs-web",
    title: "MCT Labs Platform",
    category: "Web & Automation",
    role: "Full Stack Developer",
    summary: "AI-powered creative suite for university students.",
    description: "MCT Labs is a comprehensive platform integrating various AI tools. It features a custom-built chat interface, image generation capabilities using Stable Diffusion, and a code editor. The backend is built with Node.js and Python, ensuring scalable performance.",
    thumbnail: "/images/Projects Images/mctlabs.png",
    demoUrl: "https://mctlabs.vercel.app/",

    tags: ["React", "Node.js", "AI", "ML", "Web Development"],
    date: "2023-12-10",
    featured: true
  },
  {
    id: "portfolio-ai-web",
    title: "AI Portfolio",
    category: "Web & Automation",
    role: "Developer",
    summary: "Personal portfolio with an integrated AI assistant.",
    description: "This website itself is a project! It uses React for the frontend and integrates with an LLM to provide a conversational interface for visitors to learn more about my work.",
    thumbnail: "https://picsum.photos/seed/portfolio/800/600",
    repoUrl: "https://github.com/example/portfolio",
    tags: ["React", "Tailwind", "OpenAI API"],
    date: "2024-03-01"
  },

  // Web & Automation
  {
    id: "social-bot",
    title: "Instagram Growth Bot",
    category: "Web & Automation",
    role: "Developer",
    summary: "Python script for automating engagement and analytics.",
    description: "A Python-based automation tool that handles scheduled posting, engagement tracking, and hashtag analysis to grow social media presence organically.",
    thumbnail: "https://picsum.photos/seed/bot/800/600",
    repoUrl: "https://github.com/example/instabot",
    tags: ["Python", "Selenium", "Automation"],
    date: "2023-08-15"
  },

  // Video Editing (YouTube embed)
  {
    id: "The-Fading-Heartbeat",
    title: "The Fading Heartbeat ",
    category: "Video Editing",
    role: "Director & Editor",
    summary: "A Documentary of Tater Saree, Discovering the rich heritage and harsh economic reality behind the world-famous Tangail Saree.",
    description: "<p style='text-align: justify;'>This documentary provides a deep look into the complete lifecycle of a saree, from the dyeing and spinning of thread to the final meticulous fold. Beyond the aesthetics, the film identifies the critical problems threatening this ancient craft, including the Mahajan system where middlemen control profits, and the significant decline in active looms due to lack of sales. \n \n The rhythmic <b>Khut-Khut</b> sound of the looms has long been the heartbeat of this region, but that heartbeat is slowing down. This video serves as both a record of a disappearing tradition and a call to recognize the labor, sweat, and identity woven into every thread. </p>",
    thumbnail: "/images/Projects Images/tat.png",
    videoUrl: "https://youtu.be/S2vfwbJhwW4", // Example embed
    tags: ["Filmmaking", "Editing", "DaVinci Resolve"],
    date: "2022-11-10",
    featured: true
  }
];
