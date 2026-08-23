import { Plus, Search, Eye, Edit, Trash2, FileDown, FileSpreadsheet, BookOpen, CheckCircle, FileText, Clock } from 'lucide-react';
import { useFichasTecnicas } from '../hooks/useFichasTecnicas';
import { usePagination } from '../../../shared/hooks/usePagination';
import { PaginationControls } from '../../../shared/components/PaginationControls';
import { FichaTecnicaFormModal } from '../components/FichaTecnicaFormModal';
import ConfirmDialog from '../../../shared/components/ConfirmDialog';
import Toast from '../../../shared/components/Toast';
import { usePermissions } from '../../../shared/contexts/PermissionContext';
import StatusSwitch from '../../../shared/components/StatusSwitch';

export default function FichasTecnicasPage() {
  const { can } = usePermissions();
  const {
    fichas,
    rawFichas,
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
  } = useFichasTecnicas();
  const pagination = usePagination(fichas);

  const totalFichas = rawFichas.length;
  const vigentes = rawFichas.filter((f) => f.estado === 'Vigente').length;

  return (
    <div className="space-y-6">
      {/* Header con exportación */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Fichas Técnicas (Recetas)</h1>
          <p className="text-muted-foreground">Formulaciones, rendimientos y estándar de calidad de Masarepas</p>
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
            onClick={() => setShowModal(true)} disabled={!can('fichas-tecnicas', 'crear')}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nueva Ficha Técnica
          </button>
        </div>
      </div>

      {/* Tarjetas de Consolidado */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card p-4 rounded-lg border border-border flex items-center gap-3">
          <div className="p-3 bg-primary/10 rounded-lg text-primary">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Recetas</p>
            <h3 className="text-xl font-bold">{totalFichas}</h3>
          </div>
        </div>
        <div className="bg-card p-4 rounded-lg border border-border flex items-center gap-3">
          <div className="p-3 bg-success/10 rounded-lg text-success">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Fichas Vigentes</p>
            <h3 className="text-xl font-bold">{vigentes}</h3>
          </div>
        </div>
        <div className="bg-card p-4 rounded-lg border border-border flex items-center gap-3">
          <div className="p-3 bg-accent/10 rounded-lg text-primary">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Versión Actual</p>
            <h3 className="text-xl font-bold">v3.0 Max</h3>
          </div>
        </div>
        <div className="bg-card p-4 rounded-lg border border-border flex items-center gap-3">
          <div className="p-3 bg-warning/10 rounded-lg text-warning">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Última Revisión</p>
            <h3 className="text-xl font-bold">Hace 15 días</h3>
          </div>
        </div>
      </div>

      {/* Filtros y Búsqueda */}
      <div className="bg-card p-4 rounded-lg border border-border flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Buscar por código, producto o insumos..."
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
          <option value="Vigente">Vigente</option>
          <option value="En Revisión">En Revisión</option>
        </select>
      </div>

      {/* Tabla Estandarizada */}
      <div className="records-table-shell bg-card rounded-lg border border-border overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted text-muted-foreground font-semibold">
            <tr>
              <th className="px-6 py-3">Código</th>
              <th className="px-6 py-3">Producto Estándar</th>
              <th className="px-6 py-3">Versión</th>
              <th className="px-6 py-3">Rendimiento Esperado</th>
              <th className="px-6 py-3">Insumos Clave</th>
              <th className="px-6 py-3">Estado</th>
              <th className="px-6 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {fichas.length > 0 ? (
              pagination.paginatedData.map((ficha) => (
                <tr key={ficha.id_ficha} className="hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4 font-mono font-medium">{ficha.id_ficha}</td><td className="px-6 py-4 font-semibold">{ficha.nombre}</td><td className="px-6 py-4">{ficha.tiempo_estimado_minutos}</td><td className="px-6 py-4">{ficha.rendimiento_lote}</td><td className="px-6 py-4 text-muted-foreground max-w-xs truncate">{ficha.descripcion}</td>
                  <td className="px-6 py-4">
                    <StatusSwitch value={ficha.estado} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setDetailModal({ isOpen: true, data: ficha })}
                        className="p-2 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground"
                        title="Ver detalle"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setShowModal(true)} disabled={!can('fichas-tecnicas', 'editar')}
                        className="p-2 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground"
                        title="Editar"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteDialog({ isOpen: true, id: ficha.id_ficha, nombre: ficha.nombre })} disabled={!can('fichas-tecnicas', 'eliminar')}
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
                <td colSpan={7} className="px-6 py-8 text-center text-muted-foreground">
                  No se encontraron fichas técnicas.
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
            <h3 className="text-lg font-bold">Detalle de Ficha Técnica</h3>
            <div className="space-y-2 text-sm">
              <p><strong>ID:</strong> {detailModal.data.id_ficha}</p><p><strong>Nombre:</strong> {detailModal.data.nombre}</p><p><strong>Descripción:</strong> {detailModal.data.descripcion}</p><p><strong>Instrucciones:</strong> {detailModal.data.instrucciones_preparacion}</p><p><strong>Tiempo:</strong> {detailModal.data.tiempo_estimado_minutos}</p><p><strong>Rendimiento:</strong> {detailModal.data.rendimiento_lote}</p>
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

      <PaginationControls {...pagination} />

      <FichaTecnicaFormModal open={showModal} onClose={() => setShowModal(false)} />

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        title="Eliminar Ficha Técnica"
        message={`¿Estás seguro de que deseas eliminar la ficha técnica "${deleteDialog.nombre}"? Esta acción no se puede deshacer.`}
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

