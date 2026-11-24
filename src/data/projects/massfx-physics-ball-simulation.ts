import type { Project } from '../projects.ts';

const project: Project = {
  id: "massfx-physics-ball-simulation",
  title: "MassFX Rigid-Body Dynamics & Natural Flow Simulation",
  shortTitle: "MassFX Physics",
  category: "Animation & Motion",
  featured: false,
  role: "3D Technical Artist & Simulation Specialist",
  summary: "Computational physics simulation in Autodesk 3ds Max using the MassFX dynamic physics engine to model realistic gravitational velocity, momentum, restitution, and rolling friction of a ball traversing wooden terrain.",
  description: "<p style='text-align: justify;'>Bridging procedural mathematics and visual arts, this project explored real-time computational dynamics in Autodesk 3ds Max utilizing the integrated MassFX physics engine. The core objective was simulating the natural, unscripted trajectory of a rigid sphere traversing an intricate multi-tiered wooden run governed by physical laws of gravity, momentum, and friction.</p>\
\
<h3 style='font-size: 1.25rem; font-weight: 700; margin-top: 36px; color: var(--vb-text);'>01. Rigid-Body Setup & Collision Mesh Calibration</h3>\
<p style='text-align: justify; margin-top: 12px;'>The scene was architected using distinct rigid-body property assignments: polished wooden tracks, inclined chutes, and redirector pins were designated as Static Rigid Bodies with custom convex hull collision boundaries, while the rolling sphere operated as a Dynamic Rigid Body with calibrated mass density and rotational inertia.</p>\
<img src='/images/projects/massfx-physics-ball-simulation-thumbnail.webp' alt='3ds Max MassFX physics simulation showing rigid body ball rolling across wooden chutes' style='width:100%; border-radius:12px; margin:20px 0 32px 0;' />\
\
<h3 style='font-size: 1.25rem; font-weight: 700; margin-top: 36px; color: var(--vb-text);'>02. Friction, Restitution & Kinetic Dissipation</h3>\
<p style='text-align: justify; margin-top: 12px;'>Simulation parameters were calibrated through iterative collision bakes—adjusting static and kinetic friction coefficients alongside restitution (elastic bounce) to capture authentic dampening as the ball contacts polished hardwood grains before dropping into the exit receptacle.</p>",
  thumbnail: "/images/projects/massfx-physics-ball-simulation-thumbnail.webp",
  thumbnails: [
    "/images/projects/massfx-physics-ball-simulation-thumbnail.webp"
  ],
  images: [
    "/images/projects/massfx-physics-ball-simulation-thumbnail.webp"
  ],
  videoUrl: "/images/projects/massfx-physics-rigid-body-ball-simulation.mp4",
  tags: [
    "3ds Max",
    "MassFX",
    "Physics Simulation",
    "Rigid Body Dynamics",
    "Collision Geometry",
    "Kinetic Energy",
    "3D Simulation"
  ],
  date: "2024-01-15",
  seo: {
    keywords: [
      "Md Rakibujjaman Adib",
      "MassFX Rigid Body Simulation 3ds Max",
      "3ds Max physics simulation ball wooden surface",
      "MassFX dynamic simulation tutorial",
      "collision geometry restitution friction",
      "computational 3D dynamics"
    ],
    meta: [
      { name: "author", content: "Md Rakibujjaman Adib" },
      {
        name: "title",
        content: "MassFX Rigid-Body Physics Simulation | 3ds Max by Md Rakibujjaman Adib"
      },
      {
        name: "description",
        content: "Realistic rigid-body dynamic simulation authored in Autodesk 3ds Max with MassFX by Md Rakibujjaman Adib, modeling gravitational roll, collision restitution, and friction."
      },
      {
        property: "og:image",
        content: "/images/projects/massfx-physics-ball-simulation-thumbnail.webp"
      }
    ]
  }
};

export default project;
