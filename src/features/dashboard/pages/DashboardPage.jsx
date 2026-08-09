import { useDashboard } from '../hooks/useDashboard';
import { DashboardKpis } from '../components/DashboardKpis';
import { DashboardCharts } from '../components/DashboardCharts';
import { DashboardRecentActivity } from '../components/DashboardRecentActivity';

export default function DashboardPage() {
  const { data } = useDashboard();

  return (
    <div className="space-y-6">
      <DashboardKpis kpis={data.kpis} />
      <DashboardCharts
        ventasDiarias={data.ventasDiarias}
        topProductos={data.topProductos}
        ventasMensuales={data.ventasMensuales}
        stockCategoria={data.stockCategoria}
      />
      <DashboardRecentActivity
        alertas={data.alertas}
        ultimasVentas={data.ultimasVentas}
      />
    </div>
  );
}
