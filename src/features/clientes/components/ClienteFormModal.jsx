export function ClienteFormModal({ open, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card p-6 rounded-lg w-full max-w-md">
        <h2 className="mb-4 text-lg font-semibold">Nuevo Cliente</h2>
        <div className="space-y-4">
          <div>
            <label className="block mb-2 text-sm font-medium">Nombre</label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-sm"
              maxLength={150}
              required
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium">Documento</label>
            <input type="text" maxLength={20} required className="w-full px-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-sm" />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium">Teléfono</label>
            <input
              type="tel"
              className="w-full px-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-sm"
              placeholder="+1 234-5678"
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium">Correo</label>
            <input
              type="email"
              className="w-full px-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-sm"
              maxLength={150}
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium">Dirección</label>
            <textarea
              rows={2}
              className="w-full px-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-sm"
              maxLength={255}
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium">Estado</label>
            <select defaultValue="activo" className="w-full px-4 py-2 border border-input bg-input-background rounded-lg text-sm">
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </select>
          </div>
          <div className="flex gap-2 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-muted text-sm font-medium"
            >
              Cancelar
            </button>
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 text-sm font-medium"
            >
              Guardar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
