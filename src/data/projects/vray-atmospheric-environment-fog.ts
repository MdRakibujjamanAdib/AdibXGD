import type { Project } from '../projects.ts';

const project: Project = {
    id: "vray-atmospheric-environment-fog",
    title: "V-Ray Atmospheric Environment Fog & Forest Well Study",
    shortTitle: "V-Ray Forest Fog",
    category: "3D",
    featured: false,
    role: "Lighting & Environment Artist",
    summary: "Atmospheric outdoor CGI study exploring VRayEnvironmentFog aerial perspective, volumetric density falloff, and moody forest illumination around a rustic well.",
    description: "<p style='text-align: justify;'>Atmospheric depth in computer graphics relies on participating media to soften distant silhouettes and scatter directional moonlight. This dedicated CGI study in Chaos V-Ray investigates large-scale outdoor fog simulation, centering on a rustic stone well situated within an overgrown misty forest.</p>\
<p style='text-align: justify; margin-top: 30px;'><b>Volumetric Density & Height Falloff:</b> Using VRayEnvironmentFog calibrated with custom height limits and distance attenuation, the mist clusters heavily near the damp forest floor while feathering into the tree canopies above. This produces layered atmospheric perspective, enhancing the sense of scale and spatial depth across deep tree lines.</p>\
<p style='text-align: justify; margin-top: 30px;'><b>Foliage Distribution & Moody Chiaroscuro:</b> Organic vegetation, grass clumps, and mossy ground details were distributed using procedural surface scattering. A cool, low-angle directional key light cuts through the dense forest canopy, highlighting the stone masonry of the well and water bucket while preserving rich, mysterious shadow contrast throughout the surrounding wilderness.</p>",
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
