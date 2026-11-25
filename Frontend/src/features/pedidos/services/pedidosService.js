// pedidosService.js - Servicio para la gestión de pedidos en Masarepas
import { api } from '../../../shared/services/api.js';

export const TRANSICIONES_PEDIDO = {
  Pendiente: ['En proceso', 'Anulado'],
  'En proceso': ['Entregado', 'Anulado'],
  Entregado: ['Anulado'],
  Anulado: [],
};

export const getEstadosDestino = (estado, { incluirAnulado = true } = {}) =>
  (TRANSICIONES_PEDIDO[estado] || []).filter((siguiente) => incluirAnulado || siguiente !== 'Anulado');

export let mockPedidos = [];
export const mockDetallesPedido = [];

export const getPedidos = async () => {
  return api.get('/pedidos');
};

export const getResumenPedidos = async () => {
  return api.get('/pedidos/resumen');
};

export const createPedido = async (pedido) => {
  return api.post('/pedidos', pedido);
};

export const updatePedido = async (id_pedido, pedido) => {
  return api.put(`/pedidos/${id_pedido}`, pedido);
};

export const updatePedidoEstado = async (id_pedido, estado) => {
  return api.patch(`/pedidos/${id_pedido}/estado`, { estado });
};

export const deletePedido = async (id_pedido) => {
  return api.delete(`/pedidos/${id_pedido}`);
};
