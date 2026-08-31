import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export function ClienteFormModal({ open, onClose, cliente = null, onSave, isLoading = false }) {
  const [nombre, setNombre] = useState('');
  const [documento, setDocumento] = useState('');
  const [telefono, setTelefono] = useState('');
  const [correo, setCorreo] = useState('');
  const [direccion, setDireccion] = useState('');
  const [estado, setEstado] = useState('Activo');

  useEffect(() => {
    if (cliente) {
      setNombre(cliente.nombre || '');
      setDocumento(cliente.documento || '');
      setTelefono(cliente.telefono || '');
      setCorreo(cliente.correo || '');
      setDireccion(cliente.direccion || '');
      const isInactive = String(cliente.estado ?? '').toLowerCase() === 'inactivo';
      setEstado(isInactive ? 'Inactivo' : 'Activo');
    } else {
      setNombre('');
      setDocumento('');
      setTelefono('');
      setCorreo('');
      setDireccion('');
      setEstado('Activo');
    }
  }, [cliente, open]);

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nombre.trim()) return;
    const payload = cliente
      ? { ...cliente, nombre: nombre.trim(), documento: documento.trim(), telefono: telefono.trim(), correo: correo.trim(), direccion: direccion.trim(), estado }
      : { nombre: nombre.trim(), documento: documento.trim(), telefono: telefono.trim(), correo: correo.trim(), direccion: direccion.trim(), estado };
    if (onSave) {
      onSave(payload);
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="form-modal-panel bg-card p-6 rounded-lg max-w-md w-full border border-border space-y-4">
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-lg font-bold">{cliente ? 'Editar Cliente' : 'Nuevo Cliente'}</h2>
          <button onClick={onClose} type="button" className="p-2 -mr-2 -mt-2 rounded-lg hover:bg-muted text-muted-foreground" aria-label="Cerrar formulario">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form-grid space-y-4">
          <div className="modal-field-wide">
            <label className="block mb-2 text-sm font-medium">Nombre / Razón Social</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full px-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-sm"
              maxLength={150}
              required
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium">Documento</label>
            <input
              type="text"
              value={documento}
              onChange={(e) => setDocumento(e.target.value)}
              maxLength={20}
              required
              className="w-full px-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-sm"
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium">Teléfono</label>
            <input
              type="tel"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              className="w-full px-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-sm"
              placeholder="+57 300 000 0000"
            />
          </div>
          <div className="modal-field-wide">
            <label className="block mb-2 text-sm font-medium">Correo</label>
            <input
              type="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              className="w-full px-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-sm"
              maxLength={150}
            />
          </div>
          <div className="modal-field-wide">
            <label className="block mb-2 text-sm font-medium">Dirección</label>
            <textarea
              rows={2}
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
              className="w-full px-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-sm"
              maxLength={255}
            />
          </div>
          <div className="modal-field-wide">
            <label className="block mb-2 text-sm font-medium">Estado</label>
            <select
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
              className="w-full px-4 py-2 border border-input bg-input-background rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
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
              {isLoading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
