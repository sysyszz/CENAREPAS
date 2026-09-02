import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export function VentaFormModal({ open, onClose, venta = null, onSave, isLoading = false }) {
  const [idCliente, setIdCliente] = useState('1');
  const [idSede, setIdSede] = useState('1');
  const [idUsuario, setIdUsuario] = useState('1');
  const [idPedido, setIdPedido] = useState('');
  const [fechaVenta, setFechaVenta] = useState('');
  const [medioPago, setMedioPago] = useState('transferencia');
  const [valorTotal, setValorTotal] = useState('');
  const [comprobanteUrl, setComprobanteUrl] = useState('');
  const [estado, setEstado] = useState('completada');

  useEffect(() => {
    if (venta) {
      setIdCliente(venta.id_cliente ? String(venta.id_cliente) : '1');
      setIdSede(venta.id_sede ? String(venta.id_sede) : '1');
      setIdUsuario(venta.id_usuario ? String(venta.id_usuario) : '1');
      setIdPedido(venta.id_pedido ? String(venta.id_pedido) : '');
      setFechaVenta(venta.fecha_venta ? venta.fecha_venta.slice(0, 16) : '');
      setMedioPago(venta.medio_pago || 'transferencia');
      setValorTotal(venta.valor_total != null ? String(venta.valor_total) : '');
      setComprobanteUrl(venta.comprobante_url || '');
      setEstado(venta.estado || 'completada');
    } else {
      setIdCliente('1');
      setIdSede('1');
      setIdUsuario('1');
      setIdPedido('');
      setFechaVenta('');
      setMedioPago('transferencia');
      setValorTotal('');
      setComprobanteUrl('');
      setEstado('completada');
    }
  }, [venta, open]);

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = venta
      ? {
          ...venta,
          id_cliente: Number(idCliente) || 1,
          id_sede: Number(idSede) || 1,
          id_usuario: Number(idUsuario) || 1,
          id_pedido: idPedido ? Number(idPedido) : null,
          fecha_venta: fechaVenta || new Date().toISOString(),
          medio_pago: medioPago || 'transferencia',
          valor_total: Number(valorTotal) || 0,
          comprobante_url: comprobanteUrl.trim() || null,
          estado,
        }
      : {
          id_cliente: Number(idCliente) || 1,
          id_sede: Number(idSede) || 1,
          id_usuario: Number(idUsuario) || 1,
          id_pedido: idPedido ? Number(idPedido) : null,
          fecha_venta: fechaVenta || new Date().toISOString(),
          medio_pago: medioPago || 'transferencia',
          valor_total: Number(valorTotal) || 0,
          comprobante_url: comprobanteUrl.trim() || null,
          estado: estado || 'completada',
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
          <h2 className="text-lg font-bold">{venta ? 'Editar Venta' : 'Nueva Venta'}</h2>
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
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            <div>
              <label className="block mb-2 text-sm font-medium">Pedido</label>
              <select
                value={idPedido}
                onChange={(e) => setIdPedido(e.target.value)}
                className="w-full px-4 py-2 border border-input bg-input-background rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">Sin pedido</option>
                <option value="1">Pedido #1</option>
                <option value="2">Pedido #2</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 text-sm font-medium">Fecha de Venta</label>
              <input
                type="datetime-local"
                value={fechaVenta}
                onChange={(e) => setFechaVenta(e.target.value)}
                className="w-full px-4 py-2 border border-input bg-input-background rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium">Medio de Pago</label>
              <select
                value={medioPago}
                onChange={(e) => setMedioPago(e.target.value)}
                className="w-full px-4 py-2 border border-input bg-input-background rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="transferencia">Transferencia</option>
                <option value="efectivo">Efectivo</option>
                <option value="tarjeta">Tarjeta Débito/Crédito</option>
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
                <option value="completada">Completada</option>
                <option value="anulada">Anulada</option>
              </select>
            </div>
          </div>
          <div className="modal-field-wide">
            <label className="block mb-2 text-sm font-medium">Comprobante URL</label>
            <input
              type="url"
              maxLength={255}
              value={comprobanteUrl}
              onChange={(e) => setComprobanteUrl(e.target.value)}
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
              {isLoading ? 'Guardando...' : venta ? 'Guardar Cambios' : 'Registrar Venta'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

