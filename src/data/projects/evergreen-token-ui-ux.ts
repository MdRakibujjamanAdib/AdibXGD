import type { Project } from '../projects.ts';

const project: Project = {
    id: "evergreen-token-ui-ux",
    title: "EverGreen Token – Gamified Plastic Recycling & Sustainability UI/UX",
    shortTitle: "EverGreen Token",
    category: "UI/UX Design",
    featured: false,
    role: "Product & UI/UX Designer",
    summary: "Reward-driven Mixed Reality & mobile application UI/UX designed in Figma, transforming urban plastic cleanup into an interactive gamified quest with redeemable token incentives.",
    description: "<p style='text-align: justify;'><b>EverGreen Token</b> is an academic and product design case study created at Daffodil International University (Department of Multimedia & Creative Technology) by Md Rakibujjaman Adib. It reimagines urban environmental cleanup as an immersive, real-world Mixed Reality adventure for smart glasses and mobile devices, turning discarded plastic waste into valuable digital tokens redeemable across retail partner networks.</p>\
\
<p style='text-align: justify; margin-top: 30px;'><b>Problem Identification & Behavioral Barriers:</b> The global plastic waste crisis is escalating, yet public participation in recycling remains critically low. Research indicates this is not due to a lack of public awareness, but to fundamental behavioral friction. Traditional recycling is often perceived as an inconvenient, unrewarding task detached from immediate incentives. EverGreen Token addresses this disconnect by converting physical environmental action into tangible digital assets redeemable across brand partner networks.</p>\
\
<p style='text-align: justify; margin-top: 30px;'><b>Theoretical & Human-Computer Interaction (HCI) Foundations:</b> The UX architecture is rooted in established cognitive learning and HCI paradigms:<ul>\
<li style='margin-top: 10px;'><b>Operant Conditioning (Skinner, 1953):</b> The core loop pairs the stimulus (detecting recyclable plastic) with physical action (collecting and depositing) and immediate positive reinforcement (earning Green Tokens), engineering a self-reinforcing sustainable habit loop.</li>\
<li style='margin-top: 10px;'><b>Dual Cognitive Modes (Norman, 1993):</b> Supports <i>Experiential Cognition</i> through an effortless AR 'treasure hunt' HUD, alongside <i>Reflective Cognition</i> via deep personal impact analytics, carbon offset graphs, and community leaderboards.</li>\
<li style='margin-top: 10px;'><b>GOMS & ARCS Motivation Models:</b> GOMS task analysis minimizes procedural friction to an effortless 'Scan-Collect-Deposit' flow, while Keller's ARCS framework sustains intrinsic motivation through Attention, Relevance, Confidence, and Satisfaction.</li>\
</ul></p>\
\
<h3 style='font-size: 1.25rem; font-weight: 700; margin-top: 40px; color: var(--vb-text);'>01. Spatial Computing Ecosystem & OS Integration</h3>\
<p style='text-align: justify; margin-top: 12px;'>The application is conceived as a native spatial experience optimized for lightweight smart glasses and spatial operating systems. The system-level app launcher integrates seamlessly into the user's physical field of view, positioning the EverGreen Token client directly alongside everyday productivity and communication tools.</p>\
<img src='/images/projects/evergreen-token-ui-ux-design-screen-03.webp' alt='EverGreen Token native icon on spatial computing app launcher grid in outdoor environment' style='width:100%; border-radius:12px; margin:20px 0 32px 0;' />\
\
<h3 style='font-size: 1.25rem; font-weight: 700; margin-top: 40px; color: var(--vb-text);'>02. First-Time User Experience (FTUX) & Onboarding Sequence</h3>\
<p style='text-align: justify; margin-top: 12px;'>To lower cognitive friction, onboarding is structured as a clear, three-stage progressive disclosure walkthrough. The welcoming screen immediately presents the value proposition, reinforcing that everyday waste cleanup is directly rewarded through tangible digital value.</p>\
<img src='/images/projects/evergreen-token-ui-ux-design-screen-07.webp' alt='EverGreen Token welcoming onboarding screen explaining environmental reward concept' style='width:100%; border-radius:12px; margin:20px 0 32px 0;' />\
\
<p style='text-align: justify; margin-top: 24px;'><b>Step 2 — Scan & Recycle:</b> The second onboarding stage demystifies the physical deposit loop. Users are introduced to the smart reverse-vending machines and automated QR verification system that securely logs deposited materials into the decentralized token ledger.</p>\
<img src='/images/projects/evergreen-token-ui-ux-design-screen-08.webp' alt='EverGreen Token onboarding step 2 illustrating QR scanning and recycling deposit bins' style='width:100%; border-radius:12px; margin:20px 0 32px 0;' />\
\
<p style='text-align: justify; margin-top: 24px;'><b>Step 3 — Redeem Rewards:</b> The final onboarding modal closes the motivation loop by explaining the dual-token economy. Collected recyclable items earn Yellow Pending Tokens that convert into verified Green Tokens (GT), redeemable for food, tech discounts, and transit benefits.</p>\
<img src='/images/projects/evergreen-token-ui-ux-design-screen-09.webp' alt='EverGreen Token onboarding step 3 explaining token redemption and partner discounts' style='width:100%; border-radius:12px; margin:20px 0 32px 0;' />\
\
<h3 style='font-size: 1.25rem; font-weight: 700; margin-top: 40px; color: var(--vb-text);'>03. Spatial Authentication & Virtual 3D Keyboard Ergonomics</h3>\
<p style='text-align: justify; margin-top: 12px;'>For account management and security, the interface deploys a floating frosted-glass authentication window in the user's primary field of view. A specialized spatial virtual keyboard floats comfortably at arm's reach, offering predictive text suggestions and generous touch/gaze targets designed to eliminate input fatigue.</p>\
<img src='/images/projects/evergreen-token-ui-ux-design-screen-05.webp' alt='EverGreen Token spatial login modal with floating virtual 3D keyboard in physical environment' style='width:100%; border-radius:12px; margin:20px 0 32px 0;' />\
\
<h3 style='font-size: 1.25rem; font-weight: 700; margin-top: 40px; color: var(--vb-text);'>04. Central Explorer Dashboard & Real-Time Impact Telemetry</h3>\
<p style='text-align: justify; margin-top: 12px;'>The main dashboard aggregates personal sustainability metrics into actionable feedback loops. Users see their real-time Green Token balance, active gamified quests (such as the 'Weekend Warrior' recycling goal), pending deposit authorizations, and weekly environmental savings—quantified in kilograms of CO2 avoided, grams of plastic recovered, and liters of water conserved.</p>\
<img src='/images/projects/evergreen-token-ui-ux-design-screen-04.webp' alt='EverGreen Token spatial dashboard showing user token balance, quest progress, and carbon telemetry' style='width:100%; border-radius:12px; margin:20px 0 32px 0;' />\
\
<h3 style='font-size: 1.25rem; font-weight: 700; margin-top: 40px; color: var(--vb-text);'>05. Computer Vision AR Detection & Holographic Gamification</h3>\
<p style='text-align: justify; margin-top: 12px;'>The standout feature of EverGreen Token is its real-time spatial computer vision engine. When scanning physical spaces such as campus grounds or parks, discarded plastic bottles are detected and highlighted with glowing holographic 'treasure chest' overlays. A social Green Leaderboard floats in the user's peripheral field of view, fostering friendly competition with peers.</p>\
<img src='/images/projects/evergreen-token-ui-ux-design-screen-10.webp' alt='Real-world AR plastic detection highlighting discarded bottle with glowing holographic treasure chest and leaderboard' style='width:100%; border-radius:12px; margin:20px 0 32px 0;' />\
\
<h3 style='font-size: 1.25rem; font-weight: 700; margin-top: 40px; color: var(--vb-text);'>06. Geospatial Reverse Vending Navigation & Smart ATM Wayfinding</h3>\
<p style='text-align: justify; margin-top: 12px;'>To guide explorers to verified collection points, the application projects geospatial navigation pins onto physical campus architecture (tested across Daffodil International University campus). Spatial markers display distance, live operational status, and community ratings for reverse-vending machines and eco-cafeterias.</p>\
<img src='/images/projects/evergreen-token-ui-ux-design-screen-06.webp' alt='Geospatial AR navigation pins anchored to physical campus buildings for recycling deposit wayfinding' style='width:100%; border-radius:12px; margin:20px 0 32px 0;' />\
\
<h3 style='font-size: 1.25rem; font-weight: 700; margin-top: 40px; color: var(--vb-text);'>07. Sustainable Brand Partner Marketplace & Token Economy</h3>\
<p style='text-align: justify; margin-top: 12px;'>Tokens earned through recycling carry genuine purchasing power. The in-app marketplace connects recyclers with regional commercial partners—including Shwapno superstores, Grameenphone telecommunications, Star Cineplex entertainment, and Walton electronics—creating a viable closed-loop circular economy.</p>\
<img src='/images/projects/evergreen-token-ui-ux-design-screen-01.webp' alt='EverGreen Token brand reward marketplace offering discounts for coffee, groceries, and electronics' style='width:100%; border-radius:12px; margin:20px 0 32px 0;' />\
\
<h3 style='font-size: 1.25rem; font-weight: 700; margin-top: 40px; color: var(--vb-text);'>08. User Profile, Ergonomic Settings & Privacy Architecture</h3>\
<p style='text-align: justify; margin-top: 12px;'>The profile settings module allows explorers to configure spatial notifications, toggle dark mode visual contrast to prevent outdoor eye strain, adjust multilingual localization, and review stringent privacy controls ensuring camera feeds remain on-device during computer vision parsing.</p>\
<img src='/images/projects/evergreen-token-ui-ux-design-screen-02.webp' alt='EverGreen Token user profile and privacy settings modal floating in Mixed Reality space' style='width:100%; border-radius:12px; margin:20px 0 32px 0;' />\
\
<p style='margin-top: 32px; padding: 16px 20px; border-radius: 12px; background: var(--vb-subpanel); border: 1px solid var(--vb-border);'>\
<span style='font-weight: 600; color: var(--vb-text); display: block; margin-bottom: 6px;'>Official Academic Documentation:</span>\
<a href='/images/projects/evergreen-token-academic-research-poster.pdf' target='_blank' rel='noopener noreferrer' style='color:#e62e05; font-weight:600; text-decoration:underline;'>&darr; View &amp; Download Academic Research Poster (PDF)</a>\
</p>",
    thumbnail: "/images/projects/evergreen-token-ui-ux-design-screen-03.webp",
    thumbnails: [
        "/images/projects/evergreen-token-ui-ux-design-screen-03.webp",
        "/images/projects/evergreen-token-ui-ux-design-screen-01.webp",
        "/images/projects/evergreen-token-ui-ux-design-screen-02.webp",
        "/images/projects/evergreen-token-ui-ux-design-screen-04.webp",
        "/images/projects/evergreen-token-ui-ux-design-screen-05.webp",
        "/images/projects/evergreen-token-ui-ux-design-screen-06.webp",
        "/images/projects/evergreen-token-ui-ux-design-screen-07.webp",
        "/images/projects/evergreen-token-ui-ux-design-screen-08.webp",
        "/images/projects/evergreen-token-ui-ux-design-screen-09.webp",
        "/images/projects/evergreen-token-ui-ux-design-screen-10.webp"
    ],
    images: [
        "/images/projects/evergreen-token-ui-ux-design-screen-03.webp",
        "/images/projects/evergreen-token-ui-ux-design-screen-01.webp",
        "/images/projects/evergreen-token-ui-ux-design-screen-02.webp",
        "/images/projects/evergreen-token-ui-ux-design-screen-04.webp",
        "/images/projects/evergreen-token-ui-ux-design-screen-05.webp",
        "/images/projects/evergreen-token-ui-ux-design-screen-06.webp",
        "/images/projects/evergreen-token-ui-ux-design-screen-07.webp",
        "/images/projects/evergreen-token-ui-ux-design-screen-08.webp",
        "/images/projects/evergreen-token-ui-ux-design-screen-09.webp",
        "/images/projects/evergreen-token-ui-ux-design-screen-10.webp"
    ],
    tags: [
        "UI/UX Design",
        "Figma",
        "Gamification",
        "Sustainability",
        "Augmented Reality",
        "Human-Computer Interaction",
        "Mobile App Design",
        "Product Design"
    ],
    date: "2024-09-18",
    seo: {
        keywords: [
            "Md Rakibujjaman Adib",
            "EverGreen Token UI UX",
            "gamified recycling app Figma",
            "sustainability mobile app UI design",
            "augmented reality environmental app",
            "HCI design case study Daffodil International University"
        ],
        meta: [
            { name: "author", content: "Md Rakibujjaman Adib" },
            {
                name: "title",
                content: "EverGreen Token – Gamified Plastic Recycling & Sustainability UI/UX | Md Rakibujjaman Adib"
            },
            {
                name: "description",
                content: "Reward-driven Mixed Reality & mobile application UI/UX designed in Figma, transforming urban plastic cleanup into an interactive gamified quest with redeemable token incentives."
            },
            {
                property: "og:image",
                content: "/images/projects/evergreen-token-ui-ux-design-screen-03.webp"
            }
        ]
    }
};

export default project;
