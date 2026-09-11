import { CategoriasService } from '../services/categorias.service.js';
import { successResponse, errorResponse } from '../utils/response.js';

export class CategoriasController {
  static async getAll(req, res, next) {
    try {
      const data = await CategoriasService.getAll();
      return successResponse(res, data, 'Categorías recuperadas correctamente');
    } catch (e) { next(e); }
  }

  static async getById(req, res, next) {
    try {
      const data = await CategoriasService.getById(req.params.id);
      if (!data) return errorResponse(res, 'Categoría no encontrada', 404);
      return successResponse(res, data);
    } catch (e) { next(e); }
  }

  static async create(req, res, next) {
    try {
      const data = await CategoriasService.create(req.body);
      return successResponse(res, data, 'Categoría creada exitosamente', 201);
    } catch (e) { next(e); }
  }

  static async update(req, res, next) {
    try {
      const data = await CategoriasService.update(req.params.id, req.body);
      return successResponse(res, data, 'Categoría actualizada exitosamente');
    } catch (e) { next(e); }
  }

  static async delete(req, res, next) {
    try {
      await CategoriasService.delete(req.params.id);
      return successResponse(res, null, 'Categoría eliminada exitosamente');
    } catch (e) { next(e); }
  }
}
