import { X } from 'lucide-react';

export function UsuarioDetailModal({ open, usuario, onClose }) {
  if (!open || !usuario) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card p-6 rounded-lg w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h2>Detalle del Usuario</h2>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-center mb-4">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary text-2xl">
              {usuario.nombre.charAt(0)}
            </div>
          </div>
          <div className="space-y-3">
            <div className="border-b border-border pb-3">
              <p className="text-sm text-muted-foreground">ID</p>
              <p className="font-medium">#{usuario.id}</p>
            </div>
            <div className="border-b border-border pb-3">
              <p className="text-sm text-muted-foreground">Nombre Completo</p>
              <p className="font-medium">{usuario.nombre}</p>
            </div>
            <div className="border-b border-border pb-3">
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{usuario.email}</p>
            </div>
            <div className="border-b border-border pb-3">
              <p className="text-sm text-muted-foreground">Teléfono</p>
              <p className="font-medium">{usuario.telefono}</p>
            </div>
            <div className="border-b border-border pb-3">
              <p className="text-sm text-muted-foreground">Rol</p>
              <span className="inline-block px-2 py-1 bg-primary/10 text-primary rounded text-sm">
                {usuario.rol}
              </span>
            </div>
            <div className="border-b border-border pb-3">
              <p className="text-sm text-muted-foreground">Estado</p>
              <span className={`inline-block px-2 py-1 rounded text-sm ${
                usuario.estado === 'Activo'
                  ? 'bg-success/10 text-success'
                  : 'bg-muted text-muted-foreground'
              }`}>
                {usuario.estado}
              </span>
            </div>
            <div className="pb-3">
              <p className="text-sm text-muted-foreground">Fecha de Creación</p>
              <p className="font-medium">{usuario.fechaCreacion}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
