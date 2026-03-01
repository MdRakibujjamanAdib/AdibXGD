import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
    title: string;
    description: string;
    name?: string;
    type?: string;
    image?: string;
    url?: string;
    customKeywords?: string[];
    customMeta?: Array<{ name?: string; property?: string; content: string }>;
}

export default function SEO({
    title,
    description,
    name = "Md Rakibujjaman Adib",
    type = "website",
    image = "https://adibx.me/images/OG%20Image%20of%20Md%20Rakibujjaman%20Adib,%20Designer,%20Web%20Devloper,%203D%20Artist.jpg",
    url = "https://adibx.me",
    customKeywords = [],
    customMeta = []
}: SEOProps) {
    const baseUrl = "https://adibx.me";
    const currentUrl = typeof window !== 'undefined'
        ? window.location.href.replace(/^https?:\/\/www\./, 'https://').split('?')[0].replace(/\/$/, '') || baseUrl
        : url;
    const absoluteImage = image.startsWith('http') ? image : `${baseUrl}${image.startsWith('/') ? '' : '/'}${image}`;

    // Keep title under 60 characters to prevent Google truncation
    const siteTitle = title === "Home"
        ? `${name} | Web Developer & Brand Designer`
        : `${title} | ${name}`;

    // High-impact keywords — Google ASD suggestions + local Dhaka/Bangladesh search
    const keywordArray = [
        // Identity
        "Md Rakibujjaman Adib",
        "Adib",
        // Graphic Design keywords (Google ASD)
        "graphic designer in bangladesh",
        "top graphic designer",
        "menu card designer",
        "graphic designer",
        "graphic artist",
        "find a graphic designer",
        "graphic design artist",
        "professional graphic designer",
        "gfx designer",
        "artwork designer",
        "graphics and design",
        "graphic art designer",
        "graphic design artwork",
        "graphic design specialist",
        "graphic designer art",
        "graphic art and design",
        "it graphic design",
        "designer graphics",
        "dtp design",
        "graphic specialist",
        "publication graphic design",
        "digital graphic designer",
        "graphic design pro",
        "hire freelance graphic designer",
        "graphic design for hire",
        "find freelance designers",
        "hire freelance designers",
        "find a graphic artist",
        "hire a graphic designer freelance",
        "best place to hire graphic designers",
        "best place to find graphic designers",
        // Web Design / Dev keywords (Google ASD)
        "web designer",
        "web developer",
        "web developer and designer",
        "web developer designer",
        "web developer near me",
        "websites designer",
        "brand and web designer",
        "web and brand designer",
        "web developer web designer",
        "web page design",
        "design a website",
        "website developers",
        "designer for website",
        "designer website",
        "web developers",
        "web designer near me",
        "web design services",
        "professional website designer",
        "website design services",
        // Local SEO
        "Web Developer in Dhaka",
        "Graphic Designer in Dhaka",
        "Video Editor in Dhaka",
        "Top Web Developer Bangladesh",
        "Graphic Designer Bangladesh",
        "Web Developer Bangladesh",
        "Web designer Bangladesh",
        "3D Artist Dhaka",
        // Niche / Brand
        "AI Architect",
        "Creative Technologist",
        "Brand identity designer",
        "Visual design",
        "Automation developer",
        "MCT Labs Founder",
        "Green D co-founder",
        ...customKeywords
    ];
    const keywords = keywordArray.join(", ");

    return (
        <Helmet>
            {/* Standard metadata tags */}
            <title>{siteTitle}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />
            <meta name="robots" content="index, follow" />
            <meta name="language" content="en" />
            <meta name="author" content="Md Rakibujjaman Adib" />

            {/* Geo / Local SEO */}
            <meta name="geo.region" content="BD-13" />
            <meta name="geo.placename" content="Dhaka, Bangladesh" />
            <meta name="geo.position" content="23.8103;90.4125" />
            <meta name="ICBM" content="23.8103, 90.4125" />

            {/* Canonical Tag — always non-www, no trailing slash */}
            <link rel="canonical" href={currentUrl} />

            {/* OpenGraph tags */}
            <meta property="og:type" content={type} />
            <meta property="og:title" content={siteTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:url" content={currentUrl} />
            <meta property="og:image" content={absoluteImage} />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <meta property="og:site_name" content={name} />
            <meta property="og:locale" content="en_US" />

            {/* Twitter tags */}
            <meta name="twitter:creator" content="@MdRakibujjamanAdib" />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={siteTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={absoluteImage} />

            {/* Custom metadata tags */}
            {customMeta.map((meta, i) => (
                <meta key={i} {...meta} />
            ))}

            {/* JSON-LD — Person + LocalBusiness + WebSite + ProfessionalService */}
            <script type="application/ld+json">
                {JSON.stringify([
                    {
                        "@context": "https://schema.org",
                        "@type": "WebSite",
                        "name": "Md Rakibujjaman Adib",
                        "url": "https://adibx.me",
                        "description": "Portfolio of Md Rakibujjaman Adib — Web Developer, Graphic Designer, Brand Designer, and 3D Artist based in Dhaka, Bangladesh.",
                        "potentialAction": {
                            "@type": "SearchAction",
                            "target": {
                                "@type": "EntryPoint",
                                "urlTemplate": "https://adibx.me/projects"
                            },
                            "query-input": "required name=search_term_string"
                        }
                    },
                    {
                        "@context": "https://schema.org",
                        "@type": ["Person", "LocalBusiness", "ProfessionalService"],
                        "name": "Md Rakibujjaman Adib",
                        "alternateName": ["Adib", "Rakibujjaman Adib"],
                        "url": "https://adibx.me",
                        "image": absoluteImage,
                        "logo": "https://adibx.me/favicon.svg",
                        "jobTitle": [
                            "Web Developer",
                            "Web Designer",
                            "Graphic Designer",
                            "Brand Designer",
                            "Video Editor",
                            "3D Artist",
                            "AI Architect",
                            "Creative Technologist"
                        ],
                        "description": "Md Rakibujjaman Adib is a professional Web Developer, Graphic Designer, Brand Designer, and AI Architect based in Dhaka, Bangladesh. Available for freelance and professional hire.",
                        "telephone": "+8801303031080",
                        "email": "contact@adibx.me",
                        "address": {
                            "@type": "PostalAddress",
                            "addressLocality": "Dhaka",
                            "addressRegion": "Dhaka Division",
                            "addressCountry": "Bangladesh",
                            "postalCode": "1229"
                        },
                        "geo": {
                            "@type": "GeoCoordinates",
                            "latitude": "23.8103",
                            "longitude": "90.4125"
                        },
                        "openingHours": "Mo-Su 09:00-20:00",
                        "priceRange": "$$",
                        "sameAs": [
                            "https://www.linkedin.com/in/md-rakibujjaman-adib",
                            "https://github.com/MdRakibujjamanAdib"
                        ],
                        "areaServed": [
                            {
                                "@type": "Country",
                                "name": "Bangladesh"
                            },
                            "Worldwide"
                        ],
                        "hasOfferCatalog": {
                            "@type": "OfferCatalog",
                            "name": "Design & Development Services",
                            "itemListElement": [
                                {
                                    "@type": "Offer",
                                    "itemOffered": {
                                        "@type": "Service",
                                        "name": "Web Development & Design",
                                        "description": "Professional website design and development services including landing pages, portfolios, and web applications."
                                    }
                                },
                                {
                                    "@type": "Offer",
                                    "itemOffered": {
                                        "@type": "Service",
                                        "name": "Graphic Design",
                                        "description": "Logo design, brand identity, menu card design, poster design, and publication graphic design."
                                    }
                                },
                                {
                                    "@type": "Offer",
                                    "itemOffered": {
                                        "@type": "Service",
                                        "name": "Brand Identity Design",
                                        "description": "Complete brand identity packages including logo, color palette, typography, and brand guidelines."
                                    }
                                },
                                {
                                    "@type": "Offer",
                                    "itemOffered": {
                                        "@type": "Service",
                                        "name": "3D Visualization & Animation",
                                        "description": "3D product rendering, architectural visualization, and animation using Cinema 4D, 3ds Max, and V-Ray."
                                    }
                                }
                            ]
                        },
                        "knowsAbout": [
                            "Web Development",
                            "Web Design",
                            "Graphic Design",
                            "Brand Identity Design",
                            "Menu Card Design",
                            "DTP Design",
                            "Publication Design",
                            "Logo Design",
                            "Video Editing",
                            "3D Animation",
                            "3D Rendering",
                            "Artificial Intelligence",
                            "UI/UX Design",
                            "React",
                            "TypeScript",
                            "MCT Labs",
                            "Green D"
                        ]
                    }
                ])}
            </script>
        </Helmet>
    );
}
