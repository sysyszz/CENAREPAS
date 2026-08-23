import { Plus, Search, Eye, Edit, XCircle, FileDown, FileSpreadsheet, ShoppingCart, CheckCircle, Clock, DollarSign } from 'lucide-react';
import { useCompras } from '../hooks/useCompras';
import { usePagination } from '../../../shared/hooks/usePagination';
import { PaginationControls } from '../../../shared/components/PaginationControls';
import { CompraFormModal } from '../components/CompraFormModal';
import ConfirmDialog from '../../../shared/components/ConfirmDialog';
import Toast from '../../../shared/components/Toast';
import { usePermissions } from '../../../shared/contexts/PermissionContext';
import StatusSwitch from '../../../shared/components/StatusSwitch';

export default function ComprasPage() {
  const { can } = usePermissions();
  const {
    compras,
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
    toast,
    setToast,
    handleAnular,
  } = useCompras();
  const pagination = usePagination(compras);

  const totalCompras = rawCompras.length;
  const recibidas = rawCompras.filter((c) => c.estado === 'Recibida').length;
  const pendientes = rawCompras.filter((c) => c.estado === 'Pendiente').length;
  const totalInvertido = rawCompras.reduce((acc, c) => acc + (c.totalNum || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header con exportación */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Compras de Insumos</h1>
          <p className="text-muted-foreground">Órdenes de compra de materias primas e insumos a proveedores</p>
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
            onClick={() => setShowModal(true)} disabled={!can('compras', 'crear')}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nueva Compra
          </button>
        </div>
      </div>

      {/* Tarjetas de Consolidado */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card p-4 rounded-lg border border-border flex items-center gap-3">
          <div className="p-3 bg-primary/10 rounded-lg text-primary">
            <ShoppingCart className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Compras</p>
            <h3 className="text-xl font-bold">{totalCompras}</h3>
          </div>
        </div>
        <div className="bg-card p-4 rounded-lg border border-border flex items-center gap-3">
          <div className="p-3 bg-success/10 rounded-lg text-success">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Recibidas</p>
            <h3 className="text-xl font-bold">{recibidas}</h3>
          </div>
        </div>
        <div className="bg-card p-4 rounded-lg border border-border flex items-center gap-3">
          <div className="p-3 bg-warning/10 rounded-lg text-warning">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Pendientes</p>
            <h3 className="text-xl font-bold">{pendientes}</h3>
          </div>
        </div>
        <div className="bg-card p-4 rounded-lg border border-border flex items-center gap-3">
          <div className="p-3 bg-accent/10 rounded-lg text-primary">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Invertido</p>
            <h3 className="text-xl font-bold">${totalInvertido.toLocaleString('es-CO')}</h3>
          </div>
        </div>
      </div>

      {/* Filtros y Búsqueda */}
      <div className="bg-card p-4 rounded-lg border border-border flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Buscar por código, proveedor o insumo..."
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
          <option value="Recibida">Recibida</option>
          <option value="Pendiente">Pendiente</option>
          <option value="Anulada">Anulada</option>
        </select>
      </div>

      {/* Tabla Estandarizada */}
      <div className="records-table-shell bg-card rounded-lg border border-border overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted text-muted-foreground font-semibold">
            <tr>
              <th className="px-6 py-3">ID</th><th className="px-6 py-3">Proveedor ID</th><th className="px-6 py-3">Usuario ID</th><th className="px-6 py-3">Fecha Compra</th><th className="px-6 py-3">Valor Total</th>
              <th className="px-6 py-3">Estado</th>
              <th className="px-6 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {compras.length > 0 ? (
              pagination.paginatedData.map((compra) => (
                <tr key={compra.id_compra} className="hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4 font-mono font-medium">{compra.id_compra}</td><td className="px-6 py-4">{compra.id_proveedor}</td><td className="px-6 py-4">{compra.id_usuario}</td><td className="px-6 py-4">{compra.fecha_compra}</td><td className="px-6 py-4 font-semibold">{compra.valor_total}</td>
                  <td className="px-6 py-4">
                    <StatusSwitch value={compra.estado} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setDetailModal({ isOpen: true, data: compra })}
                        className="p-2 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground"
                        title="Ver detalle"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setShowModal(true)} disabled={!can('compras', 'editar')}
                        className="p-2 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground"
                        title="Editar"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      {compra.estado !== 'Anulada' && (
                        <button
                          onClick={() => setDeleteDialog({ isOpen: true, id: compra.id_compra, nombre: compra.id_compra })} disabled={!can('compras', 'eliminar')}
                          className="p-2 hover:bg-muted rounded-lg text-destructive"
                          title="Anular compra"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-muted-foreground">
                  No se encontraron compras.
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
            <h3 className="text-lg font-bold">Detalle de la Compra</h3>
            <div className="space-y-2 text-sm">
              <p><strong>ID:</strong> {detailModal.data.id_compra}</p><p><strong>Proveedor ID:</strong> {detailModal.data.id_proveedor}</p><p><strong>Usuario ID:</strong> {detailModal.data.id_usuario}</p><p><strong>Fecha:</strong> {detailModal.data.fecha_compra}</p><p><strong>Valor Total:</strong> {detailModal.data.valor_total}</p><p><strong>Medio de Pago:</strong> {detailModal.data.medio_pago}</p><p><strong>Comprobante:</strong> {detailModal.data.comprobante_url}</p><p><strong>Fecha Registro:</strong> {detailModal.data.fecha_registro}</p>
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

      <PaginationControls {...pagination} />

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

