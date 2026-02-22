import React from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, Calendar, Tag } from 'lucide-react';
import { blogs } from '../data/content';
import PageTransition from '../components/layout/PageTransition';

const Blogs = () => {
  return (
    <PageTransition>
      <div className="bg-white text-black dark:bg-black dark:text-white min-h-screen pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-20">
            <h1 className="text-6xl md:text-8xl font-bold mb-8 tracking-tighter text-black dark:text-white">Insights</h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl leading-relaxed">
              Thoughts on AI, design, and the future of technology.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {blogs.map((blog, index) => (
              <motion.a
                href={blog.link}
                key={blog.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group block"
              >
                <div className="relative overflow-hidden rounded-2xl mb-6 aspect-[4/3]">
                  <img 
                    src={blog.image} 
                    alt={blog.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 grayscale group-hover:grayscale-0"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 dark:bg-black/90 backdrop-blur px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <ArrowUpRight size={18} />
                  </div>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-3 font-mono">
                  <span className="flex items-center gap-1"><Calendar size={14} /> {blog.date}</span>
                  <span className="flex items-center gap-1"><Tag size={14} /> {blog.category}</span>
                </div>

                <h3 className="text-2xl font-bold mb-3 text-black dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-500 transition-colors leading-tight">
                  {blog.title}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-400 line-clamp-3 leading-relaxed">
                  {blog.summary}
                </p>
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Blogs;
