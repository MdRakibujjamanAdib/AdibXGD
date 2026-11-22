import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Calendar, Tag, Sparkles } from 'lucide-react';
import { blogs } from '../../data/blogs';
import VisbeyondLayout from '../../components/layout/VisbeyondLayout';
import SEO from '../../components/SEO';

export default function Blogs() {
  return (
    <>
      <SEO
        title="Insights & Articles"
        description="Read the latest insights and articles from Md Rakibujjaman Adib on AI, sustainable tech, and the future of creative industries."
      />
      <VisbeyondLayout
        pageLabel="Insights"
        showcaseImage="/images/visbeyond/m0fsnMH14U4pPOavXf6o8bIjA.png"
        showcaseAlt="Blogs Showcase"
      >
        {/* Header Card */}
        <section className="vb-card p-6 md:p-8" aria-label="Insights Header">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#e62e05] bg-[#e62e05]/10 px-2.5 py-1 rounded">
              Knowledge &bull; Thought
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4 leading-[1.1]">
            Insights &amp; Articles
          </h1>

          <p className="text-base md:text-lg text-[#a1a1aa] leading-relaxed font-sans max-w-2xl">
            Technical deep dives, creative engineering strategies, and reflections on the evolving role of AI in 3D art and design.
          </p>
        </section>

        {/* Blog Posts Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-4" aria-label="Articles list">
          {blogs.map((blog, idx) => (
            <motion.article
              key={blog.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: idx * 0.08 }}
              className="vb-card overflow-hidden group flex flex-col justify-between"
            >
              <div>
                {/* Thumbnail */}
                <Link
                  to={blog.link}
                  className="block relative aspect-[16/10] overflow-hidden rounded-t-xl bg-[#090909]"
                >
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                  {/* Category Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-white/90 bg-black/60 backdrop-blur px-2.5 py-1 rounded-full border border-white/10">
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

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-center gap-3 text-[11px] font-mono text-[#71717a] mb-2.5">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} className="text-[#e62e05]" /> {blog.date}
                    </span>
                  </div>

                  <h2 className="text-lg font-bold text-white mb-2 group-hover:text-[#e62e05] transition-colors leading-snug">
                    <Link to={blog.link}>{blog.title}</Link>
                  </h2>

                  <p className="text-xs text-[#a1a1aa] line-clamp-2 leading-relaxed font-sans">
                    {blog.summary}
                  </p>
                </div>
              </div>

              {/* Bottom Card Border Accent */}
              <div className="px-5 pb-5 pt-0">
                <Link
                  to={blog.link}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#e62e05] group-hover:translate-x-1 transition-transform"
                >
                  <span>Explore article</span>
                  <ArrowUpRight size={13} />
                </Link>
              </div>
            </motion.article>
          ))}
        </section>
      </VisbeyondLayout>
    </>
  );
}
