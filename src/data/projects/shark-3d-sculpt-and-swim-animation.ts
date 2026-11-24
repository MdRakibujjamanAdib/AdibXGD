import type { Project } from '../projects.ts';

const project: Project = {
  id: "shark-3d-sculpt-and-swim-animation",
  title: "Great White Shark – Full Pipeline Sculpt, Rigging & Swim Cycle",
  shortTitle: "Shark 3D Animation",
  category: "3D",
  featured: false,
  role: "3D Generalist, Sculptor & Animator",
  summary: "Comprehensive end-to-end 3D creature pipeline creating an ocean predator from scratch: high-poly organic sculpting and texturing in ZBrush, skeletal bone rigging and swim cycle animation in Maya, and cinematic rendering with Chaos V-Ray.",
  description: "<p style='text-align: justify;'><b>Great White Shark 3D Production</b> was developed as a comprehensive creature creation capstone assignment covering the complete end-to-end entertainment pipeline. The objective was to design, sculpt, rig, animate, and render an oceanic predator from scratch, combining high-resolution organic sculpting in Pixologic ZBrush with advanced skeletal rigging and keyframe swim cycle animation in Autodesk Maya and Chaos V-Ray.</p>\
\
<h3 style='font-size: 1.25rem; font-weight: 700; margin-top: 36px; color: var(--vb-text);'>01. High-Poly Digital Sculpting & Anatomical LookDev in ZBrush</h3>\
<p style='text-align: justify; margin-top: 12px;'>The creature's predatory hydrodynamic volume was sculpted in ZBrush from primitive DynaMesh geometry. Special care was given to anatomical markers: the conical snout, gill slit cascades, triangular dorsal fin profile, and sandpaper-like dermal denticle surface roughness.</p>\
<img src='/images/projects/zbrush-shark-creature-sculpt-base.webp' alt='High-poly organic digital clay sculpt of great white shark in Pixologic ZBrush' style='width:100%; border-radius:12px; margin:20px 0 32px 0;' />\
\
<h3 style='font-size: 1.25rem; font-weight: 700; margin-top: 36px; color: var(--vb-text);'>02. Maya Skeletal Rigging, Spline IK & Caustic Ocean Rendering</h3>\
<p style='text-align: justify; margin-top: 12px;'>After retopologizing for artifact-free skin deformation, an articulated bone spine was constructed in Autodesk Maya featuring spline IK handles. A cyclic keyframe swim cycle simulates realistic lateral wave propagation down to the heterocercal tail fin. Staged in an underwater studio with animated light caustics and rendered in Chaos V-Ray.</p>\
<img src='/images/projects/shark-3d-sculpt-animation-thumbnail.webp' alt='Final Chaos V-Ray render of rigged and animated 3D shark swimming in deep ocean caustics' style='width:100%; border-radius:12px; margin:20px 0 32px 0;' />",
  thumbnail: "/images/projects/shark-3d-sculpt-animation-thumbnail.webp",
  thumbnails: [
    "/images/projects/shark-3d-sculpt-animation-thumbnail.webp",
    "/images/projects/zbrush-shark-creature-sculpt-base.webp"
  ],
  images: [
    "/images/projects/shark-3d-sculpt-animation-thumbnail.webp",
    "/images/projects/zbrush-shark-creature-sculpt-base.webp"
  ],
  videoUrl: "/images/projects/shark-3d-sculpt-swimming-cycle-animation.mp4",
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
        content: "/images/projects/shark-3d-sculpt-animation-thumbnail.webp"
      }
    ]
  }
};

export default project;
