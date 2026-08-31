import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export function UsuarioFormModal({ open, onClose, usuario = null, onSave, isLoading = false }) {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [idRol, setIdRol] = useState('1');
  const [contrasena, setContrasena] = useState('');
  const [estado, setEstado] = useState('activo');

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
      setIdRol('1');
      setContrasena('');
      setEstado('activo');
    }
  }, [usuario, open]);

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
            <label className="block mb-2 text-sm font-medium">Nombre</label>
            <input
              type="text"
              maxLength={100}
              required
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full px-4 py-2 border border-input bg-input-background rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium">Correo</label>
            <input
              type="email"
              maxLength={100}
              required
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              className="w-full px-4 py-2 border border-input bg-input-background rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium">Rol</label>
            <select
              value={idRol}
              onChange={(e) => setIdRol(e.target.value)}
              className="w-full px-4 py-2 border border-input bg-input-background rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="1">Administrador de Planta</option>
              <option value="2">Supervisor de Producción</option>
              <option value="3">Gestor de Compras y Proveedores</option>
              <option value="4">Vendedor y Distribución</option>
              <option value="5">Auditor de Calidad</option>
            </select>
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium">
              Contraseña {usuario ? '(Dejar en blanco para mantener la actual)' : ''}
            </label>
            <input
              type="password"
              maxLength={255}
              required={!usuario}
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              className="w-full px-4 py-2 border border-input bg-input-background rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium">Estado</label>
            <select
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
              className="w-full px-4 py-2 border border-input bg-input-background rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </select>
          </div>
          <div className="flex gap-2 pt-4">
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
              {isLoading ? 'Guardando...' : usuario ? 'Guardar Cambios' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

