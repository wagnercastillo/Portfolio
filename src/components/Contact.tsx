import type { Perfil } from '@/lib/content';
import { ContactChat } from './ContactChat';
import { MessageBuilder } from './MessageBuilder';
import { ContactTerminal } from './ContactTerminal';

export function Contact({ perfil }: { perfil: Perfil }) {
  return (
    <section id="contacto" className="card contact reveal" aria-labelledby="ct">
      <div className="contact-grid">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28, minWidth: 0 }}>
          <ContactChat foto={perfil.foto} nombre={perfil.nombre} />
          <h2 id="ct" className="scramble">¿Construimos algo juntos?</h2>
          <MessageBuilder email={perfil.email} telefono={perfil.telefono} />
        </div>
        <ContactTerminal perfil={perfil} />
      </div>
    </section>
  );
}
