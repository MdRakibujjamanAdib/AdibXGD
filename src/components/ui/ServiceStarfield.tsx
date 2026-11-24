import { useEffect, useRef } from 'react';

/** Fine, slowly drifting particles, drawn at device resolution without React frame updates. */
export default function ServiceStarfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let width = 0, height = 0, frame = 0, previous = 0, time = 0;
    let visible = true;
    // Seeded positions avoid a different composition each time the page is mounted.
    let seed = 9321;
    const random = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    const stars = Array.from({ length: 420 }, () => ({
      x: random(), y: random(), depth: random(), phase: random() * Math.PI * 2,
    }));

    const draw = () => {
      context.clearRect(0, 0, width, height);
      const count = Math.min(stars.length, Math.round(width * height / 900));
      for (let i = 0; i < count; i++) {
        const star = stars[i];
        // CSS pixels per second: keep movement perceptible even on a small screen.
        const speed = 10 + star.depth * 18;
        const x = (star.x * width + time * speed) % width;
        const y = (star.y * height + time * speed * 0.3) % height;
        const alpha = 0.18 + star.depth * 0.35 + Math.sin(time * 0.4 + star.phase) * 0.06;
        context.fillStyle = `rgba(230,235,242,${alpha})`;
        context.beginPath();
        context.ellipse(x, y, 0.3 + star.depth * 0.45, 0.25 + star.depth * 0.3, -0.5, 0, Math.PI * 2);
        context.fill();
      }
    };
    const tick = (now: number) => {
      if (previous) time += Math.min((now - previous) / 1000, 0.05);
      previous = now;
      draw();
      frame = requestAnimationFrame(tick);
    };
    const sync = () => {
      cancelAnimationFrame(frame);
      previous = 0;
      draw();
      if (visible && !document.hidden && !reducedMotion.matches) frame = requestAnimationFrame(tick);
    };
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      draw();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    const intersection = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); });
    intersection.observe(canvas);
    reducedMotion.addEventListener('change', sync);
    document.addEventListener('visibilitychange', sync);
    resize();
    sync();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      intersection.disconnect();
      reducedMotion.removeEventListener('change', sync);
      document.removeEventListener('visibilitychange', sync);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true" />;
}
