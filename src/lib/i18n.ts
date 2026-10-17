// Textos de la interfaz en español e inglés. El contenido (proyectos, perfil) trae su traducción desde Keystatic.
export const LANGS = ['es', 'en'] as const;
export type Lang = (typeof LANGS)[number];
export const isLang = (s: unknown): s is Lang => LANGS.includes(s as Lang);

/** Ruta en el idioma dado: el español vive sin prefijo, el inglés bajo /en. */
export const localize = (lang: Lang, path: string) => {
  if (lang === 'es') return path;
  if (path === '/') return '/en';
  return path.startsWith('/#') ? `/en${path.slice(1)}` : `/en${path}`;
};

const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

const es = {
  lang: 'es' as Lang,
  locale: 'es',
  meta: {
    title: 'Cristhoper Castillo — Full-Stack Developer',
    description: 'Portafolio de proyectos de Cristhoper Castillo, Ingeniero en Ciencias de la Computación y Full-Stack Developer en Loja, Ecuador.',
    og: 'es_ES',
  },
  // categorías, estados, sectores y habilidades que vienen en español desde el contenido
  terms: {} as Record<string, string>,
  nav: { label: 'Principal', projects: 'Proyectos', experience: 'Experiencia', stack: 'Stack', contact: 'Contacto' },
  toggles: {
    cursor: 'Puntero animado', cursorTitle: 'Activar / desactivar puntero animado', theme: 'Cambiar tema claro / oscuro',
    lang: 'Ver en inglés', langShort: 'EN',
  },
  cursor: { drag: 'Arrastra', drop: 'Suelta', view: 'Ver proyecto ↗', photo: 'Otra foto' },
  footer: { hint: 'Pista: código Konami' },
  hero: {
    available: 'Disponible para proyectos', words: ['Software', 'que', 'funciona', 'en'], last: 'producción.',
    seeProjects: 'Ver proyectos', contact: 'Contactar', projects: 'Proyectos', industries: 'Industrias',
    industriesList: 'Banca · Seguros · Energía · RRHH',
    photoOf: (n: string) => `Foto de ${n}`, nextPhoto: (i: number, n: number) => `Ver otra foto (${i} de ${n})`,
  },
  intro: { aria: (n: string, u: string) => `Portada: ${n}, ${u}`, scroll: 'Desliza' },
  projects: {
    featured: 'Proyectos destacados', all: 'Todos los proyectos', filter: 'Filtrar por categoría', allChip: 'Todos',
    viewCase: 'Ver caso →', fullCase: 'Ver caso completo →', coverOf: (t: string) => `Portada de ${t}`,
    navHint: '← → para navegar', close: 'Cerrar', prev: 'Proyecto anterior', next: 'Proyecto siguiente',
    back: '← Todos los proyectos', status: 'Estado', more: 'Más proyectos',
  },
  gallery: {
    open: (k: number, n: number) => `Ver captura ${k} de ${n} a pantalla completa`, shot: (t: string, k: number) => `${t}, captura ${k}`,
    prev: 'Captura anterior', next: 'Captura siguiente', shotsOf: (t: string) => `Capturas de ${t}`,
    thumbsPrev: 'Miniaturas anteriores', thumbsNext: 'Miniaturas siguientes', goTo: (k: number) => `Ir a captura ${k}`,
  },
  timeline: {
    title: 'Trayectoria', months: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
    meta: (n: number) => `${plural(n, 'proyecto', 'proyectos')} · sigue bajando ↓`,
  },
  exp: {
    title: 'Experiencia', name: 'Nombre', role: 'Cargo', period: 'Periodo', now: 'HOY',
    months: ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'],
    cardAria: (c: string, e: string, p: string) => `${c} en ${e}, ${p}. Ver logros`,
    tip: '↔ arrastra y lanza · clic = ver ficha', close: 'Cerrar ficha',
    months_n: (n: number) => plural(n, 'mes', 'meses'), logros_n: (n: number) => plural(n, 'logro', 'logros'),
    logros: 'Logros', here: 'Proyectos aquí', certs: 'Certificaciones', edu: 'Educación', langs: 'Idiomas',
  },
  stack: {
    all: 'Todo', filter: 'Filtrar tecnologías por grupo', projects_n: (n: number) => plural(n, 'proyecto', 'proyectos'),
    hint: 'Elige una o varias tecnologías: verás los proyectos donde las combiné.', clear: 'Limpiar selección',
    workedWith: 'He trabajado con',
    clientAria: (c: string, on: boolean) => `${c}: ${on ? 'quitar filtro' : 'ver las tecnologías que usé aquí'}`,
    lookGrid: (c: string) => `Mira en la grilla lo que usé con ${c}.`,
    summary: (orgs: number, countries: number, projs: number) =>
      `${orgs} organizaciones${countries ? ` · ${plural(countries, 'país', 'países')}` : ''} · ${projs} proyectos`,
    emptyOne: 'Aún no hay proyectos publicados en el portafolio con esta tecnología.',
    addMore: 'Suma otra tecnología para buscar combinaciones.', looking: '¿Buscas a alguien con…', remove: (t: string) => `Quitar ${t}`,
    withStack: (n: number): string => (n === 1 ? 'proyecto con este stack' : 'proyectos con este stack'),
    withStackAria: (n: number) => `${n} proyectos con este stack`,
    emptyCombo: 'Todavía no las he combinado todas en un mismo proyecto. Quita alguna para ver coincidencias.',
  },
  marquee: 'Tecnologías',
  contact: {
    title: '¿Construimos algo juntos?',
    greeting: (n: string) => `¡Hola! Soy ${n}. Cuéntame qué quieres construir y te respondo personalmente, sin intermediarios.`,
    typing: (n: string) => `${n} está escribiendo`, photoOf: (n: string) => `Foto de ${n}`,
    command: 'contactar --cristhoper', dir: '~/contacto', channels: 'Canales de contacto',
    copy: 'copiar', open: 'abrir', download: 'descargar', copied: '✓ copiado', copiedSr: 'Email copiado al portapapeles',
    waHello: 'Hola Cristhoper, vi tu portafolio.', time: 'hora', working: 'en horario laboral', off: 'fuera de horario',
    build: 'Arma tu mensaje', what: '¿Qué necesitas?', when: '¿Para cuándo?', yourName: 'Tu nombre (opcional)',
    more: 'Algo más (opcional)', placeholder: 'Ej. es para una clínica en Quito', preview: 'Mira cómo llega tu mensaje en el teléfono →',
    sendWa: 'Enviar por WhatsApp', sendMail: 'Enviar por email',
    subject: (needs: string[]) => (needs.length ? `Proyecto: ${needs.join(', ')}` : 'Contacto desde tu portafolio'),
    needs: [
      ['App web', 'una app web'], ['API / Backend', 'una API / backend'], ['App móvil', 'una app móvil'],
      ['Integración con IA', 'una integración con IA'], ['Migrar un sistema', 'migrar un sistema existente'], ['Consultoría', 'consultoría técnica'],
    ] as [string, string][],
    whens: [['Lo antes posible', 'lo antes posible'], ['1–3 meses', 'en 1 a 3 meses'], ['Explorando ideas', 'sin fecha, estoy explorando ideas']] as [string, string][],
    you: 'Tú',
    phone: 'Vista previa del mensaje en WhatsApp', today: 'Hoy', phoneHello: '¡Hola! Cuéntame qué quieres construir.',
    typingShort: 'Escribiendo', sent: 'Enviado', pending: 'Pendiente', message: 'Mensaje',
  },
  turno: { label: 'Turno', window: 'Ventanilla' },
  egg: { title: 'Modo dev desbloqueado', sub: 'Estimación: 13 puntos de pura curiosidad.' },
  nf: {
    phrase: 'Este proyecto no existe (todavía).', home: '← Volver al inicio',
    breakoutAria: 'Juego: rompe el 404 con la pelota', breakoutIntro: '¿Lo arreglamos rompiéndolo?',
    over: 'Game over', overSub: 'El 404 sigue ahí. ¿Revancha?', solved: 'Error resuelto ✓', solvedSub: (p: number) => `${p} pts. Ahora sí, vuelve al inicio.`,
    play: 'Jugar', again: 'Jugar otra vez', ok: 'build exitoso', debugging: 'depurando…',
    fixed: 'Bugs arreglados. La página sigue sin existir, pero tú sí sabes depurar.', once: 'Otra vez', squash: 'Aplastar bug',
    short: 'No existe', long: 'Este proyecto no existe', drag: 'Arrastra y lanza las letras', shuffle: '↺ Reordenar',
  },
};

export type Dict = typeof es;

const en: Dict = {
  lang: 'en',
  locale: 'en',
  meta: {
    title: 'Cristhoper Castillo — Full-Stack Developer',
    description: 'Project portfolio of Cristhoper Castillo, Computer Science Engineer and Full-Stack Developer based in Loja, Ecuador.',
    og: 'en_US',
  },
  terms: {
    Cliente: 'Client', Producto: 'Product', Personal: 'Personal', POC: 'POC',
    'En producción': 'In production', 'En desarrollo': 'In development', Completado: 'Completed',
    'Ver demo': 'Live demo', Código: 'Code',
    'Banca cooperativa': 'Cooperative banking', 'Energía eólica': 'Wind energy', Seguros: 'Insurance', Academia: 'Academia', México: 'Mexico',
    'Trabajo en equipo': 'Teamwork', Adaptabilidad: 'Adaptability', 'Resolución de problemas': 'Problem solving',
    'Comunicación efectiva': 'Effective communication', Proactividad: 'Proactivity',
  },
  nav: { label: 'Main', projects: 'Projects', experience: 'Experience', stack: 'Stack', contact: 'Contact' },
  toggles: {
    cursor: 'Animated pointer', cursorTitle: 'Turn animated pointer on / off', theme: 'Toggle light / dark theme',
    lang: 'Ver en español', langShort: 'ES',
  },
  cursor: { drag: 'Drag', drop: 'Drop', view: 'View project ↗', photo: 'Next photo' },
  footer: { hint: 'Hint: Konami code' },
  hero: {
    available: 'Available for projects', words: ['Software', 'that', 'works', 'in'], last: 'production.',
    seeProjects: 'See projects', contact: 'Get in touch', projects: 'Projects', industries: 'Industries',
    industriesList: 'Banking · Insurance · Energy · HR',
    photoOf: (n) => `Photo of ${n}`, nextPhoto: (i, n) => `Show another photo (${i} of ${n})`,
  },
  intro: { aria: (n, u) => `Cover: ${n}, ${u}`, scroll: 'Scroll' },
  projects: {
    featured: 'Featured projects', all: 'All projects', filter: 'Filter by category', allChip: 'All',
    viewCase: 'View case →', fullCase: 'View full case →', coverOf: (t) => `${t} cover`,
    navHint: '← → to navigate', close: 'Close', prev: 'Previous project', next: 'Next project',
    back: '← All projects', status: 'Status', more: 'More projects',
  },
  gallery: {
    open: (k, n) => `Open screenshot ${k} of ${n} full screen`, shot: (t, k) => `${t}, screenshot ${k}`,
    prev: 'Previous screenshot', next: 'Next screenshot', shotsOf: (t) => `${t} screenshots`,
    thumbsPrev: 'Previous thumbnails', thumbsNext: 'Next thumbnails', goTo: (k) => `Go to screenshot ${k}`,
  },
  timeline: {
    title: 'Journey', months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    meta: (n) => `${plural(n, 'project', 'projects')} · keep scrolling ↓`,
  },
  exp: {
    title: 'Experience', name: 'Name', role: 'Role', period: 'Period', now: 'NOW',
    months: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'],
    cardAria: (c, e, p) => `${c} at ${e}, ${p}. See achievements`,
    tip: '↔ drag and throw · click = open card', close: 'Close card',
    months_n: (n) => plural(n, 'month', 'months'), logros_n: (n) => plural(n, 'achievement', 'achievements'),
    logros: 'Achievements', here: 'Projects here', certs: 'Certifications', edu: 'Education', langs: 'Languages',
  },
  stack: {
    all: 'All', filter: 'Filter technologies by group', projects_n: (n) => plural(n, 'project', 'projects'),
    hint: 'Pick one or more technologies to see the projects where I combined them.', clear: 'Clear selection',
    workedWith: "I've worked with",
    clientAria: (c, on) => `${c}: ${on ? 'remove filter' : 'see the technologies I used here'}`,
    lookGrid: (c) => `Check the grid for what I used with ${c}.`,
    summary: (orgs, countries, projs) =>
      `${orgs} organizations${countries ? ` · ${plural(countries, 'country', 'countries')}` : ''} · ${projs} projects`,
    emptyOne: 'No published projects with this technology yet.',
    addMore: 'Add another technology to search for combinations.', looking: 'Looking for someone with…', remove: (t) => `Remove ${t}`,
    withStack: (n) => (n === 1 ? 'project with this stack' : 'projects with this stack'),
    withStackAria: (n) => `${n} projects with this stack`,
    emptyCombo: "I haven't combined all of these in a single project yet. Remove one to see matches.",
  },
  marquee: 'Technologies',
  contact: {
    title: 'Shall we build something together?',
    greeting: (n) => `Hi! I'm ${n}. Tell me what you want to build and I'll reply personally, no middlemen.`,
    typing: (n) => `${n} is typing`, photoOf: (n) => `Photo of ${n}`,
    command: 'contact --cristhoper', dir: '~/contact', channels: 'Contact channels',
    copy: 'copy', open: 'open', download: 'download', copied: '✓ copied', copiedSr: 'Email copied to clipboard',
    waHello: 'Hi Cristhoper, I saw your portfolio.', time: 'time', working: 'working hours', off: 'off hours',
    build: 'Build your message', what: 'What do you need?', when: 'When?', yourName: 'Your name (optional)',
    more: 'Anything else (optional)', placeholder: 'E.g. it’s for a clinic in Quito', preview: 'See how your message lands on the phone →',
    sendWa: 'Send via WhatsApp', sendMail: 'Send via email',
    subject: (needs) => (needs.length ? `Project: ${needs.join(', ')}` : 'Contact from your portfolio'),
    needs: [
      ['Web app', 'a web app'], ['API / Backend', 'an API / backend'], ['Mobile app', 'a mobile app'],
      ['AI integration', 'an AI integration'], ['Migrate a system', 'to migrate an existing system'], ['Consulting', 'technical consulting'],
    ],
    whens: [['ASAP', 'as soon as possible'], ['1–3 months', 'within 1 to 3 months'], ['Exploring ideas', 'no date yet, I’m exploring ideas']],
    you: 'You',
    phone: 'WhatsApp message preview', today: 'Today', phoneHello: 'Hi! Tell me what you want to build.',
    typingShort: 'Typing', sent: 'Sent', pending: 'Pending', message: 'Message',
  },
  turno: { label: 'Ticket', window: 'Counter' },
  egg: { title: 'Dev mode unlocked', sub: 'Estimate: 13 points of pure curiosity.' },
  nf: {
    phrase: "This project doesn't exist (yet).", home: '← Back to home',
    breakoutAria: 'Game: break the 404 with the ball', breakoutIntro: 'Shall we fix it by breaking it?',
    over: 'Game over', overSub: 'The 404 is still there. Rematch?', solved: 'Error fixed ✓', solvedSub: (p) => `${p} pts. Now head back home.`,
    play: 'Play', again: 'Play again', ok: 'build passed', debugging: 'debugging…',
    fixed: "Bugs fixed. The page still doesn't exist, but you sure know how to debug.", once: 'Again', squash: 'Squash bug',
    short: 'Not found', long: "This project doesn't exist", drag: 'Drag and throw the letters', shuffle: '↺ Shuffle',
  },
};

const DICTS: Record<Lang, Dict> = { es, en };
export const dict = (lang: Lang) => DICTS[lang];
/** Traduce un término del contenido (categoría, estado, sector…); si no hay traducción queda igual. */
export const term = (t: Dict, s: string) => t.terms[s] ?? s;
