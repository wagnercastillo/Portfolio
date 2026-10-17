'use client';
import Link from 'next/link';
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';

const FRASE = 'Este proyecto no existe (todavía).';
const KEY = '404-juego';
const N_BUGS = 8;

/**
 * 404 jugable: cada visita muestra el siguiente de tres juegos (breakout, caza de bugs, letras con gravedad).
 * El turno se guarda en localStorage; sin él, se elige al azar. Sin JS o con movimiento reducido queda el 404 estático.
 */
// turno elegido una vez por carga de página (estable entre renders); la siguiente visita avanza al próximo juego
let turno: number | null | undefined;
const elegir = () => {
  if (turno !== undefined) return turno;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return (turno = null);
  try { turno = ((Number(localStorage.getItem(KEY)) || 0) + 1) % 3; localStorage.setItem(KEY, String(turno)); }
  catch { turno = Math.floor(Math.random() * 3); }
  return turno;
};
const noSub = () => () => {};

export function NotFoundGames() {
  const game = useSyncExternalStore(noSub, elegir, () => null);

  return (
    <main className="card nf">
      {game === 0 ? <Breakout /> : game === 1 ? <Bugs /> : game === 2 ? <Gravity /> : (
        <div className="nf-static">
          <p className="big" style={{ color: 'var(--accent)' }}>404</p>
          <h1>{FRASE}</h1>
          <div><Link href="/" className="btn btn-accent">← Volver al inicio</Link></div>
        </div>
      )}
    </main>
  );
}

const Home = ({ soft }: { soft?: boolean }) => <Link href="/" className={`btn ${soft ? 'btn-soft' : 'btn-accent'}`}>← Volver al inicio</Link>;

/* ---------- 1 · Breakout: el 404 hecho de ladrillos ---------- */
const DIGITS: Record<string, string[]> = { '4': ['101', '101', '111', '001', '001'], '0': ['111', '101', '101', '101', '111'] };

function Breakout() {
  const cv = useRef<HTMLCanvasElement>(null);
  const [hud, setHud] = useState('♥♥♥ · 0 pts');
  const [msg, setMsg] = useState<{ t: string; p: string; again: boolean } | null>({ t: '404', p: '¿Lo arreglamos rompiéndolo?', again: false });
  const startRef = useRef<() => void>(() => {});

  useEffect(() => {
    const c = cv.current!, ctx = c.getContext('2d')!;
    let W = 0, H = 0, px = 0, raf = 0, lives = 3, pts = 0;
    let bricks: { x: number; y: number; s: number; hit: boolean }[] = [];
    let ball = { x: 0, y: 0, vx: 0, vy: 0, r: 8 };
    const css = getComputedStyle(c), accent = css.getPropertyValue('--accent').trim() || '#2346E0', fg = css.getPropertyValue('--fg').trim() || '#0E1116';
    const size = () => {
      const r = c.getBoundingClientRect();
      c.width = r.width * devicePixelRatio; c.height = r.height * devicePixelRatio; ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
      W = r.width; H = r.height;
    };
    const build = () => {
      const s = Math.min(34, (W - 40) / 12 - 4), g = 4, x0 = W / 2 - (11 * (s + g)) / 2, y0 = 70;
      bricks = [];
      ['4', '0', '4'].forEach((d, k) => DIGITS[d].forEach((row, r) => [...row].forEach((on, col) => {
        if (on === '1') bricks.push({ x: x0 + (k * 4 + col) * (s + g), y: y0 + r * (s + g), s, hit: false });
      })));
    };
    const serve = () => { ball = { x: W / 2, y: H - 70, vx: 3.2 * (Math.random() > .5 ? 1 : -1), vy: -4.4, r: 8 }; };
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = accent;
      for (const b of bricks) if (!b.hit) { ctx.beginPath(); ctx.roundRect(b.x, b.y, b.s, b.s, 6); ctx.fill(); }
      ctx.beginPath(); ctx.arc(ball.x, ball.y, ball.r, 0, 7); ctx.fill();
      ctx.fillStyle = fg; ctx.beginPath(); ctx.roundRect(px - 60, H - 36, 120, 12, 6); ctx.fill();
    };
    const end = (t: string, p: string) => { cancelAnimationFrame(raf); draw(); setMsg({ t, p, again: true }); };
    const step = () => {
      ball.x += ball.vx; ball.y += ball.vy;
      if (ball.x < ball.r || ball.x > W - ball.r) ball.vx *= -1;
      if (ball.y < ball.r) ball.vy *= -1;
      if (ball.vy > 0 && ball.y > H - 36 - ball.r && ball.y < H - 24 && Math.abs(ball.x - px) < 66) { ball.vy = -Math.abs(ball.vy) * 1.02; ball.vx = (ball.x - px) / 12; }
      for (const b of bricks) {
        if (b.hit || ball.x < b.x - ball.r || ball.x > b.x + b.s + ball.r || ball.y < b.y - ball.r || ball.y > b.y + b.s + ball.r) continue;
        b.hit = true; pts += 10;
        // rebota por el lado de menor penetración
        if (Math.min(ball.x - b.x, b.x + b.s - ball.x) < Math.min(ball.y - b.y, b.y + b.s - ball.y)) ball.vx *= -1; else ball.vy *= -1;
        break;
      }
      if (ball.y > H + 20) { lives--; if (!lives) return end('Game over', 'El 404 sigue ahí. ¿Revancha?'); serve(); }
      if (bricks.every((b) => b.hit)) return end('Error resuelto ✓', `${pts} pts. Ahora sí, vuelve al inicio.`);
      setHud(`${'♥'.repeat(lives)}${'♡'.repeat(3 - lives)} · ${pts} pts`);
      draw(); raf = requestAnimationFrame(step);
    };
    startRef.current = () => { size(); build(); serve(); lives = 3; pts = 0; px = W / 2; setMsg(null); cancelAnimationFrame(raf); step(); };
    const move = (e: PointerEvent) => { const r = c.getBoundingClientRect(); px = Math.max(60, Math.min(W - 60, e.clientX - r.left)); };
    c.addEventListener('pointermove', move);
    size(); build(); px = W / 2; ball = { ...ball, x: W / 2, y: H - 70 }; draw();
    return () => { cancelAnimationFrame(raf); c.removeEventListener('pointermove', move); };
  }, []);

  return (
    <>
      <canvas ref={cv} className="nf-canvas" aria-label="Juego: rompe el 404 con la pelota" />
      <div className="nf-hud"><h1 className="label">{FRASE}</h1><b>{hud}</b></div>
      {msg && (
        <div className="nf-msg bottom"><div>
          <p className="nf-title">{msg.t}</p><p>{msg.p}</p>
          <div className="nf-btns"><button type="button" className="btn btn-accent" onClick={() => startRef.current()}>▶ {msg.again ? 'Jugar otra vez' : 'Jugar'}</button><Home soft /></div>
        </div></div>
      )}
    </>
  );
}

/* ---------- 2 · Caza los bugs: aplástalos todos y el 404 pasa a 200 OK ---------- */
interface Bug { x: number; y: number; a: number; v: number; dead: boolean }

function Bugs() {
  const box = useRef<HTMLDivElement>(null);
  const els = useRef<(HTMLButtonElement | null)[]>([]);
  const bugs = useRef<Bug[]>([]);
  const [dead, setDead] = useState<number[]>([]);
  const [round, setRound] = useState(0);
  const [splats, setSplats] = useState<{ x: number; y: number }[]>([]);
  const killed = dead.length, won = killed === N_BUGS;

  useEffect(() => {
    const b = box.current!;
    bugs.current = Array.from({ length: N_BUGS }, () => ({ x: Math.random() * (b.clientWidth - 40), y: 70 + Math.random() * (b.clientHeight - 110), a: Math.random() * 6.28, v: 1.2 + Math.random() * 1.4, dead: false }));
    let raf = 0;
    const loop = () => {
      const W = b.clientWidth, H = b.clientHeight;
      bugs.current.forEach((g, i) => {
        if (g.dead) return;
        g.a += (Math.random() - .5) * .35; g.x += Math.cos(g.a) * g.v; g.y += Math.sin(g.a) * g.v;
        if (g.x < 0 || g.x > W - 34) { g.a = Math.PI - g.a; g.x = Math.max(0, Math.min(W - 34, g.x)); }
        if (g.y < 60 || g.y > H - 34) { g.a = -g.a; g.y = Math.max(60, Math.min(H - 34, g.y)); }
        const el = els.current[i];
        if (el) el.style.transform = `translate(${g.x}px,${g.y}px) rotate(${g.a * 57.3 + 90}deg)`;
      });
      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => cancelAnimationFrame(raf);
  }, [round]);

  const squash = (i: number) => {
    const g = bugs.current[i];
    if (g.dead) return;
    g.dead = true;
    bugs.current.forEach((o) => { if (!o.dead) o.v *= 1.12; }); // los que quedan se asustan y corren más
    setSplats((s) => [...s, { x: g.x + 17, y: g.y + 17 }]);
    setDead((d) => [...d, i]);
  };
  const again = () => { setDead([]); setSplats([]); setRound((r) => r + 1); };

  return (
    <div className="nf-bugs" ref={box}>
      <div className="nf-hud"><span className="label">{won ? 'build exitoso' : 'depurando…'}</span><b>{killed} / {N_BUGS} bugs</b></div>
      <p className={`nf-code${won ? ' ok' : ''}`}>{won ? '200 OK' : '404'}</p>
      <h1 className="nf-h">{won ? 'Bugs arreglados. La página sigue sin existir, pero tú sí sabes depurar.' : FRASE}</h1>
      <div className="nf-bar"><i style={{ width: `${(killed / N_BUGS) * 100}%` }} /></div>
      <div className="nf-btns center"><Home soft={!won} />{won && <button type="button" className="btn btn-soft" onClick={again}>Otra vez</button>}</div>
      {splats.map((s, i) => <i key={`${round}-${i}`} className="nf-splat" style={{ left: s.x, top: s.y }} />)}
      {Array.from({ length: N_BUGS }, (_, i) => !dead.includes(i) && (
        <button key={`${round}-${i}`} type="button" className="nf-bug" ref={(el) => { els.current[i] = el; }} aria-label="Aplastar bug" onPointerDown={() => squash(i)}>
          <svg viewBox="0 0 34 34" aria-hidden="true">
            <g className="legs"><path d="M9 12 3 9M9 17H2M9 22l-6 3M25 12l6-3M25 17h7M25 22l6 3" /></g>
            <ellipse cx="17" cy="19" rx="8" ry="10" fill="#d23c3c" /><circle cx="17" cy="9" r="5" />
            <path d="M17 10v18" strokeWidth="1.5" /><circle cx="14" cy="17" r="1.6" /><circle cx="20" cy="22" r="1.6" />
          </svg>
        </button>
      ))}
      {won && Array.from({ length: 60 }, (_, i) => (
        <i key={`c${round}-${i}`} className="nf-conf" style={{ left: `${(i * 37) % 100}%`, background: ['var(--accent)', '#18A058', '#f2c230', '#d23c3c'][i % 4], animationDuration: `${1.5 + (i % 7) * .2}s`, animationDelay: `${(i % 5) * .08}s` }} />
      ))}
    </div>
  );
}

/* ---------- 3 · El error se derrumba: letras con gravedad que se arrastran y lanzan ---------- */
interface Letter { el: HTMLSpanElement; w: number; h: number; x: number; y: number; a: number; vx: number; vy: number; va: number; drag: boolean; t: number }

function Gravity() {
  const box = useRef<HTMLDivElement>(null);
  const [round, setRound] = useState(0);

  useEffect(() => {
    const b = box.current!, W = b.clientWidth, now0 = performance.now();
    const L: Letter[] = [];
    const add = (ch: string, cls: string, x: number, y: number, delay: number) => {
      const el = document.createElement('span');
      el.className = `nf-ltr ${cls}`; el.textContent = ch; el.setAttribute('aria-hidden', 'true'); b.appendChild(el);
      const l: Letter = { el, w: el.offsetWidth, h: el.offsetHeight, x, y, a: 0, vx: (Math.random() - .5) * 2, vy: 0, va: (Math.random() - .5) * 3, drag: false, t: now0 + delay + Math.random() * 600 };
      let ox = 0, oy = 0, lx = 0, ly = 0;
      el.onpointerdown = (e) => { el.setPointerCapture(e.pointerId); l.drag = true; l.t = 0; ox = e.clientX - l.x; oy = e.clientY - l.y; lx = e.clientX; ly = e.clientY; };
      el.onpointermove = (e) => { if (!l.drag) return; l.vx = e.clientX - lx; l.vy = e.clientY - ly; l.x = e.clientX - ox; l.y = e.clientY - oy; l.a += l.vx * .4; lx = e.clientX; ly = e.clientY; };
      el.onpointerup = () => { l.drag = false; l.va = l.vx * .6; };
      L.push(l);
    };
    // cada letra se coloca según su ancho real, centrando la línea completa
    const line = (txt: string, cls: string, y: number, delay: number) => {
      const probe = document.createElement('span'); probe.className = `nf-ltr ${cls}`; probe.style.visibility = 'hidden'; b.appendChild(probe);
      const ws = [...txt].map((c) => { probe.textContent = c === ' ' ? 'n' : c; return probe.offsetWidth * (c === ' ' ? .5 : 1); });
      probe.remove();
      let x = (W - ws.reduce((s, w) => s + w, 0)) / 2;
      [...txt].forEach((c, i) => { if (c !== ' ') add(c, cls, x, y, delay); x += ws[i]; });
    };
    const big = W < 520;
    line('404', 'd', 80, 300);
    line(big ? 'No existe' : 'Este proyecto no existe', 'w', big ? 230 : 260, 900);
    let raf = 0;
    const loop = () => {
      const H = b.clientHeight, Wn = b.clientWidth, now = performance.now();
      for (const l of L) {
        if (!l.drag && now > l.t) { l.vy += .55; l.vx *= .995; l.x += l.vx; l.y += l.vy; l.a += l.va; l.va *= .99; }
        if (l.y > H - l.h) { l.y = H - l.h; l.vy *= -.45; l.vx *= .8; l.va = l.vx * 1.5; if (Math.abs(l.vy) < 1) l.vy = 0; }
        if (l.x < 0) { l.x = 0; l.vx *= -.6; }
        if (l.x > Wn - l.w) { l.x = Wn - l.w; l.vx *= -.6; }
        l.el.style.transform = `translate(${l.x}px,${l.y}px) rotate(${l.a}deg)`;
      }
      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => { cancelAnimationFrame(raf); L.forEach((l) => l.el.remove()); };
  }, [round]);

  return (
    <div className="nf-grav" ref={box}>
      <div className="nf-hud">
        <h1 className="label"><span className="sr-only">404 · {FRASE} </span>Arrastra y lanza las letras</h1>
        <span className="nf-btns"><button type="button" className="btn btn-soft" onClick={() => setRound((r) => r + 1)}>↺ Reordenar</button><Home /></span>
      </div>
    </div>
  );
}
