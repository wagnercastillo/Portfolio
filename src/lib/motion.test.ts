import { describe, it, expect } from 'vitest';
import { scrollProgress } from './motion';

describe('scrollProgress', () => {
  it('0 arriba, 1 cuando el hero salió por completo', () => {
    expect(scrollProgress(0, 800)).toBe(0);
    expect(scrollProgress(400, 800)).toBe(0.5);
    expect(scrollProgress(800, 800)).toBe(1);
  });
  it('se limita a [0, 1]', () => {
    expect(scrollProgress(-50, 800)).toBe(0);
    expect(scrollProgress(5000, 800)).toBe(1);
  });
  it('altura 0 → 0', () => expect(scrollProgress(100, 0)).toBe(0));
});
