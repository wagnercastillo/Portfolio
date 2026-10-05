import 'server-only';
import { createReader } from '@keystatic/core/reader';
import Markdoc from '@markdoc/markdoc';
import React from 'react';
import config from '../../keystatic.config';
import { sortProjects, type Project, type Categoria, type Estado } from './projects';

const reader = createReader(process.cwd(), config);

export interface Experiencia { cargo: string; empresa: string; periodo: string; logros: string[] }
export interface Perfil {
  nombre: string; rol: string; bio: string; ubicacion: string; email: string; telefono: string;
  linkedin: string; github: string; cv: string | null;
  experiencia: Experiencia[];
  educacion: { titulo: string; detalle: string }[];
  habilidades: { grupo: string; items: string[] }[];
  idiomas: string;
}

type Entry = NonNullable<Awaited<ReturnType<typeof reader.collections.proyectos.read>>>;

const toProject = (slug: string, e: Entry): Project => ({
  slug,
  titulo: e.titulo,
  resumen: e.resumen,
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

export async function getProjects(): Promise<Project[]> {
  const all = await reader.collections.proyectos.all();
  return sortProjects(all.map(({ slug, entry }) => toProject(slug, entry)));
}

export async function getProject(slug: string) {
  const e = await reader.collections.proyectos.read(slug);
  if (!e) return null;
  const { node } = await e.contenido();
  const body = Markdoc.renderers.react(Markdoc.transform(node), React);
  return { project: toProject(slug, e), body };
}

export async function getPerfil(): Promise<Perfil> {
  const p = await reader.singletons.perfil.readOrThrow();
  return {
    ...p,
    linkedin: p.linkedin ?? '',
    github: p.github ?? '',
    cv: p.cv ?? null,
    experiencia: p.experiencia.map((x) => ({ ...x, logros: [...x.logros] })),
    educacion: [...p.educacion],
    habilidades: p.habilidades.map((h) => ({ ...h, items: [...h.items] })),
  };
}
