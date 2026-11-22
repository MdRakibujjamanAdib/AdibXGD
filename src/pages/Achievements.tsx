import React from 'react';
import { Award, Trophy, Star, ArrowUpRight } from 'lucide-react';
import { awards } from '../data/content';
import VisbeyondLayout from '../components/layout/VisbeyondLayout';
import SEO from '../components/SEO';

export default function Achievements() {
  return (
    <>
      <SEO
        title="Achievements & Honors"
        description="Explore the awards and research recognitions of Md Rakibujjaman Adib."
      />
      <VisbeyondLayout
        pageLabel="Honors"
        showcaseImage="/images/visbeyond/nX3taeclTeFa2pvNV9y9RhQxbZc.png"
        showcaseAlt="Achievements Showcase"
      >
        {/* Header Card */}
        <section className="vb-card p-6 md:p-8" aria-label="Achievements header">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#e62e05] bg-[#e62e05]/10 px-2.5 py-1 rounded">
              Recognition
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4 leading-[1.1]">
            Achievements &amp; Honors
          </h1>

          <p className="text-base md:text-lg text-[#a1a1aa] leading-relaxed font-sans max-w-2xl">
            Competitions, design showcases, and research contributions in multimedia, 3D visualization, and sustainable innovation.
          </p>
        </section>

        {/* Awards Bento Grid */}
        <section className="vb-card p-6 md:p-8" aria-label="Awards list">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-[#e62e05]" />
              <h2 className="text-2xl font-bold tracking-tight text-white">
                Selected Awards
              </h2>
            </div>
            <span className="text-xs font-mono text-[#71717a]">
              {awards.length} Honors
            </span>
          </div>

          <div className="space-y-3">
            {awards.map((award, index) => (
              <div
                key={index}
                className="p-5 rounded-xl bg-[#141414] border border-white/5 hover:border-[#e62e05]/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#e62e05]/10 text-[#e62e05] flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                    <Award size={16} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-[#e62e05] transition-colors">
                      {award.title}
                    </h3>
                    <p className="text-xs text-[#a1a1aa] font-sans mt-0.5">
                      {award.result}
                    </p>
                  </div>
                </div>

                <div className="sm:self-center shrink-0">
                  <span className="text-xs font-mono font-semibold text-[#e62e05] bg-[#e62e05]/10 border border-[#e62e05]/20 px-3 py-1 rounded-full">
                    {award.year}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </VisbeyondLayout>
    </>
  );
}
