import { Plus, Search, Eye, Edit, Trash2, FileDown, FileSpreadsheet, Shield, ShieldCheck, Users, Lock } from 'lucide-react';
import { useRoles } from '../hooks/useRoles';
import { RoleFormModal } from '../components/RoleFormModal';
import ConfirmDialog from '../../../shared/components/ConfirmDialog';
import Toast from '../../../shared/components/Toast';

export default function RolesPage() {
  const {
    roles,
    rawRoles,
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
  } = useRoles();

  const totalRoles = rawRoles.length;
  const rolesActivos = rawRoles.filter((r) => r.estado === 'Activo').length;
  const totalUsuarios = rawRoles.reduce((acc, r) => acc + (r.usuariosCount || 0), 0);
  const promedioPermisos = totalRoles > 0 ? Math.round(rawRoles.reduce((acc, r) => acc + (r.permisos || 0), 0) / totalRoles) : 0;

  return (
    <div className="space-y-6">
      {/* Header con exportación y botón de nuevo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Roles y Permisos</h1>
          <p className="text-muted-foreground">Gestión de roles y niveles de acceso en Masarepas</p>
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
            Nuevo Rol
          </button>
        </div>
      </div>

      {/* Tarjetas de consolidado / métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card p-4 rounded-lg border border-border flex items-center gap-3">
          <div className="p-3 bg-primary/10 rounded-lg text-primary">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Roles</p>
            <h3 className="text-xl font-bold">{totalRoles}</h3>
          </div>
        </div>
        <div className="bg-card p-4 rounded-lg border border-border flex items-center gap-3">
          <div className="p-3 bg-success/10 rounded-lg text-success">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Roles Activos</p>
            <h3 className="text-xl font-bold">{rolesActivos}</h3>
          </div>
        </div>
        <div className="bg-card p-4 rounded-lg border border-border flex items-center gap-3">
          <div className="p-3 bg-accent/10 rounded-lg text-primary">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Usuarios Asignados</p>
            <h3 className="text-xl font-bold">{totalUsuarios}</h3>
          </div>
        </div>
        <div className="bg-card p-4 rounded-lg border border-border flex items-center gap-3">
          <div className="p-3 bg-warning/10 rounded-lg text-warning">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Prom. Permisos</p>
            <h3 className="text-xl font-bold">{promedioPermisos} / rol</h3>
          </div>
        </div>
      </div>

      {/* Barra de búsqueda y filtros */}
      <div className="bg-card p-4 rounded-lg border border-border flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Buscar por código, nombre o descripción..."
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

      {/* Tabla con acciones estandarizadas */}
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted text-muted-foreground font-semibold">
            <tr>
              <th className="px-6 py-3">Código</th>
              <th className="px-6 py-3">Nombre del Rol</th>
              <th className="px-6 py-3">Descripción</th>
              <th className="px-6 py-3">Permisos</th>
              <th className="px-6 py-3">Usuarios</th>
              <th className="px-6 py-3">Estado</th>
              <th className="px-6 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {roles.length > 0 ? (
              roles.map((rol) => (
                <tr key={rol.id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4 font-mono font-medium">{rol.codigo}</td>
                  <td className="px-6 py-4 font-semibold">{rol.nombre}</td>
                  <td className="px-6 py-4 text-muted-foreground max-w-xs truncate">{rol.descripcion}</td>
                  <td className="px-6 py-4">{rol.permisos} asignados</td>
                  <td className="px-6 py-4">{rol.usuariosCount} usuarios</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        rol.estado === 'Activo'
                          ? 'bg-success/10 text-success'
                          : 'bg-destructive/10 text-destructive'
                      }`}
                    >
                      {rol.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setDetailModal({ isOpen: true, data: rol })}
                        className="p-2 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground"
                        title="Ver detalle"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setShowModal(true)}
                        className="p-2 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground"
                        title="Editar rol"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteDialog({ isOpen: true, id: rol.id, nombre: rol.nombre })}
                        className="p-2 hover:bg-muted rounded-lg text-destructive"
                        title="Eliminar rol"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-muted-foreground">
                  No se encontraron roles que coincidan con la búsqueda.
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
            <h3 className="text-lg font-bold">Detalle del Rol</h3>
            <div className="space-y-2 text-sm">
              <p><strong>Código:</strong> {detailModal.data.codigo}</p>
              <p><strong>Nombre:</strong> {detailModal.data.nombre}</p>
              <p><strong>Descripción:</strong> {detailModal.data.descripcion}</p>
              <p><strong>Permisos Asignados:</strong> {detailModal.data.permisos}</p>
              <p><strong>Usuarios Activos con este rol:</strong> {detailModal.data.usuariosCount}</p>
              <p><strong>Estado:</strong> {detailModal.data.estado}</p>
              <p><strong>Fecha de Creación:</strong> {detailModal.data.fechaCreacion}</p>
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

      <RoleFormModal open={showModal} onClose={() => setShowModal(false)} />

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        title="Eliminar Rol"
        message={`¿Estás seguro de que deseas eliminar el rol "${deleteDialog.nombre}"? Esta acción no se puede deshacer.`}
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

