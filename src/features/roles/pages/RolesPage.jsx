import { useState, useMemo } from 'react';
import { Shield, ShieldCheck, KeyRound, ListChecks } from 'lucide-react';
import { useRoles } from '../hooks/useRoles';
import { DataTable } from '../../../shared/components/DataTable';
import { RowActions } from '../../../shared/components/RowActions';
import { MetricCard } from '../../../shared/components/MetricCard';
import { RoleFormModal } from '../components/RoleFormModal';
import ConfirmDialog from '../../../shared/components/ConfirmDialog';
import Toast from '../../../shared/components/Toast';
import RoleDetailModal from '../components/RoleDetailModal';
import PageHeader from '../../../shared/components/PageHeader';
import { usePermissions, mockPermisos } from '../../../shared/contexts/PermissionContext';
import StatusSwitch from '../../../shared/components/StatusSwitch';

export default function RolesPage() {
  const { can } = usePermissions();
  const {
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
    isSaving,
    toast,
    setToast,
    handleSave,
    handleDelete,
  } = useRoles();

  const [selectedRole, setSelectedRole] = useState(null);

  const totalRoles = rawRoles.length;
  const rolesActivos = rawRoles.filter((r) => String(r.estado).toLowerCase() === 'activo').length;
  const permisosDisponibles = mockPermisos.length;
  const rolesConfigurados = rawRoles.filter((role) => String(role.estado).toLowerCase() === 'activo').length;

  const filteredData = useMemo(() => {
    return rawRoles.filter((r) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        r.nombre.toLowerCase().includes(q) ||
        (r.descripcion || '').toLowerCase().includes(q);

      const isTodosEstado = estadoFilter === 'Todos' || estadoFilter === 'Todos los estados';
      const matchesEstado =
        isTodosEstado || String(r.estado).toLowerCase() === estadoFilter.toLowerCase();

      return matchesSearch && matchesEstado;
    });
  }, [rawRoles, searchQuery, estadoFilter]);

  const columns = useMemo(
    () => [
      {
        key: 'id_rol',
        label: 'ID',
        render: (value) => <span className="font-mono font-medium">{value}</span>,
      },
      {
        key: 'nombre',
        label: 'Nombre del Rol',
        render: (value) => <span className="font-semibold">{value}</span>,
      },
      {
        key: 'descripcion',
        label: 'Descripción',
        render: (value) => (
          <span className="text-muted-foreground max-w-xs truncate block" title={value}>
            {value}
          </span>
        ),
      },
      {
        key: 'estado',
        label: 'Estado',
        render: (value) => <StatusSwitch value={value} />,
      },
      {
        key: 'fecha_creacion',
        label: 'Fecha de Creación',
        render: (value) => <span className="text-muted-foreground">{value}</span>,
      },
      {
        key: 'acciones',
        label: 'Acciones',
        render: (_, rol) => (
          <RowActions
            onView={() => setDetailModal({ isOpen: true, data: rol })}
            onEdit={() => {
              setSelectedRole(rol);
              setShowModal(true);
            }}
            editDisabled={!can('roles', 'editar')}
            onDelete={() =>
              setDeleteDialog({
                isOpen: true,
                id: rol.id_rol,
                nombre: rol.nombre,
              })
            }
            deleteDisabled={!can('roles', 'eliminar')}
          />
        ),
      },
    ],
    [can, setDetailModal, setShowModal, setDeleteDialog]
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Roles y Permisos"
        subtitle="Gestión de roles y niveles de acceso en Masarepas"
        addLabel="Nuevo Rol"
        addDisabled={!can('roles', 'crear')}
        onAdd={() => {
          setSelectedRole(null);
          setShowModal(true);
        }}
      />

      {/* Tarjetas de consolidado / métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard title="Total Roles" value={totalRoles} icon={Shield} variant="primary" />
        <MetricCard title="Permisos Disponibles" value={permisosDisponibles} icon={KeyRound} variant="accent" />
        <MetricCard title="Roles Configurados" value={rolesConfigurados} icon={ListChecks} variant="warning" />
        <MetricCard title="Roles Activos" value={rolesActivos} icon={ShieldCheck} variant="success" />
      </div>


      {/* Tabla con DataTable */}
      <DataTable
        columns={columns}
        data={filteredData}
        searchPlaceholder="Buscar por nombre o descripción..."
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        filters={
          <select
            value={estadoFilter}
            onChange={(e) => setEstadoFilter(e.target.value)}
            className="px-4 py-2 border border-input bg-input-background rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="Todos">Todos los estados</option>
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
          </select>
        }
      />

      <RoleDetailModal
        isOpen={detailModal.isOpen}
        onClose={() => setDetailModal({ isOpen: false, data: null })}
        role={detailModal.data}
      />

      <RoleFormModal
        open={showModal}
        role={selectedRole}
        onSave={handleSave}
        isLoading={isSaving}
        onClose={() => {
          setShowModal(false);
          setSelectedRole(null);
        }}
      />

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


