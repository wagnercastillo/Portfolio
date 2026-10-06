'use client';
import { useEffect, useRef, useState } from 'react';
import { byCategory, categoriesOf, wrapIndex, type Categoria } from '@/lib/projects';
import { ProjectCard } from './ProjectCard';
import { QuickView, type CardProject } from './QuickView';

type Filtro = Categoria | 'Todos';

export function ProjectGrid({ projects, bodies }: { projects: CardProject[]; bodies: Record<string, React.ReactNode> }) {
  const [cat, setCat] = useState<Filtro>('Todos');
  const [filtered, setFiltered] = useState(false);
  const [pill, setPill] = useState({ left: 4, width: 0 });
  const btns = useRef<Partial<Record<Filtro, HTMLButtonElement | null>>>({});
  const chips: Filtro[] = ['Todos', ...categoriesOf(projects)];

  useEffect(() => {
    const place = () => {
      const b = btns.current[cat];
      if (b) setPill({ left: b.offsetLeft, width: b.offsetWidth });
    };
    place();
    document.fonts?.ready.then(place);
    addEventListener('resize', place);
    return () => removeEventListener('resize', place);
  }, [cat]);

  const pick = (c: Filtro) => { setCat(c); setFiltered(true); };
  const shown = byCategory(projects, cat);
  const [open, setOpen] = useState<number | null>(null);
  const [dir, setDir] = useState(1);
  const nav = (delta: number) => { setDir(delta); setOpen((i) => (i === null ? i : wrapIndex(i, delta, shown.length))); };

  return (
    <section aria-labelledby="todos" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div className="section-head">
        <h2 id="todos" className="section-title reveal scramble">Todos los proyectos</h2>
        <div className="filters" role="group" aria-label="Filtrar por categoría">
          <span className="pill" style={{ left: pill.left, width: pill.width }} />
          {chips.map((c) => (
            <button key={c} ref={(el) => { btns.current[c] = el; }} type="button" aria-pressed={cat === c} onClick={() => pick(c)}>
              {c}
            </button>
          ))}
        </div>
      </div>
      <div className="pgrid">
        {shown.map((p, i) => (
          <ProjectCard
            key={`${cat}-${p.slug}`}
            project={p}
            icons={p.icons}
            onOpen={() => { setDir(1); setOpen(i); }}
            className={filtered ? 'enter' : 'reveal'}
            style={{ '--d': filtered ? i : i % 3 } as React.CSSProperties}
          />
        ))}
      </div>
      <QuickView items={shown} index={open} bodies={bodies} dir={dir} onClose={() => setOpen(null)} onNav={nav} />
    </section>
  );
}
