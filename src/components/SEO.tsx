import React from 'react';
import { Helmet } from 'react-helmet-async';

export interface ArticleMetadata {
    publishedTime?: string;
    modifiedTime?: string;
    section?: string;
    tags?: string[];
    author?: string;
}

export interface SEOProps {
    title: string;
    description: string;
    name?: string;
    type?: 'website' | 'article';
    image?: string;
    url?: string;
    robots?: string;
    customKeywords?: string[];
    customMeta?: Array<{ name?: string; property?: string; content: string }>;
    article?: ArticleMetadata;
}

export default function SEO({
    title,
    description: defaultDescription,
    name = "Md Rakibujjaman Adib",
    type = "website",
    image = "https://adibx.me/MdRakibujamanAdib.jpg",
    url = "https://adibx.me",
    robots = "index, follow",
    customKeywords = [],
    customMeta = [],
    article
}: SEOProps) {
    const description = customMeta.find(
        meta => meta.name?.trim().toLowerCase() === 'description' && meta.content.trim()
    )?.content.trim() || defaultDescription;
    const baseUrl = "https://adibx.me";

    // URL resolution — always canonical production domain
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
    const currentUrl = (url !== baseUrl ? url : `${baseUrl}${currentPath === '/' ? '' : currentPath}`).replace(/\/+$/, '') || baseUrl;

    // Absolute image resolution
    const absoluteImage = image.startsWith('http') ? image : `${baseUrl}${image.startsWith('/') ? '' : '/'}${image}`;

    // Defensive title sanitization: remove any redundant brand suffix
    const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\s*\\|\\s*(${escapedName}|Md Rakibujjaman Adib)`, 'gi');
    const cleanTitle = (title || '').replace(regex, '').trim();

    const siteTitle = cleanTitle === "Home" || cleanTitle === ""
        ? `${name} | Freelance Web Developer & Designer`
        : `${cleanTitle} | ${name}`;

    // Keywords
    const keywordArray = [
        "Md Rakibujjaman Adib",
        "Adib",
        "graphic designer in bangladesh",
        "top graphic designer",
        "web designer",
        "web developer",
        "AI Architect",
        "Creative Technologist",
        "Serious Games Development",
        "Unity Game Engine",
        "MCT Labs Founder",
        "Green D co-founder",
        ...customKeywords
    ];
    const keywords = keywordArray.join(", ");

    // Structured JSON-LD Schemas
    const schemas: any[] = [
        {
            "@context": "https://schema.org",
            "@type": "WebSite",
            "@id": `${baseUrl}/#website`,
            "name": name,
            "url": baseUrl,
            "description": "Portfolio of Md Rakibujjaman Adib — Creative Technologist, AI Architect, Game Developer, and Brand Designer.",
            "potentialAction": {
                "@type": "SearchAction",
                "target": {
                    "@type": "EntryPoint",
                    "urlTemplate": `${baseUrl}/projects?q={search_term_string}`
                },
                "query-input": "required name=search_term_string"
            }
        },
        {
            "@context": "https://schema.org",
            "@type": "Person",
            "@id": `${baseUrl}/#person`,
            "name": name,
            "alternateName": ["Adib", "Rakibujjaman Adib"],
            "givenName": "Md Rakibujjaman",
            "familyName": "Adib",
            "url": baseUrl,
            "image": absoluteImage,
            "jobTitle": [
                "Creative Technologist",
                "AI Architect",
                "Web Developer",
                "Game Developer",
                "3D Artist",
                "Brand Designer"
            ],
            "description": "Creative Technologist and AI Architect with expertise in serious game development at Windesheim UAS, autonomous AI architectures, co-founder of Green D, and full-stack digital systems.",
            "email": "contact@adibx.me",
            "telephone": "+8801303031080",
            "address": {
                "@type": "PostalAddress",
                "addressLocality": "Dhaka",
                "addressRegion": "Dhaka Division",
                "addressCountry": "Bangladesh",
                "postalCode": "1229"
            },
            "alumniOf": [
                {
                    "@type": "EducationalOrganization",
                    "name": "Windesheim University of Applied Sciences",
                    "alternateName": "Windesheim UAS",
                    "url": "https://www.windesheim.nl/",
                    "address": {
                        "@type": "PostalAddress",
                        "addressLocality": "Zwolle",
                        "addressCountry": "Netherlands"
                    }
                },
                {
                    "@type": "EducationalOrganization",
                    "name": "Daffodil International University",
                    "alternateName": "DIU",
                    "url": "https://daffodilvarsity.edu.bd/",
                    "address": {
                        "@type": "PostalAddress",
                        "addressLocality": "Dhaka",
                        "addressCountry": "Bangladesh"
                    }
                }
            ],
            "affiliation": [
                {
                    "@type": "Organization",
                    "name": "038GAMES, Windesheim UAS",
                    "url": "https://038games.nl/"
                }
            ],
            "founder": [
                {
                    "@type": "Organization",
                    "name": "Green D",
                    "url": `${baseUrl}/projects/green-d-website`
                },
                {
                    "@type": "Organization",
                    "name": "MCT Labs"
                }
            ],
            "sameAs": [
                "https://www.linkedin.com/in/md-rakibujjaman-adib/",
                "https://github.com/MdRakibujjamanAdib/",
                "https://www.instagram.com/adibx.me/",
                "https://www.facebook.com/100004915484562"
            ],
            "knowsAbout": [
                "Creative Technology",
                "Artificial Intelligence",
                "AI Architecture",
                "Serious Games Development",
                "Unity Game Engine",
                "C# Programming",
                "Web Development",
                "React",
                "TypeScript",
                "Sustainable Technology & Green D",
                "3D CGI Rendering & V-Ray",
                "Visual Brand Identity"
            ]
        }
    ];

    if (type === 'article') {
        schemas.push({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "@id": `${currentUrl}#article`,
            "isPartOf": {
                "@id": `${baseUrl}/#website`
            },
            "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": currentUrl
            },
            "headline": cleanTitle,
            "description": description,
            "image": [absoluteImage],
            "datePublished": article?.publishedTime || new Date().toISOString(),
            "dateModified": article?.modifiedTime || article?.publishedTime || new Date().toISOString(),
            "author": {
                "@type": "Person",
                "@id": `${baseUrl}/#person`,
                "name": article?.author || name,
                "url": `${baseUrl}/about`,
                "jobTitle": "Creative Technologist & AI Architect"
            },
            "publisher": {
                "@type": "Person",
                "@id": `${baseUrl}/#person`,
                "name": name,
                "url": baseUrl,
                "logo": {
                    "@type": "ImageObject",
                    "url": `${baseUrl}/favicon.svg`
                }
            },
            "articleSection": article?.section || "Insights",
            "keywords": (article?.tags && article.tags.length > 0)
                ? article.tags.join(', ')
                : (customKeywords.length > 0 ? customKeywords.join(', ') : undefined),
            "inLanguage": "en-US"
        });
    }

    if (type === 'article') {
        schemas.push({
            '@context': 'https://schema.org', '@type': 'BreadcrumbList',
            itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl },
                { '@type': 'ListItem', position: 2, name: 'Blogs', item: `${baseUrl}/blogs` },
                { '@type': 'ListItem', position: 3, name: cleanTitle, item: currentUrl }
            ]
        });
    }

    // Synchronize JSON-LD script directly in DOM head to ensure availability across all React 19 / helmet lifecycle stages
    React.useEffect(() => {
        const id = 'seo-jsonld-schema';
        let script = document.getElementById(id) as HTMLScriptElement | null;
        if (!script) {
            script = document.createElement('script');
            script.type = 'application/ld+json';
            script.id = id;
            document.head.appendChild(script);
        }
        script.textContent = JSON.stringify(schemas);
        return () => {
            // cleanup on unmount if needed
        };
    }, [JSON.stringify(schemas)]);

    // Direct document.title update for immediate, 100% reliable React 19 title synchronization
    React.useEffect(() => {
        if (typeof document !== 'undefined') {
            document.title = siteTitle;
        }
    }, [siteTitle]);

    return (
        <Helmet>
            {/* Standard metadata */}
            <title>{siteTitle}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />
            <meta name="robots" content={robots} />
            <meta name="language" content="en" />
            <meta name="author" content={name} />

            {/* Geo / Local SEO */}
            <meta name="geo.region" content="BD-13" />
            <meta name="geo.placename" content="Dhaka, Bangladesh" />
            <meta name="geo.position" content="23.8103;90.4125" />
            <meta name="ICBM" content="23.8103, 90.4125" />

            {/* Canonical URL — omit on noindex pages (e.g., 404) */}
            {!robots.toLowerCase().includes('noindex') && (
                <link rel="canonical" href={currentUrl} />
            )}

            {/* OpenGraph metadata */}
            <meta property="og:type" content={type} />
            <meta property="og:title" content={siteTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:url" content={currentUrl} />
            <meta property="og:image" content={absoluteImage} />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <meta property="og:site_name" content={name} />
            <meta property="og:locale" content="en_US" />

            {/* Dynamic OpenGraph article tags */}
            {type === 'article' && article?.publishedTime && (
                <meta property="article:published_time" content={article.publishedTime} />
            )}
            {type === 'article' && (article?.modifiedTime || article?.publishedTime) && (
                <meta property="article:modified_time" content={article.modifiedTime || article.publishedTime} />
            )}
            {type === 'article' && (
                <meta property="article:author" content={article?.author || name} />
            )}
            {type === 'article' && article?.section && (
                <meta property="article:section" content={article.section} />
            )}
            {type === 'article' && article?.tags?.map((tag, idx) => (
                <meta key={`article-tag-${idx}`} property="article:tag" content={tag} />
            ))}

            {/* Twitter Card tags */}
            <meta name="twitter:site" content="@MdRakibujjamanAdib" />
            <meta name="twitter:creator" content="@MdRakibujjamanAdib" />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={siteTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={absoluteImage} />

            {/* Custom metadata tags */}
            {customMeta.filter(meta => meta.name?.trim().toLowerCase() !== 'description').map((meta, i) => (
                <meta key={i} {...meta} />
            ))}

            {/* Structured JSON-LD */}
            <script
                id="seo-jsonld-schema"
                type="application/ld+json"
            >{JSON.stringify(schemas).replace(/</g, '\\u003c')}</script>
        </Helmet>
    );
}
