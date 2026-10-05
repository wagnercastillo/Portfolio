import type { Perfil } from '@/lib/content';

export function Experience({ perfil }: { perfil: Perfil }) {
  return (
    <section id="experiencia" aria-labelledby="exp-t" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <h2 id="exp-t" className="section-title reveal scramble" style={{ margin: '32px 4px 0' }}>Experiencia</h2>
      <div className="grid">
        {perfil.experiencia.map((x, i) => (
          <article key={`${x.empresa}-${x.periodo}`} className="card job spot reveal" style={{ '--d': i } as React.CSSProperties}>
            <span className="label">{x.periodo}</span>
            <div>
              <h3>{x.cargo}</h3>
              <div className="org">{x.empresa}</div>
            </div>
            <ul>{x.logros.map((l) => <li key={l}>{l}</li>)}</ul>
          </article>
        ))}
        <article className="card job edu reveal" style={{ '--d': perfil.experiencia.length } as React.CSSProperties}>
          <span className="label">Educación</span>
          {perfil.educacion.map((e) => (
            <div key={e.titulo}>
              <h3 style={{ fontSize: 20 }}>{e.titulo}</h3>
              <p style={{ margin: '6px 0 0', fontSize: 14 }}>{e.detalle}</p>
            </div>
          ))}
          {perfil.idiomas && (
            <div>
              <span className="label">Idiomas</span>
              <p style={{ margin: '6px 0 0', fontSize: 14 }}>{perfil.idiomas}</p>
            </div>
          )}
        </article>
      </div>
    </section>
  );
}
