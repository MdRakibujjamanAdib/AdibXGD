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
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : "https://adibx.me";
    const currentUrl = typeof window !== 'undefined' ? window.location.href : url;
    const absoluteImage = image.startsWith('http') ? image : (image.startsWith('/') ? `${baseUrl}${image}` : `${baseUrl}/${image}`);

    // Keep title under 60 characters to prevent Google truncation
    const siteTitle = title === "Home"
        ? `${name} | Web Developer & Brand Designer`
        : `${title} | ${name}`;

    // High-impact keywords for Dhaka local search and AI parsing
    const keywordArray = [
        "Md Rakibujjaman Adib",
        "Web Developer in Dhaka",
        "Graphic Designer in Dhaka",
        "Video Editor in Dhaka",
        "Top Web Developer Bangladesh",
        "Graphic Designer Bangladesh",
        "Video Editor Bangladesh",
        "3D Artist Dhaka",
        "AI Architect",
        "Creative Technologist",
        "MCT Labs Founder",
        ...customKeywords
    ];
    const keywords = keywordArray.join(", ");

    return (
        <Helmet>
            {/* Standard metadata tags */}
            <title>{siteTitle}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />

            {/* Canonical Tag */}
            <link rel="canonical" href={currentUrl.split('?')[0]} />

            {/* OpenGraph tags */}
            <meta property="og:type" content={type} />
            <meta property="og:title" content={siteTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:url" content={currentUrl} />
            <meta property="og:image" content={absoluteImage} />
            <meta property="og:site_name" content={name} />

            {/* Twitter tags */}
            <meta name="twitter:creator" content={name} />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={siteTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={absoluteImage} />

            {/* Custom metadata tags */}
            {customMeta.map((meta, i) => (
                <meta key={i} {...meta} />
            ))}

            {/* JSON-LD Local Search / Person Schema for AI & Google */}
            <script type="application/ld+json">
                {JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": ["Person", "LocalBusiness"],
                    "name": "Md Rakibujjaman Adib",
                    "alternateName": "Adib",
                    "url": "https://adibx.me",
                    "image": absoluteImage,
                    "jobTitle": [
                        "Web Developer",
                        "Graphic Designer",
                        "Video Editor",
                        "3D Artist",
                        "AI Architect"
                    ],
                    "description": "Md Rakibujjaman Adib is an AI Architect, Creative Technologist, Graphic Designer, Web Developer, and 3D Artist based in Dhaka, Bangladesh.",
                    "telephone": "+8801303031080",
                    "address": {
                        "@type": "PostalAddress",
                        "addressLocality": "Dhaka",
                        "addressCountry": "Bangladesh"
                    },
                    "geo": {
                        "@type": "GeoCoordinates",
                        "latitude": "23.8103",
                        "longitude": "90.4125"
                    },
                    "sameAs": [
                        "https://www.linkedin.com/in/md-rakibujjaman-adib",
                        "https://github.com/md-rakibujjaman-adib"
                    ],
                    "areaServed": "Worldwide",
                    "knowsAbout": [
                        "Web Development",
                        "Graphic Design",
                        "Video Editing",
                        "3D Animation",
                        "Artificial Intelligence",
                        "MCT Labs",
                        "Green D"
                    ]
                })}
            </script>
        </Helmet>
    );
}
