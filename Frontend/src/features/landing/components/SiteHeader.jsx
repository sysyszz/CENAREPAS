import { useEffect, useState } from 'react';
import { LogIn, Menu, X } from 'lucide-react';
import logoIcon from '../../../assets/logo-icon.png';

const NAV_LINKS = [
  { label: 'Inicio', href: '#inicio' },
  { label: 'Nosotros', href: '#nosotros' },
  { label: 'Productos', href: '#productos' },
  { label: 'Ventajas', href: '#ventajas' },
  { label: 'Contacto', href: '#contacto' },
];

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-background/80 shadow-md shadow-brand/5 backdrop-blur-md' : 'bg-background'}`}>
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <a href="#inicio" className="flex items-center gap-3">
          <img
            src={logoIcon}
            alt="CENAREPAS"
            className="h-12 w-12 shrink-0 object-contain drop-shadow-md sm:h-[3.25rem] sm:w-[3.25rem]"
          />
          <span className="flex flex-col leading-tight">
            <span className="text-base font-extrabold tracking-tight text-brand-dark sm:text-lg">CENAREPAS</span>
            <span className="text-[10px] font-medium tracking-[0.18em] text-muted-foreground">SISTEMA DE GESTIÓN</span>
          </span>
        </a>

        <nav className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map((link) => <a key={link.href} href={link.href} className="landing-nav-link rounded-md px-2 py-1 text-sm font-semibold tracking-wide transition-colors duration-200 ease-out">{link.label}</a>)}
        </nav>

        <div className="flex items-center gap-3">
          <a href="/admin/login" className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-brand/30 transition-all hover:-translate-y-0.5 hover:bg-brand-dark hover:shadow-lg">
            <LogIn className="size-4" aria-hidden />
            <span className="hidden sm:inline">Ingresar</span>
          </a>
          <button type="button" onClick={() => setOpen((value) => !value)} className="flex size-10 items-center justify-center rounded-full text-brand-dark transition-colors hover:bg-brand/10 lg:hidden" aria-label={open ? 'Cerrar menú' : 'Abrir menú'} aria-expanded={open}>
            {open ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </div>

      <div className={`overflow-hidden border-t border-border/60 bg-background/95 backdrop-blur-md transition-all duration-300 lg:hidden ${open ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'}`}>
        <nav className="mx-auto flex max-w-6xl flex-col px-4 py-2 sm:px-6">
          {NAV_LINKS.map((link) => <a key={link.href} href={link.href} onClick={() => setOpen(false)} className="landing-nav-link rounded-lg px-3 py-3 text-sm font-semibold transition-colors duration-200 ease-out">{link.label}</a>)}
        </nav>
      </div>
    </header>
  );
}
