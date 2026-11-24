import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { projects, Project } from '../../data/projects';
import VisbeyondLayout from '../../components/layout/VisbeyondLayout';
import SEO from '../../components/SEO';
import { InvertedCornerTopRight, InvertedCornerBottomLeft } from '../../components/ui/VisbeyondIcons';
import ProjectThumbnailSlideshow from '../../components/ui/ProjectThumbnailSlideshow';

export default function Projects() {
  // Prioritize featured works first
  const sortedProjects = [...projects].sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return 0;
  });

  const [activeProject, setActiveProject] = useState<Project>(sortedProjects[0]);

  return (
    <>
      <SEO
        title="Projects"
        description="Explore the selected projects of Md Rakibujjaman Adib across 3D CGI rendering, interactive systems, and brand design."
      />
      <VisbeyondLayout
        pageLabel={activeProject?.title || 'Projects'}
        hideShowcaseOnMobile={true}
        headerCard={
          <div className="flex flex-col justify-between min-h-[130px] md:min-h-[150px] xl:min-h-[192px] p-6 md:p-10 xl:p-12">
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-[var(--vb-text)] leading-[1.1]">
              Projects
            </h1>

            <p className="text-sm md:text-[15px] text-[var(--vb-text-muted)] leading-relaxed max-w-xl font-sans mt-6 md:mt-8">
              Explore the portfolio. Discover selected projects across 3D CGI, interactive systems, and brand architecture.
            </p>
          </div>
        }
        showcaseChildren={
          <div className="relative w-full h-full overflow-hidden select-none bg-[var(--vb-bg)]">
            {activeProject && (
              activeProject.thumbnails && activeProject.thumbnails.length > 1 ? (
                <ProjectThumbnailSlideshow
                  key={activeProject.id}
                  thumbnails={activeProject.thumbnails}
                  fallback={activeProject.thumbnail}
                  alt={activeProject.title}
                  className="absolute inset-0 w-full h-full"
                  showIndicators={true}
                />
              ) : (
                <AnimatePresence initial={false}>
                  <motion.img
                    key={activeProject.id}
                    src={activeProject.thumbnail}
                    alt={activeProject.title}
                    initial={{ opacity: 0, scale: 1.03 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute inset-0 w-full h-full object-cover object-center"
                  />
                </AnimatePresence>
              )
            )}
          </div>
        }
      >
        {/* Mobile & Tablet Visual Project Cards (1-col on mobile <=809px, 2-col on tablet 810-1199px) */}
        <section className="vb-projects-grid" aria-label="Project cards list mobile">
          {sortedProjects.map(project => (
            <Link
              to={`/projects/${project.id}`}
              key={`mobile-${project.id}`}
              className={`vb-mobile-card group ${project.cardRatio === 'square' ? 'is-square' : ''}`}
            >
              {/* Top-Left Inverted Cutout Tab */}
              <div className="vb-mobile-card-tab">
                <h2 className="vb-mobile-card-title">{project.title}</h2>
                <span className="vb-project-arrow" aria-hidden="true">
                  <ArrowRight size={15} strokeWidth={2} />
                </span>
                <InvertedCornerTopRight className="vb-mobile-tab-corner-right" />
                <InvertedCornerBottomLeft className="vb-mobile-tab-corner-bottom" />
              </div>

              {/* Card Full-bleed Image */}
              <div className="vb-mobile-card-img-wrap">
                <ProjectThumbnailSlideshow
                  thumbnails={project.thumbnails}
                  fallback={project.thumbnail}
                  alt={project.title}
                  className="w-full h-full"
                  imgClassName="transition-transform duration-500 ease-out group-hover:scale-105"
                  showIndicators={true}
                />
              </div>
            </Link>
          ))}
        </section>

        {/* Desktop Project Title Rows (Visbeyond desktop list layout) */}
        <section className="hidden xl:flex xl:flex-col xl:gap-3" aria-label="Project list desktop">
          {sortedProjects.map(project => (
            <Link
              to={`/projects/${project.id}`}
              key={`desktop-${project.id}`}
              className={`vb-project-link-row group ${activeProject?.id === project.id ? 'is-active' : ''}`}
              onMouseEnter={() => setActiveProject(project)}
              onFocus={() => setActiveProject(project)}
            >
              <div className="flex items-center min-w-0 pr-3">
                <h2 className="vb-project-row-title truncate">{project.title}</h2>
                <span className="vb-project-arrow" aria-hidden="true">
                  <ArrowRight size={16} strokeWidth={2} />
                </span>
              </div>
              <div className="vb-project-row-meta">
                <span className="vb-project-row-tag">{project.category}</span>
              </div>
            </Link>
          ))}
        </section>
      </VisbeyondLayout>
    </>
  );
}
