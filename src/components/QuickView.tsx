'use client';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import type { Project } from '@/lib/projects';
import type { IconRef } from '@/lib/tech-icons';
import { ProjectLinks } from './ProjectLinks';
import { StackCover } from './StackCover';
import { TechIconSvg } from './TechIconSvg';

export type CardProject = Project & { icons: IconRef[] };

/** Vista rápida en <dialog>: ← → navega, Esc cierra (nativo). */
export function QuickView({ items, index, bodies, dir, onClose, onNav }: {
  items: CardProject[]; index: number | null; bodies: Record<string, React.ReactNode>; dir: number;
  onClose: () => void; onNav: (delta: number) => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const p = index === null ? null : items[index];

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (p && !d.open) d.showModal();
    if (!p && d.open) d.close();
  }, [p]);

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); onNav(1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); onNav(-1); }
  };

  return (
    <dialog ref={ref} className="quickview" onClose={onClose} onKeyDown={onKey} aria-labelledby="qv-title"
      onClick={(e) => { if (e.target === ref.current) onClose(); }}>
      {p && (
        <div className="qv-inner" key={p.slug} style={{ '--dir': dir } as React.CSSProperties}>
          <div className="qv-top">
            <span className="label">{index! + 1} / {items.length} · ← → para navegar</span>
            <button type="button" className="icon-btn" onClick={onClose} aria-label="Cerrar">✕</button>
          </div>
          <StackCover project={p} icons={p.icons} ratio="21 / 8" />
          <div>
            <p className="label" style={{ margin: 0 }}>{p.categoria}{p.cliente && ` · ${p.cliente}`}</p>
            <h2 id="qv-title" className="qv-title">{p.titulo}</h2>
            <p className="qv-sum">{p.resumen}</p>
          </div>
          <ul className="chips sm qv-stack">
            {p.icons.map((t) => (
              <li key={t.name} style={{ '--brand': t.icon.color ?? 'var(--accent)' } as React.CSSProperties}>
                <TechIconSvg icon={t.icon} size={16} />{t.name}
              </li>
            ))}
            {p.stack.slice(p.icons.length).map((s) => <li key={s}>{s}</li>)}
          </ul>
          <div className="prose-content qv-body">{bodies[p.slug]}</div>
          <div className="qv-actions">
            <ProjectLinks project={p} />
            <Link href={`/proyectos/${p.slug}`} className="btn btn-soft">Ver caso completo →</Link>
          </div>
          <div className="qv-nav">
            <button type="button" className="icon-btn" onClick={() => onNav(-1)} aria-label="Proyecto anterior">←</button>
            <button type="button" className="icon-btn" onClick={() => onNav(1)} aria-label="Proyecto siguiente">→</button>
          </div>
        </div>
      )}
    </dialog>
  );
}
