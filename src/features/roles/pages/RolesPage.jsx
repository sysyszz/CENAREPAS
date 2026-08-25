import { Plus, Eye, Edit, Trash2, FileDown, FileSpreadsheet, Shield, ShieldCheck, KeyRound, ListChecks } from 'lucide-react';
import { useRoles } from '../hooks/useRoles';
import { usePagination } from '../../../shared/hooks/usePagination';
import { PaginationControls } from '../../../shared/components/PaginationControls';
import { RoleFormModal } from '../components/RoleFormModal';
import ConfirmDialog from '../../../shared/components/ConfirmDialog';
import Toast from '../../../shared/components/Toast';
import { PermissionGate, mockPermisos, usePermissions } from '../../../shared/contexts/PermissionContext';
import StatusSwitch from '../../../shared/components/StatusSwitch';
import RecordsFilterToolbar from '../../../shared/components/RecordsFilterToolbar';
import RowActions from '../../../shared/components/RowActions';
import RecordsTable from '../../../shared/components/RecordsTable';
import DetailModal from '../../../shared/components/DetailModal';
import StatCard from '../../../shared/components/StatCard';
import StatsGrid from '../../../shared/components/StatsGrid';

export default function RolesPage() {
  const { can } = usePermissions();
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
  const pagination = usePagination(roles);

  const totalRoles = rawRoles.length;
  const rolesActivos = rawRoles.filter((r) => r.estado === 'activo').length;
  const permisosDisponibles = mockPermisos.length;
  const rolesConfigurados = rawRoles.filter((role) => role.estado === 'activo').length;

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
          <PermissionGate modulo="roles" accion="crear"><button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nuevo Rol
          </button></PermissionGate>
        </div>
      </div>

      {/* Tarjetas de consolidado / métricas */}
      <StatsGrid className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard variant="compact" label="Total Roles" value={totalRoles} icon={Shield} iconColor="hsl(var(--primary))" iconBackground="hsl(var(--primary) / 0.1)" />
        <StatCard variant="compact" label="Permisos Disponibles" value={permisosDisponibles} icon={KeyRound} iconColor="hsl(var(--primary))" iconBackground="hsl(var(--accent) / 0.1)" />
        <StatCard variant="compact" label="Roles Configurados" value={rolesConfigurados} icon={ListChecks} iconColor="hsl(var(--warning))" iconBackground="hsl(var(--warning) / 0.1)" />
        <StatCard variant="compact" label="Roles Activos" value={rolesActivos} icon={ShieldCheck} iconColor="hsl(var(--success))" iconBackground="hsl(var(--success) / 0.1)" />
      </StatsGrid>

      {/* Barra de búsqueda y filtros */}
      <RecordsFilterToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Buscar por nombre o descripción..."
      >
        <select
          value={estadoFilter}
          onChange={(e) => setEstadoFilter(e.target.value)}
          className="px-4 py-2 border border-input bg-input-background rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="Todos">Todos los estados</option>
          <option value="activo">Activo</option>
          <option value="inactivo">Inactivo</option>
        </select>
      </RecordsFilterToolbar>

      {/* Tabla con acciones estandarizadas */}
      <RecordsTable
        columns={[
          { key: 'id_rol', label: 'ID' },
          { key: 'nombre', label: 'Nombre del Rol' },
          { key: 'descripcion', label: 'Descripción' },
          { key: 'estado', label: 'Estado' },
          { key: 'fecha_creacion', label: 'Fecha de Creación' },
          { key: 'acciones', label: 'Acciones' },
        ]}
        data={pagination.paginatedData}
        rowKey={(rol) => rol.id_rol}
        emptyMessage="No se encontraron roles que coincidan con la búsqueda."
        renderRow={(rol) => (
          <>
                  <td className="px-6 py-4 font-mono font-medium">{rol.id_rol}</td>
                  <td className="px-6 py-4 font-semibold">{rol.nombre}</td>
                  <td className="px-6 py-4 text-muted-foreground max-w-xs truncate">{rol.descripcion}</td>
                  <td className="px-6 py-4">
                    <StatusSwitch value={rol.estado} />
                  </td>
                  <td className="px-6 py-4">{rol.fecha_creacion}</td>
                  <td className="px-6 py-4">
                    <RowActions actions={[
                      { key: 'view', icon: Eye, title: 'Ver detalle', onClick: () => setDetailModal({ isOpen: true, data: rol }), permission: can('roles', 'ver') },
                      { key: 'edit', icon: Edit, title: 'Editar rol', onClick: () => setShowModal(true), permission: can('roles', 'editar') },
                      { key: 'delete', icon: Trash2, title: 'Eliminar rol', onClick: () => setDeleteDialog({ isOpen: true, id: rol.id_rol, nombre: rol.nombre }), permission: can('roles', 'eliminar'), className: 'p-2 hover:bg-muted rounded-lg text-destructive' },
                    ]} />
                  </td>
          </>
        )}
      />

      <PaginationControls {...pagination} />

      {/* Modal de Detalle */}
      <DetailModal open={detailModal.isOpen && Boolean(detailModal.data)} title="Detalle del Rol" onClose={() => setDetailModal({ isOpen: false, data: null })} className="border border-border space-y-4" contentClassName="space-y-2 text-sm">
        {detailModal.data && <><p><strong>ID:</strong> {detailModal.data.id_rol}</p><p><strong>Nombre:</strong> {detailModal.data.nombre}</p><p><strong>Descripción:</strong> {detailModal.data.descripcion}</p><p><strong>Estado:</strong> {detailModal.data.estado}</p><p><strong>Fecha de Creación:</strong> {detailModal.data.fecha_creacion}</p></>}
      </DetailModal>

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

