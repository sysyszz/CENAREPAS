import { useState, useMemo } from 'react';
import { Box, CheckCircle, AlertTriangle, DollarSign } from 'lucide-react';
import { useProductos } from '../hooks/useProductos';
import { DataTable } from '../../../shared/components/DataTable';
import { RowActions } from '../../../shared/components/RowActions';
import { MetricCard } from '../../../shared/components/MetricCard';
import { ProductoFormModal } from '../components/ProductoFormModal';
import ConfirmDialog from '../../../shared/components/ConfirmDialog';
import Toast from '../../../shared/components/Toast';
import DetailModal from '../../../shared/components/DetailModal';
import PageHeader from '../../../shared/components/PageHeader';
import { usePermissions } from '../../../shared/contexts/PermissionContext';
import StatusSwitch from '../../../shared/components/StatusSwitch';

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
    isSaving,
    toast,
    setToast,
    productos,
    filteredProductos,
    handleSave,
    handleDelete,
  } = useProductos();

  const [selectedProducto, setSelectedProducto] = useState(null);

  const totalProductos = productos.length;
  const disponibles = productos.filter((p) => String(p.estado).toLowerCase() === 'disponible' || String(p.estado).toLowerCase() === 'activo').length;
  const bajoStock = productos.filter((p) => String(p.estado).toLowerCase() === 'bajo stock' || p.stock_actual <= p.stock_minimo).length;
  const valorInventario = productos.reduce((acc, p) => acc + (p.precio_venta * p.stock_actual), 0);

  const columns = useMemo(
    () => [
      {
        key: 'id_producto',
        label: 'ID',
        render: (value) => <span className="font-mono font-medium">{value}</span>,
      },
      {
        key: 'nombre',
        label: 'Producto',
        render: (value) => <span className="font-semibold">{value}</span>,
      },
      {
        key: 'id_categoria',
        label: 'Categoría ID',
        render: (value) => <span className="text-muted-foreground">{value}</span>,
      },
      {
        key: 'descripcion',
        label: 'Descripción',
        render: (value) => <span className="text-muted-foreground">{value}</span>,
      },
      {
        key: 'precio_venta',
        label: 'Precio',
        render: (value) => (
          <span className="font-medium">
            ${Number(value || 0).toLocaleString('es-CO')}
          </span>
        ),
      },
      {
        key: 'stock_actual',
        label: 'Stock',
        render: (value) => <span className="font-semibold">{value}</span>,
      },
      {
        key: 'estado',
        label: 'Estado',
        render: (value) => <StatusSwitch value={value} />,
      },
      {
        key: 'acciones',
        label: 'Acciones',
        render: (_, producto) => (
          <RowActions
            onView={() => setDetailModal({ isOpen: true, data: producto })}
            onEdit={() => {
              setSelectedProducto(producto);
              setShowModal(true);
            }}
            editDisabled={!can('productos', 'editar')}
            onDelete={() =>
              setDeleteDialog({
                isOpen: true,
                id: producto.id_producto,
                nombre: producto.nombre,
              })
            }
            deleteDisabled={!can('productos', 'eliminar')}
          />
        ),
      },
    ],
    [can, setDetailModal, setShowModal, setDeleteDialog]
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Productos Terminados"
        subtitle="Catálogo y stock de arepas y derivados de Masarepas"
        addLabel="Nuevo Producto"
        addDisabled={!can('productos', 'crear')}
        onAdd={() => {
          setSelectedProducto(null);
          setShowModal(true);
        }}
      />

      {/* Tarjetas de Consolidado */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard title="Total Productos" value={totalProductos} icon={Box} variant="primary" />
        <MetricCard title="Disponibles" value={disponibles} icon={CheckCircle} variant="success" />
        <MetricCard title="Bajo Stock" value={bajoStock} icon={AlertTriangle} variant="warning" />
        <MetricCard title="Valor Inventario" value={`$${valorInventario.toLocaleString('es-CO')}`} icon={DollarSign} variant="accent" />
      </div>


      {/* Tabla con DataTable */}
      <DataTable
        columns={columns}
        data={filteredProductos}
        searchPlaceholder="Buscar por código o producto..."
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        filters={
          <>
            <select
              value={filterCategoria}
              onChange={(e) => setFilterCategoria(e.target.value)}
              className="px-4 py-2 border border-input bg-input-background rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="Todas las categorías">Todas las categorías</option>
              <option value="1">Arepas Dulces</option>
              <option value="2">Arepas Blancas</option>
              <option value="3">Arepas Rellenas</option>
              <option value="4">Arepas Especiales</option>
              <option value="5">Derivados de Maíz</option>
            </select>
            <select
              value={filterEstado}
              onChange={(e) => setFilterEstado(e.target.value)}
              className="px-4 py-2 border border-input bg-input-background rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="Todos los estados">Todos los estados</option>
              <option value="activo">Activo / Disponible</option>
              <option value="inactivo">Inactivo / Bajo Stock</option>
            </select>
          </>
        }
      />

      <DetailModal
        isOpen={detailModal.isOpen}
        onClose={() => setDetailModal({ isOpen: false, data: null })}
        title="Detalle del Producto"
        fields={detailModal.data ? [
          { label: 'ID', value: detailModal.data.id_producto },
          { label: 'Nombre', value: detailModal.data.nombre },
          { label: 'Categoría ID', value: detailModal.data.id_categoria },
          { label: 'Descripción', value: detailModal.data.descripcion || 'N/A' },
          { label: 'Precio de Venta', value: `$${Number(detailModal.data.precio_venta || 0).toLocaleString('es-CO')}` },
          { label: 'Stock Actual', value: detailModal.data.stock_actual },
          { label: 'Stock Mínimo', value: detailModal.data.stock_minimo },
          { label: 'Estado', value: detailModal.data.estado },
        ] : []}
      />

      <ProductoFormModal
        open={showModal}
        producto={selectedProducto}
        onSave={handleSave}
        isLoading={isSaving}
        onClose={() => {
          setShowModal(false);
          setSelectedProducto(null);
        }}
      />

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


