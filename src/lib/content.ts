import 'server-only';
import { createReader } from '@keystatic/core/reader';
import Markdoc from '@markdoc/markdoc';
import React from 'react';
import config from '../../keystatic.config';
import { sortProjects, type Project, type Categoria, type Estado } from './projects';
import type { Lang } from './i18n';

const reader = createReader(process.cwd(), config);

export interface Experiencia { cargo: string; empresa: string; periodo: string; logros: string[] }
export interface Perfil {
  nombre: string; rol: string; foto: string | null; galeria: { imagen: string; enfoque: string }[]; bio: string; ubicacion: string; email: string; telefono: string;
  linkedin: string; github: string; cv: string | null;
  experiencia: Experiencia[];
  educacion: { titulo: string; detalle: string }[];
  habilidades: { grupo: string; items: string[]; blandas: boolean }[];
  idiomas: string;
}

type Entry = NonNullable<Awaited<ReturnType<typeof reader.collections.proyectos.read>>>;

// en inglés se usa la traducción si existe; si falta, queda el texto en español
const toProject = (slug: string, e: Entry, lang: Lang): Project => ({
  slug,
  titulo: (lang === 'en' && e.en.titulo) || e.titulo,
  resumen: (lang === 'en' && e.en.resumen) || e.resumen,
  cliente: e.cliente,
  categoria: e.categoria as Categoria,
  stack: [...e.stack],
  destacado: e.destacado,
  orden: e.orden ?? 100,
  fecha: e.fecha ?? '',
  estado: e.estado as Estado,
  portada: e.portada ?? null,
  galeria: e.galeria.filter((g): g is string => !!g),
  demo: e.demo || null,
  repo: e.repo || null,
});

export async function getProjects(lang: Lang = 'es'): Promise<Project[]> {
  const all = await reader.collections.proyectos.all();
  return sortProjects(all.map(({ slug, entry }) => toProject(slug, entry, lang)));
}

export async function getProject(slug: string, lang: Lang = 'es') {
  const e = await reader.collections.proyectos.read(slug);
  if (!e) return null;
  const node = lang === 'en' && e.en.contenido.trim() ? Markdoc.parse(e.en.contenido) : (await e.contenido()).node;
  const body = Markdoc.renderers.react(Markdoc.transform(node), React);
  return { project: toProject(slug, e, lang), body };
}

export async function getPerfil(lang: Lang = 'es'): Promise<Perfil> {
  const p = await reader.singletons.perfil.readOrThrow();
  const en = lang === 'en';
  return {
    ...p,
    rol: (en && p.en.rol) || p.rol,
    bio: (en && p.en.bio) || p.bio,
    ubicacion: (en && p.en.ubicacion) || p.ubicacion,
    idiomas: (en && p.en.idiomas) || p.idiomas,
    linkedin: p.linkedin ?? '',
    github: p.github ?? '',
    foto: p.foto ?? null,
    galeria: p.galeria.filter((g) => g.imagen).map((g) => ({ imagen: g.imagen!, enfoque: g.enfoque })),
    cv: p.cv ?? null,
    experiencia: p.experiencia.map(({ en: xe, ...x }) => ({
      ...x,
      cargo: (en && xe.cargo) || x.cargo,
      logros: [...(en && xe.logros.length ? xe.logros : x.logros)],
    })),
    educacion: p.educacion.map(({ en: ee, ...e }) => ({ titulo: (en && ee.titulo) || e.titulo, detalle: (en && ee.detalle) || e.detalle })),
    habilidades: p.habilidades.map((h) => ({
      grupo: (en && h.grupoEn) || h.grupo, items: [...h.items], blandas: /blandas/i.test(h.grupo),
    })),
  };
}
