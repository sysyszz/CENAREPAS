import { X } from 'lucide-react';

export function CategoriaFormModal({ open, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="form-modal-panel bg-card p-6 rounded-lg">
        <div className="flex items-start justify-between gap-4"><h2>Nueva Categoría</h2><button onClick={onClose} className="p-2 -mr-2 -mt-2 rounded-lg hover:bg-muted text-muted-foreground" aria-label="Cerrar formulario"><X className="w-5 h-5" /></button></div>
        <div className="modal-form-grid">
          <div className="modal-field-wide">
            <label className="block mb-2">Nombre de la Categoría</label>
            <input type="text" maxLength={80} required className="w-full px-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div className="modal-field-wide">
            <label className="block mb-2">Descripción</label>
            <textarea rows={3} className="w-full px-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"></textarea>
          </div>
          <div className="modal-field-wide">
            <label className="block mb-2">Estado</label>
            <select defaultValue="activo" className="w-full px-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring">
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </select>
          </div>
          <div className="flex gap-2 pt-4">
            <button onClick={onClose} className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-muted">
              Cancelar
            </button>
            <button onClick={onClose} className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90">
              Guardar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
//trabajo 
