'use client';
import Image from 'next/image';

/** Celular con el chat de WhatsApp: el mensaje del visitante aparece en vivo. */
export function PhoneMock({ message, typing, sent, foto, nombre, ubicacion, time }: {
  message: string; typing: boolean; sent: boolean; foto: string | null; nombre: string; ubicacion: string; time: string;
}) {
  return (
    <div className="phone" aria-label="Vista previa del mensaje en WhatsApp">
      <div className="phone-notch" aria-hidden="true" />
      <div className="wa-head">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M15 18l-6-6 6-6" /></svg>
        {foto && <Image src={foto} alt="" width={34} height={34} className="wa-avatar" />}
        <div style={{ minWidth: 0 }}>
          <strong>{nombre}</strong>
          <span>{ubicacion}</span>
        </div>
      </div>
      <div className="wa-chat">
        <div className="wa-day">Hoy</div>
        <div className="wa-msg in"><p>¡Hola! Cuéntame qué quieres construir.</p></div>
        <div className={`wa-msg out${sent ? ' sent' : ''}`} key={typing ? 'typing' : message}>
          {typing ? (
            <span className="typing" aria-label="Escribiendo"><i /><i /><i /></span>
          ) : (
            <>
              <p>{message}</p>
              <span className="wa-meta">{time}
                <svg viewBox="0 0 18 12" width="16" height="11" aria-label={sent ? 'Enviado' : 'Pendiente'}><path d="M1 6.5l3.2 3.2L11 2.5M7 9.2l.5.5L15.5 2" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </span>
            </>
          )}
        </div>
      </div>
      <div className="wa-input" aria-hidden="true">
        <span>Mensaje</span>
        <i className={sent ? 'go' : ''}>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M3 20.5 21 12 3 3.5l.01 6.6L15 12 3.01 13.9z" /></svg>
        </i>
      </div>
    </div>
  );
}
