import { Plus, Eye, Edit, XCircle, FileDown, FileSpreadsheet, Factory, CheckCircle, Clock, Calendar } from 'lucide-react';
import { useProduccion } from '../hooks/useProduccion';
import { usePagination } from '../../../shared/hooks/usePagination';
import { PaginationControls } from '../../../shared/components/PaginationControls';
import { ProduccionFormModal } from '../components/ProduccionFormModal';
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

export default function ProduccionPage() {
  const { can } = usePermissions();
  const {
    lotes,
    rawLotes,
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
    handleAnular,
  } = useProduccion();
  const pagination = usePagination(lotes);

  const totalLotes = rawLotes.length;
  const finalizados = rawLotes.filter((l) => l.estado === 'Finalizado').length;
  const enProceso = rawLotes.filter((l) => l.estado === 'En Proceso').length;
  const programados = rawLotes.filter((l) => l.estado === 'Programado').length;

  return (
    <div className="space-y-6">
      {/* Header con exportación */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Producción de Arepas</h1>
          <p className="text-muted-foreground">Control de lotes, molienda y empaque en planta Masarepas</p>
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
            onClick={() => setShowModal(true)} disabled={!can('produccion', 'crear')}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            Registrar Lote
          </button>
        </div>
      </div>

      {/* Tarjetas de Consolidado */}
      <StatsGrid className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard variant="compact" label="Total Lotes" value={totalLotes} icon={Factory} iconColor="hsl(var(--primary))" iconBackground="hsl(var(--primary) / 0.1)" />
        <StatCard variant="compact" label="Finalizados" value={finalizados} icon={CheckCircle} iconColor="hsl(var(--success))" iconBackground="hsl(var(--success) / 0.1)" />
        <StatCard variant="compact" label="En Proceso" value={enProceso} icon={Clock} iconColor="hsl(var(--warning))" iconBackground="hsl(var(--warning) / 0.1)" />
        <StatCard variant="compact" label="Programados" value={programados} icon={Calendar} iconColor="hsl(var(--primary))" iconBackground="hsl(var(--accent) / 0.1)" />
      </StatsGrid>

      {/* Filtros y Búsqueda */}
      <RecordsFilterToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Buscar por ID de lote, ficha o usuario responsable..."
      >
        <select
          value={estadoFilter}
          onChange={(e) => setEstadoFilter(e.target.value)}
          className="px-4 py-2 border border-input bg-input-background rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="Todos">Todos los estados</option>
          <option value="Finalizado">Finalizado</option>
          <option value="En Proceso">En Proceso</option>
          <option value="Programado">Programado</option>
          <option value="Anulado">Anulado</option>
        </select>
      </RecordsFilterToolbar>

      {/* Tabla Estandarizada */}
      <RecordsTable
        columns={[
          { key: 'id_lote', label: 'Código Lote' },
          { key: 'id_ficha', label: 'Producto' },
          { key: 'cantidad_programada', label: 'Cantidad Prog.' },
          { key: 'cantidad_producida', label: 'Obtenida' },
          { key: 'fecha_produccion', label: 'Fecha' },
          { key: 'id_usuario_responsable', label: 'Usuario Responsable' },
          { key: 'estado', label: 'Estado' },
          { key: 'acciones', label: 'Acciones' },
        ]}
        data={pagination.paginatedData}
        rowKey={(lote) => lote.id_lote}
        emptyMessage="No se encontraron lotes de producción."
        renderRow={(lote) => (
          <>
                  <td className="px-6 py-4 font-mono font-medium">{lote.id_lote}</td><td className="px-6 py-4">{lote.id_ficha}</td><td className="px-6 py-4">{lote.id_usuario_responsable}</td><td className="px-6 py-4">{lote.cantidad_producida}</td><td className="px-6 py-4 text-muted-foreground">{lote.fecha_produccion}</td>
                  <td className="px-6 py-4">
                    <StatusSwitch value={lote.estado} />
                  </td>
                  <td className="px-6 py-4">
                    <RowActions actions={[
                      { key: 'view', icon: Eye, title: 'Ver detalle', onClick: () => setDetailModal({ isOpen: true, data: lote }) },
                      { key: 'edit', icon: Edit, title: 'Editar', onClick: () => setShowModal(true), disabled: !can('produccion', 'editar') },
                      { key: 'cancel', icon: XCircle, title: 'Anular Lote', onClick: () => setDeleteDialog({ isOpen: true, id: lote.id_lote, nombre: lote.id_lote }), disabled: !can('produccion', 'eliminar'), hidden: lote.estado === 'Anulado', className: 'p-2 hover:bg-muted rounded-lg text-destructive' },
                    ]} />
                  </td>
          </>
        )}
      />

      {/* Modal de Detalle */}
      <DetailModal open={detailModal.isOpen && Boolean(detailModal.data)} title="Detalle del Lote de Producción" onClose={() => setDetailModal({ isOpen: false, data: null })} className="border border-border space-y-4" contentClassName="space-y-2 text-sm">
        {detailModal.data && <><p><strong>ID:</strong> {detailModal.data.id_lote}</p><p><strong>Ficha ID:</strong> {detailModal.data.id_ficha}</p><p><strong>Usuario Responsable ID:</strong> {detailModal.data.id_usuario_responsable}</p><p><strong>Fecha:</strong> {detailModal.data.fecha_produccion}</p><p><strong>Cantidad:</strong> {detailModal.data.cantidad_producida}</p><p><strong>Observaciones:</strong> {detailModal.data.observaciones}</p><p><strong>Estado:</strong> {detailModal.data.estado}</p></>}
      </DetailModal>

      <PaginationControls {...pagination} />

      <ProduccionFormModal open={showModal} onClose={() => setShowModal(false)} />

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        title="Anular Lote de Producción"
        message={`¿Estás seguro de que deseas anular el lote "${deleteDialog.nombre}"? Esta acción no se puede deshacer.`}
        confirmText="Anular"
        onConfirm={handleAnular}
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

