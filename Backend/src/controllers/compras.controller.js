import { ComprasService } from '../services/compras.service.js';
import { successResponse, errorResponse } from '../utils/response.js';

export class ComprasController {
  static async getAll(req, res, next) {
    try {
      const data = await ComprasService.getAll();
      return successResponse(res, data, 'Compras recuperadas correctamente');
    } catch (e) { next(e); }
  }

  static async getById(req, res, next) {
    try {
      const data = await ComprasService.getById(req.params.id);
      if (!data) return errorResponse(res, 'Compra no encontrada', 404);
      return successResponse(res, data);
    } catch (e) { next(e); }
  }

  static async create(req, res, next) {
    try {
      const data = await ComprasService.create(req.body);
      return successResponse(res, data, 'Compra creada exitosamente', 201);
    } catch (e) { next(e); }
  }

  static async update(req, res, next) {
    try {
      const data = await ComprasService.update(req.params.id, req.body);
      return successResponse(res, data, 'Compra actualizada exitosamente');
    } catch (e) { next(e); }
  }

  static async delete(req, res, next) {
    try {
      await ComprasService.delete(req.params.id);
      return successResponse(res, null, 'Compra eliminada exitosamente');
    } catch (e) { next(e); }
  }
}
