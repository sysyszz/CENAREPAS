import { useState, useMemo, useEffect } from 'react';
import { Truck, CheckCircle, Clock, Package } from 'lucide-react';
import { useProveedores } from '../hooks/useProveedores';
import { getInsumos } from '../../insumos/services/insumosService';
import { DataTable } from '../../../shared/components/DataTable';
import { RowActions } from '../../../shared/components/RowActions';
import { MetricCard } from '../../../shared/components/MetricCard';
import { ProveedorFormModal } from '../components/ProveedorFormModal';
import ConfirmDialog from '../../../shared/components/ConfirmDialog';
import DetailModal from '../../../shared/components/DetailModal';
import PageHeader from '../../../shared/components/PageHeader';
import { usePermissions } from '../../../shared/contexts/PermissionContext';
import StatusSwitch from '../../../shared/components/StatusSwitch';
import { CustomSelect } from '../../../shared/components/CustomSelect';
import ErrorBanner from '../../../shared/components/ErrorBanner';

export default function ProveedoresPage() {
  const { can } = usePermissions();
  const {
    proveedores,
    rawProveedores,
    searchTerm,
    setSearchTerm,
    filterEstado,
    setFilterEstado,
    showModal,
    setShowModal,
    detailModal,
    setDetailModal,
    deleteDialog,
    setDeleteDialog,
    isDeleting,
    isSaving,
    isLoading,
    loadError,
    refetch,
    handleSave,
    handleDelete,
  } = useProveedores();

  const [selectedProveedor, setSelectedProveedor] = useState(null);
  const [insumosCount, setInsumosCount] = useState(0);

  useEffect(() => {
    getInsumos().then((data) => {
      if (Array.isArray(data)) setInsumosCount(data.length);
    }).catch(() => {});
  }, []);


  const totalProveedores = rawProveedores.length;
  const activos = rawProveedores.filter((p) => String(p.estado).toLowerCase() === 'activo').length;
  const inactivos = totalProveedores - activos;

  const columns = useMemo(
    () => [
      {
        key: 'id_proveedor',
        label: 'ID',
        render: (value) => <span className="font-mono font-medium">{value}</span>,
      },
      {
        key: 'nombre',
        label: 'Proveedor',
        render: (value) => <span className="font-semibold">{value}</span>,
      },
      {
        key: 'nit',
        label: 'NIT',
        render: (value) => <span className="font-mono text-muted-foreground">{value}</span>,
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
        render: (value) => <StatusSwitch value={value} disabled={!can('proveedores', 'cambiar_estado')} />,
      },
      {
        key: 'fecha_creacion',
        label: 'Fecha de Creación',
        render: (value) => <span className="text-muted-foreground">{value}</span>,
      },
      {
        key: 'acciones',
        label: 'Acciones',
        render: (_, proveedor) => (
          <RowActions
            onView={() => setDetailModal({ isOpen: true, data: proveedor })}
            onEdit={() => {
              setSelectedProveedor(proveedor);
              setShowModal(true);
            }}
            editDisabled={!can('proveedores', 'editar')}
            onDelete={() =>
              setDeleteDialog({
                isOpen: true,
                id: proveedor.id_proveedor,
                nombre: proveedor.nombre,
              })
            }
            deleteDisabled={!can('proveedores', 'eliminar')}
          />
        ),
      },
    ],
    [can, setDetailModal, setShowModal, setDeleteDialog]
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Proveedores"
        subtitle="Directorio de proveedores de materias primas e insumos de Masarepas"
        addLabel="Nuevo Proveedor"
        addDisabled={!can('proveedores', 'crear')}
        onAdd={() => {
          setSelectedProveedor(null);
          setShowModal(true);
        }}
      />

      {/* Tarjetas de Consolidado */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-stretch">
        <MetricCard index={0} title="Total Proveedores" value={totalProveedores} icon={Truck} variant="primary" />
        <MetricCard index={1} title="Proveedores Activos" value={activos} icon={CheckCircle} variant="success" />
        <MetricCard index={2} title="Inactivos" value={inactivos} icon={Clock} variant="warning" />
        <MetricCard index={3} title="Insumos Suministrados" value={insumosCount} icon={Package} variant="accent" />
      </div>

      <ErrorBanner message={loadError} onRetry={refetch} />

      {/* Tabla con DataTable */}
      <DataTable
        columns={columns}
        data={proveedores}
        isLoading={isLoading}
        emptyIcon={Truck}
        entityName="proveedores"
        onAdd={() => {
          setSelectedProveedor(null);
          setShowModal(true);
        }}
        addLabel="Nuevo Proveedor"
        addDisabled={!can('proveedores', 'crear')}
        isFiltered={Boolean(searchTerm || filterEstado !== 'Todos los estados')}
        searchPlaceholder="Buscar por nombre, NIT o correo..."
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        filters={
          <CustomSelect
            value={filterEstado}
            onChange={(e) => setFilterEstado(e.target.value)}
            className="w-full sm:w-48"
          >
            <option value="Todos los estados">Todos los estados</option>
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
          </CustomSelect>
        }
      />

      <DetailModal
        isOpen={detailModal.isOpen}
        onClose={() => setDetailModal({ isOpen: false, data: null })}
        title="Detalle del Proveedor"
        fields={detailModal.data ? [
          { label: 'ID', value: detailModal.data.id_proveedor },
          { label: 'Nombre', value: detailModal.data.nombre },
          { label: 'NIT', value: detailModal.data.nit },
          { label: 'Teléfono', value: detailModal.data.telefono || 'N/A' },
          { label: 'Correo', value: detailModal.data.correo || 'N/A' },
          { label: 'Dirección', value: detailModal.data.direccion || 'N/A' },
          { label: 'Estado', value: detailModal.data.estado },
          { label: 'Fecha de Creación', value: detailModal.data.fecha_creacion },
        ] : []}
      />

      <ProveedorFormModal
        open={showModal}
        proveedor={selectedProveedor}
        onSave={handleSave}
        isLoading={isSaving}
        onClose={() => {
          setShowModal(false);
          setSelectedProveedor(null);
        }}
      />

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        title="Eliminar Proveedor"
        message={`¿Estás seguro de que deseas eliminar al proveedor "${deleteDialog.nombre}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialog({ isOpen: false, id: null, nombre: '' })}
        isLoading={isDeleting}
      />
    </div>
  );
}


