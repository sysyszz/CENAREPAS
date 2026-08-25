import { Plus, Eye, Edit, Trash2, FileDown, FileSpreadsheet, UserCircle, CheckCircle, ShoppingBag, DollarSign } from 'lucide-react';
import { useClientes } from '../hooks/useClientes';
import { usePagination } from '../../../shared/hooks/usePagination';
import { PaginationControls } from '../../../shared/components/PaginationControls';
import RecordsFilterToolbar from '../../../shared/components/RecordsFilterToolbar';
import { ClienteFormModal } from '../components/ClienteFormModal';
import ConfirmDialog from '../../../shared/components/ConfirmDialog';
import Toast from '../../../shared/components/Toast';
import { usePermissions } from '../../../shared/contexts/PermissionContext';
import StatusSwitch from '../../../shared/components/StatusSwitch';
import RowActions from '../../../shared/components/RowActions';
import RecordsTable from '../../../shared/components/RecordsTable';
import DetailModal from '../../../shared/components/DetailModal';
import StatCard from '../../../shared/components/StatCard';
import StatsGrid from '../../../shared/components/StatsGrid';

export default function ClientesPage() {
  const { can } = usePermissions();
  const {
    clientes,
    rawClientes,
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
  } = useClientes();
  const pagination = usePagination(clientes);

  const totalClientes = rawClientes.length;
  const activos = rawClientes.filter((c) => c.estado === 'Activo').length;
  const totalPedidosHistorico = 0;
  const totalFacturadoHistorico = 0;

  return (
    <div className="space-y-6">
      {/* Header con exportación */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Clientes</h1>
          <p className="text-muted-foreground">Directorio y facturación histórica de clientes de Masarepas</p>
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
            onClick={() => setShowModal(true)} disabled={!can('clientes', 'crear')}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nuevo Cliente
          </button>
        </div>
      </div>

      {/* Tarjetas de Consolidado */}
      <StatsGrid className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard variant="compact" label="Total Clientes" value={totalClientes} icon={UserCircle} iconColor="hsl(var(--primary))" iconBackground="hsl(var(--primary) / 0.1)" />
        <StatCard variant="compact" label="Clientes Activos" value={activos} icon={CheckCircle} iconColor="hsl(var(--success))" iconBackground="hsl(var(--success) / 0.1)" />
        <StatCard variant="compact" label="Pedidos Históricos" value={totalPedidosHistorico} icon={ShoppingBag} iconColor="hsl(var(--primary))" iconBackground="hsl(var(--accent) / 0.1)" />
        <StatCard variant="compact" label="Facturación Total" value={`$${totalFacturadoHistorico.toLocaleString('es-CO')}`} icon={DollarSign} iconColor="hsl(var(--warning))" iconBackground="hsl(var(--warning) / 0.1)" />
      </StatsGrid>

      {/* Filtros y Búsqueda */}
      <RecordsFilterToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Buscar por código, nombre, NIT o ciudad..."
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

      {/* Tabla Estandarizada */}
      <RecordsTable
        columns={[
          { key: 'id_cliente', label: 'ID' },
          { key: 'nombre', label: 'Cliente / Razón Social' },
          { key: 'documento', label: 'Documento' },
          { key: 'telefono', label: 'Teléfono' },
          { key: 'correo', label: 'Correo' },
          { key: 'direccion', label: 'Dirección' },
          { key: 'estado', label: 'Estado' },
          { key: 'acciones', label: 'Acciones' },
        ]}
        data={pagination.paginatedData}
        rowKey={(cliente) => cliente.id_cliente}
        emptyMessage="No se encontraron clientes."
        renderRow={(cliente) => (
          <>
                  <td className="px-6 py-4 font-mono font-medium">{cliente.id_cliente}</td>
                  <td className="px-6 py-4 font-semibold">{cliente.nombre}</td>
                  <td className="px-6 py-4 text-muted-foreground">{cliente.documento}</td>
                  <td className="px-6 py-4 text-muted-foreground">{cliente.telefono}</td>
                  <td className="px-6 py-4 text-muted-foreground">{cliente.correo}</td>
                  <td className="px-6 py-4 text-muted-foreground">{cliente.direccion}</td>
                  <td className="px-6 py-4">
                    <StatusSwitch value={cliente.estado} />
                  </td>
                  <td className="px-6 py-4">
                    <RowActions actions={[
                      { key: 'view', icon: Eye, title: 'Ver detalle', onClick: () => setDetailModal({ isOpen: true, data: cliente }) },
                      { key: 'edit', icon: Edit, title: 'Editar', onClick: () => setShowModal(true), disabled: !can('clientes', 'editar') },
                      { key: 'delete', icon: Trash2, title: 'Eliminar', onClick: () => setDeleteDialog({ isOpen: true, id: cliente.id_cliente, nombre: cliente.nombre }), disabled: !can('clientes', 'eliminar'), className: 'p-2 hover:bg-muted rounded-lg text-destructive' },
                    ]} />
                  </td>
          </>
        )}
      />

      <PaginationControls {...pagination} />

      {/* Modal de Detalle */}
      <DetailModal
        open={detailModal.isOpen && Boolean(detailModal.data)}
        title="Detalle del Cliente"
        onClose={() => setDetailModal({ isOpen: false, data: null })}
        className="border border-border space-y-4"
        contentClassName="space-y-2 text-sm"
      >
        {detailModal.data && (
          <>
            <p><strong>ID:</strong> {detailModal.data.id_cliente}</p>
            <p><strong>Cliente:</strong> {detailModal.data.nombre}</p>
            <p><strong>Documento:</strong> {detailModal.data.documento}</p>
            <p><strong>Teléfono:</strong> {detailModal.data.telefono}</p>
            <p><strong>Correo:</strong> {detailModal.data.correo}</p>
            <p><strong>Dirección:</strong> {detailModal.data.direccion}</p>
            <p><strong>Fecha de Creación:</strong> {detailModal.data.fecha_creacion}</p>
            <p><strong>Estado:</strong> {detailModal.data.estado}</p>
          </>
        )}
      </DetailModal>

      <ClienteFormModal open={showModal} onClose={() => setShowModal(false)} />

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        title="Eliminar Cliente"
        message={`¿Estás seguro de que deseas eliminar al cliente "${deleteDialog.nombre}"? Esta acción no se puede deshacer.`}
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

