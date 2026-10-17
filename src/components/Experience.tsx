'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { Perfil } from '@/lib/content';
import type { Project } from '@/lib/projects';
import { localize } from '@/lib/i18n';
import { useT } from './useT';
import { estiloDe, fmtMes, mesesTrabajados, parsePeriodo, proyectosDe, type Estilo } from '@/lib/experience';

const COLOR: Record<Estilo, string> = { t4s: '#41A3EB', jep: '#231f20', unl: '#0d2b52', base: 'var(--accent)' };
const JEP_FRANJA = ['#1f9a48', '#1b5e3a', '#8a6a4a', '#f08a3c', '#f2c230', '#231f20'];

type Job = Perfil['experiencia'][number] & { estilo: Estilo; from: string; to: string; meses: number | null; projs: Project[]; stack: string[] };
interface Body { el: HTMLElement; w: number; h: number; x: number; y: number; a: number; vx: number; vy: number; va: number; drag: boolean; target: { x: number; y: number } | null }

/** Credencial con el diseño de cada empresa (JEP replica el carnet real). */
function Badge({ j, nombre }: { j: Job; nombre: string }) {
  const t = useT();
  if (j.estilo === 't4s') return (
    <div className="bd-t4s">
      <span className="slot" />
      <span className="lg"><img src="/experiencia/t4s.svg" alt="Teams4Soft" draggable={false} /></span>
      <div className="ph" />
      <h4>{nombre}</h4>
      <div className="rl">&lt;{j.cargo} /&gt;</div>
      <div className="ft"><span>{j.from} — {j.to}</span><span className="qr" /></div>
    </div>
  );
  if (j.estilo === 'jep') return (
    <div className="bd-jep-case">
      <div className="bd-jep">
        <div className="hd"><span className="mk">JEP</span><i /><span>Juventud<br />Ecuatoriana<br />Progresista</span></div>
        <div className="ph"><div /></div>
        <h4>{nombre}</h4>
        <div className="rl">{j.cargo}</div>
        <div className="st">{JEP_FRANJA.map((c) => <b key={c} style={{ background: c }} />)}</div>
      </div>
    </div>
  );
  if (j.estilo === 'unl') return (
    <div className="bd-unl">
      <div className="hd"><img src="/experiencia/unl-logo.png" alt="Universidad Nacional de Loja" draggable={false} /></div>
      <div className="tri"><b style={{ background: '#1e7a3c' }} /><b style={{ background: '#fff' }} /><b style={{ background: '#b3202a' }} /></div>
      <div className="bd">
        <div className="ph" />
        <div><small>{t.exp.name}</small><h4>{nombre}</h4><small>{t.exp.role}</small><div className="rl">{j.cargo}</div><small>{t.exp.period}</small><div className="rl">{j.from} – {j.to}</div></div>
      </div>
      <div className="ft"><span className="sig">{nombre.split(' ').map((w, i, a) => (i < a.length - 1 ? `${w[0]}.` : w)).join(' ')}</span><span className="seal" /></div>
    </div>
  );
  return (
    <div className="bd-base">
      <div className="band"><span>{j.empresa}</span></div>
      <div className="ph" />
      <h4>{nombre}</h4>
      <div className="rl">{j.cargo}</div>
      <span className="label">{j.from} – {j.to}</span>
    </div>
  );
}

/**
 * Experiencia como credenciales sobre un escritorio: se arrastran y lanzan con inercia, rebotan y chocan.
 * Clic (o Enter) abre la ficha con logros, stack y proyectos de esa empresa. En móvil / movimiento reducido no hay física.
 */
export function Experience({ perfil, projects }: { perfil: Perfil; projects: Project[] }) {
  const t = useT();
  const jobs = useMemo<Job[]>(() => perfil.experiencia.map((x) => {
    const { from, to } = parsePeriodo(x.periodo);
    const projs = proyectosDe(x.empresa, projects);
    return { ...x, estilo: estiloDe(x.empresa), from: fmtMes(from, t.lang), to: fmtMes(to, t.lang), meses: mesesTrabajados(x.periodo), projs, stack: [...new Set(projs.flatMap((p) => p.stack))].slice(0, 8) };
  }), [perfil.experiencia, projects, t.lang]);
  const [sel, setSel] = useState<number | null>(null);
  const desk = useRef<HTMLDivElement>(null);
  const cards = useRef<(HTMLButtonElement | null)[]>([]);
  const bodies = useRef<Body[]>([]);
  const dragged = useRef(false);
  const kick = useRef<() => void>(() => {});

  useEffect(() => {
    const dk = desk.current;
    if (!dk || innerWidth <= 680 || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const els = cards.current.filter((e): e is HTMLButtonElement => !!e);
    const n = els.length;
    bodies.current = els.map((el, i) => ({
      el, w: el.offsetWidth, h: el.offsetHeight, x: (dk.clientWidth - el.offsetWidth) * (n > 1 ? i / (n - 1) : .5), y: 30 + (i % 2) * 60,
      a: [-12, 7, -5, 10][i % 4], vx: 0, vy: 0, va: 0, drag: false, target: null,
    }));
    let raf = 0, z = 10;
    const B = bodies.current;
    const step = () => {
      const W = dk.clientWidth, H = dk.clientHeight;
      let awake = false;
      for (const b of B) {
        if (b.target) { // la seleccionada viaja al centro y se endereza (resorte)
          b.vx = (b.vx + (b.target.x - b.x) * .08) * .72; b.vy = (b.vy + (b.target.y - b.y) * .08) * .72; b.va = (b.va - b.a * .08) * .72;
        } else if (!b.drag) { b.vx *= .94; b.vy *= .94; b.va *= .9; }
        if (!b.drag) { b.x += b.vx; b.y += b.vy; b.a += b.va; }
        const mx = W - b.w, my = H - b.h * .75;
        if (b.x < 0) { b.x = 0; b.vx = -b.vx * .55; b.va += b.vy * .3; }
        if (b.x > mx) { b.x = mx; b.vx = -b.vx * .55; b.va -= b.vy * .3; }
        if (b.y < -30) { b.y = -30; b.vy = -b.vy * .55; b.va -= b.vx * .3; }
        if (b.y > my) { b.y = my; b.vy = -b.vy * .55; b.va += b.vx * .3; }
        b.el.style.transform = `translate3d(${b.x}px,${b.y}px,0) rotate(${b.a}deg)`;
        if (b.drag || Math.abs(b.vx) + Math.abs(b.vy) + Math.abs(b.va) > .03) awake = true;
      }
      // choques: círculos aproximados, se empujan entre sí
      for (let i = 0; i < n; i++) for (let k = i + 1; k < n; k++) {
        const p = B[i], q = B[k], dx = q.x - p.x, dy = q.y - p.y, d = Math.hypot(dx, dy) || 1, min = 170;
        if (d >= min) continue;
        const f = (min - d) / d * .125;
        if (!p.drag && !p.target) { p.vx -= dx * f; p.vy -= dy * f; p.va -= dy * f * .2; }
        if (!q.drag && !q.target) { q.vx += dx * f; q.vy += dy * f; q.va += dy * f * .2; }
        awake = true;
      }
      raf = awake ? requestAnimationFrame(step) : 0; // duerme cuando todo está quieto
    };
    kick.current = () => { if (!raf) raf = requestAnimationFrame(step); };

    const offs = B.map((b) => {
      let sx = 0, sy = 0, ox = 0, oy = 0, lx = 0, ly = 0, lt = 0;
      const down = (e: PointerEvent) => {
        if (e.button !== 0) return;
        b.el.setPointerCapture(e.pointerId); b.drag = true; b.target = null; dragged.current = false;
        b.el.classList.add('drag'); b.el.style.zIndex = String(++z);
        sx = lx = e.clientX; sy = ly = e.clientY; lt = performance.now(); ox = e.clientX - b.x; oy = e.clientY - b.y; b.vx = b.vy = 0;
        kick.current();
      };
      const move = (e: PointerEvent) => {
        if (!b.drag) return;
        if (Math.hypot(e.clientX - sx, e.clientY - sy) > 5) dragged.current = true;
        const now = performance.now(), dt = Math.max(now - lt, 1) / 16;
        b.vx = (e.clientX - lx) / dt; b.vy = (e.clientY - ly) / dt;
        b.x = e.clientX - ox; b.y = e.clientY - oy;
        b.a += b.vx * .35 - b.a * .08; // se ladea hacia donde la arrastras
        lx = e.clientX; ly = e.clientY; lt = now;
      };
      const up = () => { if (!b.drag) return; b.drag = false; b.el.classList.remove('drag'); b.va = b.vx * .25; kick.current(); };
      b.el.addEventListener('pointerdown', down);
      b.el.addEventListener('pointermove', move);
      b.el.addEventListener('pointerup', up);
      b.el.addEventListener('pointercancel', up);
      return () => { b.el.removeEventListener('pointerdown', down); b.el.removeEventListener('pointermove', move); b.el.removeEventListener('pointerup', up); b.el.removeEventListener('pointercancel', up); };
    });
    addEventListener('resize', kick.current);
    kick.current();
    return () => { cancelAnimationFrame(raf); offs.forEach((f) => f()); removeEventListener('resize', kick.current); B.forEach((b) => { b.el.style.transform = ''; }); };
  }, [jobs]);

  // al seleccionar, la credencial viaja al centro del escritorio; al cerrar, gira un poco y queda libre
  useEffect(() => {
    const B = bodies.current, dk = desk.current;
    if (!B.length || !dk) return;
    const t = setTimeout(() => {
      B.forEach((b, i) => {
        if (i === sel) { b.target = { x: (dk.clientWidth - b.w) / 2, y: 40 }; b.el.style.zIndex = '99'; }
        else if (b.target) { b.target = null; b.va = (Math.random() - .5) * 6; }
      });
      kick.current();
    }, 120);
    return () => clearTimeout(t);
  }, [sel]);

  useEffect(() => {
    if (sel === null) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setSel(null); };
    addEventListener('keydown', onKey);
    return () => removeEventListener('keydown', onKey);
  }, [sel]);

  const j = sel === null ? null : jobs[sel];
  return (
    <section id="experiencia" aria-labelledby="exp-t" className="exp" style={{ '--foto': perfil.foto ? `url(${perfil.foto})` : 'none' } as React.CSSProperties}>
      <h2 id="exp-t" className="section-title reveal scramble" style={{ margin: '32px 4px 0' }}>{t.exp.title}</h2>
      <div className={`exp-stage reveal${j ? ' open' : ''}`}>
        <div className="exp-desk" ref={desk}>
          {jobs.map((x, i) => (
            <button
              key={`${x.empresa}-${x.periodo}`} type="button" ref={(el) => { cards.current[i] = el; }}
              className={`exp-card${sel === i ? ' sel' : ''}`} aria-expanded={sel === i} aria-controls="exp-panel"
              aria-label={t.exp.cardAria(x.cargo, x.empresa, `${x.from} – ${x.to}`)}
              onClick={() => { if (dragged.current) { dragged.current = false; return; } setSel(sel === i ? null : i); }}
            >
              <span className="strap" data-e={x.estilo} /><span className="clip" />
              <span className="lift"><Badge j={x} nombre={perfil.nombre} /></span>
            </button>
          ))}
          <span className="exp-tip" aria-hidden="true">{t.exp.tip}</span>
        </div>
        <aside id="exp-panel" className="exp-panel" aria-live="polite" inert={!j}>
          {j && (
            <div key={sel} style={{ '--c': COLOR[j.estilo] } as React.CSSProperties}>
              <div className="p-head">
                <div className="top">
                  {j.estilo === 't4s' ? <span className="plogo"><img src="/experiencia/t4s.svg" alt="Teams4Soft" /></span>
                    : j.estilo === 'unl' ? <img src="/experiencia/unl-logo.png" alt="Universidad Nacional de Loja" style={{ height: 44 }} />
                    : j.estilo === 'jep' ? <span className="pname"><span className="jep-mk">JEP</span>Cooperativa JEP</span>
                    : <span className="pname">{j.empresa}</span>}
                  <button type="button" className="x" aria-label={t.exp.close} onClick={() => setSel(null)}>✕</button>
                </div>
                <h3>{j.cargo}</h3>
                <div className="sub">{j.empresa}</div>
                <div className="pills">
                  <span>{j.from} → {j.to}</span>
                  {j.meses && <span>{t.exp.months_n(j.meses)}</span>}
                  <span>{t.exp.logros_n(j.logros.length)}</span>
                </div>
              </div>
              <div className="p-sec">
                <h4 className="label">{t.exp.logros}</h4>
                <ol className="logros">{j.logros.map((l, i) => <li key={l} style={{ '--i': i } as React.CSSProperties}><i>{String(i + 1).padStart(2, '0')}</i><span>{l}</span></li>)}</ol>
              </div>
              {j.stack.length > 0 && (
                <div className="p-sec"><h4 className="label">Stack</h4><div className="stack">{j.stack.map((s) => <span key={s}>{s}</span>)}</div></div>
              )}
              {j.projs.length > 0 && (
                <div className="p-sec">
                  <h4 className="label">{t.exp.here} · {j.projs.length}</h4>
                  <div className="projs">
                    {j.projs.map((p) => (
                      <Link key={p.slug} href={localize(t.lang, `/proyectos/${p.slug}`)} className="proj">
                        <span className="im">{p.portada ? <Image src={p.portada} alt="" width={320} height={200} sizes="210px" /> : p.titulo.split(' ')[0]}</span>
                        <b>{p.titulo}</b><small>{t.terms[p.estado] ?? p.estado}</small>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </aside>
      </div>
      <div className="exp-edu reveal">
        {perfil.educacion.map((e) => <span key={e.titulo}><span className="label">{/certific/i.test(e.titulo) ? t.exp.certs : t.exp.edu}</span>{e.titulo} — {e.detalle}</span>)}
        {perfil.idiomas && <span><span className="label">{t.exp.langs}</span>{perfil.idiomas}</span>}
      </div>
    </section>
  );
}
