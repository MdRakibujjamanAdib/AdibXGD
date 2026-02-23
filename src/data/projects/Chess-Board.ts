import { Project } from '../projects';

const project: Project = {
    id: "Vray-Chess-Board",
    title: "Cinematic Chess Render",
    category: "3D",
    role: "3D Modeler & Rendering Artist",
    summary: "A cinematic chess scene modeled and rendered in Autodesk Maya using V-Ray, focusing on material realism, depth of field, and dramatic lighting.",
    description: "<p style='text-align: justify;'>This project features a fully modeled chess board and chess pieces created in Autodesk Maya and rendered using V-Ray. The goal was to explore cinematic lighting, realistic materials, and storytelling composition within a minimal environment.</p>\
<p style='text-align: justify; margin-top: 30px;'><b>Modeling & Proportions:</b> Each chess piece was carefully modeled to maintain accurate proportions and smooth curvature. Clean topology was maintained to ensure proper reflections and high-quality render output. The board combines wooden texture mapping with polished surface details to enhance realism.</p>\
<img src='/images/projects/chess-wide-render.jpg' alt='Cinematic wide shot of 3D chess board rendered in V-Ray' style='width:100%; margin:20px 0 30px 0;' />\
<p style='text-align: justify; margin-top: 30px;'><b>Material & Surface Study:</b> V-Ray materials were used to create contrast between matte white pieces and glossy black pieces. Reflection, roughness, and subtle surface imperfections were adjusted to achieve believable highlights and depth.</p>\
<img src='/images/projects/chess-detail-render.jpg' alt='Close-up of chess king and fallen black piece showing V-Ray material reflections' style='width:100%; margin:20px 0 30px 0;' />\
<p style='text-align: justify; margin-top: 30px;'><b>Lighting & Depth of Field:</b> A controlled lighting setup was used to isolate the main subject and create a dramatic atmosphere. Depth of Field was applied through the V-Ray Physical Camera to guide focus toward the king piece, while background elements remain softly blurred to enhance cinematic storytelling.</p>\
<img src='/images/projects/chess-dof-render.jpg' alt='V-Ray chess scene with depth of field and dramatic lighting' style='width:100%; margin:20px 0 30px 0;' />\
<p style='text-align: justify; margin-top: 20px;'>The composition, lighting direction, and fallen black king introduce a narrative element, turning a simple product-style render into a storytelling frame. This project demonstrates my ability to combine modeling, materials, lighting, and camera control to produce high-end cinematic renders.</p>",
    thumbnail: "/images/projects/chess-wide-render.jpg",
    images: [
        "/images/projects/chess-wide-render.jpg",
        "/images/projects/chess-detail-render.jpg",
        "/images/projects/chess-dof-render.jpg"
    ],
    tags: [
        "V-Ray Rendering",
        "Chess Modeling",
        "Product Visualization",
        "Depth of Field",
        "Autodesk Maya",
        "Cinematic Lighting"
    ],
    date: "2025-12-28",
    seo: {
        keywords: [
            "Md Rakibujjaman Adib",
            "V-Ray chess render",
            "3D chess board modeling",
            "cinematic 3D rendering",
            "V-Ray material study",
            "Autodesk Maya chess scene",
            "depth of field 3D render",
            "product style render V-Ray",
            "dramatic lighting 3D"
        ],
        meta: [
            { name: "author", content: "Md Rakibujjaman Adib" },
            {
                name: "title",
                content: "Cinematic Chess Render in V-Ray | 3D Modeling & Lighting Study"
            },
            {
                name: "description",
                content:
                    "A cinematic chess board scene modeled in Autodesk Maya and rendered with V-Ray, showcasing realistic materials, depth of field, and dramatic lighting."
            },
            {
                name: "keywords",
                content:
                    "Md Rakibujjaman Adib, V-Ray chess render, 3D chess board, cinematic rendering, Maya modeling, product visualization"
            },
            {
                property: "article:published_time",
                content: "2025-12-28T00:00:00Z"
            },
            {
                property: "og:title",
                content: "Cinematic Chess Render in V-Ray"
            },
            {
                property: "og:description",
                content:
                    "Dramatic chess board render created in Autodesk Maya using V-Ray, combining material realism and cinematic depth of field."
            },
            {
                property: "og:type",
                content: "website"
            }
        ]
    }
};

export default project;