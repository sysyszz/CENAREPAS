import { X } from 'lucide-react';

export function InsumoFormModal({ open, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="form-modal-panel bg-card p-6 rounded-lg">
        <div className="flex items-start justify-between gap-4"><h2>Nuevo Insumo</h2><button onClick={onClose} className="p-2 -mr-2 -mt-2 rounded-lg hover:bg-muted text-muted-foreground" aria-label="Cerrar formulario"><X className="w-5 h-5" /></button></div>
        <div className="modal-form-grid">
          <div className="modal-field-wide">
            <label className="block mb-2">Nombre del Insumo</label>
            <input type="text" maxLength={100} required className="w-full px-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-2">Stock Inicial</label>
              <input type="number" min="0" className="w-full px-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="block mb-2">Unidad</label>
              <select className="w-full px-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring">
                <option>kg</option><option>g</option><option>l</option><option>ml</option><option>unidad</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block mb-2">Fecha de Vencimiento</label>
            <input type="date" className="w-full px-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div>
            <label className="block mb-2">Stock Mínimo (Alerta)</label>
            <input type="number" min="0" className="w-full px-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div className="modal-field-wide"><label className="block mb-2">Proveedor</label><select className="w-full px-4 py-2 border border-input bg-input-background rounded-lg"><option value="">Sin proveedor</option><option value="1">Agrícola del Valle S.A.</option><option value="2">Lácteos El Campesino</option><option value="3">Plásticos San José Ltda.</option><option value="4">Distribuidora del Campo</option></select></div>
          <div className="modal-field-wide"><label className="block mb-2">Estado</label><select defaultValue="activo" className="w-full px-4 py-2 border border-input bg-input-background rounded-lg"><option value="activo">Activo</option><option value="inactivo">Inactivo</option></select></div>
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
