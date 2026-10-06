export type Categoria = 'Cliente' | 'Producto' | 'Personal' | 'POC';
export type Estado = 'En producción' | 'En desarrollo' | 'Completado';

export interface Project {
  slug: string;
  titulo: string;
  resumen: string;
  cliente: string;
  categoria: Categoria;
  stack: string[];
  destacado: boolean;
  orden: number;
  fecha: string;
  estado: Estado;
  portada: string | null;
  galeria: string[];
  demo: string | null;
  repo: string | null;
}

const CATEGORIAS: Categoria[] = ['Cliente', 'Producto', 'Personal', 'POC'];

export const sortProjects = (p: Project[]) =>
  [...p].sort((a, b) => a.orden - b.orden || b.fecha.localeCompare(a.fecha));

export const featured = (p: Project[]) => sortProjects(p.filter((x) => x.destacado));

export const categoriesOf = (p: Project[]) =>
  CATEGORIAS.filter((c) => p.some((x) => x.categoria === c));

export const byCategory = (p: Project[], c: Categoria | 'Todos') =>
  c === 'Todos' ? p : p.filter((x) => x.categoria === c);

export const coverHue = (slug: string) =>
  [...slug].reduce((h, ch) => (h * 31 + ch.charCodeAt(0)) % 360, 7);

export const initials = (titulo: string) => {
  const words = titulo.split(/[^\p{L}\p{N}]+/u).filter(Boolean);
  const s = words.length > 1 ? words[0][0] + words[1][0] : (words[0] ?? '').slice(0, 2);
  return s.toUpperCase();
};

export const projectLinks = ({ demo, repo }: Pick<Project, 'demo' | 'repo'>) =>
  [
    { label: 'Ver demo', href: demo },
    { label: 'Código', href: repo },
  ].filter((l): l is { label: string; href: string } => !!l.href);

const normTech = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
// Nombres distintos para la misma tecnología entre el CV y el stack de los proyectos.
const ALIASES = [['activedirectory', 'ldap'], ['materialui', 'mui'], ['tanstackquery', 'reactquery']];
const techKeys = (t: string) => {
  const n = normTech(t);
  return ALIASES.find((g) => g.includes(n)) ?? [n];
};

/** Proyectos cuyo stack incluye la tecnología (coincidencia exacta normalizada o alias). */
export const projectsUsing = (tech: string, p: Project[]) => {
  const keys = techKeys(tech);
  return p.filter((x) => x.stack.some((s) => keys.includes(normTech(s))));
};

/** Color de marca utilizable en tema claro y oscuro; null si es casi negro o casi blanco. */
export const brandColor = (hex: string) => {
  const h = hex.replace('#', '');
  if (!/^[0-9a-f]{6}$/i.test(h)) return null;
  const [r, g, b] = [0, 2, 4].map((i) => {
    const c = parseInt(h.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  const l = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return l < 0.06 || l > 0.85 ? null : `#${h.toUpperCase()}`;
};
