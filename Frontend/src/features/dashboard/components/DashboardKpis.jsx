import { TrendingUp, DollarSign, ShoppingCart, Users, AlertTriangle, Package, Activity } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../shared/components/Card';

export function DashboardKpis({ kpis = {} }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card style={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0' }}>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm" style={{ color: '#64748B' }}>
            Ventas Hoy
          </CardTitle>
          <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#EFF6FF' }}>
            <DollarSign className="w-4 h-4" style={{ color: '#2563EB' }} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl mb-1" style={{ color: '#0F172A', fontWeight: 600 }}>
            {kpis.ventasHoy || '$0'}
          </div>
          <p className="text-xs flex items-center gap-1" style={{ color: '#22C55E' }}>
            <TrendingUp className="w-3 h-3" />
            +12.5% vs ayer
          </p>
        </CardContent>
      </Card>

      <Card style={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0' }}>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm" style={{ color: '#64748B' }}>
            Pedidos Activos
          </CardTitle>
          <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#F0F9FF' }}>
            <ShoppingCart className="w-4 h-4" style={{ color: '#38BDF8' }} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl mb-1" style={{ color: '#0F172A', fontWeight: 600 }}>
            {kpis.pedidosActivos || 0}
          </div>
          <p className="text-xs flex items-center gap-1" style={{ color: '#64748B' }}>
            <Activity className="w-3 h-3" />
            8 pendientes de procesar
          </p>
        </CardContent>
      </Card>

      <Card style={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0' }}>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm" style={{ color: '#64748B' }}>
            Nuevos Clientes
          </CardTitle>
          <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#F0FDF4' }}>
            <Users className="w-4 h-4" style={{ color: '#22C55E' }} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl mb-1" style={{ color: '#0F172A', fontWeight: 600 }}>
            +{kpis.nuevosClientes || 0}
          </div>
          <p className="text-xs flex items-center gap-1" style={{ color: '#22C55E' }}>
            <TrendingUp className="w-3 h-3" />
            +8.2% esta semana
          </p>
        </CardContent>
      </Card>

      <Card style={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0' }}>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm" style={{ color: '#64748B' }}>
            Alertas Stock
          </CardTitle>
          <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#FEF3C7' }}>
            <AlertTriangle className="w-4 h-4" style={{ color: '#F59E0B' }} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl mb-1" style={{ color: '#0F172A', fontWeight: 600 }}>
            {kpis.alertasStock || 0}
          </div>
          <p className="text-xs flex items-center gap-1" style={{ color: '#F59E0B' }}>
            <Package className="w-3 h-3" />
            Requieren atención
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
