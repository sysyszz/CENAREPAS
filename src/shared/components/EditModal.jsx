import { Save, X } from 'lucide-react';

export default function EditModal({
  open,
  title,
  editData,
  setEditData,
  onClose,
  onSave,
  isSaving = false,
  fields = [],
  submitLabel = 'Guardar',
  cancelLabel = 'Cancelar',
}) {
  if (!open || !editData) return null;

  const renderField = (field) => {
    const commonClassName = 'w-full px-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring';
    const value = editData[field.name];
    const onChange = (event) => setEditData({ ...editData, [field.name]: field.type === 'number' ? Number(event.target.value) : event.target.value });

    if (field.type === 'select') {
      return (
        <select
          value={value}
          onChange={onChange}
          className={commonClassName}
        >
          {field.options?.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      );
    }

    if (field.type === 'textarea') {
      return (
        <textarea
          value={value ?? ''}
          onChange={onChange}
          rows={field.rows ?? 3}
          maxLength={field.maxLength}
          className={commonClassName}
        />
      );
    }

    return (
      <input
        type={field.type ?? 'text'}
        value={value ?? ''}
        onChange={onChange}
        maxLength={field.maxLength}
        min={field.min}
        step={field.step}
        className={commonClassName}
      />
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="form-modal-panel bg-card p-6 rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <h2>{title}</h2>
          <button type="button" onClick={onClose} className="p-2 hover:bg-muted rounded-lg" aria-label="Cerrar edición">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="modal-form-grid">
          {fields.map((field) => (
            <div key={field.name} className={field.wide ? 'modal-field-wide' : ''}>
              <label className="block mb-2">{field.label}</label>
              {renderField(field)}
            </div>
          ))}

          <div className="flex gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-muted"
            >
              {cancelLabel === 'Cancelar' ? (
                <>
                  {cancelLabel}
                </>
              ) : (
                cancelLabel
              )}
            </button>
            <button
              type="button"
              onClick={onSave}
              disabled={isSaving}
              className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  {submitLabel}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
