import { useState } from 'react';
import FormModal from '../../../shared/components/FormModal';
import { mockPermisos, usePermissions } from '../../../shared/contexts/PermissionContext';

export function RoleFormModal({ open, onClose }) {
  const { updateRolePermissions } = usePermissions();
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const permissionsByModule = mockPermisos.reduce((modules, permission) => {
    if (!modules[permission.modulo]) modules[permission.modulo] = [];
    modules[permission.modulo].push(permission);
    return modules;
  }, {});

  const handleSubmit = () => {
    updateRolePermissions(1, selectedPermissions);
    onClose();
  };

  return (
    <FormModal
      open={open}
      title="Nuevo rol"
      onClose={onClose}
      onSubmit={handleSubmit}
      submitLabel="Guardar"
      cancelLabel="Cancelar"
      maxWidth="max-w-3xl"
      contentClassName="role-form-content"
      footer={(
        <div className="flex gap-2 pt-4 role-form-actions">
          <button onClick={onClose} className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-muted">
            Cancelar
          </button>
          <button onClick={handleSubmit} className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90">
            Guardar
          </button>
        </div>
      )}
    >
      <div className="role-modal-header">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">Configuración</p>
          <p className="mt-1 text-sm text-muted-foreground">Define la identidad y el alcance de acceso del rol.</p>
        </div>
      </div>
      <div className="modal-form-grid role-form-content">
        <div className="modal-field modal-field-wide">
          <label>Nombre del rol</label>
          <input type="text" maxLength={50} required placeholder="Ej. Supervisor de planta" className="w-full px-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
        <div className="modal-field modal-field-wide">
            <label>Estado</label>
            <select defaultValue="activo" className="w-full px-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring">
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </select>
          </div>
          <div className="modal-field role-description-field">
            <label>Descripción</label>
            <textarea maxLength={255} rows={3} placeholder="Describe el alcance de este rol" className="w-full px-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <section className="role-permissions-section">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div>
                <h3 className="font-semibold">Permisos de acceso</h3>
                <p className="text-sm text-muted-foreground">Selecciona las acciones disponibles para este rol.</p>
              </div>
              <span className="role-permissions-count">{selectedPermissions.length} seleccionados</span>
            </div>
            <div className="role-permissions-grid">
              {Object.entries(permissionsByModule).map(([moduleName, modulePermissions]) => (
                <section key={moduleName} className="role-module-permission">
                  <h4>{moduleName}</h4>
                  <div className="role-module-actions">
                    {modulePermissions.map((permiso) => (
                      <label key={permiso.id_permiso} className="role-action-option">
                        <input type="checkbox" checked={selectedPermissions.includes(permiso.id_permiso)} onChange={(event) => setSelectedPermissions((current) => event.target.checked ? [...current, permiso.id_permiso] : current.filter((id) => id !== permiso.id_permiso))} />
                        <span>{permiso.accion}</span>
                      </label>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </section>
        </div>
    </FormModal>
  );
}
