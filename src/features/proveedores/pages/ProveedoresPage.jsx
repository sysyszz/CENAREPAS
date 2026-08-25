import { Plus, Eye, Edit, Trash2, FileDown, FileSpreadsheet, Truck, CheckCircle } from 'lucide-react';
import { useProveedores } from '../hooks/useProveedores';
import { usePagination } from '../../../shared/hooks/usePagination';
import { PaginationControls } from '../../../shared/components/PaginationControls';
import { ProveedorFormModal } from '../components/ProveedorFormModal';
import { ProveedorDetailModal } from '../components/ProveedorDetailModal';
import { ProveedorEditModal } from '../components/ProveedorEditModal';
import ConfirmDialog from '../../../shared/components/ConfirmDialog';
import Toast from '../../../shared/components/Toast';
import { usePermissions } from '../../../shared/contexts/PermissionContext';
import StatusSwitch from '../../../shared/components/StatusSwitch';
import RecordsFilterToolbar from '../../../shared/components/RecordsFilterToolbar';
import RowActions from '../../../shared/components/RowActions';
import RecordsTable from '../../../shared/components/RecordsTable';
import StatCard from '../../../shared/components/StatCard';
import StatsGrid from '../../../shared/components/StatsGrid';

export default function ProveedoresPage() {
  const { can } = usePermissions();
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
  const pagination = usePagination(filteredProveedores);

  const totalProveedores = rawProveedores.length;
  const activos = rawProveedores.filter((p) => p.estado === 'activo').length;

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
            onClick={() => setShowModal(true)} disabled={!can('proveedores', 'crear')}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nuevo Proveedor
          </button>
        </div>
      </div>

      {/* Tarjetas de Consolidado */}
      <StatsGrid className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard variant="compact" label="Total Proveedores" value={totalProveedores} icon={Truck} iconColor="hsl(var(--primary))" iconBackground="hsl(var(--primary) / 0.1)" />
        <StatCard variant="compact" label="Proveedores Activos" value={activos} icon={CheckCircle} iconColor="hsl(var(--success))" iconBackground="hsl(var(--success) / 0.1)" />
      </StatsGrid>

      {/* Filtros y Búsqueda */}
      <RecordsFilterToolbar
        searchQuery={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Buscar por nombre, NIT o correo..."
      >
        <select
          value={filterEstado}
          onChange={(e) => setFilterEstado(e.target.value)}
          className="px-4 py-2 border border-input bg-input-background rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="Todos los estados">Todos los estados</option>
          <option value="activo">Activo</option>
          <option value="inactivo">Inactivo</option>
        </select>
      </RecordsFilterToolbar>

      {/* Tabla Estandarizada */}
      <RecordsTable
        columns={[
          { key: 'id_proveedor', label: 'ID' },
          { key: 'nombre', label: 'Proveedor' },
          { key: 'nit', label: 'NIT' },
          { key: 'telefono', label: 'Teléfono' },
          { key: 'correo', label: 'Correo' },
          { key: 'direccion', label: 'Dirección' },
          { key: 'estado', label: 'Estado' },
          { key: 'fecha_creacion', label: 'Fecha de Creación' },
          { key: 'acciones', label: 'Acciones' },
        ]}
        data={pagination.paginatedData}
        rowKey={(proveedor) => proveedor.id_proveedor}
        emptyMessage="No se encontraron proveedores."
        renderRow={(proveedor) => (
          <>
                  <td className="px-6 py-4 font-mono font-medium">{proveedor.id_proveedor}</td>
                  <td className="px-6 py-4 font-semibold">{proveedor.nombre}</td>
                  <td className="px-6 py-4">{proveedor.nit}</td>
                  <td className="px-6 py-4">{proveedor.telefono}</td>
                  <td className="px-6 py-4">{proveedor.correo}</td>
                  <td className="px-6 py-4">{proveedor.direccion}</td>
                  <td className="px-6 py-4">
                    <StatusSwitch value={proveedor.estado} />
                  </td>
                  <td className="px-6 py-4">{proveedor.fecha_creacion}</td>
                  <td className="px-6 py-4">
                    <RowActions actions={[
                      { key: 'view', icon: Eye, title: 'Ver detalle', onClick: () => handleViewDetail(proveedor) },
                      { key: 'edit', icon: Edit, title: 'Editar', onClick: () => handleEdit(proveedor), disabled: !can('proveedores', 'editar') },
                      { key: 'delete', icon: Trash2, title: 'Eliminar', onClick: () => setDeleteDialog({ isOpen: true, id: proveedor.id_proveedor, nombre: proveedor.nombre }), disabled: !can('proveedores', 'eliminar'), className: 'p-2 hover:bg-muted rounded-lg text-destructive' },
                    ]} />
                  </td>
          </>
        )}
      />

      <PaginationControls {...pagination} />

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

