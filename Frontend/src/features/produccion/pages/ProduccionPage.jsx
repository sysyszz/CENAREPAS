import { useState, useMemo, useEffect } from 'react';
import { Factory, CheckCircle, Clock, Calendar } from 'lucide-react';
import { useProduccion } from '../hooks/useProduccion';
import { mockLotesProduccionInsumos } from '../services/produccionService';
import { mockInsumos } from '../../insumos/services/insumosService';
import { mockFichasTecnicas, getFichasTecnicas } from '../../fichas-tecnicas/services/fichasTecnicasService';
import { mockUsuarios } from '../../usuarios/services/usuariosService';
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
  const [fichas, setFichas] = useState(mockFichasTecnicas);

  const getLoteInsumosList = (lote) => {
    if (!lote) return [];
    if (Array.isArray(lote.insumos) && lote.insumos.length > 0) {
      return lote.insumos;
    }
    const fromMock = mockLotesProduccionInsumos.filter((li) => li.id_lote === lote.id_lote);
    if (fromMock.length > 0) {
      return fromMock.map((li) => {
        const ins = mockInsumos.find((i) => i.id_insumo === li.id_insumo);
        return {
          id_insumo: li.id_insumo,
          nombre: ins?.nombre || `Insumo #${li.id_insumo}`,
          cantidad: li.cantidad_consumida || li.cantidad,
          unidad_medida: ins?.unidad_medida || 'kg',
        };
      });
    }
    return [];
  };

  useEffect(() => {
    getFichasTecnicas().then((data) => {
      if (data && data.length > 0) setFichas(data);
    });
  }, []);

  const fichasNames = useMemo(
    () => Object.fromEntries(fichas.map((f) => [f.id_ficha, f.nombre])),
    [fichas]
  );

  const usuariosNames = useMemo(
    () => Object.fromEntries(mockUsuarios.map((u) => [u.id_usuario, u.nombre])),
    []
  );

  const totalLotes = rawLotes.length;
  const finalizados = rawLotes.filter((l) => String(l.estado).toLowerCase() === 'finalizado').length;
  const enProceso = rawLotes.filter((l) => String(l.estado).toLowerCase() === 'en proceso' || String(l.estado).toLowerCase() === 'en_proceso').length;
  const programados = rawLotes.filter((l) => String(l.estado).toLowerCase() === 'programado').length;

  const filteredData = useMemo(() => {
    return rawLotes.filter((l) => {
      const q = searchQuery.toLowerCase().trim();
      const fichaNombre = (fichasNames[l.id_ficha] || '').toLowerCase();
      const usuarioNombre = (usuariosNames[l.id_usuario_responsable] || '').toLowerCase();
      const matchesSearch =
        !q ||
        String(l.id_lote).toLowerCase().includes(q) ||
        String(l.id_ficha).toLowerCase().includes(q) ||
        String(l.id_usuario_responsable).toLowerCase().includes(q) ||
        fichaNombre.includes(q) ||
        usuarioNombre.includes(q) ||
        (l.observaciones || '').toLowerCase().includes(q);

      const isTodosEstado = estadoFilter === 'Todos' || estadoFilter === 'Todos los estados';
      const matchesEstado =
        isTodosEstado || String(l.estado).toLowerCase() === estadoFilter.toLowerCase();

      return matchesSearch && matchesEstado;
    });
  }, [rawLotes, searchQuery, estadoFilter, fichasNames, usuariosNames]);

  const columns = useMemo(
    () => [
      {
        key: 'id_lote',
        label: 'Código Lote',
        render: (value) => <span className="font-mono font-medium text-xs">#{value}</span>,
      },
      {
        key: 'id_ficha',
        label: 'Ficha Técnica / Receta',
        render: (value) => (
          <span className="font-semibold text-foreground">
            {fichasNames[value] || `Receta #${value}`}
          </span>
        ),
      },
      {
        key: 'id_usuario_responsable',
        label: 'Responsable',
        render: (value) => (
          <span className="text-muted-foreground text-sm">
            {usuariosNames[value] || `Usuario #${value}`}
          </span>
        ),
      },
      {
        key: 'cantidad_producida',
        label: 'Cantidad Producida',
        render: (value) => <span className="font-semibold text-sm">{Number(value || 0).toLocaleString('es-CO')} und</span>,
      },
      {
        key: 'fecha_produccion',
        label: 'Fecha',
        render: (value) => <span className="text-muted-foreground text-sm">{value}</span>,
      },
      {
        key: 'estado',
        label: 'Estado',
        render: (value) => <StatusSwitch value={value} />,
      },
      {
        key: 'acciones',
        label: 'Acciones',
        render: (_, lote) => {
          const isAnulado = String(lote.estado).toLowerCase() === 'anulado';
          return (
            <RowActions
              onView={() => setDetailModal({ isOpen: true, data: lote })}
              onEdit={() => {
                setSelectedLote(lote);
                setShowModal(true);
              }}
              editDisabled={!can('produccion', 'editar')}
              onDelete={
                !isAnulado
                  ? () =>
                      setDeleteDialog({
                        isOpen: true,
                        id: lote.id_lote,
                        nombre: `Lote #${lote.id_lote}`,
                      })
                  : undefined
              }
              deleteDisabled={!can('produccion', 'eliminar') || isAnulado}
              deleteTitle="Anular Lote"
            />
          );
        },
      },
    ],
    [can, fichasNames, usuariosNames, setDetailModal, setShowModal, setDeleteDialog]
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

      {/* Tabla con DataTable y RowActions */}
      <DataTable
        columns={columns}
        data={filteredData}
        searchPlaceholder="Buscar por código de lote, receta o responsable..."
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
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
          { label: 'ID', value: `#${detailModal.data.id_lote}` },
          { label: 'Ficha / Receta', value: fichasNames[detailModal.data.id_ficha] || `Receta #${detailModal.data.id_ficha}` },
          { label: 'Responsable', value: usuariosNames[detailModal.data.id_usuario_responsable] || `Usuario #${detailModal.data.id_usuario_responsable}` },
          { label: 'Fecha de Producción', value: detailModal.data.fecha_produccion },
          { label: 'Cantidad Producida', value: `${Number(detailModal.data.cantidad_producida || 0).toLocaleString('es-CO')} und` },
          {
            label: 'Insumos Utilizados',
            value: (() => {
              const list = getLoteInsumosList(detailModal.data);
              if (!list || list.length === 0) return 'Sin registro de insumos';
              return (
                <div className="space-y-1 w-full text-left">
                  {list.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between gap-3 text-xs bg-card p-1.5 rounded border border-border/50">
                      <span className="font-medium text-foreground">{item.nombre}</span>
                      <span className="font-semibold text-primary px-2 py-0.5 bg-primary/10 rounded">
                        {item.cantidad} {item.unidad_medida || 'kg'}
                      </span>
                    </div>
                  ))}
                </div>
              );
            })(),
          },
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
