'use client';
import { mailtoLink, waLink, type Brief } from '@/lib/contact';

export const NEEDS: [string, string][] = [
  ['App web', 'una app web'],
  ['API / Backend', 'una API / backend'],
  ['App móvil', 'una app móvil'],
  ['Integración con IA', 'una integración con IA'],
  ['Migrar un sistema', 'migrar un sistema existente'],
  ['Consultoría', 'consultoría técnica'],
];
export const WHEN: [string, string][] = [
  ['Lo antes posible', 'lo antes posible'],
  ['1–3 meses', 'en 1 a 3 meses'],
  ['Explorando ideas', 'sin fecha, estoy explorando ideas'],
];

/** Estado del formulario: etiquetas elegidas tal como se muestran en los chips. */
export interface Form { needs: string[]; when: string | null; name: string; note: string }

export const toBrief = (f: Form): Brief => ({
  needs: NEEDS.filter(([l]) => f.needs.includes(l)).map(([, p]) => p),
  when: WHEN.find(([l]) => l === f.when)?.[1] ?? null,
  note: f.note,
  name: f.name,
});

/** Chips + campos que componen el mensaje; la vista previa vive en el teléfono. */
export function MessageBuilder({ form, onChange, message, email, telefono, onSend }: {
  form: Form; onChange: (update: (f: Form) => Form) => void; message: string; email: string; telefono: string; onSend: () => void;
}) {
  // actualizaciones funcionales: dos clics seguidos no se pisan
  const set = (p: Partial<Form> | ((f: Form) => Partial<Form>)) => onChange((f) => ({ ...f, ...(typeof p === 'function' ? p(f) : p) }));
  const toggle = (l: string) => set((f) => ({ needs: f.needs.includes(l) ? f.needs.filter((x) => x !== l) : [...f.needs, l] }));
  const subject = form.needs.length ? `Proyecto: ${form.needs.join(', ')}` : 'Contacto desde tu portafolio';

  return (
    <div className="builder">
      <h3 className="label">Arma tu mensaje</h3>
      <fieldset>
        <legend>¿Qué necesitas?</legend>
        <div className="opt-chips">
          {NEEDS.map(([l]) => <button key={l} type="button" aria-pressed={form.needs.includes(l)} onClick={() => toggle(l)}>{l}</button>)}
        </div>
      </fieldset>
      <fieldset>
        <legend>¿Para cuándo?</legend>
        <div className="opt-chips">
          {WHEN.map(([l]) => <button key={l} type="button" aria-pressed={form.when === l} onClick={() => set((f) => ({ when: f.when === l ? null : l }))}>{l}</button>)}
        </div>
      </fieldset>
      <div className="builder-fields">
        <label>
          <span>Tu nombre (opcional)</span>
          <input value={form.name} onChange={(e) => set({ name: e.target.value })} maxLength={60} autoComplete="name" />
        </label>
        <label>
          <span>Algo más (opcional)</span>
          <input value={form.note} onChange={(e) => set({ note: e.target.value })} maxLength={280} placeholder="Ej. es para una clínica en Quito" />
        </label>
      </div>
      <p className="label" style={{ margin: 0, textTransform: 'none', letterSpacing: 0 }}>Mira cómo llega tu mensaje en el teléfono →</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
        {telefono && (
          <a className="btn btn-accent magnet" href={waLink(telefono, message)} target="_blank" rel="noopener noreferrer" onClick={onSend}>
            Enviar por WhatsApp <span className="arr">→</span>
          </a>
        )}
        <a className="btn btn-dark magnet" href={mailtoLink(email, subject, message)} onClick={onSend}>Enviar por email</a>
      </div>
    </div>
  );
}
