'use client';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useInView } from './useInView';

/** Avatar con burbuja: "escribiendo…" y luego el saludo, al llegar a la sección. */
export function ContactChat({ foto, nombre }: { foto: string | null; nombre: string }) {
  const [ref, seen] = useInView<HTMLDivElement>();
  const [typing, setTyping] = useState(true);
  useEffect(() => {
    if (!seen) return;
    const t = setTimeout(() => setTyping(false), matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 1400);
    return () => clearTimeout(t);
  }, [seen]);
  const first = nombre.split(' ')[0];
  return (
    <div className="chat" ref={ref}>
      {foto && <Image src={foto} alt={`Foto de ${nombre}`} width={64} height={64} className="chat-avatar" />}
      <div className={`chat-bubble${seen ? ' on' : ''}`} aria-live="polite">
        {typing ? (
          <span className="typing" aria-label={`${first} está escribiendo`}><i /><i /><i /></span>
        ) : (
          <p>¡Hola! Soy {first}. Cuéntame qué quieres construir y te respondo personalmente, sin intermediarios.</p>
        )}
      </div>
    </div>
  );
}
