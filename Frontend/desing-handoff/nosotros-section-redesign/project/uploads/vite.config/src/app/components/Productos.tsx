import { useState } from 'react';
import { Plus, Search, Edit, Trash2, Box } from 'lucide-react';
import ConfirmDialog from './ConfirmDialog';
import Toast from './Toast';

export default function Productos() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategoria, setFilterCategoria] = useState('Todas las categorías');
  const [filterEstado, setFilterEstado] = useState('Todos los estados');
  const [showModal, setShowModal] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; id: number | null; nombre: string }>({ isOpen: false, id: null, nombre: '' });
  const [isDeleting, setIsDeleting] = useState(false);
  const [toast, setToast] = useState<{ isOpen: boolean; type: 'success' | 'error'; message: string }>({ isOpen: false, type: 'success', message: '' });

  const [productos, setProductos] = useState([
    { id: 1, nombre: 'Pan Francés', categoria: 'Panadería', precio: '$2.50', stock: 150, estado: 'Activo' },
    { id: 2, nombre: 'Torta de Chocolate', categoria: 'Repostería', precio: '$25.00', stock: 8, estado: 'Activo' },
    { id: 3, nombre: 'Croissant', categoria: 'Panadería', precio: '$3.50', stock: 45, estado: 'Activo' },
    { id: 4, nombre: 'Galletas de Vainilla', categoria: 'Repostería', precio: '$5.00', stock: 0, estado: 'Inactivo' },
    { id: 5, nombre: 'Baguette', categoria: 'Panadería', precio: '$3.00', stock: 80, estado: 'Activo' },
    { id: 6, nombre: 'Pastel de Fresa', categoria: 'Pastelería', precio: '$28.00', stock: 5, estado: 'Activo' },
  ]);

  // Filtrar productos
  const filteredProductos = productos.filter(producto => {
    const matchesSearch = producto.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategoria = filterCategoria === 'Todas las categorías' || producto.categoria === filterCategoria;
    const matchesEstado = filterEstado === 'Todos los estados' || producto.estado === filterEstado;

    return matchesSearch && matchesCategoria && matchesEstado;
  });

  const handleDelete = async () => {
    setIsDeleting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    setProductos(productos.filter(p => p.id !== deleteDialog.id));
    setIsDeleting(false);
    setDeleteDialog({ isOpen: false, id: null, nombre: '' });
    setToast({ isOpen: true, type: 'success', message: 'Producto eliminado correctamente' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Productos</h1>
          <p className="text-muted-foreground">Gestión de productos terminados</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
        >
          <Plus className="w-5 h-5" />
          Nuevo Producto
        </button>
      </div>

      <div className="bg-card p-4 rounded-lg border border-border">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="search"
              placeholder="Buscar producto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <select
            value={filterCategoria}
            onChange={(e) => setFilterCategoria(e.target.value)}
            className="px-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option>Todas las categorías</option>
            <option>Panadería</option>
            <option>Repostería</option>
            <option>Pastelería</option>
          </select>
          <select
            value={filterEstado}
            onChange={(e) => setFilterEstado(e.target.value)}
            className="px-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option>Todos los estados</option>
            <option>Activo</option>
            <option>Inactivo</option>
          </select>
        </div>
      </div>

      {filteredProductos.length === 0 ? (
        <div className="bg-card p-12 rounded-lg border border-border text-center">
          <Box className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="mb-2">No se encontraron productos</h3>
          <p className="text-muted-foreground">Intenta ajustar los filtros de búsqueda</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProductos.map((producto) => (
            <div key={producto.id} className="bg-card rounded-lg border border-border overflow-hidden">
              <div className="aspect-square bg-muted flex items-center justify-center">
                <Box className="w-16 h-16 text-muted-foreground" />
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="mb-1">{producto.nombre}</h3>
                    <p className="text-sm text-muted-foreground">{producto.categoria}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs ${
                    producto.estado === 'Activo'
                      ? 'bg-success/10 text-success'
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {producto.estado}
                  </span>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg text-primary">{producto.precio}</span>
                  <span className="text-sm text-muted-foreground">Stock: {producto.stock}</span>
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 px-3 py-2 border border-border rounded-lg hover:bg-muted text-sm">
                    <Edit className="w-4 h-4 inline mr-1" />
                    Editar
                  </button>
                  <button
                    onClick={() => setDeleteDialog({ isOpen: true, id: producto.id, nombre: producto.nombre })}
                    className="px-3 py-2 border border-border rounded-lg hover:bg-muted text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Mostrando {filteredProductos.length} de {productos.length} productos
          {searchTerm && <span className="ml-2 text-primary">• Búsqueda: "{searchTerm}"</span>}
        </p>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card p-6 rounded-lg w-full max-w-md">
            <h2 className="mb-4">Nuevo Producto</h2>
            <div className="space-y-4">
              <div>
                <label className="block mb-2">Nombre del Producto</label>
                <input type="text" className="w-full px-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div>
                <label className="block mb-2">Categoría</label>
                <select className="w-full px-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring">
                  <option>Seleccionar categoría</option>
                  <option>Panadería</option>
                  <option>Repostería</option>
                  <option>Pastelería</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2">Precio</label>
                  <input type="number" step="0.01" placeholder="0.00" className="w-full px-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
                <div>
                  <label className="block mb-2">Stock Inicial</label>
                  <input type="number" className="w-full px-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
              </div>
              <div>
                <label className="block mb-2">Descripción</label>
                <textarea rows={3} className="w-full px-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"></textarea>
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
        title="Eliminar Producto"
        message={`¿Estás seguro de que deseas eliminar el producto "${deleteDialog.nombre}"? Esta acción no se puede deshacer.`}
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
