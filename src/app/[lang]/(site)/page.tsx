import { getPerfil, getProject, getProjects } from '@/lib/content';
import { stackIcons } from '@/lib/tech-icons';
import { featured } from '@/lib/projects';
import { Hero } from '@/components/Hero';
import { IntroScene } from '@/components/IntroScene';
import { Marquee } from '@/components/Marquee';
import { FeaturedProjects } from '@/components/FeaturedProjects';
import { ProjectGrid } from '@/components/ProjectGrid';
import { Timeline } from '@/components/Timeline';
import { Experience } from '@/components/Experience';
import { StackSection } from '@/components/StackSection';
import { Contact } from '@/components/Contact';
import { getLang } from '@/lib/i18n-server';

export default async function Home() {
  const lang = await getLang();
  const [perfil, projects] = await Promise.all([getPerfil(lang), getProjects(lang)]);
  const cards = projects.map((p) => ({ ...p, icons: stackIcons(p.stack) }));
  const bodies = Object.fromEntries(await Promise.all(projects.map(async (p) => [p.slug, (await getProject(p.slug, lang))?.body ?? null])));
  // la marquesina muestra tecnologías, no habilidades blandas
  const tech = perfil.habilidades.filter((h) => !h.blandas).flatMap((h) => h.items);
  return (
    <main style={{ display: 'contents' }}>
      <IntroScene nombre={perfil.nombre} rol={perfil.rol} ubicacion={perfil.ubicacion} />
      <Hero perfil={perfil} total={projects.length} />
      <Marquee items={tech} />
      <FeaturedProjects projects={featured(projects)} />
      <ProjectGrid projects={cards} bodies={bodies} />
      <Timeline projects={projects} foto={perfil.foto} />
      <Experience perfil={perfil} projects={projects} />
      <StackSection habilidades={perfil.habilidades} projects={projects} />
      <Contact perfil={perfil} />
    </main>
  );
}
