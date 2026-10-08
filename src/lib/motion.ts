/** Cuánto se ha recorrido un bloque de `height` px al hacer scroll `y` (0 → 1). */
export const scrollProgress = (y: number, height: number) => (height > 0 ? Math.min(Math.max(y / height, 0), 1) : 0);
