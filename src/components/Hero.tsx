import { HeroPhotos } from './HeroPhotos';
import type { Perfil } from '@/lib/content';

const WORDS = ['Software', 'que', 'funciona', 'en'];
const v = (name: string, n: number) => ({ [name]: n }) as React.CSSProperties;

export function Hero({ perfil, total }: { perfil: Perfil; total: number }) {
  return (
    <section id="top" className="grid">
      <div className="card hero span2 spot">
        <div className="badge"><span className="dot" />Disponible para proyectos · {perfil.ubicacion}</div>
        <div>
          <h1 aria-label={`${WORDS.join(' ')} producción.`}>
            {WORDS.map((w, i) => (
              <span key={w} aria-hidden="true"><span className="w"><span style={v('--i', i)}>{w}</span></span>{' '}</span>
            ))}
            <span className="w" aria-hidden="true"><span className="accent" style={v('--i', WORDS.length)}>producción.</span></span>
          </h1>
          <p className="hero-bio">{perfil.bio}</p>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          <a href="#proyectos" className="btn btn-accent magnet">Ver proyectos <span className="arr">→</span></a>
          <a href="#contacto" className="btn btn-soft magnet">Contactar</a>
        </div>
      </div>
      <div className="hero-side">
        {perfil.foto && (
          <HeroPhotos photos={[{ imagen: perfil.foto, enfoque: 'arriba' }, ...perfil.galeria]} nombre={perfil.nombre} ubicacion={perfil.ubicacion} />
        )}
        <div className="hero-stats">
          <div className="card stat inv reveal" style={v('--d', 2)}>
            <span className="label">Proyectos</span>
            <span className="big" data-count={total}>{total}</span>
          </div>
          <div className="card stat acc reveal" style={v('--d', 3)}>
            <span className="label">Industrias</span>
            <span style={{ fontSize: 18, fontWeight: 700, lineHeight: 1.25 }}>Banca · Seguros · Energía · RRHH</span>
          </div>
        </div>
      </div>
    </section>
  );
}
