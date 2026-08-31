import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export function CategoriaFormModal({ open, onClose, categoria = null, onSave, isLoading = false }) {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [estado, setEstado] = useState('Activo');

  useEffect(() => {
    if (categoria) {
      setNombre(categoria.nombre || '');
      setDescripcion(categoria.descripcion || '');
      const isInactive = String(categoria.estado ?? '').toLowerCase() === 'inactivo';
      setEstado(isInactive ? 'Inactivo' : 'Activo');
    } else {
      setNombre('');
      setDescripcion('');
      setEstado('Activo');
    }
  }, [categoria, open]);

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nombre.trim()) return;
    const payload = categoria
      ? { ...categoria, nombre: nombre.trim(), descripcion: descripcion.trim(), estado }
      : { nombre: nombre.trim(), descripcion: descripcion.trim(), estado };
    if (onSave) {
      onSave(payload);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="form-modal-panel bg-card p-6 rounded-lg max-w-md w-full border border-border space-y-4">
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-lg font-bold">{categoria ? 'Editar Categoría' : 'Nueva Categoría'}</h2>
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
            <label className="block mb-2 text-sm font-medium">Nombre de la Categoría</label>
            <input
              type="text"
              maxLength={80}
              required
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej. Arepas de Chócolo"
              className="w-full px-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="modal-field-wide">
            <label className="block mb-2 text-sm font-medium">Descripción</label>
            <textarea
              rows={3}
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Descripción breve de la categoría..."
              className="w-full px-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            ></textarea>
          </div>

          <div className="modal-field-wide">
            <label className="block mb-2 text-sm font-medium">Estado</label>
            <select
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
              className="px-4 py-2 border border-input bg-input-background rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring w-full"
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
              className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-muted font-medium transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 disabled:opacity-50 font-medium transition-colors"
            >
              {isLoading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 
