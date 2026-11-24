import type { Project } from '../projects.ts';

const project: Project = {
    id: "Vray-Light-Projection-Fog",
    title: "V-Ray Light Projection & Fog",
    shortTitle: "V-Ray Projection & Fog",
    category: "3D",
    featured: false,
    role: "Lighting & Rendering Artist",
    summary: "An atmospheric V-Ray study combining light projection and Environment Fog to create god rays, textured light beams, and depth-rich outdoor scenes.",
    description: "<p style='text-align: justify;'><b>V-Ray Light Projection & Fog</b> explores advanced participating media, volumetric light transport, and texture-driven light projection in Chaos V-Ray and Autodesk Maya. By coupling VRayEnvironmentFog with directional light attenuation and custom stencil cookies, this study analyzes how light behaves when traveling through dense optical media.</p>\
\
<h3 style='font-size: 1.25rem; font-weight: 700; margin-top: 36px; color: var(--vb-text);'>01. Atmospheric God Rays & Volumetric Sunbeams</h3>\
<p style='text-align: justify; margin-top: 12px;'>A narrow aperture lets directional sunlight pierce a darkened interior. As the photon beams collide with suspended particulate matter defined in VRayEnvironmentFog, brilliant crepuscular rays (god rays) illuminate the central glass flower vase, casting soft caustic patterns across the table.</p>\
<img src='/images/projects/vray-volumetric-godray-flower-vase-01.webp' alt='V-Ray volumetric god rays illuminating flower vase through Environment Fog' style='width:100%; border-radius:12px; margin:20px 0 32px 0;' />\
\
<h3 style='font-size: 1.25rem; font-weight: 700; margin-top: 36px; color: var(--vb-text);'>02. Scattering Phase Function & Secondary Bounce Angle</h3>\
<p style='text-align: justify; margin-top: 12px;'>An alternate camera angle examines Mie scattering phase asymmetry (Henyey-Greenstein g-parameter). Forward-scattering bias produces an intense, high-luminance halo around the primary light shaft while preserving subtle contrast in the shadowed areas.</p>\
<img src='/images/projects/vray-volumetric-godray-flower-vase-02.webp' alt='Alternate angle of V-Ray volumetric lighting showing Mie scattering and light beam falloff' style='width:100%; border-radius:12px; margin:20px 0 32px 0;' />\
\
<h3 style='font-size: 1.25rem; font-weight: 700; margin-top: 36px; color: var(--vb-text);'>03. Micro-Atmosphere & Volumetric Dust Density</h3>\
<p style='text-align: justify; margin-top: 12px;'>Fine-tuning the fog step size and density falloff distance creates tangible atmospheric air thickness without grain or noise artifacts. The light cone highlights the delicate petals and glass thickness with cinematic tactile presence.</p>\
<img src='/images/projects/vray-volumetric-godray-flower-vase-03.webp' alt='Detailed view of flower vase illuminated by dense volumetric light cone in V-Ray' style='width:100%; border-radius:12px; margin:20px 0 32px 0;' />\
\
<h3 style='font-size: 1.25rem; font-weight: 700; margin-top: 36px; color: var(--vb-text);'>04. Slide Projection & Textured Gobo Light Cookies</h3>\
<p style='text-align: justify; margin-top: 12px;'>A V-Ray Rect Light was configured as an optical slide projector by mapping a high-contrast graphic into its texture slot with tight directional collimation. The setup projects sharp photographic imagery directly onto interior surfaces like an analog slide projector.</p>\
<img src='/images/projects/vray-light-projection.webp' alt='V-Ray light projecting image texture onto wall like an optical slide projector' style='width:100%; border-radius:12px; margin:20px 0 32px 0;' />",
    thumbnail: "/images/projects/vray-volumetric-godray-flower-vase-01.webp",
    thumbnails: [
        "/images/projects/vray-volumetric-godray-flower-vase-01.webp",
        "/images/projects/vray-volumetric-godray-flower-vase-02.webp",
        "/images/projects/vray-volumetric-godray-flower-vase-03.webp",
        "/images/projects/vray-volumetric-godray-flower-vase-01.webp",
        "/images/projects/vray-light-projection.webp"
    ],
    images: [
        "/images/projects/vray-volumetric-godray-flower-vase-01.webp",
        "/images/projects/vray-volumetric-godray-flower-vase-02.webp",
        "/images/projects/vray-volumetric-godray-flower-vase-03.webp",
        "/images/projects/vray-volumetric-godray-flower-vase-01.webp",
        "/images/projects/vray-light-projection.webp"
    ],
    tags: [
        "V-Ray Lighting",
        "Environment Fog",
        "God Rays",
        "Light Projection",
        "Autodesk Maya",
        "Atmospheric Rendering"
    ],
    date: "2025-10-26",
    seo: {
        keywords: [
            "Md Rakibujjaman Adib",
            "V-Ray Environment Fog",
            "V-Ray god rays setup",
            "V-Ray light projection",
            "textured light in V-Ray",
            "3D volumetric lighting",
            "atmospheric 3D rendering",
            "Maya V-Ray cinematic lighting",
            "fog and light beams in 3D"
        ],
        meta: [
            { name: "author", content: "Md Rakibujjaman Adib" },
            {
                name: "title",
                content: "V-Ray Light Projection & Environment Fog Study | Md Rakibujjaman Adib"
            },
            {
                name: "description",
                content:
                    "An advanced V-Ray lighting study by Md Rakibujjaman Adib, combining light projection and Environment Fog to create cinematic god rays and atmospheric 3D scenes."
            },
            {
                name: "keywords",
                content:
                    "Md Rakibujjaman Adib, V-Ray Environment Fog, god rays, light projection, volumetric lighting, 3D atmospheric rendering, Autodesk Maya"
            },
            {
                property: "article:published_time",
                content: "2025-10-26T00:00:00Z"
            },
            {
                property: "og:title",
                content: "V-Ray Light Projection & Environment Fog Study | Md Rakibujjaman Adib"
            },
            {
                property: "og:description",
                content:
                    "Cinematic V-Ray experiments using textured lights and Environment Fog to build god rays, projected imagery, and depth-rich outdoor renders."
            },
            {
                property: "og:type",
                content: "website"
            }
        ]
    }
};

export default project;