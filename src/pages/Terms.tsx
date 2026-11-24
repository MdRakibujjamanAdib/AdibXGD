import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Shield,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Scale,
  DollarSign,
  Layers,
  Lock,
  Eye,
  Clock,
  Sparkles,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Calendar,
  Code2,
  ShieldCheck,
  Zap,
  HelpCircle,
} from 'lucide-react';
import PortfolioLayout from '../components/layout/PortfolioLayout';
import SEO from '../components/SEO';
import { personalInfo } from '../data/content';

type LegalTab = 'all' | 'terms' | 'commercial' | 'milestones' | 'maintenance' | 'privacy';

interface TabItem {
  id: LegalTab;
  label: string;
  icon: React.ElementType;
}

const TABS: TabItem[] = [
  { id: 'all', label: 'All Terms', icon: Layers },
  { id: 'terms', label: 'Copyright & IP', icon: Scale },
  { id: 'commercial', label: 'Startup & Pricing', icon: DollarSign },
  { id: 'milestones', label: 'Payment Schedule', icon: Clock },
  { id: 'maintenance', label: 'Maintenance Scope', icon: ShieldCheck },
  { id: 'privacy', label: 'Privacy & NDA', icon: Lock },
];

export default function Terms() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<LegalTab>('all');

  // Automatically activate the Privacy tab if navigated to /privacy or #privacy
  useEffect(() => {
    if (location.pathname === '/privacy' || location.hash === '#privacy') {
      setActiveTab('privacy');
    } else if (location.hash === '#commercial') {
      setActiveTab('commercial');
    } else if (location.hash === '#milestones') {
      setActiveTab('milestones');
    } else if (location.hash === '#terms') {
      setActiveTab('terms');
    } else if (location.hash === '#maintenance') {
      setActiveTab('maintenance');
    }
  }, [location.pathname, location.hash]);

  const lastUpdated = 'November 2026';

  return (
    <>
      <SEO
        title={location.pathname === '/privacy' ? 'Privacy Policy & NDA' : 'Terms & Conditions | Commercial Terms'}
        description="Comprehensive Terms of Service, Copyright and Originality Protections, Startup Free Prototype Initiative, Milestone Payment Policies, and Privacy Protocol by Md Rakibujjaman Adib."
      />

      <PortfolioLayout
        pageLabel={location.pathname === '/privacy' ? 'Privacy & NDA' : 'Terms & Conditions'}
        hideShowcaseOnMobile={false}
        footerSocialMode="all"
        showcaseChildren={
          <div className="relative w-full h-full flex flex-col justify-between p-8 sm:p-10 select-none bg-black overflow-hidden">
            {/* Ambient Background Glow */}
            <div
              className="absolute -top-24 -left-24 w-80 h-80 rounded-full blur-[100px] pointer-events-none opacity-25"
              style={{ background: 'radial-gradient(circle, #e62e05 0%, transparent 70%)' }}
            />
            <div
              className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full blur-[100px] pointer-events-none opacity-20"
              style={{ background: 'radial-gradient(circle, #3b82f6 0%, transparent 70%)' }}
            />

            {/* Top Emblem & Studio Meta */}
            <div className="relative z-10 flex items-center justify-between">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
                <Shield size={14} className="text-[#e62e05]" />
                <span className="text-[11px] font-mono tracking-wider uppercase text-white/80">
                  Legal &amp; Compliance
                </span>
              </div>
              <span className="text-[11px] font-mono text-white/40">v2.4 &bull; 2026</span>
            </div>

            {/* Center Visual Art / Typography */}
            <div className="relative z-10 my-auto py-8">
              <div className="w-12 h-12 rounded-2xl bg-[#e62e05]/10 border border-[#e62e05]/30 flex items-center justify-center text-[#e62e05] mb-6">
                <Scale size={24} />
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight mb-3">
                Transparent Commercial Standards &amp; Creative Integrity
              </h2>
              <p className="text-sm text-[#a1a1aa] leading-relaxed font-sans">
                Clear milestones, intellectual property boundaries, and transparent partnership terms designed for high-performing engineering collaborations worldwide.
              </p>
            </div>

            {/* Bottom Info Pills */}
            <div className="relative z-10 pt-6 border-t border-white/10 flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs font-mono text-white/60">
                <span>Governing Jurisdiction:</span>
                <span className="text-white font-medium">Bangladesh &amp; Berne Convention</span>
              </div>
              <div className="flex items-center justify-between text-xs font-mono text-white/60">
                <span>Commercial Retainers:</span>
                <span className="text-white font-medium">Milestone-Aligned</span>
              </div>
              <div className="flex items-center justify-between text-xs font-mono text-white/60">
                <span>Free Startup Prototype:</span>
                <span className="text-[#10b981] font-medium">Available</span>
              </div>
            </div>
          </div>
        }
      >
        {/* ========================================================
            HERO INTRO CARD
           ======================================================== */}
        <section
          className="vb-card p-6 sm:p-10 md:p-12 relative overflow-hidden"
          aria-label="Terms and Conditions Header"
        >
          {/* Subtle Ambient Accent */}
          <div
            className="absolute top-0 right-0 w-72 h-72 rounded-full blur-[90px] pointer-events-none opacity-15"
            style={{ background: 'radial-gradient(circle, #e62e05 0%, transparent 70%)' }}
          />

          <div className="relative z-10">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--vb-subpanel)] border border-[var(--vb-border)] text-xs font-mono text-[var(--vb-text-muted)] mb-5">
              <FileText size={13} className="text-[#e62e05]" />
              <span>Legal Notice &bull; Last Revised {lastUpdated}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[var(--vb-text)] mb-5 leading-[1.15]">
              Terms, Commercial Policies &amp; Privacy
            </h1>

            <p className="text-base sm:text-lg text-[var(--vb-text-muted)] max-w-3xl leading-relaxed font-sans mb-8">
              Welcome to the professional studio and engineering portfolio of <strong className="text-[var(--vb-text)]">Md Rakibujjaman Adib</strong>. 
              These terms establish our mutual rights, copyright boundaries, startup prototype initiatives, dynamic global pricing, milestone payment policies, and data privacy commitments.
            </p>

            {/* Interactive Filter Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-t border-[var(--vb-border)] pt-6">
              {TABS.map(tab => {
                const Icon = tab.icon;
                const isSelected = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 whitespace-nowrap cursor-pointer select-none ${
                      isSelected
                        ? 'bg-[var(--vb-text)] text-[var(--vb-bg)] shadow-md'
                        : 'bg-[var(--vb-subpanel)] text-[var(--vb-text-muted)] hover:text-[var(--vb-text)] hover:bg-[var(--vb-panel)] border border-[var(--vb-border)]'
                    }`}
                  >
                    <Icon size={14} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* ========================================================
            SECTION 1: INTELLECTUAL PROPERTY & ORIGINALITY COPYRIGHT ACT
           ======================================================== */}
        {(activeTab === 'all' || activeTab === 'terms') && (
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="vb-card p-6 sm:p-10 md:p-12 relative overflow-hidden"
            id="terms"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#e62e05]/10 border border-[#e62e05]/30 flex items-center justify-center text-[#e62e05]">
                <Scale size={20} />
              </div>
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-[var(--vb-text-muted)]">
                  Section 01
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-[var(--vb-text)] tracking-tight">
                  Intellectual Property &amp; Originality Copyright Notice
                </h2>
              </div>
            </div>

            <div className="space-y-4 text-sm sm:text-base text-[var(--vb-text-muted)] leading-relaxed font-sans">
              <div className="p-4 sm:p-5 rounded-2xl bg-[var(--vb-subpanel)] border border-[var(--vb-border)] text-sm space-y-3">
                <div className="flex items-start gap-3">
                  <Sparkles size={18} className="text-[#e62e05] shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-[var(--vb-text)] mb-1">
                      UI Layout Inspiration &amp; Aesthetic Architecture
                    </h3>
                    <p className="text-[var(--vb-text-muted)] leading-relaxed">
                      The user interface layout, curved container ergonomics, and navigation architecture of this website are inspired by external, world-class digital design references. We celebrate and honor innovative web design language while engineering all underlying components, interactive hooks, responsive styling, and animation orchestrations in-house from scratch.
                    </p>
                  </div>
                </div>
              </div>

              <p>
                All original materials published on this website—including but not limited to <strong className="text-[var(--vb-text)]">written project breakdowns, technical case studies, computer graphics renders, 3D CGI models, animation reels, brand identity assets, algorithmic source code, and photography</strong>—are the exclusive intellectual property of <strong className="text-[var(--vb-text)]">Md Rakibujjaman Adib</strong> (and/or designated client partners who hold authorized commercial licensing).
              </p>

              <p>
                These works are protected under the <strong className="text-[var(--vb-text)]">Copyright Act of Bangladesh (Act No. XXVIII of 2000, as amended)</strong> and international intellectual property conventions, including the <strong className="text-[var(--vb-text)]">Berne Convention for the Protection of Literary and Artistic Works</strong> and the <strong className="text-[var(--vb-text)]">World Intellectual Property Organization (WIPO)</strong> Copyright Treaties.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-4 rounded-xl bg-[var(--vb-subpanel)] border border-[var(--vb-border)]">
                  <div className="text-xs font-mono uppercase text-[#e62e05] mb-1 font-semibold">Strictly Prohibited</div>
                  <p className="text-xs text-[var(--vb-text-muted)] leading-relaxed">
                    Automated web scraping, unlicensed reproduction, mirroring, or commercial repackaging of our 3D renders, project narratives, or technical blogs without prior written consent.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-[var(--vb-subpanel)] border border-[var(--vb-border)]">
                  <div className="text-xs font-mono uppercase text-[#10b981] mb-1 font-semibold">Permitted Educational Use</div>
                  <p className="text-xs text-[var(--vb-text-muted)] leading-relaxed">
                    Referencing project case studies or technical insights for non-commercial educational discourse, academic research, or reviews with explicit canonical attribution and backlink to this domain.
                  </p>
                </div>
              </div>
            </div>
          </motion.section>
        )}

        {/* ========================================================
            SECTION 2: STARTUP FREE PROTOTYPE & DYNAMIC GLOBAL PRICING
           ======================================================== */}
        {(activeTab === 'all' || activeTab === 'commercial') && (
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="vb-card p-6 sm:p-10 md:p-12 relative overflow-hidden"
            id="commercial"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#e62e05]/10 border border-[#e62e05]/30 flex items-center justify-center text-[#e62e05]">
                <DollarSign size={20} />
              </div>
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-[var(--vb-text-muted)]">
                  Section 02
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-[var(--vb-text)] tracking-tight">
                  Startup Free Prototype Initiative &amp; Dynamic Global Pricing
                </h2>
              </div>
            </div>

            <div className="space-y-6 text-sm sm:text-base text-[var(--vb-text-muted)] leading-relaxed font-sans">
              {/* Highlight Box: Startup Free Prototype */}
              <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-[var(--vb-subpanel)] to-[var(--vb-panel)] border border-[var(--vb-border)] relative overflow-hidden">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#10b981]/10 border border-[#10b981]/30 text-xs font-mono text-[#10b981] mb-3">
                  <Sparkles size={13} />
                  <span>Early-Stage Venture Guarantee</span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-[var(--vb-text)] mb-2">
                  Complimentary Aesthetic Prototype for New Startups
                </h3>
                <p className="text-sm text-[var(--vb-text-muted)] leading-relaxed mb-4">
                  We believe visionary founders deserve world-class digital representation from day one. If your enterprise is an early-stage startup and does not currently own a pre-existing website, <strong className="text-[var(--vb-text)]">we will design your initial visual prototype completely free of charge</strong>, incorporating our signature in-house design aesthetics, modern typography, and high-impact layout structure.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 pt-2 text-xs sm:text-sm">
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 size={16} className="text-[#10b981] shrink-0 mt-0.5" />
                    <span><strong className="text-[var(--vb-text)]">Zero Initial Risk:</strong> Evaluate our aesthetic vision and ergonomic direction before committing any capital.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 size={16} className="text-[#10b981] shrink-0 mt-0.5" />
                    <span><strong className="text-[var(--vb-text)]">Seamless Transition:</strong> If you approve the prototype, we proceed to bespoke engineering under our standard milestone terms.</span>
                  </div>
                </div>
              </div>

              {/* Dynamic Global Pricing Policy */}
              <div>
                <h3 className="text-base sm:text-lg font-bold text-[var(--vb-text)] mb-2">
                  No Fixed or Rigid Packages: Tailored Global Market Estimation
                </h3>
                <p className="mb-4">
                  Operating in a diverse, borderless global market spanning North America, Europe, Asia, and emerging tech hubs, we do not force clients into rigid, generic pricing tiers. Every project represents a distinct technical and aesthetic challenge. Our commercial proposals are dynamically calculated based on:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-4 rounded-xl bg-[var(--vb-subpanel)] border border-[var(--vb-border)]">
                    <div className="w-8 h-8 rounded-lg bg-[#e62e05]/10 text-[#e62e05] flex items-center justify-center mb-3">
                      <Code2 size={16} />
                    </div>
                    <h4 className="font-semibold text-xs sm:text-sm text-[var(--vb-text)] mb-1">Degree of Customization</h4>
                    <p className="text-xs text-[var(--vb-text-muted)] leading-relaxed">
                      Bespoke 3D CGI integration, custom WebGL/Three.js shaders, animated typography, and proprietary interactive controls.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-[var(--vb-subpanel)] border border-[var(--vb-border)]">
                    <div className="w-8 h-8 rounded-lg bg-[#3b82f6]/10 text-[#3b82f6] flex items-center justify-center mb-3">
                      <Zap size={16} />
                    </div>
                    <h4 className="font-semibold text-xs sm:text-sm text-[var(--vb-text)] mb-1">Architectural Features</h4>
                    <p className="text-xs text-[var(--vb-text-muted)] leading-relaxed">
                      Edge IoT telemetry, OCR receipt ingestion, multimodal AI pipelines, multi-lingual CMS, and real-time backend state.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-[var(--vb-subpanel)] border border-[var(--vb-border)]">
                    <div className="w-8 h-8 rounded-lg bg-[#8b5cf6]/10 text-[#8b5cf6] flex items-center justify-center mb-3">
                      <Layers size={16} />
                    </div>
                    <h4 className="font-semibold text-xs sm:text-sm text-[var(--vb-text)] mb-1">Traffic &amp; Scale Targets</h4>
                    <p className="text-xs text-[var(--vb-text-muted)] leading-relaxed">
                      Projected concurrent visitors, CDN multi-region edge distribution, database query caching, and high-availability SLA targets.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>
        )}

        {/* ========================================================
            SECTION 3: MILESTONE PAYMENT POLICY & LATE PENALTY TERMS
           ======================================================== */}
        {(activeTab === 'all' || activeTab === 'milestones') && (
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="vb-card p-6 sm:p-10 md:p-12 relative overflow-hidden"
            id="milestones"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#e62e05]/10 border border-[#e62e05]/30 flex items-center justify-center text-[#e62e05]">
                <Clock size={20} />
              </div>
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-[var(--vb-text-muted)]">
                  Section 03
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-[var(--vb-text)] tracking-tight">
                  Milestone Payment Policy &amp; Delivery Terms
                </h2>
              </div>
            </div>

            <p className="text-sm sm:text-base text-[var(--vb-text-muted)] leading-relaxed font-sans mb-6">
              To ensure full alignment, transparent deliverables, and financial security for both parties, all commercial engineering contracts follow an equitable 4-stage milestone payment schedule:
            </p>

            {/* Visual Milestone Stepper */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {/* Milestone 1 */}
              <div className="p-5 rounded-2xl bg-[var(--vb-subpanel)] border border-[var(--vb-border)] flex flex-col justify-between relative group hover:border-[#e62e05]/40 transition-colors">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono text-[var(--vb-text-muted)]">Phase 01</span>
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold font-mono bg-[#e62e05]/15 text-[#e62e05]">
                      20%
                    </span>
                  </div>
                  <h3 className="font-bold text-base text-[var(--vb-text)] mb-2">Contract Signing</h3>
                  <p className="text-xs text-[var(--vb-text-muted)] leading-relaxed">
                    Initial retainer deposit due upon mutual execution of the master service agreement prior to sprint kickoff.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[var(--vb-border)] text-[11px] font-mono text-[var(--vb-text-muted)]">
                  Total Paid: <strong className="text-[var(--vb-text)]">20%</strong>
                </div>
              </div>

              {/* Milestone 2 */}
              <div className="p-5 rounded-2xl bg-[var(--vb-subpanel)] border border-[var(--vb-border)] flex flex-col justify-between relative group hover:border-[#e62e05]/40 transition-colors">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono text-[var(--vb-text-muted)]">Phase 02</span>
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold font-mono bg-[#e62e05]/15 text-[#e62e05]">
                      50%
                    </span>
                  </div>
                  <h3 className="font-bold text-base text-[var(--vb-text)] mb-2">Visual Establishment</h3>
                  <p className="text-xs text-[var(--vb-text-muted)] leading-relaxed">
                    Due upon delivery and sign-off of core visual design, interactive design system, and high-fidelity layout.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[var(--vb-border)] text-[11px] font-mono text-[var(--vb-text-muted)]">
                  Total Paid: <strong className="text-[var(--vb-text)]">70%</strong>
                </div>
              </div>

              {/* Milestone 3 */}
              <div className="p-5 rounded-2xl bg-[var(--vb-subpanel)] border border-[var(--vb-border)] flex flex-col justify-between relative group hover:border-[#e62e05]/40 transition-colors">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono text-[var(--vb-text-muted)]">Phase 03</span>
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold font-mono bg-[#e62e05]/15 text-[#e62e05]">
                      20%
                    </span>
                  </div>
                  <h3 className="font-bold text-base text-[var(--vb-text)] mb-2">Live Deployment</h3>
                  <p className="text-xs text-[var(--vb-text-muted)] leading-relaxed">
                    Due immediately upon successful production staging and live public deployment to the client’s domain.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[var(--vb-border)] text-[11px] font-mono text-[var(--vb-text-muted)]">
                  Total Paid: <strong className="text-[var(--vb-text)]">90%</strong>
                </div>
              </div>

              {/* Milestone 4 */}
              <div className="p-5 rounded-2xl bg-[var(--vb-subpanel)] border border-[var(--vb-border)] flex flex-col justify-between relative group hover:border-[#e62e05]/40 transition-colors">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono text-[var(--vb-text-muted)]">Phase 04</span>
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold font-mono bg-[#10b981]/15 text-[#10b981]">
                      10%
                    </span>
                  </div>
                  <h3 className="font-bold text-base text-[var(--vb-text)] mb-2">Retention Release</h3>
                  <p className="text-xs text-[var(--vb-text-muted)] leading-relaxed">
                    Final retention balance due following the successful conclusion of the 2-week complimentary maintenance window.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[var(--vb-border)] text-[11px] font-mono text-[var(--vb-text-muted)]">
                  Total Paid: <strong className="text-[var(--vb-text)]">100%</strong>
                </div>
              </div>
            </div>

            {/* Late Payment Penalty Alert Box */}
            <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-sm flex items-start gap-3">
              <AlertTriangle size={18} className="shrink-0 mt-0.5 text-amber-500" />
              <div>
                <strong className="font-semibold block mb-1">
                  Late Settlement Penalty Clause (Post-Deployment Grace Period):
                </strong>
                <p className="text-xs sm:text-sm text-[var(--vb-text-muted)] leading-relaxed">
                  Upon live production deployment, the 20% deployment milestone (bringing total compensation to 90%) is due immediately. If settlement is <strong className="text-[var(--vb-text)]">delayed for more than seven (7) calendar days</strong> following deployment without prior written mutual agreement, late payment penalties of <strong className="text-[var(--vb-text)]">5% weekly accrued interest</strong> may be levied, and we reserve the right to temporarily pause ongoing services or restrict repository/hosting access until settled.
                </p>
              </div>
            </div>
          </motion.section>
        )}

        {/* ========================================================
            SECTION 4: COMPLIMENTARY MAINTENANCE & SCOPE BOUNDARIES
           ======================================================== */}
        {(activeTab === 'all' || activeTab === 'maintenance') && (
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="vb-card p-6 sm:p-10 md:p-12 relative overflow-hidden"
            id="maintenance"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#e62e05]/10 border border-[#e62e05]/30 flex items-center justify-center text-[#e62e05]">
                <ShieldCheck size={20} />
              </div>
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-[var(--vb-text-muted)]">
                  Section 04
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-[var(--vb-text)] tracking-tight">
                  Two-Week Complimentary Maintenance &amp; Scope Boundaries
                </h2>
              </div>
            </div>

            <div className="space-y-4 text-sm sm:text-base text-[var(--vb-text-muted)] leading-relaxed font-sans">
              <p>
                Every deployed commercial web project includes <strong className="text-[var(--vb-text)]">two (2) full weeks of complimentary post-launch developer maintenance</strong> to ensure total stability under real-world traffic conditions.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {/* What is covered */}
                <div className="p-5 rounded-2xl bg-[var(--vb-subpanel)] border border-[var(--vb-border)]">
                  <div className="flex items-center gap-2 text-xs font-mono uppercase text-[#10b981] font-semibold mb-3">
                    <CheckCircle2 size={16} />
                    <span>Included in Complimentary 2-Week Window</span>
                  </div>
                  <ul className="space-y-2 text-xs sm:text-sm text-[var(--vb-text-muted)]">
                    <li className="flex items-start gap-2">
                      <span className="text-[#10b981] font-bold">&bull;</span>
                      <span>Debugging functional code anomalies, runtime crashes, and script regressions.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#10b981] font-bold">&bull;</span>
                      <span>Fixing cross-browser UI rendering glitches (Safari, Chrome, Firefox, Edge, Mobile WebKit).</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#10b981] font-bold">&bull;</span>
                      <span>Minor typographical edits, image swaps, or cosmetic adjustments observed by either party.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#10b981] font-bold">&bull;</span>
                      <span>Verifying analytics telemetry, Web3Forms endpoints, and contact pipeline delivery.</span>
                    </li>
                  </ul>
                </div>

                {/* What is excluded */}
                <div className="p-5 rounded-2xl bg-[var(--vb-subpanel)] border border-[var(--vb-border)]">
                  <div className="flex items-center gap-2 text-xs font-mono uppercase text-[#e62e05] font-semibold mb-3">
                    <AlertTriangle size={16} />
                    <span>Excluded (Requires Billable Change Order)</span>
                  </div>
                  <ul className="space-y-2 text-xs sm:text-sm text-[var(--vb-text-muted)]">
                    <li className="flex items-start gap-2">
                      <span className="text-[#e62e05] font-bold">&bull;</span>
                      <span>Major alterations to fundamental system architecture, database models, or backend services.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#e62e05] font-bold">&bull;</span>
                      <span>Substantial visual overhauls, new page templates, or wholesale design alterations.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#e62e05] font-bold">&bull;</span>
                      <span>Restructuring webflows, multi-step transaction checkouts, or adding 3rd-party SaaS integrations.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#e62e05] font-bold">&bull;</span>
                      <span>Creating brand-new 3D assets, custom rigging, or complex animation sequences not in the initial brief.</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Requirement: Clear Brief */}
              <div className="p-4 rounded-xl bg-[var(--vb-subpanel)] border border-[var(--vb-border)] text-xs sm:text-sm">
                <div className="flex items-start gap-2.5">
                  <FileText size={16} className="text-[#e62e05] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[var(--vb-text)]">Mandatory Project Brief Requirement:</strong>
                    <p className="text-[var(--vb-text-muted)] mt-0.5 leading-relaxed">
                      To prevent scope creep and ensure deliverable clarity, a comprehensive, mutually confirmed <strong className="text-[var(--vb-text)]">Project Brief &amp; Scope of Work</strong> is required prior to project kickoff. Any features requested outside this brief will be quoted transparently as a separate milestone or post-launch enhancement.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>
        )}

        {/* ========================================================
            SECTION 5: PRIVACY POLICY & MUTUAL NON-DISCLOSURE
           ======================================================== */}
        {(activeTab === 'all' || activeTab === 'privacy') && (
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="vb-card p-6 sm:p-10 md:p-12 relative overflow-hidden"
            id="privacy"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#e62e05]/10 border border-[#e62e05]/30 flex items-center justify-center text-[#e62e05]">
                <Lock size={20} />
              </div>
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-[var(--vb-text-muted)]">
                  Section 05
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-[var(--vb-text)] tracking-tight">
                  Privacy Policy, Confidentiality &amp; Portfolio Showcase Rights
                </h2>
              </div>
            </div>

            <div className="space-y-5 text-sm sm:text-base text-[var(--vb-text-muted)] leading-relaxed font-sans">
              <p>
                We hold commercial integrity and intellectual discretion to the highest standard. This policy governs how private commercial data is handled, as well as the terms governing public showcase rights:
              </p>

              {/* Confidentiality Pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-[var(--vb-subpanel)] border border-[var(--vb-border)]">
                  <div className="w-8 h-8 rounded-lg bg-[#e62e05]/10 text-[#e62e05] flex items-center justify-center mb-3">
                    <Lock size={16} />
                  </div>
                  <h3 className="font-bold text-sm sm:text-base text-[var(--vb-text)] mb-1.5">
                    Strict Commercial Confidentiality
                  </h3>
                  <p className="text-xs sm:text-sm text-[var(--vb-text-muted)] leading-relaxed">
                    All contractual terms, bespoke pricing structures, technical schematics, business strategies, and internal communication transcripts (via email, Slack, Discord, or WhatsApp) are strictly confidential. We do not disclose internal client pricing or commercial discussions to any third party.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-[var(--vb-subpanel)] border border-[var(--vb-border)]">
                  <div className="w-8 h-8 rounded-lg bg-[#10b981]/10 text-[#10b981] flex items-center justify-center mb-3">
                    <ShieldCheck size={16} />
                  </div>
                  <h3 className="font-bold text-sm sm:text-base text-[var(--vb-text)] mb-1.5">
                    Data Security &amp; Asset Protection
                  </h3>
                  <p className="text-xs sm:text-sm text-[var(--vb-text-muted)] leading-relaxed">
                    Client credentials, API keys, database access tokens, and staging environment credentials provided to us are handled with rigorous security measures (environment variable isolation, encrypted transfers, zero plaintext backups) and purged following contract conclusion.
                  </p>
                </div>
              </div>

              {/* Showcase Rights & NDA Buyout Option */}
              <div className="p-5 sm:p-6 rounded-2xl bg-[var(--vb-subpanel)] border border-[var(--vb-border)]">
                <div className="flex items-center gap-2 text-xs font-mono uppercase text-[#e62e05] font-semibold mb-2">
                  <Eye size={16} />
                  <span>Portfolio Showcase Rights &amp; Non-Disclosure (NDA) Buyout</span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-[var(--vb-text)] mb-2">
                  Creative Rights to Showcase Work
                </h3>
                <p className="text-xs sm:text-sm text-[var(--vb-text-muted)] leading-relaxed mb-4">
                  As an engineering and digital design studio, our portfolio is the lifeblood of our practice. <strong className="text-[var(--vb-text)]">We reserve the inherent right to showcase the projects, 3D renders, video animations, interface designs, and case studies we build</strong> across our portfolio website, social channels, and technical retrospectives, celebrating the shared creative achievement.
                </p>

                <div className="p-4 rounded-xl bg-[var(--vb-panel)] border border-[var(--vb-border)] text-xs sm:text-sm">
                  <div className="flex items-start gap-2.5">
                    <Sparkles size={16} className="text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-[var(--vb-text)]">Client NDA / White-Label Buyout Option:</strong>
                      <p className="text-[var(--vb-text-muted)] mt-1 leading-relaxed">
                        If your organization requires absolute secrecy, strict non-disclosure (NDA), or white-label exclusivity that precludes us from publicly showcasing the work, <strong className="text-[var(--vb-text)]">you may reclaim and purchase these rights via an NDA Buyout Agreement</strong>. An additional exclusivity fee (agreed upon prior to contract signing) will be added to the project budget to secure perpetual confidentiality.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>
        )}

        {/* ========================================================
            SECTION 6: CONTACT & INQUIRIES CARD
           ======================================================== */}
        <section
          className="vb-card p-6 sm:p-10 md:p-12 relative overflow-hidden"
          aria-label="Legal Inquiries"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-[#e62e05] font-semibold mb-1 block">
                Have Questions or Need a Custom Contract?
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[var(--vb-text)] tracking-tight mb-2">
                Let’s Discuss Your Project Scope
              </h2>
              <p className="text-sm text-[var(--vb-text-muted)] max-w-xl leading-relaxed">
                Whether you are an early-stage startup looking for a complimentary visual prototype or an enterprise requiring bespoke AI or 3D web engineering, we are here to collaborate.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              <Link
                to="/contact"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full bg-[var(--vb-text)] text-[var(--vb-bg)] font-semibold text-sm hover:bg-[#e62e05] hover:text-white transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-0.5 select-none"
              >
                <span>Initiate Project Brief</span>
                <ArrowRight size={15} />
              </Link>
              <a
                href={`mailto:${personalInfo.email}?subject=Legal%20or%20Commercial%20Inquiry`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-full bg-[var(--vb-subpanel)] text-[var(--vb-text)] border border-[var(--vb-border)] hover:bg-[var(--vb-panel)] transition-colors text-sm font-medium select-none"
              >
                <span>Email Legal Team</span>
              </a>
            </div>
          </div>
        </section>
      </PortfolioLayout>
    </>
  );
}
