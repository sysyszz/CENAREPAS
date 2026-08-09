import { Plus, Search, Eye, XCircle } from 'lucide-react';
import { useCompras } from '../hooks/useCompras';
import { CompraFormModal } from '../components/CompraFormModal';
import ConfirmDialog from '../../../shared/components/ConfirmDialog';
import Toast from '../../../shared/components/Toast';

export default function ComprasPage() {
  const {
    compras,
    showModal,
    setShowModal,
    deleteDialog,
    setDeleteDialog,
    isDeleting,
    toast,
    setToast,
    handleAnular,
  } = useCompras();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Compras</h1>
          <p className="text-muted-foreground">Gestión de compras a proveedores</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
        >
          <Plus className="w-5 h-5" />
          Nueva Compra
        </button>
      </div>

      <div className="bg-card p-4 rounded-lg border border-border">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="search"
              placeholder="Buscar compra..."
              className="w-full pl-10 pr-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <input
            type="date"
            className="px-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <select className="px-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring">
            <option>Todos los proveedores</option>
            <option>Distribuidora ABC</option>
            <option>Insumos XYZ</option>
          </select>
        </div>
      </div>

      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="text-left px-6 py-3">Factura</th>
              <th className="text-left px-6 py-3">Proveedor</th>
              <th className="text-left px-6 py-3">Fecha</th>
              <th className="text-left px-6 py-3">Total</th>
              <th className="text-left px-6 py-3">Estado</th>
              <th className="text-left px-6 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {compras.map((compra) => (
              <tr key={compra.id} className="border-b border-border hover:bg-muted/50">
                <td className="px-6 py-4">{compra.factura}</td>
                <td className="px-6 py-4">{compra.proveedor}</td>
                <td className="px-6 py-4 text-muted-foreground">{compra.fecha}</td>
                <td className="px-6 py-4">{compra.total}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-sm ${
                    compra.estado === 'Completada'
                      ? 'bg-success/10 text-success'
                      : 'bg-destructive/10 text-destructive'
                  }`}>
                    {compra.estado}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-muted rounded-lg">
                      <Eye className="w-4 h-4" />
                    </button>
                    {compra.estado !== 'Anulada' && (
                      <button
                        onClick={() => setDeleteDialog({ isOpen: true, id: compra.id, nombre: compra.factura })}
                        className="p-2 hover:bg-muted rounded-lg text-destructive"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <CompraFormModal open={showModal} onClose={() => setShowModal(false)} />

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
