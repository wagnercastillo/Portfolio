import type { Metadata } from 'next';
import { JetBrains_Mono, Schibsted_Grotesk, Unbounded } from 'next/font/google';
import '../globals.css';
import { LANGS } from '@/lib/i18n';
import { getLang, getT } from '@/lib/i18n-server';

const display = Schibsted_Grotesk({ subsets: ['latin'], weight: ['400', '500', '700', '800'], variable: '--font-display' });
const mono = JetBrains_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-mono' });
// solo para el nombre en la portada
const intro = Unbounded({ subsets: ['latin'], weight: '800', variable: '--font-intro' });

export const generateStaticParams = () => LANGS.map((l) => ({ lang: l }));

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
    title: { default: t.meta.title, template: '%s · Cristhoper Castillo' },
    description: t.meta.description,
    alternates: { languages: { es: '/', en: '/en' } },
    openGraph: { type: 'website', locale: t.meta.og, siteName: 'Cristhoper Castillo', images: ['/perfil/cristhoper.jpg'] },
  };
}

// Aplica tema y preferencia de cursor antes de pintar para evitar parpadeo.
const boot = `try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&matchMedia('(prefers-color-scheme: dark)').matches))document.documentElement.dataset.theme='dark';if(localStorage.getItem('cursor')==='off')document.documentElement.classList.add('no-cursor')}catch(e){}`;

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const l = await getLang(); // el proxy solo deja pasar es/en
  return (
    <html lang={l} className={`${display.variable} ${mono.variable} ${intro.variable}`} suppressHydrationWarning>
      <head>
        {/* en el servidor se ejecuta; si React vuelve a renderizar en el cliente queda inerte (text/plain) y no avisa (guía "preventing flash" de Next) */}
        <script type={typeof window === 'undefined' ? 'text/javascript' : 'text/plain'} suppressHydrationWarning dangerouslySetInnerHTML={{ __html: boot }} />
        <noscript><style>{'.reveal,.hero-bio{opacity:1!important;translate:none!important}'}</style></noscript>
      </head>
      <body>{children}</body>
    </html>
  );
}
