import Image from 'next/image';
import type { Perfil } from '@/lib/content';

export function Contact({ perfil }: { perfil: Perfil }) {
  const wa = perfil.telefono.replace(/\D/g, '');
  return (
    <section id="contacto" className="card contact reveal" aria-labelledby="ct">
      {perfil.foto && (
        <div className="avatar">
          <Image src={perfil.foto} alt="" width={72} height={72} />
          <span className="mono">Soy {perfil.nombre.split(' ')[0]}: hablarás directamente conmigo, sin intermediarios.</span>
        </div>
      )}
      <h2 id="ct" className="scramble">¿Construimos algo juntos?</h2>
      <p className="mono" style={{ margin: '16px 0 0', fontSize: 14, color: 'var(--inv-muted)' }}>{perfil.ubicacion}</p>
      <div style={{ marginTop: 40, display: 'flex', flexWrap: 'wrap', gap: 12 }}>
        <a href={`mailto:${perfil.email}`} className="btn btn-accent magnet" style={{ minHeight: 52, wordBreak: 'break-all' }}>{perfil.email}</a>
        {wa && <a href={`https://wa.me/${wa}`} target="_blank" rel="noopener noreferrer" className="btn btn-dark magnet" style={{ minHeight: 52 }}>WhatsApp ↗</a>}
        {perfil.linkedin && <a href={perfil.linkedin} target="_blank" rel="noopener noreferrer" className="btn btn-dark magnet" style={{ minHeight: 52 }}>LinkedIn ↗</a>}
        {perfil.github && <a href={perfil.github} target="_blank" rel="noopener noreferrer" className="btn btn-dark magnet" style={{ minHeight: 52 }}>GitHub ↗</a>}
        {perfil.cv && <a href={perfil.cv} download className="btn btn-dark magnet" style={{ minHeight: 52 }}>Descargar CV ↓</a>}
      </div>
    </section>
  );
}
