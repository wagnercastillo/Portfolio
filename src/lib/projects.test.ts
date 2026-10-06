import { describe, it, expect } from 'vitest';
import {
  sortProjects, featured, categoriesOf, byCategory,
  coverHue, initials, projectLinks, projectsUsing, brandColor, intersectBySlug, type Project,
} from './projects';

const base: Project = {
  slug: 'a', titulo: 'A', resumen: '', cliente: '', categoria: 'Producto',
  stack: [], destacado: false, orden: 100, fecha: '2025-01-01',
  estado: 'Completado', portada: null, galeria: [], demo: null, repo: null,
};
const p = (o: Partial<Project>): Project => ({ ...base, ...o });

describe('sortProjects', () => {
  it('ordena por orden asc y luego fecha desc', () => {
    const r = sortProjects([
      p({ slug: 'x', orden: 2 }),
      p({ slug: 'y', orden: 1, fecha: '2024-01-01' }),
      p({ slug: 'z', orden: 1, fecha: '2026-01-01' }),
    ]);
    expect(r.map((x) => x.slug)).toEqual(['z', 'y', 'x']);
  });
});

describe('featured', () => {
  it('solo destacados, ordenados', () => {
    const r = featured([p({ slug: 'a', destacado: true, orden: 2 }), p({ slug: 'b' }), p({ slug: 'c', destacado: true, orden: 1 })]);
    expect(r.map((x) => x.slug)).toEqual(['c', 'a']);
  });
});

describe('categoriesOf', () => {
  it('devuelve solo categorías presentes en orden fijo', () => {
    expect(categoriesOf([p({ categoria: 'POC' }), p({ categoria: 'Cliente' }), p({ categoria: 'POC' })]))
      .toEqual(['Cliente', 'POC']);
  });
  it('vacío → []', () => expect(categoriesOf([])).toEqual([]));
});

describe('byCategory', () => {
  const list = [p({ slug: 'a', categoria: 'POC' }), p({ slug: 'b', categoria: 'Cliente' })];
  it('Todos devuelve todo', () => expect(byCategory(list, 'Todos')).toHaveLength(2));
  it('filtra', () => expect(byCategory(list, 'POC').map((x) => x.slug)).toEqual(['a']));
});

describe('coverHue', () => {
  it('estable y en rango', () => {
    expect(coverHue('evalia')).toBe(coverHue('evalia'));
    for (const s of ['a', 'evalia', 'sgt', 'x'.repeat(200)]) {
      const h = coverHue(s);
      expect(h).toBeGreaterThanOrEqual(0);
      expect(h).toBeLessThan(360);
    }
  });
});

describe('initials', () => {
  it('dos palabras', () => expect(initials('Scrum Poker')).toBe('SP'));
  it('una palabra', () => expect(initials('Evalia')).toBe('EV'));
  it('ignora símbolos', () => expect(initials('SGT — Gestión de turnos')).toBe('SG'));
});

describe('projectLinks', () => {
  it('omite vacíos', () => {
    expect(projectLinks({ demo: null, repo: '' })).toEqual([]);
    expect(projectLinks({ demo: 'https://x.com', repo: null })).toEqual([{ label: 'Ver demo', href: 'https://x.com' }]);
  });
});

describe('projectsUsing', () => {
  const list = [
    p({ slug: 'a', stack: ['NestJS', 'PostgreSQL'] }),
    p({ slug: 'b', stack: ['Next.js', 'LDAP'] }),
    p({ slug: 'c', stack: ['MUI', 'React Query'] }),
  ];
  it('coincide ignorando mayúsculas y puntuación', () => {
    expect(projectsUsing('nestjs', list).map((x) => x.slug)).toEqual(['a']);
    expect(projectsUsing('Next.js', list).map((x) => x.slug)).toEqual(['b']);
  });
  it('usa alias (Active Directory ↔ LDAP, Material UI ↔ MUI)', () => {
    expect(projectsUsing('Active Directory', list).map((x) => x.slug)).toEqual(['b']);
    expect(projectsUsing('Material UI', list).map((x) => x.slug)).toEqual(['c']);
  });
  it('no confunde prefijos (React no es React Query)', () => {
    expect(projectsUsing('React', list)).toEqual([]);
  });
  it('sin coincidencias → []', () => expect(projectsUsing('Cobol', list)).toEqual([]));
});

describe('brandColor', () => {
  it('conserva colores legibles en ambos temas', () => expect(brandColor('E0234E')).toBe('#E0234E'));
  it('descarta casi negros y casi blancos', () => {
    expect(brandColor('000000')).toBeNull();
    expect(brandColor('181717')).toBeNull();
    expect(brandColor('FFFFFF')).toBeNull();
  });
  it('acepta # y valores inválidos devuelven null', () => {
    expect(brandColor('#3178C6')).toBe('#3178C6');
    expect(brandColor('xyz')).toBeNull();
  });
});

describe('intersectBySlug', () => {
  const a = { slug: 'a' }, b = { slug: 'b' }, c = { slug: 'c' };
  it('devuelve solo lo común a todas las listas, en el orden de la primera', () => {
    expect(intersectBySlug([[a, b, c], [c, a], [a, c]])).toEqual([a, c]);
  });
  it('una sola lista → la misma lista', () => expect(intersectBySlug([[b, a]])).toEqual([b, a]));
  it('sin listas o con una vacía → []', () => {
    expect(intersectBySlug([])).toEqual([]);
    expect(intersectBySlug([[a], []])).toEqual([]);
  });
});
