'use client';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import type { TechIcon } from '@/lib/tech-icons';

export interface TechItem {
  name: string;
  group: string;
  icon: TechIcon;
  projects: { slug: string; titulo: string; cliente: string }[];
}

function Icon({ icon, size = 28 }: { icon: TechIcon; size?: number }) {
  return icon.kind === 'fill' ? (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true"><path d={icon.d} /></svg>
  ) : (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={icon.d} /></svg>
  );
}

/** Mosaico de tecnologías con pestañas por grupo; al elegir una muestra los proyectos donde se usó. */
export function StackExplorer({ items, groups, clientes }: { items: TechItem[]; groups: string[]; clientes: string[] }) {
  const tabs = ['Todo', ...groups];
  const [tab, setTab] = useState('Todo');
  const [changed, setChanged] = useState(false);
  const [sel, setSel] = useState<TechItem | null>(null);
  const [pill, setPill] = useState({ left: 4, width: 0 });
  const btns = useRef<Record<string, HTMLButtonElement | null>>({});

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

  return (
    <section id="stack" className="grid" style={{ marginTop: 32 }} aria-labelledby="stack-t">
      <div className="card span2 reveal" style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 id="stack-t" className="scramble" style={{ fontSize: 28, fontWeight: 800 }}>Stack</h2>
          <div className="filters" role="group" aria-label="Filtrar tecnologías por grupo" style={{ background: 'var(--surface-2)' }}>
            <span className="pill" style={{ left: pill.left, width: pill.width }} />
            {tabs.map((g) => (
              <button key={g} ref={(el) => { btns.current[g] = el; }} type="button" aria-pressed={tab === g}
                onClick={() => { setTab(g); setChanged(true); }}>
                {g.replace(' & Infraestructura', '')}
              </button>
            ))}
          </div>
        </div>
        <ul className="tech-grid">
          {shown.map((t, i) => (
            <li key={`${tab}-${t.name}`} className={changed ? 'enter' : undefined} style={{ '--d': i } as React.CSSProperties}>
              <button type="button" className="tech" style={brand(t)} aria-pressed={sel?.name === t.name}
                onClick={() => setSel(sel?.name === t.name ? null : t)}>
                <Icon icon={t.icon} />
                <span>{t.name}</span>
                {t.projects.length > 0 && <b className="tech-count" aria-label={`${t.projects.length} proyectos`}>{t.projects.length}</b>}
              </button>
            </li>
          ))}
        </ul>
        <p className="label" style={{ textTransform: 'none', letterSpacing: 0 }}>
          Toca una tecnología para ver en qué proyectos la usé.
        </p>
      </div>

      <aside className="card reveal tech-panel" style={{ padding: 32, '--d': 1, ...(sel ? brand(sel) : {}) } as React.CSSProperties} aria-live="polite">
        {sel ? (
          <div key={sel.name} className="enter" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div className="tech-hero"><Icon icon={sel.icon} size={44} /></div>
            <div>
              <span className="label">{sel.group}</span>
              <h3 style={{ fontSize: 30, fontWeight: 800, marginTop: 6 }}>{sel.name}</h3>
            </div>
            {sel.projects.length ? (
              <>
                <span className="label">Usada en {sel.projects.length} {sel.projects.length === 1 ? 'proyecto' : 'proyectos'}</span>
                <ul className="tech-projects">
                  {sel.projects.map((p) => (
                    <li key={p.slug}>
                      <Link href={`/proyectos/${p.slug}`}>
                        <strong>{p.titulo}</strong>
                        {p.cliente && <span className="mono">{p.cliente}</span>}
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <p style={{ margin: 0, color: 'var(--muted)', lineHeight: 1.6 }}>Aún no hay proyectos publicados en el portafolio con esta tecnología.</p>
            )}
            <button type="button" className="btn btn-soft" style={{ alignSelf: 'flex-start' }} onClick={() => setSel(null)}>← Volver</button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <h3 className="label">He trabajado con</h3>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 14, fontSize: 22, fontWeight: 700 }}>
              {clientes.map((c) => <li key={c}>{c}</li>)}
            </ul>
          </div>
        )}
      </aside>
    </section>
  );
}
