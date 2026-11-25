import { useState, useMemo, useEffect } from 'react';
import { Package, AlertTriangle, CheckCircle, Truck } from 'lucide-react';
import { useInsumos } from '../hooks/useInsumos';
import { getProveedores } from '../../proveedores/services/proveedoresService';
import { DataTable } from '../../../shared/components/DataTable';
import { RowActions } from '../../../shared/components/RowActions';
import { InsumoFormModal } from '../components/InsumoFormModal';
import ConfirmDialog from '../../../shared/components/ConfirmDialog';
import DetailModal from '../../../shared/components/DetailModal';
import PageHeader from '../../../shared/components/PageHeader';
import { MetricCard } from '../../../shared/components/MetricCard';
import { usePermissions } from '../../../shared/contexts/PermissionContext';
import StatusSwitch from '../../../shared/components/StatusSwitch';
import { CustomSelect } from '../../../shared/components/CustomSelect';
import ErrorBanner from '../../../shared/components/ErrorBanner';
import { exportToPdf } from '../../../shared/utils/exportToPdf';
import { exportToExcel } from '../../../shared/utils/exportToExcel';
import { formatDate } from '../../../shared/utils/formatDate';

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
    statusDialog,
    setStatusDialog,
    isDeleting,
    isSaving,
    isUpdatingStatus,
    isLoading,
    loadError,
    refetch,
    handleSave,
    handleDelete,
    handleRequestStatusChange,
    handleConfirmStatusChange,
  } = useInsumos();

  const [selectedInsumo, setSelectedInsumo] = useState(null);
  const [proveedores, setProveedores] = useState([]);

  useEffect(() => {
    getProveedores().then((data) => {
      if (Array.isArray(data)) setProveedores(data);
    }).catch(() => {});
  }, []);

  const proveedorNames = useMemo(
    () => Object.fromEntries(proveedores.map((p) => [p.id_proveedor, p.nombre])),
    [proveedores]
  );

  const totalInsumos = rawInsumos.length;
  const disponibles = rawInsumos.filter(
    (i) => String(i.estado).toLowerCase() === 'disponible' || String(i.estado).toLowerCase() === 'activo'
  ).length;
  const bajoStock = rawInsumos.filter(
    (i) =>
      String(i.estado).toLowerCase() !== 'inactivo' &&
      (String(i.estado).toLowerCase() === 'bajo stock' || Number(i.stock_actual) <= Number(i.stock_minimo))
  ).length;
  const proveedoresActivosIds = useMemo(
    () =>
      new Set(
        proveedores
          .filter((p) => String(p.estado).toLowerCase() === 'activo')
          .map((p) => Number(p.id_proveedor))
      ),
    [proveedores]
  );
  const proveedoresCount = useMemo(() => {
    const enInsumos = new Set(rawInsumos.map((i) => Number(i.id_proveedor)).filter(Boolean));
    if (proveedores.length === 0) return enInsumos.size;
    return [...enInsumos].filter((id) => proveedoresActivosIds.has(id)).length;
  }, [rawInsumos, proveedores, proveedoresActivosIds]);

  const filteredData = useMemo(() => {
    return rawInsumos.filter((i) => {
      const q = searchQuery.toLowerCase().trim();
      const proveedorNombre = (i.proveedor_nombre || proveedorNames[i.id_proveedor] || '').toLowerCase();
      const matchesSearch =
        !q ||
        i.nombre.toLowerCase().includes(q) ||
        String(i.id_insumo).toLowerCase().includes(q) ||
        String(i.id_proveedor).toLowerCase().includes(q) ||
        proveedorNombre.includes(q);

      const isTodosProv = categoriaFilter === 'Todas' || categoriaFilter === 'Todos';
      const matchesProv = isTodosProv || String(i.id_proveedor) === String(categoriaFilter);

      const isTodosEstado = estadoFilter === 'Todos' || estadoFilter === 'Todos los estados';
      const estadoNorm = String(i.estado || '').toLowerCase();
      const matchesEstado =
        isTodosEstado ||
        (estadoFilter === 'Bajo Stock'
          ? estadoNorm !== 'inactivo' && (estadoNorm === 'bajo stock' || Number(i.stock_actual) <= Number(i.stock_minimo))
          : estadoNorm === estadoFilter.toLowerCase());

      return matchesSearch && matchesProv && matchesEstado;
    });
  }, [rawInsumos, searchQuery, categoriaFilter, estadoFilter, proveedorNames]);

  const columns = useMemo(
    () => [
      {
        key: 'id_insumo',
        label: 'ID',
        render: (value) => <span className="font-mono font-medium text-xs">#{value}</span>,
      },
      {
        key: 'nombre',
        label: 'Insumo',
        render: (value) => <span className="font-semibold text-sm">{value}</span>,
      },
      {
        key: 'unidad_medida',
        label: 'Unidad de Medida',
        render: (value) => <span className="text-muted-foreground text-xs uppercase font-medium">{value}</span>,
      },
      {
        key: 'stock_actual',
        label: 'Stock Actual',
        render: (value, insumo) => {
          const isLow = Number(value) <= Number(insumo.stock_minimo || 0);
          return (
            <div className="flex items-center gap-1.5">
              <span className={`font-semibold text-sm ${isLow ? 'text-amber-600 dark:text-amber-400 font-bold' : ''}`}>
                {value}
              </span>
              {isLow && (
                <span className="px-1.5 py-0.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] rounded font-semibold">
                  Bajo
                </span>
              )}
            </div>
          );
        },
      },
      {
        key: 'id_proveedor',
        label: 'Proveedor',
        render: (value, insumo) => (
          <span className="font-medium text-foreground">
            {insumo.proveedor_nombre || proveedorNames[value] || '—'}
          </span>
        ),
      },
      {
        key: 'estado',
        label: 'Estado',
        render: (value, insumo) => (
          <StatusSwitch
            value={value}
            disabled={!can('insumos', 'cambiar_estado')}
            onToggle={() => handleRequestStatusChange(insumo)}
          />
        ),
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
    [can, proveedorNames, setDetailModal, setShowModal, setDeleteDialog, handleRequestStatusChange]
  );

  const handleExportPdf = () => {
    exportToPdf({
      data: filteredData,
      columns: [
        { header: 'ID', key: 'id_insumo' },
        { header: 'Insumo', key: 'nombre' },
        { header: 'Unidad', key: 'unidad_medida' },
        { header: 'Stock Actual', key: 'stock_actual' },
        { header: 'Stock Mínimo', key: 'stock_minimo' },
        {
          header: 'Proveedor',
          accessor: (i) => i.proveedor_nombre || proveedorNames[i.id_proveedor] || '—',
        },
        { header: 'Vencimiento', accessor: (i) => formatDate(i.fecha_vencimiento) },
        { header: 'Estado', key: 'estado' },
      ],
      title: 'Reporte de Insumos y Materias Primas',
      subtitle: 'Inventario de granos, lácteos y materias primas en CENAREPAS',
    });
  };

  const handleExportExcel = () => {
    exportToExcel({
      data: filteredData,
      columns: [
        { header: 'ID', key: 'id_insumo', align: 'center' },
        { header: 'Nombre del Insumo', key: 'nombre' },
        { header: 'Unidad de Medida', key: 'unidad_medida', align: 'center' },
        { header: 'Stock Actual', key: 'stock_actual', align: 'right' },
        { header: 'Stock Mínimo', key: 'stock_minimo', align: 'right' },
        {
          header: 'Proveedor Asignado',
          accessor: (i) => i.proveedor_nombre || proveedorNames[i.id_proveedor] || '—',
        },
        { header: 'Fecha de Vencimiento', accessor: (i) => formatDate(i.fecha_vencimiento), align: 'center' },
        { header: 'Estado', key: 'estado', align: 'center' },
      ],
      title: 'Reporte de Insumos y Materias Primas',
      subtitle: 'Inventario de granos, lácteos y materias primas en CENAREPAS',
      sheetName: 'Insumos',
    });
  };

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
        onExportPdf={handleExportPdf}
        onExportExcel={handleExportExcel}
      />

      {/* Tarjetas de Consolidado */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-stretch">
        <MetricCard index={0} title="Total Insumos" value={totalInsumos} icon={Package} variant="primary" />
        <MetricCard index={1} title="Disponibles" value={disponibles} icon={CheckCircle} variant="success" />
        <MetricCard index={2} title="Bajo Stock" value={bajoStock} icon={AlertTriangle} variant="warning" />
        <MetricCard index={3} title="Proveedores Activos" value={proveedoresCount} icon={Truck} variant="accent" />
      </div>

      <ErrorBanner message={loadError} onRetry={refetch} />

      {/* Tabla con DataTable */}
      <DataTable
        columns={columns}
        data={filteredData}
        isLoading={isLoading}
        emptyIcon={Package}
        entityName="insumos"
        onAdd={() => {
          setSelectedInsumo(null);
          setShowModal(true);
        }}
        addLabel="Nuevo Insumo"
        addDisabled={!can('insumos', 'crear')}
        isFiltered={Boolean(searchQuery || categoriaFilter !== 'Todas' || estadoFilter !== 'Todos')}
        searchPlaceholder="Buscar por código, nombre o proveedor..."
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        filters={
          <>
            <CustomSelect
              value={categoriaFilter}
              onChange={(e) => setCategoriaFilter(e.target.value)}
              className="w-full sm:w-52"
            >
              <option value="Todas">Todos los proveedores</option>
              {proveedores.map((p) => (
                <option key={p.id_proveedor} value={String(p.id_proveedor)}>
                  {p.nombre}
                </option>
              ))}
            </CustomSelect>
            <CustomSelect
              value={estadoFilter}
              onChange={(e) => setEstadoFilter(e.target.value)}
              className="w-full sm:w-48"
            >
              <option value="Todos">Todos los estados</option>
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
              <option value="Bajo Stock">Bajo Stock</option>
            </CustomSelect>
          </>
        }
      />

      <DetailModal
        isOpen={detailModal.isOpen}
        onClose={() => setDetailModal({ isOpen: false, data: null })}
        title="Detalle del Insumo"
        fields={
          detailModal.data
            ? [
                { label: 'ID', value: `#${detailModal.data.id_insumo}` },
                { label: 'Nombre', value: detailModal.data.nombre },
                { label: 'Unidad de Medida', value: detailModal.data.unidad_medida },
                {
                  label: 'Proveedor',
                  value:
                    detailModal.data.proveedor_nombre ||
                    proveedorNames[detailModal.data.id_proveedor] ||
                    '—',
                },
                { label: 'Stock Actual', value: detailModal.data.stock_actual },
                { label: 'Stock Mínimo', value: detailModal.data.stock_minimo },
                {
                  label: 'Fecha de Vencimiento',
                  value: formatDate(detailModal.data.fecha_vencimiento),
                },
                { label: 'Estado', value: detailModal.data.estado },
              ]
            : []
        }
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
        title="Inactivar Insumo"
        message={`¿Estás seguro de que deseas inactivar el insumo "${deleteDialog.nombre}"? Podrás activarlo de nuevo después.`}
        confirmText="Inactivar"
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialog({ isOpen: false, id: null, nombre: '' })}
        isLoading={isDeleting}
      />

      {/* Modal de confirmación para Cambio de Estado */}
      <ConfirmDialog
        isOpen={statusDialog.isOpen}
        title={`Cambiar Estado a ${statusDialog.nextEstado}`}
        message={`¿Estás seguro de que deseas cambiar el estado del insumo "${statusDialog.insumo?.nombre}" de ${statusDialog.insumo?.estado || 'Activo'} a ${statusDialog.nextEstado}?`}
        confirmText={`Cambiar a ${statusDialog.nextEstado}`}
        confirmVariant={statusDialog.nextEstado === 'Activo' ? 'success' : 'warning'}
        onConfirm={handleConfirmStatusChange}
        onCancel={() => setStatusDialog({ isOpen: false, insumo: null, nextEstado: 'Activo' })}
        isLoading={isUpdatingStatus}
        loadingText="Cambiando estado…"
      />
    </div>
  );
}
