import { Plus, Search, Eye, Edit, Trash2, FileDown, FileSpreadsheet, Box, CheckCircle, AlertTriangle, DollarSign } from 'lucide-react';
import { useProductos } from '../hooks/useProductos';
import { ProductoFormModal } from '../components/ProductoFormModal';
import ConfirmDialog from '../../../shared/components/ConfirmDialog';
import Toast from '../../../shared/components/Toast';

export default function ProductosPage() {
  const {
    searchTerm,
    setSearchTerm,
    filterCategoria,
    setFilterCategoria,
    filterEstado,
    setFilterEstado,
    showModal,
    setShowModal,
    detailModal,
    setDetailModal,
    deleteDialog,
    setDeleteDialog,
    isDeleting,
    toast,
    setToast,
    productos,
    filteredProductos,
    handleDelete,
  } = useProductos();

  const totalProductos = productos.length;
  const disponibles = productos.filter((p) => p.estado === 'Disponible').length;
  const bajoStock = productos.filter((p) => p.estado === 'Bajo Stock').length;
  const valorInventario = productos.reduce((acc, p) => acc + (p.precioNum * p.stock), 0);

  return (
    <div className="space-y-6">
      {/* Header con exportación */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Productos Terminados</h1>
          <p className="text-muted-foreground">Catálogo y stock de arepas y derivados de Masarepas</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-muted text-sm font-medium transition-colors">
            <FileDown className="w-4 h-4" />
            Exportar PDF
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-muted text-sm font-medium transition-colors">
            <FileSpreadsheet className="w-4 h-4" />
            Exportar Excel
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nuevo Producto
          </button>
        </div>
      </div>

      {/* Tarjetas de Consolidado */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card p-4 rounded-lg border border-border flex items-center gap-3">
          <div className="p-3 bg-primary/10 rounded-lg text-primary">
            <Box className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Productos</p>
            <h3 className="text-xl font-bold">{totalProductos}</h3>
          </div>
        </div>
        <div className="bg-card p-4 rounded-lg border border-border flex items-center gap-3">
          <div className="p-3 bg-success/10 rounded-lg text-success">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Disponibles</p>
            <h3 className="text-xl font-bold">{disponibles}</h3>
          </div>
        </div>
        <div className="bg-card p-4 rounded-lg border border-border flex items-center gap-3">
          <div className="p-3 bg-warning/10 rounded-lg text-warning">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Bajo Stock</p>
            <h3 className="text-xl font-bold">{bajoStock}</h3>
          </div>
        </div>
        <div className="bg-card p-4 rounded-lg border border-border flex items-center gap-3">
          <div className="p-3 bg-accent/10 rounded-lg text-primary">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Valor Inventario</p>
            <h3 className="text-xl font-bold">${valorInventario.toLocaleString('es-CO')}</h3>
          </div>
        </div>
      </div>

      {/* Filtros y Búsqueda */}
      <div className="bg-card p-4 rounded-lg border border-border flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Buscar por código o producto..."
            value={searchTerm}
            onChange={(e) => setSearchQuery ? setSearchQuery(e.target.value) : setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-input bg-input-background rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <select
          value={filterCategoria}
          onChange={(e) => setFilterCategoria(e.target.value)}
          className="px-4 py-2 border border-input bg-input-background rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="Todas las categorías">Todas las categorías</option>
          <option value="Arepas Dulces">Arepas Dulces</option>
          <option value="Arepas Blancas">Arepas Blancas</option>
          <option value="Arepas Rellenas">Arepas Rellenas</option>
          <option value="Arepas Especiales">Arepas Especiales</option>
          <option value="Derivados de Maíz">Derivados de Maíz</option>
        </select>
        <select
          value={filterEstado}
          onChange={(e) => setFilterEstado(e.target.value)}
          className="px-4 py-2 border border-input bg-input-background rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="Todos los estados">Todos los estados</option>
          <option value="Disponible">Disponible</option>
          <option value="Bajo Stock">Bajo Stock</option>
        </select>
      </div>

      {/* Tabla Estandarizada */}
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted text-muted-foreground font-semibold">
            <tr>
              <th className="px-6 py-3">Código</th>
              <th className="px-6 py-3">Producto</th>
              <th className="px-6 py-3">Categoría</th>
              <th className="px-6 py-3">Presentación</th>
              <th className="px-6 py-3">Precio</th>
              <th className="px-6 py-3">Stock</th>
              <th className="px-6 py-3">Estado</th>
              <th className="px-6 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredProductos.length > 0 ? (
              filteredProductos.map((producto) => (
                <tr key={producto.id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4 font-mono font-medium">{producto.codigo}</td>
                  <td className="px-6 py-4 font-semibold">{producto.nombre}</td>
                  <td className="px-6 py-4 text-muted-foreground">{producto.categoria}</td>
                  <td className="px-6 py-4 text-muted-foreground">{producto.unidadMedida}</td>
                  <td className="px-6 py-4 font-medium">{producto.precio}</td>
                  <td className="px-6 py-4 font-semibold">{producto.stock} un.</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        producto.estado === 'Disponible'
                          ? 'bg-success/10 text-success'
                          : 'bg-warning/10 text-warning'
                      }`}
                    >
                      {producto.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setDetailModal({ isOpen: true, data: producto })}
                        className="p-2 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground"
                        title="Ver detalle"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setShowModal(true)}
                        className="p-2 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground"
                        title="Editar"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteDialog({ isOpen: true, id: producto.id, nombre: producto.nombre })}
                        className="p-2 hover:bg-muted rounded-lg text-destructive"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="px-6 py-8 text-center text-muted-foreground">
                  No se encontraron productos.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal de Detalle */}
      {detailModal.isOpen && detailModal.data && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card p-6 rounded-lg max-w-md w-full border border-border space-y-4">
            <h3 className="text-lg font-bold">Detalle del Producto</h3>
            <div className="space-y-2 text-sm">
              <p><strong>Código:</strong> {detailModal.data.codigo}</p>
              <p><strong>Nombre:</strong> {detailModal.data.nombre}</p>
              <p><strong>Categoría:</strong> {detailModal.data.categoria}</p>
              <p><strong>Presentación:</strong> {detailModal.data.unidadMedida}</p>
              <p><strong>Precio Unitario:</strong> {detailModal.data.precio}</p>
              <p><strong>Stock Actual:</strong> {detailModal.data.stock} paquetes</p>
              <p><strong>Stock Mínimo:</strong> {detailModal.data.stockMinimo} paquetes</p>
              <p><strong>Estado:</strong> {detailModal.data.estado}</p>
            </div>
            <div className="flex justify-end pt-4">
              <button
                onClick={() => setDetailModal({ isOpen: false, data: null })}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      <ProductoFormModal open={showModal} onClose={() => setShowModal(false)} />

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        title="Eliminar Producto"
        message={`¿Estás seguro de que deseas eliminar el producto "${deleteDialog.nombre}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialog({ isOpen: false, id: null, nombre: '' })}
        isLoading={isDeleting}
      />

      <Toast
        isOpen={toast.isOpen}
        type={toast.type}
        message={toast.message}
        onClose={() => setToast({ ...toast, isOpen: false })}
      />
    </div>
  );
}

