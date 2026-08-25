import { Plus, Eye, Edit, Trash2, FileDown, FileSpreadsheet, Package, AlertTriangle, CheckCircle, Truck } from 'lucide-react';
import { useInsumos } from '../hooks/useInsumos';
import { usePagination } from '../../../shared/hooks/usePagination';
import { PaginationControls } from '../../../shared/components/PaginationControls';
import { InsumoFormModal } from '../components/InsumoFormModal';
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

export default function InsumosPage() {
  const { can } = usePermissions();
  const {
    insumos,
    rawInsumos,
    searchQuery,
    setSearchQuery,
    categoriaFilter,
    setCategoriaFilter,
    estadoFilter,
    setEstadoFilter,
    showModal,
    setShowModal,
    detailModal,
    setDetailModal,
    deleteDialog,
    setDeleteDialog,
    isDeleting,
    toast,
    setToast,
    handleDelete,
  } = useInsumos();
  const pagination = usePagination(insumos);

  const totalInsumos = rawInsumos.length;
  const disponibles = rawInsumos.filter((i) => i.estado === 'Disponible').length;
  const bajoStock = rawInsumos.filter((i) => i.estado === 'Bajo Stock').length;
  const proveedoresCount = new Set(rawInsumos.map((i) => i.id_proveedor).filter(Boolean)).size;

  return (
    <div className="space-y-6">
      {/* Header con exportación */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Insumos y Materia Prima</h1>
          <p className="text-muted-foreground">Inventario de granos, lácteos y embalajes para Masarepas</p>
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
            onClick={() => setShowModal(true)} disabled={!can('insumos', 'crear')}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nuevo Insumo
          </button>
        </div>
      </div>

      {/* Tarjetas de Consolidado */}
      <StatsGrid className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard variant="compact" label="Total Insumos" value={totalInsumos} icon={Package} iconColor="hsl(var(--primary))" iconBackground="hsl(var(--primary) / 0.1)" />
        <StatCard variant="compact" label="Disponibles" value={disponibles} icon={CheckCircle} iconColor="hsl(var(--success))" iconBackground="hsl(var(--success) / 0.1)" />
        <StatCard variant="compact" label="Bajo Stock" value={bajoStock} icon={AlertTriangle} iconColor="hsl(var(--warning))" iconBackground="hsl(var(--warning) / 0.1)" />
        <StatCard variant="compact" label="Proveedores Activos" value={proveedoresCount} icon={Truck} iconColor="hsl(var(--primary))" iconBackground="hsl(var(--accent) / 0.1)" />
      </StatsGrid>

      {/* Filtros y Búsqueda */}
      <RecordsFilterToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Buscar por código, nombre o proveedor..."
      >
        <select
          value={categoriaFilter}
          onChange={(e) => setCategoriaFilter(e.target.value)}
          className="px-4 py-2 border border-input bg-input-background rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="Todas">Todas las categorías</option>
          <option value="Granos y Cereales">Granos y Cereales</option>
          <option value="Lácteos y Quesos">Lácteos y Quesos</option>
          <option value="Lácteos y Grasas">Lácteos y Grasas</option>
          <option value="Empaques y Embalajes">Empaques y Embalajes</option>
        </select>
        <select
          value={estadoFilter}
          onChange={(e) => setEstadoFilter(e.target.value)}
          className="px-4 py-2 border border-input bg-input-background rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="Todos">Todos los estados</option>
          <option value="Disponible">Disponible</option>
          <option value="Bajo Stock">Bajo Stock</option>
        </select>
      </RecordsFilterToolbar>

      {/* Tabla Estandarizada */}
      <RecordsTable
        columns={[
          { key: 'id_insumo', label: 'ID' },
          { key: 'nombre', label: 'Insumo' },
          { key: 'unidad_medida', label: 'Unidad de Medida' },
          { key: 'stock_actual', label: 'Stock Actual' },
          { key: 'id_proveedor', label: 'Proveedor' },
          { key: 'estado', label: 'Estado' },
          { key: 'acciones', label: 'Acciones' },
        ]}
        data={pagination.paginatedData}
        rowKey={(insumo) => insumo.id_insumo}
        emptyMessage="No se encontraron insumos."
        renderRow={(insumo) => (
          <>
                  <td className="px-6 py-4 font-mono font-medium">{insumo.id_insumo}</td>
                  <td className="px-6 py-4 font-semibold">{insumo.nombre}</td>
                  <td className="px-6 py-4 text-muted-foreground">{insumo.unidad_medida}</td>
                  <td className="px-6 py-4 font-semibold">{insumo.stock_actual}</td>
                  <td className="px-6 py-4 text-muted-foreground">{insumo.id_proveedor}</td>
                  <td className="px-6 py-4">
                    <StatusSwitch value={insumo.estado} />
                  </td>
                  <td className="px-6 py-4">
                    <RowActions actions={[
                      { key: 'view', icon: Eye, title: 'Ver detalle', onClick: () => setDetailModal({ isOpen: true, data: insumo }) },
                      { key: 'edit', icon: Edit, title: 'Editar', onClick: () => setShowModal(true), disabled: !can('insumos', 'editar') },
                      { key: 'delete', icon: Trash2, title: 'Eliminar', onClick: () => setDeleteDialog({ isOpen: true, id: insumo.id_insumo, nombre: insumo.nombre }), disabled: !can('insumos', 'eliminar'), className: 'p-2 hover:bg-muted rounded-lg text-destructive' },
                    ]} />
                  </td>
          </>
        )}
      />

      <PaginationControls {...pagination} />

      {/* Modal de Detalle */}
      <DetailModal open={detailModal.isOpen && Boolean(detailModal.data)} title="Detalle del Insumo" onClose={() => setDetailModal({ isOpen: false, data: null })} className="border border-border space-y-4" contentClassName="space-y-2 text-sm">
        {detailModal.data && <><p><strong>ID:</strong> {detailModal.data.id_insumo}</p><p><strong>Nombre:</strong> {detailModal.data.nombre}</p><p><strong>Unidad de Medida:</strong> {detailModal.data.unidad_medida}</p><p><strong>Stock Actual:</strong> {detailModal.data.stock_actual}</p><p><strong>Stock Mínimo:</strong> {detailModal.data.stock_minimo}</p><p><strong>Fecha de Vencimiento:</strong> {detailModal.data.fecha_vencimiento}</p><p><strong>Proveedor:</strong> {detailModal.data.id_proveedor}</p><p><strong>Estado:</strong> {detailModal.data.estado}</p></>}
      </DetailModal>

      <InsumoFormModal open={showModal} onClose={() => setShowModal(false)} />

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        title="Eliminar Insumo"
        message={`¿Estás seguro de que deseas eliminar el insumo "${deleteDialog.nombre}"? Esta acción no se puede deshacer.`}
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

