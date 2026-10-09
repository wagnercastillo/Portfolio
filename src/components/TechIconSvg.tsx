import type { TechIcon } from '@/lib/tech-icons';

/** Ícono de una tecnología: referencia al sprite cacheable /icons.svg (el dibujo no se repite en el HTML). */
export function TechIconSvg({ icon, size = 28 }: { icon: TechIcon; size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <use href={`/icons.svg#${icon.id}`} />
    </svg>
  );
}
