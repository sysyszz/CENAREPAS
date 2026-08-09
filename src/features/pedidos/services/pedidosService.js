// pedidosService.js - Servicio para la gestión de pedidos
export const getPedidos = async () => {
  return [];
};

export const createPedido = async (pedido) => ({ id: Date.now(), ...pedido });
export const updatePedido = async (id, pedido) => ({ id, ...pedido });
export const deletePedido = async (id) => true;
