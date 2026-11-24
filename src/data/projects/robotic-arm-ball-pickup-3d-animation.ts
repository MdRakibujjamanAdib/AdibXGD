import type { Project } from '../projects.ts';

const project: Project = {
  id: "robotic-arm-ball-pickup-3d-animation",
  title: "Robotic Arm Ball Pickup – First 3D Keyframe Animation",
  shortTitle: "Robotic Arm 3D Animation",
  category: "Animation & Motion",
  featured: false,
  role: "3D Modeler & Animator",
  summary: "Debut 3D animation milestone in Autodesk 3ds Max demonstrating mechanical joint hierarchy, forward kinematics (FK), claw grip coordination, and ball handling with realistic mass and weight.",
  description: "<p style='text-align: justify;'>Serving as the artist's foundational milestone in digital 3D animation, this project was authored in Autodesk 3ds Max to explore industrial robotics and keyframed mechanical motion. The sequence centers around an articulated multi-axis robotic arm executing a precision ball retrieval, lift, and placement routine.</p>\
<p style='text-align: justify; margin-top: 30px;'><b>Hierarchical Mechanical Rigging & Pivot Alignment:</b> The robotic assembly was designed with modular hard-surface components—turntable base, lower arm beam, upper elbow linkage, wrist rotator, and dual-finger pneumatic gripper. Every segment was linked in a strict parent-child transform hierarchy with customized local pivot orientations to ensure clean single-axis rotation without gimbal anomalies.</p>\
<p style='text-align: justify; margin-top: 30px;'><b>Keyframing Weight, Inertia & Grip Timing:</b> Beyond simply translating geometry, the animation focuses on believable robotic behavior: subtle settling counter-movements as heavy hydraulic joints come to a halt, precise timing between gripper closure and the ball becoming a child of the end effector, and gradual acceleration curves that evoke authentic servo-motor physics.</p>",
  thumbnail: "/images/projects/robotic-arm-3d-animation-thumbnail.png",
  thumbnails: [
    "/images/projects/robotic-arm-3d-animation-thumbnail.png"
  ],
  images: [
    "/images/projects/robotic-arm-3d-animation-thumbnail.png"
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
        content: "/images/projects/robotic-arm-3d-animation-thumbnail.png"
      }
    ]
  }
};

export default project;
