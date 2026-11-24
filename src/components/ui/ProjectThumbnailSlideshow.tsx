import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface ProjectThumbnailSlideshowProps {
  key?: React.Key;
  thumbnails?: string[];
  fallback: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  intervalMs?: number;
  showIndicators?: boolean;
}

export default function ProjectThumbnailSlideshow({
  thumbnails,
  fallback,
  alt,
  className = '',
  imgClassName = '',
  intervalMs = 3200,
  showIndicators = false,
}: ProjectThumbnailSlideshowProps) {
  const slides = thumbnails && thumbnails.length > 0 ? thumbnails : [fallback];
  const [index, setIndex] = useState(0);

  // Preload slides for instant transitions without flashes
  useEffect(() => {
    if (slides.length <= 1) return;
    slides.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }, [slides]);

  // Slideshow timer
  useEffect(() => {
    if (slides.length <= 1) return;

    const timer = setInterval(() => {
      setIndex(prev => (prev + 1) % slides.length);
    }, intervalMs);

    return () => clearInterval(timer);
  }, [slides.length, intervalMs]);

  if (slides.length <= 1) {
    return (
      <img
        src={slides[0]}
        alt={alt}
        loading="lazy"
        className={`w-full h-full object-cover ${imgClassName}`}
      />
    );
  }

  const currentSrc = slides[index % slides.length];

  return (
    <div className={`relative w-full h-full overflow-hidden select-none ${className}`}>
      <AnimatePresence initial={false} mode="sync">
        <motion.img
          key={currentSrc}
          src={currentSrc}
          alt={`${alt} slide ${(index % slides.length) + 1}`}
          loading="lazy"
          initial={{ opacity: 0, scale: 1.03 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className={`absolute inset-0 w-full h-full object-cover ${imgClassName}`}
        />
      </AnimatePresence>

      {showIndicators && slides.length > 1 && (
        <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 pointer-events-auto">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={e => {
                e.preventDefault();
                e.stopPropagation();
                setIndex(i);
              }}
              aria-label={`Go to slide ${i + 1}`}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 focus:outline-none ${
                i === index % slides.length
                  ? 'bg-[#e62e05] w-3 scale-110'
                  : 'bg-white/40 hover:bg-white/80'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
