
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Download, ExternalLink, ChevronRight, ArrowUpRight, Briefcase, GraduationCap, Trophy, Cpu, Code, Box, Palette, Share2, Calendar, Video, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';
import { personalInfo, services, experience, skills, clients, education, awards } from '../data/content';
import { projects } from '../data/projects';
import PageTransition from '../components/layout/PageTransition';
import { useNavbar } from '../context/NavbarContext';
import SEO from '../components/SEO';

const iconMap: Record<string, React.ReactNode> = {
  Cpu: <Cpu size={24} />,
  Code: <Code size={24} />,
  Box: <Box size={24} />,
  Palette: <Palette size={24} />,
  Share2: <Share2 size={24} />,
  Calendar: <Calendar size={24} />,
  Video: <Video size={24} />,
  Layers: <Layers size={24} />,
};

const Home = () => {
  const { setNavMode, setActiveSection } = useNavbar();
  const lifeAtAGlanceRef = useRef<HTMLElement>(null);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  useEffect(() => {
    const handleCustomScroll = (e: Event) => {
      const customEvent = e as CustomEvent;
      scrollToSection(customEvent.detail);
    };

    window.addEventListener('scrollToSection', handleCustomScroll);
    return () => window.removeEventListener('scrollToSection', handleCustomScroll);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['experience', 'education', 'achievements'];

      // Check if we're at the bottom of the page
      if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 100) {
        setActiveSection('Achievements');
      } else {
        for (const section of sections) {
          const element = document.getElementById(section);
          if (element) {
            const rect = element.getBoundingClientRect();
            if (rect.top <= 200 && rect.bottom >= 200) {
              setActiveSection(section.charAt(0).toUpperCase() + section.slice(1));
            }
          }
        }
      }

      // Handle Navbar Mode
      if (lifeAtAGlanceRef.current) {
        const rect = lifeAtAGlanceRef.current.getBoundingClientRect();

        // When the section is near the top (taking into account navbar height ~80px)
        if (rect.top <= 100 && rect.bottom > 100) {
          setNavMode('life-at-a-glance');
        } else {
          setNavMode('default');
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      setNavMode('default'); // Reset on unmount
    };
  }, [setNavMode]);

  return (
    <PageTransition>
      <SEO
        title="Home"
        description="I'm Md Rakibujjaman Adib, a Web Developer & Creative Technologist. Explore my portfolio in visual brand identity, automation, and 3D design."
      />
      <div className="bg-white text-black dark:bg-black dark:text-white font-sans selection:bg-blue-500 selection:text-white">

        {/* Hero Section */}
        <section className="min-h-screen flex flex-col justify-center pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-5xl"
          >
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter leading-[0.9] mb-12">
              I'm <span className="text-blue-600 dark:text-blue-500">Adib</span>. <br />
              AI Architect. <br />
              <span className="text-gray-400 dark:text-zinc-600">Creative Tech.</span> <br />
              Builder.
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-2xl leading-relaxed mb-12">
              Co-Founder of <span className="text-black dark:text-white font-semibold">Green D</span>.
              Previously founded <span className="text-black dark:text-white font-semibold">MCT Labs</span>.
              Merging machine learning with cinematic design to build intelligent futures.
            </p>

            <div className="flex flex-wrap gap-6">
              <Link
                to="/projects"
                className="group flex items-center gap-2 text-lg font-bold border-b-2 border-black dark:border-white pb-1 hover:text-blue-600 dark:hover:text-blue-500 hover:border-blue-600 dark:hover:border-blue-500 transition-all"
              >
                View Projects <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
              </Link>
              <Link
                to="/contact"
                className="group flex items-center gap-2 text-lg font-bold border-b-2 border-transparent pb-1 hover:text-blue-600 dark:hover:text-blue-500 transition-all text-gray-500 dark:text-gray-400"
              >
                Contact Me
              </Link>
            </div>
          </motion.div>
        </section>

        {/* Marquee Clients */}
        <section className="py-12 border-y border-gray-100 dark:border-zinc-900 overflow-hidden bg-gray-50 dark:bg-zinc-950/50">
          <div className="relative flex overflow-hidden group">
            <div className="flex animate-marquee whitespace-nowrap gap-20 items-center py-4">
              {[...clients, ...clients, ...clients].map((client, index) => (
                <div key={index} className="flex items-center justify-center w-32 h-16 md:w-40 md:h-20 opacity-50 hover:opacity-100 transition-opacity cursor-pointer overflow-visible">
                  <img src={client.logo} alt={client.name} className="max-w-full max-h-full object-contain grayscale hover:grayscale-0 hover:scale-110 transform transition-all duration-300" />
                </div>
              ))}
            </div>
            <div className="absolute top-0 flex animate-marquee2 whitespace-nowrap gap-20 items-center ml-20 py-4">
              {[...clients, ...clients, ...clients].map((client, index) => (
                <div key={`clone-${index}`} className="flex items-center justify-center w-32 h-16 md:w-40 md:h-20 opacity-50 hover:opacity-100 transition-opacity cursor-pointer overflow-visible">
                  <img src={client.logo} alt={client.name} className="max-w-full max-h-full object-contain grayscale hover:grayscale-0 hover:scale-110 transform transition-all duration-300" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* What I Do - Grid Layout */}
        <section className="py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="mb-20">
            <h2 className="text-sm font-mono uppercase tracking-widest text-gray-500 mb-4">Curious?</h2>
            <h3 className="text-4xl md:text-5xl font-bold tracking-tight text-black dark:text-white">What I Do</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="p-10 rounded-3xl bg-gray-50 dark:bg-zinc-900/50 border border-gray-100 dark:border-zinc-800 hover:bg-white dark:hover:bg-zinc-900 hover:shadow-xl hover:border-blue-500/30 transition-all duration-500 group"
              >
                <div className="w-14 h-14 bg-white dark:bg-zinc-800 rounded-2xl flex items-center justify-center mb-8 text-blue-600 dark:text-blue-500 shadow-sm border border-gray-100 dark:border-zinc-700 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                  {iconMap[service.icon] || <Box size={24} />}
                </div>
                <h4 className="text-2xl font-bold mb-4 text-black dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-500 transition-colors">
                  {service.title}
                </h4>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </section>



        {/* Life At A Glance (Experience, Education, Achievements) */}
        <section ref={lifeAtAGlanceRef} className="py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
          <div className="mb-12 text-center">
            <h3 className="text-4xl md:text-5xl font-bold tracking-tight text-black dark:text-white">Life At A Glance</h3>
          </div>

          <div className="space-y-32 max-w-4xl mx-auto">
            {/* Experience Section */}
            <div id="experience" className="scroll-mt-48">
              <h4 className="text-2xl font-bold text-black dark:text-white mb-12 border-b border-gray-100 dark:border-zinc-800 pb-4">Professional Journey</h4>

              <div className="relative pl-8 sm:pl-12 border-l-2 border-gray-100 dark:border-zinc-800 space-y-12">
                {experience.map((job, index) => (
                  <div key={index} className="relative group p-6 sm:p-8 rounded-2xl bg-gray-50 dark:bg-zinc-900/50 hover:bg-zinc-900 dark:hover:bg-zinc-800 transition-all duration-300">
                    {/* Timeline Dot */}
                    <span className="absolute -left-[41px] sm:-left-[57px] top-10 w-4 h-4 rounded-full bg-white dark:bg-zinc-950 border-2 border-gray-200 dark:border-zinc-700 group-hover:bg-blue-500 group-hover:border-blue-500 transition-colors duration-300" />

                    {/* Content Header */}
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
                      <div>
                        <h5 className="text-2xl font-bold text-black dark:text-white group-hover:text-white transition-colors">{job.company}</h5>
                        <p className="text-lg text-blue-600 dark:text-blue-500 font-medium mt-1">{job.role}</p>
                      </div>

                      {/* Period Badge - Right Aligned on Desktop */}
                      <div className="shrink-0">
                        <span className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold bg-white dark:bg-zinc-950 text-gray-600 dark:text-gray-400 group-hover:bg-zinc-800 group-hover:text-gray-200 border border-gray-200 dark:border-zinc-800 group-hover:border-zinc-700 transition-colors">
                          {job.period}
                        </span>
                      </div>
                    </div>

                    {/* Description List */}
                    <ul className="space-y-3">
                      {job.description.map((desc, i) => (
                        <li key={i} className="text-gray-600 dark:text-gray-400 group-hover:text-gray-300 leading-relaxed text-base flex items-start gap-4 transition-colors">
                          <span className="mt-2.5 w-1.5 h-1.5 rounded-full bg-blue-500/40 group-hover:bg-blue-500 shrink-0 transition-colors" />
                          <span>{desc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Education Section */}
            <div id="education" className="scroll-mt-48">
              <h4 className="text-2xl font-bold text-black dark:text-white mb-12 border-b border-gray-100 dark:border-zinc-800 pb-4">Education</h4>

              <div className="relative pl-8 sm:pl-12 border-l-2 border-gray-100 dark:border-zinc-800 space-y-12">
                {education.map((edu, index) => (
                  <div key={index} className="relative group p-6 sm:p-8 rounded-2xl bg-gray-50 dark:bg-zinc-900/50 hover:bg-zinc-900 dark:hover:bg-zinc-800 transition-all duration-300">
                    {/* Timeline Dot */}
                    <span className="absolute -left-[41px] sm:-left-[57px] top-10 w-4 h-4 rounded-full bg-white dark:bg-zinc-950 border-2 border-gray-200 dark:border-zinc-700 group-hover:bg-blue-500 group-hover:border-blue-500 transition-colors duration-300" />

                    {/* Content Header */}
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
                      <div>
                        <h5 className="text-2xl font-bold text-black dark:text-white group-hover:text-white transition-colors">{edu.degree}</h5>
                        <p className="text-lg text-blue-600 dark:text-blue-500 font-medium mt-1">{edu.institution}</p>
                      </div>

                      {/* Period Badge - Right Aligned on Desktop */}
                      <div className="shrink-0">
                        <span className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold bg-white dark:bg-zinc-950 text-gray-600 dark:text-gray-400 group-hover:bg-zinc-800 group-hover:text-gray-200 border border-gray-200 dark:border-zinc-800 group-hover:border-zinc-700 transition-colors">
                          {edu.period}
                        </span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-gray-600 dark:text-gray-400 group-hover:text-gray-300 leading-relaxed text-base transition-colors">
                      {edu.details}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Achievements Section */}
            <div id="achievements" className="scroll-mt-48">
              <h4 className="text-2xl font-bold text-black dark:text-white mb-12 border-b border-gray-100 dark:border-zinc-800 pb-4">Achievements</h4>

              <div className="relative pl-8 sm:pl-12 border-l-2 border-gray-100 dark:border-zinc-800 space-y-12">
                {awards.map((award, index) => (
                  <div key={index} className="relative group p-6 sm:p-8 rounded-2xl bg-gray-50 dark:bg-zinc-900/50 hover:bg-zinc-900 dark:hover:bg-zinc-800 transition-all duration-300">
                    {/* Timeline Dot */}
                    <span className="absolute -left-[41px] sm:-left-[57px] top-10 w-4 h-4 rounded-full bg-white dark:bg-zinc-950 border-2 border-gray-200 dark:border-zinc-700 group-hover:bg-blue-500 group-hover:border-blue-500 transition-colors duration-300" />

                    {/* Content Header */}
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                      <div>
                        <h5 className="text-2xl font-bold text-black dark:text-white group-hover:text-blue-500 transition-colors mb-2">
                          {award.title}
                        </h5>
                        <div className="flex items-center gap-3">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${award.result === 'Champion' || award.result === 'Winner'
                              ? 'bg-yellow-100/50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-500 border border-yellow-200 dark:border-yellow-900/50 group-hover:bg-yellow-500/10 group-hover:border-yellow-500/30'
                              : 'bg-blue-100/50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-900/50 group-hover:bg-blue-500/10 group-hover:border-blue-500/30'
                            } transition-colors`}>
                            {award.result}
                          </span>
                        </div>
                      </div>

                      {/* Period Badge - Right Aligned on Desktop */}
                      <div className="shrink-0 mt-2 sm:mt-0">
                        <span className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold bg-white dark:bg-zinc-950 text-gray-600 dark:text-gray-400 group-hover:bg-zinc-800 group-hover:text-gray-200 border border-gray-200 dark:border-zinc-800 group-hover:border-zinc-700 transition-colors">
                          {award.year}
                        </span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-gray-600 dark:text-gray-400 group-hover:text-gray-300 leading-relaxed text-base transition-colors mt-2">
                      {award.context}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Selected Work - Large Cards */}
        {projects.filter(p => p.featured).length > 0 && (
          <section className="py-32 bg-gray-50 dark:bg-zinc-950 border-t border-gray-100 dark:border-zinc-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-end mb-20">
                <div>
                  <h2 className="text-sm font-mono uppercase tracking-widest text-gray-500 mb-4">Portfolio</h2>
                  <h3 className="text-4xl md:text-5xl font-bold tracking-tight text-black dark:text-white">Selected Work</h3>
                </div>
                <Link to="/projects" className="hidden md:flex items-center gap-2 text-lg font-bold hover:text-blue-600 dark:hover:text-blue-500 transition-colors">
                  View All <ArrowUpRight size={20} />
                </Link>
              </div>

              <div className="space-y-32">
                {projects.filter(p => p.featured).slice(0, 3).map((project, index) => (
                  <div key={project.id} className={`flex flex-col ${index % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'} gap-12 md:gap-24 items-center group`}>
                    <div className="w-full md:w-1/2">
                      <Link to={`/projects/${project.id}`} className="block overflow-hidden rounded-xl">
                        <img
                          src={project.thumbnail}
                          alt={project.title}
                          className="w-full aspect-[4/3] object-cover transition-all duration-700 ease-out transform group-hover:scale-105"
                        />
                      </Link>
                    </div>
                    <div className="w-full md:w-1/2">
                      <span className="text-blue-600 dark:text-blue-500 font-mono text-sm uppercase tracking-wider mb-4 block">{project.category}</span>
                      <h3 className="text-4xl font-bold mb-6 text-black dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-500 transition-colors">
                        <Link to={`/projects/${project.id}`}>{project.title}</Link>
                      </h3>
                      <div
                        className="text-xl text-gray-600 dark:text-gray-400 mb-8 leading-relaxed line-clamp-3"
                        dangerouslySetInnerHTML={{ __html: project.description }}
                      />
                      <div className="flex flex-wrap gap-3 mb-8">
                        {project.tags.slice(0, 3).map(tag => (
                          <span key={tag} className="px-3 py-1 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-full text-sm text-gray-500 dark:text-gray-400">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <Link to={`/projects/${project.id}`} className="inline-flex items-center gap-2 font-bold text-black dark:text-white border-b border-black dark:border-white pb-1 hover:text-blue-600 dark:hover:text-blue-500 hover:border-blue-600 dark:hover:border-blue-500 transition-colors">
                        View Case Study <ArrowRight size={18} />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-20 text-center md:hidden">
                <Link to="/projects" className="inline-flex items-center gap-2 font-bold text-lg">
                  View All Projects <ArrowRight size={20} />
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Contact - Big Type */}
        <section className="py-32 bg-blue-600 dark:bg-blue-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-12">
              Let's build the future.
            </h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link
                to="/contact"
                className="px-10 py-5 bg-white text-blue-600 rounded-full font-bold text-lg hover:bg-gray-100 transition-colors w-full sm:w-auto"
              >
                Start a Project
              </Link>
              <a
                href={`mailto:${personalInfo.email}`}
                className="px-10 py-5 bg-transparent border-2 border-white/20 text-white rounded-full font-bold text-lg hover:bg-white/10 transition-colors w-full sm:w-auto"
              >
                {personalInfo.email}
              </a>
            </div>
          </div>
        </section>

      </div>
    </PageTransition>
  );
};

export default Home;
