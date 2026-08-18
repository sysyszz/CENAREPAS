import { X } from 'lucide-react';

export function ProveedorDetailModal({ open, proveedor, onClose }) {
  if (!open || !proveedor) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card p-6 rounded-lg w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h2>Detalle del Proveedor</h2>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-3">
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
            <span className={`inline-block px-2 py-1 rounded text-sm ${
              proveedor.estado === 'activo'
                ? 'bg-success/10 text-success'
                : 'bg-muted text-muted-foreground'
            }`}>
              {proveedor.estado}
            </span>
          </div>
          <div className="border-b border-border pb-3">
            <p className="text-sm text-muted-foreground">Fecha de Creación</p>
            <p className="font-medium">{proveedor.fecha_creacion}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 mt-4"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}
