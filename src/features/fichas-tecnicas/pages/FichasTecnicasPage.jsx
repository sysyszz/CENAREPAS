import { Plus, Eye, Edit, Trash2, FileDown, FileSpreadsheet, BookOpen, CheckCircle, FileText, Clock } from 'lucide-react';
import { useFichasTecnicas } from '../hooks/useFichasTecnicas';
import { usePagination } from '../../../shared/hooks/usePagination';
import { PaginationControls } from '../../../shared/components/PaginationControls';
import RecordsFilterToolbar from '../../../shared/components/RecordsFilterToolbar';
import { FichaTecnicaFormModal } from '../components/FichaTecnicaFormModal';
import ConfirmDialog from '../../../shared/components/ConfirmDialog';
import Toast from '../../../shared/components/Toast';
import { usePermissions } from '../../../shared/contexts/PermissionContext';
import StatusSwitch from '../../../shared/components/StatusSwitch';
import RowActions from '../../../shared/components/RowActions';
import RecordsTable from '../../../shared/components/RecordsTable';
import DetailModal from '../../../shared/components/DetailModal';
import StatsGrid from '../../../shared/components/StatsGrid';
import StatCard from '../../../shared/components/StatCard';

export default function FichasTecnicasPage() {
  const { can } = usePermissions();
  const {
    fichas,
    rawFichas,
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
  } = useFichasTecnicas();
  const pagination = usePagination(fichas);

  const totalFichas = rawFichas.length;
  const vigentes = rawFichas.filter((f) => f.estado === 'Vigente').length;

  return (
    <div className="space-y-6">
      {/* Header con exportación */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Fichas Técnicas (Recetas)</h1>
          <p className="text-muted-foreground">Formulaciones, rendimientos y estándar de calidad de Masarepas</p>
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
            onClick={() => setShowModal(true)} disabled={!can('fichas-tecnicas', 'crear')}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nueva Ficha Técnica
          </button>
        </div>
      </div>

      {/* Tarjetas de Consolidado */}
      <StatsGrid className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard variant="compact" label="Total Recetas" value={totalFichas} icon={BookOpen} iconColor="hsl(var(--primary))" iconBackground="hsl(var(--primary) / 0.1)" />
        <StatCard variant="compact" label="Fichas Vigentes" value={vigentes} icon={CheckCircle} iconColor="hsl(var(--success))" iconBackground="hsl(var(--success) / 0.1)" />
        <StatCard variant="compact" label="Versión Actual" value="v3.0 Max" icon={FileText} iconColor="hsl(var(--primary))" iconBackground="hsl(var(--accent) / 0.1)" />
        <StatCard variant="compact" label="Última Revisión" value="Hace 15 días" icon={Clock} iconColor="hsl(var(--warning))" iconBackground="hsl(var(--warning) / 0.1)" />
      </StatsGrid>

      {/* Filtros y Búsqueda */}
      <RecordsFilterToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Buscar por código, producto o insumos..."
      >
        <select
          value={estadoFilter}
          onChange={(e) => setEstadoFilter(e.target.value)}
          className="px-4 py-2 border border-input bg-input-background rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="Todos">Todos los estados</option>
          <option value="Vigente">Vigente</option>
          <option value="En Revisión">En Revisión</option>
        </select>
      </RecordsFilterToolbar>

      {/* Tabla Estandarizada */}
      <RecordsTable
        columns={[
          { key: 'id_ficha', label: 'Código' },
          { key: 'nombre', label: 'Producto Estándar' },
          { key: 'tiempo', label: 'Versión' },
          { key: 'rendimiento', label: 'Rendimiento Esperado' },
          { key: 'insumos', label: 'Insumos Clave' },
          { key: 'estado', label: 'Estado' },
          { key: 'acciones', label: 'Acciones' },
        ]}
        data={pagination.paginatedData}
        rowKey={(ficha) => ficha.id_ficha}
        emptyMessage="No se encontraron fichas técnicas."
        renderRow={(ficha) => (
          <>
                  <td className="px-6 py-4 font-mono font-medium">{ficha.id_ficha}</td><td className="px-6 py-4 font-semibold">{ficha.nombre}</td><td className="px-6 py-4">{ficha.tiempo_estimado_minutos}</td><td className="px-6 py-4">{ficha.rendimiento_lote}</td><td className="px-6 py-4 text-muted-foreground max-w-xs truncate">{ficha.descripcion}</td>
                  <td className="px-6 py-4">
                    <StatusSwitch value={ficha.estado} />
                  </td>
                  <td className="px-6 py-4">
                    <RowActions actions={[
                      { key: 'view', icon: Eye, title: 'Ver detalle', onClick: () => setDetailModal({ isOpen: true, data: ficha }) },
                      { key: 'edit', icon: Edit, title: 'Editar', onClick: () => setShowModal(true), disabled: !can('fichas-tecnicas', 'editar') },
                      { key: 'delete', icon: Trash2, title: 'Eliminar', onClick: () => setDeleteDialog({ isOpen: true, id: ficha.id_ficha, nombre: ficha.nombre }), disabled: !can('fichas-tecnicas', 'eliminar'), className: 'p-2 hover:bg-muted rounded-lg text-destructive' },
                    ]} />
                  </td>
          </>
        )}
      />

      {/* Modal de Detalle */}
      <DetailModal open={detailModal.isOpen && Boolean(detailModal.data)} title="Detalle de Ficha Técnica" onClose={() => setDetailModal({ isOpen: false, data: null })} className="border border-border space-y-4" contentClassName="space-y-2 text-sm">
        {detailModal.data && <><p><strong>ID:</strong> {detailModal.data.id_ficha}</p><p><strong>Nombre:</strong> {detailModal.data.nombre}</p><p><strong>Descripción:</strong> {detailModal.data.descripcion}</p><p><strong>Instrucciones:</strong> {detailModal.data.instrucciones_preparacion}</p><p><strong>Tiempo:</strong> {detailModal.data.tiempo_estimado_minutos}</p><p><strong>Rendimiento:</strong> {detailModal.data.rendimiento_lote}</p><p><strong>Estado:</strong> {detailModal.data.estado}</p></>}
      </DetailModal>

      <PaginationControls {...pagination} />

      <FichaTecnicaFormModal open={showModal} onClose={() => setShowModal(false)} />

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        title="Eliminar Ficha Técnica"
        message={`¿Estás seguro de que deseas eliminar la ficha técnica "${deleteDialog.nombre}"? Esta acción no se puede deshacer.`}
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

