export function ProveedorFormModal({ open, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card p-6 rounded-lg w-full max-w-md">
        <h2 className="mb-4">Nuevo Proveedor</h2>
        <div className="space-y-4">
          <div>
            <label className="block mb-2">Nombre de la Empresa</label>
            <input type="text" className="w-full px-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div>
            <label className="block mb-2">Persona de Contacto</label>
            <input type="text" className="w-full px-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div>
            <label className="block mb-2">Teléfono</label>
            <input type="tel" className="w-full px-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div>
            <label className="block mb-2">Email</label>
            <input type="email" className="w-full px-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring" />
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
