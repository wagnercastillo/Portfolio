import { getT } from '@/lib/i18n-server';
import { HeroPhotos } from './HeroPhotos';
import type { Perfil } from '@/lib/content';

const v = (name: string, n: number) => ({ [name]: n }) as React.CSSProperties;

export async function Hero({ perfil, total }: { perfil: Perfil; total: number }) {
  const t = await getT();
  const WORDS = t.hero.words;
  return (
    <section id="top" className="grid">
      <div className="card hero span2 spot">
        <div className="badge"><span className="dot" />{t.hero.available} · {perfil.ubicacion}</div>
        <div>
          <h1 aria-label={`${WORDS.join(' ')} ${t.hero.last}`}>
            {WORDS.map((w, i) => (
              <span key={w} aria-hidden="true"><span className="w"><span style={v('--i', i)}>{w}</span></span>{' '}</span>
            ))}
            <span className="w" aria-hidden="true"><span className="accent" style={v('--i', WORDS.length)}>{t.hero.last}</span></span>
          </h1>
          <p className="hero-bio">{perfil.bio}</p>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          <a href="#proyectos" className="btn btn-accent magnet">{t.hero.seeProjects} <span className="arr">→</span></a>
          <a href="#contacto" className="btn btn-soft magnet">{t.hero.contact}</a>
        </div>
      </div>
      <div className="hero-side">
        {perfil.foto && (
          <HeroPhotos photos={[{ imagen: perfil.foto, enfoque: 'arriba' }, ...perfil.galeria]} nombre={perfil.nombre} ubicacion={perfil.ubicacion} />
        )}
        <div className="hero-stats">
          <div className="card stat inv reveal" style={v('--d', 2)}>
            <span className="label">{t.hero.projects}</span>
            <span className="big" data-count={total}>{total}</span>
          </div>
          <div className="card stat acc reveal" style={v('--d', 3)}>
            <span className="label">{t.hero.industries}</span>
            <span style={{ fontSize: 18, fontWeight: 700, lineHeight: 1.25 }}>{t.hero.industriesList}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
