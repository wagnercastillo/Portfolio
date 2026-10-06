import Link from 'next/link';

// Se renderiza dentro del layout (site), que ya aporta .wrap, Header y Footer.
export default function NotFound() {
  return (
    <main className="card hero" style={{ minHeight: '70svh', justifyContent: 'center' }}>
      <p className="big" style={{ color: 'var(--accent)' }}>404</p>
      <h1 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 800 }}>Este proyecto no existe (todavía).</h1>
      <div><Link href="/" className="btn btn-accent">← Volver al inicio</Link></div>
    </main>
  );
}
