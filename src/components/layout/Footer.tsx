
import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Linkedin, Mail, Twitter, Facebook } from 'lucide-react';
import { personalInfo } from '../../data/content';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-black py-20 border-t border-gray-100 dark:border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start gap-12">
          <div className="max-w-md">
            <Link to="/" className="text-2xl font-bold tracking-tighter text-black dark:text-white mb-6 block">
              Adib<span className="text-blue-600 dark:text-blue-500">.</span>
            </Link>
            <p className="text-gray-500 dark:text-gray-400 text-lg leading-relaxed mb-8">
              {personalInfo.mission}
            </p>
            <div className="flex space-x-6">
              <a href={personalInfo.social.github} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-black dark:hover:text-white transition-colors">
                <Github size={24} />
              </a>
              <a href={personalInfo.social.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-black dark:hover:text-white transition-colors">
                <Linkedin size={24} />
              </a>
              <a href={`mailto:${personalInfo.email}`} className="text-gray-400 hover:text-black dark:hover:text-white transition-colors">
                <Mail size={24} />
              </a>
            </div>
          </div>
          
          <div className="flex gap-16 flex-wrap">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 dark:text-zinc-600 mb-6">Sitemap</h3>
              <ul className="space-y-4">
                <li><Link to="/" className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-500 transition-colors font-medium">Home</Link></li>
                <li><Link to="/projects" className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-500 transition-colors font-medium">Projects</Link></li>
                <li><Link to="/blogs" className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-500 transition-colors font-medium">Blogs</Link></li>
                <li><Link to="/about" className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-500 transition-colors font-medium">About</Link></li>
                <li><Link to="/contact" className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-500 transition-colors font-medium">Contact</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 dark:text-zinc-600 mb-6">Socials</h3>
              <ul className="space-y-4">
                <li><a href={personalInfo.social.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-500 transition-colors font-medium">LinkedIn</a></li>
                <li><a href={personalInfo.social.github} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-500 transition-colors font-medium">GitHub</a></li>
                <li><a href={personalInfo.social.facebook} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-500 transition-colors font-medium">Facebook</a></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="mt-20 pt-8 border-t border-gray-100 dark:border-zinc-900 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400 dark:text-gray-600">
          <p>&copy; {new Date().getFullYear()} Md Rakibujjaman Adib.</p>
          <p className="mt-2 md:mt-0">Crafted with precision.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
