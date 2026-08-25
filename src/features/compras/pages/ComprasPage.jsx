import { Plus, Eye, Edit, XCircle, FileDown, FileSpreadsheet, ShoppingCart, CheckCircle, Clock, DollarSign } from 'lucide-react';
import { useCompras } from '../hooks/useCompras';
import { usePagination } from '../../../shared/hooks/usePagination';
import { PaginationControls } from '../../../shared/components/PaginationControls';
import RecordsFilterToolbar from '../../../shared/components/RecordsFilterToolbar';
import { CompraFormModal } from '../components/CompraFormModal';
import ConfirmDialog from '../../../shared/components/ConfirmDialog';
import Toast from '../../../shared/components/Toast';
import { usePermissions } from '../../../shared/contexts/PermissionContext';
import StatusSwitch from '../../../shared/components/StatusSwitch';
import RowActions from '../../../shared/components/RowActions';
import RecordsTable from '../../../shared/components/RecordsTable';
import DetailModal from '../../../shared/components/DetailModal';
import StatsGrid from '../../../shared/components/StatsGrid';
import StatCard from '../../../shared/components/StatCard';

export default function ComprasPage() {
  const { can } = usePermissions();
  const {
    compras,
    rawCompras,
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
  } = useCompras();
  const pagination = usePagination(compras);

  const totalCompras = rawCompras.length;
  const recibidas = rawCompras.filter((c) => c.estado === 'Recibida').length;
  const pendientes = rawCompras.filter((c) => c.estado === 'Pendiente').length;
  const totalInvertido = rawCompras.reduce((acc, c) => acc + (c.totalNum || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header con exportación */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Compras de Insumos</h1>
          <p className="text-muted-foreground">Órdenes de compra de materias primas e insumos a proveedores</p>
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
            onClick={() => setShowModal(true)} disabled={!can('compras', 'crear')}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nueva Compra
          </button>
        </div>
      </div>

      {/* Tarjetas de Consolidado */}
      <StatsGrid className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard variant="compact" label="Total Compras" value={totalCompras} icon={ShoppingCart} iconColor="hsl(var(--primary))" iconBackground="hsl(var(--primary) / 0.1)" />
        <StatCard variant="compact" label="Recibidas" value={recibidas} icon={CheckCircle} iconColor="hsl(var(--success))" iconBackground="hsl(var(--success) / 0.1)" />
        <StatCard variant="compact" label="Pendientes" value={pendientes} icon={Clock} iconColor="hsl(var(--warning))" iconBackground="hsl(var(--warning) / 0.1)" />
        <StatCard variant="compact" label="Total Invertido" value={`$${totalInvertido.toLocaleString('es-CO')}`} icon={DollarSign} iconColor="hsl(var(--primary))" iconBackground="hsl(var(--accent) / 0.1)" />
      </StatsGrid>

      {/* Filtros y Búsqueda */}
      <RecordsFilterToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Buscar por código, proveedor o insumo..."
      >
        <select
          value={estadoFilter}
          onChange={(e) => setEstadoFilter(e.target.value)}
          className="px-4 py-2 border border-input bg-input-background rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="Todos">Todos los estados</option>
          <option value="Recibida">Recibida</option>
          <option value="Pendiente">Pendiente</option>
          <option value="Anulada">Anulada</option>
        </select>
      </RecordsFilterToolbar>

      {/* Tabla Estandarizada */}
      <RecordsTable
        columns={[
          { key: 'id_compra', label: 'ID' },
          { key: 'id_proveedor', label: 'Proveedor ID' },
          { key: 'id_usuario', label: 'Usuario ID' },
          { key: 'fecha_compra', label: 'Fecha Compra' },
          { key: 'valor_total', label: 'Valor Total' },
          { key: 'estado', label: 'Estado' },
          { key: 'acciones', label: 'Acciones' },
        ]}
        data={pagination.paginatedData}
        rowKey={(compra) => compra.id_compra}
        emptyMessage="No se encontraron compras."
        renderRow={(compra) => (
          <>
                  <td className="px-6 py-4 font-mono font-medium">{compra.id_compra}</td><td className="px-6 py-4">{compra.id_proveedor}</td><td className="px-6 py-4">{compra.id_usuario}</td><td className="px-6 py-4">{compra.fecha_compra}</td><td className="px-6 py-4 font-semibold">{compra.valor_total}</td>
                  <td className="px-6 py-4">
                    <StatusSwitch value={compra.estado} />
                  </td>
                  <td className="px-6 py-4">
                    <RowActions actions={[
                      { key: 'view', icon: Eye, title: 'Ver detalle', onClick: () => setDetailModal({ isOpen: true, data: compra }) },
                      { key: 'edit', icon: Edit, title: 'Editar', onClick: () => setShowModal(true), disabled: !can('compras', 'editar') },
                      { key: 'cancel', icon: XCircle, title: 'Anular compra', onClick: () => setDeleteDialog({ isOpen: true, id: compra.id_compra, nombre: compra.id_compra }), disabled: !can('compras', 'eliminar'), hidden: compra.estado === 'Anulada', className: 'p-2 hover:bg-muted rounded-lg text-destructive' },
                    ]} />
                  </td>
          </>
        )}
      />

      {/* Modal de Detalle */}
      <DetailModal
        open={detailModal.isOpen && Boolean(detailModal.data)}
        title="Detalle de la Compra"
        onClose={() => setDetailModal({ isOpen: false, data: null })}
        className="border border-border space-y-4"
        contentClassName="space-y-2 text-sm"
      >
        {detailModal.data && (
          <>
            <p><strong>ID:</strong> {detailModal.data.id_compra}</p><p><strong>Proveedor ID:</strong> {detailModal.data.id_proveedor}</p><p><strong>Usuario ID:</strong> {detailModal.data.id_usuario}</p><p><strong>Fecha:</strong> {detailModal.data.fecha_compra}</p><p><strong>Valor Total:</strong> {detailModal.data.valor_total}</p><p><strong>Medio de Pago:</strong> {detailModal.data.medio_pago}</p><p><strong>Comprobante:</strong> {detailModal.data.comprobante_url}</p><p><strong>Fecha Registro:</strong> {detailModal.data.fecha_registro}</p>
            <p><strong>Estado:</strong> {detailModal.data.estado}</p>
          </>
        )}
      </DetailModal>

      <PaginationControls {...pagination} />

      <CompraFormModal open={showModal} onClose={() => setShowModal(false)} />

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        title="Anular Compra"
        message={`¿Estás seguro de que deseas anular la compra "${deleteDialog.nombre}"? Esta acción no se puede deshacer.`}
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

