// pedidosService.js - Servicio para la gestión de pedidos en Masarepas
export const mockPedidos = [
  {
    id_pedido: 1, id_cliente: 1, id_sede: 1, id_usuario: 4,
    fecha_pedido: "2024-03-14T00:00:00", fecha_entrega: "2024-03-16",
    valor_total: 2475000, estado: "entregado", observaciones: null, motivo_anulacion: null,
  },
  {
    id_pedido: 2, id_cliente: 2, id_sede: 1, id_usuario: 4,
    fecha_pedido: "2024-03-15T00:00:00", fecha_entrega: "2024-03-17",
    valor_total: 3300000, estado: "pendiente", observaciones: null, motivo_anulacion: null,
  },
];

export const getPedidos = async () => {
  return [...mockPedidos];
};

export const mockDetallesPedido = [
  { id_detalle_pedido: 1, id_pedido: 1, id_producto: 1, cantidad: 150, precio_unitario: 8500, subtotal: 1275000 },
  { id_detalle_pedido: 2, id_pedido: 1, id_producto: 2, cantidad: 200, precio_unitario: 6000, subtotal: 1200000 },
];

export const createPedido = async (pedido) => ({ id_pedido: Date.now(), ...pedido });
export const updatePedido = async (id_pedido, pedido) => ({ id_pedido, ...pedido });
export const deletePedido = async (id_pedido) => true;

