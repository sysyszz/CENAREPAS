import { useState, useEffect } from 'react';
import { Upload, X } from 'lucide-react';

export function CompraFormModal({ open, onClose, compra = null, onSave, isLoading = false }) {
  const [fechaCompra, setFechaCompra] = useState('');
  const [idProveedor, setIdProveedor] = useState('1');
  const [idUsuario, setIdUsuario] = useState('1');
  const [valorTotal, setValorTotal] = useState('');
  const [medioPago, setMedioPago] = useState('transferencia');
  const [comprobanteUrl, setComprobanteUrl] = useState('');
  const [estado, setEstado] = useState('activo');

  useEffect(() => {
    if (compra) {
      setFechaCompra(compra.fecha_compra || '');
      setIdProveedor(compra.id_proveedor ? String(compra.id_proveedor) : '1');
      setIdUsuario(compra.id_usuario ? String(compra.id_usuario) : '1');
      setValorTotal(compra.valor_total != null ? String(compra.valor_total) : '');
      setMedioPago(compra.medio_pago || 'transferencia');
      setComprobanteUrl(compra.comprobante_url || '');
      setEstado(compra.estado || 'activo');
    } else {
      setFechaCompra(new Date().toISOString().split('T')[0]);
      setIdProveedor('1');
      setIdUsuario('1');
      setValorTotal('');
      setMedioPago('transferencia');
      setComprobanteUrl('');
      setEstado('activo');
    }
  }, [compra, open]);

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = compra
      ? {
          ...compra,
          fecha_compra: fechaCompra,
          id_proveedor: Number(idProveedor) || idProveedor,
          id_usuario: Number(idUsuario) || idUsuario,
          valor_total: Number(valorTotal) || 0,
          medio_pago: medioPago,
          comprobante_url: comprobanteUrl || null,
          estado,
        }
      : {
          fecha_compra: fechaCompra,
          id_proveedor: Number(idProveedor) || 1,
          id_usuario: Number(idUsuario) || 1,
          valor_total: Number(valorTotal) || 0,
          medio_pago: medioPago,
          comprobante_url: comprobanteUrl || null,
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
          <h2 className="text-lg font-bold">{compra ? 'Editar Compra' : 'Nueva Compra'}</h2>
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
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 text-sm font-medium">Fecha de Compra</label>
              <input
                type="date"
                required
                value={fechaCompra}
                onChange={(e) => setFechaCompra(e.target.value)}
                className="w-full px-4 py-2 border border-input bg-input-background rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium">Proveedor</label>
              <select
                value={idProveedor}
                onChange={(e) => setIdProveedor(e.target.value)}
                className="w-full px-4 py-2 border border-input bg-input-background rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="1">Agrícola del Valle S.A.</option>
                <option value="2">Lácteos El Campesino</option>
                <option value="3">Plásticos San José Ltda.</option>
                <option value="4">Distribuidora del Campo</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium">Usuario</label>
            <select
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
            <label className="block mb-2 text-sm font-medium">Valor Total ($)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              required
              value={valorTotal}
              onChange={(e) => setValorTotal(e.target.value)}
              className="w-full px-4 py-2 border border-input bg-input-background rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="modal-field-wide">
            <label className="block mb-2 text-sm font-medium">Medio de Pago</label>
            <input
              type="text"
              maxLength={20}
              value={medioPago}
              onChange={(e) => setMedioPago(e.target.value)}
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
              <option value="recibida">Recibida</option>
              <option value="pendiente">Pendiente</option>
              <option value="anulado">Anulado</option>
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
