import type { Project } from '../projects.ts';

const project: Project = {
    id: "vray-atmospheric-environment-fog",
    title: "V-Ray Atmospheric Environment Fog & Forest Well Study",
    shortTitle: "V-Ray Forest Fog",
    category: "3D",
    featured: false,
    role: "Lighting & Environment Artist",
    summary: "Atmospheric outdoor CGI study exploring VRayEnvironmentFog aerial perspective, volumetric density falloff, and moody forest illumination around a rustic well.",
    description: "<p style='text-align: justify;'><b>V-Ray Atmospheric Environment Fog & Forest Well Study</b> explores large-scale outdoor atmospheric perspective, participating media, and moody chiaroscuro lighting in Chaos V-Ray. Centered on a solitary rustic stone well nestled in an overgrown forest clearing, this project investigates how dense environmental fog enhances spatial depth and narrative mystery.</p>\
\
<h3 style='font-size: 1.25rem; font-weight: 700; margin-top: 36px; color: var(--vb-text);'>01. Volumetric Density, Height Falloff & Aerial Perspective</h3>\
<p style='text-align: justify; margin-top: 12px;'>Using VRayEnvironmentFog configured with a custom vertical density gradient, mist settles thickly across the damp forest soil while thinning out toward the upper canopy. Distant trees dissolve gradually into atmospheric haze, establishing believable depth planes.</p>\
<img src='/images/projects/vray-environment-fog.webp' alt='Atmospheric forest well 3D render in Chaos V-Ray featuring dense volumetric Environment Fog' style='width:100%; border-radius:12px; margin:20px 0 32px 0;' />\
\
<h3 style='font-size: 1.25rem; font-weight: 700; margin-top: 36px; color: var(--vb-text);'>02. Chiaroscuro Moonlight & Foliage Scattering</h3>\
<p style='text-align: justify; margin-top: 12px;'>A low-angle cool keylight simulates nocturnal moonlight breaking through dense branches, catching the rough-hewn stone masonry, mossy wooden roof, and bucket rigging of the well while preserving dramatic shadow pockets across the surrounding wilderness.</p>",
    thumbnail: "/images/projects/vray-environment-fog.webp",
    thumbnails: [
        "/images/projects/vray-environment-fog.webp"
    ],
    images: [
        "/images/projects/vray-environment-fog.webp"
    ],
    tags: [
        "Chaos V-Ray",
        "Environment Fog",
        "Atmospheric Lighting",
        "Volumetric Fog",
        "Outdoor Environment",
        "Forest Well",
        "Chaos Scatter"
    ],
    date: "2024-06-28",
    seo: {
        keywords: [
            "Md Rakibujjaman Adib",
            "V-Ray Environment Fog outdoor forest",
            "atmospheric 3D forest well render",
            "VRayEnvironmentFog height falloff",
            "volumetric outdoor lighting V-Ray",
            "Chaos Scatter foliage distribution"
        ],
        meta: [
            { name: "author", content: "Md Rakibujjaman Adib" },
            {
                name: "title",
                content: "V-Ray Atmospheric Environment Fog & Forest Well Study | Md Rakibujjaman Adib"
            },
            {
                name: "description",
                content: "Atmospheric outdoor CGI study in Chaos V-Ray exploring VRayEnvironmentFog, volumetric aerial perspective, and foliage scattering around a forest well."
            },
            {
                property: "og:image",
                content: "/images/projects/vray-environment-fog.webp"
            }
        ]
    }
};

export default project;
