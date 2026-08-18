export function ProductoFormModal({ open, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card p-6 rounded-lg w-full max-w-md">
        <h2 className="mb-4">Nuevo Producto</h2>
        <div className="space-y-4">
          <div>
            <label className="block mb-2">Nombre del Producto</label>
            <input type="text" maxLength={100} required className="w-full px-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div>
            <label className="block mb-2">Categoría</label>
            <select className="w-full px-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring">
              <option>Seleccionar categoría</option>
              <option value="1">Arepas Dulces</option>
              <option value="2">Arepas Blancas</option>
              <option value="3">Arepas Rellenas</option>
              <option value="4">Arepas Especiales</option>
              <option value="5">Derivados de Maíz</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-2">Precio</label>
              <input type="number" step="0.01" min="0" required className="w-full px-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="block mb-2">Stock Inicial</label>
              <input type="number" min="0" className="w-full px-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
          </div>
          <div>
            <label className="block mb-2">Descripción</label>
            <textarea rows={3} maxLength={255} className="w-full px-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"></textarea>
          </div>
          <div><label className="block mb-2">Ficha técnica</label><input type="number" min="1" className="w-full px-4 py-2 border border-input bg-input-background rounded-lg" /></div>
          <div><label className="block mb-2">Proveedor</label><input type="number" min="1" className="w-full px-4 py-2 border border-input bg-input-background rounded-lg" /></div>
          <div><label className="block mb-2">Imagen URL</label><input type="url" maxLength={255} className="w-full px-4 py-2 border border-input bg-input-background rounded-lg" /></div>
          <div><label className="block mb-2">Stock mínimo</label><input type="number" min="0" className="w-full px-4 py-2 border border-input bg-input-background rounded-lg" /></div>
          <div><label className="block mb-2">Fecha de vencimiento</label><input type="date" className="w-full px-4 py-2 border border-input bg-input-background rounded-lg" /></div>
          <div><label className="block mb-2">Estado</label><select defaultValue="activo" className="w-full px-4 py-2 border border-input bg-input-background rounded-lg"><option value="activo">Activo</option><option value="inactivo">Inactivo</option></select></div>
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
