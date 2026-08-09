// pages/LandingPage.jsx
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Hero } from '../components/Hero';
import { Nosotros } from '../components/Nosotros';
import { Productos } from '../components/Productos';
import { Ventajas } from '../components/Ventajas';
import { Contacto } from '../components/Contacto';

export default function LandingPage() {
  return (
    <div style={{
      fontFamily: "'Playfair Display', Georgia, serif",
      color: '#1A1A1A',
      background: '#FFFFFF'
    }}>
      <Navbar />
      <Hero />
      <Nosotros />
      <Productos />
      <Ventajas />
      <Contacto />
      <Footer />
    </div>
  );
}
