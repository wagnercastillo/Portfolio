'use client';
import { useEffect, useState } from 'react';
import { formatPhone, localTime, waLink } from '@/lib/contact';
import type { Perfil } from '@/lib/content';
import { useInView } from './useInView';

const COMMAND = 'contactar --cristhoper';

/** Terminal que se escribe sola; cada línea es un canal clicable. */
export function ContactTerminal({ perfil }: { perfil: Perfil }) {
  const [ref, seen] = useInView<HTMLDivElement>();
  const [typed, setTyped] = useState(0);
  const [rows, setRows] = useState(0);
  const [copied, setCopied] = useState(false);
  const [now, setNow] = useState<Date | null>(null);

  const lines = [
    { key: 'email', value: perfil.email, action: 'copiar' },
    perfil.telefono && { key: 'whatsapp', value: formatPhone(perfil.telefono), href: waLink(perfil.telefono, 'Hola Cristhoper, vi tu portafolio.'), action: 'abrir' },
    perfil.linkedin && { key: 'linkedin', value: perfil.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com/, '').replace(/\/$/, ''), href: perfil.linkedin, action: 'abrir' },
    perfil.github && { key: 'github', value: '@' + perfil.github.split('/').filter(Boolean).pop(), href: perfil.github, action: 'abrir' },
    perfil.cv && { key: 'cv', value: perfil.cv.split('/').pop()!, href: perfil.cv, action: 'descargar', download: true },
  ].filter(Boolean) as { key: string; value: string; href?: string; action: string; download?: boolean }[];

  // reloj de Loja (se monta en cliente para no desincronizar el HTML del servidor)
  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 15000);
    return () => clearInterval(id);
  }, []);

  // escribe el comando y luego revela las líneas una a una
  useEffect(() => {
    if (!seen) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { setTyped(COMMAND.length); setRows(lines.length + 1); return; }
    let i = 0;
    const id = setInterval(() => {
      i++;
      if (i <= COMMAND.length) setTyped(i);
      else if (i % 3 === 0) setRows((r) => { if (r >= lines.length + 1) clearInterval(id); return Math.min(r + 1, lines.length + 1); });
    }, 45);
    return () => clearInterval(id);
  }, [seen, lines.length]);

  const copy = async () => {
    try { await navigator.clipboard.writeText(perfil.email); } catch { location.href = `mailto:${perfil.email}`; return; }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const t = now ? localTime(now) : null;
  const done = rows > lines.length;

  return (
    <div className="terminal" ref={ref}>
      <div className="term-bar" aria-hidden="true"><i /><i /><i /><span>~/contacto</span></div>
      <div className="term-body">
        <p><span className="term-prompt">$</span> {COMMAND.slice(0, typed)}{!done && <span className="term-caret" />}</p>
        <ul aria-label="Canales de contacto">
          {lines.map((l, i) => (
            <li key={l.key} className={i < rows ? 'on' : ''}>
              {l.href ? (
                <a href={l.href} target={l.download ? undefined : '_blank'} rel="noopener noreferrer" download={l.download || undefined}>
                  <span className="term-key">{l.key}</span><span className="term-val" title={l.value}>{l.value}</span><span className="term-act">[{l.action}]</span>
                </a>
              ) : (
                <button type="button" onClick={copy} className={copied ? 'copied' : ''}>
                  <span className="term-key">{l.key}</span><span className="term-val" title={l.value}>{l.value}</span>
                  <span className="term-act">{copied ? '✓ copiado' : `[${l.action}]`}</span>
                </button>
              )}
            </li>
          ))}
          <li className={rows > lines.length ? 'on' : ''}>
            <div className="term-row">
              <span className="term-key">hora</span>
              <span className="term-val">{t ? `${t.time} · ${perfil.ubicacion.split(',')[0]} (GMT-5)` : perfil.ubicacion}</span>
              {t && <span className={`term-status${t.working ? ' ok' : ''}`}>{t.working ? 'en horario laboral' : 'fuera de horario'}</span>}
            </div>
          </li>
        </ul>
        {done && <p><span className="term-prompt">$</span> <span className="term-caret" /></p>}
        <span className="sr-only" aria-live="polite">{copied ? 'Email copiado al portapapeles' : ''}</span>
      </div>
    </div>
  );
}
