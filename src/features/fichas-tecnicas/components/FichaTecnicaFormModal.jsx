import { Plus } from 'lucide-react';

export function FichaTecnicaFormModal({ open, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card p-6 rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <h2 className="mb-4">Nueva Ficha Técnica</h2>
        <div className="space-y-4">
          <div>
            <label className="block mb-2">Nombre del Producto</label>
            <input type="text" className="w-full px-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div>
            <label className="block mb-2">Rendimiento Esperado</label>
            <input type="text" placeholder="Ej: 50 unidades" className="w-full px-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div>
            <label className="block mb-4">Insumos Requeridos</label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <select className="flex-1 px-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring">
                  <option>Seleccionar insumo</option>
                  <option>Harina</option>
                  <option>Azúcar</option>
                </select>
                <input type="number" placeholder="Cantidad" className="w-32 px-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring" />
                <select className="w-32 px-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring">
                  <option>Kg</option>
                  <option>g</option>
                  <option>L</option>
                </select>
                <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90">
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>
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
