import type { Project } from '../projects.ts';

const project: Project = {
    id: "3d-stage-modeling",
    title: "3D Stage Modeling",
    shortTitle: "3D Stage Design",
    category: "3D",
    featured: false,
    role: "3D Spatial & Lighting Designer",
    summary: "A 3ds Max architectural assignment exploring realistic spatial stage architecture, spotlight illumination, and physical camera depth-of-field blur on the central podium.",
    description: "<p style='text-align: justify;'>This project was created as an advanced Autodesk 3ds Max assignment exploring spatial scale, architectural event staging, and optical camera realism. The objective was to design a clean, modern keynote presentation stage equipped for high-profile conferences and live broadcasts.</p>\
<p style='text-align: justify; margin-top: 30px;'><b>Cinematic Optical Depth of Field:</b> A key technical standout of this project is the deliberate use of physical camera depth-of-field (DoF). By calibrating a wide aperture, the camera renders a subtle, photorealistic blur across the foreground podium and structural perimeter, drawing viewer focus deeply into the illuminated presentation center.</p>\
<p style='text-align: justify; margin-top: 30px;'><b>Stage Lighting & Material Dynamics:</b> The spatial setup incorporates overhead lighting trusses, directional spotlights, and high-contrast ambient backdrops. Materials include glossy stage flooring that accurately captures reflections of the overhead spotlights, backdrop graphics, and speaker stands, delivering an authentic live venue aesthetic.</p>",
    thumbnail: "/images/projects/3D Stage Designing (1).png",
    images: [
        "/images/projects/3D Stage Designing (1).png",
        "/images/projects/3D Stage Designing (2).png",
        "/images/projects/3D Stage Designing (3).png",
        "/images/projects/3D Stage Designing (4).png"
    ],
    tags: [
        "3ds Max",
        "Stage Design",
        "3D Spatial Modeling",
        "Lighting & Optics",
        "Depth of Field",
        "Event Visualization"
    ],
    date: "2024-04-18",
    seo: {
        keywords: [
            "Md Rakibujjaman Adib",
            "3D Stage Modeling",
            "3ds Max stage design",
            "event stage 3D render",
            "podium depth of field 3D",
            "keynote stage visualization"
        ],
        meta: [
            { name: "author", content: "Md Rakibujjaman Adib" },
            {
                name: "title",
                content: "3D Stage Modeling | 3ds Max Spatial Design by Md Rakibujjaman Adib"
            },
            {
                name: "description",
                content: "A 3ds Max assignment exploring realistic spatial stage architecture, spotlight illumination, and physical camera depth-of-field blur on the central podium."
            }
        ]
    }
};

export default project;
