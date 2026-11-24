import React from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Mail,
  Instagram,
  Linkedin,
  Facebook,
  Github,
  ArrowUpRight,
} from 'lucide-react';
import { personalInfo } from '../../data/content';
import { VisbeyondStars } from '../ui/VisbeyondStars';

// 16 Exact Animated Falling Star Meteors from Visbeyond
const METEORS = [
  { id: 1, top: '40px', left: '-110px', width: '110px', duration: '5.6s', delay: '0.2s' },
  { id: 2, top: '70px', left: '-100px', width: '100px', duration: '7.0s', delay: '0.6s' },
  { id: 3, top: '140px', left: '-120px', width: '100px', duration: '5.9s', delay: '0.2s' },
  { id: 4, top: '160px', left: '-120px', width: '100px', duration: '6.0s', delay: '2.0s' },
  { id: 5, top: '220px', left: '-100px', width: '100px', duration: '6.5s', delay: '1.2s' },
  { id: 6, top: '280px', left: '-120px', width: '100px', duration: '6.0s', delay: '2.4s' },
  { id: 7, top: '-30px', left: '-100px', width: '100px', duration: '7.4s', delay: '3.2s' },
  { id: 8, top: '-30px', left: '-10px', width: '100px', duration: '5.0s', delay: '1.0s' },
  { id: 9, top: '-40px', left: '50px', width: '100px', duration: '6.0s', delay: '1.0s' },
  { id: 10, top: '-40px', left: '-90px', width: '100px', duration: '5.6s', delay: '3.0s' },
  { id: 11, top: '-30px', left: '200px', width: '100px', duration: '5.4s', delay: '2.0s' },
  { id: 12, top: '-40px', left: '290px', width: '100px', duration: '5.3s', delay: '4.0s' },
  { id: 13, top: '-40px', left: '120px', width: '100px', duration: '5.8s', delay: '2.3s' },
  { id: 14, top: '-40px', left: '140px', width: '100px', duration: '6.0s', delay: '5.4s' },
  { id: 15, top: '10px', left: '-120px', width: '100px', duration: '8.0s', delay: '2.0s' },
  { id: 16, top: '-30px', left: '140px', width: '100px', duration: '7.0s', delay: '2.0s' },
];

// Rolling Text Link Component (Visbeyond whole-word vertical rollover effect)
function RollingLink({
  to,
  href,
  children,
  className = '',
}: {
  to?: string;
  href?: string;
  children: string;
  className?: string;
}) {
  const content = (
    <span className="vb-roll">
      <span className="vb-roll-track">
        <span>{children}</span>
        <span>{children}</span>
      </span>
    </span>
  );

  if (to) {
    return (
      <Link to={to} className={`vb-footer-roll-link ${className}`}>
        {content}
      </Link>
    );
  }

  return (
    <a href={href} className={`vb-footer-roll-link ${className}`}>
      {content}
    </a>
  );
}

export default function PortfolioFooter({
  socialMode = 'all',
}: {
  socialMode?: 'all' | 'contact-only' | 'none';
}) {
  return (
    <footer className="vb-footer-wrapper" aria-label="Site footer">
      {/* 1. Visbeyond Social & Contact Stack */}
      {socialMode === 'all' && (
        <div className="vb-footer-social-stack" aria-label="Social and contact links">
          <a
            href={personalInfo.social.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="vb-social-pill group"
            aria-label="Instagram"
          >
            <span>Instagram</span>
            <span className="vb-social-icon" aria-hidden="true">
              <span className="vb-social-icon-track">
                <Instagram size={18} strokeWidth={1.5} />
                <ArrowUpRight size={18} strokeWidth={2} />
              </span>
            </span>
          </a>
          <a
            href={personalInfo.social.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="vb-social-pill group"
            aria-label="LinkedIn"
          >
            <span>LinkedIn</span>
            <span className="vb-social-icon" aria-hidden="true">
              <span className="vb-social-icon-track">
                <Linkedin size={18} strokeWidth={1.5} />
                <ArrowUpRight size={18} strokeWidth={2} />
              </span>
            </span>
          </a>
          <a
            href={personalInfo.social.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="vb-social-pill group"
            aria-label="Facebook"
          >
            <span>Facebook</span>
            <span className="vb-social-icon" aria-hidden="true">
              <span className="vb-social-icon-track">
                <Facebook size={18} strokeWidth={1.5} />
                <ArrowUpRight size={18} strokeWidth={2} />
              </span>
            </span>
          </a>
          <a
            href={personalInfo.social.github}
            target="_blank"
            rel="noopener noreferrer"
            className="vb-social-pill group"
            aria-label="GitHub"
          >
            <span>GitHub</span>
            <span className="vb-social-icon" aria-hidden="true">
              <span className="vb-social-icon-track">
                <Github size={18} strokeWidth={1.5} />
                <ArrowUpRight size={18} strokeWidth={2} />
              </span>
            </span>
          </a>
          <Link
            to="/contact"
            className="vb-social-pill vb-contact-pill group"
            aria-label="Contact Us"
          >
            <span>Contact Us</span>
            <span className="vb-social-icon" aria-hidden="true">
              <span className="vb-social-icon-track">
                <Mail size={18} strokeWidth={1.5} />
                <ArrowUpRight size={18} strokeWidth={2} />
              </span>
            </span>
          </Link>
        </div>
      )}

      {socialMode === 'contact-only' && (
        <div className="w-full">
          <Link
            to="/contact"
            className="vb-social-pill vb-contact-pill group w-full"
            aria-label="Contact Us"
          >
            <span>Contact Us</span>
            <span className="vb-social-icon" aria-hidden="true">
              <span className="vb-social-icon-track">
                <Mail size={18} strokeWidth={1.5} />
                <ArrowUpRight size={18} strokeWidth={2} />
              </span>
            </span>
          </Link>
        </div>
      )}

      {/* 2. Main Signature Cosmic Footer Card */}
      <div className="vb-footer-card">
        {/* Galaxy Cosmic Stardust & 16 Animated Falling Star Meteors */}
        <div className="vb-footer-galaxy" aria-hidden="true">
          <VisbeyondStars className="vb-footer-stars-svg" />
          {METEORS.map(m => (
            <span
              key={m.id}
              className="vb-meteor"
              style={{
                top: m.top,
                left: m.left,
                width: m.width,
                animationDuration: m.duration,
                animationDelay: m.delay,
              }}
            />
          ))}
        </div>

        {/* Top Row: Name "ADIB" + Title & Schedule a Call Button (No VB Logo) */}
        <div className="vb-footer-top-row">
          <Link to="/" className="vb-footer-brand group">
            <div className="vb-footer-brand-text">
              <span className="vb-wordmark text-3xl sm:text-4xl font-extrabold tracking-tight leading-none text-white dark:text-[#0e1011] transition-colors">
                ADIB
              </span>
              <span className="text-xs sm:text-sm font-medium tracking-wide text-white/60 dark:text-[#0e1011]/60 mt-1.5 font-sans transition-colors">
                Creative Developer &bull; AI Architect &bull; Designer
              </span>
            </div>
          </Link>

          <a
            href={`mailto:${personalInfo.email}?subject=Project%20Inquiry%20-%20Schedule%20a%20Call`}
            className="vb-schedule-btn group"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="vb-btn-glow" aria-hidden="true" />
            <div className="vb-btn-stroke" aria-hidden="true" />
            <div className="vb-btn-fill" aria-hidden="true" />
            <span className="vb-btn-text">Schedule a Call</span>
            <Calendar size={15} className="vb-btn-icon" />
          </a>
        </div>

        {/* Navigation Grid Desktop: 2 Side-by-Side Columns with Rolling Text Hover Effect */}
        <div className="vb-footer-nav-desktop">
          <div className="vb-footer-nav-col">
            <h3 className="vb-footer-col-heading">Pages</h3>
            <ul className="vb-footer-col-list">
              <li>
                <RollingLink to="/services">Services</RollingLink>
              </li>
              <li>
                <RollingLink to="/projects">Projects</RollingLink>
              </li>
              <li>
                <RollingLink to="/about">About</RollingLink>
              </li>
              <li>
                <RollingLink to="/contact">Contact</RollingLink>
              </li>
            </ul>
          </div>

          <div className="vb-footer-nav-col">
            <h3 className="vb-footer-col-heading">Quick Links</h3>
            <ul className="vb-footer-col-list">
              <li>
                <RollingLink to="/blogs">Blogs</RollingLink>
              </li>
              <li>
                <RollingLink to="/terms">Terms &amp; Conditions</RollingLink>
              </li>
              <li>
                <RollingLink to="/privacy">Privacy Policy</RollingLink>
              </li>
            </ul>
          </div>
        </div>

        {/* Navigation Grid Mobile: 2 Centered Horizontal Link Groups with Rolling Text Hover Effect */}
        <div className="vb-footer-nav-mobile">
          <div className="vb-footer-mobile-group">
            <h3 className="vb-footer-col-heading">Pages</h3>
            <div className="vb-footer-mobile-links">
              <RollingLink to="/services">Services</RollingLink>
              <RollingLink to="/projects">Projects</RollingLink>
              <RollingLink to="/about">About</RollingLink>
              <RollingLink to="/contact">Contact</RollingLink>
            </div>
          </div>

          <div className="vb-footer-mobile-group">
            <h3 className="vb-footer-col-heading">Quick Links</h3>
            <div className="vb-footer-mobile-links">
              <RollingLink to="/blogs">Blogs</RollingLink>
              <RollingLink to="/terms">Terms &amp; Conditions</RollingLink>
              <RollingLink to="/privacy">Privacy Policy</RollingLink>
            </div>
          </div>
        </div>

        {/* Bottom Row: Copyright */}
        <div className="vb-footer-bottom-row">
          <p className="vb-footer-copyright">
            © {new Date().getFullYear()} {personalInfo.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
