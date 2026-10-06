'use client';

export function ThemeToggle() {
  const toggle = (e: React.MouseEvent) => {
    const root = document.documentElement;
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    // Sin esto, ~290 elementos con transition de color arrancan a la vez y cada frame repinta la página.
    // El efecto visual ya lo da la View Transition, así que el cambio se aplica de golpe.
    const apply = () => {
      root.classList.add('no-transitions');
      root.dataset.theme = next;
      void root.offsetHeight; // aplica los nuevos estilos sin transición
      requestAnimationFrame(() => requestAnimationFrame(() => root.classList.remove('no-transitions')));
      try { localStorage.setItem('theme', next); } catch {}
    };
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!document.startViewTransition || reduce) return apply();
    const { clientX: x, clientY: y } = e;
    const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    document.startViewTransition(apply).ready.then(() =>
      root.animate(
        { clipPath: [`circle(0 at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
        { duration: 650, easing: 'cubic-bezier(.2,.8,.2,1)', pseudoElement: '::view-transition-new(root)' },
      ),
    );
  };
  return (
    <button className="icon-btn theme-btn" type="button" aria-label="Cambiar tema claro / oscuro" onClick={toggle}>
      <svg className="sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>
      <svg className="moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" /></svg>
    </button>
  );
}
