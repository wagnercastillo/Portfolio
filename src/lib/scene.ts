// Generadores deterministas de la escena "Loja de noche" (mismo resultado en servidor y cliente).

/** PRNG pequeño y determinista (mulberry32). */
function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const W = 1440, H = 400;
const r1 = (n: number) => Math.round(n * 10) / 10;

/** Silueta de cordillera como path SVG cerrado en un viewBox 1440×400. */
export function ridge(seed: number, { base, amp, points }: { base: number; amp: number; points: number }) {
  const rand = rng(seed);
  const pts: [number, number][] = [];
  let drift = 0;
  for (let i = 0; i <= points; i++) {
    drift = drift * 0.55 + (rand() - 0.5) * 1.4; // picos encadenados, no ruido puro
    const y = Math.min(Math.max(base - Math.abs(drift) * amp - rand() * amp * 0.35, 0), H);
    pts.push([r1((i / points) * W), r1(y)]);
  }
  // curva suave: cada pico es punto de control y la curva pasa por los puntos medios
  const curve = pts.slice(1, -1).map(([x, y], i) => {
    const [nx, ny] = pts[i + 2];
    return `Q${x},${y} ${r1((x + nx) / 2)},${r1((y + ny) / 2)}`;
  });
  const [lx, ly] = pts[pts.length - 1];
  return `M0,${H} L0,${pts[0][1]} ${curve.join(' ')} L${lx},${ly} L${W},${H} Z`;
}

/** Puntos de luz (estrellas o ciudad) como lista de box-shadow en vw/vh. */
export function dots(seed: number, count: number, { yMin, yMax, size, colors }: { yMin: number; yMax: number; size: [number, number]; colors: string[] }) {
  const rand = rng(seed);
  return Array.from({ length: count }, () => {
    const x = r1(rand() * 100), y = r1(yMin + rand() * (yMax - yMin));
    const s = r1(size[0] + rand() * (size[1] - size[0]));
    return `${x}vw ${y}vh 0 ${s}px ${colors[Math.floor(rand() * colors.length)]}`;
  }).join(', ');
}

/** Progreso (0 → 1) del recorrido de una escena sticky: `top` del bloque, su alto y el del viewport. */
export function progress(top: number, height: number, viewport: number) {
  const travel = height - viewport;
  return travel > 0 ? Math.min(Math.max(-top / travel, 0), 1) : 0;
}

/** Sección activa para el navbar: la última cuyo inicio (top absoluto) ya pasó `line`. */
export function activeSection(sections: { id: string; top: number }[], line: number) {
  const passed = sections.filter((s) => s.top <= line).sort((a, b) => b.top - a.top);
  return passed[0]?.id ?? null;
}

/** Posición del viajero de la línea de tiempo: de la primera a la última estación según p (0 → 1). */
export const travelerX = (p: number, centers: number[]) =>
  centers.length ? centers[0] + p * (centers[centers.length - 1] - centers[0]) : 0;

/** Estaciones ya alcanzadas por el viajero (con medio píxel de tolerancia). */
export const litCount = (x: number, centers: number[]) => centers.filter((c) => c <= x + 0.5).length;
