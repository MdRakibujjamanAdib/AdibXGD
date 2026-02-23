
import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Projects from './pages/Update/Projects';
import ProjectDetails from './pages/ProjectDetails';
import Blogs from './pages/Update/Blogs';
import BlogDetails from './pages/BlogDetails';
import About from './pages/About';
import Contact from './pages/Contact';
import Achievements from './pages/Achievements';
import { AnimatePresence } from 'motion/react';

import ScrollToTopProgress from './components/ui/ScrollToTopProgress';

function App() {
  const location = useLocation();

  // Scroll to top on route change
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="flex flex-col min-h-screen bg-white text-black dark:bg-black dark:text-white font-sans selection:bg-emerald-500/30 selection:text-emerald-800 dark:selection:text-emerald-200">
      <Navbar />
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          {/* @ts-expect-error: Routes key prop is required for AnimatePresence to work correctly */}
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:id" element={<ProjectDetails />} />
            <Route path="/blogs" element={<Blogs />} />
            <Route path="/blogs/:slug" element={<BlogDetails />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/achievements" element={<Achievements />} />
          </Routes>
        </AnimatePresence>
      </main>
      <ScrollToTopProgress />
      <Footer />
    </div>
  );
}

export default App;
