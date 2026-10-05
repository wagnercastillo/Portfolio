'use client';
import { useEffect, useRef, useState } from 'react';

const KONAMI = ['arrowup', 'arrowup', 'arrowdown', 'arrowdown', 'arrowleft', 'arrowright', 'arrowleft', 'arrowright', 'b', 'a'];

function confetti() {
  const cv = Object.assign(document.createElement('canvas'), { className: 'confetti', width: innerWidth, height: innerHeight });
  document.body.append(cv);
  const ctx = cv.getContext('2d')!;
  const css = getComputedStyle(document.documentElement);
  const colors = [css.getPropertyValue('--accent'), css.getPropertyValue('--fg'), '#FF5B2E', '#7AA2FF'];
  const ps = Array.from({ length: 180 }, () => ({
    x: innerWidth / 2, y: innerHeight * 0.7, vx: (Math.random() - 0.5) * 18, vy: -Math.random() * 20 - 6,
    w: 6 + Math.random() * 6, h: 8 + Math.random() * 8, r: Math.random() * 6, vr: (Math.random() - 0.5) * 0.4,
    c: colors[(Math.random() * 4) | 0],
  }));
  const t0 = performance.now();
  const frame = (t: number) => {
    ctx.clearRect(0, 0, cv.width, cv.height);
    for (const p of ps) {
      p.vy += 0.45; p.vx *= 0.99; p.x += p.vx; p.y += p.vy; p.r += p.vr;
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r); ctx.fillStyle = p.c;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h); ctx.restore();
    }
    if (t - t0 < 3200) requestAnimationFrame(frame); else cv.remove();
  };
  requestAnimationFrame(frame);
}

/** Código Konami (↑↑↓↓←→←→BA) o 5 toques al logo: confeti + carta de Scrum Poker. */
export function EasterEgg() {
  const [show, setShow] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    const party = () => {
      setShow(false);
      requestAnimationFrame(() => setShow(true));
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setShow(false), 4200);
      if (!matchMedia('(prefers-reduced-motion: reduce)').matches) confetti();
    };
    let kp = 0;
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      kp = k === KONAMI[kp] ? kp + 1 : k === KONAMI[0] ? 1 : 0;
      if (kp === KONAMI.length) { kp = 0; party(); }
    };
    let taps = 0;
    let tapTimer: ReturnType<typeof setTimeout>;
    const onTap = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest('#logo')) return;
      clearTimeout(tapTimer);
      tapTimer = setTimeout(() => (taps = 0), 1500);
      if (++taps === 5) { taps = 0; party(); }
    };
    addEventListener('keydown', onKey);
    document.addEventListener('click', onTap);
    return () => { removeEventListener('keydown', onKey); document.removeEventListener('click', onTap); };
  }, []);

  return (
    <div className={`poker${show ? ' show' : ''}`} role="status" aria-live="polite">
      <div className="pc">13</div>
      {show && (
        <div>
          <div style={{ fontWeight: 800, fontSize: 17 }}>Modo dev desbloqueado</div>
          <div className="mono" style={{ fontSize: 12, opacity: 0.7, marginTop: 4 }}>Estimación: 13 puntos de pura curiosidad.</div>
        </div>
      )}
    </div>
  );
}
