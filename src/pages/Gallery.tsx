
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowUpRight } from 'lucide-react';
import PageTransition from '../components/layout/PageTransition';

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [filter, setFilter] = useState('All');
  
  const categories = ['All', 'Renders', 'Screenshots', 'Concepts', 'Designs'];
  
  // Mock gallery data
  const galleryItems = Array.from({ length: 12 }).map((_, i) => ({
    id: i,
    src: `https://picsum.photos/seed/gallery${i}/800/800`,
    category: categories[Math.floor(Math.random() * (categories.length - 1)) + 1],
    title: `Project Asset ${i + 1}`,
    software: "Project Detail"
  }));

  const filteredItems = filter === 'All' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === filter);

  return (
    <PageTransition>
      <div className="bg-white text-black dark:bg-black dark:text-white min-h-screen pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-20">
            <h1 className="text-6xl md:text-8xl font-bold mb-8 tracking-tighter text-black dark:text-white">Gallery</h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl leading-relaxed">
              A visual archive of experiments, renders, and design explorations.
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode='popLayout'>
            {filteredItems.map((item) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                key={item.id}
                className="relative group cursor-pointer aspect-square overflow-hidden rounded-2xl bg-gray-100 dark:bg-zinc-900"
                onClick={() => setSelectedImage(item.src)}
              >
                <img 
                  src={item.src} 
                  alt={item.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-8">
                  <span className="text-blue-400 text-xs font-mono uppercase tracking-widest mb-2">{item.category}</span>
                  <h3 className="text-white font-bold text-2xl mb-1">{item.title}</h3>
                  <p className="text-gray-400 text-sm">{item.software}</p>
                </div>
                <div className="absolute top-4 right-4 bg-white/10 backdrop-blur p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <ArrowUpRight className="text-white" size={20} />
                </div>
              </motion.div>
            ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Lightbox */}
        <AnimatePresence>
          {selectedImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-white/95 dark:bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-12"
              onClick={() => setSelectedImage(null)}
            >
              <button 
                className="absolute top-8 right-8 text-black hover:text-blue-600 dark:text-white dark:hover:text-blue-500 transition-colors z-50"
                onClick={() => setSelectedImage(null)}
              >
                <X size={40} />
              </button>
              <motion.img
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                src={selectedImage}
                alt="Full view"
                className="max-w-full max-h-full rounded-lg shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
};

export default Gallery;
