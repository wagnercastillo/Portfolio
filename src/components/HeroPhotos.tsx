'use client';
import Image from 'next/image';
import { useEffect, useState } from 'react';

const FOCUS: Record<string, string> = { arriba: '50% 22%', centro: '50% 55%', abajo: '50% 85%' };

/** Fotos del hero: rotan solas cada 6 s (pausa al pasar el mouse) y cambian al hacer clic. */
export function HeroPhotos({ photos, nombre, ubicacion }: { photos: { imagen: string; enfoque: string }[]; nombre: string; ubicacion: string }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const many = photos.length > 1;

  useEffect(() => {
    if (!many || paused || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = setInterval(() => setI((n) => (n + 1) % photos.length), 6000);
    return () => clearInterval(id);
  }, [many, paused, photos.length]);

  const next = () => many && setI((n) => (n + 1) % photos.length);

  return (
    <figure className="card photo tilt reveal" style={{ '--d': 1 } as React.CSSProperties}
      onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      {photos.map((p, k) => (
        <Image key={p.imagen} src={p.imagen} alt={k === i ? `Foto de ${nombre}` : ''} fill priority={k === 0}
          sizes="(min-width: 1024px) 420px, 100vw" className={k === i ? 'on' : ''}
          style={{ objectPosition: FOCUS[p.enfoque] ?? FOCUS.centro }} />
      ))}
      {many && (
        <button type="button" className="photo-next" onClick={next} aria-label={`Ver otra foto (${i + 1} de ${photos.length})`} />
      )}
      <figcaption>
        <strong>{nombre}</strong>
        <span className="mono">{ubicacion}</span>
        {many && (
          <span className="photo-dots" aria-hidden="true">
            {photos.map((p, k) => <i key={p.imagen} className={k === i ? 'on' : ''} />)}
          </span>
        )}
      </figcaption>
    </figure>
  );
}
