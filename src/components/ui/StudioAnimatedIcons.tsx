import React, { useEffect, useRef } from 'react';
import lottie, { AnimationItem } from 'lottie-web';

interface LottieIconProps {
  name: string;
  className?: string;
  loop?: boolean;
  autoplay?: boolean;
}

export const StudioLottieIcon: React.FC<LottieIconProps> = ({
  name,
  className = 'w-[72px] h-[72px]',
  loop = true,
  autoplay = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<AnimationItem | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    if (animRef.current) {
      animRef.current.destroy();
      animRef.current = null;
    }

    try {
      animRef.current = lottie.loadAnimation({
        container: containerRef.current,
        renderer: 'svg',
        loop,
        autoplay,
        path: `/lottie/${name}.json`,
      });
    } catch {
      // Fallback silently if asset cannot be loaded
    }

    return () => {
      animRef.current?.destroy();
      animRef.current = null;
    };
  }, [name, loop, autoplay]);

  return (
    <div
      ref={containerRef}
      className={`vb-animated-lottie-icon ${className}`}
      aria-hidden="true"
    />
  );
};
