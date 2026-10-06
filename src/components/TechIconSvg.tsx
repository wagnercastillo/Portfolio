import type { TechIcon } from '@/lib/tech-icons';

/** SVG de una tecnología (logo de Simple Icons relleno o ícono genérico de trazo). */
export function TechIconSvg({ icon, size = 28 }: { icon: TechIcon; size?: number }) {
  return icon.kind === 'fill' ? (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true"><path d={icon.d} /></svg>
  ) : (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={icon.d} /></svg>
  );
}
