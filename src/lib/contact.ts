export interface Brief { needs: string[]; when: string | null; note: string; name: string }

// ponytail: zona y horario fijos (Loja); mover a Keystatic si cambian.
const TIMEZONE = 'America/Guayaquil';
const WORK = { days: [1, 2, 3, 4, 5], from: 8, to: 18 };

const list = (xs: string[]) => (xs.length < 2 ? xs.join('') : `${xs.slice(0, -1).join(', ')} y ${xs[xs.length - 1]}`);

/** Redacta el mensaje que el visitante enviará por WhatsApp o email. */
export function buildMessage({ needs, when, note, name }: Brief) {
  const hello = name.trim() ? `Hola Cristhoper, soy ${name.trim()}. Vi tu portafolio` : 'Hola Cristhoper, vi tu portafolio';
  const parts = [needs.length ? `${hello} y necesito ${list(needs)}.` : `${hello} y me gustaría conversar sobre un proyecto.`];
  if (when) parts.push(`Plazo: ${when}.`);
  if (note.trim()) parts.push(note.trim());
  return parts.join(' ');
}

export const waLink = (phone: string, text: string) => `https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(text)}`;

export const mailtoLink = (email: string, subject: string, body: string) =>
  `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

export function formatPhone(phone: string) {
  const d = phone.replace(/\D/g, '');
  return /^593\d{9}$/.test(d) ? `+593 ${d.slice(3, 5)} ${d.slice(5, 8)} ${d.slice(8)}` : phone;
}

/** Hora en Loja y si cae en horario laboral (L–V 8:00–18:00). */
export function localTime(now: Date) {
  const parts = new Intl.DateTimeFormat('en-GB', { timeZone: TIMEZONE, hour: '2-digit', minute: '2-digit', weekday: 'short', hourCycle: 'h23' })
    .formatToParts(now);
  const get = (t: string) => parts.find((p) => p.type === t)!.value;
  const day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday'));
  const hour = Number(get('hour'));
  return { time: `${get('hour')}:${get('minute')}`, working: WORK.days.includes(day) && hour >= WORK.from && hour < WORK.to };
}

const LOJA_OFFSET = -300; // minutos respecto a UTC (Ecuador no usa horario de verano)

/** Frase con la diferencia entre la hora del visitante (offset en minutos, ej. -300) y Loja. */
export function timeDiffLabel(visitorOffset: number) {
  const diff = visitorOffset - LOJA_OFFSET;
  if (diff === 0) return '¡Estamos en la misma hora!';
  const abs = Math.abs(diff), h = Math.floor(abs / 60), m = abs % 60;
  return `Vas ${h} h${m ? ` ${m} min` : ''} ${diff > 0 ? 'adelante' : 'detrás'} de mí`;
}

export const cityFromTz = (tz: string) => (tz ? tz.split('/').pop()!.replace(/_/g, ' ') : 'tu ciudad');
