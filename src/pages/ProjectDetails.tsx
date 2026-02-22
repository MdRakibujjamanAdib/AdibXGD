
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, ExternalLink, Github, Layers, Code, CheckCircle, ArrowUpRight } from 'lucide-react';
import { projects } from '../data/projects';
import PageTransition from '../components/layout/PageTransition';
import SEO from '../components/SEO';

const ProjectDetails = () => {
  const { id } = useParams();
  const project = projects.find(p => p.id === id);

  if (!project) {
    return (
      <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-4xl font-bold mb-4">Project not found</h2>
          <Link to="/projects" className="text-blue-600 hover:underline">Back to Projects</Link>
        </div>
      </div>
    );
  }

  return (
    <PageTransition>
      <SEO
        title={`${project.title} - Project Case Study`}
        description={project.summary}
        image={project.thumbnail}
        type="article"
      />
      <div className="bg-white text-black dark:bg-black dark:text-white min-h-screen pt-32 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <Link to="/projects" className="inline-flex items-center text-lg font-bold text-gray-500 hover:text-black dark:hover:text-white mb-12 transition-colors group">
            <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Projects
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
            <div>
              <div className="flex flex-wrap gap-4 mb-8">
                <span className="text-sm font-mono uppercase tracking-widest text-blue-600 dark:text-blue-500">
                  {project.category}
                </span>
                {project.role && (
                  <span className="text-sm font-mono uppercase tracking-widest text-gray-400">
                    / {project.role}
                  </span>
                )}
              </div>

              <h1 className="text-6xl md:text-8xl font-bold mb-8 tracking-tighter text-black dark:text-white leading-[0.9]">{project.title}</h1>
            </div>
            <div className="flex flex-col justify-end">
              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 leading-relaxed">
                {project.summary}
              </p>
            </div>
          </div>

          {/* Main Media Area */}
          <div className="w-full rounded-3xl overflow-hidden mb-24 bg-gray-100 dark:bg-zinc-900">
            {project.videoUrl ? (
              <div className="aspect-video w-full">
                <iframe
                  src={project.videoUrl}
                  title={project.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            ) : (
              <div className="aspect-video w-full">
                <img src={project.thumbnail} alt={project.title} className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-20">
            <div className="lg:col-span-2 space-y-20">
              <section>
                <h2 className="text-3xl font-bold mb-8 text-black dark:text-white">Overview</h2>
                <div className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line">
                  {project.description}
                </div>
              </section>

              {/* Additional Images / Renders */}
              {project.images && project.images.length > 0 && (
                <section>
                  <h2 className="text-3xl font-bold mb-8 text-black dark:text-white">Gallery</h2>
                  <div className="grid grid-cols-1 gap-8">
                    {project.images.map((img, index) => (
                      <div key={index} className="rounded-2xl overflow-hidden bg-gray-100 dark:bg-zinc-900">
                        <img src={img} alt={`${project.title} render ${index + 1}`} className="w-full h-auto" />
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>

            <div className="space-y-12">
              <div>
                <h3 className="text-sm font-mono uppercase tracking-widest text-gray-500 mb-6">Tech Stack</h3>
                <div className="flex flex-wrap gap-3">
                  {project.tags.map(tag => (
                    <span key={tag} className="px-4 py-2 border border-gray-200 dark:border-zinc-800 rounded-full text-sm font-bold text-black dark:text-white">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {(project.demoUrl || project.repoUrl) && (
                <div>
                  <h3 className="text-sm font-mono uppercase tracking-widest text-gray-500 mb-6">Links</h3>
                  <div className="space-y-4">
                    {project.demoUrl && (
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-between bg-black text-white dark:bg-white dark:text-black px-6 py-4 rounded-xl font-bold hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors group"
                      >
                        Live Demo <ArrowUpRight className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" size={20} />
                      </a>
                    )}
                    {project.repoUrl && (
                      <a
                        href={project.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-between bg-transparent border border-gray-200 dark:border-zinc-800 text-black dark:text-white px-6 py-4 rounded-xl font-bold hover:bg-gray-50 dark:hover:bg-zinc-900 transition-colors group"
                      >
                        Source Code <Github className="group-hover:scale-110 transition-transform" size={20} />
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
};

export default ProjectDetails;
