import 'server-only';
import * as si from 'simple-icons';
import { brandColor } from './projects';

export interface TechIcon { d: string; kind: 'fill' | 'stroke'; color: string | null }

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');

// Nombre del CV → slug de Simple Icons cuando el título no coincide.
const SLUGS: Record<string, string> = {
  materialui: 'mui', java: 'openjdk', rxjs: 'reactivex', fcm: 'firebase', vb6: 'dotnet', vbnet: 'dotnet',
  claudeapi: 'claude', gemini: 'googlegemini', tanstackquery: 'reactquery', googleoauth: 'google',
  whatsappapi: 'whatsapp', gorouter: 'flutter', websocket: 'socketdotio',
};

// Íconos de trazo (viewBox 24) para lo que no tiene logo de marca.
const GENERIC: Record<string, string> = {
  restapis: 'M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 1-2 2 2 2 0 0 1 2 2v5a2 2 0 0 0 2 2h1M16 3h1a2 2 0 0 1 2 2v5a2 2 0 0 0 2 2 2 2 0 0 0-2 2v5a2 2 0 0 1-2 2h-1',
  sqlserver: 'M12 3c4.97 0 9 1.34 9 3s-4.03 3-9 3-9-1.34-9-3 4.03-3 9-3zM3 6v12c0 1.66 4.03 3 9 3s9-1.34 9-3V6M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3',
  activedirectory: 'M2 4h20v6H2zM2 14h20v6H2zM6 7h.01M6 17h.01',
  trabajoenequipo: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75',
  adaptabilidad: 'M21 12a9 9 0 1 1-3-6.7L21 8M21 3v5h-5',
  resoluciondeproblemas: 'M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z',
  comunicacionefectiva: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z',
  proactividad: 'M13 2 3 14h9l-1 8 10-12h-9l1-8z',
};
const FALLBACK = 'M16 18l6-6-6-6M8 6l-6 6 6 6';

// solo entradas que son íconos (bajo interop CJS aparece también un 'default')
const all = Object.values(si).filter((i): i is si.SimpleIcon => typeof (i as si.SimpleIcon)?.title === 'string');
const bySlug = new Map(all.map((i) => [i.slug, i]));
const byTitle = new Map(all.map((i) => [norm(i.title), i]));

export function techIcon(name: string): TechIcon {
  const n = norm(name.normalize('NFD').replace(/[̀-ͯ]/g, ''));
  if (GENERIC[n]) return { d: GENERIC[n], kind: 'stroke', color: null };
  const icon = (SLUGS[n] && bySlug.get(SLUGS[n])) || byTitle.get(n);
  return icon ? { d: icon.path, kind: 'fill', color: brandColor(icon.hex) } : { d: FALLBACK, kind: 'stroke', color: null };
}

export interface IconRef { name: string; icon: TechIcon }

/** Íconos del stack de un proyecto para su portada (máx. 6). */
export const stackIcons = (stack: string[]): IconRef[] => stack.slice(0, 6).map((name) => ({ name, icon: techIcon(name) }));
