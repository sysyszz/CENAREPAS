import { SiteHeader } from '../components/SiteHeader';
import { HeroSection } from '../components/HeroSection';
import { AboutSection } from '../components/AboutSection';
import { StatsSection } from '../components/StatsSection';
import { ProductsSection } from '../components/ProductsSection';
import { Ventajas } from '../components/Ventajas';
import { ContactSection } from '../components/ContactSection';
import { CTASection } from '../components/CTASection';
import { SiteFooter } from '../components/SiteFooter';
import '../styles/landing.css';

export default function LandingPage() {
  return (
    <div className="landing-page">
      <SiteHeader />
      {/* Sin padding superior: el navbar flota sobre el hero full-bleed */}
      <main>
        <HeroSection />
        <AboutSection />
        <StatsSection />
        <ProductsSection />
        <Ventajas />
        <ContactSection />
        <CTASection />
      </main>
      <SiteFooter />
    </div>
  );
}
