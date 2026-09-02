import { SiteHeader } from '../components/SiteHeader';
import { HeroSection } from '../components/HeroSection';
import { AboutSection } from '../components/AboutSection';
import { ProductsSection } from '../components/ProductsSection';
import { WhyProcessSection } from '../components/WhyProcessSection';
import { ContactSection } from '../components/ContactSection';
import { SiteFooter } from '../components/SiteFooter';
import '../styles/landing.css';

export default function LandingPage() {
  return (
    <div className="landing-page">
      <SiteHeader />
      <main>
        <HeroSection />
        <AboutSection />
        <ProductsSection />
        <WhyProcessSection />
        <ContactSection />
      </main>
      <SiteFooter />
    </div>
  );
}
