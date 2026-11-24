import type { Project } from '../projects.ts';

const project: Project = {
  id: "vray-volumetric-godray-flower-vase",
  title: "Volumetric God-Ray Lighting & Caustics – Flower Vase Study",
  shortTitle: "V-Ray God-Rays Study",
  category: "3D",
  featured: false,
  role: "Lighting & Rendering Artist",
  summary: "An optical lighting study in Chaos V-Ray capturing atmospheric god-rays, participating media aerial perspective, and delicate glass caustics through an interior aperture.",
  description: "<p style='text-align: justify;'>Volumetric lighting occurs when high-intensity directional light passes through atmospheric participating media—such as dust, vapor, or mist—revealing radiant shafts of light known as crepuscular rays or 'god rays'. This optical study was created in Chaos V-Ray to investigate how directional sunlight interacts with interior window geometry, translucent glass, and floral silhouettes.</p>\
<p style='text-align: justify; margin-top: 30px;'><b>Volumetric Scattering & Environmental Fog:</b> Using VRayEnvironmentFog paired with a high-intensity directional V-Ray Sun, light rays were shaped as they penetrated the window opening. Tuning the fog scattering coefficient and phase function produced well-defined luminous beams that maintain crisp edges without washing out shadow contrast across the table surface.</p>\
<p style='text-align: justify; margin-top: 30px;'><b>Glass Refraction & Botanical Shading:</b> The central flower vase features a complex dielectric glass material with realistic index of refraction (IOR 1.52) and subtle dispersion. Delicate flower petals and foliage utilize double-sided thin translucency (subsurface scattering), allowing the radiant sunbeams to back-illuminate petal veins with natural warmth and vitality.</p>",
  thumbnail: "/images/projects/Vray Godreay Lighting Flower Vace  (1).jpg",
  thumbnails: [
    "/images/projects/Vray Godreay Lighting Flower Vace  (1).jpg",
    "/images/projects/Vray Godreay Lighting Flower Vace  (2).jpg",
    "/images/projects/Vray Godreay Lighting Flower Vace  (3).jpg",
    "/images/projects/Vray Godreay Lighting Flower Vace  (1).png"
  ],
  images: [
    "/images/projects/Vray Godreay Lighting Flower Vace  (1).jpg",
    "/images/projects/Vray Godreay Lighting Flower Vace  (2).jpg",
    "/images/projects/Vray Godreay Lighting Flower Vace  (3).jpg",
    "/images/projects/Vray Godreay Lighting Flower Vace  (1).png"
  ],
  tags: [
    "Chaos V-Ray",
    "Volumetric Lighting",
    "God Rays",
    "Environment Fog",
    "Interior Lighting",
    "Glass Caustics",
    "3D Still Life"
  ],
  date: "2024-04-28",
  seo: {
    keywords: [
      "Md Rakibujjaman Adib",
      "V-Ray god ray lighting study",
      "volumetric light beams V-Ray",
      "VRayEnvironmentFog tutorial",
      "flower vase 3D lighting render",
      "glass caustics and translucency"
    ],
    meta: [
      { name: "author", content: "Md Rakibujjaman Adib" },
      {
        name: "title",
        content: "Volumetric God-Ray Lighting & Caustics – Flower Vase Study | Md Rakibujjaman Adib"
      },
      {
        name: "description",
        content: "Optical study in Chaos V-Ray demonstrating volumetric god-rays, environmental fog, and glass refraction on an interior flower vase by Md Rakibujjaman Adib."
      },
      {
        property: "og:image",
        content: "/images/projects/Vray Godreay Lighting Flower Vace  (1).jpg"
      }
    ]
  }
};

export default project;
