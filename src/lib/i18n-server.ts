import 'server-only';
import { lang } from 'next/root-params';
import { dict, isLang, type Lang } from './i18n';

/** Idioma de la ruta actual (segmento [lang]) en componentes de servidor. */
export const getLang = async (): Promise<Lang> => {
  const l = await lang();
  return isLang(l) ? l : 'es';
};
export const getT = async () => dict(await getLang());
