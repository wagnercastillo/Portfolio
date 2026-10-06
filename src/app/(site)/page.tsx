import { getPerfil, getProject, getProjects } from '@/lib/content';
import { stackIcons } from '@/lib/tech-icons';
import { featured } from '@/lib/projects';
import { Hero } from '@/components/Hero';
import { Marquee } from '@/components/Marquee';
import { FeaturedProjects } from '@/components/FeaturedProjects';
import { ProjectGrid } from '@/components/ProjectGrid';
import { Timeline } from '@/components/Timeline';
import { Experience } from '@/components/Experience';
import { StackSection } from '@/components/StackSection';
import { Contact } from '@/components/Contact';

export default async function Home() {
  const [perfil, projects] = await Promise.all([getPerfil(), getProjects()]);
  const cards = projects.map((p) => ({ ...p, icons: stackIcons(p.stack) }));
  const bodies = Object.fromEntries(await Promise.all(projects.map(async (p) => [p.slug, (await getProject(p.slug))?.body ?? null])));
  // la marquesina muestra tecnologías, no habilidades blandas
  const tech = perfil.habilidades.filter((h) => !/blandas/i.test(h.grupo)).flatMap((h) => h.items);
  return (
    <main style={{ display: 'contents' }}>
      <Hero perfil={perfil} total={projects.length} />
      <Marquee items={tech} />
      <FeaturedProjects projects={featured(projects)} />
      <ProjectGrid projects={cards} bodies={bodies} />
      <Timeline projects={projects} />
      <Experience perfil={perfil} />
      <StackSection habilidades={perfil.habilidades} projects={projects} />
      <Contact perfil={perfil} />
    </main>
  );
}
