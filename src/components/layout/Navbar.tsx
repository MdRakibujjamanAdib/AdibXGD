
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ArrowUpRight, Github, Linkedin, MessageCircle } from 'lucide-react';
import { personalInfo } from '../../data/content';
import { useNavbar } from '../../context/NavbarContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { isNavbarVisible, navMode, activeSection } = useNavbar();
  const location = useLocation();
  const isHome = location.pathname === '/' && navMode === 'default';

  const defaultLinks = [
    { name: 'Home', path: '/' },
    { name: 'Projects', path: '/projects' },
    { name: 'About', path: '/about' },
    { name: 'Blogs', path: '/blogs' },
    { name: 'Contact', path: '/contact' },
  ];

  const lifeLinks = [
    { name: 'Experience', action: 'experience' },
    { name: 'Education', action: 'education' },
    { name: 'Achievements', action: 'achievements' },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleLifeLinkClick = (action: string) => {
    const event = new CustomEvent('scrollToSection', { detail: action });
    window.dispatchEvent(event);
  };

  return (
    <motion.nav
      variants={{
        visible: { y: 0 },
        hidden: { y: "-100%" },
      }}
      animate={isNavbarVisible ? "visible" : "hidden"}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-sm transition-colors duration-300 ${isHome ? "home-nav" : "bg-white/90 dark:bg-black/90"}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0">
            <Link to="/" className={`home-nav__brand text-2xl font-bold tracking-tighter text-black hover:opacity-70 transition-opacity ${isHome ? "" : "dark:text-white"}`}>
              {isHome ? 'adib' : 'Adib'}<span className={isHome ? "home-nav__dot" : "text-blue-600 dark:text-blue-500"}>.</span>
            </Link>
          </div>

          <div className={`hidden ${isHome ? "lg:block" : "md:block overflow-hidden"}`}>
            <AnimatePresence mode="wait">
              {navMode === 'default' ? (
                <motion.div
                  key="default-nav"
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -50, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="ml-10 flex items-baseline space-x-10"
                >
                  {defaultLinks.map((link) => (
                    <Link
                      key={link.name}
                      to={link.path}
                      aria-current={isActive(link.path) ? "page" : undefined}
                      className={`home-nav__link text-sm font-bold uppercase tracking-wider transition-colors duration-200 ${isActive(link.path)
                        ? 'text-blue-600 dark:text-blue-500'
                        : 'text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white'
                        }`}
                    >
                      {link.name}
                    </Link>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="life-nav"
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -50, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="ml-10 flex items-baseline space-x-10"
                >
                  {lifeLinks.map((link) => (
                    <button
                      key={link.name}
                      onClick={() => handleLifeLinkClick(link.action)}
                      className={`text-sm font-bold uppercase tracking-wider transition-colors duration-200 ${activeSection === link.name
                        ? 'text-blue-600 dark:text-blue-500'
                        : 'text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white'
                        }`}
                    >
                      {link.name}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className={`hidden ${isHome ? "lg:flex" : "md:flex"} items-center gap-6`}>
            <a href={personalInfo.social.github} aria-label="GitHub profile" target="_blank" rel="noopener noreferrer" className="home-nav__social inline-flex min-h-11 min-w-11 items-center justify-center text-gray-400 hover:text-black dark:hover:text-white transition-colors">
              <Github size={20} />
            </a>
            <a href={personalInfo.social.linkedin} aria-label="LinkedIn profile" target="_blank" rel="noopener noreferrer" className="home-nav__social inline-flex min-h-11 min-w-11 items-center justify-center text-gray-400 hover:text-black dark:hover:text-white transition-colors">
              <Linkedin size={20} />
            </a>
            <a
              href={`https://wa.me/${personalInfo.phone.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="home-nav__chat flex min-h-11 items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-blue-700 transition-colors"
            >
              {isHome ? <>Let’s Talk <ArrowUpRight size={16} aria-hidden="true" /></> : <><MessageCircle size={16} /> Chat Now</>}
            </a>
          </div>

          <div className={`-mr-2 flex ${isHome ? "lg:hidden" : "md:hidden"}`}>
            <button
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? "Close navigation" : "Open navigation"}
              aria-expanded={isOpen}
              className="home-nav__menu inline-flex min-h-11 min-w-11 items-center justify-center p-2 text-black dark:text-white"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`home-nav__mobile border-t overflow-hidden ${isHome ? "lg:hidden bg-[#161719] text-white border-white/10" : "md:hidden bg-white dark:bg-black border-gray-100 dark:border-zinc-900"}`}
          >
            <div className="px-4 pt-4 pb-8 space-y-4">
              {navMode === 'default' ? (
                defaultLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    aria-current={isActive(link.path) ? "page" : undefined}
                    className={`home-nav__mobile-link flex min-h-11 items-center text-2xl font-bold ${isHome ? 'text-white' : isActive(link.path)
                      ? 'text-blue-600 dark:text-blue-500'
                      : 'text-black dark:text-white'
                      }`}
                  >
                    {link.name}
                  </Link>
                ))
              ) : (
                lifeLinks.map((link) => (
                  <button
                    key={link.name}
                    onClick={() => {
                      handleLifeLinkClick(link.action);
                      setIsOpen(false);
                    }}
                    className={`block text-2xl font-bold w-full text-left ${activeSection === link.name
                      ? 'text-blue-600 dark:text-blue-500'
                      : 'text-black dark:text-white'
                      }`}
                  >
                    {link.name}
                  </button>
                ))
              )}
              <div className="mt-8 flex flex-col gap-6">
                <div className="flex gap-6">
                  <a href={personalInfo.social.github} aria-label="GitHub profile" target="_blank" rel="noopener noreferrer" className="home-nav__social inline-flex min-h-11 min-w-11 items-center justify-center text-gray-400 hover:text-black dark:hover:text-white transition-colors">
                    <Github size={24} />
                  </a>
                  <a href={personalInfo.social.linkedin} aria-label="LinkedIn profile" target="_blank" rel="noopener noreferrer" className="home-nav__social inline-flex min-h-11 min-w-11 items-center justify-center text-gray-400 hover:text-black dark:hover:text-white transition-colors">
                    <Linkedin size={24} />
                  </a>
                </div>
                <a
                  href={`https://wa.me/${personalInfo.phone.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="home-nav__chat flex min-h-11 items-center justify-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-full text-lg font-bold hover:bg-blue-700 transition-colors w-full"
                >
                  <MessageCircle size={20} />
                  Chat on WhatsApp
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
