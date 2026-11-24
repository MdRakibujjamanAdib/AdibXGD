import type { Project } from '../projects.ts';

const project: Project = {
    id: "vray-architectural-environment-design",
    title: "V-Ray Architectural Environment Design",
    shortTitle: "V-Ray Environment",
    category: "3D",
    featured: false,
    role: "3D Lighting & Architectural Visualizer",
    summary: "First V-Ray rendering project combining a lakeside pavilion gazebo with physical camera exposure, natural photometric daylight, and foreground optical depth-of-field.",
    description: "<p style='text-align: justify;'><b>V-Ray Architectural Environment Design</b> represents a foundational milestone in my 3D lighting career: my very first rendering project authored using the Chaos V-Ray render engine. The goal was to master V-Ray's physical camera algorithms, sun & sky photometric systems, and optical depth-of-field to render an evocative, cinematic outdoor environment.</p>\
\
<h3 style='font-size: 1.25rem; font-weight: 700; margin-top: 36px; color: var(--vb-text);'>01. Cinematic Framing & Foreground Optical Bokeh</h3>\
<p style='text-align: justify; margin-top: 12px;'>The scene is composed through blurred foreground tree foliage. Framing the lakeside Victorian gazebo and solitary cloaked figure across the water through out-of-focus leaves introduces an unmistakable photographic sense of atmosphere, depth, and spatial scale.</p>\
<img src='/images/projects/vray-lakeside-gazebo-architectural-environment.webp' alt='Lakeside gazebo architectural environment render in Chaos V-Ray with foreground tree bokeh' style='width:100%; border-radius:12px; margin:20px 0 32px 0;' />\
\
<h3 style='font-size: 1.25rem; font-weight: 700; margin-top: 36px; color: var(--vb-text);'>02. V-Ray Physical Camera & Photometric Sun/Sky</h3>\
<p style='text-align: justify; margin-top: 12px;'>Utilizing calibrated physical f-stop, shutter speed, and ISO parameters, the lighting reproduces crisp afternoon sunlight filtered through dense overhanging branches. The lake water calculates realistic Fresnel reflections and subtle wave displacement, anchoring the pavilion seamlessly in nature.</p>",
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
