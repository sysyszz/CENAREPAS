import { X, Building2, Phone, Mail, MapPin, Hash, Calendar, ShieldCheck, ShieldAlert } from 'lucide-react';

export function ProveedorDetailModal({ open, proveedor, onClose }) {
  if (!open || !proveedor) return null;

  const isActive = String(proveedor.estado || '').toLowerCase() === 'activo';

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('es-CO', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-card text-card-foreground p-6 rounded-2xl max-w-md w-full border border-border shadow-2xl space-y-5 animate-in fade-in-50 zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
              <Building2 className="size-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight text-foreground">{proveedor.nombre}</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                NIT: {proveedor.nit || 'Sin registrar'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            aria-label="Cerrar modal"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* State Badge */}
        <div className="flex justify-center">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
              isActive
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                : 'bg-destructive/10 text-destructive border border-destructive/20'
            }`}
          >
            {isActive ? (
              <>
                <ShieldCheck className="size-3.5" />
                Proveedor Activo
              </>
            ) : (
              <>
                <ShieldAlert className="size-3.5" />
                Proveedor Inactivo
              </>
            )}
          </span>
        </div>

        {/* Details Grid */}
        <div className="space-y-2.5 text-xs">
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-muted/40 border border-border/50">
            <span className="text-muted-foreground flex items-center gap-1.5 font-medium">
              <Hash className="size-3.5 text-primary" />
              ID de Registro
            </span>
            <span className="font-mono font-bold text-foreground">
              #{proveedor.id_proveedor}
            </span>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-muted/40 border border-border/50">
            <span className="text-muted-foreground flex items-center gap-1.5 font-medium">
              <Phone className="size-3.5 text-primary" />
              Teléfono
            </span>
            <span className="font-medium text-foreground">
              {proveedor.telefono || 'N/A'}
            </span>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-muted/40 border border-border/50">
            <span className="text-muted-foreground flex items-center gap-1.5 font-medium">
              <Mail className="size-3.5 text-primary" />
              Correo Electrónico
            </span>
            <span className="font-medium text-foreground truncate max-w-[200px]">
              {proveedor.correo || 'N/A'}
            </span>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-muted/40 border border-border/50">
            <span className="text-muted-foreground flex items-center gap-1.5 font-medium">
              <MapPin className="size-3.5 text-primary" />
              Dirección
            </span>
            <span className="font-medium text-foreground text-right truncate max-w-[200px]">
              {proveedor.direccion || 'N/A'}
            </span>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-muted/40 border border-border/50">
            <span className="text-muted-foreground flex items-center gap-1.5 font-medium">
              <Calendar className="size-3.5 text-primary" />
              Fecha de Registro
            </span>
            <span className="font-medium text-foreground">
              {formatDate(proveedor.fecha_creacion)}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-border flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2 bg-primary text-primary-foreground hover:opacity-90 rounded-xl text-xs sm:text-sm font-semibold transition-opacity shadow-xs cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProveedorDetailModal;
