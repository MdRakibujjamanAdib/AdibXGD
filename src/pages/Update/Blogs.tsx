import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  ArrowUpRight,
  Calendar,
  Clock,
  Search,
  X,
  BookOpen,
} from 'lucide-react';
import { blogs, Blog } from '../../data/blogs';
import VisbeyondLayout from '../../components/layout/VisbeyondLayout';
import SEO from '../../components/SEO';
import { VisbeyondStars } from '../../components/ui/VisbeyondStars';

export default function Blogs() {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlCategory = searchParams.get('category');
  const urlQuery = searchParams.get('q');

  // Filter & Search states
  const [selectedCategory, setSelectedCategory] = useState<string>(urlCategory || 'All');
  const [searchQuery, setSearchQuery] = useState<string>(urlQuery || '');

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

  // Extract all unique categories dynamically from blogs
  const categories = useMemo(() => {
    const set = new Set<string>();
    blogs.forEach((b) => {
      if (b.category) set.add(b.category);
    });
    return ['All', ...Array.from(set)];
  }, []);

  // Filtered blogs matching category AND search query across title, summary, category, and tags
  const filteredBlogs = useMemo(() => {
    return blogs.filter((b) => {
      const matchCat =
        selectedCategory === 'All' ||
        b.category.toLowerCase() === selectedCategory.toLowerCase();

      const q = searchQuery.trim().toLowerCase();
      const matchSearch =
        !q ||
        b.title.toLowerCase().includes(q) ||
        b.summary.toLowerCase().includes(q) ||
        b.category.toLowerCase().includes(q) ||
        b.tags?.some((t) => t.toLowerCase().includes(q));

      return matchCat && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Active / hovered blog for interactive showcase preview
  const [activeBlog, setActiveBlog] = useState<Blog | null>(blogs[0] || null);
  const [hoveredBlog, setHoveredBlog] = useState<Blog | null>(null);

  // Active display blog priority: hovered > active > first filtered > first blog
  const currentDisplayBlog = hoveredBlog || activeBlog || filteredBlogs[0] || blogs[0] || null;

  // Category selection handler
  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (category === 'All') {
        next.delete('category');
      } else {
        next.set('category', category);
      }
      return next;
    });
  };

  // Search input handler
  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (val.trim()) {
        next.set('q', val.trim());
      } else {
        next.delete('q');
      }
      return next;
    });
  };

  // Helper to clear filters
  const clearFilters = () => {
    setSelectedCategory('All');
    setSearchQuery('');
    setSearchParams({});
  };

  const isFiltered = selectedCategory !== 'All' || searchQuery.trim().length > 0;

  return (
    <>
      <SEO
        title="Knowledge & Insights"
        description="Technical deep dives, systems engineering strategies, and reflections by Md Rakibujjaman Adib across autonomous AI agents, serious game physics, IoT carbon telemetry, and physically based rendering."
        type="website"
      />
      <VisbeyondLayout
        pageLabel={currentDisplayBlog ? currentDisplayBlog.category : 'Knowledge & Insights'}
        hideShowcaseOnMobile={true}
        headerCard={
          <div className="flex flex-col justify-between min-h-[140px] md:min-h-[160px] xl:min-h-[190px] p-6 md:p-10 xl:p-12">
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[var(--vb-text)] leading-[1.1] font-sans">
                Insights &amp; Articles
              </h1>
            </div>

            <p className="text-sm md:text-[15px] text-[var(--vb-text-muted)] leading-relaxed max-w-2xl font-sans mt-4 md:mt-6">
              Technical deep dives, engineering Knowledge, and Thoughtful system architectures across autonomous AI agents, serious game physics, IoT carbon telemetry, and physically based rendering.
            </p>
          </div>
        }
        showcaseChildren={
          <div className="relative w-full h-full overflow-hidden select-none bg-[var(--vb-bg)]">
            {/* Dynamic Smooth Crossfade of Cover Image */}
            <AnimatePresence initial={false} mode="sync">
              {currentDisplayBlog ? (
                <motion.div
                  key={currentDisplayBlog.id}
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0 w-full h-full"
                >
                  <img
                    src={
                      currentDisplayBlog.coverImage ||
                      currentDisplayBlog.image ||
                      '/images/visbeyond/m0fsnMH14U4pPOavXf6o8bIjA.png'
                    }
                    alt={currentDisplayBlog.coverImageAlt || currentDisplayBlog.title}
                    className="w-full h-full object-cover object-center"
                  />
                  {/* High-fidelity Visbeyond gradient vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/15 pointer-events-none" />
                </motion.div>
              ) : (
                <div className="relative w-full h-full flex flex-col items-center justify-center p-8 text-center bg-black overflow-hidden">
                  <VisbeyondStars className="absolute inset-0 w-full h-full text-white/30 pointer-events-none" />
                  <div className="relative z-10 flex flex-col items-center justify-center">
                    <h2 className="vb-wordmark text-3xl md:text-4xl tracking-[0.25em] text-white font-extrabold mb-2.5">
                      ADIB
                    </h2>
                    <p className="text-xs uppercase tracking-[0.2em] text-[#a1a1aa] font-sans">
                      Knowledge &bull; Insights &bull; Engineering
                    </p>
                  </div>
                </div>
              )}
            </AnimatePresence>

            {/* Bottom Showcase Information Overlay with Blog Title (positioned lower in reflection area) */}
            {currentDisplayBlog && (
              <div className="absolute inset-x-0 bottom-0 z-10 p-6 md:p-8 pb-6 md:pb-8 flex flex-col justify-end pointer-events-none">
                <h3 className="text-lg md:text-xl font-bold font-sans text-white tracking-tight leading-snug line-clamp-2 drop-shadow-md max-w-[58%] mb-1">
                  {currentDisplayBlog.title}
                </h3>
              </div>
            )}
          </div>
        }
      >
        {/* Sticky Search & Category Filter Section (Matches UI theme: white in day, dark in night) */}
        <section
          className="sticky top-3 z-20 vb-card p-4 sm:p-6 bg-[var(--vb-panel)]/95 backdrop-blur-md border border-[var(--vb-border)] rounded-[20px] shadow-lg mb-6 md:mb-8 transition-colors"
          aria-label="Filter blog articles"
        >
          {/* Centered Header Row */}
          <div className="w-full flex items-center justify-center relative mb-3 sm:mb-4 min-h-[32px]">
            <h2 className="text-sm min-[440px]:text-base sm:text-lg xl:text-xl font-bold tracking-tight text-[var(--vb-text)] text-center px-2">
              Search by Category
            </h2>
            {isFiltered && (
              <button
                type="button"
                onClick={clearFilters}
                className="absolute right-0 top-1/2 -translate-y-1/2 inline-flex items-center gap-1.5 text-xs text-[#e62e05] hover:underline cursor-pointer font-medium"
              >
                <X size={12} />
                <span>Reset ({filteredBlogs.length})</span>
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
              placeholder="Search articles by title, topic, or keyword..."
              className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-[var(--vb-subpanel)] border border-[var(--vb-border)] text-xs sm:text-sm text-[var(--vb-text)] placeholder:text-[var(--vb-text-muted)] focus:outline-none focus:border-[#e62e05] transition-all font-sans"
              aria-label="Search articles"
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

          {/* Category Filter Pills (Exact dashed-border aesthetic, matching UI theme) */}
          <div className="flex flex-wrap gap-2 sm:gap-2.5 justify-center" role="group" aria-label="Categories">
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
                      : 'bg-transparent text-[var(--vb-text)] border border-dashed border-[var(--vb-border)] hover:border-[var(--vb-text)]/60'
                  }`}
                  aria-pressed={isActive}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </section>

        {/* Clean Blog Posts Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4" aria-label="Articles list">
          {filteredBlogs.length > 0 ? (
            filteredBlogs.map((blog, idx) => (
              <motion.article
                key={blog.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: idx * 0.06 }}
                className="vb-card overflow-hidden group flex flex-col justify-between bg-[var(--vb-panel)] border border-[var(--vb-border)] rounded-[var(--vb-radius)] hover:border-[#e62e05]/50 transition-all duration-300 shadow-sm hover:shadow-md"
                onMouseEnter={() => {
                  setHoveredBlog(blog);
                  setActiveBlog(blog);
                }}
                onFocus={() => {
                  setHoveredBlog(blog);
                  setActiveBlog(blog);
                }}
              >
                <div className="flex flex-col flex-1">
                  {/* Clean Thumbnail (16:10 aspect ratio with hover zoom, no floating badges) */}
                  <Link
                    to={blog.link || `/blogs/${blog.slug}`}
                    className="block relative aspect-[16/10] overflow-hidden rounded-t-[11px] bg-[var(--vb-subpanel)]"
                  >
                    <img
                      src={blog.coverImage || blog.image}
                      alt={blog.coverImageAlt || blog.title}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-40 group-hover:opacity-20 transition-opacity" />
                  </Link>

                  {/* Card Content Body */}
                  <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Clean Metadata: Date • Read Time */}
                      <div className="flex items-center gap-2 text-xs font-sans text-[var(--vb-text-muted)] mb-2.5">
                        <span>{blog.date}</span>
                        <span>&bull;</span>
                        <span>{blog.readTime}</span>
                      </div>

                      {/* Title with vermilion hover */}
                      <h2 className="text-lg sm:text-xl font-bold font-sans tracking-tight text-[var(--vb-text)] group-hover:text-[#e62e05] transition-colors leading-snug line-clamp-2 mb-2">
                        <Link to={blog.link || `/blogs/${blog.slug}`}>
                          {blog.title}
                        </Link>
                      </h2>

                      {/* 2-line clamped summary */}
                      <p className="text-xs sm:text-[13px] text-[var(--vb-text-muted)] line-clamp-2 leading-relaxed font-sans mb-4">
                        {blog.summary}
                      </p>
                    </div>

                    {/* Bottom Card Action Link with Category */}
                    <div className="pt-3 border-t border-[var(--vb-border)]/50 flex items-center justify-between text-xs font-sans">
                      <span className="font-semibold text-[#e62e05]">{blog.category}</span>
                      <Link
                        to={blog.link || `/blogs/${blog.slug}`}
                        className="inline-flex items-center gap-1.5 font-medium text-[var(--vb-text)] hover:text-[#e62e05] group-hover:translate-x-1 transition-all"
                      >
                        <span>Read article</span>
                        <ArrowUpRight size={13} className="text-[#e62e05]" />
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))
          ) : (
            <div className="col-span-full vb-card p-12 text-center bg-[var(--vb-panel)] border border-[var(--vb-border)] rounded-[var(--vb-radius)]">
              <div className="w-12 h-12 rounded-full bg-[#e62e05]/10 text-[#e62e05] flex items-center justify-center mx-auto mb-4">
                <BookOpen size={22} />
              </div>
              <h3 className="text-xl font-bold font-sans text-[var(--vb-text)] mb-2">No Articles Found</h3>
              <p className="text-sm font-sans text-[var(--vb-text-muted)] max-w-md mx-auto mb-6">
                No published articles matched your search or filter criteria. Try searching with different keywords or clearing filters.
              </p>
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#e62e05] text-white font-sans font-medium text-xs hover:brightness-110 transition-all cursor-pointer shadow-md shadow-[#e62e05]/30"
              >
                <span>Reset Filters</span>
              </button>
            </div>
          )}
        </section>
      </VisbeyondLayout>
    </>
  );
}
