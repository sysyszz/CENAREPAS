import { useState, useEffect } from 'react';
import { X, Upload, Trash2, Image as ImageIcon } from 'lucide-react';
import { mockCategorias } from '../../categorias/services/categoriasService';

export function ProductoFormModal({ open, onClose, producto = null, onSave, isLoading = false }) {
  const [nombre, setNombre] = useState('');
  const [idCategoria, setIdCategoria] = useState('1');
  const [precioVenta, setPrecioVenta] = useState('');
  const [stockActual, setStockActual] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [idFicha, setIdFicha] = useState('');
  const [idProveedor, setIdProveedor] = useState('');
  const [imagenUrl, setImagenUrl] = useState('');
  const [urlInput, setUrlInput] = useState('');
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
      setUrlInput('');
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
      setUrlInput('');
      setStockMinimo('');
      setFechaVencimiento('');
      setEstado('activo');
    }
  }, [producto, open]);

  if (!open) return null;

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('La imagen no debe superar los 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagenUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

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
          imagen_url: (imagenUrl || urlInput).trim() || null,
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
          imagen_url: (imagenUrl || urlInput).trim() || null,
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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="form-modal-panel bg-card p-6 rounded-xl max-w-lg w-full border border-border shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto custom-scrollbar">
        <div className="flex items-start justify-between gap-4 pb-2 border-b border-border">
          <div>
            <h2 className="text-xl font-bold">{producto ? 'Editar Producto' : 'Nuevo Producto'}</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Completa la información y características del producto
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
            <label className="block mb-1.5 text-sm font-medium">Nombre del Producto *</label>
            <input
              type="text"
              maxLength={100}
              required
              placeholder="Ej. Arepa con Queso Mozzarella"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full px-4 py-2 border border-input bg-input-background rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1.5 text-sm font-medium">Categoría *</label>
              <select
                value={idCategoria}
                onChange={(e) => setIdCategoria(e.target.value)}
                className="w-full px-4 py-2 border border-input bg-input-background rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {mockCategorias.map((cat) => (
                  <option key={cat.id_categoria} value={String(cat.id_categoria)}>
                    {cat.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-1.5 text-sm font-medium">Precio de Venta ($) *</label>
              <input
                type="number"
                step="50"
                min="0"
                required
                placeholder="Ej. 8500"
                value={precioVenta}
                onChange={(e) => setPrecioVenta(e.target.value)}
                className="w-full px-4 py-2 border border-input bg-input-background rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1.5 text-sm font-medium">Stock Inicial</label>
              <input
                type="number"
                min="0"
                placeholder="Ej. 100"
                value={stockActual}
                onChange={(e) => setStockActual(e.target.value)}
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
            <label className="block mb-1.5 text-sm font-medium">Descripción</label>
            <textarea
              rows={2}
              maxLength={255}
              placeholder="Descripción breve de los ingredientes y presentación..."
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="w-full px-4 py-2 border border-input bg-input-background rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Sección de Imagen: Vista previa + Carga desde archivo / URL */}
          <div className="modal-field-wide space-y-2.5 p-3.5 rounded-xl border border-border bg-muted/20">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-primary" />
                Imagen del Producto
              </label>
              {imagenUrl && (
                <button
                  type="button"
                  onClick={() => {
                    setImagenUrl('');
                    setUrlInput('');
                  }}
                  className="text-xs text-destructive hover:underline flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" />
                  Eliminar imagen
                </button>
              )}
            </div>

            {imagenUrl ? (
              <div className="relative w-full h-44 rounded-lg border border-border bg-card overflow-hidden group">
                <img
                  src={imagenUrl}
                  alt="Vista previa del producto"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <label className="cursor-pointer px-3 py-1.5 bg-background text-foreground text-xs font-semibold rounded-lg shadow-sm flex items-center gap-1.5 hover:bg-muted transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    Cambiar archivo
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </label>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {/* Zona de subida desde el ordenador */}
                <label className="border-2 border-dashed border-border hover:border-primary/50 hover:bg-primary/5 rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer transition-colors text-center">
                  <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-1.5">
                    <Upload className="w-4 h-4" />
                  </div>
                  <p className="text-xs font-semibold text-foreground">
                    Haz clic para seleccionar desde tu equipo
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    PNG, JPG, WEBP (máx. 5MB)
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>

                {/* Opción de pegar URL */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-medium text-muted-foreground block">
                    O ingresa la URL de una imagen web:
                  </span>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      maxLength={500}
                      placeholder="https://ejemplo.com/foto-arepa.jpg"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      className="flex-1 px-3 py-1.5 border border-input bg-input-background rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (urlInput.trim()) {
                          setImagenUrl(urlInput.trim());
                        }
                      }}
                      className="px-3 py-1.5 bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-lg text-xs font-medium transition-colors"
                    >
                      Cargar
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              <label className="block mb-1.5 text-sm font-medium">Estado</label>
              <select
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
                className="w-full px-4 py-2 border border-input bg-input-background rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1.5 text-sm font-medium">Ficha Técnica</label>
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
              <label className="block mb-1.5 text-sm font-medium">Proveedor</label>
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
              {isLoading ? 'Guardando...' : producto ? 'Guardar Cambios' : 'Guardar Producto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
