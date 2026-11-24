import type { Project } from '../projects.ts';

const project: Project = {
    id: "Vray-Depth-Of-Field",
    title: "V-Ray Depth of Field Study",
    shortTitle: "V-Ray DOF",
    category: "3D",
    featured: false,
    role: "Lighting & Rendering Artist",
    summary: "A cinematic depth of field study using the V-Ray Physical Camera to control focus, blur intensity, and realistic lens behavior in 3D scenes.",
    description: "<p style='text-align: justify;'><b>V-Ray Depth of Field Study</b> investigates the optical physics and cinematic storytelling potential of simulated thin-lens optics in Chaos V-Ray and Autodesk Maya. By modulating camera sensor sizing, focal lengths, circle of confusion (CoC), and mechanical aperture blade geometry, this study explores how selective optical blur commands viewer attention in digital 3D space.</p>\
\
<h3 style='font-size: 1.25rem; font-weight: 700; margin-top: 36px; color: var(--vb-text);'>01. Master Cinematic Bokeh & Focal Hierarchy</h3>\
<p style='text-align: justify; margin-top: 12px;'>The master composition establishes a dynamic focal rack across foreground, midground, and background subjects. With the aperture wide open (f/1.4), bright specular highlights melt into creamy, circular optical bokeh discs that frame the pin-sharp hero subject.</p>\
<img src='/images/projects/vray-cinematic-dof-thumbnail.webp' alt='Cinematic V-Ray depth of field render showing optical bokeh discs and razor-sharp focal plane' style='width:100%; border-radius:12px; margin:20px 0 32px 0;' />\
\
<h3 style='font-size: 1.25rem; font-weight: 700; margin-top: 36px; color: var(--vb-text);'>02. Spatial Staging & Physical Camera Setup</h3>\
<p style='text-align: justify; margin-top: 12px;'>A controlled calibration scene with identical target geometries placed at staggered distance intervals was drafted to evaluate blur falloff linearity across 3D depth space. The V-Ray Physical Camera was aligned with a 50mm portrait focal length to replicate human ocular perspective.</p>\
<img src='/images/projects/vray-dof-setup.webp' alt='Scene setup for V-Ray Physical Camera depth of field test with staggered subjects' style='width:100%; border-radius:12px; margin:20px 0 32px 0;' />\
\
<h3 style='font-size: 1.25rem; font-weight: 700; margin-top: 36px; color: var(--vb-text);'>03. F-Number Variation & Shallow Depth Isolation</h3>\
<p style='text-align: justify; margin-top: 12px;'>By tightening the focus distance to a single specimen while keeping the F-stop low, foreground objects are softened into smooth, non-distracting color washes while distant geometry dissolves completely into atmospheric blur.</p>\
<img src='/images/projects/vray-dof-focus.webp' alt='V-Ray shallow depth of field isolating subject with strong foreground and background blur' style='width:100%; border-radius:12px; margin:20px 0 32px 0;' />\
\
<h3 style='font-size: 1.25rem; font-weight: 700; margin-top: 36px; color: var(--vb-text);'>04. Selective Color Calibration & Yellow Subject Isolation</h3>\
<p style='text-align: justify; margin-top: 12px;'>An alternative visual experiment couples shallow depth-of-field with targeted chromatic isolation. The yellow hero subject retains intense color fidelity and surface sharpness while adjacent cool-toned elements fall out of focus, reinforcing focal narrative priority.</p>\
<img src='/images/projects/vray-dof-yellow.webp' alt='V-Ray depth of field render isolating vibrant yellow subject with optical falloff across surrounding elements' style='width:100%; border-radius:12px; margin:20px 0 32px 0;' />\
\
<h3 style='font-size: 1.25rem; font-weight: 700; margin-top: 36px; color: var(--vb-text);'>05. Optical Bokeh Blade Geometry & Final LookDev</h3>\
<p style='text-align: justify; margin-top: 12px;'>The final render configures 7-bladed mechanical aperture geometry with custom blade curvature and slight optical vignetting. The resulting lens characteristics elevate the 3D scene into a cinematic film-still aesthetic.</p>\
<img src='/images/projects/vray-dof-final.webp' alt='Final cinematic V-Ray depth of field render with realistic lens blur and 7-bladed aperture bokeh' style='width:100%; border-radius:12px; margin:20px 0 32px 0;' />",
    thumbnail: "/images/projects/vray-dof-final.webp",
    videoUrl: "/images/projects/vray-cinematic-depth-of-field-video.mp4",
    images: [
        "/images/projects/vray-cinematic-dof-thumbnail.webp",
        "/images/projects/vray-dof-setup.webp",
        "/images/projects/vray-dof-focus.webp",
        "/images/projects/vray-dof-final.webp",
        "/images/projects/vray-dof-yellow.webp"
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