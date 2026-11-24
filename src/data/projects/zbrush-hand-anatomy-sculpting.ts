import type { Project } from '../projects.ts';

const project: Project = {
  id: "zbrush-hand-anatomy-sculpting",
  title: "Realistic Hand Anatomy & Gesture Sculpting in ZBrush",
  shortTitle: "Hand Anatomy Sculpt",
  category: "3D",
  featured: false,
  role: "Solo Digital Sculptor",
  summary: "Class assignment in Pixologic ZBrush mastering organic human hand anatomy, skeletal landmarks, tendon tension, and surface wrinkles using DynaMesh and ZRemesher workflows.",
  description: "<p style='text-align: justify;'>The human hand is universally acknowledged as one of the most demanding anatomical structures to capture accurately in digital sculpture. Created as an intensive coursework assignment in Pixologic ZBrush, this project focused on developing realistic proportions, bone landmarks, tendon dynamics, and organic skin fold wrinkles from a raw digital clay base.</p>\
<p style='text-align: justify; margin-top: 30px;'><b>Anatomical Landmarks & Skeletal Foundations:</b> The sculpt establishes core anatomical milestones: the distal, middle, and proximal phalanges, metacarpal heads forming the knuckles, and the underlying carpal bridge. Careful attention was paid to the tension of the extensor tendons running along the dorsal surface, producing natural variations in skin stretching and compression when the fingers are posed in dynamic rest.</p>\
<p style='text-align: justify; margin-top: 30px;'><b>DynaMesh to ZRemesher Pipeline:</b> The primary anatomical volume was established using DynaMesh to allow unrestricted form manipulation and finger blocking without polygon pinching. Once proportions and muscle mass were locked, automatic retopology via ZRemesher generated an optimized quad flow following the natural contours of the fingers and palm. Multi-resolution subdivision levels then enabled ultra-fine secondary detailing including fingernail beds, palmar crease lines, and micro-surface dermal folds.</p>",
  thumbnail: "/images/projects/Zbrush Hand Sculpting (1).png",
  thumbnails: [
    "/images/projects/Zbrush Hand Sculpting (1).png",
    "/images/projects/Zbrush Hand Sculpting (2).png",
    "/images/projects/Zbrush Hand Sculpting (3).png",
    "/images/projects/Zbrush Hand Sculpting (4).png"
  ],
  images: [
    "/images/projects/Zbrush Hand Sculpting (1).png",
    "/images/projects/Zbrush Hand Sculpting (2).png",
    "/images/projects/Zbrush Hand Sculpting (3).png",
    "/images/projects/Zbrush Hand Sculpting (4).png"
  ],
  tags: [
    "ZBrush",
    "Digital Sculpting",
    "Human Anatomy",
    "DynaMesh",
    "ZRemesher",
    "Organic Modeling",
    "Hand Study"
  ],
  date: "2024-03-20",
  seo: {
    keywords: [
      "Md Rakibujjaman Adib",
      "ZBrush Hand Anatomy Sculpting",
      "human hand digital sculpt ZBrush",
      "DynaMesh ZRemesher workflow",
      "anatomy study 3D character",
      "hand gesture organic modeling"
    ],
    meta: [
      { name: "author", content: "Md Rakibujjaman Adib" },
      {
        name: "title",
        content: "Realistic Hand Anatomy & Gesture Sculpting in ZBrush | Md Rakibujjaman Adib"
      },
      {
        name: "description",
        content: "Explore Md Rakibujjaman Adib's human hand anatomy sculpt in Pixologic ZBrush, featuring DynaMesh blocking, ZRemesher topology, and skin fold detailing."
      },
      {
        property: "og:image",
        content: "/images/projects/Zbrush Hand Sculpting (1).png"
      }
    ]
  }
};

export default project;
