import { useState, useEffect } from 'react';
import { getDashboardData } from '../services/dashboardService';

export function useDashboard() {
  const [data, setData] = useState({
    kpis: { ventasHoy: '$7,245', pedidosActivos: 24, nuevosClientes: 18, alertasStock: 12 },
    ventasDiarias: [],
    ventasMensuales: [],
    topProductos: [],
    stockCategoria: [],
    alertas: [],
    ultimasVentas: [],
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Carga placeholder de datos
    setIsLoading(true);
    getDashboardData().then(res => {
      // Mantenemos la estructura vacía/por defecto lista para backend
      setIsLoading(false);
    });
  }, []);

  return { data, isLoading };
}
