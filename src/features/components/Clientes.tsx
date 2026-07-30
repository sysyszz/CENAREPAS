import { useState } from 'react';
import { Plus, Search, Edit, Trash2, Phone, Mail, Eye } from 'lucide-react';
import ConfirmDialog from './ConfirmDialog';
import Toast from './Toast';

export default function Clientes() {
  const [showModal, setShowModal] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; id: number | null; nombre: string }>({ isOpen: false, id: null, nombre: '' });
  const [isDeleting, setIsDeleting] = useState(false);
  const [toast, setToast] = useState<{ isOpen: boolean; type: 'success' | 'error'; message: string }>({ isOpen: false, type: 'success', message: '' });

  const [clientes, setClientes] = useState([
    { id: 1, nombre: 'Juan Pérez', telefono: '+1 234-5678', email: 'juan@example.com', compras: 15, total: '$450.00', estado: 'Activo' },
    { id: 2, nombre: 'María García', telefono: '+1 234-5679', email: 'maria@example.com', compras: 8, total: '$320.00', estado: 'Activo' },
    { id: 3, nombre: 'Carlos López', telefono: '+1 234-5680', email: 'carlos@example.com', compras: 22, total: '$890.00', estado: 'Activo' },
    { id: 4, nombre: 'Ana Martínez', telefono: '+1 234-5681', email: 'ana@example.com', compras: 5, total: '$125.00', estado: 'Inactivo' },
  ]);

  const handleDelete = async () => {
    setIsDeleting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    setClientes(clientes.filter(c => c.id !== deleteDialog.id));
    setIsDeleting(false);
    setDeleteDialog({ isOpen: false, id: null, nombre: '' });
    setToast({ isOpen: true, type: 'success', message: 'Cliente eliminado correctamente' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Clientes</h1>
          <p className="text-muted-foreground">Gestión de clientes</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
        >
          <Plus className="w-5 h-5" />
          Nuevo Cliente
        </button>
      </div>

      <div className="bg-card p-4 rounded-lg border border-border">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="search"
              placeholder="Buscar cliente..."
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

      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="text-left px-6 py-3">ID</th>
              <th className="text-left px-6 py-3">Nombre</th>
              <th className="text-left px-6 py-3">Teléfono</th>
              <th className="text-left px-6 py-3">Email</th>
              <th className="text-left px-6 py-3">Compras</th>
              <th className="text-left px-6 py-3">Total</th>
              <th className="text-left px-6 py-3">Estado</th>
              <th className="text-left px-6 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map((cliente) => (
              <tr key={cliente.id} className="border-b border-border hover:bg-muted/50">
                <td className="px-6 py-4">{cliente.id}</td>
                <td className="px-6 py-4">{cliente.nombre}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    {cliente.telefono}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    {cliente.email}
                  </div>
                </td>
                <td className="px-6 py-4 text-muted-foreground">{cliente.compras}</td>
                <td className="px-6 py-4">{cliente.total}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-sm ${
                    cliente.estado === 'Activo'
                      ? 'bg-success/10 text-success'
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {cliente.estado}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-muted rounded-lg">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 hover:bg-muted rounded-lg">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteDialog({ isOpen: true, id: cliente.id, nombre: cliente.nombre })}
                      className="p-2 hover:bg-muted rounded-lg text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card p-6 rounded-lg w-full max-w-md">
            <h2 className="mb-4">Nuevo Cliente</h2>
            <div className="space-y-4">
              <div>
                <label className="block mb-2">Nombre Completo</label>
                <input type="text" className="w-full px-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div>
                <label className="block mb-2">Teléfono</label>
                <input type="tel" className="w-full px-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div>
                <label className="block mb-2">Email</label>
                <input type="email" className="w-full px-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div>
                <label className="block mb-2">Dirección</label>
                <textarea rows={2} className="w-full px-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"></textarea>
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
        title="Eliminar Cliente"
        message={`¿Estás seguro de que deseas eliminar al cliente "${deleteDialog.nombre}"? Esta acción no se puede deshacer.`}
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
