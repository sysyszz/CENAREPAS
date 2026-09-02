import { useState, useMemo, useEffect } from 'react';
import { ShoppingCart, CheckCircle, Clock, DollarSign } from 'lucide-react';
import { useCompras } from '../hooks/useCompras';
import { mockProveedores, getProveedores } from '../../proveedores/services/proveedoresService';
import { mockUsuarios } from '../../usuarios/services/usuariosService';
import { DataTable } from '../../../shared/components/DataTable';
import { RowActions } from '../../../shared/components/RowActions';
import { CompraFormModal } from '../components/CompraFormModal';
import { mockDetallesCompra } from '../services/comprasService';
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
  } = useCompras();

  const [selectedCompra, setSelectedCompra] = useState(null);
  const [proveedores, setProveedores] = useState(mockProveedores);

  useEffect(() => {
    getProveedores().then((data) => {
      if (data && data.length > 0) setProveedores(data);
    });
  }, []);

  const proveedoresNames = useMemo(
    () => Object.fromEntries(proveedores.map((p) => [p.id_proveedor, p.nombre])),
    [proveedores]
  );

  const usuariosNames = useMemo(
    () => Object.fromEntries(mockUsuarios.map((u) => [u.id_usuario, u.nombre])),
    []
  );

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
      const q = (searchQuery || '').toLowerCase().trim();
      const proveedorNombre = (proveedoresNames[c.id_proveedor] || '').toLowerCase();
      const usuarioNombre = (usuariosNames[c.id_usuario] || '').toLowerCase();
      const matchesSearch =
        !q ||
        String(c.id_compra).toLowerCase().includes(q) ||
        String(c.id_proveedor).toLowerCase().includes(q) ||
        String(c.id_usuario).toLowerCase().includes(q) ||
        proveedorNombre.includes(q) ||
        usuarioNombre.includes(q) ||
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
        render: (value) => (
          <span className="font-semibold text-foreground">
            {proveedoresNames[value] || (typeof value === 'string' && isNaN(Number(value)) ? value : `Proveedor #${value}`)}
          </span>
        ),
      },
      {
        key: 'id_usuario',
        label: 'Registrado por',
        render: (value) => (
          <span className="text-muted-foreground text-sm">
            {usuariosNames[value] || `Usuario #${value}`}
          </span>
        ),
      },
      {
        key: 'fecha_compra',
        label: 'Fecha Compra',
        render: (value) => <span className="text-muted-foreground text-sm">{value}</span>,
      },
      {
        key: 'valor_total',
        label: 'Valor Total',
        render: (value, c) => (
          <span className="font-semibold text-primary">
            ${Number(c.totalNum || value || 0).toLocaleString('es-CO')}
          </span>
        ),
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
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
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
        title="Detalle de la Orden de Compra"
        fields={detailModal.data ? [
          { label: 'ID Compra', value: `#${detailModal.data.id_compra}` },
          { label: 'Proveedor', value: proveedoresNames[detailModal.data.id_proveedor] || `Proveedor #${detailModal.data.id_proveedor}` },
          { label: 'Registrado por (Usuario)', value: usuariosNames[detailModal.data.id_usuario] || `Usuario #${detailModal.data.id_usuario}` },
          { label: 'Fecha de Compra', value: detailModal.data.fecha_compra },
          { label: 'Valor Total', value: <span className="font-semibold text-primary">{`$${Number(detailModal.data.totalNum || detailModal.data.valor_total || 0).toLocaleString('es-CO')}`}</span> },
          { label: 'Medio de Pago', value: <span className="capitalize">{detailModal.data.medio_pago}</span> },
          {
            label: 'Insumos Comprados',
            value: (
              <div className="space-y-1 mt-1 text-left w-full">
                {(detailModal.data.detalles || mockDetallesCompra.filter((d) => d.id_compra === detailModal.data.id_compra)).map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs py-1 border-b border-border/40 last:border-0">
                    <span className="font-medium text-foreground">{item.nombre_insumo || `Insumo #${item.id_insumo}`}</span>
                    <span className="text-muted-foreground">{item.cantidad} {item.unidad_medida || 'kg'} x ${Number(item.valor_unitario).toLocaleString('es-CO')} = <strong className="text-primary">${Number(item.subtotal).toLocaleString('es-CO')}</strong></span>
                  </div>
                ))}
              </div>
            ),
          },
          {
            label: 'Comprobante / Factura',
            value: detailModal.data.comprobante_url ? (
              <a
                href={detailModal.data.comprobante_url}
                target="_blank"
                rel="noreferrer"
                className="text-primary hover:underline font-medium text-xs inline-flex items-center gap-1"
              >
                Ver comprobante adjunto
              </a>
            ) : (
              'Sin comprobante adjunto'
            ),
          },
          { label: 'Fecha de Registro', value: detailModal.data.fecha_registro || 'N/A' },
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
