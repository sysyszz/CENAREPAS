import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export function ProveedorFormModal({ open, onClose, proveedor = null, onSave, isLoading = false }) {
  const [nombre, setNombre] = useState('');
  const [nit, setNit] = useState('');
  const [telefono, setTelefono] = useState('');
  const [correo, setCorreo] = useState('');
  const [direccion, setDireccion] = useState('');
  const [estado, setEstado] = useState('activo');

  useEffect(() => {
    if (proveedor) {
      setNombre(proveedor.nombre || '');
      setNit(proveedor.nit || '');
      setTelefono(proveedor.telefono || '');
      setCorreo(proveedor.correo || '');
      setDireccion(proveedor.direccion || '');
      setEstado(proveedor.estado || 'activo');
    } else {
      setNombre('');
      setNit('');
      setTelefono('');
      setCorreo('');
      setDireccion('');
      setEstado('activo');
    }
  }, [proveedor, open]);

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nombre.trim()) return;

    const payload = proveedor
      ? {
          ...proveedor,
          nombre: nombre.trim(),
          nit: nit.trim(),
          telefono: telefono.trim() || null,
          correo: correo.trim() || null,
          direccion: direccion.trim() || null,
          estado,
        }
      : {
          nombre: nombre.trim(),
          nit: nit.trim(),
          telefono: telefono.trim() || null,
          correo: correo.trim() || null,
          direccion: direccion.trim() || null,
          estado: estado || 'activo',
        };

    if (onSave) {
      onSave(payload);
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="form-modal-panel bg-card p-6 rounded-lg max-w-lg w-full border border-border space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-lg font-bold">{proveedor ? 'Editar Proveedor' : 'Nuevo Proveedor'}</h2>
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
          <div className="modal-field-wide">
            <label className="block mb-2 text-sm font-medium">Nombre</label>
            <input
              type="text"
              maxLength={150}
              required
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full px-4 py-2 border border-input bg-input-background rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 text-sm font-medium">NIT</label>
              <input
                type="text"
                maxLength={20}
                required
                value={nit}
                onChange={(e) => setNit(e.target.value)}
                className="w-full px-4 py-2 border border-input bg-input-background rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium">Teléfono</label>
              <input
                type="tel"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                className="w-full px-4 py-2 border border-input bg-input-background rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>
          <div className="modal-field-wide">
            <label className="block mb-2 text-sm font-medium">Correo</label>
            <input
              type="email"
              maxLength={150}
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              className="w-full px-4 py-2 border border-input bg-input-background rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="modal-field-wide">
            <label className="block mb-2 text-sm font-medium">Dirección</label>
            <input
              type="text"
              maxLength={255}
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
              className="w-full px-4 py-2 border border-input bg-input-background rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="modal-field-wide">
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
              {isLoading ? 'Guardando...' : proveedor ? 'Guardar Cambios' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

