import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import VisbeyondLayout from '../components/layout/VisbeyondLayout';
import SEO from '../components/SEO';
import { VisbeyondStars } from '../components/ui/VisbeyondStars';
import {
  allServices,
  SERVICE_CATEGORIES,
  ServiceCategory,
  ServiceItem,
} from '../data/services';

// Typewriter / rotating text effect for the left sticky showcase (clean minimal typography matching Visbeyond)
const SHOWCASE_ROTATING_TITLES = [
  'UI/UX Design',
  '3D Animation',
  'Typography',
  'Logo Design',
  'AI Architecture',
  'App Development',
  'Motion Graphics',
  'Brand Identity',
];

function ShowcaseTypewriter() {
  const [wordIndex, setWordIndex] = useState(0);
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentWord = SHOWCASE_ROTATING_TITLES[wordIndex];
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
          setText(prev => prev.slice(0, -1));
        }, 40);
      } else {
        timeout = setTimeout(() => {
          setIsDeleting(false);
          setWordIndex(prev => (prev + 1) % SHOWCASE_ROTATING_TITLES.length);
        }, 300);
      }
    }

    return () => clearTimeout(timeout);
  }, [text, isDeleting, wordIndex]);

  return (
    <div className="relative w-full h-full flex items-center justify-center p-8 select-none bg-black overflow-hidden">
      <VisbeyondStars className="absolute inset-0 w-full h-full text-white/30 pointer-events-none" />

      <div className="relative z-10 flex items-center justify-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight flex items-center justify-center font-sans">
          <span>{text}</span>
          <span className="inline-block w-[3px] h-[0.9em] ml-1.5 bg-[#e62e05] animate-pulse" />
        </h2>
      </div>
    </div>
  );
}

export default function Services() {
  const [activeCategory, setActiveCategory] = useState<ServiceCategory>('All');

  const filteredServices = activeCategory === 'All'
    ? allServices
    : allServices.filter(s => s.category === activeCategory);

  return (
    <>
      <SEO
        title="Services"
        description="Explore services across Autonomous AI Systems, Web & App Development, UI/UX Design, 3D Animation, and Brand Identity."
      />

      <VisbeyondLayout
        pageLabel="Services"
        hideShowcaseOnMobile={false}
        footerSocialMode="contact-only"
        showcaseChildren={<ShowcaseTypewriter />}
        headerCard={
          <div className="flex flex-col justify-between min-h-[130px] md:min-h-[160px] xl:min-h-[190px] p-6 md:p-10 xl:p-12">
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-[var(--vb-text)] leading-[1.1]">
              Our Services
            </h1>

            <p className="text-sm md:text-[15px] text-[var(--vb-text-muted)] leading-relaxed max-w-xl font-sans mt-6 md:mt-8">
              Transform your brand with future-ready digital craftsmanship. We specialize in autonomous AI architectures, modern fullstack web systems, photorealistic 3D visuals, and cohesive brand design.
            </p>
          </div>
        }
      >
        {/* Sticky Search by Category Card (Exact Visbeyond Pattern) */}
        <section
          className="sticky top-3 z-20 rounded-[20px] pt-12 min-[440px]:pt-1.5 min-[810px]:pt-14 xl:pt-8 pb-5 px-4 sm:px-6 md:px-8 bg-[#0e1011] dark:bg-white text-white dark:text-[#0e1011] border border-white/10 dark:border-black/10 shadow-xl backdrop-blur-md transition-colors duration-300"
          aria-label="Filter services by category"
        >
          {/* Top Notch Row:
              - Mobile (<440px): centered below top tabs
              - Tablet notch (440px-809px): centered in top bar notch between ADIB & Menu tabs
              - Single-column desktop (810px-1199px): left-aligned cleanly below full navbar
              - 2-Column desktop (>=1200px): left-aligned in right column
          */}
          <div className="w-full min-h-[37px] flex items-center justify-center min-[810px]:justify-start mb-2 sm:mb-4">
            <h2 className="text-sm min-[440px]:text-base sm:text-lg xl:text-2xl font-bold tracking-tight text-white dark:text-[#0e1011] whitespace-nowrap text-center min-[810px]:text-left px-2 transition-colors duration-300">
              Search by Category
            </h2>
          </div>

          <div className="flex flex-wrap gap-2 sm:gap-2.5 justify-center min-[810px]:justify-start">
            {SERVICE_CATEGORIES.map(category => {
              const isActive = activeCategory === category;

              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className={`px-3.5 py-1.5 rounded-[8px] text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer select-none ${
                    isActive
                      ? 'bg-[#e62e05] text-white border-transparent shadow-md shadow-[#e62e05]/30'
                      : 'bg-transparent text-white dark:text-[#0e1011] border border-dashed border-white/40 dark:border-black/30 hover:border-white dark:hover:border-[#0e1011]'
                  }`}
                  aria-pressed={isActive}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </section>

        {/* Minimal Service Cards List (Exact Match to Visbeyond Reference) */}
        <section className="flex flex-col gap-3" aria-label="Services list">
          <AnimatePresence mode="popLayout">
            {filteredServices.map((service: ServiceItem) => (
              <motion.div
                key={service.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              >
                <Link
                  to={`/contact?service=${encodeURIComponent(service.title)}`}
                  className="group relative flex items-center justify-between px-6 py-5 rounded-[14px] bg-[#f6f6f6] dark:bg-[#141617] border border-black/5 dark:border-white/5 hover:bg-[#ececec] dark:hover:bg-[#1c1f20] hover:-translate-y-0.5 transition-all duration-200 text-decoration-none"
                  aria-label={`${service.title} - ${service.category}`}
                >
                  {/* Left: Title on top, Category subtitle below */}
                  <div className="flex flex-col min-w-0 pr-4">
                    <h3 className="text-[17px] sm:text-[18px] font-medium text-[var(--vb-text)] leading-snug tracking-tight">
                      {service.title}
                    </h3>
                    <span className="text-xs sm:text-[13px] text-[var(--vb-text-muted)] mt-1 font-normal font-sans">
                      {service.category}
                    </span>
                  </div>

                  {/* Right: Thin Right Arrow */}
                  <div className="flex-shrink-0 text-[var(--vb-text-muted)] group-hover:text-[var(--vb-text)] group-hover:translate-x-1 transition-all duration-200">
                    <ArrowRight size={18} strokeWidth={1.5} />
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </section>
      </VisbeyondLayout>
    </>
  );
}
