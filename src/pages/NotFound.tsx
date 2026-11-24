import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Home, Compass, Sparkles, BookOpen, Mail, ArrowLeft } from 'lucide-react';
import PortfolioLayout from '../components/layout/PortfolioLayout';
import SEO from '../components/SEO';

export default function NotFound() {
  return (
    <PortfolioLayout pageLabel="Page Not Found">
      <SEO
        title="404 — Page Not Found"
        description="The requested page could not be located on adibx.me. Discover selected works in web engineering, AI systems, and 3D CGI."
        robots="noindex, follow"
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-[2.5rem] border border-[var(--vb-border,#222)] bg-[var(--vb-card-bg,#0a0a0a)] p-8 sm:p-14 shadow-2xl relative overflow-hidden"
        >
          {/* Subtle background glow */}
          <div
            className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-20"
            style={{ backgroundColor: '#e62e05' }}
            aria-hidden="true"
          />

          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-mono font-bold tracking-widest uppercase bg-[#e62e05]/10 text-[#e62e05] border border-[#e62e05]/30 mb-6">
            Error 404 &bull; Resource Missing
          </span>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight mb-4 text-[var(--vb-text,#fff)]">
            Page Not Found
          </h1>

          <p className="text-base sm:text-lg text-[var(--vb-text-muted,#888)] max-w-xl mx-auto mb-10 leading-relaxed">
            The destination you are trying to visit does not exist, has been permanently relocated, or had its URL updated.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-2xl mx-auto text-left mb-10">
            <Link
              to="/"
              className="flex items-center gap-3 p-4 rounded-2xl border border-[var(--vb-border,#222)] hover:border-[#e62e05]/50 bg-white/[0.02] hover:bg-white/[0.06] transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-[#e62e05]/10 flex items-center justify-center text-[#e62e05] group-hover:scale-110 transition-transform">
                <Home size={20} />
              </div>
              <div>
                <div className="text-sm font-bold text-[var(--vb-text,#fff)]">Homepage</div>
                <div className="text-xs text-[var(--vb-text-muted,#777)]">Return to portfolio start</div>
              </div>
            </Link>

            <Link
              to="/projects"
              className="flex items-center gap-3 p-4 rounded-2xl border border-[var(--vb-border,#222)] hover:border-[#e62e05]/50 bg-white/[0.02] hover:bg-white/[0.06] transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-[#e62e05]/10 flex items-center justify-center text-[#e62e05] group-hover:scale-110 transition-transform">
                <Compass size={20} />
              </div>
              <div>
                <div className="text-sm font-bold text-[var(--vb-text,#fff)]">Projects</div>
                <div className="text-xs text-[var(--vb-text-muted,#777)]">Explore 34+ case studies</div>
              </div>
            </Link>

            <Link
              to="/services"
              className="flex items-center gap-3 p-4 rounded-2xl border border-[var(--vb-border,#222)] hover:border-[#e62e05]/50 bg-white/[0.02] hover:bg-white/[0.06] transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-[#e62e05]/10 flex items-center justify-center text-[#e62e05] group-hover:scale-110 transition-transform">
                <Sparkles size={20} />
              </div>
              <div>
                <div className="text-sm font-bold text-[var(--vb-text,#fff)]">Services</div>
                <div className="text-xs text-[var(--vb-text-muted,#777)]">Web, 3D, branding & AI</div>
              </div>
            </Link>

            <Link
              to="/blogs"
              className="flex items-center gap-3 p-4 rounded-2xl border border-[var(--vb-border,#222)] hover:border-[#e62e05]/50 bg-white/[0.02] hover:bg-white/[0.06] transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-[#e62e05]/10 flex items-center justify-center text-[#e62e05] group-hover:scale-110 transition-transform">
                <BookOpen size={20} />
              </div>
              <div>
                <div className="text-sm font-bold text-[var(--vb-text,#fff)]">Insights</div>
                <div className="text-xs text-[var(--vb-text-muted,#777)]">Technical breakdowns</div>
              </div>
            </Link>

            <Link
              to="/contact"
              className="flex items-center gap-3 p-4 rounded-2xl border border-[var(--vb-border,#222)] hover:border-[#e62e05]/50 bg-white/[0.02] hover:bg-white/[0.06] transition-all group sm:col-span-2 md:col-span-2"
            >
              <div className="w-10 h-10 rounded-xl bg-[#e62e05]/10 flex items-center justify-center text-[#e62e05] group-hover:scale-110 transition-transform">
                <Mail size={20} />
              </div>
              <div>
                <div className="text-sm font-bold text-[var(--vb-text,#fff)]">Get in Touch</div>
                <div className="text-xs text-[var(--vb-text-muted,#777)]">Report a broken link or discuss a project</div>
              </div>
            </Link>
          </div>

          <div className="pt-6 border-t border-[var(--vb-border,#222)]">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold bg-[#e62e05] hover:bg-[#d02804] text-white transition-colors shadow-lg shadow-[#e62e05]/20"
            >
              <ArrowLeft size={16} /> Back to Safety
            </Link>
          </div>
        </motion.div>
      </div>
    </PortfolioLayout>
  );
}
