export interface RouteMetadata {
  title: string;
  description: string;
  canonicalUrl: string;
  ogImage: string;
  ogType: string;
  robots: string;
}

const BASE_URL = 'https://adibx.me';
const DEFAULT_OG_IMAGE = `${BASE_URL}/MdRakibujamanAdib.jpg`;
const PERSON_ID = `${BASE_URL}/#person`;
const WEBSITE_ID = `${BASE_URL}/#website`;

const STATIC_ROUTE_METADATA: Record<string, { title: string; description: string }> = {
  '/': {
    title: 'Md Rakibujjaman Adib | Web Developer & Graphic Designer',
    description:
      'Portfolio of Md Rakibujjaman Adib — Creative Technologist, AI Architect, Game Developer, and Brand Designer.',
  },
  '/about': {
    title: 'About | Md Rakibujjaman Adib',
    description:
      'Learn about Md Rakibujjaman Adib, Creative Technologist, AI Architect, and Serious Game Developer.',
  },
  '/projects': {
    title: 'Projects | Md Rakibujjaman Adib',
    description:
      'Selected projects by Md Rakibujjaman Adib spanning AI architectures, web development, 3D CGI, and brand identity.',
  },
  '/services': {
    title: 'Services | Md Rakibujjaman Adib',
    description:
      'Creative technology, AI architecture, web development, game development, and visual brand identity services.',
  },
  '/blogs': {
    title: 'Blogs | Md Rakibujjaman Adib',
    description:
      'Insights and articles by Md Rakibujjaman Adib on AI architecture, serious games, web engineering, and design.',
  },
  '/achievements': {
    title: 'Achievements | Md Rakibujjaman Adib',
    description:
      'Awards, milestones, and academic and professional achievements of Md Rakibujjaman Adib.',
  },
  '/contact': {
    title: 'Contact | Md Rakibujjaman Adib',
    description:
      'Get in touch with Md Rakibujjaman Adib for collaborations, AI architecture, web, and design projects.',
  },
  '/terms': {
    title: 'Terms of Service | Md Rakibujjaman Adib',
    description: 'Terms of Service for ADIBX.ME, the portfolio of Md Rakibujjaman Adib.',
  },
  '/privacy': {
    title: 'Privacy Policy | Md Rakibujjaman Adib',
    description: 'Privacy Policy for ADIBX.ME, the portfolio of Md Rakibujjaman Adib.',
  },
};

function normalizeRoutePath(routePath: string): string {
  const trimmed = (routePath || '/').split('?')[0].split('#')[0].trim();
  if (!trimmed || trimmed === '/') {
    return '/';
  }
  const withLeadingSlash = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  return withLeadingSlash.replace(/\/+$/, '') || '/';
}

function formatSlugTitle(slug: string): string {
  return slug
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export function getRouteMetadata(routePath: string): RouteMetadata {
  const normalized = normalizeRoutePath(routePath);

  if (normalized === '/404') {
    return {
      title: 'Page Not Found | Md Rakibujjaman Adib',
      description: 'The requested page could not be found on ADIBX.ME.',
      canonicalUrl: BASE_URL,
      ogImage: DEFAULT_OG_IMAGE,
      ogType: 'website',
      robots: 'noindex, follow',
    };
  }

  const canonicalUrl = normalized === '/' ? BASE_URL : `${BASE_URL}${normalized}`;
  const staticEntry = STATIC_ROUTE_METADATA[normalized];

  if (staticEntry) {
    return {
      title: staticEntry.title,
      description: staticEntry.description,
      canonicalUrl,
      ogImage: DEFAULT_OG_IMAGE,
      ogType: 'website',
      robots: 'index, follow',
    };
  }

  if (normalized.startsWith('/blogs/')) {
    const slug = normalized.slice('/blogs/'.length);
    const label = formatSlugTitle(slug) || 'Article';
    return {
      title: `${label} | Md Rakibujjaman Adib`,
      description: `Article by Md Rakibujjaman Adib: ${label}.`,
      canonicalUrl,
      ogImage: DEFAULT_OG_IMAGE,
      ogType: 'article',
      robots: 'index, follow',
    };
  }

  if (normalized.startsWith('/projects/')) {
    const slug = normalized.slice('/projects/'.length);
    const label = formatSlugTitle(slug) || 'Project';
    return {
      title: `${label} | Md Rakibujjaman Adib`,
      description: `Project showcase by Md Rakibujjaman Adib: ${label}.`,
      canonicalUrl,
      ogImage: DEFAULT_OG_IMAGE,
      ogType: 'website',
      robots: 'index, follow',
    };
  }

  const fallbackLabel = formatSlugTitle(normalized.slice(1)) || 'Portfolio';
  return {
    title: `${fallbackLabel} | Md Rakibujjaman Adib`,
    description:
      'Portfolio of Md Rakibujjaman Adib — Creative Technologist, AI Architect, Game Developer, and Brand Designer.',
    canonicalUrl,
    ogImage: DEFAULT_OG_IMAGE,
    ogType: 'website',
    robots: 'index, follow',
  };
}

export function getRouteJsonLd(routePath: string): object {
  const normalized = normalizeRoutePath(routePath);
  const metadata = getRouteMetadata(normalized);
  const pageUrl = normalized === '/' ? BASE_URL : `${BASE_URL}${normalized}`;

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        '@id': PERSON_ID,
        name: 'Md Rakibujjaman Adib',
        alternateName: ['Adib', 'Rakibujjaman Adib'],
        url: BASE_URL,
        image: DEFAULT_OG_IMAGE,
        jobTitle: ['Creative Technologist', 'AI Architect', 'Web Developer', 'Game Developer'],
        sameAs: [
          'https://www.linkedin.com/in/md-rakibujjaman-adib/',
          'https://github.com/MdRakibujjamanAdib/',
          'https://www.instagram.com/adibx.me/',
          'https://www.facebook.com/100004915484562',
        ],
      },
      {
        '@type': 'WebSite',
        '@id': WEBSITE_ID,
        name: 'Md Rakibujjaman Adib',
        url: BASE_URL,
        publisher: {
          '@id': PERSON_ID,
        },
      },
      {
        '@type': 'WebPage',
        '@id': `${pageUrl}#webpage`,
        url: pageUrl,
        name: metadata.title,
        description: metadata.description,
        isPartOf: {
          '@id': WEBSITE_ID,
        },
        about: {
          '@id': PERSON_ID,
        },
        inLanguage: 'en-US',
      },
    ],
  };
}
