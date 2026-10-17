'use client';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import type { TechIcon } from '@/lib/tech-icons';
import { intersectBySlug } from '@/lib/projects';
import type { Marca } from '@/lib/experience';
import Image from 'next/image';
import { TechIconSvg as Icon } from './TechIconSvg';

export interface TechItem {
  name: string;
  group: string;
  icon: TechIcon;
  projects: { slug: string; titulo: string; cliente: string }[];
}

export interface Cliente { name: string; marca: Marca | null; projects: { slug: string; titulo: string; portada: string | null }[] }

/**
 * Mosaico de tecnologías con pestañas por grupo. Se pueden elegir varias: el panel muestra
 * los proyectos que las combinan todas y se atenúan las que no aparecen junto a la selección.
 */
export function StackExplorer({ items, groups, clientes }: { items: TechItem[]; groups: string[]; clientes: Cliente[] }) {
  const tabs = ['Todo', ...groups];
  const [tab, setTab] = useState('Todo');
  const [changed, setChanged] = useState(false);
  const [picked, setPicked] = useState<string[]>([]);
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [pill, setPill] = useState({ left: 4, width: 0 });
  const btns = useRef<Record<string, HTMLButtonElement | null>>({});
  const grid = useRef<HTMLUListElement>(null);

  // Efecto dock: los íconos cercanos al cursor crecen en onda (solo mouse, sin "reducir movimiento").
  useEffect(() => {
    const ul = grid.current;
    if (!ul || !matchMedia('(pointer: fine)').matches || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const RADIUS = 150, MAX = 0.55;
    let raf = 0, x = 0, y = 0;
    const apply = () => {
      raf = 0;
      ul.querySelectorAll<HTMLElement>('.tech').forEach((el) => {
        const r = el.getBoundingClientRect();
        const d = Math.hypot(x - (r.left + r.width / 2), y - (r.top + r.height / 2));
        const t = Math.max(0, 1 - d / RADIUS);
        el.style.setProperty('--dock', (1 + MAX * t * t).toFixed(3));
      });
    };
    const move = (e: PointerEvent) => {
      x = e.clientX; y = e.clientY;
      ul.classList.add('docking');
      if (!raf) raf = requestAnimationFrame(apply);
    };
    const leave = () => {
      cancelAnimationFrame(raf); raf = 0;
      ul.classList.remove('docking');
      ul.querySelectorAll<HTMLElement>('.tech').forEach((el) => el.style.removeProperty('--dock'));
    };
    ul.addEventListener('pointermove', move);
    ul.addEventListener('pointerleave', leave);
    return () => { leave(); ul.removeEventListener('pointermove', move); ul.removeEventListener('pointerleave', leave); };
  }, []);

  useEffect(() => {
    const place = () => {
      const b = btns.current[tab];
      if (b) setPill({ left: b.offsetLeft, width: b.offsetWidth });
    };
    place();
    document.fonts?.ready.then(place);
    addEventListener('resize', place);
    return () => removeEventListener('resize', place);
  }, [tab]);


  const shown = tab === 'Todo' ? items : items.filter((t) => t.group === tab);
  const brand = (t: TechItem) => ({ '--brand': t.icon.color ?? 'var(--accent)' }) as React.CSSProperties;
  const sel = picked.map((n) => items.find((t) => t.name === n)!).filter(Boolean);
  const matches = intersectBySlug(sel.map((t) => t.projects));
  // atenuar lo que, sumado a la selección actual, no aparece en ningún proyecto
  // con un cliente elegido: se encienden las tecnologías usadas con él y se atenúa el resto
  const usedWith = (t: TechItem) => !!cliente && t.projects.some((p) => p.cliente === cliente.name);
  const dim = (t: TechItem) => sel.length > 0 ? !picked.includes(t.name) && intersectBySlug([matches, t.projects]).length === 0 : !!cliente && !usedWith(t);
  const toggle = (t: TechItem) => { setCliente(null); setPicked((p) => (p.includes(t.name) ? p.filter((n) => n !== t.name) : [...p, t.name])); };
  const paises = new Set(clientes.map((c) => c.marca?.pais).filter(Boolean)).size;
  const totalProjs = clientes.reduce((n, c) => n + c.projects.length, 0);
  const one = sel.length === 1 ? sel[0] : null;

  return (
    <section id="stack" className="grid" style={{ marginTop: 32 }} aria-labelledby="stack-t">
      <div className="card span2 reveal" style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 id="stack-t" className="scramble" style={{ fontSize: 28, fontWeight: 800 }}>Stack</h2>
          <div className={`filters${pill.width ? ' ready' : ''}`} role="group" aria-label="Filtrar tecnologías por grupo" style={{ background: 'var(--surface-2)' }}>
            <span className="pill" style={{ left: pill.left, width: pill.width }} />
            {tabs.map((g) => (
              <button key={g} ref={(el) => { btns.current[g] = el; }} type="button" aria-pressed={tab === g}
                onClick={() => { setTab(g); setChanged(true); }}>
                {g.replace(' & Infraestructura', '')}
              </button>
            ))}
          </div>
        </div>
        <ul className="tech-grid" ref={grid}>
          {shown.map((t, i) => (
            <li key={`${tab}-${t.name}`} className={changed ? 'enter' : undefined} style={{ '--d': i } as React.CSSProperties}>
              <button type="button" className={`tech${dim(t) ? ' dim' : ''}${usedWith(t) ? ' hit' : ''}`} style={brand(t)} aria-pressed={picked.includes(t.name)} onClick={() => toggle(t)}>
                <Icon icon={t.icon} />
                <span>{t.name}</span>
                {t.projects.length > 0 && <b className="tech-count" aria-label={`${t.projects.length} proyectos`}>{t.projects.length}</b>}
              </button>
            </li>
          ))}
        </ul>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'space-between', alignItems: 'center' }}>
          <p className="label" style={{ margin: 0, textTransform: 'none', letterSpacing: 0 }}>
            Elige una o varias tecnologías: verás los proyectos donde las combiné.
          </p>
          {picked.length > 0 && <button type="button" className="btn btn-soft" style={{ minHeight: 40, padding: '0 16px', fontSize: 14 }} onClick={() => setPicked([])}>Limpiar selección</button>}
        </div>
      </div>

      <aside className="card reveal tech-panel" style={{ padding: 32, '--d': 1, ...(one ? brand(one) : {}) } as React.CSSProperties} aria-live="polite">
        {sel.length === 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <h3 className="label">He trabajado con</h3>
            <ul className="clients">
              {clientes.map((c) => {
                const on = cliente?.name === c.name, m = c.marca;
                return (
                  <li key={c.name} className={on ? 'on' : undefined} style={{ '--c': m?.color ?? 'var(--accent)' } as React.CSSProperties}>
                    <button type="button" className="client-row" aria-pressed={on} onClick={() => setCliente(on ? null : c)}
                      aria-label={`${c.name}: ${on ? 'quitar filtro' : 'ver las tecnologías que usé aquí'}`}>
                      <span className="client-tile" style={m?.fondo ? { background: m.fondo } : undefined}>
                        {m?.logo ? <img src={m.logo} alt="" /> : <span style={{ color: m?.fondo ? '#fff' : m?.color, fontSize: (m?.mono ?? c.name).length > 3 ? 10 : 15 }}>{m?.mono ?? c.name.slice(0, 3).toUpperCase()}</span>}
                      </span>
                      <span><strong>{c.name}</strong>{m && <small>{m.sector} · {m.pais}</small>}</span>
                      <b className="client-n" aria-label={`${c.projects.length} proyectos`}>{c.projects.length}</b>
                    </button>
                    <div className="client-more"><div>
                      <div className="client-thumbs">
                        {c.projects.map((p) => (
                          <Link key={p.slug} href={`/proyectos/${p.slug}`} title={p.titulo} tabIndex={on ? 0 : -1}>
                            {p.portada ? <Image src={p.portada} alt={p.titulo} width={160} height={100} sizes="80px" /> : <span>{p.titulo}</span>}
                          </Link>
                        ))}
                      </div>
                    </div></div>
                  </li>
                );
              })}
            </ul>
            <p className="label" style={{ margin: 0, textTransform: 'none', letterSpacing: 0 }}>
              {cliente ? `Mira en la grilla lo que usé con ${cliente.name}.` : `${clientes.length} organizaciones${paises ? ` · ${paises} ${paises === 1 ? 'país' : 'países'}` : ''} · ${totalProjs} proyectos`}
            </p>
          </div>
        )}

        {one && (
          <div key={one.name} className="enter" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div className="tech-hero"><Icon icon={one.icon} size={44} /></div>
            <div>
              <span className="label">{one.group}</span>
              <h3 style={{ fontSize: 30, fontWeight: 800, marginTop: 6 }}>{one.name}</h3>
            </div>
            <ProjectList projects={one.projects} empty="Aún no hay proyectos publicados en el portafolio con esta tecnología." />
            <p className="label" style={{ margin: 0, textTransform: 'none', letterSpacing: 0 }}>Suma otra tecnología para buscar combinaciones.</p>
          </div>
        )}

        {sel.length > 1 && (
          <div key="combo" className="enter" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <h3 style={{ fontSize: 24, fontWeight: 800, lineHeight: 1.15 }}>¿Buscas a alguien con…</h3>
            <ul className="combo-chips">
              {sel.map((t) => (
                <li key={t.name} style={brand(t)}>
                  <Icon icon={t.icon} size={16} />{t.name}
                  <button type="button" aria-label={`Quitar ${t.name}`} onClick={() => toggle(t)}>×</button>
                </li>
              ))}
            </ul>
            <div className="combo-count" aria-label={`${matches.length} proyectos con este stack`}>
              <b key={matches.length}>{matches.length}</b>
              <span>{matches.length === 1 ? 'proyecto con este stack' : 'proyectos con este stack'}</span>
            </div>
            <ProjectList projects={matches} empty="Todavía no las he combinado todas en un mismo proyecto. Quita alguna para ver coincidencias." />
          </div>
        )}
      </aside>
    </section>
  );
}

function ProjectList({ projects, empty }: { projects: TechItem['projects']; empty: string }) {
  if (!projects.length) return <p style={{ margin: 0, color: 'var(--muted)', lineHeight: 1.6 }}>{empty}</p>;
  return (
    <ul className="tech-projects">
      {projects.map((p) => (
        <li key={p.slug}>
          <Link href={`/proyectos/${p.slug}`}>
            <strong>{p.titulo}</strong>
            {p.cliente && <span className="mono">{p.cliente}</span>}
          </Link>
        </li>
      ))}
    </ul>
  );
}
