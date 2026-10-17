import type { Perfil } from '@/lib/content';
import { projectsUsing, type Project } from '@/lib/projects';
import { techIcon } from '@/lib/tech-icons';
import { marcaDe } from '@/lib/experience';
import { StackExplorer, type Cliente, type TechItem } from './StackExplorer';

export function StackSection({ habilidades, projects }: { habilidades: Perfil['habilidades']; projects: Project[] }) {
  const items: TechItem[] = habilidades.flatMap((h) =>
    h.items.map((name) => ({
      name,
      group: h.grupo,
      icon: techIcon(name),
      projects: projectsUsing(name, projects).map(({ slug, titulo, cliente }) => ({ slug, titulo, cliente })),
    })),
  );
  const clientes: Cliente[] = [...new Set(projects.map((p) => p.cliente).filter(Boolean))].map((name) => ({
    name,
    marca: marcaDe(name),
    projects: projects.filter((p) => p.cliente === name).map(({ slug, titulo, portada }) => ({ slug, titulo, portada })),
  }));
  return <StackExplorer items={items} groups={habilidades.map((h) => h.grupo)} clientes={clientes} />;
}
