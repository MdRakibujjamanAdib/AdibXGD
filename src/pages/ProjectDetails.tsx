
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ExternalLink, Github, X, ChevronLeft, ChevronRight, ZoomIn, ArrowUpRight } from 'lucide-react';
import { projects } from '../data/projects';
import PageTransition from '../components/layout/PageTransition';
import SEO from '../components/SEO';

const ProjectDetails = () => {
  const { id } = useParams();
  const project = projects.find(p => p.id === id);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

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
      <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-4xl font-bold mb-4">Project not found</h2>
          <Link to="/projects" className="text-blue-600 hover:underline">Back to Projects</Link>
        </div>
      </div>
    );
  }

  const allImages = project.images ?? [];

  // Helper to convert standard video URLs to embed URLs
  const getEmbedUrl = (url: string) => {
    if (!url) return '';
    try {
      // YouTube
      if (url.includes('youtube.com') || url.includes('youtu.be')) {
        let videoId = '';
        if (url.includes('youtu.be/')) {
          videoId = url.split('youtu.be/')[1]?.split('?')[0];
        } else if (url.includes('youtube.com/watch')) {
          const urlObj = new URL(url);
          videoId = urlObj.searchParams.get('v') || '';
        } else if (url.includes('youtube.com/embed/')) {
          return url; // Already embed format
        }
        return `https://www.youtube.com/embed/${videoId}`;
      }

      // Facebook
      if (url.includes('facebook.com') || url.includes('fb.watch')) {
        // Facebook's official embed pattern requires passing the raw URL encoded
        return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=false`;
      }

      return url;
    } catch (e) {
      return url;
    }
  };

  return (
    <PageTransition>
      <SEO
        title={`${project.title} - Project Case Study`}
        description={project.summary}
        image={project.thumbnail}
        type="article"
      />
      <div className="bg-white text-black dark:bg-black dark:text-white min-h-screen pt-32 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <Link to="/projects" className="inline-flex items-center text-lg font-bold text-gray-500 hover:text-black dark:hover:text-white mb-12 transition-colors group">
            <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Projects
          </Link>

          <div className="mb-20">
            <div className="flex flex-wrap gap-4 mb-6">
              <span className="text-sm font-mono uppercase tracking-widest text-blue-600 dark:text-blue-500">
                {project.category}
              </span>
              {project.role && (
                <span className="text-sm font-mono uppercase tracking-widest text-gray-400">
                  / {project.role}
                </span>
              )}
            </div>

            <h1 className="text-6xl md:text-8xl font-bold mb-8 tracking-tighter text-black dark:text-white leading-[0.9]">{project.title}</h1>

            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 leading-relaxed max-w-3xl">
              {project.summary}
            </p>
          </div>

          {/* Main Media Area */}
          <div className="w-full rounded-3xl overflow-hidden mb-24 bg-gray-100 dark:bg-zinc-900">
            {project.videoUrl ? (
              <div className="aspect-video w-full">
                <iframe
                  src={getEmbedUrl(project.videoUrl)}
                  title={project.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              </div>
            ) : (
              <div className="aspect-video w-full">
                <img src={project.thumbnail} alt={project.title} className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-20">
            <div className="lg:col-span-2 space-y-20">
              <section>
                <h2 className="text-3xl font-bold mb-8 text-black dark:text-white">Overview</h2>
                <div
                  className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line"
                  dangerouslySetInnerHTML={{ __html: project.description }}
                />
              </section>

              {/* Gallery — thumbnail grid */}
              {allImages.length > 0 && (
                <section>
                  <h2 className="text-3xl font-bold mb-8 text-black dark:text-white">Gallery</h2>
                  <div className="columns-2 sm:columns-3 gap-4 space-y-4">
                    {allImages.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => openLightbox(index)}
                        className="group relative rounded-2xl overflow-hidden bg-gray-100 dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full mb-4 break-inside-avoid block"
                      >
                        <img
                          src={img}
                          alt={`${project.title} ${index + 1}`}
                          className="w-full h-auto block transition-transform duration-300 group-hover:scale-105"
                        />
                        {/* hover overlay */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                          <ZoomIn
                            size={28}
                            className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-lg"
                          />
                        </div>
                      </button>
                    ))}
                  </div>
                </section>
              )}
            </div>

            <div className="space-y-12">
              <div>
                <h3 className="text-sm font-mono uppercase tracking-widest text-gray-500 mb-6">Tech Stack</h3>
                <div className="flex flex-wrap gap-3">
                  {project.tags.map(tag => (
                    <span key={tag} className="px-4 py-2 border border-gray-200 dark:border-zinc-800 rounded-full text-sm font-bold text-black dark:text-white">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {(project.demoUrl || project.repoUrl) && (
                <div>
                  <h3 className="text-sm font-mono uppercase tracking-widest text-gray-500 mb-6">Links</h3>
                  <div className="space-y-4">
                    {project.demoUrl && (
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-between bg-black text-white dark:bg-white dark:text-black px-6 py-4 rounded-xl font-bold hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors group"
                      >
                        Live Demo <ArrowUpRight className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" size={20} />
                      </a>
                    )}
                    {project.repoUrl && (
                      <a
                        href={project.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-between bg-transparent border border-gray-200 dark:border-zinc-800 text-black dark:text-white px-6 py-4 rounded-xl font-bold hover:bg-gray-50 dark:hover:bg-zinc-900 transition-colors group"
                      >
                        Source Code <Github className="group-hover:scale-110 transition-transform" size={20} />
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            {/* Close */}
            <button
              onClick={closeLightbox}
              className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors z-10 bg-white/10 hover:bg-white/20 rounded-full p-2"
            >
              <X size={24} />
            </button>

            {/* Counter */}
            <div className="absolute top-7 left-1/2 -translate-x-1/2 text-white/50 text-sm font-mono">
              {lightboxIndex + 1} / {allImages.length}
            </div>

            {/* Prev */}
            {allImages.length > 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); prev(); }}
                className="absolute left-4 text-white/70 hover:text-white transition-colors bg-white/10 hover:bg-white/20 rounded-full p-3"
              >
                <ChevronLeft size={28} />
              </button>
            )}

            {/* Image */}
            <motion.img
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              src={allImages[lightboxIndex]}
              alt={`${project.title} ${lightboxIndex + 1}`}
              className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />

            {/* Next */}
            {allImages.length > 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); next(); }}
                className="absolute right-4 text-white/70 hover:text-white transition-colors bg-white/10 hover:bg-white/20 rounded-full p-3"
              >
                <ChevronRight size={28} />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </PageTransition>
  );
};

export default ProjectDetails;
