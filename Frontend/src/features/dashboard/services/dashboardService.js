// dashboardService.js - Servicio de datos para el Panel de Datos de CENAREPAS
import { api } from '../../../shared/services/api.js';

export const getDashboardData = async () => {
  return api.get('/dashboard');
};
