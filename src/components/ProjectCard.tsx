import Link from 'next/link';
import type { Project } from '@/lib/projects';
import { ProjectCover } from './ProjectCover';

export function ProjectCard({ project, className = '', style }: { project: Project; className?: string; style?: React.CSSProperties }) {
  return (
    <Link href={`/proyectos/${project.slug}`} className={`card pcard spot tilt ${className}`} style={style}>
      <ProjectCover project={project} />
      <div className="label">{project.categoria}{project.cliente && ` · ${project.cliente}`}</div>
      <h3>{project.titulo}</h3>
      <p>{project.resumen}</p>
    </Link>
  );
}
