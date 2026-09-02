import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { mockRoles, getRoles } from '../../roles/services/rolesService';

export function UsuarioFormModal({ open, onClose, usuario = null, onSave, isLoading = false }) {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [idRol, setIdRol] = useState('1');
  const [contrasena, setContrasena] = useState('');
  const [estado, setEstado] = useState('activo');
  const [roles, setRoles] = useState(mockRoles);

  useEffect(() => {
    getRoles().then((data) => {
      if (data && data.length > 0) setRoles(data);
    });
  }, []);

  useEffect(() => {
    if (usuario) {
      setNombre(usuario.nombre || '');
      setCorreo(usuario.correo || '');
      setIdRol(usuario.id_rol ? String(usuario.id_rol) : '1');
      setContrasena('');
      setEstado(usuario.estado || 'activo');
    } else {
      setNombre('');
      setCorreo('');
      setIdRol(roles[0]?.id_rol ? String(roles[0].id_rol) : '1');
      setContrasena('');
      setEstado('activo');
    }
  }, [usuario, open, roles]);

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nombre.trim() || !correo.trim()) return;

    const payload = usuario
      ? {
          ...usuario,
          nombre: nombre.trim(),
          correo: correo.trim(),
          id_rol: Number(idRol) || 1,
          estado,
          ...(contrasena.trim() ? { contrasena_hash: contrasena.trim() } : {}),
        }
      : {
          nombre: nombre.trim(),
          correo: correo.trim(),
          id_rol: Number(idRol) || 1,
          estado: estado || 'activo',
          contrasena_hash: contrasena.trim() || 'defaultHash',
        };

    if (onSave) {
      onSave(payload);
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="form-modal-panel bg-card p-6 rounded-lg max-w-md w-full border border-border space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-lg font-bold">{usuario ? 'Editar Usuario' : 'Nuevo Usuario'}</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 -mr-2 -mt-2 rounded-lg hover:bg-muted text-muted-foreground"
            aria-label="Cerrar formulario"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form-grid space-y-4">
          <div>
            <label htmlFor="usuario_nombre" className="block mb-2 text-sm font-medium">Nombre</label>
            <input
              id="usuario_nombre"
              name="nombre"
              type="text"
              maxLength={100}
              required
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full px-4 py-2 border border-input bg-input-background rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label htmlFor="usuario_correo" className="block mb-2 text-sm font-medium">Correo</label>
            <input
              id="usuario_correo"
              name="correo"
              type="email"
              maxLength={100}
              required
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              className="w-full px-4 py-2 border border-input bg-input-background rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label htmlFor="usuario_id_rol" className="block mb-2 text-sm font-medium">Rol</label>
            <select
              id="usuario_id_rol"
              name="id_rol"
              value={idRol}
              onChange={(e) => setIdRol(e.target.value)}
              className="w-full px-4 py-2 border border-input bg-input-background rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {roles.map((r) => (
                <option key={r.id_rol} value={String(r.id_rol)}>
                  {r.nombre}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="usuario_contrasena" className="block mb-2 text-sm font-medium">
              Contraseña {usuario ? '(Dejar en blanco para mantener la actual)' : ''}
            </label>
            <input
              id="usuario_contrasena"
              name="contrasena_hash"
              type="password"
              maxLength={255}
              required={!usuario}
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              className="w-full px-4 py-2 border border-input bg-input-background rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="modal-field-wide">
            <label htmlFor="usuario_estado" className="block mb-2 text-sm font-medium">Estado</label>
            <select
              id="usuario_estado"
              name="estado"
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
              className="w-full px-4 py-2 border border-input bg-input-background rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </select>
          </div>
          <div className="modal-field-wide flex gap-3 pt-6 border-t border-border/50">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 border border-border rounded-lg hover:bg-muted text-sm font-medium transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg hover:opacity-90 disabled:opacity-50 text-sm font-medium transition-colors cursor-pointer shadow-xs"
            >
              {isLoading ? 'Guardando...' : usuario ? 'Guardar Cambios' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

