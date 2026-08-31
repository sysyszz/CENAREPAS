import { useState, useMemo } from 'react';
import { BookOpen, CheckCircle, FileText, Clock } from 'lucide-react';
import { useFichasTecnicas } from '../hooks/useFichasTecnicas';
import { DataTable } from '../../../shared/components/DataTable';
import { RowActions } from '../../../shared/components/RowActions';
import { FichaTecnicaFormModal } from '../components/FichaTecnicaFormModal';
import ConfirmDialog from '../../../shared/components/ConfirmDialog';
import Toast from '../../../shared/components/Toast';
import DetailModal from '../../../shared/components/DetailModal';
import PageHeader from '../../../shared/components/PageHeader';
import { MetricCard } from '../../../shared/components/MetricCard';
import { usePermissions } from '../../../shared/contexts/PermissionContext';
import StatusSwitch from '../../../shared/components/StatusSwitch';

export default function FichasTecnicasPage() {
  const { can } = usePermissions();
  const {
    rawFichas,
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
  } = useFichasTecnicas();

  const [selectedFicha, setSelectedFicha] = useState(null);

  const totalFichas = rawFichas.length;
  const vigentes = rawFichas.filter(
    (f) => String(f.estado).toLowerCase() === 'vigente' || String(f.estado).toLowerCase() === 'activo'
  ).length;

  const filteredData = useMemo(() => {
    return rawFichas.filter((f) => {
      const isTodos = estadoFilter === 'Todos' || estadoFilter === 'Todos los estados';
      if (isTodos) return true;
      return String(f.estado).toLowerCase() === estadoFilter.toLowerCase();
    });
  }, [rawFichas, estadoFilter]);

  const columns = useMemo(
    () => [
      {
        key: 'id_ficha',
        label: 'Código',
        render: (value) => <span className="font-mono font-medium">{value}</span>,
      },
      {
        key: 'nombre',
        label: 'Producto Estándar',
        render: (value) => <span className="font-semibold">{value}</span>,
      },
      {
        key: 'tiempo_estimado_minutos',
        label: 'Tiempo (min)',
        render: (value) => `${value} min`,
      },
      {
        key: 'rendimiento_lote',
        label: 'Rendimiento Esperado',
        render: (value) => `${value} und`,
      },
      {
        key: 'descripcion',
        label: 'Insumos Clave / Descripción',
        render: (value) => <span className="text-muted-foreground max-w-xs truncate block">{value}</span>,
      },
      {
        key: 'estado',
        label: 'Estado',
        render: (value) => <StatusSwitch value={value} />,
      },
      {
        key: 'acciones',
        label: 'Acciones',
        render: (_, ficha) => (
          <RowActions
            onView={() => setDetailModal({ isOpen: true, data: ficha })}
            onEdit={() => {
              setSelectedFicha(ficha);
              setShowModal(true);
            }}
            editDisabled={!can('fichas-tecnicas', 'editar')}
            onDelete={() =>
              setDeleteDialog({
                isOpen: true,
                id: ficha.id_ficha,
                nombre: ficha.nombre,
              })
            }
            deleteDisabled={!can('fichas-tecnicas', 'eliminar')}
          />
        ),
      },
    ],
    [can, setDetailModal, setShowModal, setDeleteDialog]
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Fichas Técnicas (Recetas)"
        subtitle="Formulaciones, rendimientos y estándar de calidad de Masarepas"
        addLabel="Nueva Ficha Técnica"
        addDisabled={!can('fichas-tecnicas', 'crear')}
        onAdd={() => {
          setSelectedFicha(null);
          setShowModal(true);
        }}
      />

      {/* Tarjetas de Consolidado */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard title="Total Recetas" value={totalFichas} icon={BookOpen} variant="primary" />
        <MetricCard title="Fichas Vigentes" value={vigentes} icon={CheckCircle} variant="success" />
        <MetricCard title="Versión Actual" value="v3.0 Max" icon={FileText} variant="accent" />
        <MetricCard title="Última Revisión" value="Hace 15 días" icon={Clock} variant="warning" />
      </div>

      {/* Tabla con DataTable */}
      <DataTable
        columns={columns}
        data={filteredData}
        searchPlaceholder="Buscar por código, producto o insumos..."
        filters={
          <select
            value={estadoFilter}
            onChange={(e) => setEstadoFilter(e.target.value)}
            className="px-4 py-2 border border-input bg-input-background rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="Todos">Todos los estados</option>
            <option value="Vigente">Vigente / Activo</option>
            <option value="Inactivo">Inactivo / En Revisión</option>
          </select>
        }
      />

      <DetailModal
        isOpen={detailModal.isOpen}
        onClose={() => setDetailModal({ isOpen: false, data: null })}
        title="Detalle de Ficha Técnica"
        fields={detailModal.data ? [
          { label: 'ID', value: detailModal.data.id_ficha },
          { label: 'Nombre', value: detailModal.data.nombre },
          { label: 'Descripción', value: detailModal.data.descripcion },
          { label: 'Instrucciones', value: detailModal.data.instrucciones_preparacion },
          { label: 'Tiempo', value: `${detailModal.data.tiempo_estimado_minutos} min` },
          { label: 'Rendimiento', value: `${detailModal.data.rendimiento_lote} und` },
          { label: 'Estado', value: detailModal.data.estado },
        ] : []}
      />

      <FichaTecnicaFormModal
        open={showModal}
        ficha={selectedFicha}
        onSave={handleSave}
        isLoading={isSaving}
        onClose={() => {
          setShowModal(false);
          setSelectedFicha(null);
        }}
      />

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        title="Eliminar Ficha Técnica"
        message={`¿Estás seguro de que deseas eliminar la ficha técnica "${deleteDialog.nombre}"? Esta acción no se puede deshacer.`}
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
