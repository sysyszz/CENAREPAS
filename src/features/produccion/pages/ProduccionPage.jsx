import { Plus, Search, Eye, Edit, XCircle, FileDown, FileSpreadsheet, Factory, CheckCircle, Clock, Calendar } from 'lucide-react';
import { useProduccion } from '../hooks/useProduccion';
import { usePagination } from '../../../shared/hooks/usePagination';
import { PaginationControls } from '../../../shared/components/PaginationControls';
import { ProduccionFormModal } from '../components/ProduccionFormModal';
import ConfirmDialog from '../../../shared/components/ConfirmDialog';
import Toast from '../../../shared/components/Toast';
import { usePermissions } from '../../../shared/contexts/PermissionContext';
import StatusSwitch from '../../../shared/components/StatusSwitch';

export default function ProduccionPage() {
  const { can } = usePermissions();
  const {
    lotes,
    rawLotes,
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
    handleAnular,
  } = useProduccion();
  const pagination = usePagination(lotes);

  const totalLotes = rawLotes.length;
  const finalizados = rawLotes.filter((l) => l.estado === 'Finalizado').length;
  const enProceso = rawLotes.filter((l) => l.estado === 'En Proceso').length;
  const programados = rawLotes.filter((l) => l.estado === 'Programado').length;

  return (
    <div className="space-y-6">
      {/* Header con exportación */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Producción de Arepas</h1>
          <p className="text-muted-foreground">Control de lotes, molienda y empaque en planta Masarepas</p>
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
            onClick={() => setShowModal(true)} disabled={!can('produccion', 'crear')}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            Registrar Lote
          </button>
        </div>
      </div>

      {/* Tarjetas de Consolidado */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card p-4 rounded-lg border border-border flex items-center gap-3">
          <div className="p-3 bg-primary/10 rounded-lg text-primary">
            <Factory className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Lotes</p>
            <h3 className="text-xl font-bold">{totalLotes}</h3>
          </div>
        </div>
        <div className="bg-card p-4 rounded-lg border border-border flex items-center gap-3">
          <div className="p-3 bg-success/10 rounded-lg text-success">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Finalizados</p>
            <h3 className="text-xl font-bold">{finalizados}</h3>
          </div>
        </div>
        <div className="bg-card p-4 rounded-lg border border-border flex items-center gap-3">
          <div className="p-3 bg-warning/10 rounded-lg text-warning">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">En Proceso</p>
            <h3 className="text-xl font-bold">{enProceso}</h3>
          </div>
        </div>
        <div className="bg-card p-4 rounded-lg border border-border flex items-center gap-3">
          <div className="p-3 bg-accent/10 rounded-lg text-primary">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Programados</p>
            <h3 className="text-xl font-bold">{programados}</h3>
          </div>
        </div>
      </div>

      {/* Filtros y Búsqueda */}
      <div className="bg-card p-4 rounded-lg border border-border flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Buscar por ID de lote, ficha o usuario responsable..."
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
          <option value="Finalizado">Finalizado</option>
          <option value="En Proceso">En Proceso</option>
          <option value="Programado">Programado</option>
          <option value="Anulado">Anulado</option>
        </select>
      </div>

      {/* Tabla Estandarizada */}
      <div className="records-table-shell bg-card rounded-lg border border-border overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted text-muted-foreground font-semibold">
            <tr>
              <th className="px-6 py-3">Código Lote</th>
              <th className="px-6 py-3">Producto</th>
              <th className="px-6 py-3">Cantidad Prog.</th>
              <th className="px-6 py-3">Obtenida</th>
              <th className="px-6 py-3">Fecha</th>
              <th className="px-6 py-3">Usuario Responsable</th>
              <th className="px-6 py-3">Estado</th>
              <th className="px-6 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {lotes.length > 0 ? (
              pagination.paginatedData.map((lote) => (
                <tr key={lote.id_lote} className="hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4 font-mono font-medium">{lote.id_lote}</td><td className="px-6 py-4">{lote.id_ficha}</td><td className="px-6 py-4">{lote.id_usuario_responsable}</td><td className="px-6 py-4">{lote.cantidad_producida}</td><td className="px-6 py-4 text-muted-foreground">{lote.fecha_produccion}</td>
                  <td className="px-6 py-4">
                    <StatusSwitch value={lote.estado} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setDetailModal({ isOpen: true, data: lote })}
                        className="p-2 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground"
                        title="Ver detalle"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setShowModal(true)} disabled={!can('produccion', 'editar')}
                        className="p-2 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground"
                        title="Editar"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      {lote.estado !== 'Anulado' && (
                        <button
                          onClick={() => setDeleteDialog({ isOpen: true, id: lote.id_lote, nombre: lote.id_lote })} disabled={!can('produccion', 'eliminar')}
                          className="p-2 hover:bg-muted rounded-lg text-destructive"
                          title="Anular Lote"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="px-6 py-8 text-center text-muted-foreground">
                  No se encontraron lotes de producción.
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
            <h3 className="text-lg font-bold">Detalle del Lote de Producción</h3>
            <div className="space-y-2 text-sm">
              <p><strong>ID:</strong> {detailModal.data.id_lote}</p><p><strong>Ficha ID:</strong> {detailModal.data.id_ficha}</p><p><strong>Usuario Responsable ID:</strong> {detailModal.data.id_usuario_responsable}</p><p><strong>Fecha:</strong> {detailModal.data.fecha_produccion}</p><p><strong>Cantidad:</strong> {detailModal.data.cantidad_producida}</p><p><strong>Observaciones:</strong> {detailModal.data.observaciones}</p>
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

      <ProduccionFormModal open={showModal} onClose={() => setShowModal(false)} />

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        title="Anular Lote de Producción"
        message={`¿Estás seguro de que deseas anular el lote "${deleteDialog.nombre}"? Esta acción no se puede deshacer.`}
        confirmText="Anular"
        onConfirm={handleAnular}
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

