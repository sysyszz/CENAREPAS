// comprasService.js - Servicio para la gestión de compras en Masarepas
import { api } from '../../../shared/services/api.js';

export let mockCompras = [];
export const mockDetallesCompra = [];

export const getCompras = async () => {
  return api.get('/compras');
};

export const createCompra = async (compra) => {
  return api.post('/compras', compra);
};

export const updateCompra = async (id_compra, compra) => {
  return api.put(`/compras/${id_compra}`, compra);
};

export const anularCompra = async (id_compra) => {
  return api.delete(`/compras/${id_compra}`);
};
