import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  turbopack: { root: __dirname },
  // no hay índice de proyectos: la sección vive en la portada
  redirects: async () => [
    { source: '/proyectos', destination: '/#proyectos', permanent: false },
    { source: '/en/proyectos', destination: '/en#proyectos', permanent: false },
  ],
  // El reader de Keystatic lee content/ en tiempo de ejecución (slugs no pre-renderizados);
  // el tracing no detecta esas rutas dinámicas de fs.
  outputFileTracingIncludes: {
    '/*/proyectos/*': ['./content/**/*'],
  },
};

export default nextConfig;
