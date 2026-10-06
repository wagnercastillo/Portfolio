import type { IconRef } from '@/lib/tech-icons';
import { coverHue, statusInfo, type Project } from '@/lib/projects';
import { ProjectCover } from './ProjectCover';
import { TechIconSvg } from './TechIconSvg';

// posición de cada ícono (en % desde el centro) en reposo y al pasar el mouse
const ring = (i: number, n: number, rx: number, ry: number) => {
  if (i === 0) return { x: 0, y: 0 };
  const a = ((i - 1) / Math.max(n - 1, 1)) * Math.PI * 2 - Math.PI / 2;
  return { x: Math.round(Math.cos(a) * rx), y: Math.round(Math.sin(a) * ry) };
};

export function StatusBadge({ project }: { project: Pick<Project, 'estado' | 'fecha'> }) {
  const s = statusInfo(project);
  return <span className={`status ${s.kind}`}><i aria-hidden="true" />{s.label}{s.year && <em>{s.year}</em>}</span>;
}

/** Portada: captura subida o, si no hay, los logos del stack flotando. */
export function StackCover({ project, icons = [], ratio }: { project: Project; icons?: IconRef[]; ratio?: string }) {
  if (project.portada || !icons.length) {
    return (
      <div className="cover-wrap">
        <ProjectCover project={project} ratio={ratio} />
        <StatusBadge project={project} />
      </div>
    );
  }
  const h = coverHue(project.slug);
  return (
    <div className="cover-wrap">
      <div className="cover stack-cover" aria-hidden="true"
        style={{ aspectRatio: ratio, backgroundImage: `radial-gradient(circle at 50% 50%, hsl(${h} 70% 55% / .16), transparent 70%)` }}>
        {icons.map((t, i) => {
          const rest = ring(i, icons.length, 33, 27), open = ring(i, icons.length, 40, 33);
          return (
            <span key={t.name} className={`sc-icon${i === 0 ? ' main' : ''}`} title={t.name}
              style={{ '--i': i, '--brand': t.icon.color ?? 'var(--accent)', '--x': `${rest.x}%`, '--y': `${rest.y}%`, '--hx': `${open.x}%`, '--hy': `${open.y}%` } as React.CSSProperties}>
              <TechIconSvg icon={t.icon} size={i === 0 ? 34 : 20} />
            </span>
          );
        })}
        <span className="sc-cta">Ver caso →</span>
      </div>
      <StatusBadge project={project} />
    </div>
  );
}
