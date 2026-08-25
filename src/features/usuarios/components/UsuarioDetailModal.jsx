import DetailModal from '../../../shared/components/DetailModal';
import StatusBadge from '../../../shared/components/StatusBadge';
import { mockRoles } from '../../roles/services/rolesService';

export function UsuarioDetailModal({ open, usuario, onClose }) {
  if (!open || !usuario) return null;
  const roleName = mockRoles.find((role) => role.id_rol === usuario.id_rol)?.nombre || 'Rol no encontrado';

  return (
    <DetailModal open={open} title="Detalle del Usuario" onClose={onClose}>
      <div className="flex items-center justify-center mb-4">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary text-2xl">
          {usuario.nombre.charAt(0)}
        </div>
      </div>
      <div className="space-y-3">
        <div className="border-b border-border pb-3">
          <p className="text-sm text-muted-foreground">ID</p>
          <p className="font-medium">#{usuario.id_usuario}</p>
        </div>
        <div className="border-b border-border pb-3">
          <p className="text-sm text-muted-foreground">Nombre Completo</p>
          <p className="font-medium">{usuario.nombre}</p>
        </div>
        <div className="border-b border-border pb-3">
          <p className="text-sm text-muted-foreground">Email</p>
          <p className="font-medium">{usuario.correo}</p>
        </div>
        <div className="border-b border-border pb-3">
          <p className="text-sm text-muted-foreground">Rol</p>
          <span className="inline-block px-2 py-1 bg-primary/10 text-primary rounded text-sm">
            {roleName}
          </span>
        </div>
        <div className="border-b border-border pb-3">
          <p className="text-sm text-muted-foreground">Estado</p>
          <StatusBadge
            status={usuario.estado}
            className={usuario.estado === 'activo' ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'}
          />
        </div>
        <div className="pb-3">
          <p className="text-sm text-muted-foreground">Fecha de Creación</p>
          <p className="font-medium">{usuario.fecha_creacion}</p>
        </div>
        <div className="border-b border-border pb-3">
          <p className="text-sm text-muted-foreground">Token de Recuperación</p>
          <p className="font-medium">{usuario.token_recuperacion || 'Sin token'}</p>
        </div>
        <div className="pb-3">
          <p className="text-sm text-muted-foreground">Expiración del Token</p>
          <p className="font-medium">{usuario.token_expiracion || 'Sin expiración'}</p>
        </div>
      </div>
    </DetailModal>
  );
}
