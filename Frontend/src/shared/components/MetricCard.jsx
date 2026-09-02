export function MetricCard({ title, value, icon: Icon, variant = 'primary' }) {
  const variantStyles = {
    primary: 'bg-primary/10 text-primary',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
    accent: 'bg-accent/10 text-primary',
    destructive: 'bg-destructive/10 text-destructive',
  };

  const iconStyle = variantStyles[variant] || variantStyles.primary;

  return (
    <div className="bg-card p-4 rounded-lg border border-border flex items-center gap-3">
      {Icon && (
        <div className={`p-3 rounded-lg ${iconStyle}`}>
          <Icon className="w-5 h-5" />
        </div>
      )}
      <div>
        <p className="text-sm text-muted-foreground">{title}</p>
        <h3 className="text-xl font-bold">{value}</h3>
      </div>
    </div>
  );
}

export default MetricCard;
