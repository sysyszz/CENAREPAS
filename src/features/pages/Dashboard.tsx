import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  AlertTriangle,
  Activity,
} from "lucide-react";
import { Badge } from "../components/ui/badge";

const ventasDiarias = [
  { dia: "Lun", ventas: 4200 },
  { dia: "Mar", ventas: 3800 },
  { dia: "Mié", ventas: 5100 },
  { dia: "Jue", ventas: 4700 },
  { dia: "Vie", ventas: 6300 },
  { dia: "Sáb", ventas: 7200 },
  { dia: "Dom", ventas: 5800 },
];

const ventasMensuales = [
  { mes: "Ene", ventas: 45000, compras: 28000 },
  { mes: "Feb", ventas: 52000, compras: 32000 },
  { mes: "Mar", ventas: 48000, compras: 30000 },
  { mes: "Abr", ventas: 61000, compras: 38000 },
  { mes: "May", ventas: 55000, compras: 35000 },
  { mes: "Jun", ventas: 67000, compras: 42000 },
];

const topProductos = [
  { nombre: "Producto A", cantidad: 450, color: "#2563EB" },
  { nombre: "Producto B", cantidad: 320, color: "#38BDF8" },
  { nombre: "Producto C", cantidad: 280, color: "#22C55E" },
  { nombre: "Producto D", cantidad: 210, color: "#F59E0B" },
  { nombre: "Producto E", cantidad: 180, color: "#EF4444" },
];

const stockCategoria = [
  { categoria: "Materia Prima", stock: 85 },
  { categoria: "Envases", stock: 62 },
  { categoria: "Etiquetas", stock: 45 },
  { categoria: "Insumos", stock: 73 },
];

const alertas = [
  { id: 1, tipo: "stock", mensaje: "Insumo XYZ - Stock bajo (12 unidades)", fecha: "Hace 2 horas" },
  { id: 2, tipo: "vencimiento", mensaje: "Lote #453 vence en 5 días", fecha: "Hace 4 horas" },
  { id: 3, tipo: "stock", mensaje: "Producto ABC - Stock crítico (5 unidades)", fecha: "Hace 6 horas" },
  { id: 4, tipo: "vencimiento", mensaje: "Lote #421 vence en 7 días", fecha: "Ayer" },
];

const ultimasVentas = [
  { id: "#VT-1245", cliente: "Juan Pérez", total: 1250, estado: "completada", fecha: "27/05/2026" },
  { id: "#VT-1244", cliente: "María García", total: 850, estado: "completada", fecha: "27/05/2026" },
  { id: "#VT-1243", cliente: "Carlos López", total: 2100, estado: "pendiente", fecha: "26/05/2026" },
  { id: "#VT-1242", cliente: "Ana Martínez", total: 650, estado: "completada", fecha: "26/05/2026" },
  { id: "#VT-1241", cliente: "Luis Rodríguez", total: 1450, estado: "completada", fecha: "26/05/2026" },
];

export function Dashboard() {
  return (
    <div className="space-y-6">
      {/* KPIs */}
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
              $7,245
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
              24
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
              +18
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
              12
            </div>
            <p className="text-xs flex items-center gap-1" style={{ color: '#F59E0B' }}>
              <Package className="w-3 h-3" />
              Requieren atención
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficas Principales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ventas Diarias */}
        <Card style={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0' }}>
          <CardHeader>
            <CardTitle style={{ color: '#0F172A' }}>Ventas de la Semana</CardTitle>
            <CardDescription style={{ color: '#64748B' }}>
              Comparativa de ventas diarias
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={ventasDiarias}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="dia" stroke="#64748B" />
                <YAxis stroke="#64748B" />
                <Tooltip />
                <Bar dataKey="ventas" fill="#2563EB" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Productos */}
        <Card style={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0' }}>
          <CardHeader>
            <CardTitle style={{ color: '#0F172A' }}>Productos Más Vendidos</CardTitle>
            <CardDescription style={{ color: '#64748B' }}>
              Distribución por producto
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={topProductos}
                  dataKey="cantidad"
                  nameKey="nombre"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {topProductos.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Ventas vs Compras */}
        <Card style={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0' }}>
          <CardHeader>
            <CardTitle style={{ color: '#0F172A' }}>Ventas vs Compras</CardTitle>
            <CardDescription style={{ color: '#64748B' }}>
              Comparativa mensual
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={ventasMensuales}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="mes" stroke="#64748B" />
                <YAxis stroke="#64748B" />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="ventas"
                  stroke="#2563EB"
                  strokeWidth={2}
                  name="Ventas"
                />
                <Line
                  type="monotone"
                  dataKey="compras"
                  stroke="#38BDF8"
                  strokeWidth={2}
                  name="Compras"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Stock por Categoría */}
        <Card style={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0' }}>
          <CardHeader>
            <CardTitle style={{ color: '#0F172A' }}>Stock por Categoría</CardTitle>
            <CardDescription style={{ color: '#64748B' }}>
              Nivel de inventario actual
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stockCategoria} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis type="number" stroke="#64748B" />
                <YAxis dataKey="categoria" type="category" stroke="#64748B" width={100} />
                <Tooltip />
                <Bar dataKey="stock" fill="#22C55E" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Alertas y Actividad Reciente */}
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
              {alertas.map((alerta) => (
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
              ))}
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
              {ultimasVentas.map((venta) => (
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
                    <Badge
                      variant={venta.estado === "completada" ? "default" : "secondary"}
                      style={{
                        backgroundColor: venta.estado === "completada" ? "#22C55E" : "#F59E0B",
                        color: "#FFFFFF",
                      }}
                    >
                      {venta.estado}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
