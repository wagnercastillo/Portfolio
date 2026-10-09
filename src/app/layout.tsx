import type { Metadata } from 'next';
import { DM_Mono, Instrument_Serif, JetBrains_Mono, Schibsted_Grotesk } from 'next/font/google';
import './globals.css';

const display = Schibsted_Grotesk({ subsets: ['latin'], weight: ['400', '500', '700', '800'], variable: '--font-display' });
const mono = JetBrains_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-mono' });
// solo para la portada: serif editorial + mono fina
const serif = Instrument_Serif({ subsets: ['latin'], weight: '400', style: ['normal', 'italic'], variable: '--font-serif' });
const monoThin = DM_Mono({ subsets: ['latin'], weight: '500', variable: '--font-mono-thin' });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  title: { default: 'Cristhoper Castillo — Full-Stack Developer', template: '%s · Cristhoper Castillo' },
  description: 'Portafolio de proyectos de Cristhoper Castillo, Ingeniero en Ciencias de la Computación y Full-Stack Developer en Loja, Ecuador.',
  openGraph: { type: 'website', locale: 'es_ES', siteName: 'Cristhoper Castillo', images: ['/perfil/cristhoper.jpg'] },
};

// Aplica tema y preferencia de cursor antes de pintar para evitar parpadeo.
const boot = `try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&matchMedia('(prefers-color-scheme: dark)').matches))document.documentElement.dataset.theme='dark';if(localStorage.getItem('cursor')==='off')document.documentElement.classList.add('no-cursor')}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${display.variable} ${mono.variable} ${serif.variable} ${monoThin.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: boot }} />
        <noscript><style>{'.reveal,.hero-bio{opacity:1!important;translate:none!important}'}</style></noscript>
      </head>
      <body>{children}</body>
    </html>
  );
}
