import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowUpRight,
  Github,
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
} from 'lucide-react';
import { projects } from '../data/projects';
import VisbeyondLayout from '../components/layout/VisbeyondLayout';
import SEO from '../components/SEO';
import {
  InvertedCornerTopRight,
  InvertedCornerBottomLeft,
} from '../components/ui/VisbeyondIcons';

export default function ProjectDetails() {
  const { id } = useParams();
  const project = projects.find(p => p.id === id);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Scroll to top whenever the active project changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [id]);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const prev = useCallback(() => {
    if (lightboxIndex === null || !project?.images) return;
    setLightboxIndex((lightboxIndex - 1 + project.images.length) % project.images.length);
  }, [lightboxIndex, project]);

  const next = useCallback(() => {
    if (lightboxIndex === null || !project?.images) return;
    setLightboxIndex((lightboxIndex + 1) % project.images.length);
  }, [lightboxIndex, project]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [lightboxIndex, prev, next]);

  if (!project) {
    return (
      <VisbeyondLayout pageLabel="Not Found">
        <div className="vb-case-card text-center p-12 my-8">
          <h1 className="text-3xl font-bold text-[var(--vb-text)] mb-4">Project Not Found</h1>
          <p className="text-[var(--vb-text-muted)] mb-6">The project case study you requested does not exist.</p>
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#e62e05] text-white font-medium text-sm hover:brightness-110 transition-all shadow-md"
          >
            <ArrowLeft size={16} />
            <span>Back to Projects</span>
          </Link>
        </div>
      </VisbeyondLayout>
    );
  }

  const currentIndex = projects.findIndex(p => p.id === project.id);
  const nextProject = projects[(currentIndex + 1) % projects.length];
  const allImages = project.images ?? [];

  const getEmbedUrl = (url: string) => {
    if (!url) return '';
    try {
      if (url.includes('youtube.com') || url.includes('youtu.be')) {
        let videoId = '';
        if (url.includes('youtu.be/')) {
          videoId = url.split('youtu.be/')[1]?.split('?')[0];
        } else if (url.includes('youtube.com/watch')) {
          const urlObj = new URL(url);
          videoId = urlObj.searchParams.get('v') || '';
        } else if (url.includes('youtube.com/embed/')) {
          return url;
        }
        return `https://www.youtube.com/embed/${videoId}`;
      }

      if (url.includes('facebook.com') || url.includes('fb.watch')) {
        return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=false`;
      }

      return url;
    } catch {
      return url;
    }
  };

  return (
    <>
      <SEO
        title={`${project.title} - Case Study | Md Rakibujjaman Adib`}
        description={project.summary}
        image={project.thumbnail}
        type="article"
        customKeywords={project.seo?.keywords}
        customMeta={project.seo?.meta}
      />
      <VisbeyondLayout
        pageLabel={project.title}
        showcaseImage={project.thumbnail}
        showcaseAlt={project.title}
      >
        {/* Visbeyond Card 1: Overview & Metadata Specs Bento */}
        <section className="vb-case-card" aria-label="Project Overview & Specs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-7 flex flex-col justify-between">
              <div>
                <h1 className="text-3xl sm:text-4xl xl:text-5xl font-bold tracking-tight text-[var(--vb-text)] leading-[1.1] mb-4">
                  {project.title}
                </h1>
              </div>
              <p className="text-sm md:text-base text-[var(--vb-text-muted)] leading-relaxed font-sans mt-2">
                {project.summary}
              </p>
            </div>

            <div className="lg:col-span-5 flex flex-col gap-2.5">
              <div className="vb-spec-row">
                <span className="text-xs text-[var(--vb-text-muted)] font-medium shrink-0">Year</span>
                <span className="text-xs text-[var(--vb-text)] font-semibold text-right">
                  {new Date(project.date).getFullYear() || '2024'}
                </span>
              </div>
              <div className="vb-spec-row">
                <span className="text-xs text-[var(--vb-text-muted)] font-medium shrink-0">Role</span>
                <span className="text-xs text-[var(--vb-text)] font-semibold text-right break-words">
                  {project.role || 'Design & Engineering'}
                </span>
              </div>
              <div className="vb-spec-row">
                <span className="text-xs text-[var(--vb-text-muted)] font-medium shrink-0">Service</span>
                <span className="text-xs text-[var(--vb-text)] font-semibold text-right">
                  {project.category}
                </span>
              </div>
              <div className="vb-spec-row">
                <span className="text-xs text-[var(--vb-text-muted)] font-medium shrink-0">Format</span>
                <span className="text-xs text-[var(--vb-text)] font-semibold text-right">
                  {project.category === '3D'
                    ? 'CGI Render'
                    : project.category === 'Web & Automation'
                    ? 'Web Platform'
                    : project.category === 'Brand Identity'
                    ? 'Brand System'
                    : 'Motion Video'}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Visbeyond Card 2: Primary Action Banner */}
        {(project.demoUrl || project.repoUrl) && (
          <div className="flex flex-col sm:flex-row gap-3">
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="vb-cta-banner flex-1 group"
              >
                <span className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
                  <span>View Live Project</span>
                </span>
                <span className="w-7 h-7 rounded-full bg-black/20 flex items-center justify-center group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
                  <ArrowUpRight size={15} />
                </span>
              </a>
            )}
            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-between px-5 py-3.5 rounded-[14px] bg-[var(--vb-panel)] border border-[var(--vb-border)] text-[var(--vb-text)] font-semibold text-xs hover:border-[var(--vb-text)] transition-all group min-h-[52px]"
              >
                <span className="flex items-center gap-2">
                  <Github size={15} />
                  <span>Source Code</span>
                </span>
                <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            )}
          </div>
        )}

        {/* Visbeyond Video Showcase Card */}
        {project.videoUrl && (
          <section className="vb-case-card overflow-hidden p-2" aria-label="Project video">
            <div className="aspect-video w-full rounded-[16px] overflow-hidden bg-black">
              <iframe
                src={getEmbedUrl(project.videoUrl)}
                title={project.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </section>
        )}

        {/* Visbeyond Card 3: Narrative Scope */}
        <section className="vb-case-card" aria-label="Project Narrative">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-[var(--vb-text)] mb-6">
            Overview &amp; Architectural Scope
          </h2>
          <div
            className="text-sm md:text-[15px] text-[var(--vb-text-muted)] leading-relaxed whitespace-pre-line font-sans space-y-4 [&>img]:rounded-xl [&>img]:w-full [&>img]:my-6 [&>b]:text-[var(--vb-text)]"
            dangerouslySetInnerHTML={{ __html: project.description }}
          />
        </section>

        {/* Visbeyond Card 4: Technologies & Engineering Tools */}
        <section className="vb-case-card" aria-label="Technologies used">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--vb-text)] mb-4">
            Technologies &amp; Production Tools
          </h2>
          <div className="flex flex-wrap gap-2">
            {project.tags.map(tag => (
              <span
                key={tag}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[var(--vb-subpanel)] border border-[var(--vb-border)] text-[var(--vb-text)]"
              >
                {tag}
              </span>
            ))}
          </div>
        </section>

        {/* Visbeyond Card 5: Visual Gallery Exhibits */}
        {allImages.length > 0 && (
          <section className="vb-case-card" aria-label="Visual Gallery">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold tracking-tight text-[var(--vb-text)]">
                Visual Gallery &amp; CGI Renders
              </h2>
              <span className="text-xs font-mono text-[var(--vb-text-muted)]">
                {allImages.length} {allImages.length === 1 ? 'render' : 'renders'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {allImages.map((img, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => openLightbox(index)}
                  className={`group relative rounded-xl overflow-hidden bg-[var(--vb-subpanel)] border border-[var(--vb-border)] aspect-[16/10] focus:outline-none focus:ring-2 focus:ring-[#e62e05] ${
                    index === 0 && allImages.length % 2 === 1 ? 'sm:col-span-2 aspect-[21/10]' : ''
                  }`}
                >
                  <img
                    src={img}
                    alt={`${project.title} exhibit ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                    <ZoomIn
                      size={22}
                      className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-md"
                    />
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Visbeyond Orion Bottom Transition: Up Next Teaser Bento & Next Project Preview Card */}
        {nextProject && (
          <section className="flex flex-col gap-3" aria-label="Next project transition">
            <div className="vb-case-card">
              <div className="inline-flex items-center gap-1 px-3 py-1 rounded-[6px] text-xs font-medium border border-[#e62e05] text-[var(--vb-text)] mb-6">
                <span>Up Next &darr;</span>
              </div>
              <p className="text-[15px] sm:text-base text-[var(--vb-text)] leading-relaxed mb-6 font-sans">
                {nextProject.summary}
              </p>
              <Link
                to={`/projects/${nextProject.id}`}
                className="inline-block text-sm font-medium text-[var(--vb-text)] underline underline-offset-4 decoration-1 hover:text-[#e62e05] transition-colors"
              >
                View Project
              </Link>
            </div>

            {/* Next Project Preview Card with Top-Left Inverted Cutout Tab */}
            <Link
              to={`/projects/${nextProject.id}`}
              className="vb-next-preview-card group"
              aria-label={`Next project: ${nextProject.title}`}
            >
              <div className="vb-next-tab">
                <span className="font-semibold text-xs sm:text-sm text-[var(--vb-text)] tracking-tight">
                  {nextProject.title}
                </span>
                <InvertedCornerTopRight className="vb-mobile-tab-corner-right" />
                <InvertedCornerBottomLeft className="vb-mobile-tab-corner-bottom" />
              </div>
              <div className="vb-next-preview-img-wrap">
                <img
                  src={nextProject.thumbnail}
                  alt={nextProject.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                />
              </div>
            </Link>
          </section>
        )}
      </VisbeyondLayout>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 backdrop-blur-md"
            onClick={closeLightbox}
          >
            <button
              onClick={closeLightbox}
              className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors z-10 bg-white/10 hover:bg-white/20 rounded-full p-2.5"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>

            <div className="absolute top-7 left-1/2 -translate-x-1/2 text-white/60 text-xs font-mono tracking-widest">
              {lightboxIndex + 1} / {allImages.length}
            </div>

            {allImages.length > 1 && (
              <button
                onClick={e => {
                  e.stopPropagation();
                  prev();
                }}
                className="absolute left-4 text-white/70 hover:text-white transition-colors bg-white/10 hover:bg-white/20 rounded-full p-3"
                aria-label="Previous image"
              >
                <ChevronLeft size={24} />
              </button>
            )}

            <motion.img
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              src={allImages[lightboxIndex]}
              alt={`${project.title} ${lightboxIndex + 1}`}
              className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl border border-white/10"
              onClick={e => e.stopPropagation()}
            />

            {allImages.length > 1 && (
              <button
                onClick={e => {
                  e.stopPropagation();
                  next();
                }}
                className="absolute right-4 text-white/70 hover:text-white transition-colors bg-white/10 hover:bg-white/20 rounded-full p-3"
                aria-label="Next image"
              >
                <ChevronRight size={24} />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
