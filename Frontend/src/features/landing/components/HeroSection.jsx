import { Leaf, Heart } from 'lucide-react';
import basketImage from '../assets/arepas-basket.png';

export function HeroSection() {
  return (
    <section id="inicio" className="relative overflow-hidden bg-gradient-to-br from-brand-light via-brand to-brand-dark pt-20">
      <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 pb-28 pt-12 sm:px-6 md:pb-36 lg:grid-cols-2 lg:gap-12 lg:pt-16">
        <div className="animate-fade-left text-white">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-white/80">Fábrica de</p>
          <h1 className="mt-1 font-script text-6xl leading-none drop-shadow-sm sm:text-7xl lg:text-8xl">Arepas</h1>
          <p className="mt-4 max-w-md text-lg font-medium uppercase leading-relaxed tracking-wide text-white/90">Frescas, deliciosas y hechas con ingredientes de calidad</p>
          <div className="mt-6 h-1 w-16 rounded-full bg-accent-gold" />
          <div className="mt-8 flex flex-wrap gap-8">
            <div className="flex items-center gap-3"><span className="flex size-11 items-center justify-center rounded-full bg-white/15 ring-1 ring-white/30 backdrop-blur-sm"><Leaf className="size-5 text-white" aria-hidden /></span><span className="text-sm font-semibold">100% Naturales</span></div>
            <div className="flex items-center gap-3"><span className="flex size-11 items-center justify-center rounded-full bg-white/15 ring-1 ring-white/30 backdrop-blur-sm"><Heart className="size-5 text-white" aria-hidden /></span><span className="text-sm font-semibold">Hechas con amor</span></div>
          </div>
        </div>

        <div className="animate-fade-right [animation-delay:200ms]">
          <div className="relative mx-auto max-w-lg"><div className="absolute -inset-4 rounded-[2.5rem] bg-white/10 blur-2xl" /><img src={basketImage} alt="Canasta con arepas de maíz blancas y amarillas recién hechas" width="720" height="720" className="relative rounded-[2rem] shadow-2xl shadow-brand-dark/40" /></div>
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 leading-[0]"><svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="h-16 w-full sm:h-24" aria-hidden><path fill="var(--background)" d="M0,64 C240,120 480,120 720,90 C960,60 1200,10 1440,48 L1440,120 L0,120 Z" /></svg></div>
    </section>
  );
}