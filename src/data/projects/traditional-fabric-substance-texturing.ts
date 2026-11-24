import type { Project } from '../projects.ts';

const project: Project = {
    id: "traditional-fabric-substance-texturing",
    title: "Traditional Fabric & Silk PBR Texturing Study",
    shortTitle: "Fabric Texturing",
    category: "3D",
    featured: false,
    role: "Material & Texture Artist",
    summary: "Substance 3D Painter study exploring woven silk fabrics, metallic gold embroidery borders, micro-fiber normal details, and fabric sheen.",
    description: "<p style='text-align: justify;'>An intensive PBR material and cloth texturing study conducted in Adobe Substance 3D Painter. The exploration focused on reproducing the intricate weave structures, anisotropic luster, and metallic thread borders characteristic of South Asian traditional silk garments.</p>\
<p style='text-align: justify; margin-top: 30px;'><b>Weave Patterns & Micro-Surface Detail:</b> Custom normal and height maps were crafted to simulate diamond-lattice jacquard weaves, fine thread counts, and delicate surface fuzz. Metallic gold brocade (zari) borders were textured with authentic foil specular response, subtle crinkling, and edge fraying.</p>\
<p style='text-align: justify; margin-top: 30px;'><b>LookDev & Outdoor Lighting:</b> Staged against natural daylight HDRI environments to test how dynamic direct sunlight and ambient sky fill interact with the fabric's velvet-sheen micro-roughness. The gold trims catch natural glints while the flowing cloth drapery maintains soft, natural light diffusion.</p>",
    thumbnail: "/images/projects/Texturing (1).jpg",
    images: [
        "/images/projects/Texturing (1).jpg",
        "/images/projects/Texturing (2).jpg",
        "/images/projects/Texturing (3).jpg",
        "/images/projects/Texturing (4).jpg"
    ],
    tags: [
        "Substance 3D Painter",
        "Fabric Shading",
        "PBR Texturing",
        "LookDev",
        "Cultural Heritage"
    ],
    date: "2024-07-20",
    seo: {
        keywords: [
            "Md Rakibujjaman Adib",
            "Traditional Fabric Silk PBR Texturing",
            "Substance 3D Painter cloth texturing",
            "silk saree 3D material",
            "gold brocade zari texture",
            "PBR fabric shader"
        ],
        meta: [
            { name: "author", content: "Md Rakibujjaman Adib" },
            {
                name: "title",
                content: "Traditional Fabric & Silk PBR Texturing Study | Md Rakibujjaman Adib"
            },
            {
                name: "description",
                content: "Substance 3D Painter study exploring woven silk fabrics, metallic gold embroidery borders, micro-fiber normal details, and fabric sheen."
            }
        ]
    }
};

export default project;
