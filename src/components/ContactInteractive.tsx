'use client';
import { useEffect, useRef, useState } from 'react';
import { buildMessage } from '@/lib/contact';
import type { Perfil } from '@/lib/content';
import { ContactChat } from './ContactChat';
import { ContactTerminal } from './ContactTerminal';
import { MessageBuilder, toBrief, type Form } from './MessageBuilder';
import { PhoneMock } from './PhoneMock';
import { TimeDiff } from './TimeDiff';

/** Estado compartido: lo que se arma a la izquierda se ve llegar al teléfono de la derecha. */
export function ContactInteractive({ perfil }: { perfil: Perfil }) {
  const [form, setForm] = useState<Form>({ needs: [], when: null, name: '', note: '' });
  const message = buildMessage(toBrief(form));

  // "escribiendo…" breve en el teléfono cada vez que cambia el mensaje
  const [shown, setShown] = useState(message);
  const [typing, setTyping] = useState(false);
  useEffect(() => {
    if (message === shown) return;
    setTyping(true);
    const t = setTimeout(() => { setShown(message); setTyping(false); }, 420);
    return () => clearTimeout(t);
  }, [message, shown]);

  const [sent, setSent] = useState(false);
  const sentTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const onSend = () => {
    setSent(true);
    clearTimeout(sentTimer.current);
    sentTimer.current = setTimeout(() => setSent(false), 4000);
  };

  const [time, setTime] = useState('');
  useEffect(() => {
    const tick = () => setTime(new Intl.DateTimeFormat('es', { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(new Date()));
    tick();
    const id = setInterval(tick, 15000);
    return () => clearInterval(id);
  }, []);

  const ciudad = perfil.ubicacion.split(',')[0];
  return (
    <div className="contact-grid">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 28, minWidth: 0 }}>
        <ContactChat foto={perfil.foto} nombre={perfil.nombre} />
        <h2 id="ct" className="scramble">¿Construimos algo juntos?</h2>
        <MessageBuilder form={form} onChange={setForm} message={message} email={perfil.email} telefono={perfil.telefono} onSend={onSend} />
        <TimeDiff ciudad={ciudad} />
      </div>
      <div className="contact-side">
        <ContactTerminal perfil={perfil} />
        <PhoneMock message={shown} typing={typing} sent={sent} foto={perfil.foto} nombre={perfil.nombre} ubicacion={perfil.ubicacion} time={time} />
      </div>
    </div>
  );
}
