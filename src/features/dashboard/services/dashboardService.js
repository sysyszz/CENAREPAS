// dashboardService.js - Servicio para datos del dashboard
export const getDashboardData = async () => {
  // Placeholder para llamadas API futuras
  return {
    kpis: { ventasHoy: 0, pedidosActivos: 0, nuevosClientes: 0, alertasStock: 0 },
    ventasDiarias: [],
    ventasMensuales: [],
    topProductos: [],
    stockCategoria: [],
    alertas: [],
    ultimasVentas: [],
  };
};
