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
