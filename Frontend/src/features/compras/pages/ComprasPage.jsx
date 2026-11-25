import { useState, useMemo, useEffect } from 'react';
import { ShoppingCart, CheckCircle, XCircle, DollarSign, ExternalLink, Download } from 'lucide-react';
import { useCompras } from '../hooks/useCompras';
import { getProveedores } from '../../proveedores/services/proveedoresService';
import { getSoporteCompra } from '../services/comprasService';
import { getUsuarios } from '../../usuarios/services/usuariosService';
import { DataTable } from '../../../shared/components/DataTable';
import { RowActions } from '../../../shared/components/RowActions';
import { CompraFormModal } from '../components/CompraFormModal';
import ConfirmDialog from '../../../shared/components/ConfirmDialog';
import DetailModal from '../../../shared/components/DetailModal';
import PageHeader from '../../../shared/components/PageHeader';
import { MetricCard } from '../../../shared/components/MetricCard';
import { usePermissions } from '../../../shared/contexts/PermissionContext';
import { EstadoBadge } from '../../../shared/ui/EstadoBadge';
import { CustomSelect } from '../../../shared/components/CustomSelect';
import ErrorBanner from '../../../shared/components/ErrorBanner';
import { exportToPdf } from '../../../shared/utils/exportToPdf';
import { exportToExcel } from '../../../shared/utils/exportToExcel';
import { formatDate } from '../../../shared/utils/formatDate';

const COMPRA_STATUS_MAP = {
  registrada: { color: 'success', label: 'Registrada' },
  anulada: { color: 'destructive', label: 'Anulada' },
};

/**
 * Abre o descarga el soporte de una compra. El enlace se pide al hacer clic:
 * las facturas son privadas (enlace temporal o archivo con la sesión).
 */
function SoporteCompra({ compra }) {
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  const usar = async (descargar) => {
    setError('');
    // La ventana se abre antes de esperar al servidor para que el navegador no la bloquee.
    const ventana = descargar ? null : window.open('', '_blank');
    setCargando(true);
    try {
      const { url, local } = await getSoporteCompra(compra.id_compra);
      if (!url) throw new Error('No se encontró el soporte');
      if (descargar) {
        const enlace = document.createElement('a');
        enlace.href = url;
        enlace.download = `soporte-compra-${compra.id_compra}`;
        enlace.rel = 'noopener';
        document.body.appendChild(enlace);
        enlace.click();
        enlace.remove();
      } else if (ventana) {
        ventana.opener = null;
        ventana.location.href = url;
      } else {
        window.open(url, '_blank', 'noopener');
      }
      if (local) setTimeout(() => URL.revokeObjectURL(url), 60000);
    } catch (err) {
      ventana?.close();
      setError(err.message || 'No se pudo abrir el soporte');
    } finally {
      setCargando(false);
    }
  };

  const boton = 'inline-flex items-center gap-1.5 h-8 px-3 rounded-lg border border-border bg-card text-xs font-semibold text-foreground hover:bg-muted transition-colors cursor-pointer disabled:opacity-50';
  return (
    <div className="space-y-1">
      <div className="flex flex-wrap gap-2">
        <button type="button" className={boton} disabled={cargando} onClick={() => usar(false)}>
          <ExternalLink className="size-3.5" />
          Abrir
        </button>
        <button type="button" className={boton} disabled={cargando} onClick={() => usar(true)}>
          <Download className="size-3.5" />
          Descargar
        </button>
      </div>
      {error && <p role="alert" className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

export default function ComprasPage() {
  const { can } = usePermissions();
  const {
    rawCompras,
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
    isLoading,
    loadError,
    refetch,
    handleSave,
    handleAnular,
  } = useCompras();

  const [selectedCompra, setSelectedCompra] = useState(null);
  const [proveedores, setProveedores] = useState([]);
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    getProveedores().then((data) => {
      if (Array.isArray(data)) setProveedores(data);
    }).catch(() => {});
    getUsuarios().then((data) => {
      if (Array.isArray(data)) setUsuarios(data);
    }).catch(() => {});
  }, []);

  const proveedoresNames = useMemo(
    () => Object.fromEntries(proveedores.map((p) => [p.id_proveedor, p.nombre])),
    [proveedores]
  );

  const usuariosNames = useMemo(
    () => Object.fromEntries(usuarios.map((u) => [u.id_usuario, u.nombre])),
    [usuarios]
  );

  const totalCompras = rawCompras.length;
  const registradas = rawCompras.filter(
    (c) => String(c.estado).toLowerCase() === 'registrada'
  ).length;
  const anuladas = rawCompras.filter(
    (c) => String(c.estado).toLowerCase() === 'anulada'
  ).length;
  const totalInvertido = rawCompras
    .filter((c) => String(c.estado).toLowerCase() === 'registrada')
    .reduce((acc, c) => acc + (Number(c.valor_total) || 0), 0);

  const filteredData = useMemo(() => {
    return rawCompras.filter((c) => {
      const q = (searchQuery || '').toLowerCase().trim();
      const proveedorNombre = (c.proveedor_nombre || proveedoresNames[c.id_proveedor] || '').toLowerCase();
      const usuarioNombre = (c.usuario_nombre || usuariosNames[c.id_usuario] || '').toLowerCase();
      const insumoMatch = (c.detalles || []).some((d) =>
        String(d.insumo_nombre || '').toLowerCase().includes(q)
      );
      const matchesSearch =
        !q ||
        String(c.id_compra).toLowerCase().includes(q) ||
        String(c.id_proveedor).toLowerCase().includes(q) ||
        String(c.id_usuario).toLowerCase().includes(q) ||
        proveedorNombre.includes(q) ||
        usuarioNombre.includes(q) ||
        insumoMatch ||
        String(c.medio_pago || '').toLowerCase().includes(q);

      const isTodos = estadoFilter === 'Todos' || estadoFilter === 'Todos los estados';
      const matchesEstado = isTodos || String(c.estado).toLowerCase() === estadoFilter.toLowerCase();
      return matchesSearch && matchesEstado;
    });
  }, [rawCompras, searchQuery, estadoFilter, proveedoresNames, usuariosNames]);

  const columns = useMemo(
    () => [
      {
        key: 'id_compra',
        label: 'ID',
        render: (value) => <span className="font-mono font-medium text-xs">#{value}</span>,
      },
      {
        key: 'id_proveedor',
        label: 'Proveedor',
        render: (value, compra) => (
          <span className="font-semibold text-foreground">
            {compra.proveedor_nombre || proveedoresNames[value] || '—'}
          </span>
        ),
      },
      {
        key: 'id_usuario',
        label: 'Registrado por',
        render: (value, compra) => (
          <span className="text-muted-foreground text-sm">
            {compra.usuario_nombre || usuariosNames[value] || '—'}
          </span>
        ),
      },
      {
        key: 'fecha_compra',
        label: 'Fecha Compra',
        render: (value) => <span className="text-muted-foreground text-sm whitespace-nowrap">{formatDate(value)}</span>,
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
        render: (value) => <EstadoBadge value={value} statusMap={COMPRA_STATUS_MAP} />,
      },
      {
        key: 'acciones',
        label: 'Acciones',
        render: (_, compra) => {
          const isAnulada = String(compra.estado).toLowerCase() === 'anulada';
          return (
            <RowActions
              onView={() => setDetailModal({ isOpen: true, data: compra })}
              onEdit={() => {
                setSelectedCompra(compra);
                setShowModal(true);
              }}
              editDisabled={!can('compras', 'editar') || isAnulada}
              onDelete={
                !isAnulada
                  ? () =>
                      setDeleteDialog({
                        isOpen: true,
                        id: compra.id_compra,
                        nombre: `#${compra.id_compra}`,
                      })
                  : undefined
              }
              deleteDisabled={!can('compras', 'anular') || isAnulada}
              deleteIcon="x"
              deleteTitle="Anular compra"
            />
          );
        },
      },
    ],
    [can, proveedoresNames, usuariosNames, setDetailModal, setShowModal, setDeleteDialog]
  );

  const handleExportPdf = () => {
    exportToPdf({
      data: filteredData,
      columns: [
        { header: 'ID', key: 'id_compra' },
        { header: 'Fecha Compra', accessor: (c) => formatDate(c.fecha_compra) },
        {
          header: 'Proveedor',
          accessor: (c) => c.proveedor_nombre || proveedoresNames[c.id_proveedor] || '—',
        },
        {
          header: 'Valor Total',
          accessor: (c) => `$${Number(c.valor_total || 0).toLocaleString('es-CO')}`,
        },
        { header: 'Medio de Pago', key: 'medio_pago' },
        { header: 'Estado', key: 'estado' },
      ],
      title: 'Reporte de Órdenes de Compra',
      subtitle: 'Histórico de adquisiciones de materias primas a proveedores en CENAREPAS',
    });
  };

  const handleExportExcel = () => {
    exportToExcel({
      data: filteredData,
      columns: [
        { header: 'ID Compra', key: 'id_compra', align: 'center' },
        { header: 'Fecha de Compra', accessor: (c) => formatDate(c.fecha_compra), align: 'center' },
        {
          header: 'Proveedor',
          accessor: (c) => c.proveedor_nombre || proveedoresNames[c.id_proveedor] || '—',
        },
        {
          header: 'Valor Total ($)',
          accessor: (c) => `$${Number(c.valor_total || 0).toLocaleString('es-CO')}`,
          align: 'right',
        },
        { header: 'Medio de Pago', key: 'medio_pago' },
        { header: 'Estado', key: 'estado', align: 'center' },
        { header: 'Soporte', accessor: (c) => (c.comprobante_public_id || c.comprobante_url ? 'Adjunto' : 'Sin soporte') },
      ],
      title: 'Reporte de Órdenes de Compra',
      subtitle: 'Histórico de adquisiciones de materias primas a proveedores en CENAREPAS',
      sheetName: 'Compras',
    });
  };

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
        onExportPdf={handleExportPdf}
        onExportExcel={handleExportExcel}
      />

      {/* Tarjetas de Consolidado */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-stretch">
        <MetricCard index={0} title="Total Compras" value={totalCompras} icon={ShoppingCart} variant="primary" />
        <MetricCard index={1} title="Registradas" value={registradas} icon={CheckCircle} variant="success" />
        <MetricCard index={2} title="Anuladas" value={anuladas} icon={XCircle} variant="destructive" />
        <MetricCard index={3} title="Total Invertido" value={`$${totalInvertido.toLocaleString('es-CO')}`} icon={DollarSign} variant="accent" />
      </div>

      <ErrorBanner message={loadError} onRetry={refetch} />

      {/* Tabla con DataTable */}
      <DataTable
        columns={columns}
        data={filteredData}
        isLoading={isLoading}
        emptyIcon={ShoppingCart}
        entityName="compras"
        onAdd={() => {
          setSelectedCompra(null);
          setShowModal(true);
        }}
        addLabel="Nueva Compra"
        addDisabled={!can('compras', 'crear')}
        isFiltered={Boolean(searchQuery || estadoFilter !== 'Todos')}
        searchPlaceholder="Buscar por código, proveedor o insumo..."
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        filters={
          <CustomSelect
            value={estadoFilter}
            onChange={(e) => setEstadoFilter(e.target.value)}
            className="w-full sm:w-52"
          >
            <option value="Todos">Todos los estados</option>
            <option value="Registrada">Registrada</option>
            <option value="Anulada">Anulada</option>
          </CustomSelect>
        }
      />

      <DetailModal
        isOpen={detailModal.isOpen}
        onClose={() => setDetailModal({ isOpen: false, data: null })}
        title="Detalle de la Orden de Compra"
        fields={detailModal.data ? [
          { label: 'ID Compra', value: `#${detailModal.data.id_compra}` },
          { label: 'Proveedor', value: detailModal.data.proveedor_nombre || proveedoresNames[detailModal.data.id_proveedor] || '—' },
          { label: 'Registrado por (Usuario)', value: detailModal.data.usuario_nombre || usuariosNames[detailModal.data.id_usuario] || '—' },
          { label: 'Fecha de Compra', value: formatDate(detailModal.data.fecha_compra) },
          { label: 'Valor Total', value: <span className="font-semibold text-primary">{`$${Number(detailModal.data.valor_total || 0).toLocaleString('es-CO')}`}</span> },
          { label: 'Medio de Pago', value: <span className="capitalize">{detailModal.data.medio_pago || '—'}</span> },
          {
            label: 'Insumos Comprados',
            value: (detailModal.data.detalles || []).length > 0 ? (
              <div className="space-y-1 mt-1 text-left w-full">
                {(detailModal.data.detalles || []).map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs py-1 border-b border-border/40 last:border-0">
                    <span className="font-medium text-foreground">{item.insumo_nombre || `Insumo #${item.id_insumo}`}</span>
                    <span className="text-muted-foreground">{item.cantidad} {item.unidad_medida || ''} x ${Number(item.valor_unitario).toLocaleString('es-CO')} = <strong className="text-primary">${Number(item.subtotal).toLocaleString('es-CO')}</strong></span>
                  </div>
                ))}
              </div>
            ) : '—',
          },
          {
            label: 'Comprobante / Factura',
            value: detailModal.data.comprobante_public_id || detailModal.data.comprobante_url ? (
              <SoporteCompra compra={detailModal.data} />
            ) : (
              'Sin comprobante adjunto'
            ),
          },
          { label: 'Fecha de Registro', value: formatDate(detailModal.data.fecha_registro) },
          { label: 'Estado', value: <EstadoBadge value={detailModal.data.estado} statusMap={COMPRA_STATUS_MAP} /> },
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
        message={`¿Estás seguro de que deseas anular la compra ${deleteDialog.nombre}? Esta acción descontará los insumos sumados al inventario y no se puede deshacer.`}
        confirmText="Anular"
        onConfirm={handleAnular}
        onCancel={() => setDeleteDialog({ isOpen: false, id: null, nombre: '' })}
        isLoading={isDeleting}
      />
    </div>
  );
}
