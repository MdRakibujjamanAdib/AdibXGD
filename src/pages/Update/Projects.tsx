import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight, Search, X } from 'lucide-react';
import { projects, Project } from '../../data/projects';
import PortfolioLayout from '../../components/layout/PortfolioLayout';
import SEO from '../../components/SEO';
import { InvertedCornerTopRight, InvertedCornerBottomLeft } from '../../components/ui/StudioIcons';
import { buildCorpusVocabulary, correctSearchQuery, matchesProject } from '../../utils/fuzzySearch';

export default function Projects() {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlCategory = searchParams.get('category');
  const urlQuery = searchParams.get('q');

  const [selectedCategory, setSelectedCategory] = useState<string>(urlCategory || 'All');
  const [searchQuery, setSearchQuery] = useState<string>(urlQuery || '');

  // Prioritize featured works first
  const sortedProjects = useMemo(() => {
    return [...projects].sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return 0;
    });
  }, []);

  // Sync state if URL query params change externally
  useEffect(() => {
    const qCat = searchParams.get('category');
    const qSearch = searchParams.get('q');
    if (qCat && qCat !== selectedCategory) {
      setSelectedCategory(qCat);
    } else if (!qCat && selectedCategory !== 'All' && !urlCategory) {
      setSelectedCategory('All');
    }
    if (qSearch !== null && qSearch !== searchQuery) {
      setSearchQuery(qSearch);
    }
  }, [searchParams]);

  // Extract all unique categories dynamically
  const categories = useMemo(() => {
    const set = new Set<string>();
    projects.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return ['All', ...Array.from(set)];
  }, []);

  // Build corpus vocabulary for typo detection and character correction
  const vocabulary = useMemo(() => buildCorpusVocabulary(projects), []);
  const [strictMode, setStrictMode] = useState<boolean>(false);

  // If user edits search query, reset strict mode
  useEffect(() => {
    setStrictMode(false);
  }, [searchQuery]);

  // Perform token-by-token character mistake analysis
  const queryCorrection = useMemo(() => {
    if (strictMode || !searchQuery.trim()) {
      return {
        rawQuery: searchQuery.trim(),
        correctedQuery: searchQuery.trim(),
        hasCorrection: false,
        correctionDetails: [],
      };
    }
    return correctSearchQuery(searchQuery, vocabulary);
  }, [searchQuery, vocabulary, strictMode]);

  // Filtered projects matching category and search query with character mistake tolerance
  const { filteredProjects, usedFuzzyCorrection } = useMemo(() => {
    const qRaw = searchQuery.trim().toLowerCase();
    if (!qRaw) {
      const matched = sortedProjects.filter((p) =>
        selectedCategory === 'All' || p.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
      return { filteredProjects: matched, usedFuzzyCorrection: false };
    }

    const rawWords = qRaw.split(/\s+/).filter(Boolean);
    const correctedWords = queryCorrection.correctedQuery.toLowerCase().split(/\s+/).filter(Boolean);

    // 1. Try exact match first
    const exactMatches: Array<{ project: Project; score: number }> = [];
    for (const p of sortedProjects) {
      const { matches, score } = matchesProject(p, rawWords, selectedCategory);
      if (matches) {
        exactMatches.push({ project: p, score: score + (p.featured ? 50 : 0) });
      }
    }

    if (exactMatches.length > 0) {
      exactMatches.sort((a, b) => b.score - a.score);
      return {
        filteredProjects: exactMatches.map((m) => m.project),
        usedFuzzyCorrection: false,
      };
    }

    // 2. If no exact matches and typo correction is available (not in strict mode)
    if (!strictMode) {
      const fuzzyMatches: Array<{ project: Project; score: number }> = [];
      const wordsToSearch = queryCorrection.hasCorrection ? correctedWords : rawWords;

      for (const p of sortedProjects) {
        const { matches, score } = matchesProject(p, wordsToSearch, selectedCategory);
        if (matches) {
          fuzzyMatches.push({ project: p, score: score + (p.featured ? 50 : 0) });
        }
      }

      if (fuzzyMatches.length > 0) {
        fuzzyMatches.sort((a, b) => b.score - a.score);
        return {
          filteredProjects: fuzzyMatches.map((m) => m.project),
          usedFuzzyCorrection: queryCorrection.hasCorrection,
        };
      }
    }

    return { filteredProjects: [], usedFuzzyCorrection: false };
  }, [sortedProjects, selectedCategory, searchQuery, queryCorrection, strictMode]);

  const [activeProject, setActiveProject] = useState<Project | undefined>(sortedProjects[0]);

  // Keep active project in sync with filtered list
  useEffect(() => {
    if (filteredProjects.length > 0) {
      if (!activeProject || !filteredProjects.some((p) => p.id === activeProject.id)) {
        setActiveProject(filteredProjects[0]);
      }
    } else {
      setActiveProject(undefined);
    }
  }, [filteredProjects, activeProject]);

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    const newParams = new URLSearchParams(searchParams);
    if (category === 'All') {
      newParams.delete('category');
    } else {
      newParams.set('category', category);
    }
    setSearchParams(newParams, { replace: true });
  };

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    const newParams = new URLSearchParams(searchParams);
    if (!val.trim()) {
      newParams.delete('q');
    } else {
      newParams.set('q', val.trim());
    }
    setSearchParams(newParams, { replace: true });
  };

  const clearFilters = () => {
    setSelectedCategory('All');
    setSearchQuery('');
    setSearchParams({}, { replace: true });
  };

  const isFiltered = selectedCategory !== 'All' || Boolean(searchQuery.trim());

  return (
    <>
      <SEO
        title="Projects"
        description="Explore the selected projects of Md Rakibujjaman Adib across 3D CGI rendering, interactive systems, and brand design."
      />
      <PortfolioLayout
        pageLabel={activeProject?.shortTitle || activeProject?.title || 'Projects'}
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
            {activeProject ? (
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
            ) : (
              <div className="relative w-full h-full flex flex-col items-center justify-center p-8 text-center bg-black overflow-hidden">
                <div className="relative z-10 flex flex-col items-center justify-center">
                  <h2 className="vb-wordmark text-3xl md:text-4xl tracking-[0.25em] text-white font-extrabold mb-2.5">
                    ADIB
                  </h2>
                  <p className="text-xs uppercase tracking-[0.2em] text-[#a1a1aa] font-sans">
                    3D CGI &bull; Web &bull; Design
                  </p>
                </div>
              </div>
            )}
          </div>
        }
      >
        {/* Sticky Search & Category Filter Section */}
        <section
          className="sticky top-3 z-20 rounded-[20px] pt-12 min-[440px]:pt-1.5 min-[810px]:pt-14 xl:pt-6 pb-5 px-4 sm:px-6 md:px-8 bg-[var(--vb-panel)] text-[var(--vb-text)] border border-[var(--vb-border)] shadow-none backdrop-blur-md transition-colors duration-300 mb-6 md:mb-8"
          aria-label="Filter projects"
        >
          {/* Top gap mask */}
          <div
            className="absolute -top-4 left-0 right-0 h-4 bg-[var(--vb-bg)] pointer-events-none z-30 transition-colors duration-300"
            aria-hidden="true"
          />

          {/* Top-left corner mask */}
          <div
            className="absolute -top-[1px] -left-[1px] w-5 h-5 pointer-events-none overflow-hidden z-30 text-[var(--vb-bg)] transition-colors duration-300"
            aria-hidden="true"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-full h-full block">
              <path d="M 0 0 L 20 0 C 8.954 0 0 8.954 0 20 Z" />
            </svg>
          </div>

          {/* Top-right corner mask */}
          <div
            className="absolute -top-[1px] -right-[1px] w-5 h-5 pointer-events-none overflow-hidden z-30 text-[var(--vb-bg)] transition-colors duration-300"
            aria-hidden="true"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-full h-full block">
              <path d="M 20 0 L 0 0 C 11.046 0 20 8.954 20 20 Z" />
            </svg>
          </div>

          {/* Top Notch Row: Title & Active Count / Reset */}
          <div className="relative w-full min-h-[37px] flex items-center justify-center min-[810px]:justify-start mb-2 sm:mb-4">
            <h2 className="text-sm min-[440px]:text-base sm:text-lg xl:text-2xl font-bold tracking-tight text-[var(--vb-text)] whitespace-nowrap text-center min-[810px]:text-left px-2 transition-colors duration-300">
              Filter by Discipline
            </h2>
            {isFiltered && (
              <button
                type="button"
                onClick={clearFilters}
                className="absolute right-0 top-1/2 -translate-y-1/2 inline-flex items-center gap-1.5 text-xs text-[#e62e05] hover:underline cursor-pointer font-medium px-2"
              >
                <X size={12} />
                <span>Reset ({filteredProjects.length})</span>
              </button>
            )}
          </div>

          {/* Sleek Integrated Search Bar */}
          <div className="relative mb-3.5">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--vb-text-muted)] pointer-events-none"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && queryCorrection.hasCorrection) {
                  e.preventDefault();
                  handleSearchChange(queryCorrection.correctedQuery);
                }
              }}
              placeholder="Search projects by title, tool, or discipline..."
              className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-[var(--vb-subpanel)] border border-[var(--vb-border)] text-xs sm:text-sm text-[var(--vb-text)] placeholder:text-[var(--vb-text-muted)] focus:outline-none focus:border-[#e62e05] transition-all font-sans"
              aria-label="Search projects"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => handleSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[var(--vb-text-muted)] hover:text-[var(--vb-text)] cursor-pointer"
                aria-label="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Smart Character Mistake / Typo Correction Notice */}
          {searchQuery && queryCorrection.hasCorrection && (
            <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2.5 mb-3.5 rounded-xl bg-[var(--vb-subpanel)] border border-[var(--vb-border)] text-xs text-[var(--vb-text-muted)] animate-fadeIn">
              <div className="flex items-center gap-2 min-w-0">
                <span className="inline-flex items-center justify-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#e62e05]/15 text-[#e62e05] shrink-0 uppercase tracking-wider">
                  Typo Fix
                </span>
                <span className="truncate">
                  {usedFuzzyCorrection ? 'Showing matches for ' : 'Did you mean: '}
                  <button
                    type="button"
                    onClick={() => handleSearchChange(queryCorrection.correctedQuery)}
                    className="font-bold text-[var(--vb-text)] underline hover:text-[#e62e05] cursor-pointer inline-block"
                  >
                    "{queryCorrection.correctedQuery}"
                  </button>
                  <span className="opacity-70 ml-1.5 hidden sm:inline">
                    (fixed from <em>"{searchQuery}"</em>)
                  </span>
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => handleSearchChange(queryCorrection.correctedQuery)}
                  className="px-2.5 py-1 rounded-md bg-[#e62e05] text-white hover:brightness-110 text-[11px] font-semibold transition-all cursor-pointer shadow-sm"
                >
                  Apply "{queryCorrection.correctedQuery}"
                </button>
                {!strictMode && (
                  <button
                    type="button"
                    onClick={() => setStrictMode(true)}
                    className="text-[11px] text-[var(--vb-text-muted)] hover:text-[var(--vb-text)] underline cursor-pointer"
                  >
                    Search strictly "{searchQuery}"
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2 sm:gap-2.5 justify-center min-[810px]:justify-start" role="group" aria-label="Categories">
            {categories.map((category) => {
              const isActive = selectedCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  data-tag={category}
                  onClick={() => handleCategorySelect(category)}
                  className={`vb-tag-pill px-3.5 py-1.5 rounded-[8px] text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer select-none ${
                    isActive
                      ? 'active bg-[#e62e05] text-white border-transparent shadow-md shadow-[#e62e05]/30 font-semibold'
                      : 'bg-transparent text-[var(--vb-text)] border border-dashed border-[var(--vb-border)] hover:border-[var(--vb-text)]'
                  }`}
                  aria-pressed={isActive}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </section>

        {/* Empty State */}
        {filteredProjects.length === 0 ? (
          <div className="vb-card p-12 text-center rounded-[var(--vb-radius)] bg-[var(--vb-panel)] border border-[var(--vb-border)] my-6">
            <h3 className="text-base font-semibold text-[var(--vb-text)] mb-2">No projects found</h3>
            <p className="text-sm text-[var(--vb-text-muted)] mb-3">
              We couldn't find any projects matching <em>"{searchQuery}"</em>.
            </p>
            {queryCorrection.hasCorrection && (
              <div className="mb-5 inline-flex items-center gap-1.5 text-xs text-[var(--vb-text-muted)] bg-[var(--vb-subpanel)] px-3 py-1.5 rounded-lg border border-[var(--vb-border)]">
                <span>Did you mean:</span>
                <button
                  type="button"
                  onClick={() => {
                    setStrictMode(false);
                    handleSearchChange(queryCorrection.correctedQuery);
                  }}
                  className="font-bold text-[#e62e05] underline hover:brightness-110 cursor-pointer"
                >
                  "{queryCorrection.correctedQuery}"
                </button>
              </div>
            )}
            <div>
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#e62e05] text-white text-xs font-semibold hover:brightness-110 transition-all cursor-pointer shadow-md"
              >
                <X size={14} />
                <span>Reset All Filters</span>
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Mobile & Tablet Visual Project Cards (1-col on mobile <=809px, 2-col on tablet 810-1199px) */}
            <section className="vb-projects-grid" aria-label="Project cards list mobile">
              {filteredProjects.map((project) => (
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
                    <img
                      src={project.thumbnail}
                      alt={project.title}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    />
                  </div>
                </Link>
              ))}
            </section>

            {/* Desktop Project Title Rows */}
            <section className="hidden xl:flex xl:flex-col xl:gap-3" aria-label="Project list desktop">
              {filteredProjects.map((project) => (
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
          </>
        )}
      </PortfolioLayout>
    </>
  );
}
