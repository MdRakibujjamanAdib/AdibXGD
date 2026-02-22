
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { projects } from '../data/projects';
import { ArrowUpRight } from 'lucide-react';
import PageTransition from '../components/layout/PageTransition';

const Projects = () => {
  const [filter, setFilter] = useState('All');

  // Define all possible categories
  const allCategories = [
    'All',
    '3D',
    'Branding & Identity',
    'Web & AI',
    'Automation',
    'Academic',
    'Film & Video',
    'Game Dev',
    'Android Apps'
  ];

  // Calculate project counts for each category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    
    // Initialize counts
    allCategories.forEach(cat => {
      if (cat === 'All') {
        counts[cat] = projects.length;
      } else {
        counts[cat] = projects.filter(p => p.category === cat).length;
      }
    });
    return counts;
  }, []);

  // Sort categories based on count (descending), keeping 'All' first
  const sortedCategories = useMemo(() => {
    return allCategories
      .filter(cat => categoryCounts[cat] > 0) // Filter out empty categories
      .sort((a, b) => {
        if (a === 'All') return -1;
        if (b === 'All') return 1;
        return categoryCounts[b] - categoryCounts[a];
      });
  }, [categoryCounts]);

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

          {/* Dynamic Filters */}
          <div className="flex flex-wrap gap-8 mb-20 border-b border-gray-100 dark:border-zinc-900 pb-4">
            {sortedCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`text-lg font-bold transition-colors relative pb-4 ${
                  filter === cat 
                    ? 'text-black dark:text-white' 
                    : 'text-gray-400 hover:text-black dark:hover:text-white'
                }`}
              >
                {cat} <span className="text-xs align-top opacity-50 ml-1">{categoryCounts[cat]}</span>
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
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-24">
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
                    src={project.thumbnail} 
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
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Projects;
