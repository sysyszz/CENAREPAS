import { useState, useMemo } from 'react';
import { Factory, CheckCircle, Clock, Calendar } from 'lucide-react';
import { useProduccion } from '../hooks/useProduccion';
import { DataTable } from '../../../shared/components/DataTable';
import { RowActions } from '../../../shared/components/RowActions';
import { ProduccionFormModal } from '../components/ProduccionFormModal';
import ConfirmDialog from '../../../shared/components/ConfirmDialog';
import Toast from '../../../shared/components/Toast';
import DetailModal from '../../../shared/components/DetailModal';
import PageHeader from '../../../shared/components/PageHeader';
import { MetricCard } from '../../../shared/components/MetricCard';
import { usePermissions } from '../../../shared/contexts/PermissionContext';
import StatusSwitch from '../../../shared/components/StatusSwitch';

export default function ProduccionPage() {
  const { can } = usePermissions();
  const {
    rawLotes,
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
  } = useProduccion();

  const [selectedLote, setSelectedLote] = useState(null);

  const totalLotes = rawLotes.length;
  const finalizados = rawLotes.filter((l) => String(l.estado).toLowerCase() === 'finalizado').length;
  const enProceso = rawLotes.filter((l) => String(l.estado).toLowerCase() === 'en proceso' || String(l.estado).toLowerCase() === 'en_proceso').length;
  const programados = rawLotes.filter((l) => String(l.estado).toLowerCase() === 'programado').length;

  const filteredData = useMemo(() => {
    return rawLotes.filter((l) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        String(l.id_lote).toLowerCase().includes(q) ||
        String(l.id_ficha).toLowerCase().includes(q) ||
        String(l.id_usuario_responsable).toLowerCase().includes(q);

      const isTodosEstado = estadoFilter === 'Todos' || estadoFilter === 'Todos los estados';
      const matchesEstado =
        isTodosEstado || String(l.estado).toLowerCase() === estadoFilter.toLowerCase();

      return matchesSearch && matchesEstado;
    });
  }, [rawLotes, searchQuery, estadoFilter]);

  const columns = useMemo(
    () => [
      {
        key: 'id_lote',
        label: 'Código Lote',
        render: (value) => <span className="font-mono font-medium">{value}</span>,
      },
      {
        key: 'id_ficha',
        label: 'Ficha ID',
        render: (value) => <span>{value}</span>,
      },
      {
        key: 'id_usuario_responsable',
        label: 'Usuario ID',
        render: (value) => <span>{value}</span>,
      },
      {
        key: 'cantidad_producida',
        label: 'Cantidad Producida',
        render: (value) => <span className="font-semibold">{value}</span>,
      },
      {
        key: 'fecha_produccion',
        label: 'Fecha',
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
        render: (_, lote) => (
          <RowActions
            onView={() => setDetailModal({ isOpen: true, data: lote })}
            onEdit={() => {
              setSelectedLote(lote);
              setShowModal(true);
            }}
            editDisabled={!can('produccion', 'editar')}
            onDelete={
              String(lote.estado).toLowerCase() !== 'anulado'
                ? () =>
                    setDeleteDialog({
                      isOpen: true,
                      id: lote.id_lote,
                      nombre: `Lote #${lote.id_lote}`,
                    })
                : undefined
            }
            deleteDisabled={!can('produccion', 'eliminar')}
            deleteTitle="Anular Lote"
          />
        ),
      },
    ],
    [can, setDetailModal, setShowModal, setDeleteDialog]
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Producción de Arepas"
        subtitle="Control de lotes, molienda y empaque en planta Masarepas"
        addLabel="Registrar Lote"
        addDisabled={!can('produccion', 'crear')}
        onAdd={() => {
          setSelectedLote(null);
          setShowModal(true);
        }}
      />

      {/* Tarjetas de Consolidado */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard title="Total Lotes" value={totalLotes} icon={Factory} variant="primary" />
        <MetricCard title="Finalizados" value={finalizados} icon={CheckCircle} variant="success" />
        <MetricCard title="En Proceso" value={enProceso} icon={Clock} variant="warning" />
        <MetricCard title="Programados" value={programados} icon={Calendar} variant="accent" />
      </div>

      {/* Tabla con DataTable */}
      <DataTable
        columns={columns}
        data={filteredData}
        searchPlaceholder="Buscar por ID de lote, ficha o usuario responsable..."
        filters={
          <select
            value={estadoFilter}
            onChange={(e) => setEstadoFilter(e.target.value)}
            className="px-4 py-2 border border-input bg-input-background rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="Todos">Todos los estados</option>
            <option value="Finalizado">Finalizado</option>
            <option value="En Proceso">En Proceso</option>
            <option value="Programado">Programado</option>
            <option value="Anulado">Anulado</option>
          </select>
        }
      />

      <DetailModal
        isOpen={detailModal.isOpen}
        onClose={() => setDetailModal({ isOpen: false, data: null })}
        title="Detalle del Lote de Producción"
        fields={detailModal.data ? [
          { label: 'ID', value: detailModal.data.id_lote },
          { label: 'Ficha ID', value: detailModal.data.id_ficha },
          { label: 'Usuario Responsable ID', value: detailModal.data.id_usuario_responsable },
          { label: 'Fecha', value: detailModal.data.fecha_produccion },
          { label: 'Cantidad', value: detailModal.data.cantidad_producida },
          { label: 'Observaciones', value: detailModal.data.observaciones || 'N/A' },
          { label: 'Estado', value: detailModal.data.estado },
        ] : []}
      />

      <ProduccionFormModal
        open={showModal}
        lote={selectedLote}
        onSave={handleSave}
        isLoading={isSaving}
        onClose={() => {
          setShowModal(false);
          setSelectedLote(null);
        }}
      />

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        title="Anular Lote de Producción"
        message={`¿Estás seguro de que deseas anular el lote "${deleteDialog.nombre}"? Esta acción no se puede deshacer.`}
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


