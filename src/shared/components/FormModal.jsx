import { X } from 'lucide-react';

export default function FormModal({
  open,
  title,
  onClose,
  onSubmit,
  submitLabel = 'Guardar',
  cancelLabel = 'Cancelar',
  children,
  maxWidth = 'max-w-xl',
  footer,
  hideFooter = false,
  contentClassName = '',
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className={`form-modal-panel bg-card p-6 rounded-lg w-full ${maxWidth}`}>
        <div className="flex items-start justify-between gap-4">
          <h2>{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 -mr-2 -mt-2 rounded-lg hover:bg-muted text-muted-foreground"
            aria-label="Cerrar formulario"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className={`modal-form-grid ${contentClassName}`}>
          {children}
        </div>

        {!hideFooter && (footer ?? (
          <div className="flex gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-muted"
            >
              {cancelLabel}
            </button>
            <button
              type="button"
              onClick={onSubmit}
              className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
            >
              {submitLabel}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
