export function RoleFormModal({ open, onClose }) {
  if (!open) return null;

  const permisos = [
    'Usuarios', 'Roles', 'Proveedores', 'Compras', 'Categorías', 'Fichas Técnicas',
    'Insumos', 'Producción', 'Productos', 'Clientes', 'Pedidos', 'Ventas',
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="mb-4">Nuevo Rol</h2>
        <div className="space-y-4">
          <div>
            <label className="block mb-2">Nombre del Rol</label>
            <input type="text" className="w-full px-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div>
            <label className="block mb-4">Permisos</label>
            <div className="grid grid-cols-2 gap-3">
              {permisos.map((permiso) => (
                <label key={permiso} className="flex items-center gap-2 p-3 border border-border rounded-lg hover:bg-muted cursor-pointer">
                  <input type="checkbox" className="w-4 h-4" />
                  <span className="text-sm">{permiso}</span>
                </label>
              ))}
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
