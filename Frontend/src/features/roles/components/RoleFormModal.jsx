import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { mockPermisos, usePermissions } from '../../../shared/contexts/PermissionContext';

export function RoleFormModal({ open, onClose, role = null, onSave, isLoading = false }) {
  const { updateRolePermissions } = usePermissions();
  const [nombre, setNombre] = useState('');
  const [estado, setEstado] = useState('activo');
  const [descripcion, setDescripcion] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState([]);

  useEffect(() => {
    if (role) {
      setNombre(role.nombre || '');
      setEstado(role.estado || 'activo');
      setDescripcion(role.descripcion || '');
      setSelectedPermissions(role.permisos || []);
    } else {
      setNombre('');
      setEstado('activo');
      setDescripcion('');
      setSelectedPermissions([]);
    }
  }, [role, open]);

  if (!open) return null;

  const permissionsByModule = mockPermisos.reduce((modules, permission) => {
    if (!modules[permission.modulo]) modules[permission.modulo] = [];
    modules[permission.modulo].push(permission);
    return modules;
  }, {});

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nombre.trim()) return;

    const payload = role
      ? {
          ...role,
          nombre: nombre.trim(),
          estado,
          descripcion: descripcion.trim() || null,
          permisos: selectedPermissions,
        }
      : {
          nombre: nombre.trim(),
          estado: estado || 'activo',
          descripcion: descripcion.trim() || null,
          permisos: selectedPermissions,
        };

    if (role?.id_rol) {
      updateRolePermissions(role.id_rol, selectedPermissions);
    }

    if (onSave) {
      onSave(payload);
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="form-modal-panel bg-card p-6 rounded-lg max-w-2xl w-full border border-border space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="role-modal-header flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">Configuración</p>
            <h2 className="mt-1 text-xl font-semibold">{role ? 'Editar rol' : 'Nuevo rol'}</h2>
            <p className="mt-1 text-sm text-muted-foreground">Define la identidad y el alcance de acceso del rol.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 -mr-2 -mt-2 rounded-lg hover:bg-muted text-muted-foreground"
            aria-label="Cerrar formulario"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form-grid role-form-content space-y-4">
          <div className="modal-field modal-field-wide">
            <label htmlFor="rol_nombre" className="block mb-2 text-sm font-medium">Nombre del rol</label>
            <input
              id="rol_nombre"
              name="nombre"
              type="text"
              maxLength={50}
              required
              placeholder="Ej. Supervisor de planta"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full px-4 py-2 border border-input bg-input-background rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="modal-field modal-field-wide">
            <label htmlFor="rol_estado" className="block mb-2 text-sm font-medium">Estado</label>
            <select
              id="rol_estado"
              name="estado"
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
              className="w-full px-4 py-2 border border-input bg-input-background rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </select>
          </div>
          <div className="modal-field role-description-field">
            <label htmlFor="rol_descripcion" className="block mb-2 text-sm font-medium">Descripción</label>
            <textarea
              id="rol_descripcion"
              name="descripcion"
              maxLength={255}
              rows={3}
              placeholder="Describe el alcance de este rol"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="w-full px-4 py-2 border border-input bg-input-background rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <section className="role-permissions-section border border-border p-4 rounded-lg bg-muted/20">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div>
                <h3 className="font-semibold text-sm">Permisos de acceso</h3>
                <p className="text-xs text-muted-foreground">Selecciona las acciones disponibles para este rol.</p>
              </div>
              <span className="role-permissions-count text-xs font-semibold px-2.5 py-1 bg-primary/10 text-primary rounded-full">
                {selectedPermissions.length} seleccionados
              </span>
            </div>
            <div className="role-permissions-grid grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-60 overflow-y-auto p-1">
              {Object.entries(permissionsByModule).map(([moduleName, modulePermissions]) => (
                <section key={moduleName} className="role-module-permission border border-border p-3 rounded-lg bg-card">
                  <h4 className="font-semibold text-xs capitalize mb-2">{moduleName}</h4>
                  <div className="role-module-actions flex flex-wrap gap-2">
                    {modulePermissions.map((permiso) => (
                      <label key={permiso.id_permiso} className="role-action-option flex items-center gap-1.5 text-xs">
                        <input
                          type="checkbox"
                          checked={selectedPermissions.includes(permiso.id_permiso)}
                          onChange={(event) =>
                            setSelectedPermissions((current) =>
                              event.target.checked
                                ? [...current, permiso.id_permiso]
                                : current.filter((id) => id !== permiso.id_permiso)
                            )
                          }
                        />
                        <span>{permiso.accion}</span>
                      </label>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </section>
          <div className="flex gap-2 pt-4 role-form-actions">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-muted text-sm font-medium transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 disabled:opacity-50 text-sm font-medium transition-colors"
            >
              {isLoading ? 'Guardando...' : role ? 'Guardar Cambios' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

