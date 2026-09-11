import { VentasService } from '../services/ventas.service.js';
import { successResponse, errorResponse } from '../utils/response.js';

export class VentasController {
  static async getAll(req, res, next) {
    try {
      const data = await VentasService.getAll();
      return successResponse(res, data, 'Ventas recuperadas correctamente');
    } catch (e) { next(e); }
  }

  static async getById(req, res, next) {
    try {
      const data = await VentasService.getById(req.params.id);
      if (!data) return errorResponse(res, 'Venta no encontrada', 404);
      return successResponse(res, data);
    } catch (e) { next(e); }
  }

  static async create(req, res, next) {
    try {
      const data = await VentasService.create(req.body);
      return successResponse(res, data, 'Venta creada exitosamente', 201);
    } catch (e) { next(e); }
  }

  static async update(req, res, next) {
    try {
      const data = await VentasService.update(req.params.id, req.body);
      return successResponse(res, data, 'Venta actualizada exitosamente');
    } catch (e) { next(e); }
  }

  static async delete(req, res, next) {
    try {
      await VentasService.delete(req.params.id);
      return successResponse(res, null, 'Venta eliminada exitosamente');
    } catch (e) { next(e); }
  }
}
