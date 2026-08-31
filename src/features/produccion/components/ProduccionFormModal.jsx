import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export function ProduccionFormModal({ open, onClose, lote = null, onSave, isLoading = false }) {
  const [idFicha, setIdFicha] = useState('1');
  const [cantidadProducida, setCantidadProducida] = useState('');
  const [idUsuarioResponsable, setIdUsuarioResponsable] = useState('1');
  const [fechaProduccion, setFechaProduccion] = useState('');
  const [estado, setEstado] = useState('en_proceso');
  const [observaciones, setObservaciones] = useState('');

  useEffect(() => {
    if (lote) {
      setIdFicha(lote.id_ficha ? String(lote.id_ficha) : '1');
      setCantidadProducida(lote.cantidad_producida != null ? String(lote.cantidad_producida) : '');
      setIdUsuarioResponsable(lote.id_usuario_responsable ? String(lote.id_usuario_responsable) : '1');
      setFechaProduccion(lote.fecha_produccion || '');
      setEstado(lote.estado || 'en_proceso');
      setObservaciones(lote.observaciones || '');
    } else {
      setIdFicha('1');
      setCantidadProducida('');
      setIdUsuarioResponsable('1');
      setFechaProduccion('');
      setEstado('en_proceso');
      setObservaciones('');
    }
  }, [lote, open]);

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = lote
      ? {
          ...lote,
          id_ficha: Number(idFicha) || 1,
          cantidad_producida: Number(cantidadProducida) || 0,
          id_usuario_responsable: Number(idUsuarioResponsable) || 1,
          fecha_produccion: fechaProduccion || new Date().toISOString().split('T')[0],
          estado,
          observaciones: observaciones.trim() || null,
        }
      : {
          id_ficha: Number(idFicha) || 1,
          cantidad_producida: Number(cantidadProducida) || 0,
          id_usuario_responsable: Number(idUsuarioResponsable) || 1,
          fecha_produccion: fechaProduccion || new Date().toISOString().split('T')[0],
          estado: estado || 'en_proceso',
          observaciones: observaciones.trim() || null,
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
          <h2 className="text-lg font-bold">{lote ? 'Editar Lote de Producción' : 'Registrar Lote de Producción'}</h2>
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
            <label className="block mb-2 text-sm font-medium">Ficha Técnica (Receta)</label>
            <select
              value={idFicha}
              onChange={(e) => setIdFicha(e.target.value)}
              className="w-full px-4 py-2 border border-input bg-input-background rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="1">Arepa de Chócolo con Queso</option>
              <option value="2">Arepa Telita Tradicional</option>
            </select>
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium">Cantidad a Producir</label>
            <input
              type="number"
              min="0"
              required
              placeholder="Cantidad producida"
              value={cantidadProducida}
              onChange={(e) => setCantidadProducida(e.target.value)}
              className="w-full px-4 py-2 border border-input bg-input-background rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium">Usuario Responsable</label>
            <select
              required
              value={idUsuarioResponsable}
              onChange={(e) => setIdUsuarioResponsable(e.target.value)}
              className="w-full px-4 py-2 border border-input bg-input-background rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="1">Carlos Eduardo Gómez</option>
              <option value="2">María Fernanda Rojas</option>
              <option value="3">Jorge Eliecer Restrepo</option>
              <option value="4">Ana Lucía Benítez</option>
            </select>
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium">Fecha de Producción</label>
            <input
              type="date"
              value={fechaProduccion}
              onChange={(e) => setFechaProduccion(e.target.value)}
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
              <option value="en_proceso">En proceso</option>
              <option value="finalizado">Finalizado</option>
              <option value="programado">Programado</option>
              <option value="anulado">Anulado</option>
            </select>
          </div>
          <div className="modal-field-wide">
            <label className="block mb-2 text-sm font-medium">Observaciones</label>
            <textarea
              maxLength={255}
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              className="w-full px-4 py-2 border border-input bg-input-background rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="p-4 bg-accent/10 rounded-lg">
            <h4 className="mb-2 text-sm font-medium">Insumos Requeridos</h4>
            <div className="space-y-1 text-sm">
              <p className="text-muted-foreground text-xs">Selecciona una receta para ver los insumos necesarios</p>
            </div>
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
              {isLoading ? 'Guardando...' : lote ? 'Guardar Cambios' : 'Registrar Lote'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

