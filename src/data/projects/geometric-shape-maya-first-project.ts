import type { Project } from '../projects.ts';

const project: Project = {
    id: "geometric-shape-maya-first-project",
    title: "Geometric Shape Study – First 3D Project in Autodesk Maya",
    shortTitle: "Maya Geometric Study",
    category: "3D",
    featured: false,
    cardRatio: "square",
    role: "3D Modeler & LookDev",
    summary: "Adib's very first 3D project in Autodesk Maya, exploring primitive modeling, clean beveling, glossy pastel materials, and multi-light studio composition.",
    description: "<p style='text-align: justify;'><b>Geometric Shape Study</b> holds special foundational significance as my very first foray into 3D computer graphics and digital modeling, constructed in Autodesk Maya. It was designed as an aesthetic exploration of abstract geometry, form balance, and material color theory.</p>\
\
<h3 style='font-size: 1.25rem; font-weight: 700; margin-top: 36px; color: var(--vb-text);'>01. Master Composition & Form Balancing</h3>\
<p style='text-align: justify; margin-top: 12px;'>The composition brings contrasting geometric primitives together: fluted neoclassical columns, smooth torus rings with embossed keyways, reflective chrome spheres, and intersecting vertical planes. Every hard edge was beveled to capture clean specular light roll-offs without polygon faceting.</p>\
<img src='/images/projects/geometric-shapes-first-3d-maya-project-01.webp' alt='Master composition of abstract geometric shapes, fluted pillars, and emerald torus in Autodesk Maya' style='width:100%; border-radius:12px; margin:20px 0 32px 0;' />\
\
<h3 style='font-size: 1.25rem; font-weight: 700; margin-top: 36px; color: var(--vb-text);'>02. Studio LookDev, PBR Sheen & Color Harmony</h3>\
<p style='text-align: justify; margin-top: 12px;'>The palette harmonizes soft blush pinks, warm cream tones, and deep terracotta with a central emerald green torus and a high-specular chrome disc. A multi-point studio lighting setup casts crisp directional drop shadows contrasted by soft ambient fill, celebrating clean topology and surface glossiness.</p>\
<img src='/images/projects/geometric-shapes-first-3d-maya-project-02.webp' alt='Close-up perspective highlighting fluted pillar edge beveling and chrome sphere reflection in Maya' style='width:100%; border-radius:12px; margin:20px 0 32px 0;' />",
    thumbnail: "/images/projects/geometric-shapes-first-3d-maya-project-01.webp",
    images: [
        "/images/projects/geometric-shapes-first-3d-maya-project-01.webp",
        "/images/projects/geometric-shapes-first-3d-maya-project-02.webp"
    ],
    tags: [
        "Autodesk Maya",
        "3D Modeling",
        "Abstract Art",
        "Studio Lighting",
        "LookDev",
        "Color Theory"
    ],
    date: "2024-01-15",
    seo: {
        keywords: [
            "Md Rakibujjaman Adib",
            "Geometric Shape Study Autodesk Maya",
            "first 3D project Maya",
            "3D abstract geometric art",
            "Maya studio lighting and materials",
            "pastel 3D lookdev"
        ],
        meta: [
            { name: "author", content: "Md Rakibujjaman Adib" },
            {
                name: "title",
                content: "Geometric Shape Study – First 3D Project in Autodesk Maya | Md Rakibujjaman Adib"
            },
            {
                name: "description",
                content: "Adib's very first 3D project in Autodesk Maya, exploring primitive modeling, clean beveling, glossy pastel materials, and multi-light studio composition."
            }
        ]
    }
};

export default project;
