import { Plus, Eye, Edit, Trash2, FileDown, FileSpreadsheet, Box, CheckCircle, AlertTriangle, DollarSign } from 'lucide-react';
import { useProductos } from '../hooks/useProductos';
import { usePagination } from '../../../shared/hooks/usePagination';
import { PaginationControls } from '../../../shared/components/PaginationControls';
import { ProductoFormModal } from '../components/ProductoFormModal';
import ConfirmDialog from '../../../shared/components/ConfirmDialog';
import Toast from '../../../shared/components/Toast';
import { usePermissions } from '../../../shared/contexts/PermissionContext';
import StatusSwitch from '../../../shared/components/StatusSwitch';
import RecordsFilterToolbar from '../../../shared/components/RecordsFilterToolbar';
import RowActions from '../../../shared/components/RowActions';
import RecordsTable from '../../../shared/components/RecordsTable';
import DetailModal from '../../../shared/components/DetailModal';
import StatCard from '../../../shared/components/StatCard';
import StatsGrid from '../../../shared/components/StatsGrid';

export default function ProductosPage() {
  const { can } = usePermissions();
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
  const pagination = usePagination(filteredProductos);

  const totalProductos = productos.length;
  const disponibles = productos.filter((p) => p.estado === 'Disponible').length;
  const bajoStock = productos.filter((p) => p.estado === 'Bajo Stock').length;
  const valorInventario = productos.reduce((acc, p) => acc + (p.precio_venta * p.stock_actual), 0);

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
            onClick={() => setShowModal(true)} disabled={!can('productos', 'crear')}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nuevo Producto
          </button>
        </div>
      </div>

      {/* Tarjetas de Consolidado */}
      <StatsGrid className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard variant="compact" label="Total Productos" value={totalProductos} icon={Box} iconColor="hsl(var(--primary))" iconBackground="hsl(var(--primary) / 0.1)" />
        <StatCard variant="compact" label="Disponibles" value={disponibles} icon={CheckCircle} iconColor="hsl(var(--success))" iconBackground="hsl(var(--success) / 0.1)" />
        <StatCard variant="compact" label="Bajo Stock" value={bajoStock} icon={AlertTriangle} iconColor="hsl(var(--warning))" iconBackground="hsl(var(--warning) / 0.1)" />
        <StatCard variant="compact" label="Valor Inventario" value={`$${valorInventario.toLocaleString('es-CO')}`} icon={DollarSign} iconColor="hsl(var(--primary))" iconBackground="hsl(var(--accent) / 0.1)" />
      </StatsGrid>

      {/* Filtros y Búsqueda */}
      <RecordsFilterToolbar
        searchQuery={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Buscar por código o producto..."
      >
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
      </RecordsFilterToolbar>

      {/* Tabla Estandarizada */}
      <RecordsTable
        columns={[
          { key: 'id_producto', label: 'ID' },
          { key: 'nombre', label: 'Producto' },
          { key: 'id_categoria', label: 'Categoría' },
          { key: 'descripcion', label: 'Descripción' },
          { key: 'precio_venta', label: 'Precio' },
          { key: 'stock_actual', label: 'Stock' },
          { key: 'estado', label: 'Estado' },
          { key: 'acciones', label: 'Acciones' },
        ]}
        data={pagination.paginatedData}
        rowKey={(producto) => producto.id_producto}
        emptyMessage="No se encontraron productos."
        renderRow={(producto) => (
          <>
                  <td className="px-6 py-4 font-mono font-medium">{producto.id_producto}</td>
                  <td className="px-6 py-4 font-semibold">{producto.nombre}</td>
                  <td className="px-6 py-4 text-muted-foreground">{producto.id_categoria}</td>
                  <td className="px-6 py-4 text-muted-foreground">{producto.descripcion}</td>
                  <td className="px-6 py-4 font-medium">{producto.precio_venta}</td>
                  <td className="px-6 py-4 font-semibold">{producto.stock_actual}</td>
                  <td className="px-6 py-4">
                    <StatusSwitch value={producto.estado} />
                  </td>
                  <td className="px-6 py-4">
                    <RowActions actions={[
                      { key: 'view', icon: Eye, title: 'Ver detalle', onClick: () => setDetailModal({ isOpen: true, data: producto }) },
                      { key: 'edit', icon: Edit, title: 'Editar', onClick: () => setShowModal(true), disabled: !can('productos', 'editar') },
                      { key: 'delete', icon: Trash2, title: 'Eliminar', onClick: () => setDeleteDialog({ isOpen: true, id: producto.id_producto, nombre: producto.nombre }), disabled: !can('productos', 'eliminar'), className: 'p-2 hover:bg-muted rounded-lg text-destructive' },
                    ]} />
                  </td>
          </>
        )}
      />

      <PaginationControls {...pagination} />

      {/* Modal de Detalle */}
      <DetailModal open={detailModal.isOpen && Boolean(detailModal.data)} title="Detalle del Producto" onClose={() => setDetailModal({ isOpen: false, data: null })} className="border border-border space-y-4" contentClassName="space-y-2 text-sm">
        {detailModal.data && <><p><strong>ID:</strong> {detailModal.data.id_producto}</p><p><strong>Nombre:</strong> {detailModal.data.nombre}</p><p><strong>Categoría ID:</strong> {detailModal.data.id_categoria}</p><p><strong>Descripción:</strong> {detailModal.data.descripcion}</p><p><strong>Precio de Venta:</strong> {detailModal.data.precio_venta}</p><p><strong>Stock Actual:</strong> {detailModal.data.stock_actual}</p><p><strong>Stock Mínimo:</strong> {detailModal.data.stock_minimo}</p><p><strong>Estado:</strong> {detailModal.data.estado}</p></>}
      </DetailModal>

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

