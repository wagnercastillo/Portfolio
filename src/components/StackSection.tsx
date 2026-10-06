import type { Perfil } from '@/lib/content';
import { projectsUsing, type Project } from '@/lib/projects';
import { techIcon } from '@/lib/tech-icons';
import { StackExplorer, type TechItem } from './StackExplorer';

export function StackSection({ habilidades, projects }: { habilidades: Perfil['habilidades']; projects: Project[] }) {
  const items: TechItem[] = habilidades.flatMap((h) =>
    h.items.map((name) => ({
      name,
      group: h.grupo,
      icon: techIcon(name),
      projects: projectsUsing(name, projects).map(({ slug, titulo, cliente }) => ({ slug, titulo, cliente })),
    })),
  );
  const clientes = [...new Set(projects.map((p) => p.cliente).filter(Boolean))];
  return <StackExplorer items={items} groups={habilidades.map((h) => h.grupo)} clientes={clientes} />;
}
