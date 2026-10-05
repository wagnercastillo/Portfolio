import Image from 'next/image';
import { coverHue, initials, type Project } from '@/lib/projects';

/** Portada subida desde el panel o, si no hay, placeholder con iniciales y tinte estable por slug. */
export function ProjectCover({ project, priority = false, ratio }: { project: Project; priority?: boolean; ratio?: string }) {
  const style = ratio ? { aspectRatio: ratio } : undefined;
  if (project.portada) {
    return (
      <div className="cover" style={style}>
        <Image src={project.portada} alt={`Portada de ${project.titulo}`} fill priority={priority} sizes="(min-width: 1024px) 50vw, 100vw" />
      </div>
    );
  }
  const h = coverHue(project.slug);
  return (
    <div className="cover" aria-hidden="true" style={{ ...style, backgroundImage: `linear-gradient(135deg, hsl(${h} 70% 55% / .12), transparent 60%)` }}>
      {initials(project.titulo)}
    </div>
  );
}
