import Link from 'next/link';
import type { Project } from '@/lib/projects';
import type { IconRef } from '@/lib/tech-icons';
import { StackCover } from './StackCover';

export function ProjectCard({ project, icons, className = '', style, onOpen }: {
  project: Project; icons?: IconRef[]; className?: string; style?: React.CSSProperties; onOpen?: () => void;
}) {
  // con onOpen abre la vista rápida; ctrl/cmd/shift-clic sigue abriendo la página
  const click = onOpen
    ? (e: React.MouseEvent) => { if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return; e.preventDefault(); onOpen(); }
    : undefined;
  return (
    <Link href={`/proyectos/${project.slug}`} className={`card pcard spot tilt ${className}`} style={style} onClick={click}>
      <StackCover project={project} icons={icons} />
      <div className="label">{project.categoria}{project.cliente && ` · ${project.cliente}`}</div>
      <h3>{project.titulo}</h3>
      <p>{project.resumen}</p>
    </Link>
  );
}
