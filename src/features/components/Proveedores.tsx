import { useState } from 'react';
import { Plus, Search, Edit, Trash2, Phone, Mail, Eye, X, Save } from 'lucide-react';
import ConfirmDialog from './ConfirmDialog';
import Toast from './Toast';

interface Proveedor {
  id: number;
  nombre: string;
  contacto: string;
  telefono: string;
  email: string;
  estado: string;
  direccion?: string;
  nit?: string;
}

export default function Proveedores() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEstado, setFilterEstado] = useState('Todos los estados');
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProveedor, setSelectedProveedor] = useState<Proveedor | null>(null);
  const [editData, setEditData] = useState<Proveedor | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; id: number | null; nombre: string }>({ isOpen: false, id: null, nombre: '' });
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{ isOpen: boolean; type: 'success' | 'error'; message: string }>({ isOpen: false, type: 'success', message: '' });

  const [proveedores, setProveedores] = useState<Proveedor[]>([
    { id: 1, nombre: 'Distribuidora ABC', contacto: 'Juan Pérez', telefono: '+1 234-5678', email: 'contacto@abc.com', estado: 'Activo', direccion: '123 Main St', nit: '900123456-7' },
    { id: 2, nombre: 'Insumos XYZ', contacto: 'María García', telefono: '+1 234-5679', email: 'info@xyz.com', estado: 'Activo', direccion: '456 Oak Ave', nit: '900234567-8' },
    { id: 3, nombre: 'Proveeduría Global', contacto: 'Carlos López', telefono: '+1 234-5680', email: 'ventas@global.com', estado: 'Inactivo', direccion: '789 Pine Rd', nit: '900345678-9' },
  ]);

  // Filtrar proveedores
  const filteredProveedores = proveedores.filter(proveedor => {
    const matchesSearch = proveedor.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         proveedor.contacto.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         proveedor.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEstado = filterEstado === 'Todos los estados' || proveedor.estado === filterEstado;

    return matchesSearch && matchesEstado;
  });

  const handleDelete = async () => {
    setIsDeleting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    setProveedores(proveedores.filter(p => p.id !== deleteDialog.id));
    setIsDeleting(false);
    setDeleteDialog({ isOpen: false, id: null, nombre: '' });
    setToast({ isOpen: true, type: 'success', message: 'Proveedor eliminado correctamente' });
  };

  const handleViewDetail = (proveedor: Proveedor) => {
    setSelectedProveedor(proveedor);
    setShowDetailModal(true);
  };

  const handleEdit = (proveedor: Proveedor) => {
    setEditData({ ...proveedor });
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    if (!editData) return;

    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    setProveedores(proveedores.map(p => p.id === editData.id ? editData : p));
    setIsSaving(false);
    setShowEditModal(false);
    setEditData(null);
    setToast({ isOpen: true, type: 'success', message: 'Proveedor actualizado correctamente' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Proveedores</h1>
          <p className="text-muted-foreground">Gestión de proveedores</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
        >
          <Plus className="w-5 h-5" />
          Nuevo Proveedor
        </button>
      </div>

      <div className="bg-card p-4 rounded-lg border border-border">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="search"
              placeholder="Buscar proveedor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
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

      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="text-left px-6 py-3">ID</th>
              <th className="text-left px-6 py-3">Nombre</th>
              <th className="text-left px-6 py-3">Contacto</th>
              <th className="text-left px-6 py-3">Teléfono</th>
              <th className="text-left px-6 py-3">Email</th>
              <th className="text-left px-6 py-3">Estado</th>
              <th className="text-left px-6 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredProveedores.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-muted-foreground">
                  No se encontraron proveedores
                </td>
              </tr>
            ) : (
              filteredProveedores.map((proveedor) => (
              <tr key={proveedor.id} className="border-b border-border hover:bg-muted/50">
                <td className="px-6 py-4">{proveedor.id}</td>
                <td className="px-6 py-4">{proveedor.nombre}</td>
                <td className="px-6 py-4 text-muted-foreground">{proveedor.contacto}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    {proveedor.telefono}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    {proveedor.email}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-sm ${
                    proveedor.estado === 'Activo'
                      ? 'bg-success/10 text-success'
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {proveedor.estado}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleViewDetail(proveedor)}
                      className="p-2 hover:bg-muted rounded-lg"
                      title="Ver detalle"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleEdit(proveedor)}
                      className="p-2 hover:bg-muted rounded-lg"
                      title="Editar"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteDialog({ isOpen: true, id: proveedor.id, nombre: proveedor.nombre })}
                      className="p-2 hover:bg-muted rounded-lg text-destructive"
                      title="Eliminar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Nuevo */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card p-6 rounded-lg w-full max-w-md">
            <h2 className="mb-4">Nuevo Proveedor</h2>
            <div className="space-y-4">
              <div>
                <label className="block mb-2">Nombre de la Empresa</label>
                <input type="text" className="w-full px-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div>
                <label className="block mb-2">Persona de Contacto</label>
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

      {/* Modal Ver Detalle */}
      {showDetailModal && selectedProveedor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card p-6 rounded-lg w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2>Detalle del Proveedor</h2>
              <button onClick={() => setShowDetailModal(false)} className="p-2 hover:bg-muted rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3">
              <div className="border-b border-border pb-3">
                <p className="text-sm text-muted-foreground">ID</p>
                <p className="font-medium">#{selectedProveedor.id}</p>
              </div>
              <div className="border-b border-border pb-3">
                <p className="text-sm text-muted-foreground">Nombre de la Empresa</p>
                <p className="font-medium">{selectedProveedor.nombre}</p>
              </div>
              <div className="border-b border-border pb-3">
                <p className="text-sm text-muted-foreground">NIT</p>
                <p className="font-medium">{selectedProveedor.nit}</p>
              </div>
              <div className="border-b border-border pb-3">
                <p className="text-sm text-muted-foreground">Persona de Contacto</p>
                <p className="font-medium">{selectedProveedor.contacto}</p>
              </div>
              <div className="border-b border-border pb-3">
                <p className="text-sm text-muted-foreground">Teléfono</p>
                <p className="font-medium">{selectedProveedor.telefono}</p>
              </div>
              <div className="border-b border-border pb-3">
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{selectedProveedor.email}</p>
              </div>
              <div className="border-b border-border pb-3">
                <p className="text-sm text-muted-foreground">Dirección</p>
                <p className="font-medium">{selectedProveedor.direccion}</p>
              </div>
              <div className="pb-3">
                <p className="text-sm text-muted-foreground">Estado</p>
                <span className={`inline-block px-2 py-1 rounded text-sm ${
                  selectedProveedor.estado === 'Activo'
                    ? 'bg-success/10 text-success'
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {selectedProveedor.estado}
                </span>
              </div>
            </div>
            <button
              onClick={() => setShowDetailModal(false)}
              className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 mt-4"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* Modal Editar */}
      {showEditModal && editData && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card p-6 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2>Editar Proveedor</h2>
              <button onClick={() => setShowEditModal(false)} className="p-2 hover:bg-muted rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block mb-2">Nombre de la Empresa</label>
                <input
                  type="text"
                  value={editData.nombre}
                  onChange={(e) => setEditData({ ...editData, nombre: e.target.value })}
                  className="w-full px-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="block mb-2">NIT</label>
                <input
                  type="text"
                  value={editData.nit}
                  onChange={(e) => setEditData({ ...editData, nit: e.target.value })}
                  className="w-full px-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="block mb-2">Persona de Contacto</label>
                <input
                  type="text"
                  value={editData.contacto}
                  onChange={(e) => setEditData({ ...editData, contacto: e.target.value })}
                  className="w-full px-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="block mb-2">Teléfono</label>
                <input
                  type="tel"
                  value={editData.telefono}
                  onChange={(e) => setEditData({ ...editData, telefono: e.target.value })}
                  className="w-full px-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="block mb-2">Email</label>
                <input
                  type="email"
                  value={editData.email}
                  onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="block mb-2">Dirección</label>
                <input
                  type="text"
                  value={editData.direccion}
                  onChange={(e) => setEditData({ ...editData, direccion: e.target.value })}
                  className="w-full px-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="block mb-2">Estado</label>
                <select
                  value={editData.estado}
                  onChange={(e) => setEditData({ ...editData, estado: e.target.value })}
                  className="w-full px-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option>Activo</option>
                  <option>Inactivo</option>
                </select>
              </div>
              <div className="flex gap-2 pt-4">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-muted"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveEdit}
                  disabled={isSaving}
                  className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSaving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Guardar
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        title="Eliminar Proveedor"
        message={`¿Estás seguro de que deseas eliminar al proveedor "${deleteDialog.nombre}"? Esta acción no se puede deshacer.`}
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
