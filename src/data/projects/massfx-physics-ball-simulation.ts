import type { Project } from '../projects.ts';

const project: Project = {
  id: "massfx-physics-ball-simulation",
  title: "MassFX Rigid-Body Dynamics & Natural Flow Simulation",
  shortTitle: "MassFX Physics Simulation",
  category: "Animation & Motion",
  featured: false,
  role: "3D Technical Artist & Simulation Specialist",
  summary: "Computational physics simulation in Autodesk 3ds Max using the MassFX dynamic physics engine to model realistic gravitational velocity, momentum, restitution, and rolling friction of a ball traversing wooden terrain.",
  description: "<p style='text-align: justify;'>Bridging procedural mathematics and visual arts, this project explored real-time computational dynamics in Autodesk 3ds Max utilizing the integrated MassFX physics engine. The core objective was simulating the natural, unscripted trajectory of a rigid sphere traversing an intricate multi-tiered wooden run with exact physical laws.</p>\
<p style='text-align: justify; margin-top: 30px;'><b>Rigid-Body Setup & Collision Mesh Calibration:</b> The scene was architected using distinct rigid-body property assignments: the polished wooden tracks, inclined ramps, and bumper barriers were configured as Static Rigid Bodies with precise convex/concave mesh collision boundaries, while the rolling ball operated as a Dynamic Rigid Body with accurate mass density and rotational inertia.</p>\
<p style='text-align: justify; margin-top: 30px;'><b>Friction, Restitution & Kinetic Dissipation:</b> Simulation parameters were fine-tuned through iterative test bakes—adjusting static and dynamic friction coefficients alongside restitution (bounciness) to capture the authentic dampening of kinetic energy as the ball collides with wood grains. Once the organic path was finalized, the simulation was baked into standard transform animation curves for reproducible camera rendering.</p>",
  thumbnail: "/images/projects/Physics Based Animation Thumbnail.png",
  thumbnails: [
    "/images/projects/Physics Based Animation Thumbnail.png"
  ],
  images: [
    "/images/projects/Physics Based Animation Thumbnail.png"
  ],
  videoUrl: "/images/projects/Physics Based Animation 1.mp4",
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
        content: "/images/projects/Physics Based Animation Thumbnail.png"
      }
    ]
  }
};

export default project;
