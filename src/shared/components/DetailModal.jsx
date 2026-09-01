import { X } from 'lucide-react';

export default function DetailModal({ isOpen, onClose, title, fields = [] }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-card text-card-foreground p-6 rounded-xl max-w-lg w-full border border-border shadow-2xl space-y-5 max-h-[90vh] flex flex-col animate-in fade-in-50 zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-border shrink-0">
          <div>
            <h3 className="text-lg font-bold tracking-tight text-foreground">{title}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Detalle completo del registro seleccionado
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Fields */}
        <div className="space-y-3 overflow-y-auto flex-1 pr-1 custom-scrollbar text-sm">
          {fields.map(({ label, value }, i) => (
            <div
              key={i}
              className="flex flex-col sm:flex-row sm:items-start justify-between gap-1 sm:gap-4 p-2.5 rounded-lg bg-muted/30 border border-border/50"
            >
              <span className="text-xs text-muted-foreground font-medium shrink-0 min-w-[140px]">
                {label}
              </span>
              <div className="text-xs font-medium text-foreground text-left sm:text-right break-words flex-1">
                {value !== undefined && value !== null && value !== '' ? value : <span className="text-muted-foreground/60">N/A</span>}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-border flex justify-end shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2 bg-primary text-primary-foreground hover:opacity-90 rounded-lg text-sm font-medium transition-opacity shadow-xs"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
