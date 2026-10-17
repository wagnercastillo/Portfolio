import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProject, getProjects } from '@/lib/content';
import { Gallery } from '@/components/Gallery';
import { ProjectCover } from '@/components/ProjectCover';
import { ProjectLinks } from '@/components/ProjectLinks';
import { ProjectCard } from '@/components/ProjectCard';
import { TechIconSvg } from '@/components/TechIconSvg';
import { stackIcons, techIcon } from '@/lib/tech-icons';
import { getLang, getT } from '@/lib/i18n-server';
import { localize, term } from '@/lib/i18n';

export async function generateStaticParams() {
  return (await getProjects()).map((p) => ({ slug: p.slug }));
}

type Props = { params: Promise<{ lang: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const data = await getProject(slug, await getLang());
  if (!data) return {};
  const { project } = data;
  return {
    title: project.titulo,
    alternates: { languages: { es: `/proyectos/${slug}`, en: `/en/proyectos/${slug}` } },
    description: project.resumen,
    openGraph: { title: project.titulo, description: project.resumen, images: project.portada ? [project.portada] : [] },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const t = await getT();
  const [data, all] = await Promise.all([getProject(slug, t.lang), getProjects(t.lang)]);
  if (!data) notFound();
  const { project: p, body } = data;
  const shots = [p.portada, ...p.galeria].filter((s): s is string => !!s);
  const others = all.filter((x) => x.slug !== slug && x.categoria === p.categoria).slice(0, 3);

  return (
    <main style={{ display: 'contents' }}>
      <section className="grid">
        <div className="card hero span2 spot" style={{ minHeight: 0 }}>
          <Link href={localize(t.lang, '/#proyectos')} className="label" style={{ textDecoration: 'none' }}>{t.projects.back}</Link>
          <div>
            <p className="label">{term(t, p.categoria)}{p.cliente && ` · ${p.cliente}`}</p>
            <h1 className="scramble" style={{ marginTop: 12, fontSize: 'clamp(40px, 6vw, 80px)', fontWeight: 800, lineHeight: 1, letterSpacing: '-.04em', overflowWrap: 'anywhere' }}>
              {p.titulo}
            </h1>
            <p style={{ margin: '20px 0 0', maxWidth: 640, fontSize: 19, lineHeight: 1.55, color: 'var(--muted)' }}>{p.resumen}</p>
          </div>
          <ProjectLinks project={p} />
        </div>
        <div className="card stat inv">
          <span className="label">{t.projects.status}</span>
          <span style={{ fontSize: 30, fontWeight: 800 }}>{term(t, p.estado)}</span>
          <span className="label">Stack</span>
          <ul className="chips sm stack-chips">
            {p.stack.map((s) => {
              const icon = techIcon(s);
              return (
                <li key={s} style={{ '--brand': icon.color ?? 'var(--accent)' } as React.CSSProperties}>
                  <TechIconSvg icon={icon} size={16} />{s}
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <div className="card" style={{ padding: 16 }}>
        {shots.length ? <Gallery images={shots} title={p.titulo} priority /> : <ProjectCover project={p} ratio="21 / 9" priority />}
      </div>

      <article className="card prose-content reveal" style={{ padding: 'clamp(24px, 4vw, 48px)' }}>{body}</article>


      {others.length > 0 && (
        <section aria-labelledby="mas" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <h2 id="mas" className="section-title reveal scramble" style={{ margin: '32px 4px 0' }}>{t.projects.more} · {term(t, p.categoria)}</h2>
          <div className="grid">
            {others.map((o, i) => <ProjectCard key={o.slug} project={o} icons={stackIcons(o.stack)} className="reveal" style={{ '--d': i } as React.CSSProperties} />)}
          </div>
        </section>
      )}
    </main>
  );
}
