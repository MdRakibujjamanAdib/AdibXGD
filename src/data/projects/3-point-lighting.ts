import { Project } from '../projects';

const project: Project = {
    id: "3-Point-Lighting",
    title: "3-Point Lighting Study",
    category: "3D",
    role: "3D Artist",
    summary: "Cinematic 3D watch render demonstrating a structured 3-point lighting setup for balanced shadows and professional product presentation.",
    description: "<p style='text-align: justify;'>This study applies the classic 3-point lighting technique to a detailed 3D watch model using Autodesk Maya and Chaos V-Ray.</p>\
<p style='text-align: justify; margin-top: 30px;'><b>Key Light:</b> The primary illumination source defining the watch’s overall form and generating structured shadows.</p>\
<img src='/images/projects/key-light-render.png' alt='Key light only render of 3D watch model in V-Ray' style='width:100%; margin:20px 0 30px 0;' />\
<p style='text-align: justify; margin-top: 30px;'><b>Fill Light:</b> A softer secondary light reducing harsh contrast while preserving surface detail.</p>\
<img src='/images/projects/fill-light-render.png' alt='Fill light render softening shadows on 3D watch model' style='width:100%; margin:20px 0 30px 0;' />\
<p style='text-align: justify; margin-top: 30px;'><b>Back (Rim) Light:</b> Positioned behind the subject to create subtle edge separation and enhance depth.</p>\
<img src='/images/projects/back-light-render.png' alt='Back rim light render creating edge separation on 3D watch' style='width:100%; margin:20px 0 30px 0;' />\
<p style='text-align: justify; margin-top: 20px;'>The final combined setup achieves controlled shadow gradients and a cinematic product presentation suitable for professional visualization.</p>",
    thumbnail: "/images/projects/full-render.png",
    images: [
        "/images/projects/key-light-render.png",
        "/images/projects/fill-light-render.png",
        "/images/projects/back-light-render.png"
    ],
    tags: [
        "3D Lighting",
        "Product Visualization",
        "V-Ray",
        "Autodesk Maya",
        "Cinematic Rendering"
    ],
    date: "2025-10-06",
    seo: {
        keywords: [
            "Md Rakibujjaman Adib",
            "3 point lighting 3D",
            "V-Ray lighting setup",
            "3D watch render",
            "product visualization lighting",
            "cinematic 3D lighting",
            "Maya V-Ray render",
            "professional 3D product render"
        ],
        meta: [
            { name: "author", content: "Md Rakibujjaman Adib" },
            {
                name: "title",
                content: "3-Point Lighting 3D Watch Render | Md Rakibujjaman Adib"
            },
            {
                name: "description",
                content:
                    "Professional 3-point lighting study in Autodesk Maya using V-Ray, showcasing cinematic depth and balanced product visualization."
            },
            {
                name: "keywords",
                content:
                    "Md Rakibujjaman Adib, 3 point lighting 3D, V-Ray lighting setup, 3D watch render, cinematic product lighting, Maya lighting study"
            },
            {
                property: "article:published_time",
                content: "2025-10-06T00:00:00Z"
            },
            {
                property: "og:title",
                content: "3-Point Lighting 3D Watch Render | Md Rakibujjaman Adib"
            },
            {
                property: "og:description",
                content:
                    "Structured 3-point lighting setup in V-Ray demonstrating cinematic depth and professional product rendering."
            },
            {
                property: "og:type",
                content: "website"
            }
        ]
    }
};

export default project;