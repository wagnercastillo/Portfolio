import Link from 'next/link';
import type { Project } from '@/lib/projects';
import { ProjectCover } from './ProjectCover';
import { ProjectCard } from './ProjectCard';
import { TurnoTicket } from './TurnoTicket';
import { stackIcons } from '@/lib/tech-icons';

const d = (n: number) => ({ '--d': n }) as React.CSSProperties;

function DashboardMock() {
  return (
    <div className="shot" aria-hidden="true">
      <div />
      <div className="kpis">
        <div className="k"><div className="bar" /><b style={{ color: 'var(--accent)' }}>4.6</b></div>
        <div className="k"><div className="bar" /><b>92%</b></div>
        <div className="k"><div className="bar" /><b>128</b></div>
        <div className="k chart">
          {[40, 65, 50, 80, 70, 95, 85].map((h, i) => <i key={i} style={{ '--h': `${h}%` } as React.CSSProperties} />)}
        </div>
      </div>
    </div>
  );
}

// ponytail: mockups animados atados a slugs concretos; una portada subida los reemplaza.
const MOCK_WIDE = 'evalia';
const MOCK_TURNO = 'sgt-gestion-de-turnos';

export function FeaturedProjects({ projects }: { projects: Project[] }) {
  const [first, second, ...rest] = projects;
  if (!first) return null;
  return (
    <section id="proyectos" aria-labelledby="dest" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <h2 id="dest" className="section-title reveal scramble" style={{ margin: '32px 4px 0' }}>Proyectos destacados</h2>
      <div className="grid">
        <Link href={`/proyectos/${first.slug}`} className="card feat wide span2 spot tilt reveal">
          <div className="meta label">
            <span>{first.cliente || first.categoria} · {first.categoria}</span>
            <span style={{ color: 'var(--ok-fg)' }}>● {first.estado}</span>
          </div>
          {first.slug === MOCK_WIDE && !first.portada ? <DashboardMock /> : <ProjectCover project={first} ratio="16 / 7" priority />}
          <div><h3>{first.titulo}</h3><p>{first.resumen}</p></div>
        </Link>
        {second && (second.slug === MOCK_TURNO && !second.portada ? (
          <Link href={`/proyectos/${second.slug}`} className="card feat turno tilt reveal" style={d(1)}>
            <div className="label">{second.cliente} · {second.categoria}</div>
            <TurnoTicket />
            <div><h3>{second.titulo}</h3><p>{second.resumen}</p></div>
          </Link>
        ) : <ProjectCard project={second} icons={stackIcons(second.stack)} className="reveal" style={d(1)} />)}
      </div>
      {rest.length > 0 && (
        <div className="grid">
          {rest.map((p, i) => <ProjectCard key={p.slug} project={p} icons={stackIcons(p.stack)} className="reveal" style={d(i)} />)}
        </div>
      )}
    </section>
  );
}
