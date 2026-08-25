import { Plus, Eye, Edit, Trash2, FileDown, FileSpreadsheet, ClipboardList, CheckCircle, Truck, DollarSign } from 'lucide-react';
import { usePedidos } from '../hooks/usePedidos';
import { usePagination } from '../../../shared/hooks/usePagination';
import { PaginationControls } from '../../../shared/components/PaginationControls';
import { PedidoFormModal } from '../components/PedidoFormModal';
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

export default function PedidosPage() {
  const { can } = usePermissions();
  const {
    pedidos,
    rawPedidos,
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
  } = usePedidos();
  const pagination = usePagination(pedidos);

  const totalPedidos = rawPedidos.length;
  const entregados = rawPedidos.filter((p) => p.estado === 'Entregado').length;
  const enCamino = rawPedidos.filter((p) => p.estado === 'En Camino').length;
  const totalFacturado = rawPedidos.reduce((acc, p) => acc + (p.totalNum || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header con exportación */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Pedidos de Clientes</h1>
          <p className="text-muted-foreground">Despachos y pedidos para cadenas, supermercados y distribución de Masarepas</p>
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
            onClick={() => setShowModal(true)} disabled={!can('pedidos', 'crear')}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nuevo Pedido
          </button>
        </div>
      </div>

      {/* Tarjetas de Consolidado */}
      <StatsGrid className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard variant="compact" label="Total Pedidos" value={totalPedidos} icon={ClipboardList} iconColor="hsl(var(--primary))" iconBackground="hsl(var(--primary) / 0.1)" />
        <StatCard variant="compact" label="Entregados" value={entregados} icon={CheckCircle} iconColor="hsl(var(--success))" iconBackground="hsl(var(--success) / 0.1)" />
        <StatCard variant="compact" label="En Camino" value={enCamino} icon={Truck} iconColor="hsl(var(--warning))" iconBackground="hsl(var(--warning) / 0.1)" />
        <StatCard variant="compact" label="Valor Facturado" value={`$${totalFacturado.toLocaleString('es-CO')}`} icon={DollarSign} iconColor="hsl(var(--primary))" iconBackground="hsl(var(--accent) / 0.1)" />
      </StatsGrid>

      {/* Filtros y Búsqueda */}
      <RecordsFilterToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Buscar por número, cliente o resumen de productos..."
      >
        <select
          value={estadoFilter}
          onChange={(e) => setEstadoFilter(e.target.value)}
          className="px-4 py-2 border border-input bg-input-background rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="Todos">Todos los estados</option>
          <option value="Entregado">Entregado</option>
          <option value="En Camino">En Camino</option>
          <option value="Pendiente">Pendiente</option>
        </select>
      </RecordsFilterToolbar>

      {/* Tabla Estandarizada */}
      <RecordsTable
        columns={[
          { key: 'id_pedido', label: 'ID' },
          { key: 'id_cliente', label: 'Cliente ID' },
          { key: 'id_sede', label: 'Sede ID' },
          { key: 'id_usuario', label: 'Usuario ID' },
          { key: 'fecha_pedido', label: 'Fecha Pedido' },
          { key: 'fecha_entrega', label: 'Fecha Entrega' },
          { key: 'valor_total', label: 'Valor Total' },
          { key: 'estado', label: 'Estado' },
          { key: 'acciones', label: 'Acciones' },
        ]}
        data={pagination.paginatedData}
        rowKey={(pedido) => pedido.id_pedido}
        emptyMessage="No se encontraron pedidos."
        renderRow={(pedido) => (
          <>
                  <td className="px-6 py-4 font-mono font-medium">{pedido.id_pedido}</td><td className="px-6 py-4">{pedido.id_cliente}</td><td className="px-6 py-4">{pedido.id_sede}</td><td className="px-6 py-4">{pedido.id_usuario}</td><td className="px-6 py-4">{pedido.fecha_pedido}</td><td className="px-6 py-4">{pedido.fecha_entrega}</td><td className="px-6 py-4 font-semibold">{pedido.valor_total}</td>
                  <td className="px-6 py-4">
                    <StatusSwitch value={pedido.estado} />
                  </td>
                  <td className="px-6 py-4">
                    <RowActions actions={[
                      { key: 'view', icon: Eye, title: 'Ver detalle', onClick: () => setDetailModal({ isOpen: true, data: pedido }) },
                      { key: 'edit', icon: Edit, title: 'Editar', onClick: () => setShowModal(true), disabled: !can('pedidos', 'editar') },
                      { key: 'delete', icon: Trash2, title: 'Eliminar pedido', onClick: () => setDeleteDialog({ isOpen: true, id: pedido.id_pedido, nombre: pedido.id_pedido }), disabled: !can('pedidos', 'eliminar'), className: 'p-2 hover:bg-muted rounded-lg text-destructive' },
                    ]} />
                  </td>
          </>
        )}
      />

      {/* Modal de Detalle */}
      <DetailModal open={detailModal.isOpen && Boolean(detailModal.data)} title="Detalle del Pedido" onClose={() => setDetailModal({ isOpen: false, data: null })} className="border border-border space-y-4" contentClassName="space-y-2 text-sm">
        {detailModal.data && <><p><strong>ID:</strong> {detailModal.data.id_pedido}</p><p><strong>Cliente ID:</strong> {detailModal.data.id_cliente}</p><p><strong>Sede ID:</strong> {detailModal.data.id_sede}</p><p><strong>Usuario ID:</strong> {detailModal.data.id_usuario}</p><p><strong>Fecha Pedido:</strong> {detailModal.data.fecha_pedido}</p><p><strong>Fecha Entrega:</strong> {detailModal.data.fecha_entrega}</p><p><strong>Valor Total:</strong> {detailModal.data.valor_total}</p><p><strong>Observaciones:</strong> {detailModal.data.observaciones}</p><p><strong>Motivo Anulación:</strong> {detailModal.data.motivo_anulacion}</p><p><strong>Estado:</strong> {detailModal.data.estado}</p></>}
      </DetailModal>

      <PaginationControls {...pagination} />

      <PedidoFormModal open={showModal} onClose={() => setShowModal(false)} />

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        title="Eliminar Pedido"
        message={`¿Estás seguro de que deseas eliminar el pedido "${deleteDialog.nombre}"? Esta acción no se puede deshacer.`}
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

