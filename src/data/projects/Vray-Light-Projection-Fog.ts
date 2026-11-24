import type { Project } from '../projects.ts';

const project: Project = {
    id: "Vray-Light-Projection-Fog",
    title: "V-Ray Light Projection & Fog",
    category: "3D",
    featured: false,
    role: "Lighting & Rendering Artist",
    summary: "An atmospheric V-Ray study combining light projection and Environment Fog to create god rays, textured light beams, and depth-rich outdoor scenes.",
    description: "<p style='text-align: justify;'>This project explores advanced V-Ray lighting techniques in Autodesk Maya, focusing on light projection and atmospheric effects using VRayEnvironmentFog. The goal was to create cinematic god rays, texture-projected lighting, and moody outdoor depth while maintaining control over exposure and clarity.</p>\
<p style='text-align: justify; margin-top: 30px;'><b>Light Projection & God Rays:</b> A V-Ray Rect Light was used with a softbox-style texture and VRayEnvironmentFog to create visible light beams in the air. By fine-tuning decay and fog density, the scene produced natural-looking god rays that highlighted a central subject without overexposing the environment.</p>\
<img src='/images/projects/vray-volumetric-godray-flower-vase-01.webp' alt='V-Ray Rect Light with Environment Fog creating cinematic god rays in a 3D scene' style='width:100%; margin:20px 0 30px 0;' />\
<p style='text-align: justify; margin-top: 30px;'><b>Texture Projection:</b> A Rect Light was configured as a projector by loading a custom image into its texture slot and aiming it at a wall in a dark scene. This setup simulated a slide or gobo projector, casting detailed imagery and complex shadows directly from the light source.</p>\
<img src='/images/projects/vray-light-projection.webp' alt='V-Ray light projecting an image texture onto a wall like a slide projector' style='width:100%; margin:20px 0 30px 0;' />\
<p style='text-align: justify; margin-top: 30px;'><b>Volumetric Sunbeams & Flower Vase Caustics:</b> The primary visual study investigates intense directional sunlight piercing an interior aperture. As rays pass through VRayEnvironmentFog, brilliant crepuscular god rays illuminate a delicate glass flower vase, casting translucent highlights and subtle caustics across the surface.</p>\
<img src='/images/projects/vray-volumetric-godray-flower-vase-01.webp' alt='V-Ray volumetric god-rays illuminating interior flower vase with Environment Fog' style='width:100%; margin:20px 0 30px 0;' />\
<p style='text-align: justify; margin-top: 20px;'>Together, these experiments demonstrate how textured lights, volumetric fog, and atmospheric scattering can be calibrated to create evocative, cinematic lighting scenarios for interior still life and product visuals.</p>",
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