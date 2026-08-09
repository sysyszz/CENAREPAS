import { AlertTriangle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../../shared/components/Card';
import { Badge } from '../../../shared/components/Badge';

export function DashboardRecentActivity({ alertas = [], ultimasVentas = [] }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Alertas */}
      <Card style={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0' }}>
        <CardHeader>
          <CardTitle style={{ color: '#0F172A' }}>Alertas del Sistema</CardTitle>
          <CardDescription style={{ color: '#64748B' }}>
            Notificaciones importantes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {alertas.length > 0 ? (
              alertas.map((alerta) => (
                <div
                  key={alerta.id}
                  className="flex items-start gap-3 p-3 rounded-lg"
                  style={{ backgroundColor: '#FEF3C7' }}
                >
                  <AlertTriangle className="w-5 h-5 mt-0.5" style={{ color: '#F59E0B' }} />
                  <div className="flex-1">
                    <p className="text-sm" style={{ color: '#0F172A' }}>
                      {alerta.mensaje}
                    </p>
                    <p className="text-xs mt-1" style={{ color: '#64748B' }}>
                      {alerta.fecha}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500 py-4 text-center">No hay alertas registradas</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Últimas Ventas */}
      <Card style={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0' }}>
        <CardHeader>
          <CardTitle style={{ color: '#0F172A' }}>Últimas Ventas</CardTitle>
          <CardDescription style={{ color: '#64748B' }}>
            Actividad reciente de ventas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {ultimasVentas.length > 0 ? (
              ultimasVentas.map((venta) => (
                <div key={venta.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm" style={{ color: '#0F172A', fontWeight: 500 }}>
                      {venta.id} - {venta.cliente}
                    </p>
                    <p className="text-xs" style={{ color: '#64748B' }}>
                      {venta.fecha}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm" style={{ color: '#0F172A', fontWeight: 600 }}>
                      ${venta.total}
                    </p>
                    <Badge variant={venta.estado === "completada" ? "default" : "secondary"}>
                      {venta.estado}
                    </Badge>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500 py-4 text-center">No hay ventas recientes</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
