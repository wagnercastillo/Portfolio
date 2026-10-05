import type { Perfil } from '@/lib/content';
import type { Project } from '@/lib/projects';

export function StackSection({ habilidades, projects }: { habilidades: Perfil['habilidades']; projects: Project[] }) {
  const clientes = [...new Set(projects.map((p) => p.cliente).filter(Boolean))];
  return (
    <section id="stack" className="grid" style={{ marginTop: 32 }} aria-labelledby="stack-t">
      <div className="card span2 reveal" style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 24 }}>
        <h2 id="stack-t" className="scramble" style={{ fontSize: 28, fontWeight: 800 }}>Stack</h2>
        {habilidades.map((h) => (
          <div key={h.grupo}>
            <h3 className="label" style={{ marginBottom: 12 }}>{h.grupo}</h3>
            <ul className="chips">{h.items.map((t) => <li key={t}>{t}</li>)}</ul>
          </div>
        ))}
      </div>
      <div className="card reveal" style={{ padding: 32, '--d': 1 } as React.CSSProperties}>
        <h3 className="label">He trabajado con</h3>
        <ul style={{ margin: '20px 0 0', padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 14, fontSize: 22, fontWeight: 700 }}>
          {clientes.map((c) => <li key={c}>{c}</li>)}
        </ul>
      </div>
    </section>
  );
}
