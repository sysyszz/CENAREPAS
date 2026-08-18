import { Plus, Search, Eye, Edit, Trash2, FileDown, FileSpreadsheet, Truck, CheckCircle, ShoppingBag, DollarSign } from 'lucide-react';
import { useProveedores } from '../hooks/useProveedores';
import { ProveedorFormModal } from '../components/ProveedorFormModal';
import { ProveedorDetailModal } from '../components/ProveedorDetailModal';
import { ProveedorEditModal } from '../components/ProveedorEditModal';
import ConfirmDialog from '../../../shared/components/ConfirmDialog';
import Toast from '../../../shared/components/Toast';

export default function ProveedoresPage() {
  const {
    rawProveedores,
    filteredProveedores,
    searchTerm,
    setSearchTerm,
    filterEstado,
    setFilterEstado,
    showModal,
    setShowModal,
    showDetailModal,
    setShowDetailModal,
    showEditModal,
    setShowEditModal,
    selectedProveedor,
    editData,
    setEditData,
    deleteDialog,
    setDeleteDialog,
    isDeleting,
    isSaving,
    toast,
    setToast,
    handleDelete,
    handleViewDetail,
    handleEdit,
    handleSaveEdit,
  } = useProveedores();

  const totalProveedores = rawProveedores.length;
  const activos = rawProveedores.filter((p) => p.estado === 'Activo').length;
  const totalComprasRealizadas = rawProveedores.reduce((acc, p) => acc + (p.comprasRealizadas || 0), 0);
  const totalInvertido = rawProveedores.reduce((acc, p) => acc + (p.totalCompradoNum || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header con exportación */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Proveedores</h1>
          <p className="text-muted-foreground">Directorio de proveedores de materias primas e insumos de Masarepas</p>
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
            Nuevo Proveedor
          </button>
        </div>
      </div>

      {/* Tarjetas de Consolidado */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card p-4 rounded-lg border border-border flex items-center gap-3">
          <div className="p-3 bg-primary/10 rounded-lg text-primary">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Proveedores</p>
            <h3 className="text-xl font-bold">{totalProveedores}</h3>
          </div>
        </div>
        <div className="bg-card p-4 rounded-lg border border-border flex items-center gap-3">
          <div className="p-3 bg-success/10 rounded-lg text-success">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Proveedores Activos</p>
            <h3 className="text-xl font-bold">{activos}</h3>
          </div>
        </div>
        <div className="bg-card p-4 rounded-lg border border-border flex items-center gap-3">
          <div className="p-3 bg-accent/10 rounded-lg text-primary">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Órdenes de Compra</p>
            <h3 className="text-xl font-bold">{totalComprasRealizadas}</h3>
          </div>
        </div>
        <div className="bg-card p-4 rounded-lg border border-border flex items-center gap-3">
          <div className="p-3 bg-warning/10 rounded-lg text-warning">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Inversión Total</p>
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
            placeholder="Buscar por código, nombre, contacto o insumo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-input bg-input-background rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <select
          value={filterEstado}
          onChange={(e) => setFilterEstado(e.target.value)}
          className="px-4 py-2 border border-input bg-input-background rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="Todos los estados">Todos los estados</option>
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
              <th className="px-6 py-3">Proveedor</th>
              <th className="px-6 py-3">Contacto</th>
              <th className="px-6 py-3">Categoría Insumo</th>
              <th className="px-6 py-3">Compras</th>
              <th className="px-6 py-3">Total Comprado</th>
              <th className="px-6 py-3">Estado</th>
              <th className="px-6 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredProveedores.length > 0 ? (
              filteredProveedores.map((proveedor) => (
                <tr key={proveedor.id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4 font-mono font-medium">{proveedor.codigo}</td>
                  <td className="px-6 py-4 font-semibold">{proveedor.nombre}</td>
                  <td className="px-6 py-4 text-muted-foreground">{proveedor.contacto}</td>
                  <td className="px-6 py-4 text-muted-foreground">{proveedor.categoriaInsumo}</td>
                  <td className="px-6 py-4">{proveedor.comprasRealizadas} ordenes</td>
                  <td className="px-6 py-4 font-semibold">{proveedor.totalComprado}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        proveedor.estado === 'Activo'
                          ? 'bg-success/10 text-success'
                          : 'bg-destructive/10 text-destructive'
                      }`}
                    >
                      {proveedor.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleViewDetail(proveedor)}
                        className="p-2 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground"
                        title="Ver detalle"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(proveedor)}
                        className="p-2 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground"
                        title="Editar"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteDialog({ isOpen: true, id: proveedor.id, nombre: proveedor.nombre })}
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
                  No se encontraron proveedores.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <ProveedorFormModal open={showModal} onClose={() => setShowModal(false)} />
      <ProveedorDetailModal
        open={showDetailModal}
        proveedor={selectedProveedor}
        onClose={() => setShowDetailModal(false)}
      />
      <ProveedorEditModal
        open={showEditModal}
        editData={editData}
        setEditData={setEditData}
        onClose={() => setShowEditModal(false)}
        onSave={handleSaveEdit}
        isSaving={isSaving}
      />

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        title="Eliminar Proveedor"
        message={`¿Estás seguro de que deseas eliminar al proveedor "${deleteDialog.nombre}"? Esta acción no se puede deshacer.`}
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

