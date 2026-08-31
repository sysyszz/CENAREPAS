import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export function PedidoFormModal({ open, onClose, pedido = null, onSave, isLoading = false }) {
  const [idCliente, setIdCliente] = useState('1');
  const [fechaEntrega, setFechaEntrega] = useState('');
  const [idSede, setIdSede] = useState('1');
  const [idUsuario, setIdUsuario] = useState('4');
  const [valorTotal, setValorTotal] = useState('');
  const [estado, setEstado] = useState('pendiente');
  const [observaciones, setObservaciones] = useState('');
  const [motivoAnulacion, setMotivoAnulacion] = useState('');

  useEffect(() => {
    if (pedido) {
      setIdCliente(pedido.id_cliente ? String(pedido.id_cliente) : '1');
      setFechaEntrega(pedido.fecha_entrega || '');
      setIdSede(pedido.id_sede ? String(pedido.id_sede) : '1');
      setIdUsuario(pedido.id_usuario ? String(pedido.id_usuario) : '4');
      setValorTotal(pedido.valor_total != null ? String(pedido.valor_total) : '');
      setEstado(pedido.estado || 'pendiente');
      setObservaciones(pedido.observaciones || '');
      setMotivoAnulacion(pedido.motivo_anulacion || '');
    } else {
      setIdCliente('1');
      setFechaEntrega('');
      setIdSede('1');
      setIdUsuario('4');
      setValorTotal('');
      setEstado('pendiente');
      setObservaciones('');
      setMotivoAnulacion('');
    }
  }, [pedido, open]);

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = pedido
      ? {
          ...pedido,
          id_cliente: Number(idCliente) || 1,
          id_sede: Number(idSede) || 1,
          id_usuario: Number(idUsuario) || 4,
          fecha_entrega: fechaEntrega || null,
          valor_total: Number(valorTotal) || 0,
          estado,
          observaciones: observaciones.trim() || null,
          motivo_anulacion: motivoAnulacion.trim() || null,
        }
      : {
          id_cliente: Number(idCliente) || 1,
          id_sede: Number(idSede) || 1,
          id_usuario: Number(idUsuario) || 4,
          fecha_entrega: fechaEntrega || null,
          valor_total: Number(valorTotal) || 0,
          estado: estado || 'pendiente',
          observaciones: observaciones.trim() || null,
          motivo_anulacion: motivoAnulacion.trim() || null,
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
          <h2 className="text-lg font-bold">{pedido ? 'Editar Pedido' : 'Nuevo Pedido'}</h2>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 text-sm font-medium">Cliente</label>
              <select
                value={idCliente}
                onChange={(e) => setIdCliente(e.target.value)}
                className="w-full px-4 py-2 border border-input bg-input-background rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="1">Supermercados Mercacentro S.A.</option>
                <option value="2">Tiendas D1 Regional Tolima</option>
              </select>
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium">Fecha de Entrega</label>
              <input
                type="date"
                value={fechaEntrega}
                onChange={(e) => setFechaEntrega(e.target.value)}
                className="w-full px-4 py-2 border border-input bg-input-background rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 text-sm font-medium">Sede ID</label>
              <input
                type="number"
                min="1"
                required
                value={idSede}
                onChange={(e) => setIdSede(e.target.value)}
                className="w-full px-4 py-2 border border-input bg-input-background rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium">Usuario</label>
              <select
                required
                value={idUsuario}
                onChange={(e) => setIdUsuario(e.target.value)}
                className="w-full px-4 py-2 border border-input bg-input-background rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="1">Carlos Eduardo Gómez</option>
                <option value="2">María Fernanda Rojas</option>
                <option value="3">Jorge Eliecer Restrepo</option>
                <option value="4">Ana Lucía Benítez</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 text-sm font-medium">Valor Total</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={valorTotal}
                onChange={(e) => setValorTotal(e.target.value)}
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
                <option value="pendiente">Pendiente</option>
                <option value="en camino">En Camino</option>
                <option value="entregado">Entregado</option>
                <option value="cancelado">Cancelado</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium">Observaciones</label>
            <textarea
              maxLength={255}
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              className="w-full px-4 py-2 border border-input bg-input-background rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium">Motivo de Anulación</label>
            <textarea
              maxLength={255}
              value={motivoAnulacion}
              onChange={(e) => setMotivoAnulacion(e.target.value)}
              className="w-full px-4 py-2 border border-input bg-input-background rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
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
              {isLoading ? 'Guardando...' : pedido ? 'Guardar Cambios' : 'Crear Pedido'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

