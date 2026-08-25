import { Badge } from './Badge';

const defaultVariantMap = {
  activo: 'default',
  disponible: 'default',
  completada: 'default',
  vigente: 'default',
  inactivo: 'secondary',
  anulada: 'destructive',
  anulado: 'destructive',
  bajo_stock: 'secondary',
  'bajo stock': 'secondary',
};

export default function StatusBadge({ status, label = status, variantMap = defaultVariantMap, className }) {
  const variant = variantMap[String(status).toLowerCase()] || 'outline';

  return (
    <Badge variant={variant} className={className}>
      {label}
    </Badge>
  );
}
