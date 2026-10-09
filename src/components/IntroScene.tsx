import { cityLights, dots, ridge } from '@/lib/scene';
import { IntroMotion } from './IntroMotion';

// Escena fija: se genera en el servidor (determinista) y solo se anima con variables CSS.
const STARS = [
  dots(11, 90, { yMin: 0, yMax: 62, size: [0.3, 0.8], colors: ['#ffffff', '#cfd8ff', '#aebcff'] }),
  dots(12, 45, { yMin: 0, yMax: 55, size: [0.7, 1.2], colors: ['#ffffff', '#ffe9b0'] }),
  dots(13, 16, { yMin: 2, yMax: 45, size: [1.1, 1.7], colors: ['#ffffff'] }),
];
const CITY = cityLights(21, 520, { yMin: 79, yMax: 88, spread: 22, size: [0.4, 1.1], colors: ['#ffcf70', '#ffb347', '#fff1c2', '#ffd98a', '#ffa64d', '#ffe6a8'] });
const CITY_BRIGHT = cityLights(22, 45, { yMin: 80, yMax: 87, spread: 16, size: [1.2, 1.9], colors: ['#fff4d6', '#ffcf70'] });
// estrellas fugaces en zonas libres del cielo (lejos del nombre); dx/dy en vw, la estela se orienta a su movimiento
const SHOOTING = [
  // → hacia la derecha
  { top: 13, left: 2, dx: 18, dy: 8, len: 170, dur: 11, delay: 3 },
  { top: 40, left: 86, dx: 10, dy: 4, len: 130, dur: 9.5, delay: 9 },
  { top: 22, left: 60, dx: 9, dy: 3, len: 110, dur: 16, delay: 14 },
  // ← hacia la izquierda (dx negativo: la estela gira sola hacia el otro lado)
  { top: 10, left: 92, dx: -16, dy: 6, len: 150, dur: 13, delay: 6.5 },
  { top: 34, left: 4, dx: -12, dy: 5, len: 140, dur: 15, delay: 1.2 },
  { top: 12, left: 50, dx: -10, dy: 2.5, len: 120, dur: 17, delay: 11 },
].map((s) => ({
  top: `${s.top}vh`, left: `${s.left}vw`, '--dx': `${s.dx}vw`, '--dy': `${s.dy}vw`, width: s.len,
  rotate: `${((Math.atan2(s.dy, s.dx) * 180) / Math.PI).toFixed(1)}deg`,
  animationDuration: `${s.dur}s`, animationDelay: `${s.delay}s`,
}) as React.CSSProperties);
// atardecer: franjas finas de nube (estratos) iluminadas desde abajo
const CLOUDS = [
  { top: '24vh', left: '-8vw', width: '58vw', height: '1.6vh', '--drift': '70s', '--o': 0.75 },
  { top: '31vh', left: '38vw', width: '70vw', height: '2.2vh', '--drift': '90s', '--o': 0.6 },
  { top: '38vh', left: '6vw', width: '46vw', height: '1.2vh', '--drift': '80s', '--o': 0.5 },
  { top: '17vh', left: '55vw', width: '40vw', height: '1vh', '--drift': '100s', '--o': 0.35 },
].map((c) => c as React.CSSProperties);
const FLOOR = ridge(34, { base: 120, amp: 28, points: 14 }); // suelo del valle donde se asienta la ciudad
const BACK = ridge(31, { base: 230, amp: 120, points: 18 });
const MID = ridge(32, { base: 295, amp: 110, points: 26 });
const FRONT = ridge(33, { base: 340, amp: 80, points: 34 });

// Colores por variables CSS (--r-<capa>-top/bottom/rim) para que día y noche tengan su paleta.
// Van en `style` porque los atributos de presentación SVG no aceptan var().
function Ridge({ layer, d }: { layer: 'back' | 'mid' | 'floor' | 'front'; d: string }) {
  const id = `r-${layer}`;
  return (
    <>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" style={{ stopColor: `var(--r-${layer}-top)` }} />
          <stop offset="1" style={{ stopColor: `var(--r-${layer}-bottom)` }} />
        </linearGradient>
      </defs>
      <path d={d} fill={`url(#${id})`} />
      {/* borde iluminado (luna de noche, sol de día) */}
      <path d={d} fill="none" style={{ stroke: `var(--r-${layer}-rim)` }} strokeWidth="1.4" vectorEffect="non-scaling-stroke" />
    </>
  );
}

export function IntroScene({ nombre, rol, ubicacion }: { nombre: string; rol: string; ubicacion: string }) {
  const words = nombre.split(' ');
  let n = 0;
  return (
    <section className="intro" aria-label={`Portada: ${nombre}, ${ubicacion}`}>
      <div className="intro-stage">
        <div className="in-sky" aria-hidden="true" />
        <div className="in-milky night" aria-hidden="true" />
        <i className="in-stars s1 night" style={{ boxShadow: STARS[0] }} aria-hidden="true" />
        <i className="in-stars s2 night" style={{ boxShadow: STARS[1] }} aria-hidden="true" />
        <i className="in-stars s3" style={{ boxShadow: STARS[2] }} aria-hidden="true" />
        {SHOOTING.map((style, i) => <i key={i} className="in-shoot night" style={style} aria-hidden="true" />)}
        <div className="in-moon night" aria-hidden="true" />
        {/* atardecer (modo claro): sol bajo y franjas de nube */}
        <div className="in-sun day" aria-hidden="true" />
        <div className="in-clouds day" aria-hidden="true">
          {CLOUDS.map((c, i) => <i key={i} className="in-cloud" style={c} />)}
        </div>
        <svg className="in-layer in-back" viewBox="0 0 1440 400" preserveAspectRatio="none" aria-hidden="true">
          <Ridge layer="back" d={BACK} />
        </svg>
        <div className="in-mist m1" aria-hidden="true" />
        <svg className="in-layer in-mid" viewBox="0 0 1440 400" preserveAspectRatio="none" aria-hidden="true">
          <Ridge layer="mid" d={MID} />
        </svg>
        <div className="in-valley" aria-hidden="true">
          <svg className="in-floor" viewBox="0 0 1440 400" preserveAspectRatio="none">
            <Ridge layer="floor" d={FLOOR} />
          </svg>
          <i className="in-glow" />
          <i className="in-city" style={{ boxShadow: CITY }} />
          <i className="in-city bright" style={{ boxShadow: CITY_BRIGHT }} />
        </div>
        <div className="in-mist m2" aria-hidden="true" />
        <div className="in-name">
          <span className="in-kicker">{rol}</span>
          <p aria-label={nombre}>
            {words.map((w, wi) => (
              <span key={wi} className="in-word" aria-hidden="true">
                {[...w].map((ch, ci) => <span key={ci} className="in-ch" style={{ '--i': n++ } as React.CSSProperties}>{ch}</span>)}
              </span>
            ))}
          </p>
          <span className="in-place">{ubicacion}</span>
        </div>
        <div className="in-front" aria-hidden="true">
          <svg viewBox="0 0 1440 400" preserveAspectRatio="none">
            <Ridge layer="front" d={FRONT} />
          </svg>
          <i className="in-ground" />
        </div>
        <div className="in-fog" aria-hidden="true" />
        <div className="in-grain" aria-hidden="true" />
        <a href="#top" className="in-hint">Desliza <span aria-hidden="true">↓</span></a>
      </div>
      <IntroMotion />
    </section>
  );
}
