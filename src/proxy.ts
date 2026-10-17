import { NextResponse, type NextRequest } from 'next/server';

// El español vive sin prefijo (/proyectos/x se sirve desde /es/proyectos/x); el inglés, bajo /en.
export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (/\.[a-z0-9]+$/i.test(pathname)) return; // archivos (icons.svg, sitemap.xml, imágenes…)
  if (pathname === '/en' || pathname.startsWith('/en/')) return;
  const url = req.nextUrl.clone();
  if (pathname === '/es' || pathname.startsWith('/es/')) {
    url.pathname = pathname.slice(3) || '/';
    return NextResponse.redirect(url);
  }
  url.pathname = `/es${pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  // fuera: API, panel e internos de Next
  matcher: ['/((?!api|keystatic|_next).*)'],
};
