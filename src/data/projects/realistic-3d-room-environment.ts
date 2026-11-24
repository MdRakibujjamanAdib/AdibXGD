import type { Project } from '../projects.ts';

const project: Project = {
    id: "realistic-3d-room-environment",
    title: "Realistic 3D Room Environment Design",
    shortTitle: "3D Room Design",
    category: "3D",
    featured: false,
    role: "Solo 3D Artist (Modeling, Texturing, Lighting)",
    summary: "First comprehensive 3ds Max interior assignment. Modeled, textured, and lit entirely solo, featuring a lived-in living and dining space with an ambient television playing drama.",
    description: "<p style='text-align: justify;'><b>Realistic 3D Room Environment Design</b> marks my first comprehensive architectural interior assignment executed entirely within Autodesk 3ds Max. As the solo artist on this project, I owned the complete production pipeline from architectural blocking, furniture drafting, and prop dressing to PBR material assignment, multi-light balancing, and camera composition.</p>\
\
<h3 style='font-size: 1.25rem; font-weight: 700; margin-top: 36px; color: var(--vb-text);'>01. Master Living Space & Narrative Heart</h3>\
<p style='text-align: justify; margin-top: 12px;'>Rather than rendering a sterile furniture showroom, the space was conceived with a lived-in residential warmth. The focal point is an ambient television playing a Bengali drama broadcast, casting soft shifting luminances across the living room carpet and modern fabric sofa.</p>\
<img src='/images/projects/3d-room-environment-interior-living-room-01.webp' alt='Master living room architectural render with television playing drama, sofa, and ambient lighting' style='width:100%; border-radius:12px; margin:20px 0 32px 0;' />\
\
<h3 style='font-size: 1.25rem; font-weight: 700; margin-top: 36px; color: var(--vb-text);'>02. Open-Concept Living & Dining Room Flow</h3>\
<p style='text-align: justify; margin-top: 12px;'>The architectural floor plan connects the entertainment lounge with a formal dining zone. Clear sightlines and realistic structural room dimensions (3.2m ceiling height, ergonomic door frames) ground the environment in physical reality.</p>\
<img src='/images/projects/3d-room-environment-interior-living-room-02.webp' alt='Wide open-plan perspective connecting the living lounge with the formal dining area' style='width:100%; border-radius:12px; margin:20px 0 32px 0;' />\
\
<h3 style='font-size: 1.25rem; font-weight: 700; margin-top: 36px; color: var(--vb-text);'>03. Media Entertainment Center & TV Screen Luminance</h3>\
<p style='text-align: justify; margin-top: 12px;'>The entertainment unit integrates floating cabinetry, speaker soundbars, and wall paneling. Self-illuminated emissive screen materials cast realistic directional light onto surrounding surfaces.</p>\
<img src='/images/projects/3d-room-environment-interior-living-room-03.webp' alt='Media console close-up showing screen emissive lighting on floating wooden cabinetry' style='width:100%; border-radius:12px; margin:20px 0 32px 0;' />\
\
<h3 style='font-size: 1.25rem; font-weight: 700; margin-top: 36px; color: var(--vb-text);'>04. Dining Furniture Craftsmanship & Spatial Symmetry</h3>\
<p style='text-align: justify; margin-top: 12px;'>The dining suite features a solid polished timber table paired with modern Scandinavian upholstered dining chairs. Each chair exhibits subtle beveling and fabric displacement for natural tactile weight.</p>\
<img src='/images/projects/3d-room-environment-interior-living-room-04.webp' alt='Formal dining room table and chairs with overhead pendant illumination' style='width:100%; border-radius:12px; margin:20px 0 32px 0;' />\
\
<h3 style='font-size: 1.25rem; font-weight: 700; margin-top: 36px; color: var(--vb-text);'>05. Daylight Calibration & Window Ingress</h3>\
<p style='text-align: justify; margin-top: 12px;'>Natural sunlight penetrates through floor-to-ceiling balcony windows, generating soft directional shadows that rake across the textured rug and hardwood flooring.</p>\
<img src='/images/projects/3d-room-environment-interior-living-room-05.webp' alt='Daylight ingress through balcony windows casting soft shadows across living room floor' style='width:100%; border-radius:12px; margin:20px 0 32px 0;' />\
\
<h3 style='font-size: 1.25rem; font-weight: 700; margin-top: 36px; color: var(--vb-text);'>06. Evening Ambiance & Artificial Warm Illumination</h3>\
<p style='text-align: justify; margin-top: 12px;'>An alternate lighting configuration explores warm 3000K recessed pot lights, pendant chandeliers, and concealed LED cove strips for an intimate evening atmosphere.</p>\
<img src='/images/projects/3d-room-environment-interior-living-room-06.webp' alt='Warm evening ambient lighting study with recessed ceiling LEDs and decorative floor lamps' style='width:100%; border-radius:12px; margin:20px 0 32px 0;' />\
\
<h3 style='font-size: 1.25rem; font-weight: 700; margin-top: 36px; color: var(--vb-text);'>07. Decorative Partitions & Architectural Trim</h3>\
<p style='text-align: justify; margin-top: 12px;'>Vertical timber slatted dividers delineate functional zones while preserving visual lightness and airflow throughout the interior layout.</p>\
<img src='/images/projects/3d-room-environment-interior-living-room-07.webp' alt='Vertical wooden slat partition dividing dining space from hallway circulation' style='width:100%; border-radius:12px; margin:20px 0 32px 0;' />\
\
<h3 style='font-size: 1.25rem; font-weight: 700; margin-top: 36px; color: var(--vb-text);'>08. Upholstery & Fabric Micro-Detailing</h3>\
<p style='text-align: justify; margin-top: 12px;'>Macro camera angles highlight cushion seams, piping folds, and micro-roughness in the woven linen upholstery, avoiding unrealistic polygonal flatness.</p>\
<img src='/images/projects/3d-room-environment-interior-living-room-08.webp' alt='Macro perspective of sofa fabric texture, throw pillows, and woven blanket details' style='width:100%; border-radius:12px; margin:20px 0 32px 0;' />\
\
<h3 style='font-size: 1.25rem; font-weight: 700; margin-top: 36px; color: var(--vb-text);'>09. Parquet Hardwood Reflectivity & Specular Depth</h3>\
<p style='text-align: justify; margin-top: 12px;'>The floor material uses high-resolution diffuse, roughness, and normal maps to capture individual plank bevels and realistic grazing-angle Fresnel reflections.</p>\
<img src='/images/projects/3d-room-environment-interior-living-room-09.webp' alt='Grazing angle perspective showing specular reflections along polished parquet hardwood floor' style='width:100%; border-radius:12px; margin:20px 0 32px 0;' />\
\
<h3 style='font-size: 1.25rem; font-weight: 700; margin-top: 36px; color: var(--vb-text);'>10. Interior Dressing, Books & Decor Props</h3>\
<p style='text-align: justify; margin-top: 12px;'>Coffee table art books, ceramic vases, potted succulents, and reading accessories breathe life into the domestic setting, reinforcing the lived-in concept.</p>\
<img src='/images/projects/3d-room-environment-interior-living-room-10.webp' alt='Coffee table prop staging with ceramic vase, magazines, and decorative home accessories' style='width:100%; border-radius:12px; margin:20px 0 32px 0;' />\
\
<h3 style='font-size: 1.25rem; font-weight: 700; margin-top: 36px; color: var(--vb-text);'>11. Ceiling Geometry, Cove Lighting & AC Vents</h3>\
<p style='text-align: justify; margin-top: 12px;'>False ceiling tiers incorporate perimeter LED light coves and flush HVAC linear diffusers modeled with exact mechanical clearances.</p>\
<img src='/images/projects/3d-room-environment-interior-living-room-11.webp' alt='Upward camera angle showing false ceiling multi-tier geometry and recessed linear lighting' style='width:100%; border-radius:12px; margin:20px 0 32px 0;' />\
\
<h3 style='font-size: 1.25rem; font-weight: 700; margin-top: 36px; color: var(--vb-text);'>12. Low-Angle Cinematic Perspective</h3>\
<p style='text-align: justify; margin-top: 12px;'>A low camera height emphasizes spatial grandeur, showcasing how the light bounces upward from the floor into the ceiling coffers.</p>\
<img src='/images/projects/3d-room-environment-interior-living-room-12.webp' alt='Dramatic low-angle cinematic perspective across the living room area rug' style='width:100%; border-radius:12px; margin:20px 0 32px 0;' />\
\
<h3 style='font-size: 1.25rem; font-weight: 700; margin-top: 36px; color: var(--vb-text);'>13. Wall Art, Sconces & Accent Illumination</h3>\
<p style='text-align: justify; margin-top: 12px;'>Framed artwork on feature walls is highlighted by dedicated accent spotlights, creating vertical rhythm and visual interest across expansive plaster surfaces.</p>\
<img src='/images/projects/3d-room-environment-interior-living-room-13.webp' alt='Feature wall artwork illuminated by directional accent spotlights and modern wall sconces' style='width:100%; border-radius:12px; margin:20px 0 32px 0;' />\
\
<h3 style='font-size: 1.25rem; font-weight: 700; margin-top: 36px; color: var(--vb-text);'>14. Sheer Curtain Translucency & Light Scattering</h3>\
<p style='text-align: justify; margin-top: 12px;'>Floor-length window drapes utilize thin-walled two-sided translucency shaders, softly diffusing harsh midday sunlight into gentle interior ambient fill.</p>\
<img src='/images/projects/3d-room-environment-interior-living-room-14.webp' alt='Subsurface scattering and soft light transmission through sheer window curtains' style='width:100%; border-radius:12px; margin:20px 0 32px 0;' />\
\
<h3 style='font-size: 1.25rem; font-weight: 700; margin-top: 36px; color: var(--vb-text);'>15. Architectural Layout & Circulation Zones</h3>\
<p style='text-align: justify; margin-top: 12px;'>A diagonal viewing axis confirms that human movement pathways between the entrance, living room, dining zone, and kitchen remain completely unobstructed.</p>\
<img src='/images/projects/3d-room-environment-interior-living-room-15.webp' alt='Diagonal architectural walkthrough view demonstrating circulation pathways and spatial layout' style='width:100%; border-radius:12px; margin:20px 0 32px 0;' />\
\
<h3 style='font-size: 1.25rem; font-weight: 700; margin-top: 36px; color: var(--vb-text);'>16. Master Color-Graded Interior Portfolio Showcase</h3>\
<p style='text-align: justify; margin-top: 12px;'>The final render brings all spatial components, narrative cues, and lighting layers together into a cohesive photorealistic architectural visualization portfolio piece.</p>\
<img src='/images/projects/3d-room-environment-interior-living-room-16.webp' alt='Comprehensive photorealistic architectural visualization showcase of modern 3D room interior' style='width:100%; border-radius:12px; margin:20px 0 32px 0;' />",
    thumbnail: "/images/projects/3d-room-environment-interior-living-room-01.webp",
    images: [
        "/images/projects/3d-room-environment-interior-living-room-01.webp",
        "/images/projects/3d-room-environment-interior-living-room-02.webp",
        "/images/projects/3d-room-environment-interior-living-room-03.webp",
        "/images/projects/3d-room-environment-interior-living-room-04.webp",
        "/images/projects/3d-room-environment-interior-living-room-05.webp",
        "/images/projects/3d-room-environment-interior-living-room-06.webp",
        "/images/projects/3d-room-environment-interior-living-room-07.webp",
        "/images/projects/3d-room-environment-interior-living-room-08.webp",
        "/images/projects/3d-room-environment-interior-living-room-09.webp",
        "/images/projects/3d-room-environment-interior-living-room-10.webp",
        "/images/projects/3d-room-environment-interior-living-room-11.webp",
        "/images/projects/3d-room-environment-interior-living-room-12.webp",
        "/images/projects/3d-room-environment-interior-living-room-13.webp",
        "/images/projects/3d-room-environment-interior-living-room-14.webp",
        "/images/projects/3d-room-environment-interior-living-room-15.webp",
        "/images/projects/3d-room-environment-interior-living-room-16.webp"
    ],
    tags: [
        "3ds Max",
        "Interior Design",
        "3D Environment Art",
        "Lighting & Rendering",
        "Architectural Visualization",
        "Hard Surface Modeling"
    ],
    date: "2024-03-10",
    seo: {
        keywords: [
            "Md Rakibujjaman Adib",
            "Realistic 3D Room Environment Design",
            "3ds Max interior rendering",
            "living dining 3D visualization",
            "architectural visualization portfolio",
            "3D interior lighting 3ds Max"
        ],
        meta: [
            { name: "author", content: "Md Rakibujjaman Adib" },
            {
                name: "title",
                content: "Realistic 3D Room Environment Design | 3ds Max Interior by Md Rakibujjaman Adib"
            },
            {
                name: "description",
                content: "First comprehensive 3ds Max interior assignment by Md Rakibujjaman Adib. Modeled, textured, and lit entirely solo, featuring a warm living and dining space."
            }
        ]
    }
};

export default project;
