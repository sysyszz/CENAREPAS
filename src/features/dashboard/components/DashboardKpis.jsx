import { TrendingUp, DollarSign, ShoppingCart, Users, AlertTriangle, Package, Activity } from 'lucide-react';
import StatCard from '../../../shared/components/StatCard';
import StatsGrid from '../../../shared/components/StatsGrid';

export function DashboardKpis({ kpis = {} }) {
  return (
    <StatsGrid>
      <StatCard label="Ventas Hoy" value={kpis.ventasHoy || '$0'} icon={DollarSign} footer={<p className="text-xs flex items-center gap-1" style={{ color: '#22C55E' }}><TrendingUp className="w-3 h-3" />+12.5% vs ayer</p>} />

      <StatCard label="Pedidos Activos" value={kpis.pedidosActivos || 0} icon={ShoppingCart} iconColor="#38BDF8" iconBackground="#F0F9FF" footer={<p className="text-xs flex items-center gap-1" style={{ color: '#64748B' }}><Activity className="w-3 h-3" />8 pendientes de procesar</p>} />

      <StatCard label="Nuevos Clientes" value={`+${kpis.nuevosClientes || 0}`} icon={Users} iconColor="#22C55E" iconBackground="#F0FDF4" footer={<p className="text-xs flex items-center gap-1" style={{ color: '#22C55E' }}><TrendingUp className="w-3 h-3" />+8.2% esta semana</p>} />

      <StatCard label="Alertas Stock" value={kpis.alertasStock || 0} icon={AlertTriangle} iconColor="#F59E0B" iconBackground="#FEF3C7" footer={<p className="text-xs flex items-center gap-1" style={{ color: '#F59E0B' }}><Package className="w-3 h-3" />Requieren atención</p>} />
    </StatsGrid>
  );
}
