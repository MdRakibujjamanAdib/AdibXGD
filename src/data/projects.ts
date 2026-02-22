
export interface Project {
  id: string;
  title: string;
  category: '3D' | 'Branding & Identity' | 'Web & AI' | 'Automation' | 'Academic' | 'Film & Video' | 'Game Dev' | 'Android Apps';
  role?: string;
  summary: string;
  description: string;
  thumbnail: string;
  images?: string[]; // For 3D, Branding, etc.
  videoUrl?: string; // For Game Dev, Film & Video (YouTube embed)
  demoUrl?: string;
  repoUrl?: string;
  tags: string[];
  date: string;
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
    date: "2024-01-15"
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

  // Branding & Identity (Multiple photo placement)
  {
    id: "green-d-branding",
    title: "Green D Identity",
    category: "Branding & Identity",
    role: "Lead Designer",
    summary: "Complete visual identity for a sustainable tech startup.",
    description: "Green D needed a brand that communicated sustainability, technology, and trust. The color palette revolves around deep greens and clean whites, with a logo that combines a leaf motif with digital circuitry.",
    thumbnail: "https://picsum.photos/seed/greendbrand/800/600",
    images: [
      "https://picsum.photos/seed/greendbrand1/800/600",
      "https://picsum.photos/seed/greendbrand2/800/600",
      "https://picsum.photos/seed/greendbrand3/800/600"
    ],
    tags: ["Branding", "Logo Design", "Identity"],
    date: "2024-02-01"
  },

  // Web & AI (Project description area)
  {
    id: "mct-labs-web",
    title: "MCT Labs Platform",
    category: "Web & AI",
    role: "Full Stack Developer",
    summary: "AI-powered creative suite for university students.",
    description: "MCT Labs is a comprehensive platform integrating various AI tools. It features a custom-built chat interface, image generation capabilities using Stable Diffusion, and a code editor. The backend is built with Node.js and Python, ensuring scalable performance.",
    thumbnail: "https://picsum.photos/seed/mctlabs/800/600",
    demoUrl: "https://mctlabs.example.com",
    repoUrl: "https://github.com/example/mctlabs",
    tags: ["React", "Node.js", "AI", "Stable Diffusion"],
    date: "2023-12-10"
  },
  {
    id: "portfolio-ai-web",
    title: "AI Portfolio",
    category: "Web & AI",
    role: "Developer",
    summary: "Personal portfolio with an integrated AI assistant.",
    description: "This website itself is a project! It uses React for the frontend and integrates with an LLM to provide a conversational interface for visitors to learn more about my work.",
    thumbnail: "https://picsum.photos/seed/portfolio/800/600",
    repoUrl: "https://github.com/example/portfolio",
    tags: ["React", "Tailwind", "OpenAI API"],
    date: "2024-03-01"
  },

  // Automation
  {
    id: "social-bot",
    title: "Instagram Growth Bot",
    category: "Automation",
    role: "Developer",
    summary: "Python script for automating engagement and analytics.",
    description: "A Python-based automation tool that handles scheduled posting, engagement tracking, and hashtag analysis to grow social media presence organically.",
    thumbnail: "https://picsum.photos/seed/bot/800/600",
    repoUrl: "https://github.com/example/instabot",
    tags: ["Python", "Selenium", "Automation"],
    date: "2023-08-15"
  },

  // Academic
  {
    id: "network-report",
    title: "Enterprise Network Design",
    category: "Academic",
    role: "Student",
    summary: "Comprehensive network infrastructure plan for a mid-sized company.",
    description: "This academic project involved designing a secure and scalable network topology using Cisco Packet Tracer. It includes VLAN configuration, OSPF routing, and firewall rules.",
    thumbnail: "https://picsum.photos/seed/network/800/600",
    tags: ["Networking", "Cisco", "Academic"],
    date: "2023-05-20"
  },

  // Film & Video (YouTube embed)
  {
    id: "short-film-echo",
    title: "Echoes of Tomorrow",
    category: "Film & Video",
    role: "Director & Editor",
    summary: "A sci-fi short film about memory and technology.",
    description: "Written, directed, and edited by me. This short film explores the concept of digital immortality. Shot on Blackmagic Pocket Cinema Camera and graded in DaVinci Resolve.",
    thumbnail: "https://picsum.photos/seed/film/800/600",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Example embed
    tags: ["Filmmaking", "Editing", "DaVinci Resolve"],
    date: "2022-11-10"
  },

  // Game Dev (YouTube embed)
  {
    id: "space-shooter",
    title: "Nebula Raider",
    category: "Game Dev",
    role: "Game Developer",
    summary: "Fast-paced arcade space shooter built in Unity.",
    description: "A classic arcade-style shooter with modern graphics. Features include procedural level generation, boss battles, and a weapon upgrade system. Coded in C# using the Unity Engine.",
    thumbnail: "https://picsum.photos/seed/game/800/600",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Example embed
    demoUrl: "https://itch.io/example/nebula",
    tags: ["Unity", "C#", "Game Design"],
    date: "2023-09-05"
  },

  // Android Apps
  {
    id: "task-manager-app",
    title: "FocusFlow",
    category: "Android Apps",
    role: "Mobile Developer",
    summary: "Productivity app for managing tasks and Pomodoro timers.",
    description: "FocusFlow is a native Android application built with Kotlin. It helps users stay productive by combining a task list with a customizable Pomodoro timer. Features local database storage using Room.",
    thumbnail: "https://picsum.photos/seed/app/800/600",
    repoUrl: "https://github.com/example/focusflow",
    tags: ["Android", "Kotlin", "Mobile"],
    date: "2023-07-20"
  }
];
