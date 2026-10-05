'use client';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import type { Project } from '@/lib/projects';

const MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

/** Proyectos en orden cronológico; en escritorio el scroll vertical los desplaza en horizontal. */
export function Timeline({ projects }: { projects: Project[] }) {
  const items = [...projects].filter((p) => p.fecha).sort((a, b) => a.fecha.localeCompare(b.fecha));
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLOListElement>(null);
  const bar = useRef<HTMLElement>(null);

  useEffect(() => {
    const tl = section.current!, tt = track.current!, tb = bar.current!;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const horiz = () => !reduce && innerWidth > 680;
    const dist = () => tt.scrollWidth - tt.parentElement!.clientWidth;
    const size = () => {
      if (horiz()) tl.style.setProperty('--tlh', `calc(100vh + ${dist()}px)`);
      else { tl.style.removeProperty('--tlh'); tt.style.transform = ''; }
    };
    const onScroll = () => {
      if (!horiz()) return;
      const r = tl.getBoundingClientRect();
      const p = Math.min(Math.max(-r.top / (r.height - innerHeight + 96), 0), 1);
      tt.style.transform = `translateX(${-p * dist()}px)`;
      tb.style.transform = `scaleX(${p})`;
    };
    const onResize = () => { size(); onScroll(); };
    onResize();
    document.fonts?.ready.then(onResize);
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', onResize);
    return () => { removeEventListener('scroll', onScroll); removeEventListener('resize', onResize); };
  }, []);

  if (!items.length) return null;
  const first = items[0].fecha.slice(0, 4), last = items[items.length - 1].fecha.slice(0, 4);

  return (
    <section id="trayectoria" className="tl" aria-labelledby="tl-t" ref={section}>
      <div className="tl-sticky">
        <div className="section-head" style={{ margin: '0 4px' }}>
          <h2 id="tl-t" className="section-title scramble">Trayectoria</h2>
          <span className="label">{first} → {last} · sigue bajando</span>
        </div>
        <div className="tl-viewport">
          <ol className="tl-track" ref={track}>
            {items.map((p) => {
              const [y, m] = p.fecha.split('-');
              return (
                <li key={p.slug} style={{ display: 'contents' }}>
                  <Link href={`/proyectos/${p.slug}`} className="card tl-item spot">
                    <div className="when"><i /><span className="label">{MESES[Number(m) - 1]}</span></div>
                    <div>
                      <div className="yr">{y}</div>
                      <h3>{p.titulo}</h3>
                      <div className="label" style={{ marginTop: 8, textTransform: 'none', letterSpacing: 0 }}>
                        {p.cliente || p.categoria} · {p.estado}
                      </div>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ol>
        </div>
        <div className="tl-progress" aria-hidden="true"><i ref={bar} /></div>
      </div>
    </section>
  );
}
