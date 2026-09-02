import { useState, useMemo } from 'react';
import { FolderTree, CheckCircle, Package, Layers } from 'lucide-react';
import { useCategorias } from '../hooks/useCategorias';
import { DataTable } from '../../../shared/components/DataTable';
import { RowActions } from '../../../shared/components/RowActions';
import { CategoriaFormModal } from '../components/CategoriaFormModal';
import ConfirmDialog from '../../../shared/components/ConfirmDialog';
import Toast from '../../../shared/components/Toast';
import DetailModal from '../../../shared/components/DetailModal';
import PageHeader from '../../../shared/components/PageHeader';
import { MetricCard } from '../../../shared/components/MetricCard';
import { usePermissions } from '../../../shared/contexts/PermissionContext';
import StatusSwitch from '../../../shared/components/StatusSwitch';

export default function CategoriasPage() {
  const { can } = usePermissions();
  const {
    rawCategorias,
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
  } = useCategorias();

  const [selectedCategoria, setSelectedCategoria] = useState(null);

  const totalCategorias = rawCategorias.length;
  const activas = rawCategorias.filter((c) => String(c.estado).toLowerCase() === 'activo').length;
  const totalProductosAsignados = 0;
  const promedioProductos = totalCategorias > 0 ? (totalProductosAsignados / totalCategorias).toFixed(1) : 0;

  const filteredData = useMemo(() => {
    return rawCategorias.filter((c) => {
      const q = (searchQuery || '').toLowerCase().trim();
      const matchesSearch =
        !q ||
        c.nombre.toLowerCase().includes(q) ||
        String(c.id_categoria).toLowerCase().includes(q) ||
        (c.descripcion || '').toLowerCase().includes(q);

      const isTodos = estadoFilter === 'Todos' || estadoFilter === 'Todos los estados';
      const matchesEstado = isTodos || String(c.estado).toLowerCase() === estadoFilter.toLowerCase();
      return matchesSearch && matchesEstado;
    });
  }, [rawCategorias, searchQuery, estadoFilter]);

  const columns = useMemo(
    () => [
      {
        key: 'id_categoria',
        label: 'ID',
        render: (value) => <span className="font-mono font-medium">{value}</span>,
      },
      {
        key: 'nombre',
        label: 'Nombre Categoría',
        render: (value) => <span className="font-semibold">{value}</span>,
      },
      {
        key: 'descripcion',
        label: 'Descripción',
        render: (value) => <span className="text-muted-foreground max-w-xs truncate block">{value}</span>,
      },
      {
        key: 'estado',
        label: 'Estado',
        render: (value) => <StatusSwitch value={value} />,
      },
      {
        key: 'acciones',
        label: 'Acciones',
        render: (_, categoria) => (
          <RowActions
            onView={() => setDetailModal({ isOpen: true, data: categoria })}
            onEdit={() => {
              setSelectedCategoria(categoria);
              setShowModal(true);
            }}
            editDisabled={!can('categorias', 'editar')}
            onDelete={() =>
              setDeleteDialog({
                isOpen: true,
                id: categoria.id_categoria,
                nombre: categoria.nombre,
              })
            }
            deleteDisabled={!can('categorias', 'eliminar')}
          />
        ),
      },
    ],
    [can, setDetailModal, setShowModal, setDeleteDialog]
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Categorías de Productos"
        subtitle="Clasificación de arepas y subproductos de fábrica"
        addLabel="Nueva Categoría"
        addDisabled={!can('categorias', 'crear')}
        onAdd={() => {
          setSelectedCategoria(null);
          setShowModal(true);
        }}
      />

      {/* Tarjetas de Consolidado */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard title="Total Categorías" value={totalCategorias} icon={FolderTree} variant="primary" />
        <MetricCard title="Categorías Activas" value={activas} icon={CheckCircle} variant="success" />
        <MetricCard title="Prod. Clasificados" value={totalProductosAsignados} icon={Package} variant="accent" />
        <MetricCard title="Promedio Prod/Cat" value={promedioProductos} icon={Layers} variant="warning" />
      </div>

      {/* Tabla con DataTable y RowActions */}
      <DataTable
        columns={columns}
        data={filteredData}
        searchPlaceholder="Buscar por código, nombre o descripción..."
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        filters={
          <select
            value={estadoFilter}
            onChange={(e) => setEstadoFilter(e.target.value)}
            className="px-4 py-2 border border-input bg-input-background rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="Todos">Todos los estados</option>
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
          </select>
        }
      />

      <DetailModal
        isOpen={detailModal.isOpen}
        onClose={() => setDetailModal({ isOpen: false, data: null })}
        title="Detalle de Categoría"
        fields={detailModal.data ? [
          { label: 'ID', value: detailModal.data.id_categoria },
          { label: 'Nombre', value: detailModal.data.nombre },
          { label: 'Descripción', value: detailModal.data.descripcion },
          { label: 'Estado', value: detailModal.data.estado },
        ] : []}
      />

      <CategoriaFormModal
        open={showModal}
        categoria={selectedCategoria}
        onSave={handleSave}
        isLoading={isSaving}
        onClose={() => {
          setShowModal(false);
          setSelectedCategoria(null);
        }}
      />

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        title="Eliminar Categoría"
        message={`¿Estás seguro de que deseas eliminar la categoría "${deleteDialog.nombre}"? Esta acción no se puede deshacer.`}
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


