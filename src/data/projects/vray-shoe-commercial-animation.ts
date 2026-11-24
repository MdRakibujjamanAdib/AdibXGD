import type { Project } from '../projects.ts';

const project: Project = {
  id: "vray-shoe-commercial-animation",
  title: "Commercial Footwear 3D Visualization & V-Ray Animation",
  shortTitle: "V-Ray Shoe Animation",
  category: "3D",
  featured: false,
  cardRatio: "square",
  role: "3D Product Modeler, Lighting & Rendering Artist",
  summary: "Debut academic milestone in commercial 3D footwear product visualization, modeling, and studio turntable lighting authored in 3ds Max and rendered with Chaos V-Ray.",
  description: "<p style='text-align: justify;'>Marking the artist's first official assignment in commercial 3D product visualization and lighting, this project showcases high-end athletic footwear modeled with industrial design accuracy. The goal was to replicate commercial advertising standards by combining millimeter-accurate geometry with multi-point studio lighting and turntable camera motion.</p>\
<p style='text-align: justify; margin-top: 30px;'><b>Product Geometry & Multi-Material Construction:</b> The sneaker assembly was constructed across multiple functional components: the sculpted foam midsole with ergonomic shock pods, textured rubber tread outsole, breathable mesh vamp, synthetic leather overlays, and laced eyelet stays. Subdivided topology ensures smooth, artifact-free highlights across tight bevels and flowing organic stitch lines.</p>\
<p style='text-align: justify; margin-top: 30px;'><b>Studio Lighting & Turntable Animation:</b> The asset is illuminated using a three-point studio lighting rig in Chaos V-Ray—balancing a dominant high-key keylight, soft fill bounce, and a razor-sharp rim/edge light to accentuate the silhouette against a clean dark backdrop. The turntable animation highlights material anisotropy, fabric roughness, and specular sheen as the footwear rotates in space.</p>",
  thumbnail: "/images/projects/vray-shoe-commercial-animation-thumbnail.png",
  thumbnails: [
    "/images/projects/vray-shoe-commercial-animation-thumbnail.png",
    "/images/projects/vray-shoe-commercial-turntable-preview.png"
  ],
  images: [
    "/images/projects/vray-shoe-commercial-animation-thumbnail.png",
    "/images/projects/vray-shoe-commercial-turntable-preview.png"
  ],
  videoUrl: "/images/projects/vray-shoe-commercial-product-animation.mp4",
  tags: [
    "3ds Max",
    "Chaos V-Ray",
    "Product Visualization",
    "Commercial Animation",
    "Studio Lighting",
    "Footwear Design",
    "Turntable"
  ],
  date: "2024-02-14",
  seo: {
    keywords: [
      "Md Rakibujjaman Adib",
      "V-Ray Shoe Commercial Animation",
      "3D footwear product visualization",
      "3ds Max sneaker modeling",
      "Chaos V-Ray studio lighting",
      "commercial 3D turntable animation"
    ],
    meta: [
      { name: "author", content: "Md Rakibujjaman Adib" },
      {
        name: "title",
        content: "Commercial Footwear 3D Visualization & V-Ray Animation | Md Rakibujjaman Adib"
      },
      {
        name: "description",
        content: "Debut commercial 3D footwear product visualization and turntable animation in 3ds Max and Chaos V-Ray by Md Rakibujjaman Adib."
      },
      {
        property: "og:image",
        content: "/images/projects/vray-shoe-commercial-turntable-preview.png"
      }
    ]
  }
};

export default project;
