import { DashboardService } from '../services/dashboard.service.js';
import { successResponse } from '../utils/response.js';

export class DashboardController {
  static async getSummary(req, res, next) {
    try {
      const data = await DashboardService.getSummary();
      return successResponse(res, data, 'Resumen del dashboard generado correctamente');
    } catch (e) { next(e); }
  }

  static async getMetrics(req, res, next) {
    try {
      const data = await DashboardService.getSummary();
      return successResponse(res, data?.metrics || data, 'Métricas recuperadas');
    } catch (e) { next(e); }
  }

  static async getCharts(req, res, next) {
    try {
      const data = await DashboardService.getSummary();
      return successResponse(res, data?.charts || data, 'Gráficos recuperados');
    } catch (e) { next(e); }
  }
}
