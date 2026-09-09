// dashboardService.js - Servicio de datos para el Panel de Datos de CENAREPAS
export const getDashboardData = async () => {
  return {
    kpis: {
      ventasHoy: 2450000,
      ventasHoyCambio: 12.5,
      pedidosProcesados: 84,
      pedidosCambio: 8.0,
      insumosActivos: 37,
      insumosCambio: -3.0,
      produccionDia: 1240,
      produccionCambio: 5.0,
    },

    pedidosFlow: {
      belloOriente: 48,
      aranjuez: 36,
    },

    ventasSemana: {
      total: 18680000,
      rango: '24–30 ago',
      dias: [
        { dia: 'Lun', ventas: 2100000 },
        { dia: 'Mar', ventas: 2600000 },
        { dia: 'Mié', ventas: 2300000 },
        { dia: 'Jue', ventas: 2900000 },
        { dia: 'Vie', ventas: 2750000 },
        { dia: 'Sáb', ventas: 3200000 },
        { dia: 'Dom', ventas: 2830000 },
      ],
    },

    produccionLineas: [
      { linea: 'Blanca', unidades: 620, destacada: false },
      { linea: 'Amarilla', unidades: 980, destacada: true },
      { linea: 'Integral', unidades: 410, destacada: false },
      { linea: 'Queso', unidades: 710, destacada: false },
    ],

    topClientes: [
      { id: 1, iniciales: 'PE', nombre: 'Panadería La Espiga', pedidos: 132, color: '#c1502d' },
      { id: 2, iniciales: 'ET', nombre: 'Supermercado El Trigal', pedidos: 118, color: '#e2895f' },
      { id: 3, iniciales: 'SA', nombre: 'Restaurante Sabor Antioqueño', pedidos: 96, color: '#e8b23d' },
      { id: 4, iniciales: 'DR', nombre: 'Tienda Doña Rosa', pedidos: 84, color: '#5a7a3a' },
      { id: 5, iniciales: 'CC', nombre: 'Cafetería Central', pedidos: 71, color: '#f5ecd8' },
    ],

    alertas: [
      {
        id: 1,
        icono: 'package',
        titulo: 'Stock bajo de harina de maíz',
        detalle: 'Por debajo del mínimo en Bello Oriente',
        accion: 'Ver Insumos',
        path: '/admin/insumos',
        tono: 'terracota',
      },
      {
        id: 2,
        icono: 'clock',
        titulo: 'Pedido #4821 retrasado',
        detalle: 'Producción sin iniciar, vence hoy',
        accion: 'Ver Pedido',
        path: '/admin/pedidos',
        tono: 'maiz',
      },
      {
        id: 3,
        icono: 'trending-down',
        titulo: 'Caída en ventas — Aranjuez',
        detalle: '-9% frente a la semana anterior',
        accion: 'Ver Ventas',
        path: '/admin/ventas',
        tono: 'beige',
      },
      {
        id: 4,
        icono: 'user-x',
        titulo: 'Usuario sin rol asignado',
        detalle: 'jvargas@cenarepas.com',
        accion: 'Asignar Rol',
        path: '/admin/usuarios',
        tono: 'verde',
      },
    ],

    insumosRotacion: [
      { insumo: 'Harina de Maíz Amarillo', rotacionDias: 4.2, stock: '180 kg', estado: 'critico' },
      { insumo: 'Harina de Maíz Blanco', rotacionDias: 7.8, stock: '340 kg', estado: 'atencion' },
      { insumo: 'Sal Refinada', rotacionDias: 21.5, stock: '90 kg', estado: 'optimo' },
      { insumo: 'Empaques x100', rotacionDias: 12.1, stock: '2.400 un.', estado: 'optimo' },
    ],

    // Cockpit oscuro (vista principal del Dashboard)
    featuredInsumos: [
      {
        id: 'harina-amarilla',
        nombre: 'Harina Maíz Amarillo',
        icono: 'wheat',
        rotacionDias: 4.2,
        deltaPct: -14.3,
        deltaAbs: '-0.7d',
        tendencia: [5.6, 5.4, 5.1, 4.9, 4.6, 4.4, 4.2],
      },
      {
        id: 'harina-blanca',
        nombre: 'Harina Maíz Blanco',
        icono: 'wheat',
        rotacionDias: 7.8,
        deltaPct: 6.8,
        deltaAbs: '+0.5d',
        tendencia: [7.1, 7.2, 7.0, 7.4, 7.5, 7.6, 7.8],
      },
      {
        id: 'sal-refinada',
        nombre: 'Sal Refinada',
        icono: 'package',
        rotacionDias: 21.5,
        deltaPct: 2.1,
        deltaAbs: '+0.4d',
        tendencia: [20.8, 21.0, 20.9, 21.1, 21.2, 21.3, 21.5],
      },
    ],

    pedidoActivo: {
      id: '#4821',
      cliente: 'Panadería La Espiga',
      sede: 'Bello Oriente',
      estado: 'retrasado',
      unidades: 3200,
      cicloProduccion: {
        etapaActualIndex: 1,
        etapas: ['Insumos', 'Producción', 'Empaque', 'Despacho'],
      },
    },

    metricas: [
      {
        id: 'rotacion',
        label: 'Rotación de Insumos',
        valor: '9.2d',
        deltaPct: -5.1,
        periodo: '24H',
        detalle: 'Promedio ponderado de los 12 insumos activos, últimos 30 días.',
      },
      {
        id: 'produccion',
        label: 'Producción General',
        valor: '1.240 un.',
        deltaPct: 5.0,
        periodo: '24H',
        detalle: 'Suma de las 4 líneas de producción activas hoy.',
      },
      {
        id: 'riesgo',
        label: 'Riesgo de Desabasto',
        valor: '2 críticos',
        deltaPct: 12.0,
        periodo: '24H',
        negativoEsMalo: true,
        detalle: 'Harina de Maíz Amarillo y 1 insumo más por debajo del mínimo.',
      },
      {
        id: 'rentabilidad',
        label: 'Rentabilidad',
        valor: '32.4%',
        deltaPct: 2.3,
        periodo: '24H',
        detalle: 'Margen bruto estimado sobre ventas de la semana.',
      },
    ],

    controlMonitoreo: {
      disponibilidad: '99.8%',
      usuariosActivos: 24,
      ultimoRespaldo: 'Hoy · 03:40',
      accesosDenegados: 3,
      produccionComparativa: [
        { dia: 'Lun', semanaAnterior: 860, semanaActual: 900 },
        { dia: 'Mar', semanaAnterior: 880, semanaActual: 960 },
        { dia: 'Mié', semanaAnterior: 905, semanaActual: 1080 },
        { dia: 'Jue', semanaAnterior: 895, semanaActual: 1020, riesgo: true },
        { dia: 'Vie', semanaAnterior: 915, semanaActual: 1140 },
        { dia: 'Sáb', semanaAnterior: 930, semanaActual: 1210 },
        { dia: 'Dom', semanaAnterior: 945, semanaActual: 1280 },
      ],
    },
  };
};
