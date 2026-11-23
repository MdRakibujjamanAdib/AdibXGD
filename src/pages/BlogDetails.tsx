import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Tag,
  ArrowUpRight,
  Share2,
  Check,
  List,
  ChevronDown,
} from 'lucide-react';
import { blogs, Blog } from '../data/blogs';
import VisbeyondLayout from '../components/layout/VisbeyondLayout';
import SEO from '../components/SEO';
import {
  InvertedCornerTopRight,
  InvertedCornerBottomLeft,
} from '../components/ui/VisbeyondIcons';

export default function BlogDetails() {
  const { slug } = useParams<{ slug: string }>();
  const blog = blogs.find((b) => b.slug === slug);

  const currentIndex = blog ? blogs.findIndex((b) => b.slug === blog.slug) : -1;
  const nextBlog =
    blog && blogs.length > 1 ? blogs[(currentIndex + 1) % blogs.length] : null;

  const [activeSectionId, setActiveSectionId] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [mobileTocOpen, setMobileTocOpen] = useState<boolean>(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // Scroll to anchor hash or top on slug change
  useEffect(() => {
    if (window.location.hash) {
      const hash = window.location.hash.replace('#', '');
      const element = document.getElementById(hash);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          setActiveSectionId(hash);
        }, 120);
        return;
      }
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [slug]);

  // Scroll Spy for Table of Contents
  useEffect(() => {
    if (!blog?.tableOfContents || blog.tableOfContents.length === 0) return;

    const handleIntersect: IntersectionObserverCallback = (entries) => {
      const visibleEntries = entries.filter((entry) => entry.isIntersecting);
      if (visibleEntries.length > 0) {
        setActiveSectionId(visibleEntries[0].target.id);
      }
    };

    const observer = new IntersectionObserver(handleIntersect, {
      rootMargin: '-80px 0px -60% 0px',
      threshold: [0, 1.0],
    });

    blog.tableOfContents.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [blog?.slug, blog?.tableOfContents]);

  // Syntax and Copy Button Enhancement for Code Blocks
  useEffect(() => {
    if (!contentRef.current) return;
    const preElements = contentRef.current.querySelectorAll('pre');

    preElements.forEach((pre) => {
      if (pre.getAttribute('data-enhanced') === 'true') return;
      pre.setAttribute('data-enhanced', 'true');

      const code = pre.querySelector('code');
      const rawText = code ? code.innerText : pre.innerText;

      // Extract language from className (e.g. language-typescript -> TYPESCRIPT)
      const classNames: string[] = code ? Array.from(code.classList) : [];
      const langClass = classNames.find((c: string) => c.startsWith('language-'));
      const lang = langClass
        ? langClass.replace('language-', '').toUpperCase()
        : 'CODE';

      // Wrapper container
      const wrapper = document.createElement('div');
      wrapper.className =
        'vb-code-block my-6 rounded-xl border border-[var(--vb-border)] overflow-hidden bg-[#0d0d0d] shadow-md';

      // Header bar
      const header = document.createElement('div');
      header.className =
        'flex items-center justify-between px-4 py-2.5 bg-[#141414] border-b border-[var(--vb-border)] text-xs font-mono text-[#a1a1aa] select-none';

      const langBadge = document.createElement('div');
      langBadge.className = 'flex items-center gap-2';
      langBadge.innerHTML = `
        <span class="flex gap-1.5 mr-2">
          <span class="w-2.5 h-2.5 rounded-full bg-[#e62e05]/80"></span>
          <span class="w-2.5 h-2.5 rounded-full bg-[#f59e0b]/80"></span>
          <span class="w-2.5 h-2.5 rounded-full bg-[#10b981]/80"></span>
        </span>
        <span class="font-semibold text-white/90 uppercase text-[11px] tracking-wider">${lang}</span>
      `;

      const copyBtn = document.createElement('button');
      copyBtn.setAttribute('type', 'button');
      copyBtn.setAttribute('aria-label', 'Copy code to clipboard');
      copyBtn.className =
        'vb-code-copy-btn-inline flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#1f1f1f] hover:bg-[#2a2a2a] text-[#d4d4d8] hover:text-white transition-all text-[11px] cursor-pointer';
      copyBtn.innerHTML = `
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
        <span>Copy</span>
      `;

      copyBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        try {
          if (navigator.clipboard) {
            await navigator.clipboard.writeText(rawText);
          }
          copyBtn.innerHTML = `
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            <span class="text-[#10b981] font-medium">Copied!</span>
          `;
          setTimeout(() => {
            copyBtn.innerHTML = `
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
              <span>Copy</span>
            `;
          }, 2000);
        } catch (err) {
          console.warn('Clipboard writeText failed or permission denied:', err);
        }
      });

      header.appendChild(langBadge);
      header.appendChild(copyBtn);

      pre.className =
        'p-4 overflow-x-auto font-mono text-xs sm:text-sm text-[#f1f1f1] leading-relaxed bg-[#090909] m-0';

      pre.parentNode?.insertBefore(wrapper, pre);
      wrapper.appendChild(header);
      wrapper.appendChild(pre);
    });
  }, [blog?.content]);

  // Smooth TOC navigation click handler
  const handleTocClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    id: string
  ) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.history.pushState(null, '', `#${id}`);
      setActiveSectionId(id);
    }
  };

  // Share / Copy Link handler
  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: blog?.title,
          text: blog?.summary,
          url,
        });
        return;
      } catch {
        // Fallback to clipboard
      }
    }
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.warn('Failed to copy share link:', err);
    }
  };

  // Not Found State
  if (!blog) {
    return (
      <VisbeyondLayout pageLabel="Article Not Found">
        <div className="vb-card p-12 text-center bg-[var(--vb-panel)] border border-[var(--vb-border)] rounded-[var(--vb-radius)]">
          <h1 className="text-3xl font-bold text-[var(--vb-text)] mb-4">
            Article Not Found
          </h1>
          <p className="text-[var(--vb-text-muted)] mb-6">
            The article you requested could not be located.
          </p>
          <Link
            to="/blogs"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#e62e05] text-white font-medium text-sm hover:brightness-110 transition-all shadow-md"
          >
            <ArrowLeft size={16} /> Back to Insights
          </Link>
        </div>
      </VisbeyondLayout>
    );
  }

  // Sticky Left Showcase Component
  const blogShowcase = (
    <div className="relative w-full h-full overflow-y-auto p-4 md:p-6 flex flex-col gap-4 bg-[var(--vb-bg)] pb-16 select-text">
      {/* Featured Cover Image Display */}
      <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden border border-[var(--vb-border)] bg-[var(--vb-subpanel)] group shrink-0">
        <img
          src={blog.coverImage || blog.image}
          alt={blog.coverImageAlt || blog.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 rounded-md text-[10px] font-mono uppercase tracking-wider font-semibold bg-[#e62e05] text-white shadow-sm">
            {blog.category}
          </span>
        </div>
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] text-white/90 font-mono">
          <span className="inline-flex items-center gap-1">
            <Calendar size={11} className="text-[#e62e05]" />
            {blog.date}
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock size={11} />
            {blog.readTime}
          </span>
        </div>
      </div>

      {/* Author Credentials Card */}
      <div className="vb-card p-4 flex flex-col gap-3 rounded-xl border border-[var(--vb-border)] bg-[var(--vb-panel)] shrink-0">
        <div className="flex items-center gap-3">
          <img
            src={blog.author.avatar || '/MdRakibujamanAdib.jpg'}
            alt={blog.author.name}
            className="w-12 h-12 rounded-full object-cover border-2 border-[var(--vb-border)] shrink-0"
          />
          <div className="min-w-0">
            <h3 className="text-sm font-bold text-[var(--vb-text)] truncate">
              {blog.author.name}
            </h3>
            <p className="text-xs text-[var(--vb-text-muted)] truncate font-mono">
              {blog.author.role}
            </p>
          </div>
        </div>
        {blog.author.bio && (
          <p className="text-xs text-[var(--vb-text-muted)] leading-relaxed line-clamp-3">
            {blog.author.bio}
          </p>
        )}
        <Link
          to="/about"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-[#e62e05] hover:underline pt-1"
        >
          <span>View profile &amp; credentials</span>
          <ArrowUpRight size={13} />
        </Link>
      </div>

      {/* Floating Table of Contents with Scroll Spy */}
      {blog.tableOfContents && blog.tableOfContents.length > 0 && (
        <div className="vb-card p-4 rounded-xl border border-[var(--vb-border)] bg-[var(--vb-panel)] flex-1 min-h-[220px] flex flex-col gap-3">
          <div className="flex items-center justify-between pb-2 border-b border-[var(--vb-border)]">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[var(--vb-text)] font-semibold">
              <List size={14} className="text-[#e62e05]" />
              <span>Table of Contents</span>
            </div>
            <span className="text-[10px] font-mono text-[var(--vb-text-muted)]">
              {blog.tableOfContents.length} sections
            </span>
          </div>

          <nav
            aria-label="Table of contents"
            className="vb-toc flex flex-col gap-1 overflow-y-auto pr-1"
          >
            {blog.tableOfContents.map((item) => {
              const isActive = activeSectionId === item.id;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => handleTocClick(e, item.id)}
                  className={`group flex items-start gap-2 text-xs py-2 px-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-[#e62e05]/10 text-[#e62e05] font-semibold border-l-2 border-[#e62e05]'
                      : 'text-[var(--vb-text-muted)] hover:text-[var(--vb-text)] hover:bg-[var(--vb-subpanel)]'
                  } ${item.level === 3 ? 'ml-4 text-[11px]' : ''}`}
                >
                  <span
                    className={`inline-block w-1.5 h-1.5 rounded-full mt-1.5 transition-colors shrink-0 ${
                      isActive
                        ? 'bg-[#e62e05]'
                        : 'bg-[var(--vb-border)] group-hover:bg-[#e62e05]/50'
                    }`}
                  />
                  <span className="leading-snug">{item.title}</span>
                </a>
              );
            })}
          </nav>
        </div>
      )}
    </div>
  );

  return (
    <>
      <SEO
        title={blog.title}
        description={blog.summary}
        image={blog.coverImage || blog.image}
        type="article"
        article={{
          publishedTime: blog.isoDate,
          modifiedTime: blog.isoDate,
          section: blog.category,
          tags: blog.tags,
          author: blog.author.name,
        }}
        customKeywords={blog.tags}
        customMeta={blog.seo?.meta}
      />
      <VisbeyondLayout
        pageLabel={blog.category}
        showcaseChildren={blogShowcase}
        hideShowcaseOnMobile={true}
      >
        {/* Right Reading Canvas: Header Card */}
        <section
          className="vb-card pt-16 sm:pt-20 xl:pt-8 p-6 md:p-8 rounded-xl border border-[var(--vb-border)] bg-[var(--vb-panel)]"
          aria-label="Article header"
        >
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <Link
              to="/blogs"
              className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[var(--vb-text-muted)] hover:text-[#e62e05] transition-colors group"
            >
              <ArrowLeft
                size={14}
                className="group-hover:-translate-x-1 transition-transform"
              />
              <span>Back to Insights</span>
            </Link>

            <span className="text-[11px] font-mono uppercase tracking-widest text-[#e62e05] bg-[#e62e05]/10 border border-[#e62e05]/20 px-2.5 py-1 rounded-full font-semibold">
              {blog.category}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-5xl font-extrabold tracking-tight text-[var(--vb-text)] mb-4 leading-[1.15]">
            {blog.title}
          </h1>

          <p className="text-base md:text-lg text-[var(--vb-text-muted)] leading-relaxed font-sans border-l-2 border-[#e62e05] pl-4 my-4 italic">
            {blog.subtitle || blog.summary}
          </p>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[var(--vb-border)] text-xs font-mono text-[var(--vb-text-muted)]">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <Calendar size={13} className="text-[#e62e05]" />
                <span>{blog.date}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Clock size={13} className="text-[#e62e05]" />
                <span>{blog.readTime}</span>
              </span>
            </div>

            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono bg-[var(--vb-subpanel)] hover:bg-[var(--vb-card-inset)] text-[var(--vb-text)] border border-[var(--vb-border)] hover:border-[#e62e05]/40 transition-colors cursor-pointer"
              aria-label="Share article"
            >
              {copied ? (
                <Check size={13} className="text-green-500" />
              ) : (
                <Share2 size={13} className="text-[#e62e05]" />
              )}
              <span>{copied ? 'Link Copied!' : 'Share Article'}</span>
            </button>
          </div>
        </section>

        {/* Mobile-only Cover Image */}
        <section
          className="xl:hidden vb-card overflow-hidden p-2 rounded-xl border border-[var(--vb-border)] bg-[var(--vb-panel)]"
          aria-label="Article visual preview"
        >
          <div className="aspect-[16/10] w-full rounded-lg overflow-hidden bg-[var(--vb-subpanel)]">
            <img
              src={blog.coverImage || blog.image}
              alt={blog.coverImageAlt || blog.title}
              className="w-full h-full object-cover"
            />
          </div>
        </section>

        {/* Mobile-only Table of Contents Dropdown */}
        {blog.tableOfContents && blog.tableOfContents.length > 0 && (
          <section
            className="xl:hidden vb-card p-4 rounded-xl border border-[var(--vb-border)] bg-[var(--vb-panel)]"
            aria-label="Mobile table of contents"
          >
            <button
              type="button"
              onClick={() => setMobileTocOpen(!mobileTocOpen)}
              className="w-full flex items-center justify-between text-xs font-mono uppercase tracking-wider text-[var(--vb-text)] font-semibold cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <List size={14} className="text-[#e62e05]" />
                <span>
                  Table of Contents ({blog.tableOfContents.length})
                </span>
              </div>
              <ChevronDown
                size={14}
                className={`transition-transform duration-200 ${
                  mobileTocOpen ? 'rotate-180' : ''
                }`}
              />
            </button>
            {mobileTocOpen && (
              <div className="mt-3 pt-3 border-t border-[var(--vb-border)] flex flex-col gap-1">
                {blog.tableOfContents.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    onClick={(e) => {
                      handleTocClick(e, item.id);
                      setMobileTocOpen(false);
                    }}
                    className={`text-xs py-1.5 px-2.5 rounded-lg transition-colors ${
                      activeSectionId === item.id
                        ? 'bg-[#e62e05]/10 text-[#e62e05] font-semibold'
                        : 'text-[var(--vb-text-muted)]'
                    }`}
                  >
                    {item.title}
                  </a>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Full Article Content Card */}
        <section
          className="vb-card p-6 md:p-10 rounded-xl border border-[var(--vb-border)] bg-[var(--vb-panel)]"
          aria-label="Article content"
        >
          <div
            ref={contentRef}
            className="vb-prose max-w-none text-sm md:text-base leading-relaxed font-sans space-y-4"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </section>

        {/* Article Footer: Granular Tag Pills */}
        {blog.tags && blog.tags.length > 0 && (
          <section
            className="vb-card p-6 rounded-xl border border-[var(--vb-border)] bg-[var(--vb-panel)] flex flex-wrap items-center gap-2"
            aria-label="Article tags"
          >
            <span className="text-xs font-mono uppercase tracking-wider text-[var(--vb-text-muted)] flex items-center gap-1.5 mr-2">
              <Tag size={13} className="text-[#e62e05]" />
              <span>Topics:</span>
            </span>
            {blog.tags.map((tag) => (
              <Link
                key={tag}
                to={`/blogs?tag=${encodeURIComponent(tag)}`}
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-mono bg-[var(--vb-subpanel)] hover:bg-[#e62e05]/10 text-[var(--vb-text-muted)] hover:text-[#e62e05] border border-[var(--vb-border)] hover:border-[#e62e05]/30 transition-all"
              >
                #{tag}
              </Link>
            ))}
          </section>
        )}

        {/* Article Footer: Author Credentials Card */}
        <section
          className="vb-card p-6 md:p-8 rounded-xl border border-[var(--vb-border)] bg-[var(--vb-panel)] flex flex-col sm:flex-row items-center sm:items-start gap-5"
          aria-label="Author credentials"
        >
          <img
            src={blog.author.avatar || '/MdRakibujamanAdib.jpg'}
            alt={blog.author.name}
            className="w-16 h-16 rounded-full object-cover border-2 border-[#e62e05]/30 shrink-0"
          />
          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
              <div>
                <h3 className="text-base font-bold text-[var(--vb-text)]">
                  {blog.author.name}
                </h3>
                <p className="text-xs text-[var(--vb-text-muted)] font-mono">
                  {blog.author.role}
                </p>
              </div>
              <Link
                to="/about"
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium bg-[var(--vb-subpanel)] hover:bg-[#e62e05] text-[var(--vb-text)] hover:text-white border border-[var(--vb-border)] hover:border-[#e62e05] transition-all"
              >
                <span>About Author</span>
                <ArrowUpRight size={13} />
              </Link>
            </div>
            {blog.author.bio && (
              <p className="text-xs sm:text-sm text-[var(--vb-text-muted)] leading-relaxed">
                {blog.author.bio}
              </p>
            )}
          </div>
        </section>

        {/* Article Footer: Next Article Preview Card */}
        {nextBlog && (
          <section
            className="vb-card p-6 md:p-8 rounded-xl border border-[var(--vb-border)] bg-[var(--vb-panel)] flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
            aria-label="Next article"
          >
            <div className="max-w-md">
              <span className="text-xs font-mono uppercase tracking-widest text-[#e62e05] mb-2 block font-semibold">
                Next Insight &amp; Article
              </span>
              <h3 className="text-xl md:text-2xl font-bold tracking-tight text-[var(--vb-text)] mb-2">
                {nextBlog.title}
              </h3>
              <p className="text-sm text-[var(--vb-text-muted)] line-clamp-2 mb-4 leading-relaxed">
                {nextBlog.summary}
              </p>
              <Link
                to={`/blogs/${nextBlog.slug}`}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--vb-text)] underline underline-offset-4 decoration-1 hover:text-[#e62e05] transition-colors"
              >
                <span>Read Next Article</span>
                <ArrowUpRight size={15} />
              </Link>
            </div>

            {/* Next Article Preview Card with Top-Left Inverted Cutout Tab */}
            <Link
              to={`/blogs/${nextBlog.slug}`}
              className="vb-next-preview-card group md:w-[320px] shrink-0"
              aria-label={`Next article: ${nextBlog.title}`}
            >
              <div className="vb-next-tab">
                <span className="font-semibold text-xs text-[var(--vb-text)] tracking-tight truncate max-w-[200px]">
                  {nextBlog.category}
                </span>
                <InvertedCornerTopRight className="vb-mobile-tab-corner-right" />
                <InvertedCornerBottomLeft className="vb-mobile-tab-corner-bottom" />
              </div>
              <div className="vb-next-preview-img-wrap">
                <img
                  src={nextBlog.coverImage || nextBlog.image}
                  alt={nextBlog.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                />
              </div>
            </Link>
          </section>
        )}
      </VisbeyondLayout>
    </>
  );
}
