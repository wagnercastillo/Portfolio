'use client';
import { useEffect, useState } from 'react';
import { cityFromTz, localTime, timeDiffLabel } from '@/lib/contact';

/** Dos relojes (Loja y el del visitante) y la diferencia horaria. Solo en cliente: depende del navegador. */
export function TimeDiff({ ciudad }: { ciudad: string }) {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 15000);
    return () => clearInterval(id);
  }, []);
  if (!now) return <div className="timediff" aria-hidden="true" />;

  const mine = new Intl.DateTimeFormat('es', { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(now);
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone ?? '';
  const label = timeDiffLabel(-now.getTimezoneOffset());
  return (
    <div className="timediff">
      <div className="clock"><span className="label">{ciudad}</span><b>{localTime(now).time}</b></div>
      <div className="timediff-mid" aria-live="polite"><i aria-hidden="true" /><span>{label}</span><i aria-hidden="true" /></div>
      <div className="clock"><span className="label">Tú · {cityFromTz(tz)}</span><b>{mine}</b></div>
    </div>
  );
}
