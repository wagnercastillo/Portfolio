import type { Perfil } from '@/lib/content';
import { ContactInteractive } from './ContactInteractive';

export function Contact({ perfil }: { perfil: Perfil }) {
  return (
    <section id="contacto" className="card contact reveal" aria-labelledby="ct">
      <ContactInteractive perfil={perfil} />
    </section>
  );
}
