# Portafolio de Cristhoper Castillo — Diseño

Fecha: 2026-10-05
Estado: aprobado en conversación, pendiente revisión del spec

## 1. Objetivo

Portafolio web extraordinario (no plantilla) que muestre todos los proyectos de software de Cristhoper Castillo para conseguir **empleo y clientes freelance** por igual. Debe permitir agregar proyectos nuevos desde un panel de administración sin tocar código.

### Criterios de éxito
- Diseño visual distintivo, aprobado previamente en Claude Design.
- Lighthouse ≥ 90 en rendimiento y accesibilidad.
- Agregar un proyecto = llenar un formulario en `/keystatic` → en línea en ~1 min.
- `next build` sin errores.

### Fuera de alcance (YAGNI)
- Multi-idioma (solo español; inglés se agrega después si se necesita).
- Blog, comentarios, analytics, formulario de contacto con backend (se usa `mailto:`).
- Suite de tests automatizados (no hay lógica de negocio).

## 2. Identidad

| Campo | Valor |
|---|---|
| Nombre mostrado | Cristhoper Castillo (nombre completo: Wagner Cristhoper Castillo Castro) |
| Rol | Ingeniero en Ciencias de la Computación · Full-Stack Developer |
| Email | wagner.cristhoper.castillo@gmail.com |
| LinkedIn | https://www.linkedin.com/in/wagner-cristhoper/ |
| GitHub | https://github.com/wagnercastillo |
| Idioma | Español |

## 3. Estructura del sitio

1. **Hero** — nombre, rol, propuesta de valor en una línea, CTAs "Ver proyectos" / "Contactar", efecto visual fuerte.
2. **Proyectos destacados** — 4–5 en formato grande (Evalia, SGT, SKF/EDF, AppMechanic, GMX).
3. **Grilla de todos los proyectos** — filtrable por categoría (Cliente / Producto / Personal / POC).
4. **Detalle de proyecto** `/proyectos/[slug]` — problema, solución, stack, features, capturas, enlaces, cliente.
5. **Stack y experiencia** — tecnologías agrupadas y clientes con los que trabajó.
6. **Sobre mí y contacto** — email, LinkedIn, GitHub, CV descargable (si existe).
7. **404** con el diseño del sitio.

## 4. Arquitectura

- **Next.js (App Router) + TypeScript + Tailwind CSS + Keystatic.**
- Contenido en archivos dentro del repo; páginas generadas estáticamente en build (SSG).
- Animaciones: CSS primero; `motion` solo si el diseño aprobado lo exige.
- `next/image` para imágenes; metadata Open Graph por proyecto; `sitemap.ts`.
- Ubicación: `C:\Users\Cristhoper\Documents\GitHub\portfolio`.

### Keystatic
- Panel en `/keystatic`.
- Storage `local` en desarrollo, `github` en producción (repo `wagnercastillo/portfolio`). Solo usuarios con permiso de escritura en el repo pueden editar.
- Guardar en producción → commit al repo → Vercel redespliega.

## 5. Modelo de datos

### Colección `proyectos` — `content/proyectos/<slug>.mdoc`, imágenes en `public/proyectos/<slug>/`

| Campo | Tipo | Notas |
|---|---|---|
| `titulo` | slug field | genera el slug |
| `resumen` | texto, máx. 160 | usado en tarjetas y OG |
| `cliente` | texto opcional | |
| `categoria` | select | Cliente / Producto / Personal / POC |
| `stack` | array de texto | |
| `destacado` | boolean | aparece en sección destacados |
| `orden` | entero | orden ascendente en la grilla |
| `fecha` | date | |
| `estado` | select | En producción / En desarrollo / Completado |
| `portada` | image opcional | sin imagen → placeholder generado con el diseño |
| `galeria` | array de image | |
| `demo` | url opcional | sin valor → no se renderiza botón |
| `repo` | url opcional | sin valor → no se renderiza botón |
| `contenido` | markdoc | problema → solución → features |

### Singleton `perfil` — `content/perfil.yaml`
nombre, rol, bio, email, linkedin, github, cv (archivo PDF opcional), tecnologías (array).

## 6. Contenido inicial (16 proyectos, clientes con nombre real)

| Proyecto | Categoría | Cliente | Estado | Stack principal | Destacado |
|---|---|---|---|---|---|
| Evalia | Producto | Teams4Soft | En producción (evaliarh.com) | NestJS 11, Next.js 16, PostgreSQL, MinIO, IA (Claude/Gemini) | ✓ |
| SGT — Gestión de turnos | Cliente | Cooperativa JEP | Completado | NestJS, Prisma, Next.js 16, Tauri v2, WebSocket, LDAP | ✓ |
| RUL Drivetrain G80 | POC | EDF / SKF Industrial México | Completado | Python FastAPI, Weibull, Next.js | ✓ |
| AppMechanic | Producto | — | En desarrollo | Nx, NestJS, Prisma, Redis, Flutter, Socket.IO, FCM | ✓ |
| Migración GMX Seguros | Cliente | GMX | En desarrollo | .NET microservicios, SQL Server, VB legacy | ✓ |
| Nexus — Inventario TI | Cliente | Cooperativa JEP | Completado | NestJS, Prisma, PostgreSQL, Redis, MinIO, React, AD | |
| FIT Knowledge Base | Cliente | Cooperativa JEP | Completado | NestJS, Prisma, PostgreSQL FTS, Next.js 16, LDAP | |
| Atlas | Cliente | Cooperativa JEP | Completado | React, NestJS GraphQL, PostgreSQL, LDAP | |
| RH (antecesor de Evalia) | Producto | Teams4Soft | Completado | Express, TypeORM, Next.js 15, IA | |
| Quiniela Mundial 2026 | Producto | Teams4Soft | En producción | NestJS, React, TanStack Query, Google OAuth | |
| POC Cotizaciones | POC | Teams4Soft | Completado | Nx, NestJS, Prisma, MongoDB, React MUI | |
| Scrum Poker | Personal | — | Completado | NestJS, Prisma, socket.io, Next.js | |
| Flujo (TodoList) | Personal | — | Completado | Flutter web, go_router, pdf | |
| WindPi — Predicción eólica | Personal | — | Completado | LSTM, Flask, Celery, NestJS GraphQL, React | |
| Videos con Remotion | Personal | — | Completado | Remotion, React, FFmpeg | |
| Recepcionista WA | Producto | — | En desarrollo | WhatsApp (360dialog), Google Calendar | |

Excluidos: WagnerCastillo (privado), KellyRomero (tesis ajena), JEP (script 3CX), Claude (legacy GMX), ColasJEP (restos), freshqc-web (no propio). Fuente de descripciones: README/CLAUDE.md de cada repo en `Documents/GitHub/`.

Portadas iniciales = placeholders; el usuario sube capturas reales luego desde el panel.

## 7. Flujo de diseño visual (Claude Design)

1. Crear diseño en canvas de claude.ai con hero, destacados, grilla, detalle y contacto (desktop + móvil).
2. Presentar 2–3 direcciones visuales (p. ej. editorial oscuro, bento grid técnico, minimal de lujo).
3. Iterar hasta aprobación. El diseño aprobado es la referencia que el código debe igualar.

## 8. Despliegue

- Repo GitHub `wagnercastillo/portfolio` + Vercel. Ambos son acciones externas: requieren confirmación explícita del usuario antes de ejecutarse.
- Variables Keystatic GitHub App (`KEYSTATIC_GITHUB_CLIENT_ID`, `KEYSTATIC_GITHUB_CLIENT_SECRET`, `KEYSTATIC_SECRET`, `NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG`) en Vercel.

## 9. Errores y casos límite

- Proyecto sin portada → placeholder generado.
- Enlace vacío → botón no se renderiza.
- Slug inexistente → 404 estilizado.
- Schema inválido → falla `next build` (detección temprana).

## 10. Verificación

- `next build` limpio.
- Lighthouse ≥ 90 performance / accesibilidad.
- Prueba manual: crear proyecto en `/keystatic` local → aparece en grilla y detalle.
