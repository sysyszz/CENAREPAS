// ventasService.js - Servicio para la gestión de ventas en Masarepas
import { api } from '../../../shared/services/api.js';

export let mockVentas = [];
export const mockDetallesVenta = [];

export const getVentas = async () => {
  return api.get('/ventas');
};

export const createVenta = async (venta) => {
  return api.post('/ventas', venta);
};

export const updateVenta = async (id_venta, venta) => {
  return api.put(`/ventas/${id_venta}`, venta);
};

export const deleteVenta = async (id_venta) => {
  return api.delete(`/ventas/${id_venta}`);
};