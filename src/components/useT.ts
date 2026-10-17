'use client';
import { useParams } from 'next/navigation';
import { dict, isLang } from '@/lib/i18n';

/** Diccionario del idioma de la ruta actual en componentes de cliente. */
export function useT() {
  const { lang } = useParams<{ lang?: string }>();
  return dict(isLang(lang) ? lang : 'es');
}
