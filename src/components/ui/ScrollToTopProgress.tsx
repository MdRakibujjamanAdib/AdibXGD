import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const ScrollToTopProgress = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);

    // Handle scroll events
    useEffect(() => {
        const handleScroll = () => {
            // Calculate how far down the user has scrolled
            const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
            const clientHeight = document.documentElement.clientHeight || window.innerHeight;

            const windowHeight = scrollHeight - clientHeight;
            const progress = windowHeight > 0 ? (scrollTop / windowHeight) * 100 : 0;

            setScrollProgress(progress);

            // Show button after scrolling down 200px
            if (scrollTop > 200) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });

        // Initial check
        handleScroll();

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    // SVG dimensions and calculations
    const radius = 24;
    const stroke = 3;
    const normalizedRadius = radius - stroke * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - (scrollProgress / 100) * circumference;

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.button
                    initial={{ opacity: 0, scale: 0.5, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.5, y: 20 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    onClick={scrollToTop}
                    className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-white dark:bg-zinc-800 shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all outline-none group"
                    aria-label="Scroll to top"
                >
                    {/* SVG Progress Circle */}
                    <svg
                        height={radius * 2}
                        width={radius * 2}
                        className="absolute inset-0 m-auto -rotate-90 pointer-events-none"
                    >
                        {/* Background Track */}
                        <circle
                            stroke="currentColor"
                            fill="transparent"
                            strokeWidth={stroke}
                            r={normalizedRadius}
                            cx={radius}
                            cy={radius}
                            className="text-gray-200 dark:text-zinc-700"
                        />
                        {/* Progress Stroke */}
                        <circle
                            stroke="currentColor"
                            fill="transparent"
                            strokeWidth={stroke}
                            strokeDasharray={circumference + ' ' + circumference}
                            style={{ strokeDashoffset }}
                            strokeLinecap="round"
                            r={normalizedRadius}
                            cx={radius}
                            cy={radius}
                            className="text-blue-500 transition-all duration-150 ease-out"
                        />
                    </svg>

                    {/* Centered Icon */}
                    <div className="flex h-full w-full items-center justify-center text-zinc-600 dark:text-zinc-300 group-hover:text-blue-500 transition-colors">
                        <ArrowUp size={20} strokeWidth={2.5} />
                    </div>
                </motion.button>
            )}
        </AnimatePresence>
    );
};

export default ScrollToTopProgress;
