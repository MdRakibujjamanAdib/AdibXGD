export interface ServiceItem {
  id: string;
  title: string;
  category: 'AI & Automation' | 'Web & Fullstack' | 'UI/UX Design' | '3D & Motion' | 'Branding & Identity';
  description: string;
  deliverables?: string[];
}

export const SERVICE_CATEGORIES = [
  'All',
  'AI & Automation',
  'Web & Fullstack',
  'UI/UX Design',
  '3D & Motion',
  'Branding & Identity',
] as const;

export type ServiceCategory = (typeof SERVICE_CATEGORIES)[number];

export const allServices: ServiceItem[] = [
  // 1. AI & Automation
  {
    id: 'ai-agents-workflows',
    title: 'Autonomous AI Agents & Workflows',
    category: 'AI & Automation',
    description: 'Custom multi-agent architectures, LLM automation pipelines, and background job orchestration.',
    deliverables: ['Custom agent design', 'Automated trigger flows', 'Error-resilient execution'],
  },
  {
    id: 'rag-vector-search',
    title: 'Retrieval-Augmented Generation (RAG)',
    category: 'AI & Automation',
    description: 'Enterprise knowledge base retrieval, semantic search, vector embeddings, and contextual responses.',
    deliverables: ['Vector database setup', 'Document chunking & indexing', 'Contextual prompt tuning'],
  },
  {
    id: 'api-cloud-integrations',
    title: 'API & Webhook Automations',
    category: 'AI & Automation',
    description: 'Seamless data synchronization across CRMs, payment gateways, custom webhooks, and cloud platforms.',
    deliverables: ['Real-time webhook handlers', 'CRM & payment sync', 'Automated event alerts'],
  },
  {
    id: 'doc-form-processing',
    title: 'Intelligent Document & Data Processing',
    category: 'AI & Automation',
    description: 'Automated OCR extraction, invoice parsing, form field structuring, and data ingestion.',
    deliverables: ['OCR pipelines', 'JSON structure mapping', 'Validation rules'],
  },
  {
    id: 'cicd-automation',
    title: 'Automated CI/CD & Deployments',
    category: 'AI & Automation',
    description: 'Automated testing suites, staging pipelines, container builds, and zero-downtime releases.',
    deliverables: ['GitHub Actions workflows', 'Docker containerization', 'Automated health checks'],
  },

  // 2. Web & Fullstack
  {
    id: 'custom-web-apps',
    title: 'Custom Web Application Development',
    category: 'Web & Fullstack',
    description: 'High-performance applications built with React, Next.js, TypeScript, and modern headless architectures.',
    deliverables: ['Component-driven architecture', 'Strict TypeScript typing', 'Optimized bundle size'],
  },
  {
    id: 'interactive-landing-pages',
    title: 'Interactive High-Converting Landing Pages',
    category: 'Web & Fullstack',
    description: 'Fluid Framer-grade micro-interactions, scroll choreography, responsive layouts, and lightning speed.',
    deliverables: ['Motion orchestration', 'Lighthouse 95+ score', 'Mobile responsive polish'],
  },
  {
    id: 'ecommerce-checkouts',
    title: 'E-Commerce & Stripe Checkout Systems',
    category: 'Web & Fullstack',
    description: 'Frictionless checkout experiences, secure payment gateways, recurring subscriptions, and cart logic.',
    deliverables: ['Stripe payment intents', 'Webhook fulfillment', 'Custom checkout UI'],
  },
  {
    id: 'backend-api-architecture',
    title: 'Backend & REST / GraphQL APIs',
    category: 'Web & Fullstack',
    description: 'Scalable backend services, resilient database schemas, authentication (OAuth/JWT), and rate limiting.',
    deliverables: ['Database schemas (PostgreSQL/MongoDB)', 'API documentation', 'Auth & security'],
  },
  {
    id: 'performance-seo-optimization',
    title: 'Web Performance & Technical SEO',
    category: 'Web & Fullstack',
    description: 'Core Web Vitals tuning, dynamic OpenGraph cards, structured JSON-LD data, and asset optimization.',
    deliverables: ['Speed index acceleration', 'SEO sitemap & meta', 'Responsive image pipeline'],
  },

  // 3. UI/UX Design
  {
    id: 'end-to-end-product-design',
    title: 'End-to-End Product UI/UX Design',
    category: 'UI/UX Design',
    description: 'User-centered digital products from initial user research and wireframing to high-fidelity Figma files.',
    deliverables: ['User journey maps', 'Wireframes & flows', 'Complete Figma design files'],
  },
  {
    id: 'design-systems',
    title: 'Scalable Multi-Theme Design Systems',
    category: 'UI/UX Design',
    description: 'Modular tokenized design systems with typography scales, color palettes, and accessible component states.',
    deliverables: ['Design token tokens', 'Atomic component library', 'Dark & light mode rules'],
  },
  {
    id: 'interactive-prototyping',
    title: 'Interactive High-Fidelity Prototyping',
    category: 'UI/UX Design',
    description: 'Clickable interactive Figma & web prototypes complete with micro-interaction specs and transitions.',
    deliverables: ['Clickable prototypes', 'Micro-interaction specs', 'Developer handoff documentation'],
  },
  {
    id: 'dashboard-saas-ui',
    title: 'SaaS Platform & Analytics Dashboards',
    category: 'UI/UX Design',
    description: 'Intuitive data visualization interfaces, dense data tables, customizable filters, and settings views.',
    deliverables: ['Chart & metric components', 'Data table pagination & filters', 'Role-based view designs'],
  },
  {
    id: 'ux-auditing',
    title: 'UX Audits & Conversion Optimization',
    category: 'UI/UX Design',
    description: 'Heuristic evaluation, identifying conversion drop-offs, accessibility checks, and UX remediation.',
    deliverables: ['UX teardown report', 'Actionable redesign recommendations', 'WCAG accessibility review'],
  },

  // 4. 3D & Motion
  {
    id: '3d-product-visualization',
    title: '3D Product Visualization & CGI',
    category: '3D & Motion',
    description: 'Photorealistic studio lighting, material physics, and high-resolution rendering using Blender & V-Ray.',
    deliverables: ['Multi-angle 4K renders', 'Realistic material shaders', 'Clean transparent cutouts'],
  },
  {
    id: 'interactive-webgl-3d',
    title: 'Interactive WebGL & 3D Experiences',
    category: '3D & Motion',
    description: 'Real-time 3D models embedded on the web with interactive camera orbits, lighting shifts, and shaders.',
    deliverables: ['Three.js / WebGL integration', 'Optimized GLTF/GLB assets', 'Mobile-optimized draw calls'],
  },
  {
    id: 'architectural-walkthroughs',
    title: 'Architectural & Environment Walkthroughs',
    category: '3D & Motion',
    description: 'Detailed spatial 3D environments, animated camera choreography, realistic atmospheric effects, and lighting.',
    deliverables: ['Flythrough camera animation', 'Atmospheric lighting & fog', 'Full HD/4K video export'],
  },
  {
    id: 'motion-graphics-explainers',
    title: 'Motion Graphics & Explainer Visuals',
    category: '3D & Motion',
    description: 'Kinetic typography, animated vector assets, and visual storytelling for product launches and campaigns.',
    deliverables: ['Motion graphics clips', 'Kinetic typography templates', 'Lottie web exports'],
  },
  {
    id: 'logo-brand-animations',
    title: 'Signature Logo & Brand Mark Animations',
    category: '3D & Motion',
    description: 'Memorable brand reveals, looping UI marks, and micro-animated icon sets optimized for the web.',
    deliverables: ['Looping vector animations', 'Lottie / JSON assets', 'Transparent video overlays'],
  },

  // 5. Branding & Identity
  {
    id: 'visual-identity-systems',
    title: 'Complete Visual Identity Systems',
    category: 'Branding & Identity',
    description: 'Signature logomarks, typography rules, color chemistry, and distinct brand guidelines that stand out.',
    deliverables: ['Primary & secondary logomarks', 'Curated font pairings', 'Brand color system'],
  },
  {
    id: 'brand-guidelines',
    title: 'Comprehensive Brand Books & Style Guides',
    category: 'Branding & Identity',
    description: 'Exhaustive rules for logo usage, safe spacing, responsive lockups, tone of voice, and visual do’s & don’ts.',
    deliverables: ['PDF Brand Book', 'Figma brand toolkit', 'Exportable vector logo package'],
  },
  {
    id: 'social-media-design-kits',
    title: 'Multi-Platform Social Media Kits',
    category: 'Branding & Identity',
    description: 'Cohesive templates for Instagram, LinkedIn, Twitter/X, and YouTube, engineered for maximum engagement.',
    deliverables: ['Figma template library', 'Custom post & story layouts', 'Banner & header lockups'],
  },
  {
    id: 'marketing-collateral',
    title: 'Marketing Collateral & Print Assets',
    category: 'Branding & Identity',
    description: 'High-res pitch decks, business stationery, event badges, and branded packaging ready for production.',
    deliverables: ['Vector print-ready files (CMYK)', 'Pitch deck slide decks', 'Stationery mockups'],
  },
];
