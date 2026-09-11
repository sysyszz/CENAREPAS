// pedidosService.js - Servicio para la gestión de pedidos en Masarepas
import { api } from '../../../shared/services/api.js';

export let mockPedidos = [];
export const mockDetallesPedido = [];

export const getPedidos = async () => {
  return api.get('/pedidos');
};

export const createPedido = async (pedido) => {
  return api.post('/pedidos', pedido);
};

export const updatePedido = async (id_pedido, pedido) => {
  return api.put(`/pedidos/${id_pedido}`, pedido);
};

export const deletePedido = async (id_pedido) => {
  return api.delete(`/pedidos/${id_pedido}`);
};
