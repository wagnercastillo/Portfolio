import type { Project } from './projects';
import { dict, type Lang } from './i18n';

const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

export interface Mes { y: number; m: number }

/** "Oct 2025 – Jun 2026" → inicio y fin; fin null si dice "Actualidad"/"Presente" o falta. */
export function parsePeriodo(periodo: string): { from: Mes | null; to: Mes | null } {
  const found = [...periodo.toLowerCase().matchAll(/([a-zñ]{3})[a-zñ]*\.?\s+(\d{4})/g)]
    .map(([, mes, y]) => ({ y: Number(y), m: MESES.indexOf(mes) }))
    .filter((x) => x.m >= 0);
  return { from: found[0] ?? null, to: found[1] ?? null };
}

/** Meses trabajados contando ambos extremos (Oct–Jun = 9). Sin fin → hasta `now`. */
export function mesesTrabajados(periodo: string, now = new Date()): number | null {
  const { from, to } = parsePeriodo(periodo);
  if (!from) return null;
  const end = to ?? { y: now.getFullYear(), m: now.getMonth() };
  return Math.max((end.y - from.y) * 12 + end.m - from.m + 1, 1);
}

export const fmtMes = (x: Mes | null, lang: Lang = 'es') => {
  const t = dict(lang).exp;
  return x ? `${t.months[x.m]} ${x.y}` : t.now;
};

/** Diseño de credencial según la empresa; `match` reconoce el campo `cliente` de los proyectos. */
export type Estilo = 't4s' | 'jep' | 'unl' | 'base';
const ESTILOS: { estilo: Estilo; match: RegExp }[] = [
  { estilo: 't4s', match: /teams\s*4\s*soft/i },
  { estilo: 'jep', match: /\bjep\b/i },
  { estilo: 'unl', match: /universidad nacional de loja|\bunl\b/i },
];
export const estiloDe = (empresa: string): Estilo => ESTILOS.find((e) => e.match.test(empresa))?.estilo ?? 'base';

/** Logo, sector y país de cada organización (por nombre de cliente); las nuevas salen sin esto. */
export interface Marca { logo?: string; mono?: string; fondo?: string; color: string; sector: string; pais: string }
const MARCAS: { match: RegExp; marca: Marca }[] = [
  { match: /teams\s*4\s*soft/i, marca: { logo: '/experiencia/t4s.svg', color: '#41A3EB', sector: 'Software', pais: 'Ecuador' } },
  { match: /\bjep\b/i, marca: { mono: 'JEP', fondo: '#231f20', color: '#231f20', sector: 'Banca cooperativa', pais: 'Ecuador' } },
  { match: /\bedf\b|\bskf\b/i, marca: { mono: 'EDF·SKF', color: '#e85d0c', sector: 'Energía eólica', pais: 'México' } },
  { match: /\bgmx\b/i, marca: { logo: '/experiencia/gmx.webp', color: '#0d5a8a', sector: 'Seguros', pais: 'México' } },
  { match: /universidad nacional de loja|\bunl\b/i, marca: { logo: '/experiencia/unl-logo.png', fondo: '#0d2b52', color: '#0d2b52', sector: 'Academia', pais: 'Ecuador' } },
];
export const marcaDe = (nombre: string): Marca | null => MARCAS.find((m) => m.match.test(nombre))?.marca ?? null;

/** Proyectos hechos en esa empresa: mismo estilo reconocido en `cliente`, o cliente idéntico. */
export function proyectosDe(empresa: string, projects: Project[]): Project[] {
  const re = ESTILOS.find((e) => e.match.test(empresa))?.match;
  return projects.filter((p) => p.cliente && (re ? re.test(p.cliente) : p.cliente.trim().toLowerCase() === empresa.trim().toLowerCase()));
}
