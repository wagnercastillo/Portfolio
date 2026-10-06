import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  turbopack: { root: __dirname },
  // El reader de Keystatic lee content/ en tiempo de ejecución (slugs no pre-renderizados);
  // el tracing no detecta esas rutas dinámicas de fs.
  outputFileTracingIncludes: {
    '/proyectos/*': ['./content/**/*'],
  },
};

export default nextConfig;
