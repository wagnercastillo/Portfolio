import { getT } from '@/lib/i18n-server';
const HIGHLIGHT = new Set(['NestJS', 'Next.js', 'React', 'TensorFlow', 'Docker']);

export async function Marquee({ items }: { items: string[] }) {
  const t = await getT();
  // contenido duplicado para que el bucle de -50% sea continuo
  const row = (k: string) => items.map((t) => <span key={k + t}>{HIGHLIGHT.has(t) ? <b>{t}</b> : t}</span>);
  return (
    <div className="card marquee" role="region" aria-label={`${t.marquee}: ${items.join(', ')}`}>
      <div className="track" aria-hidden="true">{row('a')}{row('b')}</div>
    </div>
  );
}
