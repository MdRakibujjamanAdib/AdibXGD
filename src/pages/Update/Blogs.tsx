import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  ArrowUpRight,
  Calendar,
  Clock,
  Sparkles,
  Tag,
  Filter,
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
  const urlTag = searchParams.get('tag');

  // Category and Tag filter states
  const [selectedCategory, setSelectedCategory] = useState<string>(urlCategory || 'All');
  const [selectedTag, setSelectedTag] = useState<string | null>(urlTag || null);

  // Sync state if URL query params change externally
  useEffect(() => {
    const qCat = searchParams.get('category');
    const qTag = searchParams.get('tag');
    if (qCat && qCat !== selectedCategory) {
      setSelectedCategory(qCat);
    } else if (!qCat && selectedCategory !== 'All' && !urlCategory) {
      // Keep state unless cleared
    }
    if (qTag !== selectedTag) {
      setSelectedTag(qTag);
    }
  }, [searchParams]);

  // Extract all unique categories and tags dynamically from blogs
  const categories = useMemo(() => {
    const set = new Set<string>();
    blogs.forEach((b) => {
      if (b.category) set.add(b.category);
    });
    return ['All', ...Array.from(set)];
  }, []);

  const allTags = useMemo(() => {
    const set = new Set<string>();
    blogs.forEach((b) => {
      b.tags?.forEach((t) => set.add(t));
    });
    return Array.from(set);
  }, []);

  // Filtered blogs supporting partial/case-insensitive matching for deep link queries (e.g. ?tag=AI, ?tag=C%23)
  const filteredBlogs = useMemo(() => {
    return blogs.filter((b) => {
      const matchCat =
        selectedCategory === 'All' || b.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchTag =
        !selectedTag ||
        b.tags?.some(
          (t) =>
            t.toLowerCase() === selectedTag.toLowerCase() ||
            t.toLowerCase().includes(selectedTag.toLowerCase())
        );
      return matchCat && matchTag;
    });
  }, [selectedCategory, selectedTag]);

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

  // Tag selection handler
  const handleTagSelect = (tag: string) => {
    const nextTag = selectedTag === tag ? null : tag;
    setSelectedTag(nextTag);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (nextTag) {
        next.set('tag', nextTag);
      } else {
        next.delete('tag');
      }
      return next;
    });
  };

  // Helper to clear filters
  const clearFilters = () => {
    setSelectedCategory('All');
    setSelectedTag(null);
    setSearchParams({});
  };

  const isFiltered = selectedCategory !== 'All' || selectedTag !== null;

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
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#e62e05] bg-[#e62e05]/10 px-2.5 py-1 rounded inline-flex items-center gap-1.5 font-medium border border-[#e62e05]/20">
                  <Sparkles size={11} className="text-[#e62e05]" />
                  Knowledge &bull; Thought &bull; Insights
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[var(--vb-text)] leading-[1.1]">
                Insights &amp; Articles
              </h1>
            </div>

            <p className="text-sm md:text-[15px] text-[var(--vb-text-muted)] leading-relaxed max-w-2xl font-sans mt-4 md:mt-6">
              Technical deep dives, system architectures, and engineering reflections across autonomous AI agents, serious game physics, IoT carbon telemetry, and physically based rendering.
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
                    <p className="text-[11px] uppercase tracking-[0.28em] text-[#a1a1aa] font-mono">
                      Knowledge &bull; Insights &bull; Engineering
                    </p>
                  </div>
                </div>
              )}
            </AnimatePresence>

            {/* Bottom Showcase Information Overlay */}
            {currentDisplayBlog && (
              <div className="absolute inset-x-0 bottom-0 z-10 p-6 md:p-8 pb-14 flex flex-col justify-end pointer-events-none">
                <div className="flex flex-wrap items-center gap-2 mb-2.5">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-white bg-[#e62e05] px-2.5 py-0.5 rounded-full font-semibold shadow-sm">
                    {currentDisplayBlog.category}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-mono text-white/80 bg-black/60 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/10">
                    <Calendar size={11} className="text-[#e62e05]" />
                    {currentDisplayBlog.date}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-mono text-white/80 bg-black/60 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/10">
                    <Clock size={11} />
                    {currentDisplayBlog.readTime}
                  </span>
                </div>

                <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight leading-snug line-clamp-2 drop-shadow-md mb-2">
                  {currentDisplayBlog.title}
                </h3>

                <p className="text-xs md:text-sm text-white/80 line-clamp-2 leading-relaxed max-w-lg drop-shadow font-sans">
                  {currentDisplayBlog.summary}
                </p>
              </div>
            )}
          </div>
        }
      >
        {/* Dynamic Category & Tag Filter Section */}
        <section
          className="vb-card p-4 sm:p-5 md:p-6 bg-[var(--vb-panel)] border border-[var(--vb-border)] rounded-[var(--vb-radius)]"
          aria-label="Filter blog articles"
        >
          {/* Header row of filter bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[var(--vb-text-muted)]">
              <Filter size={13} className="text-[#e62e05]" />
              <span>Filter by Category &amp; Tags</span>
            </div>

            {isFiltered && (
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex items-center gap-1 text-xs font-mono text-[#e62e05] hover:underline cursor-pointer"
              >
                <X size={12} />
                <span>Reset ({filteredBlogs.length} results)</span>
              </button>
            )}
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap gap-2 mb-3" role="group" aria-label="Categories">
            {categories.map((category) => {
              const isActive = selectedCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  data-tag={category}
                  onClick={() => handleCategorySelect(category)}
                  className={`vb-tag-pill px-3.5 py-1.5 rounded-[8px] text-xs font-medium transition-all duration-200 cursor-pointer select-none ${
                    isActive
                      ? 'active bg-[#e62e05] text-white shadow-md shadow-[#e62e05]/30 font-semibold'
                      : 'bg-[var(--vb-subpanel)] text-[var(--vb-text-muted)] border border-[var(--vb-border)] hover:border-[var(--vb-text)] hover:text-[var(--vb-text)]'
                  }`}
                  aria-pressed={isActive}
                >
                  {category}
                </button>
              );
            })}
          </div>

          {/* Tag Pills */}
          {allTags.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 pt-3 border-t border-[var(--vb-border)]/60" role="group" aria-label="Tags">
              <span className="text-[11px] font-mono text-[var(--vb-text-muted)] mr-1 flex items-center gap-1">
                <Tag size={11} className="text-[var(--vb-text-muted)]" />
                Tags:
              </span>
              {allTags.map((tag) => {
                const isActive = selectedTag === tag;
                return (
                  <button
                    key={tag}
                    type="button"
                    data-tag={tag}
                    onClick={() => handleTagSelect(tag)}
                    className={`vb-tag-pill px-2.5 py-0.5 rounded-full text-[11px] font-mono transition-all duration-200 cursor-pointer select-none ${
                      isActive
                        ? 'active bg-[#e62e05] text-white font-semibold shadow-sm'
                        : 'bg-[var(--vb-subpanel)]/60 text-[var(--vb-text-muted)] border border-[var(--vb-border)] hover:border-[var(--vb-text)]/40 hover:text-[var(--vb-text)]'
                    }`}
                    aria-pressed={isActive}
                  >
                    #{tag}
                  </button>
                );
              })}
            </div>
          )}
        </section>

        {/* Blog Posts Grid */}
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
                  {/* Thumbnail Container (16:10 aspect ratio with hover zoom) */}
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
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                    {/* Category Badge */}
                    <div className="absolute top-3 left-3">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-white/95 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/15 font-semibold">
                        {blog.category}
                      </span>
                    </div>

                    {/* Read Article Pill */}
                    <div className="absolute bottom-3 right-3 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white text-black text-xs font-semibold shadow-lg">
                        Read <ArrowUpRight size={13} />
                      </span>
                    </div>
                  </Link>

                  {/* Card Content Body */}
                  <div className="p-5 flex-1 flex flex-col">
                    {/* Metadata Row: Date with Calendar, Read Time with Clock */}
                    <div className="flex items-center gap-3 text-[11px] font-mono text-[var(--vb-text-muted)] mb-2.5">
                      <span className="inline-flex items-center gap-1">
                        <Calendar size={12} className="text-[#e62e05]" />
                        {blog.date}
                      </span>
                      <span className="text-[var(--vb-border)]">&bull;</span>
                      <span className="inline-flex items-center gap-1">
                        <Clock size={12} className="text-[var(--vb-text-muted)]" />
                        {blog.readTime}
                      </span>
                    </div>

                    {/* Title with vermilion hover */}
                    <h2 className="text-lg font-bold text-[var(--vb-text)] mb-2 group-hover:text-[#e62e05] transition-colors leading-snug line-clamp-2">
                      <Link to={blog.link || `/blogs/${blog.slug}`}>
                        {blog.title}
                      </Link>
                    </h2>

                    {/* 2-line clamped summary */}
                    <p className="text-xs text-[var(--vb-text-muted)] line-clamp-2 leading-relaxed font-sans mb-3">
                      {blog.summary}
                    </p>

                    {/* Tag Pills Preview */}
                    {blog.tags && blog.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-auto pt-2">
                        {blog.tags.slice(0, 3).map((tag, tIdx) => (
                          <span
                            key={tIdx}
                            className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--vb-subpanel)] text-[var(--vb-text-muted)] border border-[var(--vb-border)]"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Card Action Link */}
                <div className="px-5 pb-5 pt-0 mt-auto">
                  <div className="pt-3 border-t border-[var(--vb-border)]/50">
                    <Link
                      to={blog.link || `/blogs/${blog.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#e62e05] group-hover:translate-x-1 transition-transform"
                    >
                      <span>Explore article</span>
                      <ArrowUpRight size={13} />
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))
          ) : (
            <div className="col-span-full vb-card p-12 text-center bg-[var(--vb-panel)] border border-[var(--vb-border)] rounded-[var(--vb-radius)]">
              <div className="w-12 h-12 rounded-full bg-[#e62e05]/10 text-[#e62e05] flex items-center justify-center mx-auto mb-4">
                <BookOpen size={22} />
              </div>
              <h3 className="text-xl font-bold text-[var(--vb-text)] mb-2">No Articles Found</h3>
              <p className="text-sm text-[var(--vb-text-muted)] max-w-md mx-auto mb-6">
                No published articles matched the selected filter criteria. Try adjusting or clearing your filters.
              </p>
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#e62e05] text-white font-medium text-xs hover:brightness-110 transition-all cursor-pointer shadow-md shadow-[#e62e05]/30"
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
