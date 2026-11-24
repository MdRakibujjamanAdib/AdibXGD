import type { Project } from '../projects.ts';

const project: Project = {
  id: "vray-shoe-commercial-animation",
  title: "Commercial Footwear 3D Visualization & V-Ray Animation",
  shortTitle: "V-Ray Shoe Animation",
  category: "3D",
  featured: false,
  cardRatio: "square",
  role: "3D Product Modeler, Lighting & Rendering Artist",
  summary: "Debut academic milestone in commercial 3D footwear product visualization, modeling, and studio turntable lighting authored in 3ds Max and rendered with Chaos V-Ray.",
  description: "<p style='text-align: justify;'>Marking my debut academic milestone in commercial 3D footwear product visualization, modeling, and lighting, this project presents athletic footwear engineered to high-budget advertising benchmarks. The goal was to master multi-material assembly, micro-surface normal texturing, and three-point cinematic studio lighting in Autodesk 3ds Max and Chaos V-Ray.</p>\
\
<h3 style='font-size: 1.25rem; font-weight: 700; margin-top: 36px; color: var(--vb-text);'>01. Industrial Multi-Material Assembly & Dynamic Floating Staging</h3>\
<p style='text-align: justify; margin-top: 12px;'>The sneaker assembly was built from functional real-world footwear patterns: a sculpted EVA foam midsole with shock-absorption pods, textured tread outsoles, breathable mesh fabric along the toe vamp, synthetic leather overlays, and laced eyelet stays with realistic tension physics.</p>\
<img src='/images/projects/vray-shoe-commercial-animation-thumbnail.webp' alt='Commercial 3D athletic sneaker floating in dark studio space with sharp rim lighting' style='width:100%; border-radius:12px; margin:20px 0 32px 0;' />\
\
<h3 style='font-size: 1.25rem; font-weight: 700; margin-top: 36px; color: var(--vb-text);'>02. V-Ray Studio Lighting Rig & 360° Turntable Animation</h3>\
<p style='text-align: justify; margin-top: 12px;'>The lighting setup utilizes a balanced high-key keylight, soft ambient fill bounce, and a razor-sharp rim/kicker light to accentuate the shoe's sleek silhouette against the dark cyclorama backdrop. The full turntable animation captures continuous specular glints as the footwear rotates in 3D space.</p>\
<img src='/images/projects/vray-shoe-commercial-turntable-preview.webp' alt='Turntable pedestal view of 3D shoe render demonstrating specular highlights and material falloff' style='width:100%; border-radius:12px; margin:20px 0 32px 0;' />",
  thumbnail: "/images/projects/vray-shoe-commercial-animation-thumbnail.webp",
  thumbnails: [
    "/images/projects/vray-shoe-commercial-animation-thumbnail.webp",
    "/images/projects/vray-shoe-commercial-turntable-preview.webp"
  ],
  images: [
    "/images/projects/vray-shoe-commercial-animation-thumbnail.webp",
    "/images/projects/vray-shoe-commercial-turntable-preview.webp"
  ],
  videoUrl: "/images/projects/vray-shoe-commercial-product-animation.mp4",
  tags: [
    "3ds Max",
    "Chaos V-Ray",
    "Product Visualization",
    "Commercial Animation",
    "Studio Lighting",
    "Footwear Design",
    "Turntable"
  ],
  date: "2024-02-14",
  seo: {
    keywords: [
      "Md Rakibujjaman Adib",
      "V-Ray Shoe Commercial Animation",
      "3D footwear product visualization",
      "3ds Max sneaker modeling",
      "Chaos V-Ray studio lighting",
      "commercial 3D turntable animation"
    ],
    meta: [
      { name: "author", content: "Md Rakibujjaman Adib" },
      {
        name: "title",
        content: "Commercial Footwear 3D Visualization & V-Ray Animation | Md Rakibujjaman Adib"
      },
      {
        name: "description",
        content: "Debut commercial 3D footwear product visualization and turntable animation in 3ds Max and Chaos V-Ray by Md Rakibujjaman Adib."
      },
      {
        property: "og:image",
        content: "/images/projects/vray-shoe-commercial-turntable-preview.webp"
      }
    ]
  }
};

export default project;
