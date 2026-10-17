'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import type { Dict } from '@/lib/i18n';
import { useT } from './useT';

const GLYPHS = '!<>-_\\/[]{}=+*^?#01ABCDEFXYZ';

// Títulos que se "decodifican" letra por letra.
function scramble(el: HTMLElement) {
  const final = el.dataset.text ?? el.textContent ?? '';
  el.dataset.text = final;
  el.setAttribute('aria-label', final);
  let f = 0;
  const tick = () => {
    const done = Math.floor(f / 2);
    el.textContent = [...final].map((c, k) => (c === ' ' || k < done ? c : GLYPHS[(Math.random() * GLYPHS.length) | 0])).join('');
    if (done < final.length) { f++; requestAnimationFrame(tick); } else el.textContent = final;
  };
  tick();
}

function countUp(el: HTMLElement) {
  const to = Number(el.dataset.count), t0 = performance.now();
  const step = (t: number) => {
    const p = Math.min((t - t0) / 1200, 1);
    el.textContent = String(Math.round(to * (1 - Math.pow(1 - p, 3))));
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

// Cómo se comporta el puntero según lo que tenga debajo (gana la primera coincidencia).
const modes = (t: Dict): [selector: string, mode: string, label?: string][] => [
  ['.nf-canvas, .nf-bug, .nf-ltr, input, textarea, select', 'hide'],
  ['.exp-card', 'pill', t.cursor.drag],
  ['.pcard, .feat, .tl-item', 'pill', t.cursor.view],
  ['.photo-next', 'pill', t.cursor.photo],
  ['.g-slide', 'zoom', '+'],
  ['.tech, .client-row, .icon-btn, .btn, .site-nav a, .filters button, .opt-chips button', 'stick'],
  ['a, button', 'link'],
  ['p, h1, h2, h3, li, blockquote', 'text'],
];

/**
 * Efectos de página que trabajan sobre el DOM ya renderizado: reveal al hacer scroll,
 * scramble, contador, spotlight, tilt 3D, botones magnéticos y cursor personalizado.
 * Se re-ejecuta al cambiar de ruta.
 */
export function Effects() {
  const pathname = usePathname();
  const t = useT();

  useEffect(() => {
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const MODES = modes(t), drop = t.cursor.drop;
    const cleanups: (() => void)[] = [];

    // reveal + scramble + contador
    const io = new IntersectionObserver((entries) => entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target as HTMLElement;
      el.classList.add('in');
      el.querySelectorAll<HTMLElement>('[data-count]').forEach(countUp);
      if (!reduce) {
        if (el.classList.contains('scramble')) scramble(el);
        el.querySelectorAll<HTMLElement>('.scramble').forEach(scramble);
      }
      io.unobserve(el);
    }), { threshold: 0.15 });
    const observe = () => document
      .querySelectorAll('.reveal:not(.in), .scramble:not(.reveal .scramble):not(.in)')
      .forEach((el) => io.observe(el));
    observe();
    // contenido que aparece después (p. ej. filtros) también se observa
    const mo = new MutationObserver(observe);
    mo.observe(document.body, { childList: true, subtree: true });
    cleanups.push(() => { io.disconnect(); mo.disconnect(); });

    // spotlight + tilt
    let tiltCard: HTMLElement | null = null;
    const onMove = (e: PointerEvent) => {
      const target = e.target as HTMLElement;
      const spot = target.closest<HTMLElement>('.spot');
      if (spot) {
        const r = spot.getBoundingClientRect();
        spot.style.setProperty('--mx', `${e.clientX - r.left}px`);
        spot.style.setProperty('--my', `${e.clientY - r.top}px`);
      }
      const c = reduce ? null : target.closest<HTMLElement>('.tilt');
      if (tiltCard && tiltCard !== c) {
        tiltCard.classList.remove('moving');
        tiltCard.style.removeProperty('--rx');
        tiltCard.style.removeProperty('--ry');
      }
      tiltCard = c;
      if (!c) return;
      const r = c.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
      c.classList.add('moving');
      c.style.setProperty('--rx', `${(-py * 8).toFixed(2)}deg`);
      c.style.setProperty('--ry', `${(px * 10).toFixed(2)}deg`);
    };
    document.addEventListener('pointermove', onMove);
    cleanups.push(() => document.removeEventListener('pointermove', onMove));

    // botones magnéticos
    if (!reduce) {
      document.querySelectorAll<HTMLElement>('.magnet').forEach((b) => {
        const move = (e: PointerEvent) => {
          const r = b.getBoundingClientRect();
          b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.15}px, ${(e.clientY - r.top - r.height / 2) * 0.25}px)`;
        };
        const leave = () => { b.style.transform = ''; };
        b.addEventListener('pointermove', move);
        b.addEventListener('pointerleave', leave);
        cleanups.push(() => { b.removeEventListener('pointermove', move); b.removeEventListener('pointerleave', leave); });
      });
    }

    // cursor personalizado (solo puntero fino)
    if (matchMedia('(pointer: fine)').matches && !reduce) {
      const root = document.documentElement;
      const dot = Object.assign(document.createElement('div'), { className: 'cur cur-dot' });
      const ring = Object.assign(document.createElement('div'), { className: 'cur cur-ring', innerHTML: '<span></span>' });
      const label = ring.firstChild as HTMLElement;
      dot.setAttribute('aria-hidden', 'true');
      ring.setAttribute('aria-hidden', 'true');
      document.body.append(dot, ring);
      let x = -100, y = -100, rx = x, ry = y, raf = 0;
      let mode = '', over: Element | null = null, stuck: HTMLElement | null = null;
      const setMode = (m: string, el: Element | null, text = '') => {
        if (label.textContent !== text) label.textContent = text;
        if (m === mode && el === over) return;
        if (mode) { ring.classList.remove(mode); dot.classList.remove(mode); }
        if (m) { ring.classList.add(m); dot.classList.add(m); }
        mode = m; over = el;
        stuck = m === 'stick' ? el as HTMLElement : null;
        ring.style.width = ring.style.height = ring.style.borderRadius = '';
        if (stuck) ring.style.borderRadius = getComputedStyle(stuck).borderRadius;
        if (m === 'text' && el) ring.style.height = `${parseFloat(getComputedStyle(el).fontSize) * 1.15}px`;
      };
      const move = (e: PointerEvent) => {
        x = e.clientX; y = e.clientY;
        root.classList.add('has-cursor');
        dot.style.transform = `translate(${x}px, ${y}px)`;
        const t = e.target as HTMLElement;
        for (const [sel, m, text] of MODES) {
          const el = t.closest(sel);
          if (el) return setMode(m, el, el.matches('.exp-card.drag') ? drop : text);
        }
        setMode('', null);
      };
      const leave = () => root.classList.remove('has-cursor');
      const loop = () => {
        let tx = x, ty = y;
        if (stuck) {
          // se ciñe al control y se inclina un poco hacia el puntero
          const r = stuck.getBoundingClientRect();
          tx = r.left + r.width / 2; ty = r.top + r.height / 2;
          tx += (x - tx) * 0.12; ty += (y - ty) * 0.12;
          ring.style.width = `${r.width + 8}px`; ring.style.height = `${r.height + 8}px`;
        }
        rx += (tx - rx) * 0.18; ry += (ty - ry) * 0.18;
        ring.style.transform = `translate(${rx}px, ${ry}px)`;
        raf = requestAnimationFrame(loop);
      };
      loop();
      addEventListener('pointermove', move);
      document.addEventListener('pointerleave', leave);
      cleanups.push(() => {
        cancelAnimationFrame(raf);
        removeEventListener('pointermove', move);
        document.removeEventListener('pointerleave', leave);
        dot.remove(); ring.remove();
        root.classList.remove('has-cursor');
      });
    }

    return () => cleanups.forEach((c) => c());
  }, [pathname, t]);

  return null;
}
