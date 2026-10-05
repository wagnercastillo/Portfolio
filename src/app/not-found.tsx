import Link from 'next/link';
import { Header } from '@/components/Header';

export default function NotFound() {
  return (
    <div className="wrap">
      <Header />
      <main className="card hero" style={{ minHeight: '70svh', justifyContent: 'center' }}>
        <p className="big" style={{ color: 'var(--accent)' }}>404</p>
        <h1 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 800 }}>Este proyecto no existe (todavía).</h1>
        <div><Link href="/" className="btn btn-accent">← Volver al inicio</Link></div>
      </main>
    </div>
  );
}
