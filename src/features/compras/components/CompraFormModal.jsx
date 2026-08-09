import { Upload } from 'lucide-react';

export function CompraFormModal({ open, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card p-6 rounded-lg w-full max-w-2xl">
        <h2 className="mb-4">Nueva Compra</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-2">Número de Factura</label>
              <input type="text" className="w-full px-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="block mb-2">Proveedor</label>
              <select className="w-full px-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring">
                <option>Seleccionar proveedor</option>
                <option>Distribuidora ABC</option>
                <option>Insumos XYZ</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block mb-2">Cargar Factura (PDF/Imagen)</label>
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:bg-muted/50 cursor-pointer">
              <Upload className="w-12 h-12 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Haz clic o arrastra el archivo aquí</p>
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
