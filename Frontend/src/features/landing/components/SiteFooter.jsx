import { useConfiguracion } from '../../../shared/contexts/ConfiguracionContext';

export function SiteFooter() {
  const { nombreProyecto } = useConfiguracion();
  return (
    <footer className="bg-brand-dark py-6 text-center">
      <p className="text-sm font-medium text-white/80">
        © {new Date().getFullYear()} {nombreProyecto} · Todos los derechos reservados.
      </p>
    </footer>
  );
}