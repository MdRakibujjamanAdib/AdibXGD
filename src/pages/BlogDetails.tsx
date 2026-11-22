import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Calendar, Tag, ArrowUpRight, Share2 } from 'lucide-react';
import { blogs } from '../data/blogs';
import VisbeyondLayout from '../components/layout/VisbeyondLayout';
import SEO from '../components/SEO';

export default function BlogDetails() {
  const { slug } = useParams<{ slug: string }>();
  const blog = blogs.find(b => b.slug === slug);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!blog) {
    return (
      <VisbeyondLayout pageLabel="Not Found">
        <div className="vb-card p-12 text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Article Not Found</h1>
          <p className="text-[#a1a1aa] mb-6">The article you requested could not be located.</p>
          <Link
            to="/blogs"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#e62e05] text-white font-medium text-sm hover:brightness-110 transition-all"
          >
            <ArrowLeft size={16} /> Back to Insights
          </Link>
        </div>
      </VisbeyondLayout>
    );
  }

  return (
    <>
      <SEO
        title={blog.title}
        description={blog.summary}
        image={blog.image}
        type="article"
        customKeywords={blog.seo?.keywords}
        customMeta={blog.seo?.meta}
      />
      <VisbeyondLayout
        pageLabel={blog.category}
        showcaseImage={blog.image}
        showcaseAlt={blog.title}
      >
        {/* Header Card */}
        <section className="vb-card p-6 md:p-8" aria-label="Article header">
          <div className="flex items-center justify-between gap-4 mb-6">
            <Link
              to="/blogs"
              className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#a1a1aa] hover:text-white transition-colors group"
            >
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
              <span>Back to Insights</span>
            </Link>

            <span className="text-[11px] font-mono uppercase tracking-widest text-[#e62e05] bg-[#e62e05]/10 px-2.5 py-1 rounded">
              {blog.category}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-[#71717a] mb-3">
            <Calendar size={13} className="text-[#e62e05]" />
            <span>{blog.date}</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-6 leading-[1.15]">
            {blog.title}
          </h1>

          <p className="text-base md:text-lg text-[#a1a1aa] leading-relaxed font-sans border-l-2 border-[#e62e05] pl-4">
            {blog.summary}
          </p>
        </section>

        {/* Featured Image Card */}
        <section className="vb-card overflow-hidden p-2" aria-label="Article hero visual">
          <div className="aspect-[21/9] w-full rounded-lg overflow-hidden bg-[#090909]">
            <img
              src={blog.image}
              alt={blog.title}
              className="w-full h-full object-cover"
            />
          </div>
        </section>

        {/* Full Article Content Card */}
        <section className="vb-card p-6 md:p-8" aria-label="Article content">
          <div
            className="prose prose-invert max-w-none text-sm md:text-base text-[#d4d4d8] leading-relaxed font-sans space-y-4
              prose-headings:text-white prose-headings:font-bold prose-headings:tracking-tight
              prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4
              prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3
              prose-a:text-[#e62e05] prose-a:underline hover:prose-a:brightness-125
              prose-p:leading-relaxed
              prose-code:text-[#e62e05] prose-code:bg-[#141414] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
              prose-blockquote:border-l-[#e62e05] prose-blockquote:text-[#a1a1aa]"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </section>
      </VisbeyondLayout>
    </>
  );
}
