import { useState, useEffect, useMemo } from 'react';
import { X, Plus, Trash2, Package } from 'lucide-react';
import { mockProveedores, getProveedores } from '../../proveedores/services/proveedoresService';
import { mockInsumos, getInsumos } from '../../insumos/services/insumosService';
import { mockDetallesCompra } from '../services/comprasService';

export function CompraFormModal({ open, onClose, compra = null, onSave, isLoading = false }) {
  const [fechaCompra, setFechaCompra] = useState('');
  const [idProveedor, setIdProveedor] = useState('1');
  const [medioPago, setMedioPago] = useState('transferencia');
  const [comprobanteUrl, setComprobanteUrl] = useState('');
  const [estado, setEstado] = useState('activo');

  // Catálogos
  const [proveedores, setProveedores] = useState(mockProveedores);
  const [availableInsumos, setAvailableInsumos] = useState(mockInsumos);

  // Detalle de Compra (detalle_compra)
  const [detalles, setDetalles] = useState([]);
  const [selectedInsumoId, setSelectedInsumoId] = useState('');
  const [cantidadInsumo, setCantidadInsumo] = useState('');
  const [valorUnitarioInsumo, setValorUnitarioInsumo] = useState('');

  useEffect(() => {
    getProveedores().then((data) => {
      if (data && data.length > 0) setProveedores(data);
    });
    getInsumos().then((data) => {
      if (data && data.length > 0) setAvailableInsumos(data);
    });
  }, []);

  useEffect(() => {
    if (compra) {
      setFechaCompra(compra.fecha_compra || '');
      setIdProveedor(compra.id_proveedor ? String(compra.id_proveedor) : '1');
      setMedioPago(compra.medio_pago || 'transferencia');
      setComprobanteUrl(compra.comprobante_url || '');
      setEstado(compra.estado || 'activo');

      // Cargar detalles existentes
      const existingDetalles = mockDetallesCompra.filter((d) => d.id_compra === compra.id_compra);
      if (existingDetalles.length > 0) {
        setDetalles(
          existingDetalles.map((d) => {
            const ins = availableInsumos.find((i) => i.id_insumo === d.id_insumo);
            return {
              id_insumo: d.id_insumo,
              nombre_insumo: ins?.nombre || `Insumo #${d.id_insumo}`,
              unidad_medida: ins?.unidad_medida || 'kg',
              cantidad: Number(d.cantidad) || 0,
              valor_unitario: Number(d.valor_unitario) || 0,
              subtotal: Number(d.subtotal) || Number(d.cantidad) * Number(d.valor_unitario),
            };
          })
        );
      } else {
        setDetalles([]);
      }
    } else {
      setFechaCompra(new Date().toISOString().split('T')[0]);
      setIdProveedor(proveedores[0]?.id_proveedor ? String(proveedores[0].id_proveedor) : '1');
      setMedioPago('transferencia');
      setComprobanteUrl('');
      setEstado('activo');
      setDetalles([]);
    }
    setSelectedInsumoId('');
    setCantidadInsumo('');
    setValorUnitarioInsumo('');
  }, [compra, open, proveedores, availableInsumos]);

  // Cálculo automático del valor total
  const valorTotalCalculado = useMemo(() => {
    return detalles.reduce((acc, item) => acc + (Number(item.subtotal) || 0), 0);
  }, [detalles]);

  if (!open) return null;

  const handleAddDetalle = () => {
    if (!selectedInsumoId || !cantidadInsumo || Number(cantidadInsumo) <= 0 || !valorUnitarioInsumo || Number(valorUnitarioInsumo) <= 0) {
      return;
    }

    const ins = availableInsumos.find((i) => String(i.id_insumo) === String(selectedInsumoId));
    if (!ins) return;

    const cant = Number(cantidadInsumo);
    const unitPrice = Number(valorUnitarioInsumo);
    const subtotal = cant * unitPrice;

    const existingIndex = detalles.findIndex((d) => String(d.id_insumo) === String(selectedInsumoId));
    if (existingIndex >= 0) {
      const updated = [...detalles];
      updated[existingIndex] = {
        ...updated[existingIndex],
        cantidad: cant,
        valor_unitario: unitPrice,
        subtotal,
      };
      setDetalles(updated);
    } else {
      setDetalles([
        ...detalles,
        {
          id_insumo: ins.id_insumo,
          nombre_insumo: ins.nombre,
          unidad_medida: ins.unidad_medida || 'kg',
          cantidad: cant,
          valor_unitario: unitPrice,
          subtotal,
        },
      ]);
    }

    setSelectedInsumoId('');
    setCantidadInsumo('');
    setValorUnitarioInsumo('');
  };

  const handleRemoveDetalle = (idInsumoToRemove) => {
    setDetalles(detalles.filter((d) => d.id_insumo !== idInsumoToRemove));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (detalles.length === 0) {
      alert('Debes agregar al menos un insumo a la orden de compra.');
      return;
    }

    const payload = compra
      ? {
          ...compra,
          fecha_compra: fechaCompra,
          id_proveedor: Number(idProveedor) || 1,
          id_usuario: compra.id_usuario || 1, // Asignado por contexto
          valor_total: valorTotalCalculado,
          medio_pago: medioPago,
          comprobante_url: comprobanteUrl.trim() || null,
          estado,
          detalles,
        }
      : {
          fecha_compra: fechaCompra,
          id_proveedor: Number(idProveedor) || 1,
          id_usuario: 1, // Asignado por contexto de sesión activa
          valor_total: valorTotalCalculado,
          medio_pago: medioPago,
          comprobante_url: comprobanteUrl.trim() || null,
          estado: estado || 'activo',
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
            <h2 className="text-xl font-bold">{compra ? 'Editar Orden de Compra' : 'Nueva Orden de Compra'}</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Registra la adquisición de materias primas e insumos a proveedores
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
              <label htmlFor="compra_fecha_compra" className="block mb-1.5 text-sm font-medium">Fecha de Compra *</label>
              <input
                id="compra_fecha_compra"
                name="fecha_compra"
                type="date"
                required
                value={fechaCompra}
                onChange={(e) => setFechaCompra(e.target.value)}
                className="w-full px-4 py-2 border border-input bg-input-background rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label htmlFor="compra_id_proveedor" className="block mb-1.5 text-sm font-medium">Proveedor *</label>
              <select
                id="compra_id_proveedor"
                name="id_proveedor"
                value={idProveedor}
                onChange={(e) => setIdProveedor(e.target.value)}
                className="w-full px-4 py-2 border border-input bg-input-background rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {proveedores.map((p) => (
                  <option key={p.id_proveedor} value={String(p.id_proveedor)}>
                    {p.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="compra_medio_pago" className="block mb-1.5 text-sm font-medium">Medio de Pago</label>
              <select
                id="compra_medio_pago"
                name="medio_pago"
                value={medioPago}
                onChange={(e) => setMedioPago(e.target.value)}
                className="w-full px-4 py-2 border border-input bg-input-background rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="transferencia">Transferencia Bancaria</option>
                <option value="efectivo">Efectivo</option>
                <option value="credito">Crédito Proveedor</option>
              </select>
            </div>
            <div>
              <label htmlFor="compra_estado" className="block mb-1.5 text-sm font-medium">Estado</label>
              <select
                id="compra_estado"
                name="estado"
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
                className="w-full px-4 py-2 border border-input bg-input-background rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="activo">Activo</option>
                <option value="recibida">Recibida</option>
                <option value="pendiente">Pendiente</option>
                <option value="anulado">Anulada</option>
              </select>
            </div>
          </div>

          <div className="modal-field-wide">
            <label htmlFor="compra_comprobante_url" className="block mb-1.5 text-sm font-medium">URL de Factura / Comprobante</label>
            <input
              id="compra_comprobante_url"
              name="comprobante_url"
              type="url"
              maxLength={255}
              placeholder="https://documentos.ejemplo.com/facturas/fac-102.pdf"
              value={comprobanteUrl}
              onChange={(e) => setComprobanteUrl(e.target.value)}
              className="w-full px-4 py-2 border border-input bg-input-background rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Sección Detalle de Compra (detalle_compra) */}
          <div className="modal-field-wide space-y-3 p-4 rounded-xl border border-border bg-muted/20">
            <div>
              <h4 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                <Package className="w-4 h-4 text-primary" />
                Insumos Comprados (Detalle de Compra)
              </h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                Agrega los insumos recibidos, cantidad y valor unitario pactado
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
              <div className="sm:col-span-5">
                <select
                  id="detalle_compra_id_insumo"
                  aria-label="Seleccionar insumo para compra"
                  value={selectedInsumoId}
                  onChange={(e) => setSelectedInsumoId(e.target.value)}
                  className="w-full px-3 py-2 border border-input bg-input-background rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">Seleccionar insumo...</option>
                  {availableInsumos.map((ins) => (
                    <option key={ins.id_insumo} value={String(ins.id_insumo)}>
                      {ins.nombre} ({ins.unidad_medida})
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-3">
                <input
                  id="detalle_compra_cantidad"
                  type="number"
                  min="0.01"
                  step="0.01"
                  placeholder="Cantidad"
                  value={cantidadInsumo}
                  onChange={(e) => setCantidadInsumo(e.target.value)}
                  className="w-full px-3 py-2 border border-input bg-input-background rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div className="sm:col-span-3">
                <input
                  id="detalle_compra_valor_unitario"
                  type="number"
                  min="0"
                  step="100"
                  placeholder="Precio Unitario ($)"
                  value={valorUnitarioInsumo}
                  onChange={(e) => setValorUnitarioInsumo(e.target.value)}
                  className="w-full px-3 py-2 border border-input bg-input-background rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div className="sm:col-span-1">
                <button
                  type="button"
                  onClick={handleAddDetalle}
                  disabled={!selectedInsumoId || !cantidadInsumo || !valorUnitarioInsumo}
                  className="w-full h-full py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 disabled:opacity-50 text-xs font-semibold flex items-center justify-center transition-opacity cursor-pointer"
                  title="Agregar insumo a la compra"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Listado de líneas agregadas */}
            {detalles.length > 0 ? (
              <div className="divide-y divide-border border border-border rounded-lg bg-card overflow-hidden">
                <div className="grid grid-cols-12 gap-2 p-2 bg-muted/60 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  <div className="col-span-5">Insumo</div>
                  <div className="col-span-2 text-center">Cant.</div>
                  <div className="col-span-2 text-right">V. Unitario</div>
                  <div className="col-span-2 text-right">Subtotal</div>
                  <div className="col-span-1 text-center">Quitar</div>
                </div>
                {detalles.map((d) => (
                  <div key={d.id_insumo} className="grid grid-cols-12 gap-2 p-2.5 text-xs items-center">
                    <div className="col-span-5 font-medium text-foreground truncate">
                      {d.nombre_insumo}
                    </div>
                    <div className="col-span-2 text-center text-muted-foreground">
                      {d.cantidad} {d.unidad_medida}
                    </div>
                    <div className="col-span-2 text-right font-mono">
                      ${Number(d.valor_unitario).toLocaleString('es-CO')}
                    </div>
                    <div className="col-span-2 text-right font-semibold font-mono text-primary">
                      ${Number(d.subtotal).toLocaleString('es-CO')}
                    </div>
                    <div className="col-span-1 text-center">
                      <button
                        type="button"
                        onClick={() => handleRemoveDetalle(d.id_insumo)}
                        className="text-muted-foreground hover:text-destructive p-1 rounded transition-colors"
                        title="Eliminar insumo"
                      >
                        <Trash2 className="w-3.5 h-3.5 mx-auto" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-3 border border-dashed border-border rounded-lg text-xs text-muted-foreground">
                No hay insumos agregados en esta compra.
              </div>
            )}
          </div>

          {/* Campo Calculado: Valor Total */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-primary/10 border border-primary/20">
            <span className="text-sm font-semibold text-foreground">Valor Total de la Compra (Calculado):</span>
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
              {isLoading ? 'Guardando...' : compra ? 'Guardar Cambios' : 'Guardar Compra'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
