import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle,
  Copy,
  Check,
  Calendar,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react';
import { personalInfo } from '../data/content';
import VisbeyondLayout from '../components/layout/VisbeyondLayout';
import SEO from '../components/SEO';

export default function Contact() {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('access_key', 'fc1e1fb5-3901-4624-8fae-419df20514b2');
      formData.append('name', formState.name);
      formData.append('email', formState.email);
      formData.append('message', formState.message);

      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setIsSubmitted(true);
        setFormState({ name: '', email: '', message: '' });
      } else {
        setError(data.message || 'Something went wrong. Please try again.');
      }
    } catch {
      setError('Network error. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(personalInfo.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <SEO
        title="Contact"
        description="Get in touch with Md Rakibujjaman Adib for AI architecture, 3D design, or full-stack web development projects."
      />
      <VisbeyondLayout
        pageLabel="Contact us"
        showcaseImage="/images/visbeyond/EImFqIXTq1f40jZpM4XT7MbqCh4.png"
        showcaseAlt="Contact Showcase"
      >
        {/* Header & Quick Actions Card */}
        <section className="vb-card p-6 md:p-8" aria-label="Contact Header">
          {/* Status Indicator */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-medium mb-4">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Currently Onboarding New Projects
          </div>

          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-3 leading-[1.1]">
            Let&apos;s Get in Touch!
          </h1>

          <p className="text-base md:text-lg text-[#a1a1aa] leading-relaxed mb-6 font-sans">
            Ready to build a distinctive digital presence, photorealistic 3D visuals, or an AI-powered system? Let&apos;s discuss your vision.
          </p>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-white/10">
            <a
              href={`mailto:${personalInfo.email}`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#e62e05] text-white font-semibold text-xs tracking-wider uppercase hover:brightness-110 transition-all shadow-lg shadow-[#e62e05]/20"
            >
              <Calendar size={15} /> Book a Call
            </a>

            <span className="text-xs font-mono text-[#71717a] uppercase">or</span>

            <button
              type="button"
              onClick={handleCopyEmail}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#141414] border border-white/10 text-white font-semibold text-xs tracking-wider uppercase hover:border-white/30 transition-all"
            >
              {copied ? (
                <>
                  <Check size={14} className="text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy size={14} />
                  <span>Copy Email</span>
                </>
              )}
            </button>
          </div>
        </section>

        {/* Contact Form Card */}
        <section className="vb-card p-6 md:p-8" aria-label="Send a message">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#e62e05]">
              Direct Inquiry
            </span>
          </div>

          <h2 className="text-2xl font-bold tracking-tight text-white mb-6">
            Send a Message
          </h2>

          {isSubmitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center"
            >
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={28} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Message Delivered</h3>
              <p className="text-sm text-[#a1a1aa] mb-6 font-sans">
                Thank you for reaching out. I will respond to your message within 24 hours.
              </p>
              <button
                type="button"
                onClick={() => setIsSubmitted(false)}
                className="px-5 py-2 rounded-full bg-[#141414] border border-white/10 text-white text-xs font-semibold hover:border-white/30 transition-colors"
              >
                Send Another Note
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="contact-name"
                  className="block text-xs font-mono uppercase tracking-wider text-[#a1a1aa] mb-2"
                >
                  Your Name
                </label>
                <input
                  type="text"
                  id="contact-name"
                  name="name"
                  value={formState.name}
                  onChange={e => setFormState({ ...formState, name: e.target.value })}
                  required
                  placeholder="e.g. Alex Morgan"
                  className="w-full bg-[#141414] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-[#71717a] focus:outline-none focus:border-[#e62e05] transition-colors"
                />
              </div>

              <div>
                <label
                  htmlFor="contact-email"
                  className="block text-xs font-mono uppercase tracking-wider text-[#a1a1aa] mb-2"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="contact-email"
                  name="email"
                  value={formState.email}
                  onChange={e => setFormState({ ...formState, email: e.target.value })}
                  required
                  placeholder="alex@company.com"
                  className="w-full bg-[#141414] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-[#71717a] focus:outline-none focus:border-[#e62e05] transition-colors"
                />
              </div>

              <div>
                <label
                  htmlFor="contact-message"
                  className="block text-xs font-mono uppercase tracking-wider text-[#a1a1aa] mb-2"
                >
                  Project Details
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={4}
                  value={formState.message}
                  onChange={e => setFormState({ ...formState, message: e.target.value })}
                  required
                  placeholder="Tell me about your goals, timeline, and deliverables..."
                  className="w-full bg-[#141414] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-[#71717a] focus:outline-none focus:border-[#e62e05] transition-colors resize-none"
                />
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-400">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-6 rounded-xl bg-white text-black font-semibold text-xs uppercase tracking-wider hover:bg-[#e62e05] hover:text-white transition-all duration-300 shadow-md flex items-center justify-center gap-2 group disabled:opacity-50"
              >
                <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
                <Send size={14} className="group-hover:translate-x-0.5 transition-transform" />
              </button>
            </form>
          )}
        </section>

        {/* Studio Info Card */}
        <section className="vb-card p-6 md:p-8" aria-label="Studio contact information">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#e62e05]">
              Connect
            </span>
          </div>

          <h2 className="text-xl font-bold tracking-tight text-white mb-6">
            Adib Studio &bull; Creative Lab
          </h2>

          <div className="space-y-4 text-sm font-sans">
            <div className="flex items-start gap-3">
              <MapPin size={16} className="text-[#e62e05] shrink-0 mt-0.5" />
              <span className="text-[#a1a1aa]">{personalInfo.location}</span>
            </div>

            <div className="flex items-center gap-3">
              <Mail size={16} className="text-[#e62e05] shrink-0" />
              <a
                href={`mailto:${personalInfo.email}`}
                className="text-white hover:text-[#e62e05] transition-colors"
              >
                {personalInfo.email}
              </a>
            </div>

            <div className="flex items-center gap-3">
              <Phone size={16} className="text-[#e62e05] shrink-0" />
              <a
                href={`tel:${personalInfo.phone}`}
                className="text-white hover:text-[#e62e05] transition-colors"
              >
                {personalInfo.phone}
              </a>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex flex-wrap gap-2 pt-6 mt-6 border-t border-white/5">
            <a
              href={personalInfo.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#141414] border border-white/10 text-white/90 hover:border-[#e62e05] hover:text-white transition-colors"
            >
              LinkedIn
            </a>
            <a
              href={personalInfo.social.github}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#141414] border border-white/10 text-white/90 hover:border-[#e62e05] hover:text-white transition-colors"
            >
              GitHub
            </a>
            <a
              href={personalInfo.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#141414] border border-white/10 text-white/90 hover:border-[#e62e05] hover:text-white transition-colors"
            >
              Instagram
            </a>
            <a
              href={personalInfo.social.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#141414] border border-white/10 text-white/90 hover:border-[#e62e05] hover:text-white transition-colors"
            >
              Facebook
            </a>
          </div>
        </section>
      </VisbeyondLayout>
    </>
  );
}
