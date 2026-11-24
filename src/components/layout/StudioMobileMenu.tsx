import React from 'react';
import { createPortal } from 'react-dom';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import {
  InvertedCornerTopLeft,
  InvertedCornerTopRightBottom,
} from '../ui/StudioIcons';

interface StudioMobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function StudioMobileMenu({ isOpen, onClose }: StudioMobileMenuProps) {
  const location = useLocation();

  const links = [
    { label: 'Services', to: '/services' },
    { label: 'Projects', to: '/projects' },
    { label: 'Blogs', to: '/blogs' },
    { label: 'About', to: '/about' },
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

            {/* Top-Left Header: Wordmark & Role */}
            <div className="flex flex-col pt-1">
              <span className="font-['Clesmont_Demo',sans-serif] font-bold text-[22px] uppercase text-[var(--vb-text)] leading-tight tracking-tight">
                ADIB
              </span>
              <span className="text-[12px] text-[var(--vb-text-muted)] tracking-wider uppercase font-mono mt-1 leading-tight">
                Creative Developer &bull; AI Architect &bull; Designer
              </span>
            </div>

            {/* Bottom Menu Pill Links List matching Studio.com */}
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
