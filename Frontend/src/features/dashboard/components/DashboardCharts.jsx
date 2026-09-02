import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../../shared/components/Card";

const PRODUCT_COLORS = ['#2563EB', '#38BDF8', '#22C55E', '#F59E0B'];

export function DashboardCharts({
  ventasDiarias = [],
  topProductos = [],
  ventasMensuales = [],
  stockCategoria = []
}) {
  return (
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
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ventasDiarias}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="dia" stroke="#64748B" />
                <YAxis stroke="#64748B" />
                <Tooltip />
                <Bar dataKey="ventas" fill="#2563EB" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
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
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
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
                    <Cell key={`cell-${index}`} fill={entry.color || PRODUCT_COLORS[index % PRODUCT_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
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
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={ventasMensuales}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="mes" stroke="#64748B" />
                <YAxis stroke="#64748B" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="total" stroke="#2563EB" strokeWidth={2} name="Ventas" />
              </LineChart>
            </ResponsiveContainer>
          </div>
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
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stockCategoria} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis type="number" stroke="#64748B" />
                <YAxis dataKey="categoria" type="category" stroke="#64748B" width={100} />
                <Tooltip />
                <Bar dataKey="cantidad" fill="#22C55E" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
