'use client';
import { useEffect, useRef, useState } from 'react';
import { useT } from './useT';

/** Tablero de turnos "en vivo" de la tarjeta SGT. */
export function TurnoTicket() {
  const t = useT();
  const [n, setN] = useState(42);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = setInterval(() => {
      const el = ref.current;
      if (!el) return;
      el.classList.remove('flip');
      void el.offsetWidth;
      el.classList.add('flip');
      setTimeout(() => setN((v) => (v >= 99 ? 1 : v + 1)), 220);
    }, 2600);
    return () => clearInterval(id);
  }, []);
  return (
    <div style={{ textAlign: 'center' }} aria-hidden="true">
      <div className="label" style={{ letterSpacing: '.2em' }}>{t.turno.label}</div>
      <div className="ticket" ref={ref}>A-{String(n).padStart(3, '0')}</div>
      <div className="mono" style={{ fontSize: 13, color: 'var(--accent)', filter: 'brightness(1.4)' }}>→ {t.turno.window} {1 + (n % 5)}</div>
    </div>
  );
}
