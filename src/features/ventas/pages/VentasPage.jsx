import { useState } from 'react';
import { Plus, Eye, XCircle, FileDown, FileSpreadsheet, DollarSign, Calculator, TrendingUp, ShoppingBag } from 'lucide-react';
import { useVentas } from '../hooks/useVentas';
import { usePagination } from '../../../shared/hooks/usePagination';
import { PaginationControls } from '../../../shared/components/PaginationControls';
import { VentaFormModal } from '../components/VentaFormModal';
import ConfirmDialog from '../../../shared/components/ConfirmDialog';
import Toast from '../../../shared/components/Toast';
import { usePermissions } from '../../../shared/contexts/PermissionContext';
import StatusSwitch from '../../../shared/components/StatusSwitch';
import RecordsFilterToolbar from '../../../shared/components/RecordsFilterToolbar';
import RowActions from '../../../shared/components/RowActions';
import RecordsTable from '../../../shared/components/RecordsTable';
import StatCard from '../../../shared/components/StatCard';
import StatsGrid from '../../../shared/components/StatsGrid';

export default function VentasPage() {
  const { can } = usePermissions();
  const {
    ventas,
    showModal,
    setShowModal,
    deleteDialog,
    setDeleteDialog,
    isDeleting,
    toast,
    setToast,
    handleAnular,
  } = useVentas();
  const [searchTerm, setSearchTerm] = useState('');
  const filteredVentas = ventas.filter((venta) =>
    Object.values(venta).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );
  const pagination = usePagination(filteredVentas);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Ventas</h1>
          <p className="text-muted-foreground">Registro de ventas realizadas</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-muted">
            <FileDown className="w-5 h-5" />
            Exportar PDF
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-muted">
            <FileSpreadsheet className="w-5 h-5" />
            Exportar Excel
          </button>
          <button
            onClick={() => setShowModal(true)} disabled={!can('ventas', 'crear')}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
          >
            <Plus className="w-5 h-5" />
            Nueva Venta
          </button>
        </div>
      </div>

      <StatsGrid className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard variant="compact" label="Ventas Hoy" value="$77.00" icon={DollarSign} iconColor="hsl(var(--success))" iconBackground="hsl(var(--success) / 0.1)" />
        <StatCard variant="compact" label="Total Ventas" value="2 ventas" icon={Calculator} iconColor="hsl(var(--primary))" iconBackground="hsl(var(--primary) / 0.1)" />
        <StatCard variant="compact" label="Promedio" value="$38.50" icon={TrendingUp} iconColor="hsl(var(--accent))" iconBackground="hsl(var(--accent) / 0.1)" />
        <StatCard variant="compact" label="Productos Vendidos" value="45 unidades" icon={ShoppingBag} iconColor="hsl(var(--warning))" iconBackground="hsl(var(--warning) / 0.1)" />
      </StatsGrid>

      <RecordsFilterToolbar
        searchQuery={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Buscar venta..."
        className="flex-row gap-4"
        searchIconClassName="w-5 h-5"
        searchInputClassName="text-base"
      >
          <input
            type="date"
            className="px-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <select className="px-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring">
            <option>Todos los estados</option>
            <option>Completada</option>
            <option>Anulada</option>
          </select>
      </RecordsFilterToolbar>

      <RecordsTable
        columns={[
          { key: 'id_venta', label: 'ID' },
          { key: 'id_sede', label: 'Sede ID' },
          { key: 'id_cliente', label: 'Cliente ID' },
          { key: 'id_usuario', label: 'Usuario ID' },
          { key: 'fecha_venta', label: 'Fecha Venta' },
          { key: 'valor_total', label: 'Valor Total' },
          { key: 'estado', label: 'Estado' },
          { key: 'acciones', label: 'Acciones' },
        ]}
        data={pagination.paginatedData}
        rowKey={(venta) => venta.id_venta}
        tableClassName="w-full"
        headerClassName="bg-muted"
        bodyClassName=""
        renderRow={(venta) => (
          <>
                <td className="px-6 py-4">{venta.id_venta}</td><td className="px-6 py-4">{venta.id_sede}</td><td className="px-6 py-4">{venta.id_cliente}</td><td className="px-6 py-4">{venta.id_usuario}</td><td className="px-6 py-4">{venta.fecha_venta}</td><td className="px-6 py-4">{venta.valor_total}</td>
                <td className="px-6 py-4">
                  <StatusSwitch value={venta.estado} activeValue="completada" inactiveValue="anulada" />
                </td>
                <td className="px-6 py-4">
                  <RowActions className="flex items-center gap-2" actions={[
                    { key: 'view', icon: Eye, title: 'Ver detalle', className: 'p-2 hover:bg-muted rounded-lg' },
                    { key: 'cancel', icon: XCircle, title: 'Anular venta', onClick: () => setDeleteDialog({ isOpen: true, id: venta.id_venta, nombre: venta.id_venta }), disabled: !can('ventas', 'eliminar'), hidden: venta.estado === 'Anulada', className: 'p-2 hover:bg-muted rounded-lg text-destructive' },
                  ]} />
                </td>
          </>
        )}
      />

      <PaginationControls {...pagination} />

      <VentaFormModal open={showModal} onClose={() => setShowModal(false)} />

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        title="Anular Venta"
        message={`¿Estás seguro de que deseas anular la venta "${deleteDialog.nombre}"? Esta acción no se puede deshacer.`}
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
