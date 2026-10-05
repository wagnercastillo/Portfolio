# Portafolio Cristhoper Castillo — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Portafolio Next.js con diseño distintivo (aprobado en Claude Design) que muestra 16 proyectos y permite agregar más desde un panel Keystatic.

**Architecture:** Next.js App Router genera todo estáticamente leyendo archivos de `content/` con el reader de Keystatic. Keystatic sirve el panel en `/keystatic` (storage local en dev, GitHub en prod). La lógica pura (orden, filtros, placeholder de portada) vive en `src/lib/projects.ts` con tests Vitest; los componentes solo renderizan.

**Tech Stack:** Next.js (latest, App Router, TypeScript), Tailwind CSS v4, `@keystatic/core`, `@keystatic/next`, `@markdoc/markdoc`, Vitest.

**Spec:** `docs/superpowers/specs/2026-10-05-portfolio-design.md`

## Global Constraints

- Idioma del sitio: español. Nombre mostrado: "Cristhoper Castillo".
- Rol: "Ingeniero en Ciencias de la Computación · Full-Stack Developer".
- Email `wagner.cristhoper.castillo@gmail.com`, LinkedIn `https://www.linkedin.com/in/wagner-cristhoper/`, GitHub `https://github.com/wagnercastillo`.
- Repo GitHub de producción para Keystatic: `wagnercastillo/portfolio`.
- Categorías exactas: `Cliente`, `Producto`, `Personal`, `POC`. Estados exactos: `En producción`, `En desarrollo`, `Completado`.
- `resumen` máximo 160 caracteres.
- Clientes con nombre real (Cooperativa JEP, EDF / SKF Industrial México, GMX, Teams4Soft).
- Excluir: WagnerCastillo, KellyRomero, JEP, Claude, ColasJEP, freshqc-web.
- Todas las páginas públicas estáticas (SSG). Nada de backend propio, contacto vía `mailto:`.
- Animaciones con CSS; agregar `motion` solo si el diseño aprobado lo exige.
- Lighthouse ≥ 90 performance y accesibilidad.
- Crear repo GitHub / proyecto Vercel requiere confirmación explícita del usuario.

## Review Focus

1. Proyecto sin `portada` → se ve placeholder generado (color estable por slug + iniciales), nunca imagen rota. Test en Task 3.
2. `demo`/`repo` vacíos → no aparece botón ni enlace vacío. Test en Task 3 (`projectLinks`).
3. Slug inexistente en `/proyectos/xxx` → 404 estilizado, no error 500. Verificación en Task 6.
4. Categoría filtrada sin proyectos → el chip no aparece (solo categorías presentes). Test en Task 3 (`categoriesOf`).
5. Títulos largos / muchos items de stack a 360 px de ancho → sin scroll horizontal. Verificación manual en Task 8.

---

## File Structure

```
portfolio/
├─ keystatic.config.ts                 # schema: colección proyectos + singleton perfil
├─ content/
│  ├─ perfil.yaml
│  └─ proyectos/<slug>.mdoc            # 16 proyectos iniciales
├─ public/proyectos/<slug>/            # imágenes subidas desde el panel
├─ docs/design/README.md               # link al diseño aprobado + tokens
├─ src/
│  ├─ lib/
│  │  ├─ projects.ts                   # lógica pura (orden, filtros, cover, links)
│  │  ├─ projects.test.ts
│  │  └─ content.ts                    # reader Keystatic → tipos de la app
│  ├─ components/
│  │  ├─ Hero.tsx
│  │  ├─ FeaturedProjects.tsx
│  │  ├─ ProjectGrid.tsx               # client: filtro por categoría
│  │  ├─ ProjectCard.tsx
│  │  ├─ ProjectCover.tsx              # imagen o placeholder
│  │  ├─ ProjectLinks.tsx
│  │  ├─ StackSection.tsx
│  │  └─ Contact.tsx
│  └─ app/
│     ├─ layout.tsx  globals.css  page.tsx  not-found.tsx  sitemap.ts
│     ├─ proyectos/[slug]/page.tsx
│     ├─ keystatic/layout.tsx
│     ├─ keystatic/[[...params]]/page.tsx
│     └─ api/keystatic/[...params]/route.ts
```

---

### Task 1: Diseño visual en Claude Design (gate humano)

**Files:**
- Create: `docs/design/README.md`

**Interfaces:**
- Produces: tokens de diseño (colores, tipografías, radios, espaciado) que Task 7 copia a `globals.css`, y URL del diseño aprobado que Task 8 usa como referencia.

- [ ] **Step 1:** Ejecutar `Artifact` con `action: "quickstart"`, `intent: "design"`. Seguir las instrucciones del tipo devuelto.
- [ ] **Step 2:** Crear diseño con 3 direcciones visuales (Editorial oscuro, Bento grid técnico, Minimal de lujo). Cada una muestra: hero, 2 destacados (Evalia, SGT), 3 tarjetas de grilla, detalle de Evalia, contacto. Desktop 1440 px y móvil 390 px. Usar contenido real del spec §6.
- [ ] **Step 3:** Presentar al usuario. Iterar hasta aprobación explícita de UNA dirección. No continuar sin aprobación.
- [ ] **Step 4:** Escribir `docs/design/README.md`:

```markdown
# Diseño aprobado

- URL: <url del artifact aprobado>
- Dirección: <nombre>
- Fecha aprobación: <YYYY-MM-DD>

## Tokens
| Token | Valor |
|---|---|
| --color-bg | ... |
| --color-surface | ... |
| --color-fg | ... |
| --color-muted | ... |
| --color-accent | ... |
| --font-display | <familia Google Fonts> |
| --font-body | <familia Google Fonts> |
| --radius | ... |

## Notas de movimiento
<lista de animaciones del diseño: qué elemento, trigger, duración>
```

(Los valores se copian literalmente del diseño aprobado; el archivo no se commitea con `...`.)

- [ ] **Step 5:** Commit

```bash
git add docs/design/README.md
git commit -m "docs: record approved visual design"
```

---

### Task 2: Scaffold Next.js + Keystatic

**Files:**
- Create: proyecto Next.js en la raíz, `keystatic.config.ts`, `src/app/keystatic/layout.tsx`, `src/app/keystatic/keystatic.tsx`, `src/app/keystatic/[[...params]]/page.tsx`, `src/app/api/keystatic/[...params]/route.ts`

**Interfaces:**
- Produces: `keystatic.config.ts` default export `config` con colección `proyectos` y singleton `perfil` (nombres de campo exactos de la tabla del spec §5).

- [ ] **Step 1: Scaffold** (la carpeta `docs/` está permitida por create-next-app)

```bash
npx create-next-app@latest . --ts --tailwind --app --eslint --src-dir --import-alias "@/*" --use-npm --yes
npm i @keystatic/core @keystatic/next @markdoc/markdoc
npm i -D vitest
```

Si npm reporta conflicto de peer deps con la versión de Next, repetir con `--legacy-peer-deps`.

- [ ] **Step 2: `keystatic.config.ts`**

```ts
import { config, collection, singleton, fields } from '@keystatic/core';

export default config({
  storage:
    process.env.NODE_ENV === 'production'
      ? { kind: 'github', repo: 'wagnercastillo/portfolio' }
      : { kind: 'local' },
  ui: { brand: { name: 'Portafolio' } },
  collections: {
    proyectos: collection({
      label: 'Proyectos',
      slugField: 'titulo',
      path: 'content/proyectos/*',
      format: { contentField: 'contenido' },
      entryLayout: 'content',
      schema: {
        titulo: fields.slug({ name: { label: 'Título' } }),
        resumen: fields.text({
          label: 'Resumen',
          multiline: true,
          validation: { length: { min: 1, max: 160 } },
        }),
        cliente: fields.text({ label: 'Cliente' }),
        categoria: fields.select({
          label: 'Categoría',
          options: [
            { label: 'Cliente', value: 'Cliente' },
            { label: 'Producto', value: 'Producto' },
            { label: 'Personal', value: 'Personal' },
            { label: 'POC', value: 'POC' },
          ],
          defaultValue: 'Producto',
        }),
        stack: fields.array(fields.text({ label: 'Tecnología' }), {
          label: 'Stack',
          itemLabel: (p) => p.value,
        }),
        destacado: fields.checkbox({ label: 'Destacado' }),
        orden: fields.integer({ label: 'Orden', defaultValue: 100 }),
        fecha: fields.date({ label: 'Fecha', validation: { isRequired: true } }),
        estado: fields.select({
          label: 'Estado',
          options: [
            { label: 'En producción', value: 'En producción' },
            { label: 'En desarrollo', value: 'En desarrollo' },
            { label: 'Completado', value: 'Completado' },
          ],
          defaultValue: 'Completado',
        }),
        portada: fields.image({
          label: 'Portada',
          directory: 'public/proyectos',
          publicPath: '/proyectos/',
        }),
        galeria: fields.array(
          fields.image({ label: 'Imagen', directory: 'public/proyectos', publicPath: '/proyectos/' }),
          { label: 'Galería' },
        ),
        demo: fields.url({ label: 'Demo (URL)' }),
        repo: fields.url({ label: 'Repositorio (URL)' }),
        contenido: fields.markdoc({ label: 'Contenido' }),
      },
    }),
  },
  singletons: {
    perfil: singleton({
      label: 'Perfil',
      path: 'content/perfil',
      schema: {
        nombre: fields.text({ label: 'Nombre' }),
        rol: fields.text({ label: 'Rol' }),
        bio: fields.text({ label: 'Bio', multiline: true }),
        email: fields.text({ label: 'Email' }),
        linkedin: fields.url({ label: 'LinkedIn' }),
        github: fields.url({ label: 'GitHub' }),
        cv: fields.file({ label: 'CV (PDF)', directory: 'public/cv', publicPath: '/cv/' }),
        tecnologias: fields.array(fields.text({ label: 'Tecnología' }), {
          label: 'Tecnologías',
          itemLabel: (p) => p.value,
        }),
      },
    }),
  },
});
```

- [ ] **Step 3: Rutas Keystatic**

`src/app/keystatic/layout.tsx`
```tsx
import KeystaticApp from './keystatic';
export default function Layout() {
  return <KeystaticApp />;
}
```

`src/app/keystatic/keystatic.tsx`
```tsx
'use client';
import { makePage } from '@keystatic/next/ui/app';
import config from '../../../keystatic.config';
export default makePage(config);
```

`src/app/keystatic/[[...params]]/page.tsx`
```tsx
export default function Page() {
  return null;
}
```

`src/app/api/keystatic/[...params]/route.ts`
```ts
import { makeRouteHandler } from '@keystatic/next/route-handler';
import config from '../../../../../keystatic.config';
export const { POST, GET } = makeRouteHandler({ config });
```


- [ ] **Step 4: Verificar**

Run: `npm run dev` y abrir `http://localhost:3000/keystatic`
Expected: panel con "Proyectos" y "Perfil" listados.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: scaffold Next.js with Keystatic admin"
```

---

### Task 3: Lógica pura de proyectos (TDD)

**Files:**
- Create: `src/lib/projects.ts`, `src/lib/projects.test.ts`
- Modify: `package.json` (script `"test": "vitest run"`)

**Interfaces:**
- Produces:
  ```ts
  export type Categoria = 'Cliente' | 'Producto' | 'Personal' | 'POC';
  export type Estado = 'En producción' | 'En desarrollo' | 'Completado';
  export interface Project {
    slug: string; titulo: string; resumen: string; cliente: string;
    categoria: Categoria; stack: string[]; destacado: boolean; orden: number;
    fecha: string; estado: Estado; portada: string | null; galeria: string[];
    demo: string | null; repo: string | null;
  }
  export function sortProjects(p: Project[]): Project[];      // orden asc, luego fecha desc
  export function featured(p: Project[]): Project[];          // destacados ordenados
  export function categoriesOf(p: Project[]): Categoria[];    // presentes, en orden fijo
  export function byCategory(p: Project[], c: Categoria | 'Todos'): Project[];
  export function coverHue(slug: string): number;             // 0–359, estable
  export function initials(titulo: string): string;           // máx 2 letras, mayúsculas
  export function projectLinks(p: Pick<Project,'demo'|'repo'>): { label: string; href: string }[];
  ```

- [ ] **Step 1: Test que falla** — `src/lib/projects.test.ts`

```ts
import { describe, it, expect } from 'vitest';
import {
  sortProjects, featured, categoriesOf, byCategory,
  coverHue, initials, projectLinks, type Project,
} from './projects';

const base: Project = {
  slug: 'a', titulo: 'A', resumen: '', cliente: '', categoria: 'Producto',
  stack: [], destacado: false, orden: 100, fecha: '2025-01-01',
  estado: 'Completado', portada: null, galeria: [], demo: null, repo: null,
};
const p = (o: Partial<Project>): Project => ({ ...base, ...o });

describe('sortProjects', () => {
  it('ordena por orden asc y luego fecha desc', () => {
    const r = sortProjects([
      p({ slug: 'x', orden: 2 }),
      p({ slug: 'y', orden: 1, fecha: '2024-01-01' }),
      p({ slug: 'z', orden: 1, fecha: '2026-01-01' }),
    ]);
    expect(r.map((x) => x.slug)).toEqual(['z', 'y', 'x']);
  });
});

describe('featured', () => {
  it('solo destacados, ordenados', () => {
    const r = featured([p({ slug: 'a', destacado: true, orden: 2 }), p({ slug: 'b' }), p({ slug: 'c', destacado: true, orden: 1 })]);
    expect(r.map((x) => x.slug)).toEqual(['c', 'a']);
  });
});

describe('categoriesOf', () => {
  it('devuelve solo categorías presentes en orden fijo', () => {
    expect(categoriesOf([p({ categoria: 'POC' }), p({ categoria: 'Cliente' }), p({ categoria: 'POC' })]))
      .toEqual(['Cliente', 'POC']);
  });
  it('vacío → []', () => expect(categoriesOf([])).toEqual([]));
});

describe('byCategory', () => {
  const list = [p({ slug: 'a', categoria: 'POC' }), p({ slug: 'b', categoria: 'Cliente' })];
  it('Todos devuelve todo', () => expect(byCategory(list, 'Todos')).toHaveLength(2));
  it('filtra', () => expect(byCategory(list, 'POC').map((x) => x.slug)).toEqual(['a']));
});

describe('coverHue', () => {
  it('estable y en rango', () => {
    expect(coverHue('evalia')).toBe(coverHue('evalia'));
    for (const s of ['a', 'evalia', 'sgt', 'x'.repeat(200)]) {
      const h = coverHue(s);
      expect(h).toBeGreaterThanOrEqual(0);
      expect(h).toBeLessThan(360);
    }
  });
});

describe('initials', () => {
  it('dos palabras', () => expect(initials('Scrum Poker')).toBe('SP'));
  it('una palabra', () => expect(initials('Evalia')).toBe('EV'));
  it('ignora símbolos', () => expect(initials('SGT — Gestión de turnos')).toBe('SG'));
});

describe('projectLinks', () => {
  it('omite vacíos', () => {
    expect(projectLinks({ demo: null, repo: '' })).toEqual([]);
    expect(projectLinks({ demo: 'https://x.com', repo: null })).toEqual([{ label: 'Ver demo', href: 'https://x.com' }]);
  });
});
```

- [ ] **Step 2:** Agregar `"test": "vitest run"` a scripts de `package.json`. Run: `npm test` → Expected: FAIL "Failed to resolve import ./projects".

- [ ] **Step 3: Implementación** — `src/lib/projects.ts`

```ts
export type Categoria = 'Cliente' | 'Producto' | 'Personal' | 'POC';
export type Estado = 'En producción' | 'En desarrollo' | 'Completado';

export interface Project {
  slug: string;
  titulo: string;
  resumen: string;
  cliente: string;
  categoria: Categoria;
  stack: string[];
  destacado: boolean;
  orden: number;
  fecha: string;
  estado: Estado;
  portada: string | null;
  galeria: string[];
  demo: string | null;
  repo: string | null;
}

const CATEGORIAS: Categoria[] = ['Cliente', 'Producto', 'Personal', 'POC'];

export const sortProjects = (p: Project[]) =>
  [...p].sort((a, b) => a.orden - b.orden || b.fecha.localeCompare(a.fecha));

export const featured = (p: Project[]) => sortProjects(p.filter((x) => x.destacado));

export const categoriesOf = (p: Project[]) =>
  CATEGORIAS.filter((c) => p.some((x) => x.categoria === c));

export const byCategory = (p: Project[], c: Categoria | 'Todos') =>
  c === 'Todos' ? p : p.filter((x) => x.categoria === c);

export const coverHue = (slug: string) =>
  [...slug].reduce((h, ch) => (h * 31 + ch.charCodeAt(0)) % 360, 7);

export const initials = (titulo: string) => {
  const words = titulo.split(/[^\p{L}\p{N}]+/u).filter(Boolean);
  const s = words.length > 1 ? words[0][0] + words[1][0] : (words[0] ?? '').slice(0, 2);
  return s.toUpperCase();
};

export const projectLinks = ({ demo, repo }: Pick<Project, 'demo' | 'repo'>) =>
  [
    { label: 'Ver demo', href: demo },
    { label: 'Código', href: repo },
  ].filter((l): l is { label: string; href: string } => !!l.href);
```

- [ ] **Step 4:** Run: `npm test` → Expected: todos PASS.
- [ ] **Step 5: Commit**

```bash
git add src/lib/projects.ts src/lib/projects.test.ts package.json
git commit -m "feat: add project sorting, filtering and cover helpers"
```

---

### Task 4: Contenido inicial (perfil + 16 proyectos) y capa de lectura

**Files:**
- Create: `content/perfil.yaml`, `content/proyectos/*.mdoc` (16), `src/lib/content.ts`

**Interfaces:**
- Consumes: `Project`, `Categoria`, `Estado` de `src/lib/projects.ts`; `config` de `keystatic.config.ts`.
- Produces:
  ```ts
  export async function getProjects(): Promise<Project[]>;            // ya ordenados
  export async function getProject(slug: string): Promise<{ project: Project; body: import('react').ReactNode } | null>;
  export async function getPerfil(): Promise<Perfil>;
  export interface Perfil { nombre: string; rol: string; bio: string; email: string; linkedin: string; github: string; cv: string | null; tecnologias: string[] }
  ```

- [ ] **Step 1: `content/perfil.yaml`**

```yaml
nombre: Cristhoper Castillo
rol: Ingeniero en Ciencias de la Computación · Full-Stack Developer
bio: >-
  Construyo plataformas completas de punta a punta: APIs en NestJS, interfaces en Next.js y React,
  apps móviles en Flutter e integraciones con IA. He entregado sistemas en producción para banca
  cooperativa, seguros, energía y recursos humanos.
email: wagner.cristhoper.castillo@gmail.com
linkedin: https://www.linkedin.com/in/wagner-cristhoper/
github: https://github.com/wagnercastillo
tecnologias:
  - TypeScript
  - NestJS
  - Next.js
  - React
  - Flutter
  - PostgreSQL
  - Prisma
  - TypeORM
  - Redis
  - Docker
  - .NET
  - Python
  - LDAP / Active Directory
  - Claude / Gemini API
```

- [ ] **Step 2: 16 archivos `.mdoc`.** Formato exacto (frontmatter YAML + cuerpo Markdoc). Crear cada archivo con estos valores:

`content/proyectos/evalia.mdoc`
```
---
titulo: Evalia
resumen: Plataforma de RRHH con evaluaciones de desempeño asistidas por IA, LMS, nómina y clima laboral.
cliente: Teams4Soft
categoria: Producto
stack: [NestJS, Next.js, React, PostgreSQL, TypeORM, MinIO, Claude API, Gemini]
destacado: true
orden: 1
fecha: 2026-07-01
estado: En producción
galeria: []
demo: https://www.evaliarh.com
---
## Problema
La gestión del talento vivía en hojas de cálculo: evaluaciones manuales, CVs dispersos y sin retroalimentación objetiva.

## Solución
Plataforma integral de RRHH con evaluaciones ponderadas por competencias del cargo y retroalimentación generada por IA.

## Funcionalidades
- Evaluaciones de desempeño con puntaje ponderado y feedback IA
- Gestión de empleados, CV y organigrama
- LMS, nómina y equidad de género
- Clima laboral y squad health check
```

`content/proyectos/sgt-gestion-de-turnos.mdoc`
```
---
titulo: SGT — Gestión de turnos
resumen: Sistema de turnos para agencias de Cooperativa JEP con nodo local offline y sincronización con la central.
cliente: Cooperativa JEP
categoria: Cliente
stack: [NestJS, Prisma, PostgreSQL, Next.js, Tauri, WebSocket, LDAP]
destacado: true
orden: 2
fecha: 2026-09-01
estado: Completado
galeria: []
---
## Problema
Las agencias necesitaban gestionar colas de atención aunque se cayera la conexión con la central.

## Solución
Arquitectura de seis aplicaciones: servidor central, nodo local por agencia con sincronización bidireccional, kiosko, consola de operador y pantalla de TV.

## Funcionalidades
- Kiosko con emisión de turnos y QR
- Consola de operador y pantalla de llamado
- Operación offline con sincronización bidireccional
- Reportes consolidados en CSV y autenticación con Active Directory
```

`content/proyectos/rul-drivetrain-g80.mdoc`
```
---
titulo: RUL Drivetrain G80
resumen: Dashboard de vida remanente para 162 aerogeneradores G80, con modelos Weibull e índices de salud.
cliente: EDF / SKF Industrial México
categoria: POC
stack: [Python, FastAPI, Weibull, Next.js]
destacado: true
orden: 3
fecha: 2026-08-01
estado: Completado
galeria: []
---
## Problema
EDF necesitaba estimar la vida remanente del tren de potencia de su flota para su permiso regulatorio y su plan de mantenimiento.

## Solución
Prueba de concepto con modelos de confiabilidad Weibull y regresión de tendencia, expuestos en un dashboard de flota.

## Funcionalidades
- Vista de flota con semáforo por turbina
- Health Index y PQ Index
- Bandas de confianza y métricas β, η, R² transparentes
- Modo demo que funciona sin backend
```

`content/proyectos/appmechanic.mdoc`
```
---
titulo: AppMechanic
resumen: App móvil que conecta conductores con mecánicos cercanos para emergencias, citas e historial del vehículo.
cliente: ""
categoria: Producto
stack: [Nx, NestJS, Prisma, PostgreSQL, Redis, Socket.IO, Flutter, FCM, Google Maps]
destacado: true
orden: 4
fecha: 2026-07-01
estado: En desarrollo
galeria: []
repo: https://github.com/wagnercastillo/AppMechanic
---
## Problema
La asistencia mecánica en carretera es informal, sin precios transparentes ni trazabilidad.

## Solución
Plataforma con app Flutter para conductores y talleres, backend NestJS en tiempo real.

## Funcionalidades
- Emergencias en tiempo real con lock en Redis contra doble aceptación
- Mapa de talleres cercanos y agenda de citas
- Historial del vehículo
- Dashboard de KPIs, empleados y sucursales para el taller
```

`content/proyectos/migracion-gmx-seguros.mdoc`
```
---
titulo: Migración GMX Seguros
resumen: Modernización del core de una aseguradora: de VB legacy a microservicios .NET con gateway y workers.
cliente: GMX
categoria: Cliente
stack: [.NET, C#, SQL Server, Microservicios, VB.NET]
destacado: true
orden: 5
fecha: 2026-09-01
estado: En desarrollo
galeria: []
---
## Problema
El core de seguros (contabilidad, siniestros, cobranzas, emisión) dependía de un sistema VB monolítico difícil de mantener.

## Solución
Migración progresiva a microservicios .NET detrás de un gateway, con workers para procesos batch.

## Funcionalidades
- APIs de Accounting, Claims, Collections, Security y Backoffice Issuance
- Workers de cierres mensuales y prorrateo
- Migración de stored procedures de SQL Server
- Despliegues por ambiente
```

`content/proyectos/nexus-inventario-ti.mdoc`
```
---
titulo: Nexus — Inventario TI
resumen: Inventario de activos tecnológicos y directorio TI para las 65 agencias de Cooperativa JEP.
cliente: Cooperativa JEP
categoria: Cliente
stack: [NestJS, Prisma, PostgreSQL, Redis, MinIO, MongoDB, React, Active Directory]
destacado: false
orden: 6
fecha: 2026-05-01
estado: Completado
galeria: []
---
## Problema
El control de equipos de 65 agencias se llevaba en archivos Excel.

## Solución
Plataforma on-premise de inventario y directorio TI con autenticación corporativa.

## Funcionalidades
- Importación masiva desde Excel
- Directorio TI por agencia
- Autenticación con Active Directory
- Despliegue on-premise con Docker y Nginx
```

`content/proyectos/fit-knowledge-base.mdoc`
```
---
titulo: FIT Knowledge Base
resumen: Base de conocimiento para documentar transacciones del sistema bancario FIT con flujo de aprobación.
cliente: Cooperativa JEP
categoria: Cliente
stack: [NestJS, Prisma, PostgreSQL, Next.js, React Query, LDAP]
destacado: false
orden: 7
fecha: 2026-06-01
estado: Completado
galeria: []
---
## Problema
La documentación técnica de las transacciones bancarias estaba dispersa y sin control de versiones.

## Solución
Knowledge base con roles, flujo de revisión y búsqueda full-text en español.

## Funcionalidades
- RBAC con 4 roles
- Flujo DRAFT → IN_REVIEW → PUBLISHED
- Versionado con snapshots JSONB y auditoría
- Búsqueda full-text en español con PostgreSQL
```

`content/proyectos/atlas.mdoc`
```
---
titulo: Atlas
resumen: Sistema de gestión de información interna para Cooperativa JEP con API GraphQL y login LDAP.
cliente: Cooperativa JEP
categoria: Cliente
stack: [React, PrimeReact, NestJS, GraphQL, PostgreSQL, LDAP]
destacado: false
orden: 8
fecha: 2025-12-01
estado: Completado
galeria: []
---
## Problema
La cooperativa necesitaba centralizar información interna con acceso corporativo.

## Solución
Aplicación React + API NestJS GraphQL con autenticación LDAP y despliegue en contenedores.

## Funcionalidades
- API GraphQL
- Autenticación LDAP
- Interfaz React con PrimeReact
- Despliegue Docker + Nginx
```

`content/proyectos/rh-recursos-humanos.mdoc`
```
---
titulo: RH — Recursos Humanos
resumen: Sistema de RRHH con CV completo, cargos y competencias; antecesor de Evalia, migrado de Express a NestJS.
cliente: Teams4Soft
categoria: Producto
stack: [Express, NestJS, TypeORM, PostgreSQL, Next.js, Zustand, Cloudinary]
destacado: false
orden: 9
fecha: 2026-03-01
estado: Completado
galeria: []
---
## Problema
Teams4Soft necesitaba gestionar empleados, competencias y CVs en un solo lugar.

## Solución
Sistema RRHH migrado de Express a NestJS con paridad total de endpoints, pruebas Jest y documentación Swagger.

## Funcionalidades
- CV completo: educación, experiencia, skills, idiomas
- Departamentos, cargos y competencias por cargo
- Biblioteca de CVs en Cloudinary
- Evaluaciones con IA
```

`content/proyectos/quiniela-mundial-2026.mdoc`
```
---
titulo: Quiniela Mundial 2026
resumen: Quiniela interna del Mundial 2026 con grupos privados, ranking y bloqueo automático de pronósticos.
cliente: Teams4Soft
categoria: Producto
stack: [NestJS, TypeORM, PostgreSQL, React, TanStack Query, Zustand, Google OAuth]
destacado: false
orden: 10
fecha: 2026-06-01
estado: En producción
galeria: []
---
## Problema
Fomentar la integración del equipo durante el Mundial.

## Solución
App web con login de Google, grupos privados y datos de partidos sincronizados desde football-data.org.

## Funcionalidades
- Bloqueo automático de pronósticos al iniciar el partido
- Ranking y podio por grupo
- Invitación a grupos con QR
- Comentarios con emojis
```

`content/proyectos/poc-cotizaciones.mdoc`
```
---
titulo: POC Cotizaciones
resumen: Prueba de concepto de cotizaciones y renovaciones de seguros con dashboard de coordinador.
cliente: Teams4Soft
categoria: POC
stack: [Nx, NestJS, Prisma, PostgreSQL, MongoDB, React, MUI, Recharts]
destacado: false
orden: 11
fecha: 2026-04-01
estado: Completado
galeria: []
---
## Problema
Validar un flujo digital de cotizaciones y renovaciones para coordinadores.

## Solución
Monorepo Nx con API NestJS, procesador de correos y dashboard React.

## Funcionalidades
- Detalle y seguimiento de cotizaciones
- Dashboard con métricas
- Historial de correos con nodemailer
- Autenticación JWT
```

`content/proyectos/scrum-poker.mdoc`
```
---
titulo: Scrum Poker
resumen: Planning Poker en tiempo real con salas por código, votación Fibonacci e historial de rondas.
cliente: ""
categoria: Personal
stack: [NestJS, Prisma, PostgreSQL, Socket.IO, Next.js]
destacado: false
orden: 12
fecha: 2026-07-01
estado: Completado
galeria: []
repo: https://github.com/CristhoperCastillo/Scrum-Pocket
---
## Problema
Estimar historias en equipos remotos sin herramientas de pago.

## Solución
App en tiempo real con WebSockets y autenticación JWT con refresh rotativo.

## Funcionalidades
- Salas con código de invitación
- Votación Fibonacci con revelado y promedio
- Historial de rondas
- Tests automatizados
```

`content/proyectos/flujo.mdoc`
```
---
titulo: Flujo
resumen: App Flutter para organizar carteras de clientes de crédito con metas mensuales y expedientes en PDF.
cliente: ""
categoria: Personal
stack: [Flutter, Dart, go_router, PDF]
destacado: false
orden: 13
fecha: 2026-09-01
estado: Completado
galeria: []
---
## Problema
Un asesor de crédito necesitaba seguir clientes, requisitos y metas sin depender de un servidor.

## Solución
App Flutter web que guarda todo localmente y exporta expedientes a PDF.

## Funcionalidades
- Wizard de requisitos de crédito
- Expediente exportable a PDF
- Calendario y metas mensuales
- Papelera con retención de 30 días
```

`content/proyectos/windpi-prediccion-eolica.mdoc`
```
---
titulo: WindPi — Predicción eólica
resumen: Predicción de generación de energía eólica con redes LSTM sobre datos de parques españoles.
cliente: ""
categoria: Personal
stack: [Python, LSTM, Flask, Celery, NestJS, GraphQL, React, Redux]
destacado: false
orden: 14
fecha: 2025-04-01
estado: Completado
galeria: []
---
## Problema
Pronosticar la producción de parques eólicos para planificar la energía.

## Solución
Modelo LSTM entrenado con datos 2013–2018, servido mediante microservicios.

## Funcionalidades
- Modelo LSTM en Flask + Celery
- API NestJS GraphQL
- Login JWT y Google OAuth
- Rate limiting por token
```

`content/proyectos/videos-con-remotion.mdoc`
```
---
titulo: Videos con Remotion
resumen: Videos programáticos con React y Remotion: intro personal, TikTok vertical y edición de videos de viaje.
cliente: ""
categoria: Personal
stack: [Remotion, React, TypeScript, FFmpeg]
destacado: false
orden: 15
fecha: 2026-09-01
estado: Completado
galeria: []
---
## Problema
Producir contenido para redes de forma repetible.

## Solución
Composiciones de video escritas en React y renderizadas con Remotion.

## Funcionalidades
- Intro personal animada
- TikTok vertical de 7 escenas
- Flujo para editar videos de viaje
```

`content/proyectos/recepcionista-wa.mdoc`
```
---
titulo: Recepcionista WA
resumen: Micro-SaaS de recordatorios de citas y pagos por WhatsApp para consultorios en Perú.
cliente: ""
categoria: Producto
stack: [NestJS, WhatsApp API, 360dialog, Google Calendar]
destacado: false
orden: 16
fecha: 2026-10-01
estado: En desarrollo
galeria: []
---
## Problema
Los consultorios pierden citas por inasistencias y cobros olvidados.

## Solución
Recepcionista automática por WhatsApp integrada con Google Calendar.

## Funcionalidades
- Recordatorios de cita
- Reprogramación por WhatsApp
- Recordatorios de pago con Yape
- Sincronización con Google Calendar
```

- [ ] **Step 3: `src/lib/content.ts`**

```ts
import 'server-only';
import { createReader } from '@keystatic/core/reader';
import Markdoc from '@markdoc/markdoc';
import React from 'react';
import config from '../../keystatic.config';
import { sortProjects, type Project, type Categoria, type Estado } from './projects';

const reader = createReader(process.cwd(), config);

export interface Perfil {
  nombre: string; rol: string; bio: string; email: string;
  linkedin: string; github: string; cv: string | null; tecnologias: string[];
}

type Entry = NonNullable<Awaited<ReturnType<typeof reader.collections.proyectos.read>>>;

const toProject = (slug: string, e: Entry): Project => ({
  slug,
  titulo: e.titulo,
  resumen: e.resumen,
  cliente: e.cliente,
  categoria: e.categoria as Categoria,
  stack: [...e.stack],
  destacado: e.destacado,
  orden: e.orden ?? 100,
  fecha: e.fecha ?? '',
  estado: e.estado as Estado,
  portada: e.portada ?? null,
  galeria: e.galeria.filter((g): g is string => !!g),
  demo: e.demo || null,
  repo: e.repo || null,
});

export async function getProjects(): Promise<Project[]> {
  const all = await reader.collections.proyectos.all();
  return sortProjects(all.map(({ slug, entry }) => toProject(slug, entry)));
}

export async function getProject(slug: string) {
  const e = await reader.collections.proyectos.read(slug);
  if (!e) return null;
  const { node } = await e.contenido();
  const body = Markdoc.renderers.react(Markdoc.transform(node), React);
  return { project: toProject(slug, e), body };
}

export async function getPerfil(): Promise<Perfil> {
  const p = await reader.singletons.perfil.readOrThrow();
  return { ...p, cv: p.cv ?? null, tecnologias: [...p.tecnologias] };
}
```

Run: `npm i server-only`

- [ ] **Step 4: Verificar** — abrir `http://localhost:3000/keystatic`, colección Proyectos.
Expected: 16 entradas listadas, abrir Evalia muestra todos los campos sin error de validación. Run: `npx tsc --noEmit` → Expected: sin errores.

- [ ] **Step 5: Commit**

```bash
git add content src/lib/content.ts package.json package-lock.json
git commit -m "feat: add initial profile and 16 projects content"
```

---

### Task 5: Componentes base y página principal

**Files:**
- Create: `src/components/ProjectCover.tsx`, `ProjectLinks.tsx`, `ProjectCard.tsx`, `ProjectGrid.tsx`, `FeaturedProjects.tsx`, `Hero.tsx`, `StackSection.tsx`, `Contact.tsx`
- Modify: `src/app/page.tsx` (reemplazar), `src/app/layout.tsx`

**Interfaces:**
- Consumes: `getProjects`, `getPerfil`, `Perfil` (Task 4); `featured`, `categoriesOf`, `byCategory`, `coverHue`, `initials`, `projectLinks`, `Project` (Task 3).
- Produces: `<ProjectCover project size>`, `<ProjectLinks project>` reutilizados en Task 6.

Clases de color usan tokens `bg-bg`, `bg-surface`, `text-fg`, `text-muted`, `text-accent`, `border-line`, `font-display` definidos en Task 7. Este task fija estructura y semántica; Task 8 aplica el diseño aprobado.

- [ ] **Step 1: `ProjectCover.tsx`**

```tsx
import Image from 'next/image';
import { coverHue, initials, type Project } from '@/lib/projects';

export function ProjectCover({ project, priority = false }: { project: Project; priority?: boolean }) {
  if (project.portada) {
    return (
      <div className="relative aspect-[16/10] overflow-hidden rounded-[var(--radius)]">
        <Image src={project.portada} alt={`Portada de ${project.titulo}`} fill priority={priority}
          sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
      </div>
    );
  }
  const h = coverHue(project.slug);
  return (
    <div aria-hidden className="relative grid aspect-[16/10] place-items-center overflow-hidden rounded-[var(--radius)]"
      style={{ background: `radial-gradient(120% 120% at 0% 0%, hsl(${h} 70% 55%), hsl(${(h + 60) % 360} 60% 18%))` }}>
      <span className="font-display text-6xl font-bold text-white/90">{initials(project.titulo)}</span>
    </div>
  );
}
```

- [ ] **Step 2: `ProjectLinks.tsx`**

```tsx
import { projectLinks, type Project } from '@/lib/projects';

export function ProjectLinks({ project }: { project: Project }) {
  const links = projectLinks(project);
  if (!links.length) return null;
  return (
    <div className="flex flex-wrap gap-3">
      {links.map((l) => (
        <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer"
          className="rounded-full border border-line px-4 py-2 text-sm hover:text-accent">
          {l.label} ↗
        </a>
      ))}
    </div>
  );
}
```

- [ ] **Step 3: `ProjectCard.tsx`**

```tsx
import Link from 'next/link';
import type { Project } from '@/lib/projects';
import { ProjectCover } from './ProjectCover';

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link href={`/proyectos/${project.slug}`} className="group flex min-w-0 flex-col gap-4">
      <ProjectCover project={project} />
      <div className="min-w-0">
        <p className="text-xs uppercase tracking-widest text-muted">
          {project.categoria}{project.cliente && ` · ${project.cliente}`}
        </p>
        <h3 className="font-display text-xl break-words group-hover:text-accent">{project.titulo}</h3>
        <p className="mt-1 text-sm text-muted">{project.resumen}</p>
      </div>
    </Link>
  );
}
```

- [ ] **Step 4: `ProjectGrid.tsx`** (client)

```tsx
'use client';
import { useState } from 'react';
import { byCategory, categoriesOf, type Categoria, type Project } from '@/lib/projects';
import { ProjectCard } from './ProjectCard';

export function ProjectGrid({ projects }: { projects: Project[] }) {
  const [cat, setCat] = useState<Categoria | 'Todos'>('Todos');
  const chips: (Categoria | 'Todos')[] = ['Todos', ...categoriesOf(projects)];
  return (
    <section id="proyectos" aria-labelledby="proyectos-title" className="mx-auto max-w-6xl px-4 py-24">
      <h2 id="proyectos-title" className="font-display text-4xl">Todos los proyectos</h2>
      <div role="group" aria-label="Filtrar por categoría" className="mt-6 flex flex-wrap gap-2">
        {chips.map((c) => (
          <button key={c} type="button" aria-pressed={cat === c} onClick={() => setCat(c)}
            className="rounded-full border border-line px-4 py-1.5 text-sm aria-pressed:bg-fg aria-pressed:text-bg">
            {c}
          </button>
        ))}
      </div>
      <div className="mt-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
        {byCategory(projects, cat).map((p) => <ProjectCard key={p.slug} project={p} />)}
      </div>
    </section>
  );
}
```

- [ ] **Step 5: `FeaturedProjects.tsx`**

```tsx
import Link from 'next/link';
import type { Project } from '@/lib/projects';
import { ProjectCover } from './ProjectCover';

export function FeaturedProjects({ projects }: { projects: Project[] }) {
  return (
    <section aria-labelledby="destacados-title" className="mx-auto max-w-6xl px-4 py-24">
      <h2 id="destacados-title" className="font-display text-4xl">Proyectos destacados</h2>
      <div className="mt-12 flex flex-col gap-24">
        {projects.map((p, i) => (
          <article key={p.slug} className="grid items-center gap-8 lg:grid-cols-2">
            <div className={i % 2 ? 'lg:order-2' : ''}><ProjectCover project={p} priority={i === 0} /></div>
            <div className="min-w-0">
              <p className="text-xs uppercase tracking-widest text-muted">{p.cliente || p.categoria} · {p.estado}</p>
              <h3 className="mt-2 font-display text-3xl break-words">{p.titulo}</h3>
              <p className="mt-4 text-muted">{p.resumen}</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {p.stack.map((s) => <li key={s} className="rounded-full bg-surface px-3 py-1 text-xs">{s}</li>)}
              </ul>
              <Link href={`/proyectos/${p.slug}`} className="mt-6 inline-block text-accent">Ver caso →</Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 6: `Hero.tsx`, `StackSection.tsx`, `Contact.tsx`**

```tsx
// Hero.tsx
import type { Perfil } from '@/lib/content';

export function Hero({ perfil }: { perfil: Perfil }) {
  return (
    <section className="mx-auto flex min-h-[90svh] max-w-6xl flex-col justify-center px-4">
      <p className="text-sm uppercase tracking-widest text-muted">{perfil.rol}</p>
      <h1 className="mt-4 font-display text-6xl leading-none sm:text-8xl">{perfil.nombre}</h1>
      <p className="mt-6 max-w-2xl text-lg text-muted">{perfil.bio}</p>
      <div className="mt-10 flex flex-wrap gap-4">
        <a href="#proyectos" className="rounded-full bg-accent px-6 py-3 font-medium text-bg">Ver proyectos</a>
        <a href="#contacto" className="rounded-full border border-line px-6 py-3">Contactar</a>
      </div>
    </section>
  );
}
```

```tsx
// StackSection.tsx
import type { Project } from '@/lib/projects';

export function StackSection({ tecnologias, projects }: { tecnologias: string[]; projects: Project[] }) {
  const clientes = [...new Set(projects.map((p) => p.cliente).filter(Boolean))];
  return (
    <section aria-labelledby="stack-title" className="mx-auto max-w-6xl px-4 py-24">
      <h2 id="stack-title" className="font-display text-4xl">Stack y experiencia</h2>
      <ul className="mt-8 flex flex-wrap gap-3">
        {tecnologias.map((t) => <li key={t} className="rounded-full border border-line px-4 py-2">{t}</li>)}
      </ul>
      <h3 className="mt-16 text-sm uppercase tracking-widest text-muted">He trabajado con</h3>
      <ul className="mt-4 flex flex-wrap gap-x-10 gap-y-4 font-display text-2xl">
        {clientes.map((c) => <li key={c}>{c}</li>)}
      </ul>
    </section>
  );
}
```

```tsx
// Contact.tsx
import type { Perfil } from '@/lib/content';

export function Contact({ perfil }: { perfil: Perfil }) {
  return (
    <section id="contacto" aria-labelledby="contacto-title" className="mx-auto max-w-6xl px-4 py-32">
      <h2 id="contacto-title" className="font-display text-5xl sm:text-7xl">¿Construimos algo juntos?</h2>
      <a href={`mailto:${perfil.email}`} className="mt-8 inline-block break-all text-2xl text-accent">{perfil.email}</a>
      <ul className="mt-8 flex flex-wrap gap-6">
        <li><a href={perfil.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn ↗</a></li>
        <li><a href={perfil.github} target="_blank" rel="noopener noreferrer">GitHub ↗</a></li>
        {perfil.cv && <li><a href={perfil.cv} download>Descargar CV ↓</a></li>}
      </ul>
    </section>
  );
}
```

- [ ] **Step 7: `src/app/page.tsx`**

```tsx
import { getPerfil, getProjects } from '@/lib/content';
import { featured } from '@/lib/projects';
import { Hero } from '@/components/Hero';
import { FeaturedProjects } from '@/components/FeaturedProjects';
import { ProjectGrid } from '@/components/ProjectGrid';
import { StackSection } from '@/components/StackSection';
import { Contact } from '@/components/Contact';

export default async function Home() {
  const [perfil, projects] = await Promise.all([getPerfil(), getProjects()]);
  return (
    <main>
      <Hero perfil={perfil} />
      <FeaturedProjects projects={featured(projects)} />
      <ProjectGrid projects={projects} />
      <StackSection tecnologias={perfil.tecnologias} projects={projects} />
      <Contact perfil={perfil} />
    </main>
  );
}
```

- [ ] **Step 8: `src/app/layout.tsx`**

```tsx
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  title: { default: 'Cristhoper Castillo — Full-Stack Developer', template: '%s · Cristhoper Castillo' },
  description: 'Portafolio de proyectos de Cristhoper Castillo, Ingeniero en Ciencias de la Computación y Full-Stack Developer.',
  openGraph: { type: 'website', locale: 'es_ES', siteName: 'Cristhoper Castillo' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-bg text-fg antialiased">{children}</body>
    </html>
  );
}
```

- [ ] **Step 9: Verificar** — Run: `npm run dev`, abrir `/`.
Expected: hero, 5 destacados (Evalia, SGT, RUL, AppMechanic, GMX en ese orden), grilla de 16, chips "Todos, Cliente, Producto, Personal, POC"; clic en "POC" muestra 2 proyectos; contacto con email/LinkedIn/GitHub y sin botón CV.

- [ ] **Step 10: Commit**

```bash
git add src
git commit -m "feat: add home page sections and project components"
```

---

### Task 6: Detalle de proyecto, 404 y sitemap

**Files:**
- Create: `src/app/proyectos/[slug]/page.tsx`, `src/app/not-found.tsx`, `src/app/sitemap.ts`

**Interfaces:**
- Consumes: `getProjects`, `getProject` (Task 4); `ProjectCover`, `ProjectLinks` (Task 5).

- [ ] **Step 1: `src/app/proyectos/[slug]/page.tsx`**

```tsx
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProject, getProjects } from '@/lib/content';
import { ProjectCover } from '@/components/ProjectCover';
import { ProjectLinks } from '@/components/ProjectLinks';

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getProjects()).map((p) => ({ slug: p.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data = await getProject((await params).slug);
  if (!data) return {};
  const { project } = data;
  return {
    title: project.titulo,
    description: project.resumen,
    openGraph: { title: project.titulo, description: project.resumen, images: project.portada ? [project.portada] : [] },
  };
}

export default async function ProjectPage({ params }: Props) {
  const data = await getProject((await params).slug);
  if (!data) notFound();
  const { project: p, body } = data;
  return (
    <main className="mx-auto max-w-4xl px-4 py-16">
      <Link href="/#proyectos" className="text-sm text-muted hover:text-accent">← Todos los proyectos</Link>
      <p className="mt-10 text-xs uppercase tracking-widest text-muted">
        {p.categoria}{p.cliente && ` · ${p.cliente}`} · {p.estado}
      </p>
      <h1 className="mt-2 font-display text-5xl break-words sm:text-6xl">{p.titulo}</h1>
      <p className="mt-4 text-lg text-muted">{p.resumen}</p>
      <div className="mt-6"><ProjectLinks project={p} /></div>
      <div className="mt-10"><ProjectCover project={p} priority /></div>
      <ul className="mt-8 flex flex-wrap gap-2">
        {p.stack.map((s) => <li key={s} className="rounded-full bg-surface px-3 py-1 text-xs">{s}</li>)}
      </ul>
      <article className="prose-content mt-12">{body}</article>
      {p.galeria.length > 0 && (
        <div className="mt-16 grid gap-6 sm:grid-cols-2">
          {p.galeria.map((src, i) => (
            <div key={src} className="relative aspect-[16/10] overflow-hidden rounded-[var(--radius)]">
              <Image src={src} alt={`${p.titulo} — captura ${i + 1}`} fill sizes="(min-width: 640px) 50vw, 100vw" className="object-cover" />
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
```

- [ ] **Step 2: `src/app/not-found.tsx`**

```tsx
import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[80svh] max-w-6xl flex-col justify-center px-4">
      <p className="font-display text-8xl text-accent">404</p>
      <h1 className="mt-4 font-display text-3xl">Este proyecto no existe (todavía).</h1>
      <Link href="/" className="mt-8 text-accent">← Volver al inicio</Link>
    </main>
  );
}
```

- [ ] **Step 3: `src/app/sitemap.ts`**

```ts
import type { MetadataRoute } from 'next';
import { getProjects } from '@/lib/content';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
  const projects = await getProjects();
  return [{ url: base }, ...projects.map((p) => ({ url: `${base}/proyectos/${p.slug}` }))];
}
```

- [ ] **Step 4: Verificar**

Run: `npm run build`
Expected: build OK; salida lista 16 rutas `/proyectos/[slug]` como SSG (●).
Run: `npm start`, abrir `/proyectos/evalia` → contenido con secciones Problema/Solución/Funcionalidades y botón "Ver demo". Abrir `/proyectos/no-existe` → página 404 estilizada (status 404). Abrir `/proyectos/scrum-poker` → solo botón "Código". Abrir `/proyectos/atlas` → sin botones.

- [ ] **Step 5: Commit**

```bash
git add src/app
git commit -m "feat: add project detail page, 404 and sitemap"
```

---

### Task 7: Tokens del diseño aprobado

**Files:**
- Modify: `src/app/globals.css` (reemplazar contenido), `src/app/layout.tsx` (fuentes)

**Interfaces:**
- Consumes: tabla de tokens de `docs/design/README.md` (Task 1).
- Produces: utilidades Tailwind `bg-bg`, `bg-surface`, `text-fg`, `text-muted`, `text-accent`, `bg-accent`, `border-line`, `font-display`, `font-body`, variable `--radius`.

- [ ] **Step 1: `globals.css`** — reemplazar los valores entre `<>` con los de `docs/design/README.md` (literal, sin inventar):

```css
@import 'tailwindcss';

@theme {
  --color-bg: <--color-bg>;
  --color-surface: <--color-surface>;
  --color-fg: <--color-fg>;
  --color-muted: <--color-muted>;
  --color-accent: <--color-accent>;
  --color-line: color-mix(in oklab, var(--color-fg) 15%, transparent);
  --font-display: var(--font-display-family), ui-serif, system-ui;
  --font-body: var(--font-body-family), system-ui, sans-serif;
}

:root { --radius: <--radius>; }

html { scroll-behavior: smooth; }
body { font-family: var(--font-body); }

.prose-content h2 { font-family: var(--font-display); font-size: 1.75rem; margin-top: 2.5rem; }
.prose-content p { margin-top: 1rem; color: var(--color-muted); line-height: 1.75; }
.prose-content ul { margin-top: 1rem; list-style: disc; padding-left: 1.25rem; }
.prose-content li { margin-top: 0.5rem; }

@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *, *::before, *::after { animation: none !important; transition: none !important; }
}
```

- [ ] **Step 2: Fuentes en `layout.tsx`** — importar las dos familias de `next/font/google` indicadas en el README de diseño, con `variable: '--font-display-family'` y `variable: '--font-body-family'`, y añadir `${display.variable} ${body.variable}` al `className` de `<html>`. Ejemplo con familias concretas (reemplazar por las aprobadas):

```tsx
import { Space_Grotesk, Inter } from 'next/font/google';
const display = Space_Grotesk({ subsets: ['latin'], variable: '--font-display-family' });
const body = Inter({ subsets: ['latin'], variable: '--font-body-family' });
// <html lang="es" className={`${display.variable} ${body.variable}`}>
```

- [ ] **Step 3: Verificar** — `npm run dev`; los colores y fuentes de `/` coinciden con el diseño aprobado. Run: `npm run build` → OK.
- [ ] **Step 4: Commit**

```bash
git add src/app
git commit -m "style: apply approved design tokens"
```

---

### Task 8: Ajuste fino al diseño aprobado + verificación final

**Files:**
- Modify: componentes de `src/components/*` y páginas según diferencias con el diseño.

**Interfaces:**
- Consumes: URL del diseño (Task 1), todos los componentes previos. No cambia props ni nombres exportados.

- [ ] **Step 1:** Abrir el diseño aprobado y `npm run dev` lado a lado (1440 px y 390 px). Listar diferencias por sección (hero, destacados, grilla, detalle, contacto) en un comentario de la tarea.
- [ ] **Step 2:** Corregir cada diferencia solo con clases Tailwind/CSS en los componentes existentes. Implementar las animaciones listadas en "Notas de movimiento" con CSS (`@keyframes` + `animation-timeline: view()` para reveal on scroll, o `transition` en hover). Agregar `npm i motion` solo si una animación del diseño no es posible con CSS.
- [ ] **Step 3: Review Focus 5** — DevTools a 360 px de ancho en `/` y `/proyectos/sgt-gestion-de-turnos` y `/proyectos/migracion-gmx-seguros`. Expected: `document.documentElement.scrollWidth === 360` (sin scroll horizontal).
- [ ] **Step 4: Lighthouse** — `npm run build && npm start`, Lighthouse móvil en `/` y `/proyectos/evalia`. Expected: Performance ≥ 90, Accessibility ≥ 90. Corregir lo que baje del umbral.
- [ ] **Step 5: Prueba del panel** — en `/keystatic` crear proyecto "Prueba" (categoría Personal, sin portada, sin enlaces). Expected: aparece en grilla con placeholder, `/proyectos/prueba` sin botones. Borrar la entrada después y confirmar que `content/proyectos/prueba.mdoc` ya no existe.
- [ ] **Step 6:** `npm test && npm run build` → Expected: ambos OK.
- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "style: match approved design and verify performance"
```

---

### Task 9: Publicación (requiere confirmación del usuario)

**Files:**
- Create: `README.md`

- [ ] **Step 1: `README.md`**

````markdown
# Portafolio — Cristhoper Castillo

Next.js + Keystatic. Contenido en `content/`.

## Desarrollo
```bash
npm install
npm run dev        # sitio en http://localhost:3000, panel en /keystatic
npm test
```

## Agregar un proyecto
Producción: entrar a `<dominio>/keystatic`, login con GitHub, "Proyectos" → "Add".
Al guardar se crea un commit y Vercel redespliega (~1 min).

## Variables de entorno (Vercel)
`NEXT_PUBLIC_SITE_URL`, `KEYSTATIC_GITHUB_CLIENT_ID`, `KEYSTATIC_GITHUB_CLIENT_SECRET`,
`KEYSTATIC_SECRET`, `NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG`.
````

- [ ] **Step 2:** Commit `git add README.md && git commit -m "docs: add README"`.
- [ ] **Step 3: PREGUNTAR al usuario** antes de: crear repo `wagnercastillo/portfolio` (`gh repo create wagnercastillo/portfolio --private --source . --push`) e importar en Vercel. No ejecutar sin "sí" explícito.
- [ ] **Step 4:** Tras desplegar, el usuario abre `<dominio>/keystatic` → Keystatic guía la creación de la GitHub App y muestra las variables; el usuario las carga en Vercel y redespliega.
- [ ] **Step 5: Verificar** — en producción crear y borrar un proyecto de prueba desde el panel; ambos commits aparecen en GitHub y el sitio se actualiza.
