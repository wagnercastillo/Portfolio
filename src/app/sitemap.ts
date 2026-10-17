import type { MetadataRoute } from 'next';
import { getProjects } from '@/lib/content';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
  const projects = await getProjects();
  const page = (path: string) => ({ url: `${base}${path}`, alternates: { languages: { es: `${base}${path}`, en: `${base}/en${path === '/' ? '' : path}` } } });
  return [page('/'), ...projects.map((p) => page(`/proyectos/${p.slug}`))];
}
