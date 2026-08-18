import { Plus, Search, Eye, Edit, Trash2, FileDown, FileSpreadsheet, ClipboardList, CheckCircle, Truck, DollarSign } from 'lucide-react';
import { usePedidos } from '../hooks/usePedidos';
import { PedidoFormModal } from '../components/PedidoFormModal';
import ConfirmDialog from '../../../shared/components/ConfirmDialog';
import Toast from '../../../shared/components/Toast';

export default function PedidosPage() {
  const {
    pedidos,
    rawPedidos,
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
    toast,
    setToast,
    handleDelete,
  } = usePedidos();

  const totalPedidos = rawPedidos.length;
  const entregados = rawPedidos.filter((p) => p.estado === 'Entregado').length;
  const enCamino = rawPedidos.filter((p) => p.estado === 'En Camino').length;
  const totalFacturado = rawPedidos.reduce((acc, p) => acc + (p.totalNum || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header con exportación */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Pedidos de Clientes</h1>
          <p className="text-muted-foreground">Despachos y pedidos para cadenas, supermercados y distribución de Masarepas</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-muted text-sm font-medium transition-colors">
            <FileDown className="w-4 h-4" />
            Exportar PDF
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-muted text-sm font-medium transition-colors">
            <FileSpreadsheet className="w-4 h-4" />
            Exportar Excel
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nuevo Pedido
          </button>
        </div>
      </div>

      {/* Tarjetas de Consolidado */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card p-4 rounded-lg border border-border flex items-center gap-3">
          <div className="p-3 bg-primary/10 rounded-lg text-primary">
            <ClipboardList className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Pedidos</p>
            <h3 className="text-xl font-bold">{totalPedidos}</h3>
          </div>
        </div>
        <div className="bg-card p-4 rounded-lg border border-border flex items-center gap-3">
          <div className="p-3 bg-success/10 rounded-lg text-success">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Entregados</p>
            <h3 className="text-xl font-bold">{entregados}</h3>
          </div>
        </div>
        <div className="bg-card p-4 rounded-lg border border-border flex items-center gap-3">
          <div className="p-3 bg-warning/10 rounded-lg text-warning">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">En Camino</p>
            <h3 className="text-xl font-bold">{enCamino}</h3>
          </div>
        </div>
        <div className="bg-card p-4 rounded-lg border border-border flex items-center gap-3">
          <div className="p-3 bg-accent/10 rounded-lg text-primary">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Valor Facturado</p>
            <h3 className="text-xl font-bold">${totalFacturado.toLocaleString('es-CO')}</h3>
          </div>
        </div>
      </div>

      {/* Filtros y Búsqueda */}
      <div className="bg-card p-4 rounded-lg border border-border flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Buscar por número, cliente o resumen de productos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-input bg-input-background rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <select
          value={estadoFilter}
          onChange={(e) => setEstadoFilter(e.target.value)}
          className="px-4 py-2 border border-input bg-input-background rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="Todos">Todos los estados</option>
          <option value="Entregado">Entregado</option>
          <option value="En Camino">En Camino</option>
          <option value="Pendiente">Pendiente</option>
        </select>
      </div>

      {/* Tabla Estandarizada */}
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted text-muted-foreground font-semibold">
            <tr>
              <th className="px-6 py-3">Pedido #</th>
              <th className="px-6 py-3">Cliente</th>
              <th className="px-6 py-3">Resumen de Items</th>
              <th className="px-6 py-3">Fecha Pedido</th>
              <th className="px-6 py-3">Fecha Entrega</th>
              <th className="px-6 py-3">Total</th>
              <th className="px-6 py-3">Estado</th>
              <th className="px-6 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {pedidos.length > 0 ? (
              pedidos.map((pedido) => (
                <tr key={pedido.id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4 font-mono font-medium">{pedido.codigo}</td>
                  <td className="px-6 py-4 font-semibold">{pedido.cliente}</td>
                  <td className="px-6 py-4 text-muted-foreground max-w-xs truncate">{pedido.itemsResumen}</td>
                  <td className="px-6 py-4 text-muted-foreground">{pedido.fechaPedido}</td>
                  <td className="px-6 py-4 text-muted-foreground">{pedido.fechaEntrega}</td>
                  <td className="px-6 py-4 font-semibold">{pedido.total}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        pedido.estado === 'Entregado'
                          ? 'bg-success/10 text-success'
                          : pedido.estado === 'En Camino'
                          ? 'bg-warning/10 text-warning'
                          : 'bg-primary/10 text-primary'
                      }`}
                    >
                      {pedido.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setDetailModal({ isOpen: true, data: pedido })}
                        className="p-2 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground"
                        title="Ver detalle"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setShowModal(true)}
                        className="p-2 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground"
                        title="Editar"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteDialog({ isOpen: true, id: pedido.id, nombre: pedido.codigo })}
                        className="p-2 hover:bg-muted rounded-lg text-destructive"
                        title="Eliminar pedido"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="px-6 py-8 text-center text-muted-foreground">
                  No se encontraron pedidos.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal de Detalle */}
      {detailModal.isOpen && detailModal.data && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card p-6 rounded-lg max-w-md w-full border border-border space-y-4">
            <h3 className="text-lg font-bold">Detalle del Pedido</h3>
            <div className="space-y-2 text-sm">
              <p><strong>Pedido #:</strong> {detailModal.data.codigo}</p>
              <p><strong>Cliente:</strong> {detailModal.data.cliente}</p>
              <p><strong>Detalle de la Orden:</strong> {detailModal.data.itemsResumen}</p>
              <p><strong>Fecha de Solicitud:</strong> {detailModal.data.fechaPedido}</p>
              <p><strong>Fecha Prometida de Entrega:</strong> {detailModal.data.fechaEntrega}</p>
              <p><strong>Valor Total:</strong> {detailModal.data.total}</p>
              <p><strong>Vendedor Encargado:</strong> {detailModal.data.vendedor}</p>
              <p><strong>Estado:</strong> {detailModal.data.estado}</p>
            </div>
            <div className="flex justify-end pt-4">
              <button
                onClick={() => setDetailModal({ isOpen: false, data: null })}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      <PedidoFormModal open={showModal} onClose={() => setShowModal(false)} />

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        title="Eliminar Pedido"
        message={`¿Estás seguro de que deseas eliminar el pedido "${deleteDialog.nombre}"? Esta acción no se puede deshacer.`}
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

