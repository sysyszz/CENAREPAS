// fichasTecnicasService.js - Servicio para la gestión de fichas técnicas en Masarepas
import { api } from '../../../shared/services/api.js';

export let mockFichasTecnicas = [];
export const mockFichaTecnicaInsumos = [];

export const getFichasTecnicas = async () => {
  return api.get('/fichas-tecnicas');
};

export const getFichaTecnicaInsumos = async (id_ficha) => {
  if (id_ficha) {
    return api.get(`/fichas-tecnicas/${id_ficha}`);
  }
  return api.get('/fichas-tecnicas');
};

export const createFichaTecnica = async (ficha) => {
  return api.post('/fichas-tecnicas', ficha);
};

export const updateFichaTecnica = async (id_ficha, ficha) => {
  return api.put(`/fichas-tecnicas/${id_ficha}`, ficha);
};

export const deleteFichaTecnica = async (id_ficha) => {
  return api.delete(`/fichas-tecnicas/${id_ficha}`);
};
