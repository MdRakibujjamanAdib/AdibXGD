import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Mail,
  Phone,
  Copy,
  Check,
  ArrowRight,
  CheckCircle,
  ExternalLink,
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value,
    });
  };

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
        setError(data.message || 'Something went wrong. Please reach out directly to adibx@icloud.com.');
      }
    } catch {
      setError('Network connection error. Please email directly at adibx@icloud.com.');
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
        title="Contact | Md Rakibujjaman Adib"
        description="Get in touch with Md Rakibujjaman Adib for AI architectures, full-stack web platforms, 3D CGI visuals, or Unity serious game development."
      />

      <VisbeyondLayout
        pageLabel="Contact"
        hideShowcaseOnMobile={false}
        footerSocialMode="all"
        showcaseChildren={
          <div className="relative w-full h-full overflow-hidden select-none bg-[var(--vb-bg)]">
            <img
              src="/MdRakibujamanAdib.jpg?v=3"
              alt="Md Rakibujjaman Adib"
              className="w-full h-full object-cover"
              style={{ objectPosition: 'center 45%' }}
            />
          </div>
        }
      >
        {/* ========================================================
            MAIN CONTACT CARD (Ultra-Clean Minimalist Aesthetic)
           ======================================================== */}
        <div className="bg-[var(--vb-panel)] border border-[var(--vb-border)] rounded-[var(--vb-radius)] p-6 sm:p-10 md:p-14 transition-colors">
          {/* Header Info */}
          <div className="mb-12">
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#e62e05] block mb-3 font-semibold">
              Get in Touch
            </span>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-[var(--vb-text)] mb-4 leading-[1.05]">
              Let&apos;s Talk.
            </h1>

            <p className="text-base sm:text-lg text-[var(--vb-text-muted)] max-w-xl font-sans leading-relaxed mb-6">
              Have a project in mind, an autonomous AI system to architect, or an interactive digital experience to build? Send a note below or reach out directly.
            </p>

            <div className="flex flex-wrap items-center gap-4 text-sm font-sans pt-2">
              <a
                href={`mailto:${personalInfo.email}`}
                className="font-bold text-[var(--vb-text)] hover:text-[#e62e05] transition-colors"
              >
                {personalInfo.email}
              </a>

              <span className="text-[var(--vb-border)]">&bull;</span>

              <button
                type="button"
                onClick={handleCopyEmail}
                className="text-xs font-mono uppercase tracking-wider text-[var(--vb-text-muted)] hover:text-[#e62e05] transition-colors cursor-pointer inline-flex items-center gap-1.5"
              >
                {copied ? (
                  <>
                    <Check size={12} className="text-emerald-500" />
                    <span className="text-emerald-500">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy size={12} />
                    <span>Copy Email</span>
                  </>
                )}
              </button>

              <span className="text-[var(--vb-border)]">&bull;</span>

              <a
                href={`tel:${personalInfo.phone}`}
                className="text-xs font-mono text-[var(--vb-text-muted)] hover:text-[#e62e05] transition-colors"
              >
                (+880) 1303031080
              </a>
            </div>
          </div>

          {/* Minimal Underline Contact Form (Matching Exact User Reference) */}
          {isSubmitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25 }}
              className="py-12 text-center border-t border-[var(--vb-border)]"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto mb-4 border border-emerald-500/20">
                <CheckCircle size={32} />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[var(--vb-text)] mb-2">
                Message Sent.
              </h2>
              <p className="text-sm sm:text-base text-[var(--vb-text-muted)] mb-8 font-sans max-w-md mx-auto">
                Thank you for reaching out. I&apos;ll get back to you within 24 hours.
              </p>
              <button
                type="button"
                onClick={() => setIsSubmitted(false)}
                className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[var(--vb-text)] hover:text-[#e62e05] transition-colors cursor-pointer"
              >
                <span>Send another message</span>
                <ArrowRight size={16} />
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-10 border-t border-[var(--vb-border)] pt-10">
              {/* Field 1: NAME */}
              <div className="group">
                <label
                  htmlFor="contact-name"
                  className="block text-xs font-mono uppercase tracking-[0.2em] text-[var(--vb-text-muted)] mb-2 font-medium"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="contact-name"
                  name="name"
                  value={formState.name}
                  onChange={handleChange}
                  required
                  placeholder="John Doe"
                  className="w-full bg-transparent border-b-2 border-[var(--vb-border)] focus:border-[#e62e05] pb-4 pt-1 text-xl sm:text-2xl md:text-3xl font-bold text-[var(--vb-text)] placeholder-[var(--vb-text-muted)]/30 focus:outline-none transition-colors"
                />
              </div>

              {/* Field 2: EMAIL */}
              <div className="group">
                <label
                  htmlFor="contact-email"
                  className="block text-xs font-mono uppercase tracking-[0.2em] text-[var(--vb-text-muted)] mb-2 font-medium"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="contact-email"
                  name="email"
                  value={formState.email}
                  onChange={handleChange}
                  required
                  placeholder="john@example.com"
                  className="w-full bg-transparent border-b-2 border-[var(--vb-border)] focus:border-[#e62e05] pb-4 pt-1 text-xl sm:text-2xl md:text-3xl font-bold text-[var(--vb-text)] placeholder-[var(--vb-text-muted)]/30 focus:outline-none transition-colors"
                />
              </div>

              {/* Field 3: MESSAGE */}
              <div className="group">
                <label
                  htmlFor="contact-message"
                  className="block text-xs font-mono uppercase tracking-[0.2em] text-[var(--vb-text-muted)] mb-2 font-medium"
                >
                  Message
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={4}
                  value={formState.message}
                  onChange={handleChange}
                  required
                  placeholder="Tell me about your project..."
                  className="w-full bg-transparent border-b-2 border-[var(--vb-border)] focus:border-[#e62e05] pb-4 pt-1 text-xl sm:text-2xl md:text-3xl font-bold text-[var(--vb-text)] placeholder-[var(--vb-text-muted)]/30 focus:outline-none transition-colors resize-none leading-relaxed"
                />
              </div>

              {error && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-500 font-sans">
                  {error}
                </div>
              )}

              {/* Action Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-3 text-xl sm:text-2xl md:text-3xl font-bold text-[var(--vb-text)] hover:text-[#e62e05] transition-colors cursor-pointer disabled:opacity-50 group select-none"
                >
                  <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
                  <ArrowRight
                    size={28}
                    className="group-hover:translate-x-2 transition-transform text-[#e62e05]"
                  />
                </button>
              </div>
            </form>
          )}
        </div>
      </VisbeyondLayout>
    </>
  );
}
