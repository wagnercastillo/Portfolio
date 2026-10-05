'use client';
import { useEffect, useRef, useState } from 'react';
import { byCategory, categoriesOf, type Categoria, type Project } from '@/lib/projects';
import { ProjectCard } from './ProjectCard';

type Filtro = Categoria | 'Todos';

export function ProjectGrid({ projects }: { projects: Project[] }) {
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
        {byCategory(projects, cat).map((p, i) => (
          <ProjectCard
            key={`${cat}-${p.slug}`}
            project={p}
            className={filtered ? 'enter' : 'reveal'}
            style={{ '--d': filtered ? i : i % 3 } as React.CSSProperties}
          />
        ))}
      </div>
    </section>
  );
}
