import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Package, Users, AlertTriangle, Clock } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const salesData = [
    { name: 'Lun', ventas: 4000, compras: 2400 },
    { name: 'Mar', ventas: 3000, compras: 1398 },
    { name: 'Mié', ventas: 2000, compras: 9800 },
    { name: 'Jue', ventas: 2780, compras: 3908 },
    { name: 'Vie', ventas: 1890, compras: 4800 },
    { name: 'Sáb', ventas: 2390, compras: 3800 },
    { name: 'Dom', ventas: 3490, compras: 4300 },
  ];

  const productData = [
    { name: 'Producto A', value: 400 },
    { name: 'Producto B', value: 300 },
    { name: 'Producto C', value: 300 },
    { name: 'Producto D', value: 200 },
  ];

  const COLORS = ['#2563EB', '#38BDF8', '#22C55E', '#F59E0B'];

  const stats = [
    { label: 'Ventas Hoy', value: '$12,450', change: '+12.5%', icon: DollarSign, color: 'text-success', bg: 'bg-success/10' },
    { label: 'Pedidos Pendientes', value: '24', change: '+3', icon: ShoppingCart, color: 'text-accent', bg: 'bg-accent/10' },
    { label: 'Productos', value: '156', change: '+8', icon: Package, color: 'text-primary', bg: 'bg-primary/10' },
    { label: 'Clientes Activos', value: '89', change: '+15', icon: Users, color: 'text-warning', bg: 'bg-warning/10' },
  ];

  const recentSales = [
    { id: '#VEN-001', cliente: 'Juan Pérez', monto: '$450', estado: 'Completada' },
    { id: '#VEN-002', cliente: 'María García', monto: '$320', estado: 'Completada' },
    { id: '#VEN-003', cliente: 'Carlos López', monto: '$890', estado: 'Pendiente' },
    { id: '#VEN-004', cliente: 'Ana Martínez', monto: '$250', estado: 'Completada' },
  ];

  const alerts = [
    { producto: 'Insumo X', tipo: 'Stock bajo', cantidad: '5 unidades', icon: AlertTriangle, color: 'text-warning' },
    { producto: 'Insumo Y', tipo: 'Por vencer', fecha: '2 días', icon: Clock, color: 'text-destructive' },
    { producto: 'Insumo Z', tipo: 'Stock bajo', cantidad: '3 unidades', icon: AlertTriangle, color: 'text-warning' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Dashboard</h1>
          <p className="text-muted-foreground">Resumen general del sistema</p>
        </div>
        <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90">
          Exportar Reporte
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-card p-6 rounded-lg border border-border">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${stat.bg}`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <span className={`text-sm ${stat.color}`}>{stat.change}</span>
              </div>
              <p className="text-muted-foreground text-sm">{stat.label}</p>
              <h2 className="mt-1">{stat.value}</h2>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div className="bg-card p-6 rounded-lg border border-border">
          <h3 className="mb-4">Ventas y Compras Semanales</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="name" stroke="#64748B" />
              <YAxis stroke="#64748B" />
              <Tooltip />
              <Legend />
              <Bar key="ventas-bar" dataKey="ventas" fill="#2563EB" />
              <Bar key="compras-bar" dataKey="compras" fill="#38BDF8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-card p-6 rounded-lg border border-border">
          <h3 className="mb-4">Productos Más Vendidos</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={productData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {productData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Line Chart */}
      <div className="bg-card p-6 rounded-lg border border-border">
        <h3 className="mb-4">Tendencia de Ventas</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={salesData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
            <XAxis dataKey="name" stroke="#64748B" />
            <YAxis stroke="#64748B" />
            <Tooltip />
            <Legend />
            <Line key="ventas-line" type="monotone" dataKey="ventas" stroke="#2563EB" strokeWidth={2} />
            <Line key="compras-line" type="monotone" dataKey="compras" stroke="#38BDF8" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Activity & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Sales */}
        <div className="bg-card p-6 rounded-lg border border-border">
          <h3 className="mb-4">Últimas Ventas</h3>
          <div className="space-y-4">
            {recentSales.map((sale) => (
              <div key={sale.id} className="flex items-center justify-between pb-4 border-b border-border last:border-0">
                <div>
                  <p className="font-medium">{sale.id}</p>
                  <p className="text-sm text-muted-foreground">{sale.cliente}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{sale.monto}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    sale.estado === 'Completada'
                      ? 'bg-success/10 text-success'
                      : 'bg-warning/10 text-warning'
                  }`}>
                    {sale.estado}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Alerts */}
        <div className="bg-card p-6 rounded-lg border border-border">
          <h3 className="mb-4">Alertas del Sistema</h3>
          <div className="space-y-4">
            {alerts.map((alert, index) => {
              const Icon = alert.icon;
              return (
                <div key={index} className="flex items-start gap-3 pb-4 border-b border-border last:border-0">
                  <div className={`p-2 rounded-lg ${alert.color === 'text-warning' ? 'bg-warning/10' : 'bg-destructive/10'}`}>
                    <Icon className={`w-5 h-5 ${alert.color}`} />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{alert.producto}</p>
                    <p className="text-sm text-muted-foreground">{alert.tipo}</p>
                    <p className="text-sm text-muted-foreground">{alert.cantidad || alert.fecha}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
