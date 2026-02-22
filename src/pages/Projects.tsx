
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { projects } from '../data/content';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import PageTransition from '../components/layout/PageTransition';

const Projects = () => {
  const [filter, setFilter] = useState('All');
  const categories = ['All', '3D', 'AI', 'Web', 'Academic'];

  const filteredProjects = filter === 'All' 
    ? projects 
    : projects.filter(p => p.category === filter);

  return (
    <PageTransition>
      <div className="bg-white text-black dark:bg-black dark:text-white min-h-screen pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-20">
            <h1 className="text-6xl md:text-8xl font-bold mb-8 tracking-tighter text-black dark:text-white">Selected Work</h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl leading-relaxed">
              A curated collection of projects exploring the intersection of design, artificial intelligence, and interactive experiences.
            </p>
          </div>

          {/* Minimal Filters */}
          <div className="flex flex-wrap gap-8 mb-20 border-b border-gray-100 dark:border-zinc-900 pb-4">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`text-lg font-bold transition-colors relative pb-4 ${
                  filter === cat 
                    ? 'text-black dark:text-white' 
                    : 'text-gray-400 hover:text-black dark:hover:text-white'
                }`}
              >
                {cat}
                {filter === cat && (
                  <motion.div 
                    layoutId="activeFilter"
                    className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 dark:bg-blue-500"
                  />
                )}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-24">
            <AnimatePresence mode='popLayout'>
            {filteredProjects.map((project) => (
              <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5 }}
                key={project.id}
                className="group"
              >
                <Link to={`/projects/${project.id}`} className="block overflow-hidden rounded-2xl mb-8 relative aspect-[4/3]">
                  <img 
                    src={project.image} 
                    alt={project.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 grayscale group-hover:grayscale-0"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 dark:bg-black/90 backdrop-blur px-4 py-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-sm font-bold flex items-center gap-2">View Case Study <ArrowUpRight size={14} /></span>
                  </div>
                </Link>
                
                <div>
                  <div className="flex justify-between items-baseline mb-3">
                    <h3 className="text-3xl font-bold text-black dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-500 transition-colors">
                      <Link to={`/projects/${project.id}`}>{project.title}</Link>
                    </h3>
                    <span className="text-sm font-mono text-gray-400 dark:text-zinc-600 uppercase tracking-widest">{project.category}</span>
                  </div>
                  
                  <p className="text-lg text-gray-600 dark:text-gray-400 line-clamp-2 mb-6 leading-relaxed">
                    {project.summary}
                  </p>
                  
                  <div className="flex flex-wrap gap-3">
                    {project.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="text-sm font-medium text-gray-500 dark:text-gray-500 border border-gray-200 dark:border-zinc-800 px-3 py-1 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Projects;
