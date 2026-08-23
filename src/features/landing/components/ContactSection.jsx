import { Phone, MessageCircle, Mail, MapPin } from 'lucide-react';
import { Reveal } from './Reveal';
import contactImage from '../assets/arepas-contact.png';

const CONTACTS = [{ icon: Phone, text: '300 123 4567' }, { icon: MessageCircle, text: '300 123 4567' }, { icon: Mail, text: 'ventas@arepasdelcampo.com' }, { icon: MapPin, text: 'Bello Oriente, Medellín' }, { icon: MapPin, text: 'Aranjuez, Medellín' }];

export function ContactSection() {
  return <section id="contacto" className="bg-background py-16 sm:py-20"><div className="mx-auto grid max-w-6xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2"><Reveal><h2 className="text-2xl font-extrabold tracking-tight text-brand-dark sm:text-3xl">CONTÁCTANOS</h2><div className="mt-3 h-1 w-20 rounded-full bg-accent-gold" /><ul className="mt-8 space-y-5">{CONTACTS.map(({ icon: Icon, text }, index) => <li key={`${text}-${index}`} className="flex items-center gap-4"><span className="flex size-11 items-center justify-center rounded-full bg-brand/10 text-brand"><Icon className="size-5" aria-hidden /></span><span className="font-medium text-foreground/80">{text}</span></li>)}</ul></Reveal><Reveal delay={120}><div className="relative mx-auto max-w-md"><div className="absolute -inset-3 rounded-[2.5rem] bg-brand/5 blur-xl" /><img src={contactImage} alt="Arepas frescas servidas en un plato" width="640" height="480" className="relative rounded-[2rem] shadow-xl shadow-brand/20" /></div></Reveal></div></section>;
}