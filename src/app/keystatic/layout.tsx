import KeystaticApp from './keystatic';

// El sitio tiene su layout raíz en app/[lang]; el panel necesita el suyo.
export default function Layout() {
  return (
    <html lang="es">
      <body><KeystaticApp /></body>
    </html>
  );
}
