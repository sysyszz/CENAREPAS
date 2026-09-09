import { motion } from 'framer-motion';

export function MetricCard({ title, value, icon: Icon, variant = 'primary', index = 0 }) {
  const variantStyles = {
    primary: 'bg-primary/10 text-primary',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
    accent: 'bg-accent/10 text-primary',
    destructive: 'bg-destructive/10 text-destructive',
  };

  const iconStyle = variantStyles[variant] || variantStyles.primary;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: (index || 0) * 0.08, ease: 'easeOut' }}
      className="bg-card p-4 rounded-xl border border-border flex items-center gap-3 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-default"
    >
      {Icon && (
        <div className={`p-3 rounded-lg ${iconStyle} shrink-0 transition-transform duration-200`}>
          <Icon className="w-5 h-5" />
        </div>
      )}
      <div>
        <p className="text-sm text-muted-foreground">{title}</p>
        <h3 className="text-xl font-bold text-foreground">{value}</h3>
      </div>
    </motion.div>
  );
}

export default MetricCard;

