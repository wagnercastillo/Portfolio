import { describe, it, expect } from 'vitest';
import { ridge, dots, progress, activeSection } from './scene';

describe('ridge', () => {
  const opts = { base: 260, amp: 90, points: 24 };
  it('es determinista por semilla', () => {
    expect(ridge(7, opts)).toBe(ridge(7, opts));
    expect(ridge(7, opts)).not.toBe(ridge(8, opts));
  });
  it('cierra el polígono por abajo a lo ancho del viewBox 1440×400', () => {
    const d = ridge(3, opts);
    expect(d.startsWith('M0,400 L0,')).toBe(true);
    expect(d.endsWith('L1440,400 Z')).toBe(true);
  });
  it('usa curvas suaves (Q), no picos rectos', () => {
    expect(ridge(4, opts)).toMatch(/ Q[\d.]+,[\d.]+ [\d.]+,[\d.]+/);
  });
  it('todas las alturas quedan dentro del viewBox', () => {
    const ys = [...ridge(5, { base: 40, amp: 200, points: 30 }).matchAll(/[\d.]+,([\d.]+)/g)].map((m) => Number(m[1]));
    expect(Math.min(...ys)).toBeGreaterThanOrEqual(0);
    expect(Math.max(...ys)).toBeLessThanOrEqual(400);
  });
});

describe('dots', () => {
  it('genera N sombras separadas por coma, deterministas', () => {
    const s = dots(1, 12, { yMin: 0, yMax: 60, size: [1, 2], colors: ['#fff'] });
    expect(s.split(', ').length).toBe(12);
    expect(s).toBe(dots(1, 12, { yMin: 0, yMax: 60, size: [1, 2], colors: ['#fff'] }));
  });
  it('respeta el rango vertical (en vh)', () => {
    const ys = [...dots(2, 40, { yMin: 70, yMax: 90, size: [1, 1], colors: ['#fc6'] }).matchAll(/vw ([\d.]+)vh/g)].map((m) => Number(m[1]));
    expect(Math.min(...ys)).toBeGreaterThanOrEqual(70);
    expect(Math.max(...ys)).toBeLessThanOrEqual(90);
  });
});

describe('progress', () => {
  it('0 → 1 a lo largo del recorrido de la escena', () => {
    expect(progress(0, 1800, 900)).toBe(0);
    expect(progress(-450, 1800, 900)).toBe(0.5);
    expect(progress(-900, 1800, 900)).toBe(1);
    expect(progress(-5000, 1800, 900)).toBe(1);
    expect(progress(200, 1800, 900)).toBe(0);
  });
  it('sin recorrido → 0', () => expect(progress(-10, 900, 900)).toBe(0));
});


describe('activeSection', () => {
  const s = [{ id: 'proyectos', top: 900 }, { id: 'experiencia', top: 3000 }, { id: 'stack', top: 4200 }];
  it('ninguna antes de la primera', () => expect(activeSection(s, 500)).toBeNull());
  it('la última cuyo inicio ya pasó la línea', () => {
    expect(activeSection(s, 900)).toBe('proyectos');
    expect(activeSection(s, 3500)).toBe('experiencia');
    expect(activeSection(s, 9999)).toBe('stack');
  });
  it('tolera orden desordenado', () => expect(activeSection([s[2], s[0], s[1]], 3500)).toBe('experiencia'));
});
