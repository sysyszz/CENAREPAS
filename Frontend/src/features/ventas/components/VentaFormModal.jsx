import { useState, useEffect, useMemo } from 'react';
import { Plus, Trash2, ShoppingCart } from 'lucide-react';
import { getClientes } from '../../clientes/services/clientesService';
import { getPedidos } from '../../pedidos/services/pedidosService';
import { getProductos } from '../../productos/services/productosService';
import { getSedes } from '../../sedes/services/sedesService';
import { Combobox } from '../../../shared/ui/Combobox';
import { StepperModal } from '../../../shared/components/StepperModal';

export function VentaFormModal({ open, onClose, venta = null, onSave, isLoading = false }) {
  const [idCliente, setIdCliente] = useState('1');
  const [idSede, setIdSede] = useState('1');
  const [idPedido, setIdPedido] = useState('');
  const [fechaVenta, setFechaVenta] = useState('');
  const [medioPago, setMedioPago] = useState('Transferencia');
  const [comprobanteUrl, setComprobanteUrl] = useState('');
  const [estado, setEstado] = useState('Pagada');

  const [clientes, setClientes] = useState([]);
  const [sedes, setSedes] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [availableProductos, setAvailableProductos] = useState([]);

  const [detalles, setDetalles] = useState([]);
  const [selectedProductoId, setSelectedProductoId] = useState('');
  const [cantidadProducto, setCantidadProducto] = useState('');
  const [precioUnitario, setPrecioUnitario] = useState('');

  // Errores de validación
  const [errors, setErrors] = useState({});

  useEffect(() => {
    getClientes().then((data) => { if (Array.isArray(data)) setClientes(data); }).catch(() => {});
    getSedes().then((data) => { if (Array.isArray(data)) setSedes(data); }).catch(() => {});
    getPedidos().then((data) => { if (Array.isArray(data)) setPedidos(data); }).catch(() => {});
    getProductos().then((data) => { if (Array.isArray(data)) setAvailableProductos(data); }).catch(() => {});
  }, []);

  useEffect(() => {
    if (selectedProductoId) {
      const prod = availableProductos.find((p) => String(p.id_producto) === String(selectedProductoId));
      setPrecioUnitario(prod ? String(prod.precio_venta || '') : '');
    } else {
      setPrecioUnitario('');
    }
  }, [selectedProductoId, availableProductos]);

  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (open) {
      setCurrentStep(0);
      if (venta) {
        setIdCliente(venta.id_cliente ? String(venta.id_cliente) : (clientes[0]?.id_cliente ? String(clientes[0].id_cliente) : '1'));
        setIdSede(venta.id_sede ? String(venta.id_sede) : (sedes[0]?.id_sede ? String(sedes[0].id_sede) : '1'));
        setIdPedido(venta.id_pedido ? String(venta.id_pedido) : '');
        setFechaVenta(venta.fecha_venta ? venta.fecha_venta.slice(0, 16) : '');
        setMedioPago(venta.medio_pago || 'Transferencia');
        setComprobanteUrl(venta.comprobante_url || '');
        setEstado(venta.estado || 'Pagada');
        
        if (Array.isArray(venta.detalles) && venta.detalles.length > 0) {
          setDetalles(
            venta.detalles.map((d) => {
              const prod = availableProductos.find((p) => p.id_producto === d.id_producto);
              return {
                id_producto: d.id_producto,
                nombre_producto: prod?.nombre || d.nombre_producto || `Producto #${d.id_producto}`,
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
        setIdSede(sedes[0]?.id_sede ? String(sedes[0].id_sede) : '1');
        setIdPedido('');
        setFechaVenta(new Date().toISOString().slice(0, 16));
        setMedioPago('Transferencia');
        setComprobanteUrl('');
        setEstado('Pagada');
        setDetalles([]);
      }
      setSelectedProductoId('');
      setCantidadProducto('');
      setPrecioUnitario('');
      setErrors({});
    } else {
      setCurrentStep(0);
    }
  }, [venta, open, clientes, sedes, availableProductos]);

  const valorTotalCalculado = useMemo(() => {
    return detalles.reduce((acc, item) => acc + (Number(item.subtotal) || 0), 0);
  }, [detalles]);

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
      updated[existingIndex] = { ...updated[existingIndex], cantidad: cant, precio_unitario: unitPrice, subtotal };
      setDetalles(updated);
    } else {
      setDetalles([
        ...detalles,
        { id_producto: prod.id_producto, nombre_producto: prod.nombre, cantidad: cant, precio_unitario: unitPrice, subtotal },
      ]);
    }
    setSelectedProductoId('');
    setCantidadProducto('');
    setPrecioUnitario('');
    if (errors.detalles) {
      setErrors((prev) => ({ ...prev, detalles: null }));
    }
  };

  const handleRemoveDetalle = (idProductoToRemove) => {
    setDetalles(detalles.filter((d) => d.id_producto !== idProductoToRemove));
  };

  const validateStep1 = () => {
    const errs = {};
    if (!idCliente) errs.idCliente = 'Debes seleccionar un cliente';
    if (!idSede) errs.idSede = 'Debes seleccionar una sede';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep2 = () => {
    const errs = {};
    if (detalles.length === 0) {
      errs.detalles = 'Debes agregar al menos un producto a la venta';
    }
    setErrors((prev) => ({ ...prev, ...errs }));
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = () => {
    if (!validateStep1()) {
      setCurrentStep(0);
      return;
    }
    if (!validateStep2()) {
      setCurrentStep(1);
      return;
    }

    const payload = venta
      ? {
          ...venta,
          id_cliente: Number(idCliente) || 1,
          id_sede: Number(idSede) || 1,
          id_usuario: venta.id_usuario || 1,
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
          id_usuario: 1,
          id_pedido: idPedido ? Number(idPedido) : null,
          fecha_venta: fechaVenta ? new Date(fechaVenta).toISOString() : new Date().toISOString(),
          medio_pago: medioPago || 'transferencia',
          valor_total: valorTotalCalculado,
          comprobante_url: comprobanteUrl.trim() || null,
          estado: estado || 'Pagada',
          detalles,
        };

    if (onSave) onSave(payload);
    else onClose();
  };

  const steps = [
    {
      id: 'datos',
      title: 'Información de la Venta',
      description: 'Define cliente, sede/punto de venta, pedido asociado y medio de pago',
      validate: validateStep1,
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-4">
            {/* Cliente */}
            <div className="sm:col-span-1">
              <label htmlFor="venta_id_cliente" className="block mb-1.5 text-xs sm:text-sm font-bold text-foreground">
                Cliente <span className="text-destructive font-bold ml-0.5">*</span>
              </label>
              <Combobox
                id="venta_id_cliente"
                name="id_cliente"
                value={idCliente}
                onChange={(e) => {
                  setIdCliente(e.target.value);
                  if (errors.idCliente) setErrors((prev) => ({ ...prev, idCliente: null }));
                }}
                options={clientes.map((c) => ({
                  value: String(c.id_cliente),
                  label: c.nombre,
                }))}
              />
              {errors.idCliente && <p className="text-xs text-destructive mt-1">{errors.idCliente}</p>}
            </div>

            {/* Sede */}
            <div className="sm:col-span-1">
              <label htmlFor="venta_id_sede" className="block mb-1.5 text-xs sm:text-sm font-bold text-foreground">
                Sede / Punto de Venta <span className="text-destructive font-bold ml-0.5">*</span>
              </label>
              <Combobox
                id="venta_id_sede"
                name="id_sede"
                value={idSede}
                onChange={(e) => {
                  setIdSede(e.target.value);
                  if (errors.idSede) setErrors((prev) => ({ ...prev, idSede: null }));
                }}
                options={sedes.map((s) => ({
                  value: String(s.id_sede),
                  label: s.nombre,
                }))}
              />
              {errors.idSede && <p className="text-xs text-destructive mt-1">{errors.idSede}</p>}
            </div>

            {/* Pedido Asociado */}
            <div className="sm:col-span-1">
              <label htmlFor="venta_id_pedido" className="block mb-1.5 text-xs sm:text-sm font-bold text-foreground">
                Pedido Asociado (Opcional)
              </label>
              <Combobox
                id="venta_id_pedido"
                name="id_pedido"
                placeholder="Venta directa en mostrador (Sin pedido)"
                value={idPedido}
                onChange={(e) => setIdPedido(e.target.value)}
                options={[
                  { value: '', label: 'Venta directa en mostrador (Sin pedido)' },
                  ...pedidos.map((p) => ({
                    value: String(p.id_pedido),
                    label: `Pedido #${p.id_pedido} - $${Number(p.valor_total).toLocaleString('es-CO')}`,
                  })),
                ]}
              />
            </div>

            {/* Fecha y Hora */}
            <div className="sm:col-span-1">
              <label htmlFor="venta_fecha_venta" className="block mb-1.5 text-xs sm:text-sm font-bold text-foreground">
                Fecha y Hora de Facturación <span className="text-destructive font-bold ml-0.5">*</span>
              </label>
              <input
                id="venta_fecha_venta"
                name="fecha_venta"
                type="datetime-local"
                value={fechaVenta}
                onChange={(e) => setFechaVenta(e.target.value)}
                className="w-full h-10 px-3.5 border border-border bg-input-background rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>

            {/* Medio de Pago */}
            <div className="sm:col-span-1">
              <label htmlFor="venta_medio_pago" className="block mb-1.5 text-xs sm:text-sm font-bold text-foreground">
                Medio de Pago <span className="text-destructive font-bold ml-0.5">*</span>
              </label>
              <Combobox
                id="venta_medio_pago"
                name="medio_pago"
                value={medioPago}
                onChange={(e) => setMedioPago(e.target.value)}
                options={[
                  { value: 'Transferencia', label: 'Transferencia Bancaria' },
                  { value: 'Efectivo', label: 'Efectivo' },
                  { value: 'Tarjeta', label: 'Tarjeta Débito/Crédito' },
                ]}
              />
            </div>

            {/* Estado */}
            <div className="sm:col-span-1">
              <label htmlFor="venta_estado" className="block mb-1.5 text-xs sm:text-sm font-bold text-foreground">
                Estado de la Factura <span className="text-destructive font-bold ml-0.5">*</span>
              </label>
              <Combobox
                id="venta_estado"
                name="estado"
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
                options={[
                  { value: 'Pendiente', label: 'Pendiente' },
                  { value: 'Pagada', label: 'Pagada' },
                  { value: 'Anulada', label: 'Anulada' },
                ]}
              />
            </div>

            {/* Comprobante URL */}
            <div className="sm:col-span-2">
              <label htmlFor="venta_comprobante_url" className="block mb-1.5 text-xs sm:text-sm font-bold text-foreground">
                URL de Comprobante / Voucher Electrónico
              </label>
              <input
                id="venta_comprobante_url"
                name="comprobante_url"
                type="url"
                maxLength={255}
                placeholder="https://comprobantes.ejemplo.com/vouchers/voucher-001.pdf"
                value={comprobanteUrl}
                onChange={(e) => setComprobanteUrl(e.target.value)}
                className="w-full h-10 px-3.5 border border-border bg-input-background rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 font-mono"
              />
            </div>
          </div>

          <div className="p-3.5 bg-muted/40 border border-border/60 rounded-xl text-xs text-muted-foreground flex items-start gap-2.5">
            <ShoppingCart className="size-4 text-primary shrink-0 mt-0.5" />
            <p>
              Si la venta proviene de un pedido previo, selecciónalo arriba para vincular la orden de despacho a este comprobante contable.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 'productos',
      title: 'Productos Facturados',
      description: 'Agrega los productos entregados y liquida los precios unitarios',
      validate: validateStep2,
      content: (
        <div className="space-y-4">
          <div className="space-y-3 p-4 rounded-xl border border-border bg-muted/20">
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-foreground flex items-center gap-1.5">
                <ShoppingCart className="size-4 text-primary" />
                Agregar Producto Facturado
              </h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                Agrega los productos entregados, cantidades y precio de venta
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
              <div className="sm:col-span-5">
                <Combobox
                  id="detalle_venta_id_producto"
                  aria-label="Seleccionar producto para venta"
                  placeholder="Seleccionar producto..."
                  value={selectedProductoId}
                  onChange={(e) => setSelectedProductoId(e.target.value)}
                  options={[
                    { value: '', label: 'Seleccionar producto...' },
                    ...availableProductos.map((prod) => ({
                      value: String(prod.id_producto),
                      label: `${prod.nombre} ($${Number(prod.precio_venta).toLocaleString('es-CO')})`,
                    })),
                  ]}
                />
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
                  className="w-full h-10 px-3 border border-border bg-input-background rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 font-mono"
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
                  className="w-full h-10 px-3 border border-border bg-input-background rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 font-mono"
                />
              </div>

              <div className="sm:col-span-1">
                <button
                  type="button"
                  onClick={handleAddDetalle}
                  disabled={!selectedProductoId || !cantidadProducto || !precioUnitario}
                  className="w-full h-10 bg-primary text-primary-foreground rounded-xl hover:opacity-90 disabled:opacity-50 text-xs font-semibold flex items-center justify-center transition-opacity cursor-pointer shadow-xs"
                  title="Agregar producto a la venta"
                >
                  <Plus className="size-4" />
                </button>
              </div>
            </div>

            {/* Listado de productos agregados */}
            {detalles.length > 0 ? (
              <div className="divide-y divide-border border border-border rounded-xl bg-card overflow-hidden max-h-44 overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-12 gap-2 p-2 bg-muted/60 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider sticky top-0 bg-card">
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
                        className="text-muted-foreground hover:text-destructive p-1 rounded-md transition-colors cursor-pointer"
                        title="Eliminar producto"
                      >
                        <Trash2 className="size-3.5 mx-auto" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-3 border border-dashed border-border rounded-xl text-xs text-muted-foreground">
                No hay productos agregados en esta venta.
              </div>
            )}
            {errors.detalles && <p className="text-xs text-destructive">{errors.detalles}</p>}
          </div>

          {/* Campo Calculado: Valor Total */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-primary/10 border border-primary/20">
            <span className="text-xs sm:text-sm font-semibold text-foreground">Valor Total de la Venta:</span>
            <span className="text-base sm:text-lg font-bold font-mono text-primary">
              ${valorTotalCalculado.toLocaleString('es-CO')}
            </span>
          </div>
        </div>
      ),
    },
  ];

  return (
    <StepperModal
      isOpen={open}
      onClose={onClose}
      onSubmit={handleSubmit}
      category="Ventas"
      title={venta ? 'Editar Venta' : 'Registrar Venta'}
      subtitle="Facturación en mostrador y liquidación de pedidos despachados"
      steps={steps}
      currentStep={currentStep}
      onStepChange={setCurrentStep}
      submitLabel={venta ? 'Guardar Cambios' : 'Registrar Venta'}
      isLoading={isLoading}
      isDirty={detalles.length > 0 || Boolean(comprobanteUrl)}
    />
  );
}

export default VentaFormModal;