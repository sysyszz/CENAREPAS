import { useState, useMemo } from 'react';
import { UserCircle, CheckCircle, ShoppingBag, DollarSign } from 'lucide-react';
import { useClientes } from '../hooks/useClientes';
import { DataTable } from '../../../shared/components/DataTable';
import { RowActions } from '../../../shared/components/RowActions';
import { ClienteFormModal } from '../components/ClienteFormModal';
import ConfirmDialog from '../../../shared/components/ConfirmDialog';
import Toast from '../../../shared/components/Toast';
import DetailModal from '../../../shared/components/DetailModal';
import PageHeader from '../../../shared/components/PageHeader';
import { MetricCard } from '../../../shared/components/MetricCard';
import { usePermissions } from '../../../shared/contexts/PermissionContext';
import StatusSwitch from '../../../shared/components/StatusSwitch';

export default function ClientesPage() {
  const { can } = usePermissions();
  const {
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
    isSaving,
    toast,
    setToast,
    handleSave,
    handleDelete,
  } = useClientes();
  const [selectedCliente, setSelectedCliente] = useState(null);

  const totalClientes = rawClientes.length;
  const activos = rawClientes.filter((c) => String(c.estado).toLowerCase() === 'activo').length;
  const totalPedidosHistorico = 0;
  const totalFacturadoHistorico = 0;

  const filteredData = useMemo(() => {
    return rawClientes.filter((c) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        c.nombre.toLowerCase().includes(q) ||
        (c.documento || '').toLowerCase().includes(q) ||
        (c.correo || '').toLowerCase().includes(q) ||
        (c.direccion || '').toLowerCase().includes(q) ||
        (c.telefono || '').toLowerCase().includes(q);

      const isTodos = estadoFilter === 'Todos' || estadoFilter === 'Todos los estados';
      const matchesEstado =
        isTodos || String(c.estado).toLowerCase() === estadoFilter.toLowerCase();

      return matchesSearch && matchesEstado;
    });
  }, [rawClientes, searchQuery, estadoFilter]);

  const columns = useMemo(
    () => [
      {
        key: 'id_cliente',
        label: 'ID',
        render: (value) => <span className="font-mono font-medium">{value}</span>,
      },
      {
        key: 'nombre',
        label: 'Cliente / Razón Social',
        render: (value) => <span className="font-semibold">{value}</span>,
      },
      {
        key: 'documento',
        label: 'Documento',
        render: (value) => <span className="text-muted-foreground">{value}</span>,
      },
      {
        key: 'telefono',
        label: 'Teléfono',
        render: (value) => <span className="text-muted-foreground">{value}</span>,
      },
      {
        key: 'correo',
        label: 'Correo',
        render: (value) => <span className="text-muted-foreground">{value}</span>,
      },
      {
        key: 'direccion',
        label: 'Dirección',
        render: (value) => <span className="text-muted-foreground">{value}</span>,
      },
      {
        key: 'estado',
        label: 'Estado',
        render: (value) => <StatusSwitch value={value} />,
      },
      {
        key: 'acciones',
        label: 'Acciones',
        render: (_, cliente) => (
          <RowActions
            onView={() => setDetailModal({ isOpen: true, data: cliente })}
            onEdit={() => {
              setSelectedCliente(cliente);
              setShowModal(true);
            }}
            editDisabled={!can('clientes', 'editar')}
            onDelete={() => setDeleteDialog({ isOpen: true, id: cliente.id_cliente, nombre: cliente.nombre })}
            deleteDisabled={!can('clientes', 'eliminar')}
          />
        ),
      },
    ],
    [can, setDetailModal, setShowModal, setDeleteDialog]
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Clientes"
        subtitle="Directorio y facturación histórica de clientes de Masarepas"
        addLabel="Nuevo Cliente"
        addDisabled={!can('clientes', 'crear')}
        onAdd={() => {
          setSelectedCliente(null);
          setShowModal(true);
        }}
      />

      {/* Tarjetas de Consolidado */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard title="Total Clientes" value={totalClientes} icon={UserCircle} variant="primary" />
        <MetricCard title="Clientes Activos" value={activos} icon={CheckCircle} variant="success" />
        <MetricCard title="Pedidos Históricos" value={totalPedidosHistorico} icon={ShoppingBag} variant="accent" />
        <MetricCard title="Facturación Total" value={`$${totalFacturadoHistorico.toLocaleString('es-CO')}`} icon={DollarSign} variant="warning" />
      </div>

      {/* Tabla con DataTable (usa SearchFilterBar y PaginationControls internamente) */}
      <DataTable
        columns={columns}
        data={filteredData}
        searchPlaceholder="Buscar por código, nombre, NIT o ciudad..."
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        filters={
          <select
            value={estadoFilter}
            onChange={(e) => setEstadoFilter(e.target.value)}
            className="px-4 py-2 border border-input bg-input-background rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="Todos">Todos los estados</option>
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
          </select>
        }
      />

      <DetailModal
        isOpen={detailModal.isOpen}
        onClose={() => setDetailModal({ isOpen: false, data: null })}
        title="Detalle del Cliente"
        fields={detailModal.data ? [
          { label: 'ID', value: detailModal.data.id_cliente },
          { label: 'Cliente', value: detailModal.data.nombre },
          { label: 'Documento', value: detailModal.data.documento },
          { label: 'Teléfono', value: detailModal.data.telefono },
          { label: 'Correo', value: detailModal.data.correo },
          { label: 'Dirección', value: detailModal.data.direccion },
          { label: 'Fecha de Creación', value: detailModal.data.fecha_creacion },
          { label: 'Estado', value: detailModal.data.estado },
        ] : []}
      />

      <ClienteFormModal
        open={showModal}
        cliente={selectedCliente}
        onSave={handleSave}
        isLoading={isSaving}
        onClose={() => {
          setShowModal(false);
          setSelectedCliente(null);
        }}
      />

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
