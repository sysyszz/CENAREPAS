// dashboardService.js - Servicio para datos del dashboard en Masarepas
export const getDashboardData = async () => {
  return {
    kpis: {
      ventasHoy: 3850000,
      pedidosActivos: 12,
      nuevosClientes: 4,
      alertasStock: 2,
    },
    ventasDiarias: [
      { dia: 'Lun', ventas: 1200000 },
      { dia: 'Mar', ventas: 1850000 },
      { dia: 'Mié', ventas: 2400000 },
      { dia: 'Jue', ventas: 2100000 },
      { dia: 'Vie', ventas: 3850000 },
      { dia: 'Sáb', ventas: 4200000 },
      { dia: 'Dom', ventas: 1500000 },
    ],
    ventasMensuales: [
      { mes: 'Ene', total: 45000000 },
      { mes: 'Feb', total: 52000000 },
      { mes: 'Mar', total: 68000000 },
    ],
    topProductos: [
      { nombre: 'Arepa de Chócolo', cantidad: 4500 },
      { nombre: 'Arepa Telita', cantidad: 6200 },
      { nombre: 'Arepa Queso Doble Crema', cantidad: 3800 },
      { nombre: 'Peto Cocido Congelado', cantidad: 1200 },
    ],
    stockCategoria: [
      { categoria: 'Arepas Blancas', cantidad: 1800 },
      { categoria: 'Arepas Rellenas', cantidad: 850 },
      { categoria: 'Arepas Dulces', cantidad: 450 },
      { categoria: 'Derivados de Maíz', cantidad: 300 },
    ],
    alertas: [
      { id: 1, titulo: 'Stock Bajo: Mantequilla Industrial', tipo: 'warning', fecha: 'Hoy, 09:30 AM' },
      { id: 2, titulo: 'Lote de Arepas Santandereana en verificación', tipo: 'info', fecha: 'Hoy, 11:15 AM' },
    ],
    ultimasVentas: [
      { id: 1, codigo: 'VTA-001', cliente: 'Supermercados Mercacentro', total: '$2.475.000', fecha: 'Hoy' },
      { id: 2, codigo: 'VTA-002', cliente: 'Restaurantes El Arriero', total: '$225.000', fecha: 'Hoy' },
      { id: 3, codigo: 'VTA-003', cliente: 'Tiendas D1 Regional', total: '$3.300.000', fecha: 'Ayer' },
    ],
  };
};

