import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export function ProductoFormModal({ open, onClose, producto = null, onSave, isLoading = false }) {
  const [nombre, setNombre] = useState('');
  const [idCategoria, setIdCategoria] = useState('1');
  const [precioVenta, setPrecioVenta] = useState('');
  const [stockActual, setStockActual] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [idFicha, setIdFicha] = useState('');
  const [idProveedor, setIdProveedor] = useState('');
  const [imagenUrl, setImagenUrl] = useState('');
  const [stockMinimo, setStockMinimo] = useState('');
  const [fechaVencimiento, setFechaVencimiento] = useState('');
  const [estado, setEstado] = useState('activo');

  useEffect(() => {
    if (producto) {
      setNombre(producto.nombre || '');
      setIdCategoria(producto.id_categoria ? String(producto.id_categoria) : '1');
      setPrecioVenta(producto.precio_venta != null ? String(producto.precio_venta) : '');
      setStockActual(producto.stock_actual != null ? String(producto.stock_actual) : '');
      setDescripcion(producto.descripcion || '');
      setIdFicha(producto.id_ficha ? String(producto.id_ficha) : '');
      setIdProveedor(producto.id_proveedor ? String(producto.id_proveedor) : '');
      setImagenUrl(producto.imagen_url || '');
      setStockMinimo(producto.stock_minimo != null ? String(producto.stock_minimo) : '');
      setFechaVencimiento(producto.fecha_vencimiento || '');
      setEstado(producto.estado || 'activo');
    } else {
      setNombre('');
      setIdCategoria('1');
      setPrecioVenta('');
      setStockActual('');
      setDescripcion('');
      setIdFicha('');
      setIdProveedor('');
      setImagenUrl('');
      setStockMinimo('');
      setFechaVencimiento('');
      setEstado('activo');
    }
  }, [producto, open]);

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nombre.trim()) return;

    const payload = producto
      ? {
          ...producto,
          nombre: nombre.trim(),
          id_categoria: Number(idCategoria) || 1,
          precio_venta: Number(precioVenta) || 0,
          stock_actual: Number(stockActual) || 0,
          descripcion: descripcion.trim() || null,
          id_ficha: idFicha ? Number(idFicha) : null,
          id_proveedor: idProveedor ? Number(idProveedor) : null,
          imagen_url: imagenUrl.trim() || null,
          stock_minimo: Number(stockMinimo) || 0,
          fecha_vencimiento: fechaVencimiento || null,
          estado,
        }
      : {
          nombre: nombre.trim(),
          id_categoria: Number(idCategoria) || 1,
          precio_venta: Number(precioVenta) || 0,
          stock_actual: Number(stockActual) || 0,
          descripcion: descripcion.trim() || null,
          id_ficha: idFicha ? Number(idFicha) : null,
          id_proveedor: idProveedor ? Number(idProveedor) : null,
          imagen_url: imagenUrl.trim() || null,
          stock_minimo: Number(stockMinimo) || 0,
          fecha_vencimiento: fechaVencimiento || null,
          estado: estado || 'activo',
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
          <h2 className="text-lg font-bold">{producto ? 'Editar Producto' : 'Nuevo Producto'}</h2>
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
            <label className="block mb-2 text-sm font-medium">Nombre del Producto</label>
            <input
              type="text"
              maxLength={100}
              required
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full px-4 py-2 border border-input bg-input-background rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 text-sm font-medium">Categoría</label>
              <select
                value={idCategoria}
                onChange={(e) => setIdCategoria(e.target.value)}
                className="w-full px-4 py-2 border border-input bg-input-background rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="1">Arepas Dulces</option>
                <option value="2">Arepas Blancas</option>
                <option value="3">Arepas Rellenas</option>
                <option value="4">Arepas Especiales</option>
                <option value="5">Derivados de Maíz</option>
              </select>
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium">Precio de Venta</label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                value={precioVenta}
                onChange={(e) => setPrecioVenta(e.target.value)}
                className="w-full px-4 py-2 border border-input bg-input-background rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>
          <div className="modal-field-wide">
            <label className="block mb-2 text-sm font-medium">Stock Inicial</label>
            <input
              type="number"
              min="0"
              value={stockActual}
              onChange={(e) => setStockActual(e.target.value)}
              className="w-full px-4 py-2 border border-input bg-input-background rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="modal-field-wide">
            <label className="block mb-2 text-sm font-medium">Descripción</label>
            <textarea
              rows={3}
              maxLength={255}
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="w-full px-4 py-2 border border-input bg-input-background rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 text-sm font-medium">Ficha técnica</label>
              <select
                value={idFicha}
                onChange={(e) => setIdFicha(e.target.value)}
                className="w-full px-4 py-2 border border-input bg-input-background rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">Sin ficha técnica</option>
                <option value="1">Arepa de Chócolo con Queso</option>
                <option value="2">Arepa Telita Tradicional</option>
              </select>
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium">Proveedor</label>
              <select
                value={idProveedor}
                onChange={(e) => setIdProveedor(e.target.value)}
                className="w-full px-4 py-2 border border-input bg-input-background rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">Sin proveedor</option>
                <option value="1">Agrícola del Valle S.A.</option>
                <option value="2">Lácteos El Campesino</option>
                <option value="3">Plásticos San José Ltda.</option>
                <option value="4">Distribuidora del Campo</option>
              </select>
            </div>
          </div>
          <div className="modal-field-wide">
            <label className="block mb-2 text-sm font-medium">Imagen URL</label>
            <input
              type="url"
              maxLength={255}
              value={imagenUrl}
              onChange={(e) => setImagenUrl(e.target.value)}
              className="w-full px-4 py-2 border border-input bg-input-background rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 text-sm font-medium">Stock Mínimo</label>
              <input
                type="number"
                min="0"
                value={stockMinimo}
                onChange={(e) => setStockMinimo(e.target.value)}
                className="w-full px-4 py-2 border border-input bg-input-background rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium">Fecha de Vencimiento</label>
              <input
                type="date"
                value={fechaVencimiento}
                onChange={(e) => setFechaVencimiento(e.target.value)}
                className="w-full px-4 py-2 border border-input bg-input-background rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>
          <div className="modal-field-wide">
            <label className="block mb-2 text-sm font-medium">Estado</label>
            <select
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
              className="w-full px-4 py-2 border border-input bg-input-background rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
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
              {isLoading ? 'Guardando...' : producto ? 'Guardar Cambios' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

