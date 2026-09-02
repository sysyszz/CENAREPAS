import { X } from 'lucide-react';

export function UsuarioFormModal({ open, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="form-modal-panel bg-card p-6 rounded-lg">
        <div className="flex items-start justify-between gap-4"><h2>Nuevo Usuario</h2><button onClick={onClose} className="p-2 -mr-2 -mt-2 rounded-lg hover:bg-muted text-muted-foreground" aria-label="Cerrar formulario"><X className="w-5 h-5" /></button></div>
        <div className="modal-form-grid">
          <div>
            <label className="block mb-2">Nombre</label>
            <input type="text" maxLength={100} required className="w-full px-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div>
            <label className="block mb-2">Correo</label>
            <input type="email" maxLength={100} required className="w-full px-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div>
            <label className="block mb-2">Rol</label>
            <select className="w-full px-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring">
              <option>Seleccionar rol</option>
              <option value="">Seleccionar rol</option>
              <option value="1">Administrador de Planta</option>
              <option value="2">Supervisor de Producción</option>
              <option value="3">Gestor de Compras y Proveedores</option>
              <option value="4">Vendedor y Distribución</option>
              <option value="5">Auditor de Calidad</option>
            </select>
          </div>
          <div>
            <label className="block mb-2">Contraseña</label>
            <input type="password" maxLength={255} required className="w-full px-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring" />
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
