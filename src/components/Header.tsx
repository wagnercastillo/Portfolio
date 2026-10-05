import Link from 'next/link';
import { ThemeToggle } from './ThemeToggle';
import { CursorToggle } from './CursorToggle';

export function Header() {
  return (
    <header className="card site-header">
      <Link href="/" className="logo" id="logo"><span>CC</span>Cristhoper Castillo</Link>
      <nav className="site-nav" aria-label="Principal">
        <a href="/#proyectos">Proyectos</a>
        <a href="/#experiencia">Experiencia</a>
        <a href="/#stack">Stack</a>
        <a href="/#contacto" className="cta">Contacto</a>
        <CursorToggle />
        <ThemeToggle />
      </nav>
    </header>
  );
}
