import { Plus, Eye, Edit, Trash2, FileDown, FileSpreadsheet, FolderTree, CheckCircle, Package, Layers } from 'lucide-react';
import { useCategorias } from '../hooks/useCategorias';
import { usePagination } from '../../../shared/hooks/usePagination';
import { PaginationControls } from '../../../shared/components/PaginationControls';
import RecordsFilterToolbar from '../../../shared/components/RecordsFilterToolbar';
import { CategoriaFormModal } from '../components/CategoriaFormModal';
import ConfirmDialog from '../../../shared/components/ConfirmDialog';
import Toast from '../../../shared/components/Toast';
import { usePermissions } from '../../../shared/contexts/PermissionContext';
import StatusSwitch from '../../../shared/components/StatusSwitch';
import RowActions from '../../../shared/components/RowActions';
import RecordsTable from '../../../shared/components/RecordsTable';
import DetailModal from '../../../shared/components/DetailModal';
import StatCard from '../../../shared/components/StatCard';
import StatsGrid from '../../../shared/components/StatsGrid';

export default function CategoriasPage() {
  const { can } = usePermissions();
  const {
    categorias,
    rawCategorias,
    searchQuery,
    setSearchQuery,
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
  } = useCategorias();
  const pagination = usePagination(categorias);

  const totalCategorias = rawCategorias.length;
  const activas = rawCategorias.filter((c) => c.estado === 'Activo').length;
  const totalProductosAsignados = 0;
  const promedioProductos = totalCategorias > 0 ? (totalProductosAsignados / totalCategorias).toFixed(1) : 0;

  return (
    <div className="space-y-6">
      {/* Header con exportación */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Categorías de Productos</h1>
          <p className="text-muted-foreground">Clasificación de arepas y subproductos de fábrica</p>
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
            onClick={() => setShowModal(true)} disabled={!can('categorias', 'crear')}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nueva Categoría
          </button>
        </div>
      </div>

      {/* Tarjetas de Consolidado */}
      <StatsGrid className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard variant="compact" label="Total Categorías" value={totalCategorias} icon={FolderTree} iconColor="hsl(var(--primary))" iconBackground="hsl(var(--primary) / 0.1)" />
        <StatCard variant="compact" label="Categorías Activas" value={activas} icon={CheckCircle} iconColor="hsl(var(--success))" iconBackground="hsl(var(--success) / 0.1)" />
        <StatCard variant="compact" label="Prod. Clasificados" value={totalProductosAsignados} icon={Package} iconColor="hsl(var(--primary))" iconBackground="hsl(var(--accent) / 0.1)" />
        <StatCard variant="compact" label="Promedio Prod/Cat" value={promedioProductos} icon={Layers} iconColor="hsl(var(--warning))" iconBackground="hsl(var(--warning) / 0.1)" />
      </StatsGrid>

      {/* Filtros y Búsqueda */}
      <RecordsFilterToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Buscar por código, nombre o descripción..."
      >
        <select
          value={estadoFilter}
          onChange={(e) => setEstadoFilter(e.target.value)}
          className="px-4 py-2 border border-input bg-input-background rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="Todos">Todos los estados</option>
          <option value="Activo">Activo</option>
          <option value="Inactivo">Inactivo</option>
        </select>
      </RecordsFilterToolbar>

      {/* Tabla con Acciones Estandarizadas */}
      <RecordsTable
        columns={[
          { key: 'id_categoria', label: 'ID' },
          { key: 'nombre', label: 'Nombre Categoría' },
          { key: 'descripcion', label: 'Descripción' },
          { key: 'estado', label: 'Estado' },
          { key: 'acciones', label: 'Acciones' },
        ]}
        data={pagination.paginatedData}
        rowKey={(categoria) => categoria.id_categoria}
        emptyMessage="No se encontraron categorías."
        renderRow={(categoria) => (
          <>
            <td className="px-6 py-4 font-mono font-medium">{categoria.id_categoria}</td>
            <td className="px-6 py-4 font-semibold">{categoria.nombre}</td>
            <td className="px-6 py-4 text-muted-foreground max-w-xs truncate">{categoria.descripcion}</td>
            <td className="px-6 py-4"><StatusSwitch value={categoria.estado} /></td>
            <td className="px-6 py-4">
              <RowActions actions={[
                { key: 'view', icon: Eye, title: 'Ver detalle', onClick: () => setDetailModal({ isOpen: true, data: categoria }) },
                { key: 'edit', icon: Edit, title: 'Editar', onClick: () => setShowModal(true), disabled: !can('categorias', 'editar') },
                { key: 'delete', icon: Trash2, title: 'Eliminar', onClick: () => setDeleteDialog({ isOpen: true, id: categoria.id_categoria, nombre: categoria.nombre }), disabled: !can('categorias', 'eliminar'), className: 'p-2 hover:bg-muted rounded-lg text-destructive' },
              ]} />
            </td>
          </>
        )}
      />

      <PaginationControls {...pagination} />

      {/* Modal de Detalle */}
      <DetailModal
        open={detailModal.isOpen && Boolean(detailModal.data)}
        title="Detalle de Categoría"
        onClose={() => setDetailModal({ isOpen: false, data: null })}
        className="border border-border space-y-4"
        contentClassName="space-y-2 text-sm"
      >
        {detailModal.data && (
          <>
            <p><strong>ID:</strong> {detailModal.data.id_categoria}</p>
            <p><strong>Nombre:</strong> {detailModal.data.nombre}</p>
            <p><strong>Descripción:</strong> {detailModal.data.descripcion}</p>
            <p><strong>Estado:</strong> {detailModal.data.estado}</p>
          </>
        )}
      </DetailModal>

      <CategoriaFormModal open={showModal} onClose={() => setShowModal(false)} />

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        title="Eliminar Categoría"
        message={`¿Estás seguro de que deseas eliminar la categoría "${deleteDialog.nombre}"? Esta acción no se puede deshacer.`}
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

