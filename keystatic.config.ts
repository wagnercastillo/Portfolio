import { config, collection, singleton, fields } from '@keystatic/core';

export default config({
  storage:
    // GitHub solo cuando la GitHub App está configurada (Vercel); si no, archivos locales
    process.env.NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG
      ? { kind: 'github', repo: 'wagnercastillo/Portfolio' }
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
        en: fields.object(
          {
            titulo: fields.text({ label: 'Title' }),
            resumen: fields.text({ label: 'Summary', multiline: true, validation: { length: { max: 160 } } }),
            contenido: fields.text({ label: 'Content (Markdown)', multiline: true }),
          },
          { label: 'English' },
        ),
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
        foto: fields.image({ label: 'Foto principal (vertical 4:5)', directory: 'public/perfil', publicPath: '/perfil/' }),
        galeria: fields.array(
          fields.object({
            imagen: fields.image({ label: 'Foto (vertical 4:5)', directory: 'public/perfil', publicPath: '/perfil/' }),
            enfoque: fields.select({
              label: 'Enfoque (qué parte se ve si se recorta)',
              options: [{ label: 'Arriba', value: 'arriba' }, { label: 'Centro', value: 'centro' }, { label: 'Abajo', value: 'abajo' }],
              defaultValue: 'centro',
            }),
          }),
          { label: 'Más fotos (carrusel del inicio)', itemLabel: (p) => p.fields.imagen.value?.filename ?? 'Foto' },
        ),
        bio: fields.text({ label: 'Bio', multiline: true }),
        en: fields.object(
          {
            rol: fields.text({ label: 'Role' }),
            bio: fields.text({ label: 'Bio', multiline: true }),
            ubicacion: fields.text({ label: 'Location' }),
            idiomas: fields.text({ label: 'Languages' }),
          },
          { label: 'English' },
        ),
        ubicacion: fields.text({ label: 'Ubicación' }),
        email: fields.text({ label: 'Email' }),
        telefono: fields.text({ label: 'Teléfono / WhatsApp (formato +593...)' }),
        linkedin: fields.url({ label: 'LinkedIn' }),
        github: fields.url({ label: 'GitHub' }),
        cv: fields.file({ label: 'CV (PDF)', directory: 'public/cv', publicPath: '/cv/' }),
        experiencia: fields.array(
          fields.object({
            cargo: fields.text({ label: 'Cargo' }),
            empresa: fields.text({ label: 'Empresa' }),
            periodo: fields.text({ label: 'Periodo (ej. Oct 2025 – Jun 2026)' }),
            logros: fields.array(fields.text({ label: 'Logro' }), {
              label: 'Logros',
              itemLabel: (p) => p.value,
            }),
            en: fields.object(
              {
                cargo: fields.text({ label: 'Role' }),
                logros: fields.array(fields.text({ label: 'Achievement' }), { label: 'Achievements', itemLabel: (p) => p.value }),
              },
              { label: 'English' },
            ),
          }),
          { label: 'Experiencia', itemLabel: (p) => `${p.fields.cargo.value} · ${p.fields.empresa.value}` },
        ),
        educacion: fields.array(
          fields.object({
            titulo: fields.text({ label: 'Título' }),
            detalle: fields.text({ label: 'Institución / detalle' }),
            en: fields.object({ titulo: fields.text({ label: 'Title' }), detalle: fields.text({ label: 'Detail' }) }, { label: 'English' }),
          }),
          { label: 'Educación', itemLabel: (p) => p.fields.titulo.value },
        ),
        habilidades: fields.array(
          fields.object({
            grupo: fields.text({ label: 'Grupo' }),
            grupoEn: fields.text({ label: 'Group (English)' }),
            items: fields.array(fields.text({ label: 'Habilidad' }), {
              label: 'Habilidades',
              itemLabel: (p) => p.value,
            }),
          }),
          { label: 'Habilidades', itemLabel: (p) => p.fields.grupo.value },
        ),
        idiomas: fields.text({ label: 'Idiomas' }),
      },
    }),
  },
});
