import type { Project } from '../projects.ts';

const project: Project = {
  id: "shark-3d-sculpt-and-swim-animation",
  title: "Great White Shark – Full Pipeline Sculpt, Rigging & Swim Cycle",
  shortTitle: "Shark 3D Animation",
  category: "3D",
  featured: false,
  role: "3D Generalist, Sculptor & Animator",
  summary: "Comprehensive end-to-end 3D creature pipeline creating an ocean predator from scratch: high-poly organic sculpting and texturing in ZBrush, skeletal bone rigging and swim cycle animation in Maya, and cinematic rendering with Chaos V-Ray.",
  description: "<p style='text-align: justify;'>Developed as an ambitious capstone assignment in digital asset production, this project tackled the full character and creature creation pipeline from zero to final animated render. The goal was to build a physiologically accurate shark from scratch, navigating through concept modeling, high-poly sculpting, retopology, texturing, custom skeletal rigging, and fluid underwater locomotion.</p>\
<p style='text-align: justify; margin-top: 30px;'><b>Sculpting & Texturing in ZBrush:</b> The shark's predatory silhouette—hydrodynamic torpedo body, dorsal and pectoral fin profiles, and iconic jaw structure—was sculpted in Pixologic ZBrush. Multi-layer alphas and polypainting established the countershaded pelagic coloration (dark slate dorsal blending into pristine counter-illuminated white ventral) and sandpaper-like dermal denticle skin micro-relief.</p>\
<p style='text-align: justify; margin-top: 30px;'><b>Skeletal Rigging & Swim Cycle in Maya & V-Ray:</b> Once retopologized for clean deformation, a custom spline IK and hierarchical bone spine rig was authored in Autodesk Maya. The rig enabled natural lateral undulation characteristic of carcharhinid swimming dynamics, propagating momentum from the pectoral girdle down to the heterocercal caudal fin. The scene was staged with caustic underwater lighting and rendered using Chaos V-Ray to produce an authentic oceanic swim sequence.</p>",
  thumbnail: "/images/projects/Shark Thumbnail.png",
  thumbnails: [
    "/images/projects/Shark Thumbnail.png",
    "/images/projects/Zbrush Sculption a Shark.png"
  ],
  images: [
    "/images/projects/Shark Thumbnail.png",
    "/images/projects/Zbrush Sculption a Shark.png"
  ],
  videoUrl: "/images/projects/Shark Animation.mp4",
  tags: [
    "Autodesk Maya",
    "ZBrush",
    "V-Ray",
    "Rigging",
    "Creature Animation",
    "Swim Cycle",
    "Digital Sculpting"
  ],
  date: "2024-05-18",
  seo: {
    keywords: [
      "Md Rakibujjaman Adib",
      "Shark 3D Sculpt Maya V-Ray",
      "ZBrush shark creature modeling",
      "Maya shark rigging swim cycle",
      "underwater 3D creature animation",
      "end to end 3D production pipeline"
    ],
    meta: [
      { name: "author", content: "Md Rakibujjaman Adib" },
      {
        name: "title",
        content: "Shark 3D Sculpt, Rigging & Swim Cycle | Maya & V-Ray by Md Rakibujjaman Adib"
      },
      {
        name: "description",
        content: "Complete 3D creature pipeline: shark sculpted in ZBrush, rigged and animated in Autodesk Maya with a realistic swim cycle, and rendered in Chaos V-Ray by Md Rakibujjaman Adib."
      },
      {
        property: "og:image",
        content: "/images/projects/Shark Thumbnail.png"
      }
    ]
  }
};

export default project;
