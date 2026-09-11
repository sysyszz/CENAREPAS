// produccionService.js - Servicio para la gestión de órdenes y lotes de producción en Masarepas
import { api } from '../../../shared/services/api.js';

export let mockLotesProduccion = [];
export const mockLotesProduccionInsumos = [];

export const getLotes = async () => {
  return api.get('/produccion');
};

export const createLote = async (lote) => {
  return api.post('/produccion', lote);
};

export const updateLote = async (id_lote, lote) => {
  return api.put(`/produccion/${id_lote}`, lote);
};

export const anularLote = async (id_lote) => {
  return api.delete(`/produccion/${id_lote}`);
};
