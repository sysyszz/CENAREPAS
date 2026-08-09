import { X, Save } from 'lucide-react';

export function UsuarioEditModal({ open, editData, setEditData, onClose, onSave, isSaving }) {
  if (!open || !editData) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card p-6 rounded-lg w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h2>Editar Usuario</h2>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block mb-2">Nombre Completo</label>
            <input
              type="text"
              value={editData.nombre}
              onChange={(e) => setEditData({ ...editData, nombre: e.target.value })}
              className="w-full px-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="block mb-2">Email</label>
            <input
              type="email"
              value={editData.email}
              onChange={(e) => setEditData({ ...editData, email: e.target.value })}
              className="w-full px-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="block mb-2">Teléfono</label>
            <input
              type="tel"
              value={editData.telefono}
              onChange={(e) => setEditData({ ...editData, telefono: e.target.value })}
              className="w-full px-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="block mb-2">Rol</label>
            <select
              value={editData.rol}
              onChange={(e) => setEditData({ ...editData, rol: e.target.value })}
              className="w-full px-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option>Administrador</option>
              <option>Vendedor</option>
              <option>Almacenista</option>
            </select>
          </div>
          <div>
            <label className="block mb-2">Estado</label>
            <select
              value={editData.estado}
              onChange={(e) => setEditData({ ...editData, estado: e.target.value })}
              className="w-full px-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option>Activo</option>
              <option>Inactivo</option>
            </select>
          </div>
          <div className="flex gap-2 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-muted"
            >
              <X className="w-4 h-4 inline mr-2" />
              Cancelar
            </button>
            <button
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
                  Guardar
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
