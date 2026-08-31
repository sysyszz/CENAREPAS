import { useState, useMemo } from 'react';
import { DollarSign, BarChart3, TrendingUp, ShoppingBag } from 'lucide-react';
import { useVentas } from '../hooks/useVentas';
import { DataTable } from '../../../shared/components/DataTable';
import { RowActions } from '../../../shared/components/RowActions';
import { VentaFormModal } from '../components/VentaFormModal';
import ConfirmDialog from '../../../shared/components/ConfirmDialog';
import Toast from '../../../shared/components/Toast';
import DetailModal from '../../../shared/components/DetailModal';
import PageHeader from '../../../shared/components/PageHeader';
import { MetricCard } from '../../../shared/components/MetricCard';
import { usePermissions } from '../../../shared/contexts/PermissionContext';
import StatusSwitch from '../../../shared/components/StatusSwitch';

export default function VentasPage() {
  const { can } = usePermissions();
  const {
    ventas,
    rawVentas,
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
    handleAnular,
  } = useVentas();

  const [selectedVenta, setSelectedVenta] = useState(null);

  const totalVentas = rawVentas.length;
  const ventasHoy = rawVentas.reduce((acc, v) => acc + (v.valor_total || 0), 0);
  const promedioVentas = totalVentas > 0 ? ventasHoy / totalVentas : 0;

  const columns = useMemo(
    () => [
      {
        key: 'id_venta',
        label: 'ID',
        render: (value) => <span className="font-mono font-medium">{value}</span>,
      },
      {
        key: 'id_sede',
        label: 'Sede ID',
        render: (value) => <span className="text-muted-foreground">{value}</span>,
      },
      {
        key: 'id_cliente',
        label: 'Cliente ID',
        render: (value) => <span className="font-medium">{value}</span>,
      },
      {
        key: 'id_usuario',
        label: 'Usuario ID',
        render: (value) => <span className="text-muted-foreground">{value}</span>,
      },
      {
        key: 'fecha_venta',
        label: 'Fecha Venta',
        render: (value) => (
          <span className="text-muted-foreground">
            {value ? new Date(value).toLocaleDateString('es-CO') : 'N/A'}
          </span>
        ),
      },
      {
        key: 'valor_total',
        label: 'Valor Total',
        render: (value) => (
          <span className="font-semibold text-primary">
            ${Number(value || 0).toLocaleString('es-CO')}
          </span>
        ),
      },
      {
        key: 'estado',
        label: 'Estado',
        render: (value) => (
          <StatusSwitch value={value} activeValue="completada" inactiveValue="anulada" />
        ),
      },
      {
        key: 'acciones',
        label: 'Acciones',
        render: (_, venta) => (
          <RowActions
            onView={() => setDetailModal({ isOpen: true, data: venta })}
            onEdit={() => {
              setSelectedVenta(venta);
              setShowModal(true);
            }}
            editDisabled={!can('ventas', 'editar')}
            onDelete={() =>
              setDeleteDialog({
                isOpen: true,
                id: venta.id_venta,
                nombre: `Venta #${venta.id_venta}`,
              })
            }
            deleteDisabled={!can('ventas', 'eliminar') || String(venta.estado).toLowerCase() === 'anulada'}
            deleteTitle="Anular Venta"
          />
        ),
      },
    ],
    [can, setDetailModal, setShowModal, setDeleteDialog]
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Ventas"
        subtitle="Registro de ventas realizadas en Masarepas"
        addLabel="Nueva Venta"
        addDisabled={!can('ventas', 'crear')}
        onAdd={() => {
          setSelectedVenta(null);
          setShowModal(true);
        }}
      />

      {/* Tarjetas de consolidado */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard title="Ventas Totales ($)" value={`$${ventasHoy.toLocaleString('es-CO')}`} icon={DollarSign} variant="success" />
        <MetricCard title="Total Registros" value={`${totalVentas} ventas`} icon={BarChart3} variant="primary" />
        <MetricCard title="Promedio Ticket" value={`$${Math.round(promedioVentas).toLocaleString('es-CO')}`} icon={TrendingUp} variant="accent" />
        <MetricCard title="Completadas" value={rawVentas.filter((v) => String(v.estado).toLowerCase() === 'completada').length} icon={ShoppingBag} variant="warning" />
      </div>

      {/* Tabla con DataTable */}
      <DataTable
        columns={columns}
        data={ventas}
        searchPlaceholder="Buscar por ID, cliente, sede o medio de pago..."
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        filters={
          <select
            value={estadoFilter}
            onChange={(e) => setEstadoFilter(e.target.value)}
            className="px-4 py-2 border border-input bg-input-background rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="Todos">Todos los estados</option>
            <option value="completada">Completada</option>
            <option value="anulada">Anulada</option>
          </select>
        }
      />

      <DetailModal
        isOpen={detailModal.isOpen}
        onClose={() => setDetailModal({ isOpen: false, data: null })}
        title="Detalle de la Venta"
        fields={detailModal.data ? [
          { label: 'ID Venta', value: detailModal.data.id_venta },
          { label: 'Sede ID', value: detailModal.data.id_sede },
          { label: 'Cliente ID', value: detailModal.data.id_cliente },
          { label: 'Usuario ID', value: detailModal.data.id_usuario },
          { label: 'Pedido ID', value: detailModal.data.id_pedido || 'N/A' },
          { label: 'Fecha Venta', value: detailModal.data.fecha_venta },
          { label: 'Medio de Pago', value: detailModal.data.medio_pago },
          { label: 'Valor Total', value: `$${Number(detailModal.data.valor_total || 0).toLocaleString('es-CO')}` },
          { label: 'Estado', value: detailModal.data.estado },
        ] : []}
      />

      <VentaFormModal
        open={showModal}
        venta={selectedVenta}
        onSave={handleSave}
        isLoading={isSaving}
        onClose={() => {
          setShowModal(false);
          setSelectedVenta(null);
        }}
      />

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        title="Anular Venta"
        message={`¿Estás seguro de que deseas anular la venta "${deleteDialog.nombre}"? Esta acción no se puede deshacer.`}
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

