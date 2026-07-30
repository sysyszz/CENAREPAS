import { useState } from 'react';
import { Plus, Search, Edit, Trash2, Lock, Eye, X, Save } from 'lucide-react';
import ConfirmDialog from './ConfirmDialog';
import Toast from './Toast';

interface Usuario {
  id: number;
  nombre: string;
  email: string;
  rol: string;
  estado: string;
  telefono?: string;
  fechaCreacion?: string;
}

export default function Usuarios() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRol, setFilterRol] = useState('Todos los roles');
  const [filterEstado, setFilterEstado] = useState('Todos los estados');
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUsuario, setSelectedUsuario] = useState<Usuario | null>(null);
  const [editData, setEditData] = useState<Usuario | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; id: number | null; nombre: string }>({ isOpen: false, id: null, nombre: '' });
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{ isOpen: boolean; type: 'success' | 'error'; message: string }>({ isOpen: false, type: 'success', message: '' });

  const [usuarios, setUsuarios] = useState<Usuario[]>([
    { id: 1, nombre: 'Juan Pérez', email: 'juan@example.com', rol: 'Administrador', estado: 'Activo', telefono: '+1 234-5678', fechaCreacion: '15 Enero 2024' },
    { id: 2, nombre: 'María García', email: 'maria@example.com', rol: 'Vendedor', estado: 'Activo', telefono: '+1 234-5679', fechaCreacion: '20 Febrero 2024' },
    { id: 3, nombre: 'Carlos López', email: 'carlos@example.com', rol: 'Almacenista', estado: 'Inactivo', telefono: '+1 234-5680', fechaCreacion: '10 Marzo 2024' },
    { id: 4, nombre: 'Ana Martínez', email: 'ana@example.com', rol: 'Vendedor', estado: 'Activo', telefono: '+1 234-5681', fechaCreacion: '5 Abril 2024' },
  ]);

  // Filtrar usuarios basado en búsqueda y filtros
  const filteredUsuarios = usuarios.filter(usuario => {
    const matchesSearch = usuario.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         usuario.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRol = filterRol === 'Todos los roles' || usuario.rol === filterRol;
    const matchesEstado = filterEstado === 'Todos los estados' || usuario.estado === filterEstado;

    return matchesSearch && matchesRol && matchesEstado;
  });

  const handleDelete = async () => {
    setIsDeleting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    setUsuarios(usuarios.filter(u => u.id !== deleteDialog.id));
    setIsDeleting(false);
    setDeleteDialog({ isOpen: false, id: null, nombre: '' });
    setToast({ isOpen: true, type: 'success', message: 'Usuario eliminado correctamente' });
  };

  const handleViewDetail = (usuario: Usuario) => {
    setSelectedUsuario(usuario);
    setShowDetailModal(true);
  };

  const handleEdit = (usuario: Usuario) => {
    setEditData({ ...usuario });
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    if (!editData) return;

    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    setUsuarios(usuarios.map(u => u.id === editData.id ? editData : u));
    setIsSaving(false);
    setShowEditModal(false);
    setEditData(null);
    setToast({ isOpen: true, type: 'success', message: 'Usuario actualizado correctamente' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Usuarios</h1>
          <p className="text-muted-foreground">Gestión de usuarios del sistema</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
        >
          <Plus className="w-5 h-5" />
          Nuevo Usuario
        </button>
      </div>

      <div className="bg-card p-4 rounded-lg border border-border">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="search"
              placeholder="Buscar usuario..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <select
            value={filterRol}
            onChange={(e) => setFilterRol(e.target.value)}
            className="px-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option>Todos los roles</option>
            <option>Administrador</option>
            <option>Vendedor</option>
            <option>Almacenista</option>
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

      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="text-left px-6 py-3">ID</th>
              <th className="text-left px-6 py-3">Nombre</th>
              <th className="text-left px-6 py-3">Email</th>
              <th className="text-left px-6 py-3">Rol</th>
              <th className="text-left px-6 py-3">Estado</th>
              <th className="text-left px-6 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsuarios.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                  No se encontraron usuarios
                </td>
              </tr>
            ) : (
              filteredUsuarios.map((usuario) => (
              <tr key={usuario.id} className="border-b border-border hover:bg-muted/50">
                <td className="px-6 py-4">{usuario.id}</td>
                <td className="px-6 py-4">{usuario.nombre}</td>
                <td className="px-6 py-4 text-muted-foreground">{usuario.email}</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-primary/10 text-primary rounded text-sm">
                    {usuario.rol}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-sm ${
                    usuario.estado === 'Activo'
                      ? 'bg-success/10 text-success'
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {usuario.estado}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleViewDetail(usuario)}
                      className="p-2 hover:bg-muted rounded-lg"
                      title="Ver detalle"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleEdit(usuario)}
                      className="p-2 hover:bg-muted rounded-lg"
                      title="Editar"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-2 hover:bg-muted rounded-lg" title="Cambiar contraseña">
                      <Lock className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteDialog({ isOpen: true, id: usuario.id, nombre: usuario.nombre })}
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

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Mostrando {filteredUsuarios.length} de {usuarios.length} usuarios
          {searchTerm && <span className="ml-2 text-primary">• Búsqueda: "{searchTerm}"</span>}
        </p>
        <div className="flex gap-2">
          <button className="px-3 py-2 border border-border rounded-lg hover:bg-muted">Anterior</button>
          <button className="px-3 py-2 bg-primary text-primary-foreground rounded-lg">1</button>
          <button className="px-3 py-2 border border-border rounded-lg hover:bg-muted">Siguiente</button>
        </div>
      </div>

      {/* Modal Nuevo Usuario */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card p-6 rounded-lg w-full max-w-md">
            <h2 className="mb-4">Nuevo Usuario</h2>
            <div className="space-y-4">
              <div>
                <label className="block mb-2">Nombre Completo</label>
                <input type="text" className="w-full px-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div>
                <label className="block mb-2">Email</label>
                <input type="email" className="w-full px-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div>
                <label className="block mb-2">Teléfono</label>
                <input type="tel" className="w-full px-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div>
                <label className="block mb-2">Rol</label>
                <select className="w-full px-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring">
                  <option>Seleccionar rol</option>
                  <option>Administrador</option>
                  <option>Vendedor</option>
                  <option>Almacenista</option>
                </select>
              </div>
              <div>
                <label className="block mb-2">Contraseña</label>
                <input type="password" className="w-full px-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring" />
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
      {showDetailModal && selectedUsuario && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card p-6 rounded-lg w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2>Detalle del Usuario</h2>
              <button onClick={() => setShowDetailModal(false)} className="p-2 hover:bg-muted rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-center mb-4">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary text-2xl">
                  {selectedUsuario.nombre.charAt(0)}
                </div>
              </div>
              <div className="space-y-3">
                <div className="border-b border-border pb-3">
                  <p className="text-sm text-muted-foreground">ID</p>
                  <p className="font-medium">#{selectedUsuario.id}</p>
                </div>
                <div className="border-b border-border pb-3">
                  <p className="text-sm text-muted-foreground">Nombre Completo</p>
                  <p className="font-medium">{selectedUsuario.nombre}</p>
                </div>
                <div className="border-b border-border pb-3">
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{selectedUsuario.email}</p>
                </div>
                <div className="border-b border-border pb-3">
                  <p className="text-sm text-muted-foreground">Teléfono</p>
                  <p className="font-medium">{selectedUsuario.telefono}</p>
                </div>
                <div className="border-b border-border pb-3">
                  <p className="text-sm text-muted-foreground">Rol</p>
                  <span className="inline-block px-2 py-1 bg-primary/10 text-primary rounded text-sm">
                    {selectedUsuario.rol}
                  </span>
                </div>
                <div className="border-b border-border pb-3">
                  <p className="text-sm text-muted-foreground">Estado</p>
                  <span className={`inline-block px-2 py-1 rounded text-sm ${
                    selectedUsuario.estado === 'Activo'
                      ? 'bg-success/10 text-success'
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {selectedUsuario.estado}
                  </span>
                </div>
                <div className="pb-3">
                  <p className="text-sm text-muted-foreground">Fecha de Creación</p>
                  <p className="font-medium">{selectedUsuario.fechaCreacion}</p>
                </div>
              </div>
              <button
                onClick={() => setShowDetailModal(false)}
                className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Editar */}
      {showEditModal && editData && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card p-6 rounded-lg w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2>Editar Usuario</h2>
              <button onClick={() => setShowEditModal(false)} className="p-2 hover:bg-muted rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block mb-2">Nombre Completo</label>
                <input
                  type="text"
                  value={editData.nombre}
                  onChange={(e) => setEditData({ ...editData, nombre: e.target.value })}
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
                <label className="block mb-2">Teléfono</label>
                <input
                  type="tel"
                  value={editData.telefono}
                  onChange={(e) => setEditData({ ...editData, telefono: e.target.value })}
                  className="w-full px-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="block mb-2">Rol</label>
                <select
                  value={editData.rol}
                  onChange={(e) => setEditData({ ...editData, rol: e.target.value })}
                  className="w-full px-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option>Administrador</option>
                  <option>Vendedor</option>
                  <option>Almacenista</option>
                </select>
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
                  <X className="w-4 h-4 inline mr-2" />
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
        title="Eliminar Usuario"
        message={`¿Estás seguro de que deseas eliminar al usuario "${deleteDialog.nombre}"? Esta acción no se puede deshacer.`}
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
