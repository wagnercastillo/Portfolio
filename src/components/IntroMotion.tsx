'use client';
import { useEffect } from 'react';
import { progress } from '@/lib/scene';

/**
 * Mueve la escena de entrada: publica --p (scroll 0 → 1) y --mx/--my (mouse -1 → 1, suavizado)
 * en la sección. Solo corre mientras la escena está en pantalla; las capas lo traducen en CSS.
 */
export function IntroMotion() {
  useEffect(() => {
    const section = document.querySelector<HTMLElement>('.intro');
    if (!section || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let raf = 0, visible = true, tx = 0, ty = 0, mx = 0, my = 0;

    const frame = () => {
      raf = 0;
      const r = section.getBoundingClientRect();
      section.style.setProperty('--p', progress(r.top, r.height, innerHeight).toFixed(4));
      mx += (tx - mx) * 0.08;
      my += (ty - my) * 0.08;
      section.style.setProperty('--mx', mx.toFixed(4));
      section.style.setProperty('--my', my.toFixed(4));
      if (visible && (Math.abs(tx - mx) > 0.001 || Math.abs(ty - my) > 0.001)) raf = requestAnimationFrame(frame);
    };
    const kick = () => { if (visible && !raf) raf = requestAnimationFrame(frame); };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      tx = (e.clientX / innerWidth) * 2 - 1;
      ty = (e.clientY / innerHeight) * 2 - 1;
      kick();
    };
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; kick(); });
    io.observe(section);
    frame();
    addEventListener('scroll', kick, { passive: true });
    addEventListener('resize', kick);
    addEventListener('pointermove', onMove);
    return () => {
      cancelAnimationFrame(raf); io.disconnect();
      removeEventListener('scroll', kick); removeEventListener('resize', kick); removeEventListener('pointermove', onMove);
    };
  }, []);
  return null;
}
