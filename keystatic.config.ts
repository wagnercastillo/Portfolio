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
