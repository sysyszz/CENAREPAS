import { useState } from 'react';
import { ChevronDown, Package } from 'lucide-react';

export function FichaTecnicaInsumosAccordion({ insumos = [] }) {
  const [isOpen, setIsOpen] = useState(false);

  if (!insumos || insumos.length === 0) {
    return <span className="text-xs text-muted-foreground italic">Sin insumos registrados</span>;
  }

  return (
    <div className="w-full mt-1 border border-border/70 rounded-lg overflow-hidden bg-card/60 shadow-xs">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-foreground hover:bg-muted/40 transition-colors"
        aria-expanded={isOpen}
      >
        <span className="flex items-center gap-2">
          <Package className="w-3.5 h-3.5 text-primary" />
          <span>Insumos de la Receta</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-primary/10 text-primary font-bold">
            {insumos.length}
          </span>
        </span>
        <ChevronDown
          className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="p-2.5 pt-1.5 space-y-1.5 border-t border-border/50 bg-background/50">
          {insumos.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between gap-3 text-xs bg-card p-2 rounded-md border border-border/40"
            >
              <span className="font-medium text-foreground truncate">
                {item.nombre || item.insumo_nombre || `Insumo #${item.id_insumo}`}
              </span>
              <span className="shrink-0 font-semibold text-primary px-2 py-0.5 bg-primary/10 rounded">
                {item.cantidad} {item.unidad || item.unidad_medida || 'Kg'}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}