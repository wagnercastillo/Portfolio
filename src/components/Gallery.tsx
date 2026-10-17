'use client';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useT } from './useT';

/** Carrusel de capturas sin recortar; clic abre la imagen a pantalla completa (← → navega, Esc cierra). */
export function Gallery({ images, title, priority = false }: { images: string[]; title: string; priority?: boolean }) {
  const t = useT();
  const g = t.gallery;
  const track = useRef<HTMLDivElement>(null);
  const box = useRef<HTMLDialogElement>(null);
  const [i, setI] = useState(0);
  const strip = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState<number | null>(null);
  const n = images.length;

  const [edge, setEdge] = useState({ start: true, end: true });
  const edges = () => {
    const s = strip.current;
    if (s) setEdge({ start: s.scrollLeft <= 1, end: s.scrollLeft + s.clientWidth >= s.scrollWidth - 1 });
  };
  const slide = (d: number) => strip.current?.scrollBy({ left: d * strip.current.clientWidth * 0.8, behavior: 'smooth' });

  // mantener la miniatura activa visible en la tira
  useEffect(() => {
    strip.current?.querySelector('[aria-current]')?.scrollIntoView({ block: 'nearest', inline: 'center' });
    edges();
  }, [zoom]);

  const go = (k: number) => {
    const t = track.current;
    if (!t) return;
    const smooth = !matchMedia('(prefers-reduced-motion: reduce)').matches;
    t.scrollTo({ left: ((k + n) % n) * t.clientWidth, behavior: smooth ? 'smooth' : 'instant' });
  };
  const onScroll = () => { const t = track.current; if (t) setI(Math.round(t.scrollLeft / t.clientWidth)); };
  const open = (k: number) => { setZoom(k); box.current?.showModal(); };
  const step = (d: number) => setZoom((z) => (z === null ? z : (z + d + n) % n));

  // no dejar que ← → lleguen a la vista rápida (navegaría entre proyectos)
  const onKey = (e: React.KeyboardEvent) => {
    e.stopPropagation();
    if (e.key === 'ArrowRight') { e.preventDefault(); step(1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1); }
  };

  return (
    <div className="gallery">
      <div className="g-track" ref={track} onScroll={onScroll}>
        {images.map((src, k) => (
          <button key={src} type="button" className="g-slide" onClick={() => open(k)} aria-label={g.open(k + 1, n)}>
            <Image src={src} alt={g.shot(title, k + 1)} fill sizes="(min-width: 1024px) 1200px, 100vw" priority={priority && k === 0} />
          </button>
        ))}
      </div>
      {n > 1 && (
        <>
          <button type="button" className="icon-btn g-nav g-prev" onClick={() => go(i - 1)} aria-label={g.prev}>←</button>
          <button type="button" className="icon-btn g-nav g-next" onClick={() => go(i + 1)} aria-label={g.next}>→</button>
          <span className="g-count label">{i + 1} / {n}</span>
        </>
      )}
      <dialog ref={box} className="lightbox" aria-label={g.shotsOf(title)} onKeyDown={onKey}
        onClose={(e) => { if (e.target !== e.currentTarget) return; if (zoom !== null) go(zoom); setZoom(null); }}
        onClick={(e) => { if (e.target === e.currentTarget) box.current?.close(); }}>
        {zoom !== null && (
          <>
            <div className="lb-img">
              <Image key={images[zoom]} src={images[zoom]} alt={g.shot(title, zoom + 1)} fill sizes="100vw" />
            </div>
            <div className="lb-top">
              <span className="label">{zoom + 1} / {n} · {t.projects.navHint}</span>
              <button type="button" className="icon-btn" onClick={() => box.current?.close()} aria-label={t.projects.close}>✕</button>
            </div>
            {n > 1 && (
              <>
                <button type="button" className="icon-btn g-nav g-prev" onClick={() => step(-1)} aria-label={g.prev}>←</button>
                <button type="button" className="icon-btn g-nav g-next" onClick={() => step(1)} aria-label={g.next}>→</button>
                <div className="lb-strip">
                  {!(edge.start && edge.end) && (
                    <button type="button" className="lb-strip-nav" onClick={() => slide(-1)} disabled={edge.start} aria-label={g.thumbsPrev}>‹</button>
                  )}
                  <div className="lb-thumbs" ref={strip} onScroll={edges}>
                    {images.map((src, k) => (
                      <button key={src} type="button" className="lb-thumb" onClick={() => setZoom(k)}
                        aria-label={g.goTo(k + 1)} aria-current={k === zoom || undefined}>
                        <Image src={src} alt="" fill sizes="96px" />
                      </button>
                    ))}
                  </div>
                  {!(edge.start && edge.end) && (
                    <button type="button" className="lb-strip-nav" onClick={() => slide(1)} disabled={edge.end} aria-label={g.thumbsNext}>›</button>
                  )}
                </div>
              </>
            )}
          </>
        )}
      </dialog>
    </div>
  );
}
