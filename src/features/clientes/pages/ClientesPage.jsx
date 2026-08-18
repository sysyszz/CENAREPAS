import { Plus, Search, Eye, Edit, Trash2, FileDown, FileSpreadsheet, UserCircle, CheckCircle, ShoppingBag, DollarSign } from 'lucide-react';
import { useClientes } from '../hooks/useClientes';
import { ClienteFormModal } from '../components/ClienteFormModal';
import ConfirmDialog from '../../../shared/components/ConfirmDialog';
import Toast from '../../../shared/components/Toast';

export default function ClientesPage() {
  const {
    clientes,
    rawClientes,
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
  } = useClientes();

  const totalClientes = rawClientes.length;
  const activos = rawClientes.filter((c) => c.estado === 'Activo').length;
  const totalPedidosHistorico = rawClientes.reduce((acc, c) => acc + (c.pedidosRealizados || 0), 0);
  const totalFacturadoHistorico = rawClientes.reduce((acc, c) => acc + (c.totalCompradoNum || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header con exportación */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Clientes</h1>
          <p className="text-muted-foreground">Directorio y facturación histórica de clientes de Masarepas</p>
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
            Nuevo Cliente
          </button>
        </div>
      </div>

      {/* Tarjetas de Consolidado */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card p-4 rounded-lg border border-border flex items-center gap-3">
          <div className="p-3 bg-primary/10 rounded-lg text-primary">
            <UserCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Clientes</p>
            <h3 className="text-xl font-bold">{totalClientes}</h3>
          </div>
        </div>
        <div className="bg-card p-4 rounded-lg border border-border flex items-center gap-3">
          <div className="p-3 bg-success/10 rounded-lg text-success">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Clientes Activos</p>
            <h3 className="text-xl font-bold">{activos}</h3>
          </div>
        </div>
        <div className="bg-card p-4 rounded-lg border border-border flex items-center gap-3">
          <div className="p-3 bg-accent/10 rounded-lg text-primary">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Pedidos Históricos</p>
            <h3 className="text-xl font-bold">{totalPedidosHistorico}</h3>
          </div>
        </div>
        <div className="bg-card p-4 rounded-lg border border-border flex items-center gap-3">
          <div className="p-3 bg-warning/10 rounded-lg text-warning">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Facturación Total</p>
            <h3 className="text-xl font-bold">${totalFacturadoHistorico.toLocaleString('es-CO')}</h3>
          </div>
        </div>
      </div>

      {/* Filtros y Búsqueda */}
      <div className="bg-card p-4 rounded-lg border border-border flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Buscar por código, nombre, NIT o ciudad..."
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
          <option value="Activo">Activo</option>
          <option value="Inactivo">Inactivo</option>
        </select>
      </div>

      {/* Tabla Estandarizada */}
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted text-muted-foreground font-semibold">
            <tr>
              <th className="px-6 py-3">Código</th>
              <th className="px-6 py-3">Cliente / Razón Social</th>
              <th className="px-6 py-3">NIT / Doc</th>
              <th className="px-6 py-3">Ciudad</th>
              <th className="px-6 py-3">Pedidos</th>
              <th className="px-6 py-3">Total Comprado</th>
              <th className="px-6 py-3">Estado</th>
              <th className="px-6 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {clientes.length > 0 ? (
              clientes.map((cliente) => (
                <tr key={cliente.id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4 font-mono font-medium">{cliente.codigo}</td>
                  <td className="px-6 py-4 font-semibold">{cliente.nombre}</td>
                  <td className="px-6 py-4 text-muted-foreground">{cliente.nit}</td>
                  <td className="px-6 py-4 text-muted-foreground">{cliente.ciudad}</td>
                  <td className="px-6 py-4">{cliente.pedidosRealizados} ordenes</td>
                  <td className="px-6 py-4 font-semibold">{cliente.totalComprado}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        cliente.estado === 'Activo'
                          ? 'bg-success/10 text-success'
                          : 'bg-destructive/10 text-destructive'
                      }`}
                    >
                      {cliente.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setDetailModal({ isOpen: true, data: cliente })}
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
                        onClick={() => setDeleteDialog({ isOpen: true, id: cliente.id, nombre: cliente.nombre })}
                        className="p-2 hover:bg-muted rounded-lg text-destructive"
                        title="Eliminar"
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
                  No se encontraron clientes.
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
            <h3 className="text-lg font-bold">Detalle del Cliente</h3>
            <div className="space-y-2 text-sm">
              <p><strong>Código:</strong> {detailModal.data.codigo}</p>
              <p><strong>Cliente:</strong> {detailModal.data.nombre}</p>
              <p><strong>NIT:</strong> {detailModal.data.nit}</p>
              <p><strong>Teléfono:</strong> {detailModal.data.telefono}</p>
              <p><strong>Email:</strong> {detailModal.data.email}</p>
              <p><strong>Ciudad:</strong> {detailModal.data.ciudad}</p>
              <p><strong>Tipo de Cliente:</strong> {detailModal.data.tipoCliente}</p>
              <p><strong>Pedidos Realizados:</strong> {detailModal.data.pedidosRealizados}</p>
              <p><strong>Total Facturado:</strong> {detailModal.data.totalComprado}</p>
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

      <ClienteFormModal open={showModal} onClose={() => setShowModal(false)} />

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        title="Eliminar Cliente"
        message={`¿Estás seguro de que deseas eliminar al cliente "${deleteDialog.nombre}"? Esta acción no se puede deshacer.`}
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

