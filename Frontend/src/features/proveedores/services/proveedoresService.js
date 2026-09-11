// proveedoresService.js - Servicio para la gestión de proveedores en Masarepas
import { api } from '../../../shared/services/api.js';

export let mockProveedores = [];

export const getProveedores = async () => {
  return api.get('/proveedores');
};

export const createProveedor = async (proveedor) => {
  return api.post('/proveedores', proveedor);
};

export const updateProveedor = async (id_proveedor, proveedor) => {
  return api.put(`/proveedores/${id_proveedor}`, proveedor);
};

export const deleteProveedor = async (id_proveedor) => {
  return api.delete(`/proveedores/${id_proveedor}`);
};
