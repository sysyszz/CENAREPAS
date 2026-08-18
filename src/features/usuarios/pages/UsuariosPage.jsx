import { Plus, Search, Edit, Trash2, Lock, Eye, FileDown, FileSpreadsheet, Users, UserCheck, Shield, Clock } from 'lucide-react';
import { useUsuarios } from '../hooks/useUsuarios';
import { usePagination } from '../../../shared/hooks/usePagination';
import { PaginationControls } from '../../../shared/components/PaginationControls';
import { UsuarioFormModal } from '../components/UsuarioFormModal';
import { UsuarioDetailModal } from '../components/UsuarioDetailModal';
import { UsuarioEditModal } from '../components/UsuarioEditModal';
import ConfirmDialog from '../../../shared/components/ConfirmDialog';
import Toast from '../../../shared/components/Toast';

export default function UsuariosPage() {
  const {
    usuarios,
    filteredUsuarios,
    searchTerm,
    setSearchTerm,
    filterRol,
    setFilterRol,
    filterEstado,
    setFilterEstado,
    showModal,
    setShowModal,
    showDetailModal,
    setShowDetailModal,
    showEditModal,
    setShowEditModal,
    selectedUsuario,
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
  } = useUsuarios();
  const pagination = usePagination(filteredUsuarios);

  const totalUsuarios = usuarios.length;
  const usuariosActivos = usuarios.filter((u) => u.estado === 'Activo').length;
  const adminCount = usuarios.filter((u) => u.rol?.includes('Admin')).length;
  const supervisoresCount = usuarios.filter((u) => u.rol?.includes('Supervisor') || u.rol?.includes('Gestor')).length;

  return (
    <div className="space-y-6">
      {/* Header con Exportación */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Usuarios</h1>
          <p className="text-muted-foreground">Gestión de usuarios y accesos del sistema Masarepas</p>
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
            Nuevo Usuario
          </button>
        </div>
      </div>

      {/* Tarjetas de Consolidado */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card p-4 rounded-lg border border-border flex items-center gap-3">
          <div className="p-3 bg-primary/10 rounded-lg text-primary">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Usuarios</p>
            <h3 className="text-xl font-bold">{totalUsuarios}</h3>
          </div>
        </div>
        <div className="bg-card p-4 rounded-lg border border-border flex items-center gap-3">
          <div className="p-3 bg-success/10 rounded-lg text-success">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Usuarios Activos</p>
            <h3 className="text-xl font-bold">{usuariosActivos}</h3>
          </div>
        </div>
        <div className="bg-card p-4 rounded-lg border border-border flex items-center gap-3">
          <div className="p-3 bg-accent/10 rounded-lg text-primary">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Administradores</p>
            <h3 className="text-xl font-bold">{adminCount}</h3>
          </div>
        </div>
        <div className="bg-card p-4 rounded-lg border border-border flex items-center gap-3">
          <div className="p-3 bg-warning/10 rounded-lg text-warning">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Supervisores/Gestores</p>
            <h3 className="text-xl font-bold">{supervisoresCount}</h3>
          </div>
        </div>
      </div>


      <div className="bg-card p-4 rounded-lg border border-border">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="search"
              placeholder="Buscar usuario..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <select
            value={filterRol}
            onChange={(e) => setFilterRol(e.target.value)}
            className="px-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option>Todos los roles</option>
            <option>Administrador</option>
            <option>Vendedor</option>
            <option>Almacenista</option>
          </select>
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
              <th className="text-left px-6 py-3">Email</th>
              <th className="text-left px-6 py-3">Rol</th>
              <th className="text-left px-6 py-3">Estado</th>
              <th className="text-left px-6 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsuarios.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                  No se encontraron usuarios
                </td>
              </tr>
            ) : (
              pagination.paginatedData.map((usuario) => (
                <tr key={usuario.id} className="border-b border-border hover:bg-muted/50">
                  <td className="px-6 py-4">{usuario.id}</td>
                  <td className="px-6 py-4">{usuario.nombre}</td>
                  <td className="px-6 py-4 text-muted-foreground">{usuario.email}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-primary/10 text-primary rounded text-sm">
                      {usuario.rol}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-sm ${
                      usuario.estado === 'Activo'
                        ? 'bg-success/10 text-success'
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {usuario.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleViewDetail(usuario)}
                        className="p-2 hover:bg-muted rounded-lg"
                        title="Ver detalle"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(usuario)}
                        className="p-2 hover:bg-muted rounded-lg"
                        title="Editar"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 hover:bg-muted rounded-lg" title="Cambiar contraseña">
                        <Lock className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteDialog({ isOpen: true, id: usuario.id, nombre: usuario.nombre })}
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

      <PaginationControls {...pagination} />

      <UsuarioFormModal open={showModal} onClose={() => setShowModal(false)} />
      <UsuarioDetailModal
        open={showDetailModal}
        usuario={selectedUsuario}
        onClose={() => setShowDetailModal(false)}
      />
      <UsuarioEditModal
        open={showEditModal}
        editData={editData}
        setEditData={setEditData}
        onClose={() => setShowEditModal(false)}
        onSave={handleSaveEdit}
        isSaving={isSaving}
      />

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        title="Eliminar Usuario"
        message={`¿Estás seguro de que deseas eliminar al usuario "${deleteDialog.nombre}"? Esta acción no se puede deshacer.`}
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
