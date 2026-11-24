import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useReducedMotion } from 'motion/react';
import { List, ChevronDown } from 'lucide-react';
import PortfolioLayout from '../components/layout/PortfolioLayout';
import SEO from '../components/SEO';
import ServiceStarfield from '../components/ui/ServiceStarfield';
import { personalInfo } from '../data/content';

interface TocItem {
  id: string;
  title: string;
}

const TERMS_TOC: TocItem[] = [
  { id: 'overview', title: '1. Overview & Acceptance' },
  { id: 'startup-pricing', title: '2. Startup Free Prototype & Global Pricing' },
  { id: 'payment-schedule', title: '3. Milestone Payment Schedule' },
  { id: 'maintenance-scope', title: '4. Complimentary Maintenance & Scope' },
  { id: 'confidentiality-showcase', title: '5. Confidentiality & Showcase Rights' },
  { id: 'copyright-ip', title: '6. Copyright & Intellectual Property' },
  { id: 'contact', title: '7. Contact & Inquiries' },
];

const ROTATING_TITLES = [
  'Startup & Pricing',
  'Payment Terms',
  'Maintenance',
  'Commercial Policy',
  'Copyright',
  'IP Protection',
];

function ShowcaseTypewriter() {
  const reducedMotion = useReducedMotion();
  const [wordIndex, setWordIndex] = useState(0);
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (reducedMotion) return;
    const currentWord = ROTATING_TITLES[wordIndex];
    let timeout: NodeJS.Timeout;

    if (!isDeleting) {
      if (text.length < currentWord.length) {
        timeout = setTimeout(() => {
          setText(currentWord.slice(0, text.length + 1));
        }, 85);
      } else {
        timeout = setTimeout(() => {
          setIsDeleting(true);
        }, 1800);
      }
    } else {
      if (text.length > 0) {
        timeout = setTimeout(() => {
          setText((prev) => prev.slice(0, -1));
        }, 40);
      } else {
        timeout = setTimeout(() => {
          setIsDeleting(false);
          setWordIndex((prev) => (prev + 1) % ROTATING_TITLES.length);
        }, 300);
      }
    }

    return () => clearTimeout(timeout);
  }, [text, isDeleting, wordIndex, reducedMotion]);

  return (
    <div className="relative w-full h-full flex items-center justify-center p-6 select-none bg-[#0d0d0d] overflow-hidden">
      <ServiceStarfield />
      <div className="relative z-10 flex items-center justify-center">
        <h2
          aria-label="Terms and conditions topics"
          className="text-[22px] sm:text-2xl min-[1200px]:text-[32px] font-bold tracking-tight text-[#f5f5f5] leading-tight flex items-center justify-center font-sans text-center"
        >
          <span aria-hidden="true">
            {reducedMotion ? 'Copyright' : text}
          </span>
          {!reducedMotion && (
            <span
              aria-hidden="true"
              className="inline-block w-[2px] h-[1.2em] ml-1.5 bg-[#e62e05] animate-pulse"
            />
          )}
        </h2>
      </div>
    </div>
  );
}

export default function Terms() {
  const lastUpdated = 'November 2026';
  const [activeSectionId, setActiveSectionId] = useState<string>('overview');
  const [tocOpen, setTocOpen] = useState<boolean>(false);

  useEffect(() => {
    if (window.location.hash) {
      const hash = window.location.hash.replace('#', '');
      const element = document.getElementById(hash);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          setActiveSectionId(hash);
        }, 120);
      }
    }
  }, []);

  useEffect(() => {
    const handleIntersect: IntersectionObserverCallback = (entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting);
      if (visible.length > 0) {
        setActiveSectionId(visible[0].target.id);
      }
    };

    const observer = new IntersectionObserver(handleIntersect, {
      rootMargin: '-80px 0px -60% 0px',
      threshold: [0, 1.0],
    });

    TERMS_TOC.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleTocClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    id: string
  ) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.history.pushState(null, '', `#${id}`);
      setActiveSectionId(id);
      setTocOpen(false);
    }
  };

  return (
    <>
      <SEO
        title="Terms & Conditions | Commercial Terms"
        description="Terms and Conditions for Md Rakibujjaman Adib (adibx.me) — covering Copyright & Intellectual Property, Startup Free Prototype Initiative, Milestone Payment Policies, and Maintenance Scope."
      />

      <PortfolioLayout
        pageLabel="Terms & Conditions"
        hideShowcaseOnMobile={false}
        footerSocialMode="all"
        showcaseChildren={<ShowcaseTypewriter />}
      >
        {/* Clean Blogpost-style Header Card */}
        <section
          className="vb-card pt-16 sm:pt-20 xl:pt-10 p-6 sm:p-8 md:p-10 rounded-[var(--vb-radius)] border border-[var(--vb-border)] bg-[var(--vb-panel)]"
          aria-label="Terms and Conditions Header"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[var(--vb-text)] mb-3 leading-[1.15] font-sans">
            Terms &amp; Conditions
          </h1>
          <p className="text-xs sm:text-sm text-[var(--vb-text-muted)] font-sans mb-5">
            <strong className="text-[var(--vb-text)] font-semibold">Last Updated:</strong> {lastUpdated}
          </p>
          <p className="text-base sm:text-lg text-[var(--vb-text-muted)] leading-relaxed font-sans max-w-3xl">
            These terms govern your access to <strong className="text-[var(--vb-text)]">adibx.me</strong> and outline the commercial policies, intellectual property protections, milestone payment schedules, and maintenance scope for engineering and design engagements with <strong className="text-[var(--vb-text)]">Md Rakibujjaman Adib</strong>.
          </p>
        </section>

        {/* Table of Contents */}
        <section
          className="vb-card p-5 sm:p-6 rounded-[var(--vb-radius)] border border-[var(--vb-border)] bg-[var(--vb-panel)]"
          aria-label="Table of contents"
        >
          <button
            type="button"
            onClick={() => setTocOpen(!tocOpen)}
            className="w-full flex items-center justify-between text-xs font-sans uppercase tracking-wider text-[var(--vb-text)] font-semibold cursor-pointer sm:cursor-default"
          >
            <span className="flex items-center gap-2">
              <List size={14} className="text-[#e62e05]" />
              <span>Table of Contents</span>
            </span>
            <ChevronDown
              size={14}
              className={`sm:hidden transition-transform duration-200 ${
                tocOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          <nav
            aria-label="Terms chapters"
            className={`${
              tocOpen ? 'flex' : 'hidden sm:flex'
            } flex-col gap-1 mt-3 pt-3 border-t border-[var(--vb-border)] font-sans`}
          >
            {TERMS_TOC.map((item) => {
              const isActive = activeSectionId === item.id;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => handleTocClick(e, item.id)}
                  className={`flex items-center gap-2 text-xs sm:text-sm py-1.5 px-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-[#e62e05]/10 text-[#e62e05] font-semibold border-l-2 border-[#e62e05]'
                      : 'text-[var(--vb-text-muted)] hover:text-[var(--vb-text)] hover:bg-[var(--vb-subpanel)]'
                  }`}
                >
                  <span>{item.title}</span>
                </a>
              );
            })}
          </nav>
        </section>

        {/* Plain Prose Document Card */}
        <article
          id="terms-content"
          className="vb-card p-6 md:p-10 rounded-[var(--vb-radius)] border border-[var(--vb-border)] bg-[var(--vb-panel)]"
          aria-label="Terms and Conditions Content"
        >
          <div className="vb-prose max-w-none">
            <h2 id="overview">1. Overview &amp; Acceptance</h2>
            <p>
              Welcome to <strong>adibx.me</strong>, the personal portfolio and independent digital engineering practice of <strong>Md Rakibujjaman Adib</strong>. By browsing this website, submitting a project inquiry, or entering into a commercial engagement, you agree to be bound by the terms set out below.
            </p>
            <p>
              For information on how visitor and client data is handled, please review our{' '}
              <Link to="/privacy">Privacy Policy</Link>.
            </p>

            <h2 id="startup-pricing">2. Startup Free Prototype &amp; Dynamic Global Pricing</h2>
            <p>
              <strong>Complimentary Prototype for Early-Stage Startups:</strong> If your company is an early-stage startup that does not currently own a website, we will design an initial visual prototype completely free of charge using our in-house design aesthetics. Once you review and approve the prototype direction, we proceed to full customization and production engineering under a formal agreement.
            </p>
            <p>
              <strong>No Fixed Packages:</strong> Because we collaborate with clients across a diverse global market, we do not offer rigid, one-size-fits-all pricing tiers. Project estimates are tailored individually based on:
            </p>
            <ul>
              <li>
                <strong>Customization Depth:</strong> Bespoke UI/UX systems, custom 3D CGI or WebGL visuals, and interactive motion design.
              </li>
              <li>
                <strong>Functional &amp; Technical Scope:</strong> Required features, AI pipelines, IoT or API integrations, CMS workflows, and backend architecture.
              </li>
              <li>
                <strong>Estimated Visitor &amp; Scale Targets:</strong> Projected traffic volume, performance budgets, and deployment infrastructure requirements.
              </li>
            </ul>

            <h2 id="payment-schedule">3. Milestone Payment Schedule</h2>
            <p>
              All commercial engineering and design projects follow a transparent four-stage milestone payment structure:
            </p>
            <ul>
              <li>
                <strong>Contract Signing — 20%:</strong> Due upon signing the project agreement prior to kickoff.
              </li>
              <li>
                <strong>Visual Establishment — 50% (70% cumulative):</strong> Due once the core visual design, layout direction, and interactive aesthetic are established and approved.
              </li>
              <li>
                <strong>Live Deployment — 20% (90% cumulative):</strong> Due immediately upon production deployment to the live environment. If payment is delayed for more than <strong>7 calendar days</strong> after deployment without prior written agreement, late payment penalties (5% weekly accrued interest) may apply and access or ongoing support may be paused until settled.
              </li>
              <li>
                <strong>Retention Release — 10% (100% cumulative):</strong> The remaining 10% balance is due upon completion of the two-week complimentary maintenance period.
              </li>
            </ul>

            <h2 id="maintenance-scope">4. Complimentary Maintenance &amp; Scope Boundaries</h2>
            <p>
              Every deployed commercial project includes <strong>two (2) weeks of complimentary post-launch maintenance</strong> starting from the date of live deployment.
            </p>
            <ul>
              <li>
                <strong>Included in Maintenance:</strong> Debugging functional issues, fixing UI glitches, resolving cross-browser or responsive layout inconsistencies, and minor content or styling adjustments observed by either the developer or the client.
              </li>
              <li>
                <strong>Excluded from Maintenance:</strong> Major changes to system architecture, structural redesigns, new page templates, webflow restructuring, or additional features outside the original scope are billed separately from the project budget.
              </li>
            </ul>
            <p>
              <strong>Clear Project Brief Requirement:</strong> To prevent ambiguity or scope creep, a clear, mutually agreed <strong>Project Brief</strong> is required before development begins. Any additions requested outside the confirmed brief are quoted separately.
            </p>

            <h2 id="confidentiality-showcase">5. Confidentiality &amp; Portfolio Showcase Rights</h2>
            <p>
              <strong>Commercial Confidentiality:</strong> All contract terms, pricing details, technical briefs, credentials, and internal communications are kept strictly private and secure, and are never disclosed to third parties.
            </p>
            <p>
              <strong>Portfolio Showcase Rights:</strong> Unless otherwise agreed in writing, we retain the right to showcase completed projects, visual renders, and case studies in our portfolio and professional channels. If a client requires strict non-disclosure (NDA) or wishes to reclaim exclusive showcase rights, this can be arranged via an NDA buyout agreement for an additional fee.
            </p>

            <h2 id="copyright-ip">6. Copyright &amp; Intellectual Property</h2>
            <p>
              <strong>UI Layout Inspiration &amp; Original Engineering:</strong> The user interface layout, curved container ergonomics, and navigation structure of this website are inspired by external digital design references. Every underlying React component, interactive hook, animation orchestration, and responsive stylesheet is engineered independently from scratch.
            </p>
            <p>
              <strong>Protected Original Content:</strong> All original materials published on this website—including written project breakdowns, technical case studies, 3D CGI renders, animation reels, brand identity assets, source code, and photography—are the exclusive intellectual property of <strong>Md Rakibujjaman Adib</strong> (or respective client partners where licensed).
            </p>
            <p>
              These works are protected under the <strong>Copyright Act of Bangladesh (Act No. XXVIII of 2000, as amended)</strong>, the <strong>Berne Convention for the Protection of Literary and Artistic Works</strong>, and applicable <strong>WIPO</strong> copyright treaties.
            </p>
            <ul>
              <li>
                <strong>Prohibited Uses:</strong> Automated scraping, unauthorized mirroring, or commercial redistribution of any 3D renders, case studies, or technical articles without prior written consent is strictly prohibited.
              </li>
              <li>
                <strong>Permitted Educational Use:</strong> Referencing project breakdowns or technical articles for non-commercial academic or educational discussion is permitted with clear attribution and a canonical link back to <code>adibx.me</code>.
              </li>
            </ul>

            <h2 id="contact">7. Contact &amp; Inquiries</h2>
            <p>
              For questions regarding these terms, custom commercial agreements, or startup prototype inquiries:
            </p>
            <ul>
              <li>
                <strong>Email:</strong>{' '}
                <a href={`mailto:${personalInfo.email}?subject=Terms%20and%20Commercial%20Inquiry`}>
                  {personalInfo.email}
                </a>
              </li>
              <li>
                <strong>Project Brief Form:</strong>{' '}
                <Link to="/contact">Initiate a Project Brief</Link>
              </li>
            </ul>
          </div>
        </article>
      </PortfolioLayout>
    </>
  );
}
