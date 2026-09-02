import { useState, useEffect, useMemo } from 'react';
import { X, Plus, Trash2, ShoppingCart } from 'lucide-react';
import { mockClientes, getClientes } from '../../clientes/services/clientesService';
import { mockPedidos, getPedidos } from '../../pedidos/services/pedidosService';
import { mockProductos, getProductos } from '../../productos/services/productosService';
import { mockDetallesVenta } from '../services/ventasService';

const SEDES_DEFAULT = [
  { id_sede: 1, nombre: 'Sede Principal (Ibagué)' },
  { id_sede: 2, nombre: 'Sede Espinal' },
  { id_sede: 3, nombre: 'Sede Girardot' },
];

export function VentaFormModal({ open, onClose, venta = null, onSave, isLoading = false }) {
  const [idCliente, setIdCliente] = useState('1');
  const [idSede, setIdSede] = useState('1');
  const [idPedido, setIdPedido] = useState('');
  const [fechaVenta, setFechaVenta] = useState('');
  const [medioPago, setMedioPago] = useState('transferencia');
  const [comprobanteUrl, setComprobanteUrl] = useState('');
  const [estado, setEstado] = useState('completada');

  // Catálogos
  const [clientes, setClientes] = useState(mockClientes);
  const [pedidos, setPedidos] = useState(mockPedidos);
  const [availableProductos, setAvailableProductos] = useState(mockProductos);

  // Detalle de Venta (detalle_venta)
  const [detalles, setDetalles] = useState([]);
  const [selectedProductoId, setSelectedProductoId] = useState('');
  const [cantidadProducto, setCantidadProducto] = useState('');
  const [precioUnitario, setPrecioUnitario] = useState('');

  useEffect(() => {
    getClientes().then((data) => {
      if (data && data.length > 0) setClientes(data);
    });
    getPedidos().then((data) => {
      if (data && data.length > 0) setPedidos(data);
    });
    getProductos().then((data) => {
      if (data && data.length > 0) setAvailableProductos(data);
    });
  }, []);

  // Al seleccionar un producto, precargar su precio_venta
  useEffect(() => {
    if (selectedProductoId) {
      const prod = availableProductos.find((p) => String(p.id_producto) === String(selectedProductoId));
      if (prod) {
        setPrecioUnitario(String(prod.precio_venta || ''));
      }
    } else {
      setPrecioUnitario('');
    }
  }, [selectedProductoId, availableProductos]);

  useEffect(() => {
    if (venta) {
      setIdCliente(venta.id_cliente ? String(venta.id_cliente) : '1');
      setIdSede(venta.id_sede ? String(venta.id_sede) : '1');
      setIdPedido(venta.id_pedido ? String(venta.id_pedido) : '');
      setFechaVenta(venta.fecha_venta ? venta.fecha_venta.slice(0, 16) : '');
      setMedioPago(venta.medio_pago || 'transferencia');
      setComprobanteUrl(venta.comprobante_url || '');
      setEstado(venta.estado || 'completada');

      // Cargar detalles existentes
      const existingDetalles = mockDetallesVenta.filter((d) => d.id_venta === venta.id_venta);
      if (existingDetalles.length > 0) {
        setDetalles(
          existingDetalles.map((d) => {
            const prod = availableProductos.find((p) => p.id_producto === d.id_producto);
            return {
              id_producto: d.id_producto,
              nombre_producto: prod?.nombre || `Producto #${d.id_producto}`,
              cantidad: Number(d.cantidad) || 0,
              precio_unitario: Number(d.precio_unitario) || 0,
              subtotal: Number(d.subtotal) || Number(d.cantidad) * Number(d.precio_unitario),
            };
          })
        );
      } else {
        setDetalles([]);
      }
    } else {
      setIdCliente(clientes[0]?.id_cliente ? String(clientes[0].id_cliente) : '1');
      setIdSede('1');
      setIdPedido('');
      const now = new Date();
      now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
      setFechaVenta(now.toISOString().slice(0, 16));
      setMedioPago('transferencia');
      setComprobanteUrl('');
      setEstado('completada');
      setDetalles([]);
    }
    setSelectedProductoId('');
    setCantidadProducto('');
    setPrecioUnitario('');
  }, [venta, open, clientes, availableProductos]);

  // Cálculo automático del valor total
  const valorTotalCalculado = useMemo(() => {
    return detalles.reduce((acc, item) => acc + (Number(item.subtotal) || 0), 0);
  }, [detalles]);

  if (!open) return null;

  const handleAddDetalle = () => {
    if (!selectedProductoId || !cantidadProducto || Number(cantidadProducto) <= 0 || !precioUnitario || Number(precioUnitario) <= 0) {
      return;
    }

    const prod = availableProductos.find((p) => String(p.id_producto) === String(selectedProductoId));
    if (!prod) return;

    const cant = Number(cantidadProducto);
    const unitPrice = Number(precioUnitario);
    const subtotal = cant * unitPrice;

    const existingIndex = detalles.findIndex((d) => String(d.id_producto) === String(selectedProductoId));
    if (existingIndex >= 0) {
      const updated = [...detalles];
      updated[existingIndex] = {
        ...updated[existingIndex],
        cantidad: cant,
        precio_unitario: unitPrice,
        subtotal,
      };
      setDetalles(updated);
    } else {
      setDetalles([
        ...detalles,
        {
          id_producto: prod.id_producto,
          nombre_producto: prod.nombre,
          cantidad: cant,
          precio_unitario: unitPrice,
          subtotal,
        },
      ]);
    }

    setSelectedProductoId('');
    setCantidadProducto('');
    setPrecioUnitario('');
  };

  const handleRemoveDetalle = (idProductoToRemove) => {
    setDetalles(detalles.filter((d) => d.id_producto !== idProductoToRemove));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (detalles.length === 0) {
      alert('Debes agregar al menos un producto a la venta.');
      return;
    }

    const payload = venta
      ? {
          ...venta,
          id_cliente: Number(idCliente) || 1,
          id_sede: Number(idSede) || 1,
          id_usuario: venta.id_usuario || 1, // Asignado por contexto
          id_pedido: idPedido ? Number(idPedido) : null,
          fecha_venta: fechaVenta ? new Date(fechaVenta).toISOString() : new Date().toISOString(),
          medio_pago: medioPago || 'transferencia',
          valor_total: valorTotalCalculado,
          comprobante_url: comprobanteUrl.trim() || null,
          estado,
          detalles,
        }
      : {
          id_cliente: Number(idCliente) || 1,
          id_sede: Number(idSede) || 1,
          id_usuario: 1, // Asignado por contexto de sesión activa
          id_pedido: idPedido ? Number(idPedido) : null,
          fecha_venta: fechaVenta ? new Date(fechaVenta).toISOString() : new Date().toISOString(),
          medio_pago: medioPago || 'transferencia',
          valor_total: valorTotalCalculado,
          comprobante_url: comprobanteUrl.trim() || null,
          estado: estado || 'completada',
          detalles,
        };

    if (onSave) {
      onSave(payload);
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="form-modal-panel bg-card text-card-foreground p-6 rounded-xl max-w-2xl w-full border border-border shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto custom-scrollbar animate-in fade-in-50 zoom-in-95 duration-200">
        <div className="flex items-start justify-between gap-4 pb-2 border-b border-border">
          <div>
            <h2 className="text-xl font-bold">{venta ? 'Editar Venta' : 'Registrar Venta'}</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Facturación en mostrador y liquidación de pedidos despachados
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Cerrar formulario"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form-grid space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="venta_id_cliente" className="block mb-1.5 text-sm font-medium">Cliente *</label>
              <select
                id="venta_id_cliente"
                name="id_cliente"
                value={idCliente}
                onChange={(e) => setIdCliente(e.target.value)}
                className="w-full px-4 py-2 border border-input bg-input-background rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {clientes.map((c) => (
                  <option key={c.id_cliente} value={String(c.id_cliente)}>
                    {c.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="venta_id_sede" className="block mb-1.5 text-sm font-medium">Sede / Punto de Venta *</label>
              <select
                id="venta_id_sede"
                name="id_sede"
                value={idSede}
                onChange={(e) => setIdSede(e.target.value)}
                className="w-full px-4 py-2 border border-input bg-input-background rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {SEDES_DEFAULT.map((s) => (
                  <option key={s.id_sede} value={String(s.id_sede)}>
                    {s.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="venta_id_pedido" className="block mb-1.5 text-sm font-medium">Pedido Asociado (Opcional)</label>
              <select
                id="venta_id_pedido"
                name="id_pedido"
                value={idPedido}
                onChange={(e) => setIdPedido(e.target.value)}
                className="w-full px-4 py-2 border border-input bg-input-background rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">Venta directa en mostrador (Sin pedido)</option>
                {pedidos.map((p) => (
                  <option key={p.id_pedido} value={String(p.id_pedido)}>
                    Pedido #{p.id_pedido} — ${Number(p.valor_total).toLocaleString('es-CO')}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="venta_fecha_venta" className="block mb-1.5 text-sm font-medium">Fecha y Hora</label>
              <input
                id="venta_fecha_venta"
                name="fecha_venta"
                type="datetime-local"
                value={fechaVenta}
                onChange={(e) => setFechaVenta(e.target.value)}
                className="w-full px-4 py-2 border border-input bg-input-background rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="venta_medio_pago" className="block mb-1.5 text-sm font-medium">Medio de Pago</label>
              <select
                id="venta_medio_pago"
                name="medio_pago"
                value={medioPago}
                onChange={(e) => setMedioPago(e.target.value)}
                className="w-full px-4 py-2 border border-input bg-input-background rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="transferencia">Transferencia Bancaria</option>
                <option value="efectivo">Efectivo</option>
                <option value="tarjeta">Tarjeta Débito/Crédito</option>
              </select>
            </div>
            <div>
              <label htmlFor="venta_estado" className="block mb-1.5 text-sm font-medium">Estado</label>
              <select
                id="venta_estado"
                name="estado"
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
            <label htmlFor="venta_comprobante_url" className="block mb-1.5 text-sm font-medium">URL de Comprobante / Voucher</label>
            <input
              id="venta_comprobante_url"
              name="comprobante_url"
              type="url"
              maxLength={255}
              placeholder="https://comprobantes.ejemplo.com/vouchers/voucher-001.pdf"
              value={comprobanteUrl}
              onChange={(e) => setComprobanteUrl(e.target.value)}
              className="w-full px-4 py-2 border border-input bg-input-background rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Sección Detalle de Venta (detalle_venta) */}
          <div className="modal-field-wide space-y-3 p-4 rounded-xl border border-border bg-muted/20">
            <div>
              <h4 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                <ShoppingCart className="w-4 h-4 text-primary" />
                Productos Vendidos (Detalle de Venta)
              </h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                Agrega los productos entregados, cantidades y precio de venta
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
              <div className="sm:col-span-5">
                <select
                  id="detalle_venta_id_producto"
                  aria-label="Seleccionar producto para venta"
                  value={selectedProductoId}
                  onChange={(e) => setSelectedProductoId(e.target.value)}
                  className="w-full px-3 py-2 border border-input bg-input-background rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">Seleccionar producto...</option>
                  {availableProductos.map((prod) => (
                    <option key={prod.id_producto} value={String(prod.id_producto)}>
                      {prod.nombre} (${Number(prod.precio_venta).toLocaleString('es-CO')})
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-3">
                <input
                  id="detalle_venta_cantidad"
                  type="number"
                  min="1"
                  step="1"
                  placeholder="Cantidad (und)"
                  value={cantidadProducto}
                  onChange={(e) => setCantidadProducto(e.target.value)}
                  className="w-full px-3 py-2 border border-input bg-input-background rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div className="sm:col-span-3">
                <input
                  id="detalle_venta_precio_unitario"
                  type="number"
                  min="0"
                  step="100"
                  placeholder="Precio Unitario ($)"
                  value={precioUnitario}
                  onChange={(e) => setPrecioUnitario(e.target.value)}
                  className="w-full px-3 py-2 border border-input bg-input-background rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div className="sm:col-span-1">
                <button
                  type="button"
                  onClick={handleAddDetalle}
                  disabled={!selectedProductoId || !cantidadProducto || !precioUnitario}
                  className="w-full h-full py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 disabled:opacity-50 text-xs font-semibold flex items-center justify-center transition-opacity cursor-pointer"
                  title="Agregar producto a la venta"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Listado de productos vendidos agregados */}
            {detalles.length > 0 ? (
              <div className="divide-y divide-border border border-border rounded-lg bg-card overflow-hidden">
                <div className="grid grid-cols-12 gap-2 p-2 bg-muted/60 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  <div className="col-span-5">Producto</div>
                  <div className="col-span-2 text-center">Cant.</div>
                  <div className="col-span-2 text-right">P. Unitario</div>
                  <div className="col-span-2 text-right">Subtotal</div>
                  <div className="col-span-1 text-center">Quitar</div>
                </div>
                {detalles.map((d) => (
                  <div key={d.id_producto} className="grid grid-cols-12 gap-2 p-2.5 text-xs items-center">
                    <div className="col-span-5 font-medium text-foreground truncate">
                      {d.nombre_producto}
                    </div>
                    <div className="col-span-2 text-center text-muted-foreground">
                      {d.cantidad} und
                    </div>
                    <div className="col-span-2 text-right font-mono">
                      ${Number(d.precio_unitario).toLocaleString('es-CO')}
                    </div>
                    <div className="col-span-2 text-right font-semibold font-mono text-primary">
                      ${Number(d.subtotal).toLocaleString('es-CO')}
                    </div>
                    <div className="col-span-1 text-center">
                      <button
                        type="button"
                        onClick={() => handleRemoveDetalle(d.id_producto)}
                        className="text-muted-foreground hover:text-destructive p-1 rounded transition-colors"
                        title="Eliminar producto"
                      >
                        <Trash2 className="w-3.5 h-3.5 mx-auto" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-3 border border-dashed border-border rounded-lg text-xs text-muted-foreground">
                No hay productos agregados en esta venta.
              </div>
            )}
          </div>

          {/* Campo Calculado: Valor Total */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-primary/10 border border-primary/20">
            <span className="text-sm font-semibold text-foreground">Valor Total de la Venta (Calculado):</span>
            <span className="text-lg font-bold font-mono text-primary">
              ${valorTotalCalculado.toLocaleString('es-CO')}
            </span>
          </div>

          <div className="flex gap-2 pt-4 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-muted text-sm font-medium transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 disabled:opacity-50 text-sm font-medium transition-colors shadow-xs cursor-pointer"
            >
              {isLoading ? 'Guardando...' : venta ? 'Guardar Cambios' : 'Registrar Venta'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

