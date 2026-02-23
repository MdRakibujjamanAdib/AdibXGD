import { Project } from '../projects';

const project: Project = {
    id: "Vray-Light-Projection-Fog",
    title: "V-Ray Light Projection & Fog",
    category: "3D",
    role: "Lighting & Rendering Artist",
    summary: "An atmospheric V-Ray study combining light projection and Environment Fog to create god rays, textured light beams, and depth-rich outdoor scenes.",
    description: "<p style='text-align: justify;'>This project explores advanced V-Ray lighting techniques in Autodesk Maya, focusing on light projection and atmospheric effects using VRayEnvironmentFog. The goal was to create cinematic god rays, texture-projected lighting, and moody outdoor depth while maintaining control over exposure and clarity.</p>\
<p style='text-align: justify; margin-top: 30px;'><b>Light Projection & God Rays:</b> A V-Ray Rect Light was used with a softbox-style texture and VRayEnvironmentFog to create visible light beams in the air. By fine-tuning decay and fog density, the scene produced natural-looking god rays that highlighted a central subject without overexposing the environment.</p>\
<img src='/images/projects/vray-god-rays.png' alt='V-Ray Rect Light with Environment Fog creating cinematic god rays in a 3D scene' style='width:100%; margin:20px 0 30px 0;' />\
<p style='text-align: justify; margin-top: 30px;'><b>Texture Projection:</b> A Rect Light was configured as a projector by loading a custom image into its texture slot and aiming it at a wall in a dark scene. This setup simulated a slide or gobo projector, casting detailed imagery and complex shadows directly from the light source.</p>\
<img src='/images/projects/vray-light-projection.png' alt='V-Ray light projecting an image texture onto a wall like a slide projector' style='width:100%; margin:20px 0 30px 0;' />\
<p style='text-align: justify; margin-top: 30px;'><b>Environment Fog & Outdoor Atmosphere:</b> VRayEnvironmentFog was applied to a larger outdoor scene to introduce atmospheric perspective and depth. Adjusting fog distance and height created a layered look where distant objects appeared softer and more desaturated, enhancing scale and mood without obscuring the main subject.</p>\
<img src='/images/projects/vray-environment-fog.png' alt='V-Ray Environment Fog adding depth and atmosphere to an outdoor 3D scene' style='width:100%; margin:20px 0 30px 0;' />\
<p style='text-align: justify; margin-top: 20px;'>Together, these experiments demonstrate how textured lights and volumetric fog can be combined to build cinematic lighting scenarios, from focused indoor god rays to atmospheric exterior renders suitable for storytelling, product visuals, and environment design.</p>",
    thumbnail: "/images/projects/vray-god-rays.jpg",
    images: [
        "/images/projects/vray-god-rays.jpg",
        "/images/projects/vray-light-projection.png",
        "/images/projects/vray-environment-fog.jpg"
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