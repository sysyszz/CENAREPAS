// pedidosService.js - Servicio para la gestión de pedidos en Masarepas
export const mockPedidos = [
  {
    id: 1,
    codigo: "PED-2024-001",
    cliente: "Supermercados Mercacentro",
    itemsResumen: "150 paq. Arepa Chócolo, 200 paq. Telita",
    fechaPedido: "2024-03-14",
    fechaEntrega: "2024-03-16",
    total: "$2.475.000",
    totalNum: 2475000,
    vendedor: "Ana Lucía Benítez",
    estado: "Entregado",
  },
  {
    id: 2,
    codigo: "PED-2024-002",
    cliente: "Tiendas D1 Regional",
    itemsResumen: "300 paq. Arepa Queso Doble Crema",
    fechaPedido: "2024-03-15",
    fechaEntrega: "2024-03-17",
    total: "$3.300.000",
    totalNum: 3300000,
    vendedor: "Ana Lucía Benítez",
    estado: "En Camino",
  },
  {
    id: 3,
    codigo: "PED-2024-003",
    cliente: "Distribuidora Arepas Don Juan",
    itemsResumen: "100 paq. Arepa Santandereana con Chicharrón",
    fechaPedido: "2024-03-15",
    fechaEntrega: "2024-03-18",
    total: "$950.000",
    totalNum: 950000,
    vendedor: "Carlos Eduardo Gómez",
    estado: "Pendiente",
  },
  {
    id: 4,
    codigo: "PED-2024-004",
    cliente: "Restaurantes El Arriero",
    itemsResumen: "50 bolsas Peto Cocido 1kg",
    fechaPedido: "2024-03-16",
    fechaEntrega: "2024-03-17",
    total: "$225.000",
    totalNum: 225000,
    vendedor: "Ana Lucía Benítez",
    estado: "Entregado",
  },
];

export const getPedidos = async () => {
  return [...mockPedidos];
};

export const createPedido = async (pedido) => ({ id: Date.now(), ...pedido });
export const updatePedido = async (id, pedido) => ({ id, ...pedido });
export const deletePedido = async (id) => true;

