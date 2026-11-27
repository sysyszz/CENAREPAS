import { DashboardService } from '../services/dashboard.service.js';
import { successResponse } from '../utils/response.js';

function opcionesDesdeQuery(req) {
  return {
    periodo: req.query?.periodo,
    nocache: req.query?.nocache === '1' || req.query?.nocache === 'true',
  };
}

export class DashboardController {
  static async getSummary(req, res, next) {
    try {
      const data = await DashboardService.getSummary(opcionesDesdeQuery(req));
      return successResponse(res, data, 'Resumen del dashboard generado correctamente');
    } catch (e) {
      next(e);
    }
  }

  static async getMetrics(req, res, next) {
    try {
      const data = await DashboardService.getSummary(opcionesDesdeQuery(req));
      const metrics = {
        periodo: data.periodo,
        generadoEn: data.generadoEn,
        fechaGeneracion: data.fechaGeneracion,
        kpis: data.kpis,
        comparativaDiaria: data.comparativaDiaria,
        comparativaMensual: data.comparativaMensual,
        comparativaComprasAnual: data.comparativaComprasAnual,
        rentabilidad: data.rentabilidad,
        alertasStockBajo: data.alertasStockBajo,
        alertasProximosVencer: data.alertasProximosVencer,
      };
      return successResponse(res, metrics, 'Métricas recuperadas');
    } catch (e) {
      next(e);
    }
  }

  static async getCharts(req, res, next) {
    try {
      const data = await DashboardService.getSummary(opcionesDesdeQuery(req));
      const charts = {
        periodo: data.periodo,
        generadoEn: data.generadoEn,
        fechaGeneracion: data.fechaGeneracion,
        ventasPorPeriodo: data.ventasPorPeriodo,
        comprasPorPeriodo: data.comprasPorPeriodo,
        ventasSemanales: data.ventasSemanales,
        productosMasVendidos: data.productosMasVendidos,
        ventasPorCategoria: data.ventasPorCategoria,
        gastoAcumuladoMensual: data.gastoAcumuladoMensual,
        topProveedores: data.topProveedores,
        comparativaComprasAnual: data.comparativaComprasAnual,
        stockInsumosPorCategoria: data.stockInsumosPorCategoria,
        produccionLineas: data.produccionLineas,
        funnelPedidos: data.funnelPedidos,
        rentabilidad: data.rentabilidad,
      };
      return successResponse(res, charts, 'Gráficos recuperados');
    } catch (e) {
      next(e);
    }
  }
}
