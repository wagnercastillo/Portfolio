'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { localize } from '@/lib/i18n';
import { useT } from './useT';

/** Cambia entre español (sin prefijo) e inglés (/en) manteniendo la página actual. */
export function LangToggle() {
  const t = useT();
  const path = usePathname();
  const other = t.lang === 'es' ? 'en' : 'es';
  const bare = path.replace(/^\/(en|es)(?=\/|$)/, '') || '/';
  return (
    <Link className="icon-btn lang-btn" href={localize(other, bare)} hrefLang={other} aria-label={t.toggles.lang} title={t.toggles.lang}
      // conserva la sección (#stack…) al cambiar de idioma
      onClick={(e) => { if (location.hash) { e.preventDefault(); location.href = localize(other, bare) + location.hash; } }}>
      {t.toggles.langShort}
    </Link>
  );
}
