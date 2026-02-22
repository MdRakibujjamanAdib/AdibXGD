
import React from 'react';
import { motion } from 'motion/react';
import { FileText, Award } from 'lucide-react';
import { certifications, awards } from '../data/content';
import PageTransition from '../components/layout/PageTransition';

const Achievements = () => {
  return (
    <PageTransition>
    <div className="bg-white text-black dark:bg-black dark:text-white min-h-screen pt-24 pb-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tighter text-black dark:text-white">Achievements</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">Certifications, awards, and recognition.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Certs Column */}
          <div className="space-y-12">
            <section>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-blue-600 dark:text-blue-400">
                <FileText size={24} /> Certifications
              </h2>
              <div className="space-y-4">
                {certifications.map((cert, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 border-b border-black/5 dark:border-white/5 last:border-0">
                    <div className="w-10 h-10 bg-black/5 dark:bg-white/5 rounded-lg flex items-center justify-center shrink-0 text-gray-500">
                      <FileText size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-black dark:text-white">{cert.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{cert.issuer} • {cert.year}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Awards Column */}
          <div className="space-y-12">
            <section>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-blue-600 dark:text-blue-400">
                <Award size={24} /> Awards
              </h2>
              <div className="grid grid-cols-1 gap-4">
                {awards.map((award, index) => (
                  <div key={index} className="bg-gradient-to-r from-gray-50 to-white dark:from-zinc-900 dark:to-black border border-black/5 dark:border-white/10 p-5 rounded-xl flex justify-between items-center shadow-sm">
                    <div>
                      <h3 className="font-bold text-black dark:text-white">{award.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{award.result}</p>
                    </div>
                    <span className="text-xs font-mono text-blue-600 dark:text-blue-500 border border-blue-500/20 px-2 py-1 rounded bg-blue-500/10">
                      {award.year}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          </div>

        </div>
      </div>
    </div>
    </PageTransition>
  );
};

export default Achievements;
