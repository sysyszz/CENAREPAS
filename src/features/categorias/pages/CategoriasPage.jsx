import { Plus, Search, Edit, Trash2, FolderTree } from 'lucide-react';
import { useCategorias } from '../hooks/useCategorias';
import { CategoriaFormModal } from '../components/CategoriaFormModal';
import ConfirmDialog from '../../../shared/components/ConfirmDialog';
import Toast from '../../../shared/components/Toast';

export default function CategoriasPage() {
  const {
    categorias,
    showModal,
    setShowModal,
    deleteDialog,
    setDeleteDialog,
    isDeleting,
    toast,
    setToast,
    handleDelete,
  } = useCategorias();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Categorías de Productos</h1>
          <p className="text-muted-foreground">Gestión de categorías</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
        >
          <Plus className="w-5 h-5" />
          Nueva Categoría
        </button>
      </div>

      <div className="bg-card p-4 rounded-lg border border-border">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="search"
              placeholder="Buscar categoría..."
              className="w-full pl-10 pr-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <select className="px-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring">
            <option>Todos los estados</option>
            <option>Activo</option>
            <option>Inactivo</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categorias.map((categoria) => (
          <div key={categoria.id} className="bg-card p-6 rounded-lg border border-border">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-accent/10 rounded-lg">
                <FolderTree className="w-6 h-6 text-accent" />
              </div>
              <span className={`px-2 py-1 rounded text-sm ${
                categoria.estado === 'Activo'
                  ? 'bg-success/10 text-success'
                  : 'bg-muted text-muted-foreground'
              }`}>
                {categoria.estado}
              </span>
            </div>
            <h3 className="mb-2">{categoria.nombre}</h3>
            <p className="text-sm text-muted-foreground mb-4">{categoria.productos} productos</p>
            <div className="flex gap-2">
              <button className="flex-1 px-3 py-2 border border-border rounded-lg hover:bg-muted text-sm">
                <Edit className="w-4 h-4 inline mr-1" />
                Editar
              </button>
              <button
                onClick={() => setDeleteDialog({ isOpen: true, id: categoria.id, nombre: categoria.nombre })}
                className="px-3 py-2 border border-border rounded-lg hover:bg-muted text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <CategoriaFormModal open={showModal} onClose={() => setShowModal(false)} />

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        title="Eliminar Categoría"
        message={`¿Estás seguro de que deseas eliminar la categoría "${deleteDialog.nombre}"? Esta acción no se puede deshacer.`}
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
