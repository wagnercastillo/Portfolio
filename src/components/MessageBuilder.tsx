'use client';
import { useEffect, useState } from 'react';
import { buildMessage, mailtoLink, waLink } from '@/lib/contact';

const NEEDS: [string, string][] = [
  ['App web', 'una app web'],
  ['API / Backend', 'una API / backend'],
  ['App móvil', 'una app móvil'],
  ['Integración con IA', 'una integración con IA'],
  ['Migrar un sistema', 'migrar un sistema existente'],
  ['Consultoría', 'consultoría técnica'],
];
const WHEN: [string, string][] = [
  ['Lo antes posible', 'lo antes posible'],
  ['1–3 meses', 'en 1 a 3 meses'],
  ['Explorando ideas', 'sin fecha, estoy explorando ideas'],
];

/** Chips + nota → mensaje redactado en vivo, listo para WhatsApp o email. */
export function MessageBuilder({ email, telefono }: { email: string; telefono: string }) {
  const [needs, setNeeds] = useState<string[]>([]);
  const [when, setWhen] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [note, setNote] = useState('');
  const message = buildMessage({
    needs: NEEDS.filter(([l]) => needs.includes(l)).map(([, p]) => p),
    when: WHEN.find(([l]) => l === when)?.[1] ?? null,
    note,
    name,
  });

  // "escribiendo…" breve cada vez que cambia el mensaje
  const [shown, setShown] = useState(message);
  const [typing, setTyping] = useState(false);
  useEffect(() => {
    if (message === shown) return;
    setTyping(true);
    const t = setTimeout(() => { setShown(message); setTyping(false); }, 380);
    return () => clearTimeout(t);
  }, [message, shown]);

  const toggle = (l: string) => setNeeds((n) => (n.includes(l) ? n.filter((x) => x !== l) : [...n, l]));
  const subject = needs.length ? `Proyecto: ${needs.join(', ')}` : 'Contacto desde tu portafolio';

  return (
    <div className="builder">
      <h3 className="label">Arma tu mensaje</h3>
      <fieldset>
        <legend>¿Qué necesitas?</legend>
        <div className="opt-chips">
          {NEEDS.map(([l]) => (
            <button key={l} type="button" aria-pressed={needs.includes(l)} onClick={() => toggle(l)}>{l}</button>
          ))}
        </div>
      </fieldset>
      <fieldset>
        <legend>¿Para cuándo?</legend>
        <div className="opt-chips">
          {WHEN.map(([l]) => (
            <button key={l} type="button" aria-pressed={when === l} onClick={() => setWhen(when === l ? null : l)}>{l}</button>
          ))}
        </div>
      </fieldset>
      <div className="builder-fields">
        <label>
          <span>Tu nombre (opcional)</span>
          <input value={name} onChange={(e) => setName(e.target.value)} maxLength={60} autoComplete="name" />
        </label>
        <label>
          <span>Algo más (opcional)</span>
          <input value={note} onChange={(e) => setNote(e.target.value)} maxLength={280} placeholder="Ej. es para una clínica en Quito" />
        </label>
      </div>
      <div className="preview" aria-live="polite">
        <span className="label">Vista previa</span>
        <div className="preview-bubble">
          {typing ? <span className="typing" aria-hidden="true"><i /><i /><i /></span> : <p>{shown}</p>}
        </div>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
        {telefono && (
          <a className="btn btn-accent magnet" href={waLink(telefono, message)} target="_blank" rel="noopener noreferrer">
            Enviar por WhatsApp <span className="arr">→</span>
          </a>
        )}
        <a className="btn btn-dark magnet" href={mailtoLink(email, subject, message)}>Enviar por email</a>
      </div>
    </div>
  );
}
