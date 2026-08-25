import { Card, CardHeader, CardTitle, CardContent } from './Card';

export default function StatCard({
  label,
  value,
  icon: Icon,
  iconColor = '#2563EB',
  iconBackground = '#EFF6FF',
  footer,
  className = '',
  variant = 'dashboard',
}) {
  if (variant === 'compact') {
    return (
      <div className={`bg-card p-4 rounded-lg border border-border flex items-center gap-3 ${className}`}>
        <div className="p-3 rounded-lg" style={{ backgroundColor: iconBackground, color: iconColor }}>
          {Icon && <Icon className="w-5 h-5" />}
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <h3 className="text-xl font-bold">{value}</h3>
        </div>
      </div>
    );
  }

  return (
    <Card className={className} style={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0' }}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm" style={{ color: '#64748B' }}>{label}</CardTitle>
        {Icon && (
          <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: iconBackground }}>
            <Icon className="w-4 h-4" style={{ color: iconColor }} />
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl mb-1" style={{ color: '#0F172A', fontWeight: 600 }}>{value}</div>
        {footer}
      </CardContent>
    </Card>
  );
}
