import { Plus, Search, Edit, Trash2, BookOpen } from 'lucide-react';
import { useFichasTecnicas } from '../hooks/useFichasTecnicas';
import { FichaTecnicaFormModal } from '../components/FichaTecnicaFormModal';
import ConfirmDialog from '../../../shared/components/ConfirmDialog';
import Toast from '../../../shared/components/Toast';

export default function FichasTecnicasPage() {
  const {
    fichas,
    showModal,
    setShowModal,
    deleteDialog,
    setDeleteDialog,
    isDeleting,
    toast,
    setToast,
    handleDelete,
  } = useFichasTecnicas();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Fichas Técnicas (Recetas)</h1>
          <p className="text-muted-foreground">Gestión de recetas y formulaciones</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
        >
          <Plus className="w-5 h-5" />
          Nueva Ficha Técnica
        </button>
      </div>

      <div className="bg-card p-4 rounded-lg border border-border">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="search"
              placeholder="Buscar ficha técnica..."
              className="w-full pl-10 pr-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {fichas.map((ficha) => (
          <div key={ficha.id} className="bg-card p-6 rounded-lg border border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3>{ficha.nombre}</h3>
                  <p className="text-sm text-muted-foreground">{ficha.insumos} insumos • Rendimiento: {ficha.rendimiento}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className={`px-2 py-1 rounded text-sm ${
                  ficha.estado === 'Activo'
                    ? 'bg-success/10 text-success'
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {ficha.estado}
                </span>
                <div className="flex gap-2">
                  <button className="px-3 py-2 border border-border rounded-lg hover:bg-muted text-sm">
                    <Edit className="w-4 h-4 inline mr-1" />
                    Editar
                  </button>
                  <button
                    onClick={() => setDeleteDialog({ isOpen: true, id: ficha.id, nombre: ficha.nombre })}
                    className="px-3 py-2 border border-border rounded-lg hover:bg-muted text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <FichaTecnicaFormModal open={showModal} onClose={() => setShowModal(false)} />

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        title="Eliminar Ficha Técnica"
        message={`¿Estás seguro de que deseas eliminar la ficha técnica "${deleteDialog.nombre}"? Esta acción no se puede deshacer.`}
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
