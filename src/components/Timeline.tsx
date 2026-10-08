'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useRef } from 'react';
import type { Project } from '@/lib/projects';
import { litCount, travelerX } from '@/lib/scene';

const MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

/**
 * Línea de tiempo tipo metro: en escritorio el scroll vertical desplaza la línea en horizontal,
 * un viajero con tu foto recorre las estaciones y las va encendiendo; los años gigantes van detrás.
 */
export function Timeline({ projects, foto }: { projects: Project[]; foto: string | null }) {
  const items = useMemo(() => [...projects].filter((p) => p.fecha).sort((a, b) => a.fecha.localeCompare(b.fecha)), [projects]);
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLOListElement>(null);
  const year = useRef<HTMLSpanElement>(null);
  const traveler = useRef<HTMLDivElement>(null);
  const lit = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = section.current, tt = track.current, yr = year.current, tv = traveler.current, ln = lit.current;
    if (!tl || !tt || !yr || !tv || !ln) return;
    const yearsOf = items.map((p) => p.fecha.slice(0, 4));
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const stations = [...tt.querySelectorAll<HTMLElement>('.tl-stop')];
    let centers: number[] = [];
    let raf = 0;

    const horiz = () => !reduce && innerWidth > 680;
    const dist = () => tt.scrollWidth - tt.parentElement!.clientWidth;
    const measure = () => {
      centers = stations.map((s) => s.offsetLeft + s.offsetWidth / 2);
      if (horiz()) tl.style.setProperty('--tlh', `calc(100vh + ${dist()}px)`);
      else { tl.style.removeProperty('--tlh'); tt.style.transform = ''; }
    };
    const update = () => {
      raf = 0;
      const r = tl.getBoundingClientRect();
      const p = horiz() ? Math.min(Math.max(-r.top / Math.max(r.height - innerHeight, 1), 0), 1) : 1;
      const d = horiz() ? dist() : 0;
      tt.style.transform = `translate3d(${-p * d}px,0,0)`;
      const x = travelerX(p, centers);
      tv.style.transform = `translate3d(${x}px,0,0)`;
      ln.style.width = `${x}px`;
      const n = litCount(x, centers);
      stations.forEach((s, i) => s.classList.toggle('lit', i < n));
      // año de fondo: el de la última estación alcanzada; gira al cambiar
      const y = yearsOf[Math.max(n - 1, 0)];
      if (yr.textContent !== y) { yr.textContent = y; yr.classList.remove('roll'); void yr.offsetWidth; yr.classList.add('roll'); }
      tv.classList.toggle('moving', p > 0 && p < 1);
    };
    const kick = () => { if (!raf) raf = requestAnimationFrame(update); };
    const onResize = () => { measure(); kick(); };
    onResize();
    document.fonts?.ready.then(onResize);
    addEventListener('scroll', kick, { passive: true });
    addEventListener('resize', onResize);
    return () => { cancelAnimationFrame(raf); removeEventListener('scroll', kick); removeEventListener('resize', onResize); };
  }, [items]);

  if (!items.length) return null;
  const first = items[0].fecha.slice(0, 4), last = items[items.length - 1].fecha.slice(0, 4);

  return (
    <section id="trayectoria" className="tl" aria-labelledby="tl-t" ref={section}>
      <div className="tl-sticky">
        <div className="section-head" style={{ margin: '0 4px' }}>
          <h2 id="tl-t" className="section-title scramble">Trayectoria</h2>
          <span className="label">{first} → {last} · {items.length} proyectos · sigue bajando ↓</span>
        </div>
        <div className="tl-viewport">
          <span className="tl-year" ref={year} aria-hidden="true" />
          <ol className="tl-track" ref={track}>
            <li className="tl-rail" aria-hidden="true"><i className="tl-rail-lit" ref={lit} /></li>
            <li className="tl-traveler-wrap" aria-hidden="true">
              <div className="tl-traveler" ref={traveler}>
                {foto ? <Image src={foto} alt="" width={44} height={44} /> : <span>CC</span>}
              </div>
            </li>
            {items.map((p) => {
              const [y, m] = p.fecha.split('-');
              return (
                <li key={p.slug} className="tl-stop">
                  <span className="tl-dot" aria-hidden="true" />
                  <Link href={`/proyectos/${p.slug}`} className="card tl-item spot">
                    <span className="label">{MESES[Number(m) - 1]} {y}</span>
                    <h3>{p.titulo}</h3>
                    <span className="tl-meta">{p.cliente || p.categoria} · {p.estado}</span>
                  </Link>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
