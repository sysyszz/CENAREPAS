import { useState, useEffect } from 'react';
import { X, Upload, Trash2, Image as ImageIcon } from 'lucide-react';
import { mockCategorias, getCategorias } from '../../categorias/services/categoriasService';
import { mockFichasTecnicas, getFichasTecnicas } from '../../fichas-tecnicas/services/fichasTecnicasService';
import { mockProveedores, getProveedores } from '../../proveedores/services/proveedoresService';

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

  const [categorias, setCategorias] = useState(mockCategorias);
  const [fichas, setFichas] = useState(mockFichasTecnicas);
  const [proveedores, setProveedores] = useState(mockProveedores);

  useEffect(() => {
    getCategorias().then((data) => {
      if (data && data.length > 0) setCategorias(data);
    });
    getFichasTecnicas().then((data) => {
      if (data && data.length > 0) setFichas(data);
    });
    getProveedores().then((data) => {
      if (data && data.length > 0) setProveedores(data);
    });
  }, []);

  useEffect(() => {
    if (producto) {
      setNombre(producto.nombre || '');
      setIdCategoria(producto.id_categoria ? String(producto.id_categoria) : (categorias[0]?.id_categoria ? String(categorias[0].id_categoria) : '1'));
      setPrecioVenta(producto.precio_venta != null ? String(producto.precio_venta) : '');
      setStockActual(producto.stock_actual != null ? String(producto.stock_actual) : '0');
      setDescripcion(producto.descripcion || '');
      setIdFicha(producto.id_ficha ? String(producto.id_ficha) : '');
      setIdProveedor(producto.id_proveedor ? String(producto.id_proveedor) : '');
      setImagenUrl(producto.imagen_url || '');
      setUrlInput('');
      setStockMinimo(producto.stock_minimo != null ? String(producto.stock_minimo) : '0');
      setFechaVencimiento(producto.fecha_vencimiento || '');
      setEstado(producto.estado || 'activo');
    } else {
      setNombre('');
      setIdCategoria(categorias[0]?.id_categoria ? String(categorias[0].id_categoria) : '1');
      setPrecioVenta('');
      setStockActual('0');
      setDescripcion('');
      setIdFicha('');
      setIdProveedor('');
      setImagenUrl('');
      setUrlInput('');
      setStockMinimo('0');
      setFechaVencimiento('');
      setEstado('activo');
    }
  }, [producto, open, categorias]);

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
              Completa la información y características del producto terminado
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
            <label htmlFor="producto_nombre" className="block mb-1.5 text-sm font-medium">Nombre del Producto *</label>
            <input
              id="producto_nombre"
              name="nombre"
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
              <label htmlFor="producto_id_categoria" className="block mb-1.5 text-sm font-medium">Categoría *</label>
              <select
                id="producto_id_categoria"
                name="id_categoria"
                value={idCategoria}
                onChange={(e) => setIdCategoria(e.target.value)}
                className="w-full px-4 py-2 border border-input bg-input-background rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {categorias.map((cat) => (
                  <option key={cat.id_categoria} value={String(cat.id_categoria)}>
                    {cat.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="producto_precio_venta" className="block mb-1.5 text-sm font-medium">Precio de Venta ($) *</label>
              <input
                id="producto_precio_venta"
                name="precio_venta"
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
              <label htmlFor="producto_stock_actual" className="block mb-1.5 text-sm font-medium">Stock Inicial</label>
              <input
                id="producto_stock_actual"
                name="stock_actual"
                type="number"
                min="0"
                placeholder="Ej. 100"
                value={stockActual}
                onChange={(e) => setStockActual(e.target.value)}
                className="w-full px-4 py-2 border border-input bg-input-background rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label htmlFor="producto_stock_minimo" className="block mb-1.5 text-sm font-medium">Stock Mínimo</label>
              <input
                id="producto_stock_minimo"
                name="stock_minimo"
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
            <label htmlFor="producto_descripcion" className="block mb-1.5 text-sm font-medium">Descripción</label>
            <textarea
              id="producto_descripcion"
              name="descripcion"
              rows={2}
              maxLength={255}
              placeholder="Descripción breve de los ingredientes y presentación..."
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="w-full px-4 py-2 border border-input bg-input-background rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Sección de Imagen */}
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

                <div className="space-y-1.5">
                  <span className="text-[11px] font-medium text-muted-foreground block">
                    O ingresa la URL de una imagen web:
                  </span>
                  <div className="flex gap-2">
                    <input
                      id="producto_imagen_url_input"
                      name="imagen_url_input"
                      type="url"
                      maxLength={255}
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
              <label htmlFor="producto_fecha_vencimiento" className="block mb-1.5 text-sm font-medium">Fecha de Vencimiento</label>
              <input
                id="producto_fecha_vencimiento"
                name="fecha_vencimiento"
                type="date"
                value={fechaVencimiento}
                onChange={(e) => setFechaVencimiento(e.target.value)}
                className="w-full px-4 py-2 border border-input bg-input-background rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label htmlFor="producto_estado" className="block mb-1.5 text-sm font-medium">Estado</label>
              <select
                id="producto_estado"
                name="estado"
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
              <label htmlFor="producto_id_ficha" className="block mb-1.5 text-sm font-medium">Ficha Técnica (Receta)</label>
              <select
                id="producto_id_ficha"
                name="id_ficha"
                value={idFicha}
                onChange={(e) => setIdFicha(e.target.value)}
                className="w-full px-4 py-2 border border-input bg-input-background rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">Sin ficha técnica</option>
                {fichas.map((f) => (
                  <option key={f.id_ficha} value={String(f.id_ficha)}>
                    {f.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="producto_id_proveedor" className="block mb-1.5 text-sm font-medium">Proveedor (Opcional)</label>
              <select
                id="producto_id_proveedor"
                name="id_proveedor"
                value={idProveedor}
                onChange={(e) => setIdProveedor(e.target.value)}
                className="w-full px-4 py-2 border border-input bg-input-background rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">Sin proveedor</option>
                {proveedores.map((p) => (
                  <option key={p.id_proveedor} value={String(p.id_proveedor)}>
                    {p.nombre}
                  </option>
                ))}
              </select>
            </div>
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
              {isLoading ? 'Guardando...' : producto ? 'Guardar Cambios' : 'Guardar Producto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
