import { X } from 'lucide-react';

export default function DetailModal({
  open,
  title,
  onClose,
  children,
  footer,
  maxWidth = 'max-w-md',
  hideFooter = false,
  className = '',
  contentClassName = 'space-y-3',
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className={`bg-card p-6 rounded-lg w-full ${maxWidth} ${className}`}>
        <div className="flex items-center justify-between mb-4">
          <h2>{title}</h2>
          <button type="button" onClick={onClose} className="p-2 hover:bg-muted rounded-lg" aria-label="Cerrar detalle">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className={contentClassName}>{children}</div>

        {!hideFooter && (
          footer ?? (
            <button
              type="button"
              onClick={onClose}
              className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 mt-4"
            >
              Cerrar
            </button>
          )
        )}
      </div>
    </div>
  );
}
