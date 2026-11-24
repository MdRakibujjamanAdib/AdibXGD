import RolloverText from './ui/RolloverText';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import VisbeyondNav from './layout/VisbeyondNav';
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Facebook,
  Github,
  Instagram,
  Linkedin,
  Mail,
  MonitorSmartphone,
  PenTool,
  Play,
  Sparkles,
  Video,
  WandSparkles,
} from 'lucide-react';
import { personalInfo } from '../data/content';
import { projects } from '../data/projects';
import HomeSections from './HomeSections';
import { usePortfolioTheme } from '../hooks/usePortfolioTheme';
import {
  InvertedCornerTopRight,
  InvertedCornerBottomLeft,
  InvertedCornerBottomRightLeft,
  InvertedCornerBottomRightTop,
  InvertedCornerTopLeft,
  InvertedCornerTopRightBottom,
} from './ui/VisbeyondIcons';

// Dynamically feature projects that have `featured: true` in their individual project files, sorted by featuredOrder
const featuredProjects = projects
  .filter(p => Boolean(p.featured))
  .sort((a, b) => {
    if (a.featuredOrder !== undefined && b.featuredOrder !== undefined) {
      return a.featuredOrder - b.featuredOrder;
    }
    if (a.featuredOrder !== undefined) return -1;
    if (b.featuredOrder !== undefined) return 1;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

interface HeroSlide {
  id: string;
  type: 'profile' | 'project';
  title: string;
  thumbnail: string;
  link: string;
  linkLabel: string;
  tabLabel: string;
}

const profileSlide: HeroSlide = {
  id: 'adib-portrait',
  type: 'profile',
  title: 'Md Rakibujjaman Adib',
  thumbnail: '/MdRakibujamanAdib.jpg?v=3',
  link: '/about',
  linkLabel: 'About Me',
  tabLabel: 'Md Rakibujjaman Adib',
};

const heroSlides: HeroSlide[] = [
  profileSlide,
  ...featuredProjects.map(p => ({
    id: p.id,
    type: 'project' as const,
    title: p.title,
    thumbnail: p.thumbnail,
    link: `/projects/${p.id}`,
    linkLabel: 'View Project',
    tabLabel: 'Recent Projects',
  })),
];

const socialLinks = [
  { name: 'Instagram', href: personalInfo.social.instagram, Icon: Instagram },
  { name: 'LinkedIn', href: personalInfo.social.linkedin, Icon: Linkedin },
  { name: 'Facebook', href: personalInfo.social.facebook, Icon: Facebook },
  { name: 'GitHub', href: personalInfo.social.github, Icon: Github },
];

const services = [
  { name: 'Branding & Identity', Icon: PenTool, href: '/projects/green-d-brand-identity' },
  { name: 'Web & UI/UX Design', Icon: MonitorSmartphone, href: '/projects/green-d-website' },
  { name: 'AI & Automation', Icon: Sparkles, href: '/projects/mct-labs-web' },
  { name: '3D & Motion Design', Icon: Video, href: '/projects/Vray-Chess-Board' },
  { name: 'Video Editing', Icon: Play, href: '/projects/the-fading-heartbeat' },
];

export default function HomeHero() {
  const [index, setIndex] = useState(0);
  const [dark, setDark] = usePortfolioTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [paused, setPaused] = useState(false);
  const [interacting, setInteracting] = useState(false);
  const [previewHovered, setPreviewHovered] = useState(false);
  const [previewFocused, setPreviewFocused] = useState(false);
  const reducedMotion = useReducedMotion();
  const active = heroSlides[index] || heroSlides[0];

  useEffect(() => {
    if (paused || interacting || previewHovered || previewFocused || reducedMotion || heroSlides.length <= 1) return;
    const timer = window.setInterval(
      () => setIndex(value => (value + 1) % heroSlides.length),
      5000
    );
    return () => window.clearInterval(timer);
  }, [paused, interacting, previewHovered, previewFocused, reducedMotion]);

  function step(direction: number) {
    setIndex(value => (value + direction + heroSlides.length) % heroSlides.length);
  }

  return (
    <section className="vb-hero" data-theme={dark ? 'dark' : 'light'} aria-label="Portfolio">
      {/* Global Fixed Navigation Bar, Mobile Menu, and Viewport Frame */}
      <VisbeyondNav
        dark={dark}
        setDark={setDark}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
      />

      {/* Left Column: Sticky Showcase Carousel */}
      <div
        className="vb-showcase"
        role="region"
        aria-roledescription="carousel"
        aria-label={active.type === 'profile' ? 'About Md Rakibujjaman Adib showcase' : 'Recent projects showcase'}
        onMouseEnter={() => setInteracting(true)}
        onMouseLeave={event => setInteracting(event.currentTarget.contains(document.activeElement))}
        onFocusCapture={() => setInteracting(true)}
        onBlurCapture={event => {
          if (!event.currentTarget.contains(event.relatedTarget)) setInteracting(false);
        }}
      >
        <motion.div
          className="vb-media relative overflow-hidden"
          onPanEnd={(_, info) => {
            if (Math.abs(info.offset.x) > 50) step(info.offset.x < 0 ? 1 : -1);
          }}
        >
          <AnimatePresence initial={false}>
            <motion.img
              key={active.id}
              src={active.thumbnail}
              alt={active.title}
              draggable={false}
              initial={reducedMotion ? false : { opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reducedMotion ? 0 : 0.55, ease: [0.16, 1, 0.3, 1] }}
              fetchPriority="high"
              className="w-full h-full object-cover"
              style={{ objectPosition: active.type === 'profile' ? 'center 50%' : 'center' }}
            />
          </AnimatePresence>
        </motion.div>

        {/* Previous / Next Arrows */}
        <button
          className="vb-arrow vb-arrow--previous"
          type="button"
          aria-label={active.type === 'profile' ? 'Previous slide' : 'Previous project'}
          onClick={() => step(-1)}
        >
          <ChevronLeft />
        </button>
        <button
          className="vb-arrow vb-arrow--next"
          type="button"
          aria-label={active.type === 'profile' ? 'Next slide' : 'Next project'}
          onClick={() => step(1)}
        >
          <ChevronRight />
        </button>

        {/* Action Button: About Me or View Project */}
        <Link
          className="vb-view-project group"
          to={active.link}
          aria-label={active.type === 'profile' ? 'Learn more about Md Rakibujjaman Adib' : `View project: ${active.title}`}
        >
          <span>{active.linkLabel}</span>
          <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </Link>

        {/* Pagination Dots (Desktop only, Visbeyond styling) */}
        <div className="vb-pagination">
          {heroSlides.map((slide, itemIndex) => (
            <button
              type="button"
              key={slide.id}
              aria-label={`Show ${slide.title}`}
              aria-pressed={index === itemIndex}
              onClick={() => setIndex(itemIndex)}
            >
              <span className={index === itemIndex ? 'vb-dot vb-dot--active' : 'vb-dot'} />
            </button>
          ))}
        </div>

        {/* Bottom-Right Inverted Cutout Tab with Vector Corners */}
        <div className="vb-project-label">
          <span>{active.tabLabel}</span>
          <InvertedCornerBottomRightLeft className="vb-label-corner-left" />
          <InvertedCornerBottomRightTop className="vb-label-corner-top" />
        </div>
      </div>

      {/* Right Column: Scrollable Content Bento */}
      <div className="vb-content">
        <Link
          to="/about"
          className="vb-profile group"
          onMouseEnter={() => {
            if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
            setPreviewHovered(true);
            setIndex(0);
          }}
          onMouseLeave={() => setPreviewHovered(false)}
          onFocus={() => {
            setPreviewFocused(true);
            setIndex(0);
          }}
          onBlur={() => setPreviewFocused(false)}
        >
          <ArrowUpRight className="vb-profile-arrow" size={18} strokeWidth={1.5} aria-hidden="true" />
          <div className="vb-profile-heading">
            <div>
              <h1 className="vb-wordmark">ADIB</h1>
              <p>Creative Developer &amp; AI Architect</p>
            </div>
          </div>
          <p className="vb-profile-description">
            I&apos;m Md Rakibujjaman Adib, an AI architect, creative developer, and co-founder of Green D. I architect autonomous AI workflows, high-performance web systems, distinctive brand identities, and cinematic visuals.
          </p>
        </Link>

        {/* Social Links Column */}
        <div className="vb-socials">
          {socialLinks.map(({ name, href, Icon }) => (
            <a href={href} key={name} target="_blank" rel="noopener noreferrer" className="group">
              <span>{name}</span>
              <span className="vb-social-icon" aria-hidden="true"><span className="vb-social-icon-track">
                <Icon size={18} strokeWidth={1.5} />
                <ArrowUpRight size={18} strokeWidth={1.5} />
              </span></span>
            </a>
          ))}
          <Link to="/contact" className="vb-contact group">
            <span>Contact Me</span>
            <span className="vb-social-icon" aria-hidden="true"><span className="vb-social-icon-track">
              <Mail size={18} strokeWidth={1.5} />
              <ArrowUpRight size={18} strokeWidth={1.5} />
            </span></span>
          </Link>
        </div>

        {/* Services Bento with Exact Visbeyond Arrow Swap Hover Effect */}
        <div className="vb-services" id="portfolio-services">
          <div className="vb-section-heading">
            <h2>
              My Services <ArrowDown size={16} strokeWidth={1.8} />
            </h2>
            <Link to="/services">View All</Link>
          </div>
          <div className="vb-service-grid">
            {services.map(({ name, Icon, href }) => (
              <Link to={href} className="vb-service group" key={name}>
                <span>{name}</span>
                <span className="relative w-5 h-5 flex items-center justify-center flex-shrink-0">
                  <Icon
                    size={17}
                    strokeWidth={1.5}
                    className="transition-all duration-200 group-hover:opacity-0 group-hover:scale-75"
                  />
                  <ArrowUpRight
                    size={17}
                    strokeWidth={2}
                    className="absolute inset-0 transition-all duration-200 opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-[#e62e05] dark:text-[#e62e05]"
                  />
                </span>
              </Link>
            ))}
            <Link to="/services" className="vb-service vb-service--all group">
              <span>Explore All</span>
              <span className="relative w-5 h-5 flex items-center justify-center flex-shrink-0">
                <WandSparkles
                  size={17}
                  strokeWidth={1.8}
                  className="transition-all duration-200 group-hover:opacity-0 group-hover:scale-75"
                />
                <ArrowUpRight
                  size={17}
                  strokeWidth={2}
                  className="absolute inset-0 transition-all duration-200 opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-[#e62e05] dark:text-[#e62e05]"
                />
              </span>
            </Link>
          </div>
        </div>

        {/* Latest Projects Grid with Smooth Scale Zoom */}
        <div className="vb-recent">
          <div className="vb-section-heading">
            <h2>
              Latest Projects <ArrowDown size={16} strokeWidth={1.8} />
            </h2>
            <Link to="/projects">View All</Link>
          </div>
          <div className="vb-recent-grid">
            {featuredProjects.map(project => {
              const slideIdx = heroSlides.findIndex(s => s.id === project.id);
              return (
                <Link
                  to={`/projects/${project.id}`}
                  key={project.id}
                  className="vb-recent-card group"
                  onMouseEnter={() => {
                    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
                    setPreviewHovered(true);
                    if (slideIdx >= 0) setIndex(slideIdx);
                  }}
                  onMouseLeave={() => setPreviewHovered(false)}
                  onFocus={() => {
                    setPreviewFocused(true);
                    if (slideIdx >= 0) setIndex(slideIdx);
                  }}
                  onBlur={() => setPreviewFocused(false)}
                >
                  <div className="vb-recent-img-wrap">
                    <img src={project.thumbnail} alt={project.title} loading="lazy" />
                  </div>
                  <div className="vb-recent-label">
                    <span>{project.shortTitle || project.title}</span>
                    <span className="vb-project-arrow" aria-hidden="true"><ArrowRight size={16} strokeWidth={1.5} /></span>
                    <InvertedCornerTopRight className="vb-recent-corner-right" />
                    <InvertedCornerBottomLeft className="vb-recent-corner-bottom" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Home Sections (FAQ, Contact, Footer) */}
        <HomeSections />
      </div>
    </section>
  );
}
