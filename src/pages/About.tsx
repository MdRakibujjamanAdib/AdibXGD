
import React from 'react';
import { motion } from 'motion/react';
import { Download, Mail, MapPin, Phone, ArrowRight } from 'lucide-react';
import { personalInfo, skills } from '../data/content';
import PageTransition from '../components/layout/PageTransition';

const About = () => {
  return (
    <PageTransition>
      <div className="bg-white text-black dark:bg-black dark:text-white min-h-screen pt-32 pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Intro */}
          <section className="mb-32">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-6xl md:text-8xl font-bold mb-12 tracking-tighter text-black dark:text-white leading-[0.9]"
            >
              Creative <br />
              Technologist.
            </motion.h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="md:col-span-2">
                <div className="prose prose-xl text-gray-600 dark:text-gray-400 leading-relaxed">
                  <p className="mb-8">
                    I’m Adib — a creative technologist who loves combining 3D art and technology. I work with Autodesk Maya, 3ds Max, and V-Ray to build realistic models and renders, and I’m exploring Arnold for advanced results.
                  </p>
                  <p>
                    Alongside 3D, I build web products and AI tools. I’m the Co-Founder of <span className="text-black dark:text-white font-bold">Green D</span>, leading sustainable tech innovation, and previously founded <span className="text-black dark:text-white font-bold">MCT Labs</span>, an AI platform for creative professionals. My goal is to keep improving every month — art quality, code efficiency, and user experience.
                  </p>
                </div>
                
                <div className="mt-12">
                  <a href="#" className="inline-flex items-center gap-2 text-lg font-bold border-b-2 border-black dark:border-white pb-1 hover:text-blue-600 dark:hover:text-blue-500 hover:border-blue-600 dark:hover:border-blue-500 transition-colors">
                    Download Resume <Download size={20} />
                  </a>
                </div>
              </div>
              
              <div className="space-y-8">
                <div>
                  <h3 className="text-sm font-mono uppercase tracking-widest text-gray-500 mb-2">Location</h3>
                  <p className="text-lg font-bold">{personalInfo.location}</p>
                </div>
                <div>
                  <h3 className="text-sm font-mono uppercase tracking-widest text-gray-500 mb-2">Email</h3>
                  <p className="text-lg font-bold">{personalInfo.email}</p>
                </div>
                <div>
                  <h3 className="text-sm font-mono uppercase tracking-widest text-gray-500 mb-2">Focus</h3>
                  <p className="text-lg font-bold">AI Architecture, 3D Design, Web Development</p>
                </div>
              </div>
            </div>
          </section>

          {/* Values */}
          <section className="mb-32 border-t border-gray-100 dark:border-zinc-900 pt-20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div>
                <h2 className="text-4xl font-bold mb-8 text-black dark:text-white">Core Values</h2>
              </div>
              <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-16">
                {[
                  { title: "Quality", desc: "I believe in pixel-perfect execution and attention to detail." },
                  { title: "Clarity", desc: "Design should be intuitive and solve problems without confusion." },
                  { title: "Consistency", desc: "Maintaining high standards across every project and interaction." },
                  { title: "Learning", desc: "Always exploring new tools, engines, and frameworks." }
                ].map((value, i) => (
                  <div key={i}>
                    <span className="text-blue-600 dark:text-blue-500 font-mono text-sm mb-2 block">0{i + 1}</span>
                    <h3 className="text-2xl font-bold text-black dark:text-white mb-4">{value.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{value.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Tools & Workflow */}
          <section className="mb-20 border-t border-gray-100 dark:border-zinc-900 pt-20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div>
                <h2 className="text-4xl font-bold mb-8 text-black dark:text-white">Stack</h2>
              </div>
              <div className="md:col-span-2 space-y-12">
                {Object.entries(skills).map(([category, items]) => (
                  <div key={category} className="border-b border-gray-100 dark:border-zinc-900 pb-12 last:border-0 last:pb-0">
                    <h3 className="text-lg font-bold uppercase tracking-wider text-gray-400 dark:text-zinc-600 mb-6">{category}</h3>
                    <div className="flex flex-wrap gap-x-8 gap-y-4">
                      {items.map((skill) => (
                        <span key={skill} className="text-xl md:text-2xl font-bold text-black dark:text-white hover:text-blue-600 dark:hover:text-blue-500 transition-colors cursor-default">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

        </div>
      </div>
    </PageTransition>
  );
};

export default About;
