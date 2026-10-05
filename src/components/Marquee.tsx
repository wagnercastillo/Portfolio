const HIGHLIGHT = new Set(['NestJS', 'Next.js', 'React', 'TensorFlow', 'Docker']);

export function Marquee({ items }: { items: string[] }) {
  // contenido duplicado para que el bucle de -50% sea continuo
  const row = (k: string) => items.map((t) => <span key={k + t}>{HIGHLIGHT.has(t) ? <b>{t}</b> : t}</span>);
  return (
    <div className="card marquee" aria-label={`Tecnologías: ${items.join(', ')}`}>
      <div className="track" aria-hidden="true">{row('a')}{row('b')}</div>
    </div>
  );
}
