import { useState, useEffect } from 'react';
import { Plus, X } from 'lucide-react';

export function FichaTecnicaFormModal({ open, onClose, ficha = null, onSave, isLoading = false }) {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [instrucciones, setInstrucciones] = useState('');
  const [tiempo, setTiempo] = useState('');
  const [rendimiento, setRendimiento] = useState('');
  const [estado, setEstado] = useState('Activo');

  useEffect(() => {
    if (ficha) {
      setNombre(ficha.nombre || '');
      setDescripcion(ficha.descripcion || '');
      setInstrucciones(ficha.instrucciones_preparacion || '');
      setTiempo(ficha.tiempo_estimado_minutos != null ? String(ficha.tiempo_estimado_minutos) : '');
      setRendimiento(ficha.rendimiento_lote != null ? String(ficha.rendimiento_lote) : '');
      const isInactive = String(ficha.estado ?? '').toLowerCase() === 'inactivo';
      setEstado(isInactive ? 'Inactivo' : 'Activo');
    } else {
      setNombre('');
      setDescripcion('');
      setInstrucciones('');
      setTiempo('');
      setRendimiento('');
      setEstado('Activo');
    }
  }, [ficha, open]);

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nombre.trim()) return;
    const payload = ficha
      ? {
          ...ficha,
          nombre: nombre.trim(),
          descripcion: descripcion.trim(),
          instrucciones_preparacion: instrucciones.trim(),
          tiempo_estimado_minutos: Number(tiempo) || 0,
          rendimiento_lote: Number(rendimiento) || 0,
          estado,
        }
      : {
          nombre: nombre.trim(),
          descripcion: descripcion.trim(),
          instrucciones_preparacion: instrucciones.trim(),
          tiempo_estimado_minutos: Number(tiempo) || 0,
          rendimiento_lote: Number(rendimiento) || 0,
          estado,
        };
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
          <h2 className="text-lg font-bold">{ficha ? 'Editar Ficha Técnica' : 'Nueva Ficha Técnica'}</h2>
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
              maxLength={100}
              required
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full px-4 py-2 border border-input bg-input-background rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="modal-field-wide">
            <label className="block mb-2 text-sm font-medium">Descripción</label>
            <textarea
              maxLength={255}
              rows={2}
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="w-full px-4 py-2 border border-input bg-input-background rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="modal-field-wide">
            <label className="block mb-2 text-sm font-medium">Instrucciones de Preparación</label>
            <textarea
              rows={3}
              value={instrucciones}
              onChange={(e) => setInstrucciones(e.target.value)}
              className="w-full px-4 py-2 border border-input bg-input-background rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium">Tiempo Estimado (min)</label>
            <input
              type="number"
              min="0"
              value={tiempo}
              onChange={(e) => setTiempo(e.target.value)}
              className="w-full px-4 py-2 border border-input bg-input-background rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium">Rendimiento por Lote</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={rendimiento}
              onChange={(e) => setRendimiento(e.target.value)}
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
              <option value="Activo">Activo / Vigente</option>
              <option value="Inactivo">Inactivo / En Revisión</option>
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
