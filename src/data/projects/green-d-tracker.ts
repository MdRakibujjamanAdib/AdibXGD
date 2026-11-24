import type { Project } from '../projects.ts';

const project: Project = {
    id: "green-d-web",
    title: "Green D – AI Carbon Footprint Tracker",
    shortTitle: "Green D Home",
    category: "Web & Automation",
    role: "Full Stack Developer",
    featured: true,
    featuredOrder: 2,
    summary: "A full-stack sustainability platform combining IoT energy monitoring, carbon tracking, smart home optimization, receipt-based emission analysis, and AI-powered eco insights.",
    description: "<p style='text-align: justify;'><b>Green D Smart Home & AI Carbon Footprint Tracker</b> is a full-stack sustainability web platform designed to help individuals and smart households measure, understand, and reduce their environmental impact. The platform unifies edge IoT power metering, optical character recognition (OCR) of utility bills, AI-based forecasting, and automated emission modeling into an actionable engineering feedback loop.</p>\
\
<h3 style='font-size: 1.25rem; font-weight: 700; margin-top: 36px; color: var(--vb-text);'>01. Ecosystem Architecture & Smart Home Ingress</h3>\
<p style='text-align: justify; margin-top: 12px;'>The central web application coordinates real-time telemetry streaming from household smart sensors, offering a unified portal for instant ecological feedback. Users gain immediate visibility into their home's power consumption metrics, active carbon debt, and climate forecasting.</p>\
<img src='/images/projects/green-d-carbon-tracker-home.webp' alt='Green D IoT smart home carbon tracker application homepage and telemetry ingress' style='width:100%; border-radius:12px; margin:20px 0 32px 0;' />\
\
<h3 style='font-size: 1.25rem; font-weight: 700; margin-top: 36px; color: var(--vb-text);'>02. Personalized Sustainability Dashboard & AI Forecasting</h3>\
<p style='text-align: justify; margin-top: 12px;'>The main dashboard calculates an aggregate sustainability index, displays predictive AI carbon trajectory curves for the upcoming week, and visualizes historical power consumption curves. Integrated weather telemetry contextualizes energy spikes caused by cooling or heating demands.</p>\
<img src='/images/projects/greend-dashboard.webp' alt='Green D carbon footprint dashboard with sustainability score and AI carbon forecast' style='width:100%; border-radius:12px; margin:20px 0 32px 0;' />\
\
<h3 style='font-size: 1.25rem; font-weight: 700; margin-top: 36px; color: var(--vb-text);'>03. Utility Receipt OCR Parsing & Automatic Emission Calculation</h3>\
<p style='text-align: justify; margin-top: 12px;'>To eliminate manual survey entry, users scan electricity bills, fuel slips, or grocery receipts. An optical character recognition (OCR) pipeline parses kilowatt-hours (kWh) and liters of fuel, dynamically multiplying them against regional grid emission factors to calculate exact kilograms of CO2 equivalent.</p>\
<img src='/images/projects/greend-receipt.webp' alt='Green D receipt upload interface for automated OCR carbon emission analysis' style='width:100%; border-radius:12px; margin:20px 0 32px 0;' />\
\
<h3 style='font-size: 1.25rem; font-weight: 700; margin-top: 36px; color: var(--vb-text);'>04. Device-Level IoT Power Monitoring & Circuit Simulation</h3>\
<p style='text-align: justify; margin-top: 12px;'>The Smart Home module interfaces with device-level telemetry, allowing granular control over lights, climate control, and appliances. Real-time carbon rate counters help homeowners identify inefficient vampire loads and schedule power-heavy cycles during off-peak hours.</p>\
<img src='/images/projects/greend-smart-home.webp' alt='Green D smart home interface with device control and carbon emission tracking' style='width:100%; border-radius:12px; margin:20px 0 32px 0;' />\
\
<h3 style='font-size: 1.25rem; font-weight: 700; margin-top: 36px; color: var(--vb-text);'>05. Green Maps & Low-Carbon Geospatial Route Planning</h3>\
<p style='text-align: justify; margin-top: 12px;'>An integrated geospatial routing engine models transit carbon costs. Explorers compare walking, cycling, public transit, and electric vehicle options, routing through lower-emission pathways and earning eco-credits for sustainable commuting choices.</p>\
<img src='/images/projects/greend-maps.webp' alt='Green D green maps route planner for low carbon travel options' style='width:100%; border-radius:12px; margin:20px 0 32px 0;' />\
\
<p style='text-align: justify; margin-top: 24px;'>Green D demonstrates expertise in frontend architecture, full-stack state management, edge IoT data ingestion, and sustainability data modeling to create a scalable digital climate solution.</p>",
    thumbnail: "/images/projects/green-d-carbon-tracker-home.webp",
    images: [
        "/images/projects/green-d-carbon-tracker-home.webp",
        "/images/projects/greend-dashboard.webp",
        "/images/projects/greend-receipt.webp",
        "/images/projects/greend-smart-home.webp",
        "/images/projects/greend-maps.webp"
    ],
    demoUrl: "https://greend.vercel.app/",
    tags: [
        "IoT",
        "IoT Telemetry",
        "Smart Home Integration",
        "React",
        "Full Stack Development",
        "Carbon Footprint Tracker",
        "SaaS Platform",
        "Data Visualization",
        "Sustainability Tech",
        "Dashboard Architecture"
    ],
    date: "2024-02-23",
    seo: {
        keywords: [
            "Md Rakibujjaman Adib",
            "carbon footprint tracker web app",
            "AI sustainability dashboard",
            "smart home energy monitoring app",
            "receipt carbon emission calculator",
            "green route planner Bangladesh",
            "full stack sustainability platform",
            "eco tracking SaaS application",
            "React dashboard carbon tracking",
            "environmental impact management system"
        ],
        meta: [
            { name: "author", content: "Md Rakibujjaman Adib" },
            {
                name: "title",
                content: "Green D – AI Carbon Footprint Tracker Web Application | Md Rakibujjaman Adib"
            },
            {
                name: "description",
                content:
                    "Green D is a full-stack sustainability web application featuring AI carbon forecasting, smart home energy optimization, receipt-based emission tracking, and eco-friendly route planning."
            },
            {
                name: "keywords",
                content:
                    "Md Rakibujjaman Adib, carbon footprint tracker, sustainability dashboard, smart home carbon monitoring, receipt emission calculator, green travel planner, full stack web development"
            },
            {
                property: "article:published_time",
                content: "2024-02-23T00:00:00Z"
            },
            {
                property: "og:title",
                content: "Green D – AI Carbon Footprint Tracker"
            },
            {
                property: "og:description",
                content:
                    "A scalable sustainability platform combining AI insights, smart home monitoring, carbon tracking, and eco-friendly route optimization."
            },
            {
                property: "og:type",
                content: "website"
            },
            {
                property: "og:url",
                content: "https://greend.vercel.app/"
            }
        ]
    }
};

export default project;