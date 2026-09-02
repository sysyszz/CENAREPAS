import { Save, X } from 'lucide-react';

export function ProveedorEditModal({ open, editData, setEditData, onClose, onSave, isSaving }) {
  if (!open || !editData) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="form-modal-panel bg-card p-6 rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <h2>Editar Proveedor</h2>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="modal-form-grid">
          <div>
            <label htmlFor="edit_proveedor_nombre" className="block mb-2 text-sm font-medium">Nombre / Razón Social *</label>
            <input
              id="edit_proveedor_nombre"
              name="nombre"
              type="text"
              maxLength={150}
              required
              value={editData.nombre}
              onChange={(e) => setEditData({ ...editData, nombre: e.target.value })}
              className="w-full px-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label htmlFor="edit_proveedor_nit" className="block mb-2 text-sm font-medium">NIT / Cédula *</label>
            <input
              id="edit_proveedor_nit"
              name="nit"
              type="text"
              maxLength={20}
              required
              value={editData.nit}
              onChange={(e) => setEditData({ ...editData, nit: e.target.value })}
              className="w-full px-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label htmlFor="edit_proveedor_telefono" className="block mb-2 text-sm font-medium">Teléfono</label>
            <input
              id="edit_proveedor_telefono"
              name="telefono"
              type="tel"
              maxLength={20}
              value={editData.telefono || ''}
              onChange={(e) => setEditData({ ...editData, telefono: e.target.value })}
              className="w-full px-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label htmlFor="edit_proveedor_correo" className="block mb-2 text-sm font-medium">Correo Electrónico</label>
            <input
              id="edit_proveedor_correo"
              name="correo"
              type="email"
              maxLength={150}
              value={editData.correo || ''}
              onChange={(e) => setEditData({ ...editData, correo: e.target.value })}
              className="w-full px-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="modal-field-wide">
            <label htmlFor="edit_proveedor_direccion" className="block mb-2 text-sm font-medium">Dirección</label>
            <input
              id="edit_proveedor_direccion"
              name="direccion"
              type="text"
              maxLength={255}
              value={editData.direccion || ''}
              onChange={(e) => setEditData({ ...editData, direccion: e.target.value })}
              className="w-full px-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="modal-field-wide">
            <label htmlFor="edit_proveedor_estado" className="block mb-2 text-sm font-medium">Estado</label>
            <select
              id="edit_proveedor_estado"
              name="estado"
              value={editData.estado || 'activo'}
              onChange={(e) => setEditData({ ...editData, estado: e.target.value })}
              className="w-full px-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </select>
          </div>
          <div className="flex gap-2 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-muted"
            >
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
