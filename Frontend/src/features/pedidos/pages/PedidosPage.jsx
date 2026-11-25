import { useState, useMemo, useEffect } from 'react';
import { ClipboardList, CheckCircle, Truck, DollarSign, ChevronDown } from 'lucide-react';
import { usePedidos } from '../hooks/usePedidos';
import { getClientes } from '../../clientes/services/clientesService';
import { getUsuarios } from '../../usuarios/services/usuariosService';
import { getSedes } from '../../sedes/services/sedesService';
import { DataTable } from '../../../shared/components/DataTable';
import { RowActions } from '../../../shared/components/RowActions';
import { PedidoFormModal } from '../components/PedidoFormModal';
import ConfirmDialog from '../../../shared/components/ConfirmDialog';
import DetailModal from '../../../shared/components/DetailModal';
import PageHeader from '../../../shared/components/PageHeader';
import { MetricCard } from '../../../shared/components/MetricCard';
import { usePermissions } from '../../../shared/contexts/PermissionContext';
import { CustomSelect } from '../../../shared/components/CustomSelect';
import ErrorBanner from '../../../shared/components/ErrorBanner';
import { exportToPdf } from '../../../shared/utils/exportToPdf';
import { exportToExcel } from '../../../shared/utils/exportToExcel';
import { getEstadosDestino } from '../services/pedidosService';

export default function PedidosPage() {
  const { can } = usePermissions();
  const {
    rawPedidos,
    resumen,
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
    statusDialog,
    setStatusDialog,
    isDeleting,
    isSaving,
    isUpdatingStatus,
    isLoading,
    loadError,
    isLoadingResumen,
    resumenError,
    refetch,
    refetchResumen,
    handleSave,
    handleDelete,
    handleRequestStatusChange,
    handleConfirmStatusChange,
  } = usePedidos();

  const [selectedPedido, setSelectedPedido] = useState(null);
  const [clientes, setClientes] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [sedes, setSedes] = useState([]);

  useEffect(() => {
    getClientes().then((data) => {
      if (Array.isArray(data)) setClientes(data);
    }).catch(() => {});
    getUsuarios().then((data) => {
      if (Array.isArray(data)) setUsuarios(data);
    }).catch(() => {});
    getSedes().then((data) => {
      if (Array.isArray(data)) setSedes(data);
    }).catch(() => {});
  }, []);

  const clientesNames = useMemo(
    () => Object.fromEntries(clientes.map((c) => [c.id_cliente, c.nombre])),
    [clientes]
  );

  const usuariosNames = useMemo(
    () => Object.fromEntries(usuarios.map((u) => [u.id_usuario, u.nombre])),
    [usuarios]
  );

  const sedesNames = useMemo(
    () => Object.fromEntries(sedes.map((s) => [s.id_sede, s.nombre])),
    [sedes]
  );


  const valorTarjeta = (valor) => {
    if (isLoadingResumen) return 'Cargando…';
    if (resumenError) return '—';
    return Number(valor || 0).toLocaleString('es-CO');
  };

  const filteredData = useMemo(() => {
    return rawPedidos.filter((p) => {
      const q = searchQuery.toLowerCase().trim();
      const clienteNombre = (clientesNames[p.id_cliente] || '').toLowerCase();
      const usuarioNombre = (usuariosNames[p.id_usuario] || '').toLowerCase();
      const matchesSearch =
        !q ||
        String(p.id_pedido).toLowerCase().includes(q) ||
        String(p.id_cliente).toLowerCase().includes(q) ||
        clienteNombre.includes(q) ||
        usuarioNombre.includes(q) ||
        (p.observaciones || '').toLowerCase().includes(q);

      const isTodosEstado = estadoFilter === 'Todos' || estadoFilter === 'Todos los estados';
      const matchesEstado =
        isTodosEstado || String(p.estado).toLowerCase() === estadoFilter.toLowerCase();

      return matchesSearch && matchesEstado;
    });
  }, [rawPedidos, searchQuery, estadoFilter, clientesNames, usuariosNames]);

  const columns = useMemo(
    () => [
      {
        key: 'id_pedido',
        label: 'ID',
        render: (value) => <span className="font-mono font-medium text-xs">#{value}</span>,
      },
      {
        key: 'id_cliente',
        label: 'Cliente',
        render: (value) => (
          <span className="font-semibold text-foreground">
            {clientesNames[value] || (typeof value === 'string' && isNaN(Number(value)) ? value : `Cliente #${value}`)}
          </span>
        ),
      },
      {
        key: 'id_sede',
        label: 'Sede',
        render: (value) => <span className="text-muted-foreground text-xs">{value === 1 ? 'Sede Principal (Ibagué)' : `Sede #${value}`}</span>,
      },
      {
        key: 'id_usuario',
        label: 'Asesor',
        render: (value) => <span className="text-muted-foreground text-xs">{usuariosNames[value] || `Usuario #${value}`}</span>,
      },
      {
        key: 'fecha_pedido',
        label: 'Fecha Pedido',
        render: (value) => <span className="text-muted-foreground text-xs">{value}</span>,
      },
      {
        key: 'fecha_entrega',
        label: 'Fecha Entrega',
        render: (value) => <span className="text-muted-foreground text-xs">{value || 'Por definir'}</span>,
      },
      {
        key: 'valor_total',
        label: 'Valor Total',
        render: (value, p) => (
          <span className="font-semibold text-primary">
            ${Number(p.totalNum || value || 0).toLocaleString('es-CO')}
          </span>
        ),
      },
      {
        key: 'estado',
        label: 'Estado',
        width: '180px',
        render: (value, pedido) => (
          <div className="relative">
            <select
              aria-label={`Estado del pedido ${pedido.id_pedido}`}
              value={value}
              disabled={!can('pedidos', 'cambiar_estado')}
              onChange={(event) => {
                const nextEstado = event.target.value;
                if (nextEstado !== value) handleRequestStatusChange(pedido, nextEstado);
              }}
              className="h-10 w-full appearance-none rounded-lg border border-input bg-input-background px-3.5 pr-9 text-sm font-medium text-foreground shadow-xs transition-colors hover:border-[#C1502D]/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C1502D]/20 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:border-[#E8B23D]/40"
            >
              <option value={value}>{value}</option>
              {getEstadosDestino(value, { incluirAnulado: can('pedidos', 'anular') }).map((estado) => (
                <option key={estado} value={estado}>{estado}</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>
        ),
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
            deleteDisabled={!can('pedidos', 'anular')}
          />
        ),
      },
    ],
    [can, setDetailModal, setShowModal, setDeleteDialog, handleRequestStatusChange]
  );

  const handleExportPdf = () => {
    exportToPdf({
      data: filteredData,
      columns: [
        { header: 'ID', key: 'id_pedido' },
        {
          header: 'Cliente',
          accessor: (p) => p.cliente_nombre || clientesNames[p.id_cliente] || `Cliente #${p.id_cliente}`,
        },
        {
          header: 'Sede Despacho',
          accessor: (p) => p.sede_nombre || sedesNames[p.id_sede] || `Sede #${p.id_sede}`,
        },
        { header: 'Fecha Entrega', key: 'fecha_entrega' },
        {
          header: 'Valor Total',
          accessor: (p) => `$${Number(p.valor_total || 0).toLocaleString('es-CO')}`,
        },
        { header: 'Estado', key: 'estado' },
      ],
      title: 'Reporte de Pedidos de Clientes',
      subtitle: 'Órdenes de pedido, sedes de despacho y estado de entrega en CENAREPAS',
    });
  };

  const handleExportExcel = () => {
    exportToExcel({
      data: filteredData,
      columns: [
        { header: 'ID Pedido', key: 'id_pedido', align: 'center' },
        {
          header: 'Cliente Solicitante',
          accessor: (p) => p.cliente_nombre || clientesNames[p.id_cliente] || `Cliente #${p.id_cliente}`,
        },
        {
          header: 'Sede de Despacho',
          accessor: (p) => p.sede_nombre || sedesNames[p.id_sede] || `Sede #${p.id_sede}`,
        },
        { header: 'Fecha Estimada Entrega', key: 'fecha_entrega', align: 'center' },
        {
          header: 'Valor Total ($)',
          accessor: (p) => `$${Number(p.valor_total || 0).toLocaleString('es-CO')}`,
          align: 'right',
        },
        { header: 'Estado', key: 'estado', align: 'center' },
        { header: 'Observaciones', key: 'observaciones' },
      ],
      title: 'Reporte de Pedidos de Clientes',
      subtitle: 'Órdenes de pedido, sedes de despacho y estado de entrega en CENAREPAS',
      sheetName: 'Pedidos',
    });
  };

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
        onExportPdf={handleExportPdf}
        onExportExcel={handleExportExcel}
      />

      {/* Tarjetas de Consolidado */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-stretch">
        <MetricCard index={0} title="Total Pedidos" value={valorTarjeta(resumen?.total_pedidos)} icon={ClipboardList} variant="primary" />
        <MetricCard index={1} title="Entregados" value={valorTarjeta(resumen?.entregados)} icon={CheckCircle} variant="success" />
        <MetricCard index={2} title="En Camino" value={valorTarjeta(resumen?.en_camino)} icon={Truck} variant="warning" />
        <MetricCard index={3} title="Valor Facturado" value={`$${valorTarjeta(resumen?.valor_facturado)}`} icon={DollarSign} variant="accent" />
      </div>

      <ErrorBanner message={resumenError} onRetry={refetchResumen} />
      <ErrorBanner message={loadError} onRetry={refetch} />

      {/* Tabla con DataTable */}
      <DataTable
        columns={columns}
        data={filteredData}
        isLoading={isLoading}
        emptyIcon={ClipboardList}
        entityName="pedidos"
        onAdd={() => {
          setSelectedPedido(null);
          setShowModal(true);
        }}
        addLabel="Nuevo Pedido"
        addDisabled={!can('pedidos', 'crear')}
        isFiltered={Boolean(searchQuery || estadoFilter !== 'Todos')}
        searchPlaceholder="Buscar por número, cliente o observaciones..."
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        filters={
          <CustomSelect
            value={estadoFilter}
            onChange={(e) => setEstadoFilter(e.target.value)}
            className="w-full sm:w-52"
          >
            <option value="Todos">Todos los estados</option>
            <option value="Pendiente">Pendiente</option>
            <option value="En proceso">En proceso</option>
            <option value="Entregado">Entregado</option>
            <option value="Anulado">Anulado</option>
          </CustomSelect>
        }
      />

      <DetailModal
        isOpen={detailModal.isOpen}
        onClose={() => setDetailModal({ isOpen: false, data: null })}
        title="Detalle del Pedido de Arepas"
        fields={detailModal.data ? [
          { label: 'ID Pedido', value: `#${detailModal.data.id_pedido}` },
          { label: 'Cliente', value: clientesNames[detailModal.data.id_cliente] || `Cliente #${detailModal.data.id_cliente}` },
          { label: 'Sede / Punto de Entrega', value: detailModal.data.id_sede === 1 ? 'Sede Principal (Ibagué)' : `Sede #${detailModal.data.id_sede}` },
          { label: 'Asesor / Registrado por', value: usuariosNames[detailModal.data.id_usuario] || `Usuario #${detailModal.data.id_usuario}` },
          { label: 'Fecha de Creación', value: detailModal.data.fecha_pedido },
          { label: 'Fecha de Entrega Estimada', value: detailModal.data.fecha_entrega || 'Por definir' },
          { label: 'Valor Total', value: <span className="font-semibold text-primary">{`$${Number(detailModal.data.totalNum || detailModal.data.valor_total || 0).toLocaleString('es-CO')}`}</span> },
          {
            label: 'Productos del Pedido',
            value: (
              <div className="space-y-1 mt-1 text-left w-full">
                {(detailModal.data.detalles || []).map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs py-1 border-b border-border/40 last:border-0">
                    <span className="font-medium text-foreground">{item.producto_nombre || `Producto #${item.id_producto}`}</span>
                    <span className="text-muted-foreground">{item.cantidad} und x ${Number(item.precio_unitario).toLocaleString('es-CO')} = <strong className="text-primary">${Number(item.subtotal).toLocaleString('es-CO')}</strong></span>
                  </div>
                ))}
              </div>
            ),
          },
          { label: 'Observaciones', value: detailModal.data.observaciones || 'Sin observaciones' },
          { label: 'Motivo de Anulación', value: detailModal.data.motivo_anulacion || 'N/A' },
          { label: 'Estado', value: detailModal.data.estado },
        ] : []}
      />

      <PedidoFormModal
        open={showModal}
        pedido={selectedPedido}
        onSave={handleSave}
        isLoading={isSaving}
        canChangeStatus={can('pedidos', 'cambiar_estado')}
        canCancel={can('pedidos', 'anular')}
        onClose={() => {
          setShowModal(false);
          setSelectedPedido(null);
        }}
      />

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        title="Anular Pedido"
        message={`¿Estás seguro de que deseas anular el pedido "${deleteDialog.nombre}"?`}
        confirmText="Anular"
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialog({ isOpen: false, id: null, nombre: '' })}
        isLoading={isDeleting}
      />

      {/* Modal de confirmación para Cambio de Estado */}
      <ConfirmDialog
        isOpen={statusDialog.isOpen}
        title={`Cambiar Estado a ${statusDialog.nextEstado}`}
        message={`¿Estás seguro de que deseas cambiar el estado del pedido #${statusDialog.pedido?.id_pedido} de ${statusDialog.pedido?.estado || 'Pendiente'} a ${statusDialog.nextEstado}?`}
        confirmText={`Cambiar a ${statusDialog.nextEstado}`}
        confirmVariant={statusDialog.nextEstado === 'Entregado' ? 'success' : 'warning'}
        onConfirm={handleConfirmStatusChange}
        onCancel={() => setStatusDialog({ isOpen: false, pedido: null, nextEstado: '' })}
        isLoading={isUpdatingStatus}
        loadingText="Cambiando estado…"
      />
    </div>
  );
}
