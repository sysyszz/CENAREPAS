import { InsumosService } from '../services/insumos.service.js';
import { successResponse, errorResponse } from '../utils/response.js';

export class InsumosController {
  static async getAll(req, res, next) {
    try {
      const data = await InsumosService.getAll();
      return successResponse(res, data, 'Insumos recuperados correctamente');
    } catch (e) { next(e); }
  }

  static async getById(req, res, next) {
    try {
      const data = await InsumosService.getById(req.params.id);
      if (!data) return errorResponse(res, 'Insumo no encontrado', 404);
      return successResponse(res, data);
    } catch (e) { next(e); }
  }

  static async create(req, res, next) {
    try {
      const data = await InsumosService.create(req.body);
      return successResponse(res, data, 'Insumo creado exitosamente', 201);
    } catch (e) { next(e); }
  }

  static async update(req, res, next) {
    try {
      const data = await InsumosService.update(req.params.id, req.body);
      return successResponse(res, data, 'Insumo actualizado exitosamente');
    } catch (e) { next(e); }
  }

  static async delete(req, res, next) {
    try {
      await InsumosService.delete(req.params.id);
      return successResponse(res, null, 'Insumo eliminado exitosamente');
    } catch (e) { next(e); }
  }
}
