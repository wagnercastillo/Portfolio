import { describe, it, expect } from 'vitest';
import { buildSprite } from './sprite';

describe('buildSprite', () => {
  const syms = [
    { id: 'react', kind: 'fill' as const, d: 'M1 1h2' },
    { id: 'restapis', kind: 'stroke' as const, d: 'M2 2h3' },
    { id: 'react', kind: 'fill' as const, d: 'M1 1h2' },
  ];
  it('genera un <svg> con un <symbol> por id, sin duplicados', () => {
    const svg = buildSprite(syms);
    expect(svg.startsWith('<svg xmlns="http://www.w3.org/2000/svg"')).toBe(true);
    expect(svg.match(/<symbol /g)).toHaveLength(2);
    expect(svg).toContain('<symbol id="react" viewBox="0 0 24 24"><path d="M1 1h2" fill="currentColor"/></symbol>');
  });
  it('los íconos de trazo usan stroke=currentColor sin relleno', () => {
    expect(buildSprite(syms)).toContain('<path d="M2 2h3" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>');
  });
  it('escapa caracteres peligrosos en el path', () => {
    expect(buildSprite([{ id: 'x', kind: 'fill', d: 'M0 0"/><script>' }])).not.toContain('<script>');
  });
});
