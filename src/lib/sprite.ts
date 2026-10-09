export interface SpriteSymbol { id: string; kind: 'fill' | 'stroke'; d: string }

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);

/** Sprite SVG con un <symbol> por ícono (sin duplicados); se sirve como archivo estático cacheable. */
export function buildSprite(symbols: SpriteSymbol[]) {
  const seen = new Set<string>();
  const body = symbols
    .filter((s) => !seen.has(s.id) && seen.add(s.id))
    .map((s) => {
      const paint = s.kind === 'fill'
        ? 'fill="currentColor"'
        : 'fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"';
      return `<symbol id="${esc(s.id)}" viewBox="0 0 24 24"><path d="${esc(s.d)}" ${paint}/></symbol>`;
    })
    .join('');
  return `<svg xmlns="http://www.w3.org/2000/svg">${body}</svg>`;
}
