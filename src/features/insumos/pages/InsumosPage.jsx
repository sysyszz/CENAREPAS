import { useState, useMemo } from 'react';
import { Package, AlertTriangle, CheckCircle, Truck } from 'lucide-react';
import { useInsumos } from '../hooks/useInsumos';
import { DataTable } from '../../../shared/components/DataTable';
import { RowActions } from '../../../shared/components/RowActions';
import { InsumoFormModal } from '../components/InsumoFormModal';
import ConfirmDialog from '../../../shared/components/ConfirmDialog';
import Toast from '../../../shared/components/Toast';
import DetailModal from '../../../shared/components/DetailModal';
import PageHeader from '../../../shared/components/PageHeader';
import { MetricCard } from '../../../shared/components/MetricCard';
import { usePermissions } from '../../../shared/contexts/PermissionContext';
import StatusSwitch from '../../../shared/components/StatusSwitch';

export default function InsumosPage() {
  const { can } = usePermissions();
  const {
    rawInsumos,
    searchQuery,
    setSearchQuery,
    categoriaFilter,
    setCategoriaFilter,
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
  } = useInsumos();

  const [selectedInsumo, setSelectedInsumo] = useState(null);

  const totalInsumos = rawInsumos.length;
  const disponibles = rawInsumos.filter(
    (i) => String(i.estado).toLowerCase() === 'disponible' || String(i.estado).toLowerCase() === 'activo'
  ).length;
  const bajoStock = rawInsumos.filter(
    (i) => String(i.estado).toLowerCase() === 'bajo stock' || i.stock_actual <= i.stock_minimo
  ).length;
  const proveedoresCount = new Set(rawInsumos.map((i) => i.id_proveedor).filter(Boolean)).size;

  const filteredData = useMemo(() => {
    return rawInsumos.filter((i) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        i.nombre.toLowerCase().includes(q) ||
        String(i.id_insumo).toLowerCase().includes(q) ||
        String(i.id_proveedor).toLowerCase().includes(q);

      const isTodosCat = categoriaFilter === 'Todas' || categoriaFilter === 'Todas las categorías';
      const matchesCat = isTodosCat || String(i.id_proveedor) === categoriaFilter;

      const isTodosEstado = estadoFilter === 'Todos' || estadoFilter === 'Todos los estados';
      const matchesEstado =
        isTodosEstado || String(i.estado).toLowerCase() === estadoFilter.toLowerCase();

      return matchesSearch && matchesCat && matchesEstado;
    });
  }, [rawInsumos, searchQuery, categoriaFilter, estadoFilter]);

  const columns = useMemo(
    () => [
      {
        key: 'id_insumo',
        label: 'ID',
        render: (value) => <span className="font-mono font-medium">{value}</span>,
      },
      {
        key: 'nombre',
        label: 'Insumo',
        render: (value) => <span className="font-semibold">{value}</span>,
      },
      {
        key: 'unidad_medida',
        label: 'Unidad de Medida',
        render: (value) => <span className="text-muted-foreground">{value}</span>,
      },
      {
        key: 'stock_actual',
        label: 'Stock Actual',
        render: (value) => <span className="font-semibold">{value}</span>,
      },
      {
        key: 'id_proveedor',
        label: 'Proveedor',
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
        render: (_, insumo) => (
          <RowActions
            onView={() => setDetailModal({ isOpen: true, data: insumo })}
            onEdit={() => {
              setSelectedInsumo(insumo);
              setShowModal(true);
            }}
            editDisabled={!can('insumos', 'editar')}
            onDelete={() =>
              setDeleteDialog({
                isOpen: true,
                id: insumo.id_insumo,
                nombre: insumo.nombre,
              })
            }
            deleteDisabled={!can('insumos', 'eliminar')}
          />
        ),
      },
    ],
    [can, setDetailModal, setShowModal, setDeleteDialog]
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Insumos y Materia Prima"
        subtitle="Inventario de granos, lácteos y embalajes para Masarepas"
        addLabel="Nuevo Insumo"
        addDisabled={!can('insumos', 'crear')}
        onAdd={() => {
          setSelectedInsumo(null);
          setShowModal(true);
        }}
      />

      {/* Tarjetas de Consolidado */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard title="Total Insumos" value={totalInsumos} icon={Package} variant="primary" />
        <MetricCard title="Disponibles" value={disponibles} icon={CheckCircle} variant="success" />
        <MetricCard title="Bajo Stock" value={bajoStock} icon={AlertTriangle} variant="warning" />
        <MetricCard title="Proveedores Activos" value={proveedoresCount} icon={Truck} variant="accent" />
      </div>

      {/* Tabla con DataTable */}
      <DataTable
        columns={columns}
        data={filteredData}
        searchPlaceholder="Buscar por código, nombre o proveedor..."
        filters={
          <>
            <select
              value={categoriaFilter}
              onChange={(e) => setCategoriaFilter(e.target.value)}
              className="px-4 py-2 border border-input bg-input-background rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="Todas">Todas las categorías</option>
              <option value="Granos y Cereales">Granos y Cereales</option>
              <option value="Lácteos y Quesos">Lácteos y Quesos</option>
              <option value="Lácteos y Grasas">Lácteos y Grasas</option>
              <option value="Empaques y Embalajes">Empaques y Embalajes</option>
            </select>
            <select
              value={estadoFilter}
              onChange={(e) => setEstadoFilter(e.target.value)}
              className="px-4 py-2 border border-input bg-input-background rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="Todos">Todos los estados</option>
              <option value="Disponible">Disponible / Activo</option>
              <option value="Bajo Stock">Bajo Stock / Inactivo</option>
            </select>
          </>
        }
      />

      <DetailModal
        isOpen={detailModal.isOpen}
        onClose={() => setDetailModal({ isOpen: false, data: null })}
        title="Detalle del Insumo"
        fields={detailModal.data ? [
          { label: 'ID', value: detailModal.data.id_insumo },
          { label: 'Nombre', value: detailModal.data.nombre },
          { label: 'Unidad de Medida', value: detailModal.data.unidad_medida },
          { label: 'Stock Actual', value: detailModal.data.stock_actual },
          { label: 'Stock Mínimo', value: detailModal.data.stock_minimo },
          { label: 'Fecha de Vencimiento', value: detailModal.data.fecha_vencimiento },
          { label: 'Proveedor', value: detailModal.data.id_proveedor },
          { label: 'Estado', value: detailModal.data.estado },
        ] : []}
      />

      <InsumoFormModal
        open={showModal}
        insumo={selectedInsumo}
        onSave={handleSave}
        isLoading={isSaving}
        onClose={() => {
          setShowModal(false);
          setSelectedInsumo(null);
        }}
      />

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        title="Eliminar Insumo"
        message={`¿Estás seguro de que deseas eliminar el insumo "${deleteDialog.nombre}"? Esta acción no se puede deshacer.`}
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
