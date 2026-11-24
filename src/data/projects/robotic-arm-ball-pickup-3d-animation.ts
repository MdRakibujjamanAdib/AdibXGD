import type { Project } from '../projects.ts';

const project: Project = {
  id: "robotic-arm-ball-pickup-3d-animation",
  title: "Robotic Arm Ball Pickup – First 3D Keyframe Animation",
  shortTitle: "Robotic Arm 3D",
  category: "Animation & Motion",
  featured: false,
  role: "3D Modeler & Animator",
  summary: "Debut 3D animation milestone in Autodesk 3ds Max demonstrating mechanical joint hierarchy, forward kinematics (FK), claw grip coordination, and ball handling with realistic mass and weight.",
  description: "<p style='text-align: justify;'>Serving as my foundational milestone in digital 3D animation, this project was authored in Autodesk 3ds Max to explore industrial robotics and keyframed mechanical motion. The sequence centers around an articulated multi-axis robotic arm executing a precision ball retrieval, lift, and placement routine.</p>\
\
<h3 style='font-size: 1.25rem; font-weight: 700; margin-top: 36px; color: var(--vb-text);'>01. Hierarchical Mechanical Rigging & Pivot Alignment</h3>\
<p style='text-align: justify; margin-top: 12px;'>The robotic assembly was constructed from modular hard-surface parts: turntable pedestal, lower boom arm, hydraulic elbow linkages, wrist gimbal, and dual pneumatic gripper claws. Every joint was connected in a strict parent-child transform hierarchy with customized local pivot orientations to avoid rotational gimbal lock.</p>\
<img src='/images/projects/robotic-arm-3d-animation-thumbnail.webp' alt='Articulated robotic arm 3D animation in 3ds Max executing precision ball pickup' style='width:100%; border-radius:12px; margin:20px 0 32px 0;' />\
\
<h3 style='font-size: 1.25rem; font-weight: 700; margin-top: 36px; color: var(--vb-text);'>02. Keyframing Servo-Motor Physics, Mass & Grip Timing</h3>\
<p style='text-align: justify; margin-top: 12px;'>Beyond simple geometry translation, animation curves reflect authentic industrial automation: subtle settling oscillations as heavy metal arms brake to a halt, precise timing between claw contact and ball constraint attachment, and smooth bezier acceleration curves simulating electric servo drives.</p>",
  thumbnail: "/images/projects/robotic-arm-3d-animation-thumbnail.webp",
  thumbnails: [
    "/images/projects/robotic-arm-3d-animation-thumbnail.webp"
  ],
  images: [
    "/images/projects/robotic-arm-3d-animation-thumbnail.webp"
  ],
  videoUrl: "/images/projects/robotic-arm-ball-pickup-3d-animation.mp4",
  tags: [
    "3ds Max",
    "3D Animation",
    "Robotic Arm",
    "Mechanical Rigging",
    "Keyframing",
    "Forward Kinematics",
    "Hard Surface"
  ],
  date: "2023-12-05",
  seo: {
    keywords: [
      "Md Rakibujjaman Adib",
      "Robotic Arm 3D Animation",
      "3ds Max first 3D animation",
      "mechanical arm ball pickup 3ds max",
      "robotic gripper keyframe animation",
      "forward kinematics 3ds max"
    ],
    meta: [
      { name: "author", content: "Md Rakibujjaman Adib" },
      {
        name: "title",
        content: "Robotic Arm Ball Pickup – First 3D Animation | 3ds Max by Md Rakibujjaman Adib"
      },
      {
        name: "description",
        content: "Debut 3D animation milestone in Autodesk 3ds Max by Md Rakibujjaman Adib: an articulated robotic arm performing a precision ball pickup with realistic mechanical timing."
      },
      {
        property: "og:image",
        content: "/images/projects/robotic-arm-3d-animation-thumbnail.webp"
      }
    ]
  }
};

export default project;
