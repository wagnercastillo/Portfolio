import { getPerfil, getProjects } from '@/lib/content';
import { buildSprite } from '@/lib/sprite';
import { spriteSymbols } from '@/lib/tech-icons';

// Se genera en el build con todas las tecnologías del perfil y de los proyectos.
export const dynamic = 'force-static';

export async function GET() {
  const [perfil, projects] = await Promise.all([getPerfil(), getProjects()]);
  const names = [...perfil.habilidades.flatMap((h) => h.items), ...projects.flatMap((p) => p.stack)];
  return new Response(buildSprite(spriteSymbols(names)), {
    headers: { 'Content-Type': 'image/svg+xml', 'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400' },
  });
}
