'use client';
import { mailtoLink, waLink, type Brief } from '@/lib/contact';
import type { Dict } from '@/lib/i18n';
import { useT } from './useT';

/** Estado del formulario: etiquetas elegidas tal como se muestran en los chips. */
export interface Form { needs: string[]; when: string | null; name: string; note: string }

export const toBrief = (f: Form, t: Dict): Brief => ({
  needs: t.contact.needs.filter(([l]) => f.needs.includes(l)).map(([, p]) => p),
  when: t.contact.whens.find(([l]) => l === f.when)?.[1] ?? null,
  note: f.note,
  name: f.name,
});

/** Chips + campos que componen el mensaje; la vista previa vive en el teléfono. */
export function MessageBuilder({ form, onChange, message, email, telefono, onSend }: {
  form: Form; onChange: (update: (f: Form) => Form) => void; message: string; email: string; telefono: string; onSend: () => void;
}) {
  const t = useT();
  const c = t.contact;
  // actualizaciones funcionales: dos clics seguidos no se pisan
  const set = (p: Partial<Form> | ((f: Form) => Partial<Form>)) => onChange((f) => ({ ...f, ...(typeof p === 'function' ? p(f) : p) }));
  const toggle = (l: string) => set((f) => ({ needs: f.needs.includes(l) ? f.needs.filter((x) => x !== l) : [...f.needs, l] }));
  const subject = c.subject(form.needs);

  return (
    <div className="builder">
      <h3 className="label">{c.build}</h3>
      <fieldset>
        <legend>{c.what}</legend>
        <div className="opt-chips">
          {c.needs.map(([l]) => <button key={l} type="button" aria-pressed={form.needs.includes(l)} onClick={() => toggle(l)}>{l}</button>)}
        </div>
      </fieldset>
      <fieldset>
        <legend>{c.when}</legend>
        <div className="opt-chips">
          {c.whens.map(([l]) => <button key={l} type="button" aria-pressed={form.when === l} onClick={() => set((f) => ({ when: f.when === l ? null : l }))}>{l}</button>)}
        </div>
      </fieldset>
      <div className="builder-fields">
        <label>
          <span>{c.yourName}</span>
          <input value={form.name} onChange={(e) => set({ name: e.target.value })} maxLength={60} autoComplete="name" />
        </label>
        <label>
          <span>{c.more}</span>
          <input value={form.note} onChange={(e) => set({ note: e.target.value })} maxLength={280} placeholder={c.placeholder} />
        </label>
      </div>
      <p className="label" style={{ margin: 0, textTransform: 'none', letterSpacing: 0 }}>{c.preview}</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
        {telefono && (
          <a className="btn btn-accent magnet" href={waLink(telefono, message)} target="_blank" rel="noopener noreferrer" onClick={onSend}>
            {c.sendWa} <span className="arr">→</span>
          </a>
        )}
        <a className="btn btn-dark magnet" href={mailtoLink(email, subject, message)} onClick={onSend}>{c.sendMail}</a>
      </div>
    </div>
  );
}
