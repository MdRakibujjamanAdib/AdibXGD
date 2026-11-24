
import React, { Suspense, lazy } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';

import ScrollToTopProgress from './components/ui/ScrollToTopProgress';

const Home = lazy(() => import('./pages/Home'));
const Projects = lazy(() => import('./pages/Update/Projects'));
const ProjectDetails = lazy(() => import('./pages/ProjectDetails'));
const Blogs = lazy(() => import('./pages/Update/Blogs'));
const BlogDetails = lazy(() => import('./pages/BlogDetails'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Services = lazy(() => import('./pages/Services'));
const Achievements = lazy(() => import('./pages/Achievements'));
const Terms = lazy(() => import('./pages/Terms'));
const NotFound = lazy(() => import('./pages/NotFound'));

function App() {
  const location = useLocation();

  // Scroll to top and track pageview on route change
  React.useEffect(() => {
    window.scrollTo(0, 0);

    // Dynamic Google Analytics 4 page view tracking for client-side SPA routing
    if (typeof window !== 'undefined' && typeof (window as any).gtag === 'function') {
      (window as any).gtag('event', 'page_view', {
        page_path: location.pathname + location.search,
        page_title: document.title,
        page_location: window.location.href,
      });
    }
  }, [location.pathname, location.search]);

  return (
    <div
      className="flex flex-col min-h-screen font-sans selection:bg-[#e62e05]/30 selection:text-white transition-colors duration-300"
      style={{ backgroundColor: 'var(--vb-bg, #000000)', color: 'var(--vb-text, #ffffff)' }}
    >
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <Suspense fallback={<div className="min-h-screen bg-[var(--vb-bg)]" />}>
            {/* @ts-expect-error: Routes key prop is required for AnimatePresence to work correctly */}
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Home />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/projects/:id" element={<ProjectDetails />} />
              <Route path="/blogs" element={<Blogs />} />
              <Route path="/blogs/:slug" element={<BlogDetails />} />
              <Route path="/services" element={<Services />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/achievements" element={<Achievements />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Terms />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </AnimatePresence>
      </main>
      <ScrollToTopProgress />
    </div>
  );
}

export default App;
