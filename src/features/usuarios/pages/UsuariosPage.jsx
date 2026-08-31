import { useState, useMemo } from 'react';
import { Lock, Users, UserCheck, ShieldCheck, KeyRound } from 'lucide-react';
import { useUsuarios } from '../hooks/useUsuarios';
import { mockRoles } from '../../roles/services/rolesService';
import { DataTable } from '../../../shared/components/DataTable';
import { RowActions } from '../../../shared/components/RowActions';
import { MetricCard } from '../../../shared/components/MetricCard';
import { UsuarioFormModal } from '../components/UsuarioFormModal';
import ConfirmDialog from '../../../shared/components/ConfirmDialog';
import Toast from '../../../shared/components/Toast';
import DetailModal from '../../../shared/components/DetailModal';
import PageHeader from '../../../shared/components/PageHeader';
import { usePermissions } from '../../../shared/contexts/PermissionContext';
import StatusSwitch from '../../../shared/components/StatusSwitch';

export default function UsuariosPage() {
  const { can } = usePermissions();
  const {
    usuarios,
    rawUsuarios,
    searchTerm,
    setSearchTerm,
    filterRol,
    setFilterRol,
    filterEstado,
    setFilterEstado,
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
  } = useUsuarios();

  const [selectedUsuario, setSelectedUsuario] = useState(null);

  const totalUsuarios = rawUsuarios.length;
  const usuariosActivos = rawUsuarios.filter((u) => String(u.estado).toLowerCase() === 'activo').length;
  const rolesAsignados = new Set(rawUsuarios.map((usuario) => usuario.id_rol)).size;
  const credencialesConfiguradas = rawUsuarios.filter((usuario) => Boolean(usuario.contrasena_hash)).length;
  const roleNames = useMemo(
    () => Object.fromEntries(mockRoles.map((role) => [role.id_rol, role.nombre])),
    []
  );

  const columns = useMemo(
    () => [
      {
        key: 'id_usuario',
        label: 'ID',
        render: (value) => <span className="font-mono font-medium">{value}</span>,
      },
      {
        key: 'nombre',
        label: 'Nombre',
        render: (value) => <span className="font-semibold">{value}</span>,
      },
      {
        key: 'correo',
        label: 'Correo',
        render: (value) => <span className="text-muted-foreground">{value}</span>,
      },
      {
        key: 'id_rol',
        label: 'Rol',
        render: (value) => (
          <span className="px-2.5 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
            {roleNames[value] || 'Rol no encontrado'}
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
        render: (_, usuario) => (
          <RowActions
            onView={() => setDetailModal({ isOpen: true, data: usuario })}
            onEdit={() => {
              setSelectedUsuario(usuario);
              setShowModal(true);
            }}
            editDisabled={!can('usuarios', 'editar')}
            onDelete={() =>
              setDeleteDialog({
                isOpen: true,
                id: usuario.id_usuario,
                nombre: usuario.nombre,
              })
            }
            deleteDisabled={!can('usuarios', 'eliminar')}
            extra={
              <button
                className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground transition-colors"
                title="Cambiar contraseña"
                onClick={() => {
                  setSelectedUsuario(usuario);
                  setShowModal(true);
                }}
              >
                <Lock className="w-4 h-4" />
              </button>
            }
          />
        ),
      },
    ],
    [can, roleNames, setDetailModal, setShowModal, setDeleteDialog]
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Usuarios"
        subtitle="Gestión de usuarios y accesos del sistema Masarepas"
        addLabel="Nuevo Usuario"
        addDisabled={!can('usuarios', 'crear')}
        onAdd={() => {
          setSelectedUsuario(null);
          setShowModal(true);
        }}
      />

      {/* Tarjetas de Consolidado */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard title="Total Usuarios" value={totalUsuarios} icon={Users} variant="primary" />
        <MetricCard title="Roles Asignados" value={rolesAsignados} icon={ShieldCheck} variant="accent" />
        <MetricCard title="Credenciales Configuradas" value={credencialesConfiguradas} icon={KeyRound} variant="warning" />
        <MetricCard title="Usuarios Activos" value={usuariosActivos} icon={UserCheck} variant="success" />
      </div>

      {/* Tabla con DataTable */}
      <DataTable
        columns={columns}
        data={usuarios}
        searchPlaceholder="Buscar usuario por nombre o correo..."
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        filters={
          <>
            <select
              value={filterRol}
              onChange={(e) => setFilterRol(e.target.value)}
              className="px-4 py-2 border border-input bg-input-background rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="Todos los roles">Todos los roles</option>
              <option value="1">Administrador de Planta</option>
              <option value="2">Supervisor de Producción</option>
              <option value="3">Gestor de Compras y Proveedores</option>
              <option value="4">Vendedor y Distribución</option>
              <option value="5">Auditor de Calidad</option>
            </select>
            <select
              value={filterEstado}
              onChange={(e) => setFilterEstado(e.target.value)}
              className="px-4 py-2 border border-input bg-input-background rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="Todos los estados">Todos los estados</option>
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </select>
          </>
        }
      />

      <DetailModal
        isOpen={detailModal.isOpen}
        onClose={() => setDetailModal({ isOpen: false, data: null })}
        title="Detalle del Usuario"
        fields={detailModal.data ? [
          { label: 'ID', value: detailModal.data.id_usuario },
          { label: 'Nombre', value: detailModal.data.nombre },
          { label: 'Correo', value: detailModal.data.correo },
          { label: 'Rol', value: roleNames[detailModal.data.id_rol] || detailModal.data.id_rol },
          { label: 'Estado', value: detailModal.data.estado },
          { label: 'Fecha de Creación', value: detailModal.data.fecha_creacion },
        ] : []}
      />

      <UsuarioFormModal
        open={showModal}
        usuario={selectedUsuario}
        onSave={handleSave}
        isLoading={isSaving}
        onClose={() => {
          setShowModal(false);
          setSelectedUsuario(null);
        }}
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

