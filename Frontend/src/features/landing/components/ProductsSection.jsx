import { Reveal } from './Reveal';
import arepaImage from '../assets/arepa-amarilla.png';
import arepasX5Image from '../assets/arepas-x5.png';
import arepasX10Image from '../assets/arepas-x10.png';
import arepasYellowX5Image from '../assets/arepas-amarillas-x5.png';

const PRODUCTS = [
  { name: 'Arepa Amarilla', description: 'Hecha con maíz seleccionado, suave y deliciosa.', price: '$1.200', presentation: 'Por unidad', image: arepaImage, alt: 'Arepa amarilla de maíz en un plato' },
  { name: 'Paquete de Arepas x5', description: '5 arepas frescas perfectas para compartir.', price: '$5.000', presentation: '5 unidades', image: arepasX5Image, alt: 'Paquete de cinco arepas blancas', qty: 'x5' },
  { name: 'Paquete de Arepas x10', description: '10 arepas frescas ideales para toda la familia.', price: '$9.000', presentation: '10 unidades', image: arepasX10Image, alt: 'Paquete sellado de diez arepas', qty: 'x10' },
  { name: 'Paquete de Arepas Amarillas x5', description: '5 arepas amarillas llenas de sabor y tradición.', price: '$6.000', presentation: '5 unidades', image: arepasYellowX5Image, alt: 'Paquete de cinco arepas amarillas', qty: 'x5' },
];

export function ProductsSection() {
  return <section id="productos" className="bg-muted/40 py-16 sm:py-20"><div className="mx-auto max-w-6xl px-4 sm:px-6"><Reveal className="text-center"><h2 className="text-2xl font-extrabold tracking-tight text-brand-dark sm:text-3xl">NUESTROS PRODUCTOS</h2><div className="mx-auto mt-3 h-1 w-24 rounded-full bg-accent-gold" /></Reveal><div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{PRODUCTS.map((product, index) => <Reveal key={product.name} as="article" delay={index * 120} className="group flex flex-col overflow-hidden rounded-2xl bg-card shadow-md shadow-brand/5 ring-1 ring-border/60 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-brand/15"><div className="relative aspect-[4/3] overflow-hidden"><img src={product.image} alt={product.alt} width="640" height="480" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />{product.qty ? <span className="absolute right-3 top-3 flex size-12 items-center justify-center rounded-full bg-brand text-sm font-extrabold text-white shadow-lg ring-2 ring-white/50">{product.qty}</span> : null}</div><div className="flex flex-1 flex-col p-5 text-center"><h3 className="text-base font-bold text-brand-dark">{product.name}</h3><p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground text-balance">{product.description}</p><div className="mt-4 flex items-center justify-center gap-3"><span className="text-2xl font-extrabold text-brand">{product.price}</span><span className="rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold text-brand">{product.presentation}</span></div></div></Reveal>)}</div></div></section>;
}