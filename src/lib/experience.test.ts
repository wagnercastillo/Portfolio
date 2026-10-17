import { describe, it, expect } from 'vitest';
import { parsePeriodo, mesesTrabajados, fmtMes, estiloDe, proyectosDe, marcaDe } from './experience';
import type { Project } from './projects';

describe('periodo', () => {
  it('lee inicio y fin', () => expect(parsePeriodo('Oct 2025 – Jun 2026')).toEqual({ from: { y: 2025, m: 9 }, to: { y: 2026, m: 5 } }));
  it('cuenta meses con ambos extremos', () => {
    expect(mesesTrabajados('Oct 2025 – Jun 2026')).toBe(9);
    expect(mesesTrabajados('Jun 2024 – Oct 2025')).toBe(17);
    expect(mesesTrabajados('Abr 2023 – Feb 2024')).toBe(11);
  });
  it('sin fin cuenta hasta hoy', () => expect(mesesTrabajados('Ene 2026 – Actualidad', new Date(2026, 2, 10))).toBe(3));
  it('texto raro → null', () => expect(mesesTrabajados('desde siempre')).toBeNull());
  it('formatea', () => { expect(fmtMes({ y: 2025, m: 9 })).toBe('OCT 2025'); expect(fmtMes(null)).toBe('HOY'); });
});

describe('empresa', () => {
  it('reconoce el estilo', () => {
    expect(estiloDe('Teams4Soft')).toBe('t4s');
    expect(estiloDe('Cooperativa de Ahorro y Crédito JEP')).toBe('jep');
    expect(estiloDe('Universidad Nacional de Loja')).toBe('unl');
    expect(estiloDe('Acme')).toBe('base');
  });
  it('marca del cliente', () => {
    expect(marcaDe('EDF / SKF Industrial México')?.pais).toBe('México');
    expect(marcaDe('Cooperativa JEP')?.mono).toBe('JEP');
    expect(marcaDe('Acme')).toBeNull();
  });
  it('asocia proyectos por cliente', () => {
    const p = (slug: string, cliente: string) => ({ slug, cliente }) as Project;
    const all = [p('a', 'Cooperativa JEP'), p('b', 'Teams4Soft'), p('c', ''), p('d', 'Acme')];
    expect(proyectosDe('Cooperativa de Ahorro y Crédito JEP', all).map((x) => x.slug)).toEqual(['a']);
    expect(proyectosDe('Acme', all).map((x) => x.slug)).toEqual(['d']);
  });
});
