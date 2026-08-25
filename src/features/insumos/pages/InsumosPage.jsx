import { Plus, Eye, Edit, Trash2, FileDown, FileSpreadsheet, Package, AlertTriangle, CheckCircle, Truck } from 'lucide-react';
import { useInsumos } from '../hooks/useInsumos';
import { usePagination } from '../../../shared/hooks/usePagination';
import { PaginationControls } from '@/shared/components/PaginationControls';
import SearchBar from '@/shared/components/SearchBar';
import { InsumoFormModal } from '../components/InsumoFormModal';
import ConfirmDialog from '../../../shared/components/ConfirmDialog';
import Toast from '../../../shared/components/Toast';
import { usePermissions } from '../../../shared/contexts/PermissionContext';
import StatusSwitch from '../../../shared/components/StatusSwitch';

export default function InsumosPage() {
  const { can } = usePermissions();
  const {
    insumos,
    rawInsumos,
    searchQuery,
    setSearchQuery,
    categoriaFilter,
    setCategoriaFilter,
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
  } = useInsumos();
  const pagination = usePagination(insumos);

  const totalInsumos = rawInsumos.length;
  const disponibles = rawInsumos.filter((i) => i.estado === 'Disponible').length;
  const bajoStock = rawInsumos.filter((i) => i.estado === 'Bajo Stock').length;
  const proveedoresCount = new Set(rawInsumos.map((i) => i.id_proveedor).filter(Boolean)).size;

  return (
    <div className="space-y-6">
      {/* Header con exportación */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Insumos y Materia Prima</h1>
          <p className="text-muted-foreground">Inventario de granos, lácteos y embalajes para Masarepas</p>
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
            onClick={() => setShowModal(true)} disabled={!can('insumos', 'crear')}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nuevo Insumo
          </button>
        </div>
      </div>

      {/* Tarjetas de Consolidado */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card p-4 rounded-lg border border-border flex items-center gap-3">
          <div className="p-3 bg-primary/10 rounded-lg text-primary">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Insumos</p>
            <h3 className="text-xl font-bold">{totalInsumos}</h3>
          </div>
        </div>
        <div className="bg-card p-4 rounded-lg border border-border flex items-center gap-3">
          <div className="p-3 bg-success/10 rounded-lg text-success">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Disponibles</p>
            <h3 className="text-xl font-bold">{disponibles}</h3>
          </div>
        </div>
        <div className="bg-card p-4 rounded-lg border border-border flex items-center gap-3">
          <div className="p-3 bg-warning/10 rounded-lg text-warning">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Bajo Stock</p>
            <h3 className="text-xl font-bold">{bajoStock}</h3>
          </div>
        </div>
        <div className="bg-card p-4 rounded-lg border border-border flex items-center gap-3">
          <div className="p-3 bg-accent/10 rounded-lg text-primary">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Proveedores Activos</p>
            <h3 className="text-xl font-bold">{proveedoresCount}</h3>
          </div>
        </div>
      </div>

      {/* Filtros y Búsqueda */}
      <div className="bg-card p-4 rounded-lg border border-border flex flex-col sm:flex-row gap-4">
        <SearchBar
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Buscar por código, nombre o proveedor..."
          wrapperClassName="flex-1"
        />
        <select
          value={categoriaFilter}
          onChange={(e) => setCategoriaFilter(e.target.value)}
          className="px-4 py-2 border border-input bg-input-background rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="Todas">Todas las categorías</option>
          <option value="Granos y Cereales">Granos y Cereales</option>
          <option value="Lácteos y Quesos">Lácteos y Quesos</option>
          <option value="Lácteos y Grasas">Lácteos y Grasas</option>
          <option value="Empaques y Embalajes">Empaques y Embalajes</option>
        </select>
        <select
          value={estadoFilter}
          onChange={(e) => setEstadoFilter(e.target.value)}
          className="px-4 py-2 border border-input bg-input-background rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="Todos">Todos los estados</option>
          <option value="Disponible">Disponible</option>
          <option value="Bajo Stock">Bajo Stock</option>
        </select>
      </div>

      {/* Tabla Estandarizada */}
      <div className="records-table-shell bg-card rounded-lg border border-border overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted text-muted-foreground font-semibold">
            <tr>
              <th className="px-6 py-3">ID</th>
              <th className="px-6 py-3">Insumo</th>
              <th className="px-6 py-3">Unidad de Medida</th>
              <th className="px-6 py-3">Stock Actual</th>
              <th className="px-6 py-3">Proveedor</th>
              <th className="px-6 py-3">Estado</th>
              <th className="px-6 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {insumos.length > 0 ? (
              pagination.paginatedData.map((insumo) => (
                <tr key={insumo.id_insumo} className="hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4 font-mono font-medium">{insumo.id_insumo}</td>
                  <td className="px-6 py-4 font-semibold">{insumo.nombre}</td>
                  <td className="px-6 py-4 text-muted-foreground">{insumo.unidad_medida}</td>
                  <td className="px-6 py-4 font-semibold">{insumo.stock_actual}</td>
                  <td className="px-6 py-4 text-muted-foreground">{insumo.id_proveedor}</td>
                  <td className="px-6 py-4">
                    <StatusSwitch value={insumo.estado} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setDetailModal({ isOpen: true, data: insumo })}
                        className="p-2 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground"
                        title="Ver detalle"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setShowModal(true)} disabled={!can('insumos', 'editar')}
                        className="p-2 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground"
                        title="Editar"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteDialog({ isOpen: true, id: insumo.id_insumo, nombre: insumo.nombre })} disabled={!can('insumos', 'eliminar')}
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
                <td colSpan={8} className="px-6 py-8 text-center text-muted-foreground">
                  No se encontraron insumos.
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
            <h3 className="text-lg font-bold">Detalle del Insumo</h3>
            <div className="space-y-2 text-sm">
              <p><strong>ID:</strong> {detailModal.data.id_insumo}</p>
              <p><strong>Nombre:</strong> {detailModal.data.nombre}</p>
              <p><strong>Unidad de Medida:</strong> {detailModal.data.unidad_medida}</p>
              <p><strong>Stock Actual:</strong> {detailModal.data.stock_actual}</p>
              <p><strong>Stock Mínimo:</strong> {detailModal.data.stock_minimo}</p>
              <p><strong>Fecha de Vencimiento:</strong> {detailModal.data.fecha_vencimiento}</p>
              <p><strong>Proveedor:</strong> {detailModal.data.id_proveedor}</p>
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

      <InsumoFormModal open={showModal} onClose={() => setShowModal(false)} />

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        title="Eliminar Insumo"
        message={`¿Estás seguro de que deseas eliminar el insumo "${deleteDialog.nombre}"? Esta acción no se puede deshacer.`}
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

