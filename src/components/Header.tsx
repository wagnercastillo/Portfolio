import Link from 'next/link';
import { ThemeToggle } from './ThemeToggle';
import { CursorToggle } from './CursorToggle';
import { LangToggle } from './LangToggle';
import { NavEffects } from './NavEffects';
import { getT } from '@/lib/i18n-server';
import { localize } from '@/lib/i18n';

export async function Header() {
  const t = await getT();
  const to = (p: string) => localize(t.lang, p);
  return (
    <header className="card site-header">
      <Link href={to('/')} className="logo" id="logo"><span>CC</span>Cristhoper Castillo</Link>
      <nav className="site-nav" aria-label={t.nav.label}>
        <span className="nav-pill" aria-hidden="true" />
        <a href={to('/#proyectos')}>{t.nav.projects}</a>
        <a href={to('/#experiencia')}>{t.nav.experience}</a>
        <a href={to('/#stack')}>{t.nav.stack}</a>
        <a href={to('/#contacto')} className="cta">{t.nav.contact}</a>
        <LangToggle />
        <CursorToggle />
        <ThemeToggle />
      </nav>
      <i className="nav-progress" aria-hidden="true" />
      <NavEffects />
    </header>
  );
}
