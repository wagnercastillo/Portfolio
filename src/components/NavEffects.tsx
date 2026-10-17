'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { activeSection } from '@/lib/scene';

/**
 * Estado del navbar según el scroll:
 * - html[data-intro]    mientras se ve la escena de entrada (vidrio oscuro)
 * - html[data-scrolled] al bajar unos px (se encoge en píldora)
 * - --read              progreso de lectura de la página (barra inferior)
 * - píldora deslizante bajo el enlace de la sección activa (scroll-spy)
 */
export function NavEffects() {
  const pathname = usePathname();
  useEffect(() => {
    const root = document.documentElement;
    const header = document.querySelector<HTMLElement>('.site-header');
    const nav = header?.querySelector<HTMLElement>('.site-nav');
    const pill = nav?.querySelector<HTMLElement>('.nav-pill');
    if (!header || !nav || !pill) return;
    const links = [...nav.querySelectorAll<HTMLAnchorElement>('a[href*="#"]')];
    let raf = 0;

    const update = () => {
      raf = 0;
      const y = scrollY;
      const intro = document.querySelector<HTMLElement>('.intro');
      const overIntro = !!intro && intro.getBoundingClientRect().bottom > header.offsetHeight + 24;
      root.toggleAttribute('data-intro', overIntro);
      root.toggleAttribute('data-scrolled', y > 40);
      const max = document.documentElement.scrollHeight - innerHeight;
      header.style.setProperty('--read', max > 0 ? (y / max).toFixed(4) : '0');

      const sections = links
        .map((a) => document.getElementById(a.hash.slice(1)))
        .filter((s): s is HTMLElement => !!s)
        .map((s) => ({ id: s.id, top: s.getBoundingClientRect().top + y }));
      const id = activeSection(sections, y + innerHeight * 0.35);
      const active = links.find((a) => a.hash === `#${id}`);
      links.forEach((a) => (a === active ? a.setAttribute('aria-current', 'true') : a.removeAttribute('aria-current')));
      if (active) {
        pill.style.cssText = `opacity:1;left:${active.offsetLeft}px;top:${active.offsetTop}px;width:${active.offsetWidth}px;height:${active.offsetHeight}px`;
      } else pill.style.opacity = '0';
    };
    const kick = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    addEventListener('scroll', kick, { passive: true });
    addEventListener('resize', kick);
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener('scroll', kick); removeEventListener('resize', kick);
      root.removeAttribute('data-intro'); root.removeAttribute('data-scrolled');
    };
  }, [pathname]);
  return null;
}
