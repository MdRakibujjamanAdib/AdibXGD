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
    description: "<p style='text-align: justify;'>This project holds special significance as my very first foray into 3D computer graphics and digital modeling, built in Autodesk Maya. It was designed as an aesthetic exploration of abstract geometry, form relationships, and material color theory.</p>\
<p style='text-align: justify; margin-top: 30px;'><b>Primitive Manipulation & Clean Beveling:</b> The composition balances contrasting primitives—fluted cylindrical columns, smooth torus rings with embossed keyways, spherical accents, and intersecting planar sheets. Every edge was beveled to capture clean specular light roll-offs without pinching.</p>\
<p style='text-align: justify; margin-top: 30px;'><b>Studio LookDev & Color Harmony:</b> The palette blends soft blush pinks, warm cream tones, and deep terracotta with an emerald green hero torus and a mirror-finish chrome disc. A multi-point studio lighting rig casts crisp directional shadows and soft ambient fill, highlighting surface glossiness and material contrast.</p>",
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
