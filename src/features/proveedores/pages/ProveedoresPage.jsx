import { Plus, Search, Edit, Trash2, Phone, Mail, Eye } from 'lucide-react';
import { useProveedores } from '../hooks/useProveedores';
import { ProveedorFormModal } from '../components/ProveedorFormModal';
import { ProveedorDetailModal } from '../components/ProveedorDetailModal';
import { ProveedorEditModal } from '../components/ProveedorEditModal';
import ConfirmDialog from '../../../shared/components/ConfirmDialog';
import Toast from '../../../shared/components/Toast';

export default function ProveedoresPage() {
  const {
    proveedores,
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Proveedores</h1>
          <p className="text-muted-foreground">Gestión de proveedores</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
        >
          <Plus className="w-5 h-5" />
          Nuevo Proveedor
        </button>
      </div>

      <div className="bg-card p-4 rounded-lg border border-border">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="search"
              placeholder="Buscar proveedor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <select
            value={filterEstado}
            onChange={(e) => setFilterEstado(e.target.value)}
            className="px-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option>Todos los estados</option>
            <option>Activo</option>
            <option>Inactivo</option>
          </select>
        </div>
      </div>

      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="text-left px-6 py-3">ID</th>
              <th className="text-left px-6 py-3">Nombre</th>
              <th className="text-left px-6 py-3">Contacto</th>
              <th className="text-left px-6 py-3">Teléfono</th>
              <th className="text-left px-6 py-3">Email</th>
              <th className="text-left px-6 py-3">Estado</th>
              <th className="text-left px-6 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredProveedores.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-muted-foreground">
                  No se encontraron proveedores
                </td>
              </tr>
            ) : (
              filteredProveedores.map((proveedor) => (
                <tr key={proveedor.id} className="border-b border-border hover:bg-muted/50">
                  <td className="px-6 py-4">{proveedor.id}</td>
                  <td className="px-6 py-4">{proveedor.nombre}</td>
                  <td className="px-6 py-4 text-muted-foreground">{proveedor.contacto}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      {proveedor.telefono}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      {proveedor.email}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-sm ${
                      proveedor.estado === 'Activo'
                        ? 'bg-success/10 text-success'
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {proveedor.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleViewDetail(proveedor)}
                        className="p-2 hover:bg-muted rounded-lg"
                        title="Ver detalle"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(proveedor)}
                        className="p-2 hover:bg-muted rounded-lg"
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
