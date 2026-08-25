import DetailModal from '../../../shared/components/DetailModal';
import StatusBadge from '../../../shared/components/StatusBadge';

export function ProveedorDetailModal({ open, proveedor, onClose }) {
  if (!open || !proveedor) return null;

  return (
    <DetailModal open={open} title="Detalle del Proveedor" onClose={onClose}>
      <div className="border-b border-border pb-3">
        <p className="text-sm text-muted-foreground">ID</p>
        <p className="font-medium">#{proveedor.id_proveedor}</p>
      </div>
      <div className="border-b border-border pb-3">
        <p className="text-sm text-muted-foreground">Nombre de la Empresa</p>
        <p className="font-medium">{proveedor.nombre}</p>
      </div>
      <div className="border-b border-border pb-3">
        <p className="text-sm text-muted-foreground">NIT</p>
        <p className="font-medium">{proveedor.nit}</p>
      </div>
      <div className="border-b border-border pb-3">
        <p className="text-sm text-muted-foreground">Teléfono</p>
        <p className="font-medium">{proveedor.telefono}</p>
      </div>
      <div className="border-b border-border pb-3">
        <p className="text-sm text-muted-foreground">Email</p>
        <p className="font-medium">{proveedor.correo}</p>
      </div>
      <div className="border-b border-border pb-3">
        <p className="text-sm text-muted-foreground">Dirección</p>
        <p className="font-medium">{proveedor.direccion}</p>
      </div>
      <div className="pb-3">
        <p className="text-sm text-muted-foreground">Estado</p>
        <StatusBadge
          status={proveedor.estado}
          className={proveedor.estado === 'activo' ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'}
        />
      </div>
      <div className="border-b border-border pb-3">
        <p className="text-sm text-muted-foreground">Fecha de Creación</p>
        <p className="font-medium">{proveedor.fecha_creacion}</p>
      </div>
    </DetailModal>
  );
}
