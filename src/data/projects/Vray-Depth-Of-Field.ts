import { Project } from '../projects';

const project: Project = {
    id: "Vray-Depth-Of-Field",
    title: "V-Ray Depth of Field Study",
    category: "3D",
    role: "Lighting & Rendering Artist",
    summary: "A cinematic depth of field study using the V-Ray Physical Camera to control focus, blur intensity, and realistic lens behavior in 3D scenes.",
    description: "<p style='text-align: justify;'>This project explores the implementation of Depth of Field (DOF) using the V-Ray Physical Camera in Autodesk Maya. The objective was to replicate real-world camera behavior by controlling focus distance, F-Number, and lens settings to create realistic foreground and background blur.</p>\
<p style='text-align: justify; margin-top: 30px;'><b>Camera Setup:</b> A controlled scene with objects placed at varying distances was created to test how focus shifts across depth. The V-Ray Physical Camera was positioned to establish a clear focal hierarchy.</p>\
<img src='/images/projects/vray-dof-setup.png' alt='Scene setup for V-Ray Physical Camera depth of field test' style='width:100%; margin:20px 0 30px 0;' />\
<p style='text-align: justify; margin-top: 30px;'><b>F-Number & Focus Control:</b> A low F-Number was used to create shallow depth of field, producing strong background and foreground blur. Adjusting focus distance allowed selective emphasis on specific objects within the composition.</p>\
<img src='/images/projects/vray-dof-focus.png' alt='V-Ray depth of field showing focused object with blurred foreground and background' style='width:100%; margin:20px 0 30px 0;' />\
<p style='text-align: justify; margin-top: 30px;'><b>Bokeh & Cinematic Effect:</b> Bokeh was enabled to replicate natural lens blur characteristics. Animating the focus distance created a cinematic focus-pull effect, shifting viewer attention dynamically between subjects.</p>\
<img src='/images/projects/vray-dof-final.png' alt='Final cinematic V-Ray depth of field render with realistic lens blur' style='width:100%; margin:20px 0 30px 0;' />\
<p style='text-align: justify; margin-top: 20px;'>The study demonstrates how depth of field enhances realism, guides visual storytelling, and adds a professional cinematic finish to product and environment renders.</p>",
    thumbnail: "/images/projects/vray-dof-final.png",
    images: [
        "/images/projects/vray-dof-setup.png",
        "/images/projects/vray-dof-focus.png",
        "/images/projects/vray-dof-final.png",
        "/images/projects/vray-dof-yellow.png"
    ],
    tags: [
        "V-Ray DOF",
        "Depth of Field",
        "V-Ray Physical Camera",
        "Cinematic Rendering",
        "Autodesk Maya",
        "3D Visualization"
    ],
    date: "2025-10-16",
    seo: {
        keywords: [
            "Md Rakibujjaman Adib",
            "V-Ray depth of field",
            "V-Ray Physical Camera",
            "3D cinematic render",
            "DOF in Autodesk Maya",
            "V-Ray focus distance",
            "3D bokeh effect",
            "realistic lens blur 3D",
            "cinematic product visualization"
        ],
        meta: [
            { name: "author", content: "Md Rakibujjaman Adib" },
            {
                name: "title",
                content: "V-Ray Depth of Field Study | Md Rakibujjaman Adib"
            },
            {
                name: "description",
                content:
                    "A cinematic depth of field study using the V-Ray Physical Camera in Autodesk Maya, demonstrating realistic focus control, lens blur, and bokeh effects."
            },
            {
                name: "keywords",
                content:
                    "Md Rakibujjaman Adib, V-Ray DOF, V-Ray Physical Camera, 3D depth of field, cinematic rendering, lens blur Maya"
            },
            {
                property: "article:published_time",
                content: "2025-10-16T00:00:00Z"
            },
            {
                property: "og:title",
                content: "V-Ray Depth of Field Study | Md Rakibujjaman Adib"
            },
            {
                property: "og:description",
                content:
                    "Cinematic V-Ray depth of field exploration using physical camera controls and animated focus pull techniques."
            },
            {
                property: "og:type",
                content: "website"
            }
        ]
    }
};

export default project;