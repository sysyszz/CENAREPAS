import { RolesService } from '../services/roles.service.js';
import { successResponse, errorResponse } from '../utils/response.js';

export class RolesController {
  static async getAll(req, res, next) {
    try {
      const data = await RolesService.getAll();
      return successResponse(res, data, 'Roles recuperados correctamente');
    } catch (e) { next(e); }
  }

  static async getById(req, res, next) {
    try {
      const data = await RolesService.getById(req.params.id);
      if (!data) return errorResponse(res, 'Rol no encontrado', 404);
      return successResponse(res, data);
    } catch (e) { next(e); }
  }

  static async create(req, res, next) {
    try {
      const data = await RolesService.create(req.body);
      return successResponse(res, data, 'Rol creado exitosamente', 201);
    } catch (e) { next(e); }
  }

  static async update(req, res, next) {
    try {
      const data = await RolesService.update(req.params.id, req.body);
      return successResponse(res, data, 'Rol actualizado exitosamente');
    } catch (e) { next(e); }
  }

  static async delete(req, res, next) {
    try {
      await RolesService.delete(req.params.id);
      return successResponse(res, null, 'Rol eliminado exitosamente');
    } catch (e) { next(e); }
  }
}
