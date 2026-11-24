import type { Project } from '../projects.ts';

const project: Project = {
    id: "vray-architectural-environment-design",
    title: "V-Ray Architectural Environment Design",
    shortTitle: "V-Ray Environment",
    category: "3D",
    featured: false,
    role: "3D Lighting & Architectural Visualizer",
    summary: "First V-Ray rendering project combining a lakeside pavilion gazebo with physical camera exposure, natural photometric daylight, and foreground optical depth-of-field.",
    description: "<p style='text-align: justify;'>A milestone architectural visualization project marking my very first render created using Chaos V-Ray. The goal was to harness V-Ray's physical camera algorithms, sun & sky photometric systems, and optical depth-of-field to render an evocative, cinematic outdoor environment.</p>\
<p style='text-align: justify; margin-top: 30px;'><b>Cinematic Framing & Foreground Depth:</b> The scene is composed as an observational glimpse through blurred foreground tree foliage. Framing the lakeside Victorian gazebo and solitary cloaked figure across the water through leafy out-of-focus elements introduces an unmistakable photographic sense of atmosphere and scale.</p>\
<p style='text-align: justify; margin-top: 30px;'><b>V-Ray Physical Camera & Photometrics:</b> Utilizing realistic f-stop, shutter speed, and ISO camera parameters, the lighting reproduces crisp afternoon sunlight filtered through a dynamic tree canopy. The water surface calculates real-time Fresnel reflections and subtle ripple distortions, anchoring the architectural pavilion naturally in the landscape.</p>",
    thumbnail: "/images/projects/vray-lakeside-gazebo-architectural-environment.webp",
    images: [
        "/images/projects/vray-lakeside-gazebo-architectural-environment.webp"
    ],
    tags: [
        "Chaos V-Ray",
        "Architectural Visualization",
        "Physical Camera",
        "Depth of Field",
        "Photometric Lighting",
        "Environment Art"
    ],
    date: "2024-08-14",
    seo: {
        keywords: [
            "Md Rakibujjaman Adib",
            "V-Ray Architectural Environment Design",
            "first V-Ray render",
            "V-Ray physical camera depth of field",
            "gazebo environment render",
            "architectural lighting V-Ray"
        ],
        meta: [
            { name: "author", content: "Md Rakibujjaman Adib" },
            {
                name: "title",
                content: "V-Ray Architectural Environment Design | Chaos V-Ray by Md Rakibujjaman Adib"
            },
            {
                name: "description",
                content: "First V-Ray rendering project by Md Rakibujjaman Adib, combining a lakeside pavilion gazebo with physical camera exposure, daylight, and optical depth-of-field."
            }
        ]
    }
};

export default project;
