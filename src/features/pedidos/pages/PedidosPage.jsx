import { useState, useMemo } from 'react';
import { ClipboardList, CheckCircle, Truck, DollarSign } from 'lucide-react';
import { usePedidos } from '../hooks/usePedidos';
import { DataTable } from '../../../shared/components/DataTable';
import { RowActions } from '../../../shared/components/RowActions';
import { PedidoFormModal } from '../components/PedidoFormModal';
import ConfirmDialog from '../../../shared/components/ConfirmDialog';
import Toast from '../../../shared/components/Toast';
import DetailModal from '../../../shared/components/DetailModal';
import PageHeader from '../../../shared/components/PageHeader';
import { MetricCard } from '../../../shared/components/MetricCard';
import { usePermissions } from '../../../shared/contexts/PermissionContext';
import StatusSwitch from '../../../shared/components/StatusSwitch';

export default function PedidosPage() {
  const { can } = usePermissions();
  const {
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
    isSaving,
    toast,
    setToast,
    handleSave,
    handleDelete,
  } = usePedidos();

  const [selectedPedido, setSelectedPedido] = useState(null);

  const totalPedidos = rawPedidos.length;
  const entregados = rawPedidos.filter((p) => String(p.estado).toLowerCase() === 'entregado').length;
  const enCamino = rawPedidos.filter((p) => String(p.estado).toLowerCase() === 'en camino' || String(p.estado).toLowerCase() === 'pendiente').length;
  const totalFacturado = rawPedidos.reduce((acc, p) => acc + (p.totalNum || p.valor_total || 0), 0);

  const filteredData = useMemo(() => {
    return rawPedidos.filter((p) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        String(p.id_pedido).toLowerCase().includes(q) ||
        String(p.id_cliente).toLowerCase().includes(q) ||
        (p.observaciones || '').toLowerCase().includes(q);

      const isTodosEstado = estadoFilter === 'Todos' || estadoFilter === 'Todos los estados';
      const matchesEstado =
        isTodosEstado || String(p.estado).toLowerCase() === estadoFilter.toLowerCase();

      return matchesSearch && matchesEstado;
    });
  }, [rawPedidos, searchQuery, estadoFilter]);

  const columns = useMemo(
    () => [
      {
        key: 'id_pedido',
        label: 'ID',
        render: (value) => <span className="font-mono font-medium">{value}</span>,
      },
      {
        key: 'id_cliente',
        label: 'Cliente ID',
        render: (value) => <span>{value}</span>,
      },
      {
        key: 'id_sede',
        label: 'Sede ID',
        render: (value) => <span>{value}</span>,
      },
      {
        key: 'id_usuario',
        label: 'Usuario ID',
        render: (value) => <span>{value}</span>,
      },
      {
        key: 'fecha_pedido',
        label: 'Fecha Pedido',
        render: (value) => <span className="text-muted-foreground">{value}</span>,
      },
      {
        key: 'fecha_entrega',
        label: 'Fecha Entrega',
        render: (value) => <span className="text-muted-foreground">{value}</span>,
      },
      {
        key: 'valor_total',
        label: 'Valor Total',
        render: (value) => (
          <span className="font-semibold">
            ${Number(value || 0).toLocaleString('es-CO')}
          </span>
        ),
      },
      {
        key: 'estado',
        label: 'Estado',
        render: (value) => <StatusSwitch value={value} />,
      },
      {
        key: 'acciones',
        label: 'Acciones',
        render: (_, pedido) => (
          <RowActions
            onView={() => setDetailModal({ isOpen: true, data: pedido })}
            onEdit={() => {
              setSelectedPedido(pedido);
              setShowModal(true);
            }}
            editDisabled={!can('pedidos', 'editar')}
            onDelete={() =>
              setDeleteDialog({
                isOpen: true,
                id: pedido.id_pedido,
                nombre: `Pedido #${pedido.id_pedido}`,
              })
            }
            deleteDisabled={!can('pedidos', 'eliminar')}
          />
        ),
      },
    ],
    [can, setDetailModal, setShowModal, setDeleteDialog]
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pedidos de Clientes"
        subtitle="Despachos y pedidos para cadenas, supermercados y distribución de Masarepas"
        addLabel="Nuevo Pedido"
        addDisabled={!can('pedidos', 'crear')}
        onAdd={() => {
          setSelectedPedido(null);
          setShowModal(true);
        }}
      />

      {/* Tarjetas de Consolidado */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard title="Total Pedidos" value={totalPedidos} icon={ClipboardList} variant="primary" />
        <MetricCard title="Entregados" value={entregados} icon={CheckCircle} variant="success" />
        <MetricCard title="En Camino" value={enCamino} icon={Truck} variant="warning" />
        <MetricCard title="Valor Facturado" value={`$${totalFacturado.toLocaleString('es-CO')}`} icon={DollarSign} variant="accent" />
      </div>

      {/* Tabla con DataTable */}
      <DataTable
        columns={columns}
        data={filteredData}
        searchPlaceholder="Buscar por número, cliente o observaciones..."
        filters={
          <select
            value={estadoFilter}
            onChange={(e) => setEstadoFilter(e.target.value)}
            className="px-4 py-2 border border-input bg-input-background rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="Todos">Todos los estados</option>
            <option value="Entregado">Entregado</option>
            <option value="En Camino">En Camino</option>
            <option value="Pendiente">Pendiente</option>
            <option value="Cancelado">Cancelado</option>
          </select>
        }
      />

      <DetailModal
        isOpen={detailModal.isOpen}
        onClose={() => setDetailModal({ isOpen: false, data: null })}
        title="Detalle del Pedido"
        fields={detailModal.data ? [
          { label: 'ID', value: detailModal.data.id_pedido },
          { label: 'Cliente ID', value: detailModal.data.id_cliente },
          { label: 'Sede ID', value: detailModal.data.id_sede },
          { label: 'Usuario ID', value: detailModal.data.id_usuario },
          { label: 'Fecha Pedido', value: detailModal.data.fecha_pedido },
          { label: 'Fecha Entrega', value: detailModal.data.fecha_entrega },
          { label: 'Valor Total', value: `$${Number(detailModal.data.valor_total || 0).toLocaleString('es-CO')}` },
          { label: 'Observaciones', value: detailModal.data.observaciones || 'N/A' },
          { label: 'Motivo Anulación', value: detailModal.data.motivo_anulacion || 'N/A' },
          { label: 'Estado', value: detailModal.data.estado },
        ] : []}
      />

      <PedidoFormModal
        open={showModal}
        pedido={selectedPedido}
        onSave={handleSave}
        isLoading={isSaving}
        onClose={() => {
          setShowModal(false);
          setSelectedPedido(null);
        }}
      />

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


