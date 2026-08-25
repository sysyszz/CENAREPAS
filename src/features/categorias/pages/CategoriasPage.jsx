import { Plus, Eye, Edit, Trash2, FileDown, FileSpreadsheet, FolderTree, CheckCircle, Package, Layers } from 'lucide-react';
import { useCategorias } from '../hooks/useCategorias';
import { usePagination } from '../../../shared/hooks/usePagination';
import { PaginationControls } from '@/shared/components/PaginationControls';
import SearchBar from '@/shared/components/SearchBar';
import { CategoriaFormModal } from '../components/CategoriaFormModal';
import ConfirmDialog from '../../../shared/components/ConfirmDialog';
import Toast from '../../../shared/components/Toast';
import { usePermissions } from '../../../shared/contexts/PermissionContext';
import StatusSwitch from '../../../shared/components/StatusSwitch';

export default function CategoriasPage() {
  const { can } = usePermissions();
  const {
    categorias,
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
    toast,
    setToast,
    handleDelete,
  } = useCategorias();
  const pagination = usePagination(categorias);

  const totalCategorias = rawCategorias.length;
  const activas = rawCategorias.filter((c) => c.estado === 'Activo').length;
  const totalProductosAsignados = 0;
  const promedioProductos = totalCategorias > 0 ? (totalProductosAsignados / totalCategorias).toFixed(1) : 0;

  return (
    <div className="space-y-6">
      {/* Header con exportación */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Categorías de Productos</h1>
          <p className="text-muted-foreground">Clasificación de arepas y subproductos de fábrica</p>
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
            onClick={() => setShowModal(true)} disabled={!can('categorias', 'crear')}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nueva Categoría
          </button>
        </div>
      </div>

      {/* Tarjetas de Consolidado */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card p-4 rounded-lg border border-border flex items-center gap-3">
          <div className="p-3 bg-primary/10 rounded-lg text-primary">
            <FolderTree className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Categorías</p>
            <h3 className="text-xl font-bold">{totalCategorias}</h3>
          </div>
        </div>
        <div className="bg-card p-4 rounded-lg border border-border flex items-center gap-3">
          <div className="p-3 bg-success/10 rounded-lg text-success">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Categorías Activas</p>
            <h3 className="text-xl font-bold">{activas}</h3>
          </div>
        </div>
        <div className="bg-card p-4 rounded-lg border border-border flex items-center gap-3">
          <div className="p-3 bg-accent/10 rounded-lg text-primary">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Prod. Clasificados</p>
            <h3 className="text-xl font-bold">{totalProductosAsignados}</h3>
          </div>
        </div>
        <div className="bg-card p-4 rounded-lg border border-border flex items-center gap-3">
          <div className="p-3 bg-warning/10 rounded-lg text-warning">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Promedio Prod/Cat</p>
            <h3 className="text-xl font-bold">{promedioProductos}</h3>
          </div>
        </div>
      </div>

      {/* Filtros y Búsqueda */}
      <div className="bg-card p-4 rounded-lg border border-border flex flex-col sm:flex-row gap-4">
        <SearchBar
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Buscar por código, nombre o descripción..."
          wrapperClassName="flex-1"
        />
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

      {/* Tabla con Acciones Estandarizadas */}
      <div className="records-table-shell bg-card rounded-lg border border-border overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted text-muted-foreground font-semibold">
            <tr>
              <th className="px-6 py-3">ID</th>
              <th className="px-6 py-3">Nombre Categoría</th>
              <th className="px-6 py-3">Descripción</th>
              <th className="px-6 py-3">Estado</th>
              <th className="px-6 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {categorias.length > 0 ? (
              pagination.paginatedData.map((categoria) => (
                <tr key={categoria.id_categoria} className="hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4 font-mono font-medium">{categoria.id_categoria}</td>
                  <td className="px-6 py-4 font-semibold">{categoria.nombre}</td>
                  <td className="px-6 py-4 text-muted-foreground max-w-xs truncate">{categoria.descripcion}</td>
                  <td className="px-6 py-4">
                    <StatusSwitch value={categoria.estado} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setDetailModal({ isOpen: true, data: categoria })}
                        className="p-2 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground"
                        title="Ver detalle"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setShowModal(true)} disabled={!can('categorias', 'editar')}
                        className="p-2 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground"
                        title="Editar"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteDialog({ isOpen: true, id: categoria.id_categoria, nombre: categoria.nombre })} disabled={!can('categorias', 'eliminar')}
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
                <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                  No se encontraron categorías.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <PaginationControls {...pagination} />

      {/* Modal de Detalle */}
      {detailModal.isOpen && detailModal.data && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card p-6 rounded-lg max-w-md w-full border border-border space-y-4">
            <h3 className="text-lg font-bold">Detalle de Categoría</h3>
            <div className="space-y-2 text-sm">
              <p><strong>ID:</strong> {detailModal.data.id_categoria}</p>
              <p><strong>Nombre:</strong> {detailModal.data.nombre}</p>
              <p><strong>Descripción:</strong> {detailModal.data.descripcion}</p>
              <p><strong>Estado:</strong> {detailModal.data.estado}</p>
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

      <CategoriaFormModal open={showModal} onClose={() => setShowModal(false)} />

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

