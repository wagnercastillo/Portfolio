import { projectLinks, type Project } from '@/lib/projects';

export function ProjectLinks({ project }: { project: Project }) {
  const links = projectLinks(project);
  if (!links.length) return null;
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
      {links.map((l, i) => (
        <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className={`btn magnet ${i ? 'btn-soft' : 'btn-accent'}`}>
          {l.label} ↗
        </a>
      ))}
    </div>
  );
}
