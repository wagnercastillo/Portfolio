'use client';
import { projectLinks, type Project } from '@/lib/projects';
import { term } from '@/lib/i18n';
import { useT } from './useT';

export function ProjectLinks({ project }: { project: Project }) {
  const t = useT();
  const links = projectLinks(project);
  if (!links.length) return null;
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
      {links.map((l, i) => (
        <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className={`btn magnet ${i ? 'btn-soft' : 'btn-accent'}`}>
          {term(t, l.label)} ↗
        </a>
      ))}
    </div>
  );
}
