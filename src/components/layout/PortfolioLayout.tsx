import React, { useState } from 'react';
import PortfolioFooter from './PortfolioFooter';
import StudioNav from './StudioNav';
import { usePortfolioTheme } from '../../hooks/usePortfolioTheme';
import {
  InvertedCornerBottomRightLeft,
  InvertedCornerBottomRightTop,
} from '../ui/StudioIcons';
import { StudioStars } from '../ui/StudioStars';

interface PortfolioLayoutProps {
  pageLabel: string;
  showcaseImage?: string;
  showcaseAlt?: string;
  showcaseChildren?: React.ReactNode;
  hideShowcaseOnMobile?: boolean;
  footerSocialMode?: 'all' | 'contact-only' | 'none';
  headerCard?: React.ReactNode;
  children: React.ReactNode;
}

export default function PortfolioLayout({
  pageLabel,
  showcaseImage,
  showcaseAlt = 'Showcase',
  showcaseChildren,
  hideShowcaseOnMobile = false,
  footerSocialMode = 'all',
  headerCard,
  children,
}: PortfolioLayoutProps) {
  const [dark, setDark] = usePortfolioTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="vb-hero" data-theme={dark ? 'dark' : 'light'}>
      {/* Global Fixed Navigation Bar, Mobile Menu, and Viewport Frame */}
      <StudioNav
        dark={dark}
        setDark={setDark}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
      />

      {/* Left Column: Sticky Showcase Container */}
      <div className={`vb-showcase ${hideShowcaseOnMobile ? 'hidden xl:block' : ''}`}>
        {/* Media or Custom Graphic */}
        <div className="vb-media flex items-center justify-center relative overflow-hidden bg-black select-none">
          {showcaseImage ? (
            <img
              src={showcaseImage}
              alt={showcaseAlt}
              className="w-full h-full object-cover"
            />
          ) : showcaseChildren ? (
            showcaseChildren
          ) : (
            <div className="relative w-full h-full flex flex-col items-center justify-center p-8 text-center bg-black overflow-hidden">
              <StudioStars className="absolute inset-0 w-full h-full text-white/30 pointer-events-none" />
              <div className="relative z-10 flex flex-col items-center justify-center">
                <h2 className="vb-wordmark text-3xl md:text-4xl tracking-[0.25em] text-white font-extrabold mb-2.5">
                  ADIB
                </h2>
                <p className="text-[11px] uppercase tracking-[0.28em] text-[#a1a1aa] font-mono">
                  Creative Developer &bull; AI Architect &bull; Designer
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Bottom-Right Inverted Cutout Context Label */}
        <div className="vb-project-label">
          <span>{pageLabel}</span>
          <InvertedCornerBottomRightLeft className="vb-label-corner-left" />
          <InvertedCornerBottomRightTop className="vb-label-corner-top" />
        </div>
      </div>

      {/* Right Column: Page Content */}
      <div className="min-w-0 flex flex-col gap-3">
        {headerCard && (
          <section
            className={`relative overflow-visible bg-[var(--vb-panel)] rounded-[var(--vb-radius)] border border-[var(--vb-border)] ${
              hideShowcaseOnMobile ? 'pt-16 sm:pt-20 xl:pt-0' : 'p-6 md:p-10 xl:p-12'
            }`}
            aria-label="Page header"
          >
            {headerCard}
          </section>
        )}

        {children}

        <PortfolioFooter socialMode={footerSocialMode} />
      </div>
    </div>
  );
}
