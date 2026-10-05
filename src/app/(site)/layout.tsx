import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Effects } from '@/components/Effects';
import { EasterEgg } from '@/components/EasterEgg';

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="wrap">
        <Header />
        {children}
        <Footer />
      </div>
      <Effects />
      <EasterEgg />
    </>
  );
}
