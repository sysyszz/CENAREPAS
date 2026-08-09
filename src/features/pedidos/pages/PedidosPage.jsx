import { Plus, Search, Eye, Trash2, DollarSign } from 'lucide-react';
import { usePedidos } from '../hooks/usePedidos';
import { PedidoFormModal } from '../components/PedidoFormModal';
import ConfirmDialog from '../../../shared/components/ConfirmDialog';
import Toast from '../../../shared/components/Toast';

export default function PedidosPage() {
  const {
    pedidos,
    showModal,
    setShowModal,
    deleteDialog,
    setDeleteDialog,
    isDeleting,
    toast,
    setToast,
    handleDelete,
  } = usePedidos();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Pedidos</h1>
          <p className="text-muted-foreground">Gestión de pedidos de clientes</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
        >
          <Plus className="w-5 h-5" />
          Nuevo Pedido
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card p-4 rounded-lg border border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-warning/10 rounded-lg">
              <DollarSign className="w-5 h-5 text-warning" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pendientes</p>
              <h3>2 pedidos</h3>
            </div>
          </div>
        </div>
        <div className="bg-card p-4 rounded-lg border border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-success/10 rounded-lg">
              <DollarSign className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Completados</p>
              <h3>1 pedido</h3>
            </div>
          </div>
        </div>
        <div className="bg-card p-4 rounded-lg border border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <DollarSign className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Pendiente</p>
              <h3>$185.00</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-card p-4 rounded-lg border border-border">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="search"
              placeholder="Buscar pedido..."
              className="w-full pl-10 pr-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <select className="px-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring">
            <option>Todos los estados</option>
            <option>Pendiente</option>
            <option>Completado</option>
            <option>Cancelado</option>
          </select>
        </div>
      </div>

      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="text-left px-6 py-3">Código</th>
              <th className="text-left px-6 py-3">Cliente</th>
              <th className="text-left px-6 py-3">Fecha</th>
              <th className="text-left px-6 py-3">Total</th>
              <th className="text-left px-6 py-3">Abono</th>
              <th className="text-left px-6 py-3">Saldo</th>
              <th className="text-left px-6 py-3">Estado</th>
              <th className="text-left px-6 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {pedidos.map((pedido) => (
              <tr key={pedido.id} className="border-b border-border hover:bg-muted/50">
                <td className="px-6 py-4">{pedido.codigo}</td>
                <td className="px-6 py-4">{pedido.cliente}</td>
                <td className="px-6 py-4 text-muted-foreground">{pedido.fecha}</td>
                <td className="px-6 py-4">{pedido.total}</td>
                <td className="px-6 py-4 text-success">{pedido.abono}</td>
                <td className="px-6 py-4">{pedido.saldo}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-sm ${
                    pedido.estado === 'Completado'
                      ? 'bg-success/10 text-success'
                      : pedido.estado === 'Pendiente'
                      ? 'bg-warning/10 text-warning'
                      : 'bg-destructive/10 text-destructive'
                  }`}>
                    {pedido.estado}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-muted rounded-lg">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 hover:bg-muted rounded-lg">
                      <DollarSign className="w-4 h-4 text-success" />
                    </button>
                    <button
                      onClick={() => setDeleteDialog({ isOpen: true, id: pedido.id, nombre: pedido.codigo })}
                      className="p-2 hover:bg-muted rounded-lg text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <PedidoFormModal open={showModal} onClose={() => setShowModal(false)} />

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        title="Eliminar Pedido"
        message={`¿Estás seguro de que deseas eliminar el pedido "${deleteDialog.nombre}"? Esta acción no se puede deshacer.`}
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
