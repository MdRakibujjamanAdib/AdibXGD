import { Project } from '../projects';

const project: Project = {
    id: "Vray-Lighting-Study",
    title: "V-Ray Lighting Study",
    category: "3D",
    role: "Lighting & Rendering Artist",
    summary: "A practical V-Ray lighting study exploring Sun, Rect, Mesh, and IES lights to simulate realistic daylight and artificial illumination in production-style scenes.",
    description: "<p style='text-align: justify;'>This project explores different V-Ray light types in Autodesk Maya, focusing on how each contributes to realistic daylight and artificial illumination. Using controlled scenes, I tested V-Ray Sun, Rect, Mesh, and IES lights to understand their behavior, strengths, and ideal use cases for production-ready renders.</p>\
<p style='text-align: justify; margin-top: 30px;'><b>V-Ray Sun:</b> Configured as the primary daylight source to simulate real-world sun behavior. By adjusting sun angle, intensity, and sky parameters, the setup produced natural shadow direction, believable color temperature, and outdoor lighting suitable for exterior and environment-focused shots.</p>\
<img src='/images/projects/vray-sun-light.png' alt='V-Ray Sun and Sky lighting setup used for realistic exterior illumination' style='width:100%; margin:20px 0 30px 0;' />\
<p style='text-align: justify; margin-top: 30px;'><b>Rect Light:</b> Used as a controllable area light for studio-style scenarios. Its shape, size, and directionality were tuned to create soft, clean illumination, making it ideal for product-style renders, interior accents, and controlled highlight shaping.</p>\
<img src='/images/projects/vray-rect-light.png' alt='V-Ray Rect Light used as a soft studio-style area light on 3D objects' style='width:100%; margin:20px 0 30px 0;' />\
<p style='text-align: justify; margin-top: 30px;'><b>Mesh Light:</b> Applied to custom geometry to turn a 3D logo into an emissive light source. This demonstrated how non-standard shapes can function as light emitters, useful for neon signage, glowing branding elements, and stylized lighting accents.</p>\
<img src='/images/projects/vray-mesh-light.png' alt='V-Ray Mesh Light applied to a custom 3D logo as an emissive light source' style='width:100%; margin:20px 0 30px 0;' />\
<p style='text-align: justify; margin-top: 30px;'><b>IES Light:</b> Set up using real-world photometric IES profiles to replicate the exact light distribution of physical fixtures. This was particularly effective for interior and architectural scenes where realistic beam shapes, falloff, and highlights are critical.</p>\
<img src='/images/projects/vray-ies-light.png' alt='V-Ray IES Light creating realistic photometric light distribution in an interior scene' style='width:100%; margin:20px 0 30px 0;' />\
<p style='text-align: justify; margin-top: 20px;'>Together, these tests clarified how V-Ray Sun excels at natural daylight, while Rect, Mesh, and IES lights provide precise control for studio, branding, and architectural lighting. The study reinforces a flexible lighting workflow that can be adapted to both cinematic visuals and practical visualization tasks.</p>",
    thumbnail: "/images/projects/vray-sun-light.jpg",
    images: [
        "/images/projects/vray-sun-light.jpg",
        "/images/projects/vray-rect-light.png",
        "/images/projects/vray-mesh-light.png",
        "/images/projects/vray-ies-light.png"
    ],
    tags: [
        "V-Ray Lighting",
        "V-Ray Sun",
        "Rect Light",
        "Mesh Light",
        "IES Light",
        "Autodesk Maya",
        "3D Lighting Study"
    ],
    date: "2025-10-14",
    seo: {
        keywords: [
            "Md Rakibujjaman Adib",
            "V-Ray lighting study",
            "V-Ray Sun setup",
            "V-Ray Rect Light",
            "V-Ray Mesh Light logo",
            "V-Ray IES Light interior",
            "3D exterior lighting Maya",
            "architectural visualization lighting",
            "production-ready 3D lighting"
        ],
        meta: [
            { name: "author", content: "Md Rakibujjaman Adib" },
            {
                name: "title",
                content: "V-Ray Lighting Study: Sun, Rect, Mesh & IES | Md Rakibujjaman Adib"
            },
            {
                name: "description",
                content:
                    "A V-Ray lighting study by Md Rakibujjaman Adib exploring Sun, Rect, Mesh, and IES lights in Autodesk Maya for realistic daylight, studio, and architectural illumination."
            },
            {
                name: "keywords",
                content:
                    "Md Rakibujjaman Adib, V-Ray lighting study, V-Ray Sun setup, Rect Light, Mesh Light, IES Light, 3D lighting Maya, architectural visualization"
            },
            {
                property: "article:published_time",
                content: "2025-10-14T00:00:00Z"
            },
            {
                property: "og:title",
                content: "V-Ray Lighting Study: Sun, Rect, Mesh & IES | Md Rakibujjaman Adib"
            },
            {
                property: "og:description",
                content:
                    "Comparative V-Ray lighting exploration using Sun, Rect, Mesh, and IES lights to build realistic exterior, studio, and architectural 3D scenes."
            },
            {
                property: "og:type",
                content: "website"
            }
        ]
    }
};

export default project;