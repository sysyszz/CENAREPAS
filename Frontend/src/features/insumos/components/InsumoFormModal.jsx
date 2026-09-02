import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { mockProveedores, getProveedores } from '../../proveedores/services/proveedoresService';

export function InsumoFormModal({ open, onClose, insumo = null, onSave, isLoading = false }) {
  const [nombre, setNombre] = useState('');
  const [stockActual, setStockActual] = useState('');
  const [unidadMedida, setUnidadMedida] = useState('kg');
  const [fechaVencimiento, setFechaVencimiento] = useState('');
  const [stockMinimo, setStockMinimo] = useState('');
  const [idProveedor, setIdProveedor] = useState('1');
  const [estado, setEstado] = useState('Activo');
  const [proveedores, setProveedores] = useState(mockProveedores);

  useEffect(() => {
    getProveedores().then((data) => {
      if (data && data.length > 0) setProveedores(data);
    });
  }, []);

  useEffect(() => {
    if (insumo) {
      setNombre(insumo.nombre || '');
      setStockActual(insumo.stock_actual != null ? String(insumo.stock_actual) : '');
      setUnidadMedida(insumo.unidad_medida || 'kg');
      setFechaVencimiento(insumo.fecha_vencimiento || '');
      setStockMinimo(insumo.stock_minimo != null ? String(insumo.stock_minimo) : '');
      setIdProveedor(insumo.id_proveedor ? String(insumo.id_proveedor) : '1');
      const isInactive = String(insumo.estado ?? '').toLowerCase() === 'inactivo';
      setEstado(isInactive ? 'Inactivo' : 'Activo');
    } else {
      setNombre('');
      setStockActual('');
      setUnidadMedida('kg');
      setFechaVencimiento('');
      setStockMinimo('');
      setIdProveedor('1');
      setEstado('Activo');
    }
  }, [insumo, open]);

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nombre.trim()) return;
    const payload = insumo
      ? {
          ...insumo,
          nombre: nombre.trim(),
          stock_actual: Number(stockActual) || 0,
          unidad_medida: unidadMedida,
          fecha_vencimiento: fechaVencimiento || null,
          stock_minimo: Number(stockMinimo) || 0,
          id_proveedor: Number(idProveedor) || idProveedor,
          estado,
        }
      : {
          nombre: nombre.trim(),
          stock_actual: Number(stockActual) || 0,
          unidad_medida: unidadMedida,
          fecha_vencimiento: fechaVencimiento || null,
          stock_minimo: Number(stockMinimo) || 0,
          id_proveedor: Number(idProveedor) || 1,
          estado,
        };
    if (onSave) {
      onSave(payload);
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="form-modal-panel bg-card p-6 rounded-xl max-w-md w-full border border-border shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto custom-scrollbar">
        <div className="flex items-start justify-between gap-4 pb-2 border-b border-border">
          <div>
            <h2 className="text-xl font-bold">{insumo ? 'Editar Insumo' : 'Nuevo Insumo'}</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Completa la información del insumo y materia prima
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 -mr-2 -mt-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Cerrar formulario"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form-grid space-y-4">
          <div className="modal-field-wide">
            <label className="block mb-1.5 text-sm font-medium">Nombre del Insumo *</label>
            <input
              type="text"
              maxLength={100}
              required
              placeholder="Ej. Harina de Maíz Blanco"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full px-4 py-2 border border-input bg-input-background rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1.5 text-sm font-medium">Stock Inicial *</label>
              <input
                type="number"
                min="0"
                required
                placeholder="Ej. 100"
                value={stockActual}
                onChange={(e) => setStockActual(e.target.value)}
                className="w-full px-4 py-2 border border-input bg-input-background rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="block mb-1.5 text-sm font-medium">Unidad de Medida *</label>
              <select
                value={unidadMedida}
                onChange={(e) => setUnidadMedida(e.target.value)}
                className="w-full px-4 py-2 border border-input bg-input-background rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="kg">kg (Kilogramos)</option>
                <option value="g">g (Gramos)</option>
                <option value="l">l (Litros)</option>
                <option value="ml">ml (Mililitros)</option>
                <option value="unidad">unidad (Unidades)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1.5 text-sm font-medium">Fecha de Vencimiento</label>
              <input
                type="date"
                value={fechaVencimiento}
                onChange={(e) => setFechaVencimiento(e.target.value)}
                className="w-full px-4 py-2 border border-input bg-input-background rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="block mb-1.5 text-sm font-medium">Stock Mínimo</label>
              <input
                type="number"
                min="0"
                placeholder="Ej. 20"
                value={stockMinimo}
                onChange={(e) => setStockMinimo(e.target.value)}
                className="w-full px-4 py-2 border border-input bg-input-background rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          <div className="modal-field-wide">
            <label className="block mb-1.5 text-sm font-medium">Proveedor *</label>
            <select
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

          <div className="modal-field-wide">
            <label className="block mb-1.5 text-sm font-medium">Estado</label>
            <select
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
              className="w-full px-4 py-2 border border-input bg-input-background rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="Activo">Activo / Disponible</option>
              <option value="Inactivo">Inactivo / Bajo Stock</option>
            </select>
          </div>

          <div className="flex gap-2 pt-4 border-t border-border">
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
              className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 disabled:opacity-50 text-sm font-medium transition-colors shadow-xs"
            >
              {isLoading ? 'Guardando...' : insumo ? 'Guardar Cambios' : 'Guardar Insumo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
