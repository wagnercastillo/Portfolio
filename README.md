# Portafolio — Cristhoper Castillo

Next.js 16 + Keystatic. El contenido vive en `content/` (perfil y proyectos) y las páginas se generan estáticamente.

## Desarrollo

```bash
npm install
npm run dev        # sitio en http://localhost:3000, panel en http://localhost:3000/keystatic
npm test           # lógica de orden/filtros/portadas
npm run build
```

En local el panel guarda directamente en `content/` y `public/`.

## Agregar un proyecto

1. Entrar a `/keystatic` → **Proyectos** → **Add**.
2. Llenar título, resumen (máx. 160 caracteres), categoría, stack, fecha, estado, enlaces y contenido.
3. Subir portada y galería (opcional; sin portada se muestra un placeholder con iniciales).
4. Marcar **Destacado** para que aparezca arriba. El campo **Orden** define la posición.

Tu perfil, experiencia, educación, habilidades y CV se editan en **Perfil**.

## Producción (Vercel + GitHub)

Keystatic usa GitHub como almacenamiento solo si existe `NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG`; sin esa variable usa archivos locales.

1. Subir el repo a GitHub (`wagnercastillo/portfolio`) e importarlo en Vercel.
2. Crear la GitHub App en local. El modo GitHub se activa con cualquier valor en la variable del slug, así que arranca con un valor temporal:

   ```bash
   NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG=pending npm run dev
   ```

   Abre `http://localhost:3000/keystatic` y sigue el asistente. Al terminar, Keystatic escribe en `.env` las cuatro variables (incluido el slug real).
3. Cargar en Vercel:
   - `NEXT_PUBLIC_SITE_URL` (ej. `https://tu-dominio.com`)
   - `KEYSTATIC_GITHUB_CLIENT_ID`
   - `KEYSTATIC_GITHUB_CLIENT_SECRET`
   - `KEYSTATIC_SECRET`
   - `NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG`
4. Redesplegar. Desde entonces, guardar en `/keystatic` crea un commit y Vercel redespliega (~1 min).

## Diseño

Referencia visual aprobada: `docs/design/reference.html`. Tokens y animaciones: `docs/design/README.md`.
