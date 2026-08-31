import { useState, useMemo } from 'react';
import { ShoppingCart, CheckCircle, Clock, DollarSign } from 'lucide-react';
import { useCompras } from '../hooks/useCompras';
import { DataTable } from '../../../shared/components/DataTable';
import { RowActions } from '../../../shared/components/RowActions';
import { CompraFormModal } from '../components/CompraFormModal';
import ConfirmDialog from '../../../shared/components/ConfirmDialog';
import Toast from '../../../shared/components/Toast';
import DetailModal from '../../../shared/components/DetailModal';
import PageHeader from '../../../shared/components/PageHeader';
import { MetricCard } from '../../../shared/components/MetricCard';
import { usePermissions } from '../../../shared/contexts/PermissionContext';
import StatusSwitch from '../../../shared/components/StatusSwitch';

export default function ComprasPage() {
  const { can } = usePermissions();
  const {
    rawCompras,
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
  } = useCompras();

  const [selectedCompra, setSelectedCompra] = useState(null);

  const totalCompras = rawCompras.length;
  const recibidas = rawCompras.filter(
    (c) => String(c.estado).toLowerCase() === 'recibida' || String(c.estado).toLowerCase() === 'activo'
  ).length;
  const pendientes = rawCompras.filter(
    (c) => String(c.estado).toLowerCase() === 'pendiente'
  ).length;
  const totalInvertido = rawCompras.reduce(
    (acc, c) => acc + (c.totalNum || c.valor_total || 0),
    0
  );

  const filteredData = useMemo(() => {
    return rawCompras.filter((c) => {
      const isTodos = estadoFilter === 'Todos' || estadoFilter === 'Todos los estados';
      if (isTodos) return true;
      return String(c.estado).toLowerCase() === estadoFilter.toLowerCase();
    });
  }, [rawCompras, estadoFilter]);

  const columns = useMemo(
    () => [
      {
        key: 'id_compra',
        label: 'ID',
        render: (value) => <span className="font-mono font-medium">{value}</span>,
      },
      {
        key: 'id_proveedor',
        label: 'Proveedor ID',
        render: (value) => value,
      },
      {
        key: 'id_usuario',
        label: 'Usuario ID',
        render: (value) => value,
      },
      {
        key: 'fecha_compra',
        label: 'Fecha Compra',
        render: (value) => value,
      },
      {
        key: 'valor_total',
        label: 'Valor Total',
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
        render: (_, compra) => {
          const isAnulada =
            String(compra.estado).toLowerCase() === 'anulada' ||
            String(compra.estado).toLowerCase() === 'anulado';
          return (
            <RowActions
              onView={() => setDetailModal({ isOpen: true, data: compra })}
              onEdit={() => {
                setSelectedCompra(compra);
                setShowModal(true);
              }}
              editDisabled={!can('compras', 'editar')}
              onDelete={
                !isAnulada
                  ? () =>
                      setDeleteDialog({
                        isOpen: true,
                        id: compra.id_compra,
                        nombre: compra.id_compra,
                      })
                  : undefined
              }
              deleteDisabled={!can('compras', 'eliminar')}
              deleteIcon="x"
              deleteTitle="Anular compra"
            />
          );
        },
      },
    ],
    [can, setDetailModal, setShowModal, setDeleteDialog]
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Compras de Insumos"
        subtitle="Órdenes de compra de materias primas e insumos a proveedores"
        addLabel="Nueva Compra"
        addDisabled={!can('compras', 'crear')}
        onAdd={() => {
          setSelectedCompra(null);
          setShowModal(true);
        }}
      />

      {/* Tarjetas de Consolidado */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard title="Total Compras" value={totalCompras} icon={ShoppingCart} variant="primary" />
        <MetricCard title="Recibidas" value={recibidas} icon={CheckCircle} variant="success" />
        <MetricCard title="Pendientes" value={pendientes} icon={Clock} variant="warning" />
        <MetricCard title="Total Invertido" value={`$${totalInvertido.toLocaleString('es-CO')}`} icon={DollarSign} variant="accent" />
      </div>

      {/* Tabla con DataTable */}
      <DataTable
        columns={columns}
        data={filteredData}
        searchPlaceholder="Buscar por código, proveedor o insumo..."
        filters={
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
        }
      />

      <DetailModal
        isOpen={detailModal.isOpen}
        onClose={() => setDetailModal({ isOpen: false, data: null })}
        title="Detalle de la Compra"
        fields={detailModal.data ? [
          { label: 'ID', value: detailModal.data.id_compra },
          { label: 'Proveedor ID', value: detailModal.data.id_proveedor },
          { label: 'Usuario ID', value: detailModal.data.id_usuario },
          { label: 'Fecha', value: detailModal.data.fecha_compra },
          { label: 'Valor Total', value: detailModal.data.valor_total },
          { label: 'Medio de Pago', value: detailModal.data.medio_pago },
          { label: 'Comprobante', value: detailModal.data.comprobante_url },
          { label: 'Fecha Registro', value: detailModal.data.fecha_registro },
          { label: 'Estado', value: detailModal.data.estado },
        ] : []}
      />

      <CompraFormModal
        open={showModal}
        compra={selectedCompra}
        onSave={handleSave}
        isLoading={isSaving}
        onClose={() => {
          setShowModal(false);
          setSelectedCompra(null);
        }}
      />

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
