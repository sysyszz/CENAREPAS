import { Factory, BadgeCheck, Truck } from 'lucide-react';
import { Reveal } from './Reveal';

const FEATURES = [
  { icon: Factory, label: 'Producción\ndiaria' },
  { icon: BadgeCheck, label: 'Calidad\ngarantizada' },
  { icon: Truck, label: 'Entregas\nrápidas' },
];

export function AboutSection() {
  return <section id="nosotros" className="bg-background py-16 sm:py-20"><div className="mx-auto grid max-w-6xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2"><Reveal><h2 className="text-2xl font-extrabold tracking-tight text-brand-dark sm:text-3xl">¿QUIÉNES SOMOS?</h2><div className="mt-3 h-1 w-20 rounded-full bg-accent-gold" /><div className="mt-6 space-y-4 text-base leading-relaxed text-muted-foreground"><p>Somos una fábrica dedicada a la producción de arepas de alta calidad.</p><p>Trabajamos cada día para llevar a tu mesa un producto fresco, tradicional y nutritivo.</p></div></Reveal><Reveal delay={120}><div className="grid grid-cols-3 gap-4 border-l border-border/70 pl-6 sm:gap-6 sm:pl-10">{FEATURES.map(({ icon: Icon, label }) => <div key={label} className="group flex flex-col items-center gap-3 text-center"><span className="flex size-16 items-center justify-center rounded-full border-2 border-brand/30 text-brand transition-all duration-300 group-hover:-translate-y-1 group-hover:border-brand group-hover:bg-brand group-hover:text-white sm:size-20"><Icon className="size-7 sm:size-9" aria-hidden /></span><span className="whitespace-pre-line text-sm font-semibold text-brand-dark">{label}</span></div>)}</div></Reveal></div></section>;
}