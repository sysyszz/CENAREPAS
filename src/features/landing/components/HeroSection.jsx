import { useState, useEffect } from 'react';
import { Leaf, Heart, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { useConfiguracion } from '../../../shared/contexts/ConfiguracionContext';
import defaultBasketImage from '../assets/arepas-basket.png';

export function HeroSection() {
  const { nombreProyecto, eslogan, bannerImages } = useConfiguracion();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = bannerImages && bannerImages.length > 0
    ? bannerImages
    : [{ id: 'default', url: defaultBasketImage, titulo: 'Arepas Tradicionales' }];

  // Auto-play slideshow if multiple slides exist
  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const activeSlide = slides[currentSlide] || slides[0];

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  return (
    <section id="inicio" className="relative overflow-hidden bg-gradient-to-br from-brand-light via-brand to-brand-dark pt-20">
      <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 pb-28 pt-12 sm:px-6 md:pb-36 lg:grid-cols-2 lg:gap-12 lg:pt-16">
        <div className="animate-fade-left text-white">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-white/80">Fábrica de Arepas</p>
          <h1 className="mt-1 font-script text-6xl leading-none drop-shadow-sm sm:text-7xl lg:text-8xl">
            {nombreProyecto}
          </h1>
          <p className="mt-4 max-w-md text-lg font-medium uppercase leading-relaxed tracking-wide text-white/90">
            {eslogan || 'Frescas, deliciosas y hechas con ingredientes de calidad'}
          </p>
          <div className="mt-6 h-1 w-16 rounded-full bg-accent-gold" />
          <div className="mt-8 flex flex-wrap gap-8">
            <div className="flex items-center gap-3">
              <span className="flex size-11 items-center justify-center rounded-full bg-white/15 ring-1 ring-white/30 backdrop-blur-sm">
                <Leaf className="size-5 text-white" aria-hidden />
              </span>
              <span className="text-sm font-semibold">100% Naturales</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex size-11 items-center justify-center rounded-full bg-white/15 ring-1 ring-white/30 backdrop-blur-sm">
                <Heart className="size-5 text-white" aria-hidden />
              </span>
              <span className="text-sm font-semibold">Hechas con amor</span>
            </div>
          </div>
        </div>

        {/* Carousel / Banner Container */}
        <div className="animate-fade-right [animation-delay:200ms] relative">
          <div className="relative mx-auto max-w-lg">
            <div className="absolute -inset-4 rounded-[2.5rem] bg-white/10 blur-2xl pointer-events-none" />
            
            <div className="relative rounded-[2rem] overflow-hidden shadow-2xl shadow-brand-dark/40 aspect-square bg-brand-dark/30 border border-white/10">
              <img
                key={activeSlide.url}
                src={activeSlide.url}
                alt={activeSlide.titulo || nombreProyecto}
                width="720"
                height="720"
                className="w-full h-full object-cover transition-all duration-700 animate-in fade-in zoom-in-95"
              />

              {/* Caption Tag */}
              {activeSlide.titulo && (
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 text-white">
                  <p className="font-bold text-base drop-shadow-md">{activeSlide.titulo}</p>
                  {activeSlide.subtitulo && (
                    <p className="text-xs text-white/80 mt-0.5">{activeSlide.subtitulo}</p>
                  )}
                </div>
              )}

              {/* Navigation Arrows for Multiple Slides */}
              {slides.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={prevSlide}
                    aria-label="Slide anterior"
                    className="absolute left-3 top-1/2 -translate-y-1/2 size-9 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-xs transition-all border border-white/20 cursor-pointer"
                  >
                    <ChevronLeft className="size-5" />
                  </button>
                  <button
                    type="button"
                    onClick={nextSlide}
                    aria-label="Siguiente slide"
                    className="absolute right-3 top-1/2 -translate-y-1/2 size-9 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-xs transition-all border border-white/20 cursor-pointer"
                  >
                    <ChevronRight className="size-5" />
                  </button>

                  {/* Indicator Dots */}
                  <div className="absolute bottom-3 right-4 flex items-center gap-1.5 z-20">
                    {slides.map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setCurrentSlide(idx)}
                        aria-label={`Ir al slide ${idx + 1}`}
                        className={`transition-all rounded-full ${
                          idx === currentSlide
                            ? 'w-6 h-2 bg-accent-gold'
                            : 'w-2 h-2 bg-white/50 hover:bg-white/80'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 leading-[0]">
        <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="h-16 w-full sm:h-24" aria-hidden>
          <path fill="var(--background)" d="M0,64 C240,120 480,120 720,90 C960,60 1200,10 1440,48 L1440,120 L0,120 Z" />
        </svg>
      </div>
    </section>
  );
}