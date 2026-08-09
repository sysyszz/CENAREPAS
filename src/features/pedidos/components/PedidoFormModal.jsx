import { Plus } from 'lucide-react';

export function PedidoFormModal({ open, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card p-6 rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <h2 className="mb-4">Nuevo Pedido</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-2">Cliente</label>
              <select className="w-full px-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring">
                <option>Seleccionar cliente</option>
                <option>Juan Pérez</option>
                <option>María García</option>
                <option>Carlos López</option>
              </select>
            </div>
            <div>
              <label className="block mb-2">Fecha de Entrega</label>
              <input type="date" className="w-full px-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
          </div>
          <div>
            <label className="block mb-4">Productos</label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <select className="flex-1 px-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring">
                  <option>Seleccionar producto</option>
                  <option>Pan Francés</option>
                  <option>Torta de Chocolate</option>
                </select>
                <input type="number" placeholder="Cantidad" className="w-32 px-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring" />
                <input type="number" placeholder="Precio" className="w-32 px-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring" />
                <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90">
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-2">Abono Inicial</label>
              <input type="number" step="0.01" placeholder="0.00" className="w-full px-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="block mb-2">Total</label>
              <input type="text" value="$0.00" disabled className="w-full px-4 py-2 border border-input bg-muted rounded-lg" />
            </div>
          </div>
          <div className="flex gap-2 pt-4">
            <button onClick={onClose} className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-muted">
              Cancelar
            </button>
            <button onClick={onClose} className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90">
              Crear Pedido
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
