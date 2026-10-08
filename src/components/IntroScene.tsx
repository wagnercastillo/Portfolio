import { dots, ridge } from '@/lib/scene';
import { IntroMotion } from './IntroMotion';

// Escena fija: se genera en el servidor (determinista) y solo se anima con variables CSS.
const STARS = [
  dots(11, 70, { yMin: 0, yMax: 62, size: [0.4, 0.9], colors: ['#ffffff', '#cfd8ff'] }),
  dots(12, 40, { yMin: 0, yMax: 55, size: [0.8, 1.3], colors: ['#ffffff', '#ffe9b0'] }),
  dots(13, 18, { yMin: 2, yMax: 45, size: [1.2, 1.8], colors: ['#ffffff'] }),
];
const CITY = dots(21, 260, { yMin: 66, yMax: 84, size: [0.6, 1.6], colors: ['#ffcf70', '#ffb347', '#fff1c2', '#ffd98a', '#9fd3ff'] });
const BACK = ridge(31, { base: 230, amp: 120, points: 18 });
const MID = ridge(32, { base: 290, amp: 110, points: 26 });
const FRONT = ridge(33, { base: 340, amp: 80, points: 34 });

export function IntroScene({ nombre, rol, ubicacion }: { nombre: string; rol: string; ubicacion: string }) {
  const [first, ...rest] = nombre.split(' ');
  return (
    <section className="intro" aria-label={`Portada: ${nombre}, ${ubicacion}`}>
      <div className="intro-stage">
        <div className="in-sky" aria-hidden="true" />
        <i className="in-stars s1" style={{ boxShadow: STARS[0] }} aria-hidden="true" />
        <i className="in-stars s2" style={{ boxShadow: STARS[1] }} aria-hidden="true" />
        <i className="in-stars s3" style={{ boxShadow: STARS[2] }} aria-hidden="true" />
        <div className="in-moon" aria-hidden="true" />
        <svg className="in-layer in-back" viewBox="0 0 1440 400" preserveAspectRatio="none" aria-hidden="true"><path d={BACK} /></svg>
        <svg className="in-layer in-mid" viewBox="0 0 1440 400" preserveAspectRatio="none" aria-hidden="true"><path d={MID} /></svg>
        <i className="in-city" style={{ boxShadow: CITY }} aria-hidden="true" />
        <div className="in-name">
          <span className="in-kicker">{rol}</span>
          <p>{first}<br />{rest.join(' ')}</p>
          <span className="in-place">{ubicacion}</span>
        </div>
        <div className="in-front" aria-hidden="true">
          <svg viewBox="0 0 1440 400" preserveAspectRatio="none"><path d={FRONT} /></svg>
          <i className="in-ground" />
        </div>
        <div className="in-fog" aria-hidden="true" />
        <a href="#top" className="in-hint">Desliza <span aria-hidden="true">↓</span></a>
      </div>
      <IntroMotion />
    </section>
  );
}
