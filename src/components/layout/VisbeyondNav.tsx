import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import RolloverText from '../ui/RolloverText';
import VisbeyondMobileMenu from './VisbeyondMobileMenu';
import DayNightToggle from '../ui/DayNightToggle';
import {
  InvertedCornerTopRight,
  InvertedCornerBottomLeft,
  InvertedCornerTopLeft,
  InvertedCornerTopRightBottom,
  InvertedCornerTopRightFrame,
  InvertedCornerBottomLeftFrame,
  InvertedCornerBottomRightFrame,
} from '../ui/VisbeyondIcons';

interface VisbeyondNavProps {
  dark: boolean;
  setDark: React.Dispatch<React.SetStateAction<boolean>>;
  menuOpen: boolean;
  setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function VisbeyondNav({
  dark,
  setDark,
  menuOpen,
  setMenuOpen,
}: VisbeyondNavProps) {
  const location = useLocation();

  const navigation = (
    <>
      <Link
        to="/projects"
        className={location.pathname.startsWith('/projects') ? 'active' : ''}
        onClick={() => setMenuOpen(false)}
      >
        <RolloverText>Projects</RolloverText>
      </Link>
      <Link
        to="/services"
        className={location.pathname === '/services' ? 'active' : ''}
        onClick={() => setMenuOpen(false)}
      >
        <RolloverText>Services</RolloverText>
      </Link>
      <Link
        to="/about"
        className={location.pathname === '/about' ? 'active' : ''}
        onClick={() => setMenuOpen(false)}
      >
        <RolloverText>About</RolloverText>
      </Link>
      <Link
        to="/blogs"
        className={location.pathname.startsWith('/blogs') ? 'active' : ''}
        onClick={() => setMenuOpen(false)}
      >
        <RolloverText>Blogs</RolloverText>
      </Link>
      <Link
        to="/contact"
        className={location.pathname === '/contact' ? 'active' : ''}
        onClick={() => setMenuOpen(false)}
      >
        <RolloverText>Contact</RolloverText>
      </Link>
    </>
  );

  return (
    <>
      {/* Signature Visbeyond Fixed Viewport Border Frame with mathematically curved corners */}
      <div className="vb-viewport-frame" aria-hidden="true">
        <InvertedCornerTopRightFrame className="vb-viewport-corner-tr" />
        <InvertedCornerBottomLeftFrame className="vb-viewport-corner-bl" />
        <InvertedCornerBottomRightFrame className="vb-viewport-corner-br" />
      </div>

      {/* Top-Left Inverted Cutout Nav Tab (Fixed Overlay across all pages) */}
      <nav className="vb-nav" aria-label="Portfolio navigation">
        <Link to="/" className="vb-wordmark" onClick={() => setMenuOpen(false)}>
          ADIB
        </Link>
        <div className="vb-nav-links">{navigation}</div>

        {/* Celestial Day / Night Switch */}
        <DayNightToggle
          dark={dark}
          onToggle={() => setDark(value => !value)}
        />

        {/* Mathematical Inverted Vector Corners matching visbeyond.com */}
        <InvertedCornerTopRight className="vb-nav-corner-right" />
        <InvertedCornerBottomLeft className="vb-nav-corner-bottom" />
      </nav>

      {/* Mobile Menu Trigger (Fixed Overlay) */}
      <button
        className="vb-menu"
        type="button"
        aria-expanded={menuOpen}
        aria-controls="vb-global-menu"
        onClick={() => setMenuOpen(value => !value)}
      >
        <span>{menuOpen ? 'Close' : 'Menu'}</span>
        <InvertedCornerTopLeft className="vb-menu-corner-left" />
        <InvertedCornerTopRightBottom className="vb-menu-corner-bottom" />
      </button>

      {/* Full Visbeyond Mobile Menu Sheet */}
      <VisbeyondMobileMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
