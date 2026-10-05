# Diseño aprobado

- Referencia: `docs/design/reference.html` (abrir en el navegador; es la fuente de verdad visual)
- Canvas Claude Design (exploración inicial, 3 direcciones): https://claude.ai/artifact/BpF3KPcWYKhMtaG7zCc6qq
- Dirección: B · Bento técnico (tema claro) + colores de A · Editorial Noir (tema oscuro), con botón de tema
- Fecha aprobación: 2026-10-05

## Tokens

| Token | Claro | Oscuro |
|---|---|---|
| --bg | #EEF0F3 | #0B0B0C |
| --surface | #FFFFFF | #161615 |
| --surface-2 | #EEF0F3 | #1F1F1D |
| --fg | #0E1116 | #EDEAE3 |
| --muted | #4A5260 | #8C8A85 |
| --accent | #2346E0 | #D4FF3A |
| --on-accent | #FFFFFF | #0B0B0C |
| --inv-bg | #0E1116 | #EDEAE3 |
| --inv-fg | #FFFFFF | #0B0B0C |
| --inv-muted | #8A93A3 | #55524C |
| --ok-bg / --ok-fg / --ok-dot | #E8F7EE / #11663A / #18A058 | rgba(212,255,58,.1) / #D4FF3A / #D4FF3A |
| --font-display | Schibsted Grotesk (400/500/700/800) | |
| --font-mono | JetBrains Mono (400/500) | |
| --radius | 20px (tarjetas), 12–14px (internos) | |

## Notas de movimiento

1. Titular hero: palabras suben una a una al cargar (rise, 70 ms de escalón).
2. Badge "Disponible": punto con ping infinito.
3. Contador "16": cuenta 0→N al entrar en viewport (1,2 s, ease-out cubic).
4. Marquee de tecnologías infinito, pausa en hover.
5. Reveal al scroll escalonado (IntersectionObserver, translate + opacity).
6. Spotlight radial que sigue al cursor en tarjetas.
7. Barras del gráfico de Evalia crecen al entrar.
8. Tablero de turnos SGT: número cambia cada 2,6 s con flip.
9. Filtros: pill deslizante + tarjetas con pop escalonado.
10. Botones magnéticos.
11. Text scramble en títulos de sección al entrar.
12. Cursor personalizado (punto + anillo, "Ver →" sobre tarjetas) con botón para desactivarlo (persistido).
13. Tilt 3D en tarjetas.
14. Sección "Trayectoria": scroll horizontal fijado (sticky) con barra de progreso; carrusel en móvil.
15. Easter egg Konami (↑↑↓↓←→←→BA o 5 toques al logo): confeti + carta de Scrum Poker.
16. Cambio de tema con revelado circular (View Transitions).

Todas respetan `prefers-reduced-motion`.
