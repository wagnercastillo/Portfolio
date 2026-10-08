'use client';
import { useEffect } from 'react';
import { scrollProgress } from '@/lib/motion';

/**
 * Parallax del hero: publica el progreso del scroll como --p (0 → 1) en #top.
 * Cada capa lo traduce a su propia velocidad en CSS (solo transform/opacity, en GPU).
 */
export function HeroParallax() {
  useEffect(() => {
    const hero = document.getElementById('top');
    if (!hero || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const p = scrollProgress(window.scrollY, hero.offsetTop + hero.offsetHeight);
      hero.style.setProperty('--p', p.toFixed(4));
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', onScroll);
    return () => { cancelAnimationFrame(raf); removeEventListener('scroll', onScroll); removeEventListener('resize', onScroll); };
  }, []);
  return null;
}
