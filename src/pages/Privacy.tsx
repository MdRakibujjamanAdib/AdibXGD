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

const PRIVACY_TOC: TocItem[] = [
  { id: 'overview', title: '1. Overview' },
  { id: 'information-we-collect', title: '2. Information We Collect' },
  { id: 'how-we-use-information', title: '3. How We Use Information' },
  { id: 'cookies-and-storage', title: '4. Cookies & Local Storage' },
  { id: 'third-party-services', title: '5. Third-Party Services' },
  { id: 'data-security', title: '6. Data Security & Confidentiality' },
  { id: 'data-retention', title: '7. Data Retention' },
  { id: 'your-rights', title: '8. Your Rights' },
  { id: 'childrens-privacy', title: "9. Children's Privacy" },
  { id: 'changes', title: '10. Changes to This Policy' },
  { id: 'contact', title: '11. Contact' },
];

const ROTATING_TITLES = [
  'Data Protection',
  'Your Privacy',
  'Transparency',
  'Cookie Policy',
  'Your Rights',
  'Data Security',
  'Confidentiality',
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
          aria-label="Privacy policy topics"
          className="text-[22px] sm:text-2xl min-[1200px]:text-[32px] font-bold tracking-tight text-[#f5f5f5] leading-tight flex items-center justify-center font-sans text-center"
        >
          <span aria-hidden="true">
            {reducedMotion ? 'Data Protection' : text}
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

export default function Privacy() {
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

    PRIVACY_TOC.forEach((item) => {
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
        title="Privacy Policy"
        description="Privacy Policy for adibx.me — how Md Rakibujjaman Adib collects, uses, and protects your information, cookies, third-party services, and commercial confidentiality."
      />

      <PortfolioLayout
        pageLabel="Privacy Policy"
        hideShowcaseOnMobile={false}
        footerSocialMode="all"
        showcaseChildren={<ShowcaseTypewriter />}
      >
        {/* Clean Blogpost-style Header Card */}
        <section
          className="vb-card pt-16 sm:pt-20 xl:pt-10 p-6 sm:p-8 md:p-10 rounded-[var(--vb-radius)] border border-[var(--vb-border)] bg-[var(--vb-panel)]"
          aria-label="Privacy Policy Header"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[var(--vb-text)] mb-3 leading-[1.15] font-sans">
            Privacy Policy
          </h1>
          <p className="text-xs sm:text-sm text-[var(--vb-text-muted)] font-sans mb-5">
            <strong className="text-[var(--vb-text)] font-semibold">Last Updated:</strong> {lastUpdated}
          </p>
          <p className="text-base sm:text-lg text-[var(--vb-text-muted)] leading-relaxed font-sans max-w-3xl">
            This Privacy Policy explains how <strong className="text-[var(--vb-text)]">Md Rakibujjaman Adib</strong> collects, uses, and safeguards information when you visit <strong className="text-[var(--vb-text)]">adibx.me</strong> or communicate regarding commercial projects.
          </p>
        </section>

        {/* Table of Contents */}
        <section
          className="vb-card p-5 sm:p-6 rounded-[var(--vb-radius)] border border-[var(--vb-border)] bg-[var(--vb-panel)]"
          aria-label="Table of contents"
        >
          <button
            type="button"
            aria-expanded={tocOpen}
            aria-controls="privacy-chapter-links"
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
            id="privacy-chapter-links"
            aria-label="Privacy policy chapters"
            className={`${
              tocOpen ? 'flex' : 'hidden sm:flex'
            } flex-col gap-1 mt-3 pt-3 border-t border-[var(--vb-border)] font-sans`}
          >
            {PRIVACY_TOC.map((item) => {
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
          id="privacy-content"
          className="vb-card p-6 md:p-10 rounded-[var(--vb-radius)] border border-[var(--vb-border)] bg-[var(--vb-panel)]"
          aria-label="Privacy Policy Content"
        >
          <div className="vb-prose max-w-none">
            <h2 id="overview">1. Overview</h2>
            <p>
              <strong>adibx.me</strong> is a static portfolio website operated by Md Rakibujjaman Adib. We do not operate a backend database, user account system, or advertising network. We collect only the minimum information necessary to respond to inquiries and understand aggregate site usage.
            </p>
            <p>
              For commercial contract terms, intellectual property, and milestone payment policies, please see our{' '}
              <Link to="/terms">Terms &amp; Conditions</Link>.
            </p>

            <h2 id="information-we-collect">2. Information We Collect</h2>
            <p>We may receive or process two categories of information:</p>
            <ul>
              <li>
                <strong>Information You Voluntarily Provide:</strong> When you submit the contact form or send an email, you provide your name, email address, project details, and message content. Contact form submissions are transmitted via Web3Forms directly to our email inbox and are not stored in any database on this website.
              </li>
              <li>
                <strong>Automatically Collected Usage Data:</strong> Basic technical telemetry such as browser type, device category, pages visited, referring URL, and approximate region (country/city level) may be processed in aggregate to monitor site performance.
              </li>
            </ul>

            <h2 id="how-we-use-information">3. How We Use Information</h2>
            <p>We use collected information strictly to:</p>
            <ul>
              <li>Respond to your messages, project inquiries, and collaboration requests.</li>
              <li>Evaluate site performance, diagnose technical issues, and improve accessibility.</li>
              <li>Maintain commercial records for active client engagements.</li>
            </ul>
            <p>
              We never sell, rent, or trade your personal information to third parties for marketing or advertising purposes.
            </p>

            <h2 id="cookies-and-storage">4. Cookies &amp; Local Storage</h2>
            <p>
              This website uses minimal cookies and browser storage and does not use advertising or cross-site tracking pixels:
            </p>
            <ul>
              <li>
                <strong>Theme Preference (<code>vb-theme</code>):</strong> Stored locally in your browser&apos;s <code>localStorage</code> to remember your light or dark mode selection.
              </li>
              <li>
                <strong>Analytics Cookies (<code>_ga</code>, <code>_ga_*</code>):</strong> Google Analytics 4 measures page visits and interactions using browser identifiers and technical information. These identifiers may constitute personal data; aggregate reports do not mean that all underlying data is anonymous.
              </li>
            </ul>
            <p>
              You can clear or disable cookies and local storage at any time through your browser settings.
            </p>

            <h2 id="third-party-services">5. Third-Party Services</h2>
            <p>
              This website relies on a small number of infrastructure and utility providers, each governed by its own privacy policy:
            </p>
            <ul>
              <li>
                <strong>Vercel:</strong> Static hosting and edge delivery. Vercel may process standard HTTP request metadata (such as IP address and user agent) for security and reliability.
              </li>
              <li>
                <strong>Web3Forms:</strong> Processes contact form submissions and forwards them via email. Its infrastructure and spam-prevention providers may also process submission information. See the <a href="https://web3forms.com/privacy" target="_blank" rel="noopener noreferrer">Web3Forms privacy policy</a> for its retention and international processing practices.
              </li>
              <li>
                <strong>Google Analytics 4:</strong> Processes usage information to produce traffic reports. See <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google’s privacy policy</a>. Linked websites and services have their own privacy practices. Providers may process information outside your country.
              </li>
            </ul>

            <h2 id="data-security">6. Data Security &amp; Confidentiality</h2>
            <p>
              <strong>Technical Safeguards:</strong> The production website uses HTTPS to protect information in transit. No online service can guarantee complete security. Please do not send passwords, payment card details, or sensitive personal documents through the contact form.
            </p>
            <p>
              <strong>Commercial Confidentiality:</strong> Project messages are used to respond to inquiries and manage agreed work. Hosting, form delivery, and email providers may process this information. Any additional project confidentiality requirements should be recorded in the project agreement.
            </p>
            <p>
              <strong>Project Materials:</strong> Permissions to publish client work and any non-disclosure obligations are governed by the project agreement and <Link to="/terms">Terms &amp; Conditions</Link>.
            </p>

            <h2 id="data-retention">7. Data Retention</h2>
            <p>
              The website has no application database for contact messages, but form providers, hosting systems, and email services may retain information. Inquiries and project correspondence are kept as needed to respond, deliver agreed work, maintain required records, and resolve disputes. Provider retention depends on their policies and account settings; no fixed analytics retention period is promised here. Contact us to request deletion of information you supplied.
            </p>

            <h2 id="your-rights">8. Your Rights</h2>
            <p>
              Depending on your jurisdiction, you have the right to request access to, correction of, or deletion of personal data you have shared with us via email or our contact form, as well as the right to opt out of analytics cookies via your browser settings.
            </p>

            <h2 id="childrens-privacy">9. Children&apos;s Privacy</h2>
            <p>
              This website is not directed to individuals under the age of 13, and we do not knowingly collect personal information from children.
            </p>

            <h2 id="changes">10. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. Any revisions will be reflected on this page with an updated revision date.
            </p>

            <h2 id="contact">11. Contact</h2>
            <p>
              If you have any questions or privacy-related requests, please reach out directly:
            </p>
            <ul>
              <li>
                <strong>Name:</strong> Md Rakibujjaman Adib
              </li>
              <li>
                <strong>Email:</strong>{' '}
                <a href={`mailto:${personalInfo.email}?subject=Privacy%20Policy%20Inquiry`}>
                  {personalInfo.email}
                </a>
              </li>
              <li>
                <strong>Website:</strong> <Link to="/">adibx.me</Link>
              </li>
            </ul>
          </div>
        </article>
      </PortfolioLayout>
    </>
  );
}
