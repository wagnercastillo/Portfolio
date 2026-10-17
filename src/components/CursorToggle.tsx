'use client';
import { useEffect, useState } from 'react';
import { useT } from './useT';

export function CursorToggle() {
  const t = useT();
  const [on, setOn] = useState(true);
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    setOn(!document.documentElement.classList.contains('no-cursor'));
    setHidden(matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);
  const toggle = () => {
    const off = document.documentElement.classList.toggle('no-cursor');
    try { localStorage.setItem('cursor', off ? 'off' : 'on'); } catch {}
    setOn(!off);
  };
  if (hidden) return null;
  return (
    <button className="icon-btn cursor-btn" type="button" aria-pressed={on} aria-label={t.toggles.cursor} title={t.toggles.cursorTitle} onClick={toggle}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 3l14 7-6 2-2 6z" /><path className="slash" d="M3 3l18 18" /></svg>
    </button>
  );
}
