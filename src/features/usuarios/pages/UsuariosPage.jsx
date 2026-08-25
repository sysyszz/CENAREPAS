import { Plus, Edit, Trash2, Lock, Eye, FileDown, FileSpreadsheet, Users, UserCheck, ShieldCheck, KeyRound } from 'lucide-react';
import { useUsuarios } from '../hooks/useUsuarios';
import { mockRoles } from '../../roles/services/rolesService';
import { usePagination } from '../../../shared/hooks/usePagination';
import { PaginationControls } from '../../../shared/components/PaginationControls';
import { UsuarioFormModal } from '../components/UsuarioFormModal';
import { UsuarioDetailModal } from '../components/UsuarioDetailModal';
import { UsuarioEditModal } from '../components/UsuarioEditModal';
import ConfirmDialog from '../../../shared/components/ConfirmDialog';
import Toast from '../../../shared/components/Toast';
import { usePermissions } from '../../../shared/contexts/PermissionContext';
import StatusSwitch from '../../../shared/components/StatusSwitch';
import RecordsFilterToolbar from '../../../shared/components/RecordsFilterToolbar';
import RowActions from '../../../shared/components/RowActions';
import RecordsTable from '../../../shared/components/RecordsTable';
import StatCard from '../../../shared/components/StatCard';
import StatsGrid from '../../../shared/components/StatsGrid';

export default function UsuariosPage() {
  const { can } = usePermissions();
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
  const usuariosActivos = usuarios.filter((u) => u.estado === 'activo').length;
  const rolesAsignados = new Set(usuarios.map((usuario) => usuario.id_rol)).size;
  const credencialesConfiguradas = usuarios.filter((usuario) => Boolean(usuario.contrasena_hash)).length;
  const roleNames = Object.fromEntries(mockRoles.map((role) => [role.id_rol, role.nombre]));

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
            onClick={() => setShowModal(true)} disabled={!can('usuarios', 'crear')}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nuevo Usuario
          </button>
        </div>
      </div>

      {/* Tarjetas de Consolidado */}
      <StatsGrid className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard variant="compact" label="Total Usuarios" value={totalUsuarios} icon={Users} iconColor="hsl(var(--primary))" iconBackground="hsl(var(--primary) / 0.1)" />
        <StatCard variant="compact" label="Roles Asignados" value={rolesAsignados} icon={ShieldCheck} iconColor="hsl(var(--primary))" iconBackground="hsl(var(--accent) / 0.1)" />
        <StatCard variant="compact" label="Credenciales Configuradas" value={credencialesConfiguradas} icon={KeyRound} iconColor="hsl(var(--warning))" iconBackground="hsl(var(--warning) / 0.1)" />
        <StatCard variant="compact" label="Usuarios Activos" value={usuariosActivos} icon={UserCheck} iconColor="hsl(var(--success))" iconBackground="hsl(var(--success) / 0.1)" />
      </StatsGrid>


      <RecordsFilterToolbar
        searchQuery={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Buscar usuario..."
        className="flex-row gap-4"
        searchIconClassName="w-5 h-5"
        searchInputClassName="text-base"
      >
          <select
            value={filterRol}
            onChange={(e) => setFilterRol(e.target.value)}
            className="px-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option>Todos los roles</option>
            <option value="1">Administrador de Planta</option>
            <option value="2">Supervisor de Producción</option>
            <option value="3">Gestor de Compras y Proveedores</option>
            <option value="4">Vendedor y Distribución</option>
            <option value="5">Auditor de Calidad</option>
          </select>
          <select
            value={filterEstado}
            onChange={(e) => setFilterEstado(e.target.value)}
            className="px-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option>Todos los estados</option>
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
          </select>
      </RecordsFilterToolbar>

      <RecordsTable
        columns={[
          { key: 'id_usuario', label: 'ID' },
          { key: 'nombre', label: 'Nombre' },
          { key: 'correo', label: 'Correo' },
          { key: 'rol', label: 'Rol' },
          { key: 'estado', label: 'Estado' },
          { key: 'fecha_creacion', label: 'Fecha de Creación' },
          { key: 'acciones', label: 'Acciones' },
        ]}
        data={pagination.paginatedData}
        rowKey={(usuario) => usuario.id_usuario}
        tableClassName="w-full"
        headerClassName="bg-muted"
        bodyClassName=""
        emptyMessage="No se encontraron usuarios"
        renderRow={(usuario) => (
          <>
                  <td className="px-6 py-4">{usuario.id_usuario}</td>
                  <td className="px-6 py-4">{usuario.nombre}</td>
                  <td className="px-6 py-4 text-muted-foreground">{usuario.correo}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-primary/10 text-primary rounded text-sm">
                      {roleNames[usuario.id_rol] || 'Rol no encontrado'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <StatusSwitch value={usuario.estado} />
                  </td>
                  <td className="px-6 py-4">{usuario.fecha_creacion}</td>
                  <td className="px-6 py-4">
                    <RowActions className="flex items-center gap-2" actions={[
                      { key: 'view', icon: Eye, title: 'Ver detalle', onClick: () => handleViewDetail(usuario), className: 'p-2 hover:bg-muted rounded-lg' },
                      { key: 'edit', icon: Edit, title: 'Editar', onClick: () => handleEdit(usuario), disabled: !can('usuarios', 'editar'), className: 'p-2 hover:bg-muted rounded-lg' },
                      { key: 'password', icon: Lock, title: 'Cambiar contraseña', className: 'p-2 hover:bg-muted rounded-lg' },
                      { key: 'delete', icon: Trash2, title: 'Eliminar', onClick: () => setDeleteDialog({ isOpen: true, id: usuario.id_usuario, nombre: usuario.nombre }), disabled: !can('usuarios', 'eliminar'), className: 'p-2 hover:bg-muted rounded-lg text-destructive' },
                    ]} />
                  </td>
          </>
        )}
      />

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
