import { useState } from 'react';
import { Plus, Search, Edit, Trash2, Shield } from 'lucide-react';
import ConfirmDialog from './ConfirmDialog';
import Toast from './Toast';

export default function Roles() {
  const [showModal, setShowModal] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; id: number | null; nombre: string }>({ isOpen: false, id: null, nombre: '' });
  const [isDeleting, setIsDeleting] = useState(false);
  const [toast, setToast] = useState<{ isOpen: boolean; type: 'success' | 'error'; message: string }>({ isOpen: false, type: 'success', message: '' });

  const [roles, setRoles] = useState([
    { id: 1, nombre: 'Administrador', permisos: 25, estado: 'Activo' },
    { id: 2, nombre: 'Vendedor', permisos: 12, estado: 'Activo' },
    { id: 3, nombre: 'Almacenista', permisos: 8, estado: 'Activo' },
    { id: 4, nombre: 'Contador', permisos: 10, estado: 'Inactivo' },
  ]);

  const handleDelete = async () => {
    setIsDeleting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    setRoles(roles.filter(r => r.id !== deleteDialog.id));
    setIsDeleting(false);
    setDeleteDialog({ isOpen: false, id: null, nombre: '' });
    setToast({ isOpen: true, type: 'success', message: 'Rol eliminado correctamente' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Roles y Permisos</h1>
          <p className="text-muted-foreground">Gestión de roles del sistema</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
        >
          <Plus className="w-5 h-5" />
          Nuevo Rol
        </button>
      </div>

      <div className="bg-card p-4 rounded-lg border border-border">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="search"
              placeholder="Buscar rol..."
              className="w-full pl-10 pr-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {roles.map((rol) => (
          <div key={rol.id} className="bg-card p-6 rounded-lg border border-border">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <span className={`px-2 py-1 rounded text-sm ${
                rol.estado === 'Activo'
                  ? 'bg-success/10 text-success'
                  : 'bg-muted text-muted-foreground'
              }`}>
                {rol.estado}
              </span>
            </div>
            <h3 className="mb-2">{rol.nombre}</h3>
            <p className="text-sm text-muted-foreground mb-4">{rol.permisos} permisos asignados</p>
            <div className="flex gap-2">
              <button className="flex-1 px-3 py-2 border border-border rounded-lg hover:bg-muted text-sm">
                <Edit className="w-4 h-4 inline mr-1" />
                Editar
              </button>
              <button
                onClick={() => setDeleteDialog({ isOpen: true, id: rol.id, nombre: rol.nombre })}
                className="px-3 py-2 border border-border rounded-lg hover:bg-muted text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="mb-4">Nuevo Rol</h2>
            <div className="space-y-4">
              <div>
                <label className="block mb-2">Nombre del Rol</label>
                <input type="text" className="w-full px-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div>
                <label className="block mb-4">Permisos</label>
                <div className="grid grid-cols-2 gap-3">
                  {['Usuarios', 'Roles', 'Proveedores', 'Compras', 'Categorías', 'Fichas Técnicas', 'Insumos', 'Producción', 'Productos', 'Clientes', 'Pedidos', 'Ventas'].map((permiso) => (
                    <label key={permiso} className="flex items-center gap-2 p-3 border border-border rounded-lg hover:bg-muted cursor-pointer">
                      <input type="checkbox" className="w-4 h-4" />
                      <span className="text-sm">{permiso}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 pt-4">
                <button onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-muted">
                  Cancelar
                </button>
                <button onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90">
                  Guardar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        title="Eliminar Rol"
        message={`¿Estás seguro de que deseas eliminar el rol "${deleteDialog.nombre}"? Esta acción no se puede deshacer.`}
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
