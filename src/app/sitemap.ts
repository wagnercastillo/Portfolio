import type { MetadataRoute } from 'next';
import { getProjects } from '@/lib/content';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
  const projects = await getProjects();
  return [{ url: base }, ...projects.map((p) => ({ url: `${base}/proyectos/${p.slug}` }))];
}
