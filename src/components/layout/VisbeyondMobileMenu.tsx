import React from 'react';
import { createPortal } from 'react-dom';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import {
  VBLogo,
  InvertedCornerTopLeft,
  InvertedCornerTopRightBottom,
} from '../ui/VisbeyondIcons';

interface VisbeyondMobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function VisbeyondMobileMenu({ isOpen, onClose }: VisbeyondMobileMenuProps) {
  const location = useLocation();

  const links = [
    { label: 'Services', to: '/#portfolio-services' },
    { label: 'Projects', to: '/projects' },
    { label: 'Pricing', to: '/#portfolio-pricing' },
    { label: 'Blogs', to: '/blogs' },
    { label: 'About Us', to: '/about' },
    { label: 'Contact Us', to: '/contact', isCta: true },
  ];

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="vb-mobile-menu-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[9999] p-3 flex flex-col pointer-events-auto"
          style={{ backgroundColor: 'var(--vb-bg)' }}
          onClick={onClose}
        >
          {/* Main Card Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -6 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full h-full rounded-[14px] overflow-hidden flex flex-col justify-between p-6"
            style={{ backgroundColor: 'var(--vb-panel)' }}
            onClick={e => e.stopPropagation()}
          >
            {/* Top-Right Inverted Cutout Close Tab */}
            <button
              type="button"
              className="vb-menu-close-tab"
              onClick={onClose}
              aria-label="Close menu"
            >
              <span>Close</span>
              <InvertedCornerTopLeft className="vb-menu-corner-left" />
              <InvertedCornerTopRightBottom className="vb-menu-corner-bottom" />
            </button>

            {/* Top-Left Header: Shield Logo, Title & Subtitle */}
            <div className="flex items-center gap-3 pt-1">
              <div className="w-9 h-9 flex items-center justify-center shrink-0">
                <VBLogo className="w-9 h-9 text-[var(--vb-text)]" />
              </div>
              <div className="flex flex-col">
                <span className="font-['Clesmont_Demo',sans-serif] font-bold text-[18px] uppercase text-[var(--vb-text)] leading-tight tracking-normal">
                  ADIB
                </span>
                <span className="text-[14px] text-[var(--vb-text-muted)] tracking-normal font-sans leading-tight">
                  Design Studio
                </span>
              </div>
            </div>

            {/* Bottom Menu Pill Links List matching visbeyond.com */}
            <div className="flex flex-col gap-2 w-full mt-auto pt-6">
              {links.map(link => {
                const isActive = location.pathname === link.to;
                if (link.isCta) {
                  return (
                    <Link
                      key={link.to}
                      to={link.to}
                      onClick={onClose}
                      className="flex items-center justify-between h-12 px-4 rounded-[10px] bg-[#0E1011] text-white dark:bg-white dark:text-[#0E1011] font-sans font-medium text-[15px] transition-transform duration-150 active:scale-[0.99] shadow-none"
                    >
                      <span>{link.label}</span>
                      <ArrowRight size={16} />
                    </Link>
                  );
                }

                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={onClose}
                    className={`flex items-center justify-between h-12 px-4 rounded-[10px] bg-[var(--vb-card-inset)] text-[var(--vb-text)] font-sans font-medium text-[15px] transition-all duration-150 active:scale-[0.99] shadow-none border border-black/[0.04] dark:border-white/[0.06] ${
                      isActive ? 'font-semibold' : ''
                    }`}
                  >
                    <span>{link.label}</span>
                    <ArrowRight size={16} className="text-[var(--vb-text)]" />
                  </Link>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
