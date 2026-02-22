import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
    title: string;
    description: string;
    name?: string;
    type?: string;
    image?: string;
    url?: string;
}

export default function SEO({
    title,
    description,
    name = "Md Rakibujjaman Adib",
    type = "website",
    image = "https://adibx.me/images/OG%20Image%20of%20Md%20Rakibujjaman%20Adib,%20Designer,%20Web%20Devloper,%203D%20Artist.jpg",
    url = "https://adibx.me"
}: SEOProps) {
    const siteTitle = `${title} | ${name} - AI Architect & Creative Technologist`;

    // Keywords explicitly requested by user to be highlighted for SEO
    const keywords = "Md Rakibujjaman Adib, Web Developer in Dhaka, Graphic Designer in Dhaka, Video Editor in Dhaka, Web Developer Bangladesh, Graphic Designer Bangladesh, Video Editor Bangladesh, 3D Artist, AI Architect, Creative Technologist, Green D Co-Founder, MCT Labs";

    return (
        <Helmet>
            {/* Standard metadata tags */}
            <title>{siteTitle}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />

            {/* OpenGraph tags */}
            <meta property="og:type" content={type} />
            <meta property="og:title" content={siteTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:url" content={url} />
            <meta property="og:image" content={image} />
            <meta property="og:site_name" content={name} />

            {/* Twitter tags */}
            <meta name="twitter:creator" content={name} />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={siteTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image} />

            {/* JSON-LD Local Search / Person Schema for AI & Google */}
            <script type="application/ld+json">
                {JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": ["Person", "LocalBusiness"],
                    "name": "Md Rakibujjaman Adib",
                    "alternateName": "Adib",
                    "url": "https://adibx.me",
                    "image": image,
                    "jobTitle": [
                        "Web Developer",
                        "Graphic Designer",
                        "Video Editor",
                        "3D Artist",
                        "AI Architect"
                    ],
                    "description": "Md Rakibujjaman Adib is an AI Architect, Creative Technologist, Graphic Designer, Web Developer, and 3D Artist based in Dhaka, Bangladesh.",
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
