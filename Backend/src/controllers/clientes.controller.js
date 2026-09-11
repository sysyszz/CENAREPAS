import { ClientesService } from '../services/clientes.service.js';
import { successResponse, errorResponse } from '../utils/response.js';

export class ClientesController {
  static async getAll(req, res, next) {
    try {
      const data = await ClientesService.getAll();
      return successResponse(res, data, 'Clientes recuperados correctamente');
    } catch (e) { next(e); }
  }

  static async getById(req, res, next) {
    try {
      const data = await ClientesService.getById(req.params.id);
      if (!data) return errorResponse(res, 'Cliente no encontrado', 404);
      return successResponse(res, data);
    } catch (e) { next(e); }
  }

  static async create(req, res, next) {
    try {
      const data = await ClientesService.create(req.body);
      return successResponse(res, data, 'Cliente creado exitosamente', 201);
    } catch (e) { next(e); }
  }

  static async update(req, res, next) {
    try {
      const data = await ClientesService.update(req.params.id, req.body);
      return successResponse(res, data, 'Cliente actualizado exitosamente');
    } catch (e) { next(e); }
  }

  static async delete(req, res, next) {
    try {
      await ClientesService.delete(req.params.id);
      return successResponse(res, null, 'Cliente eliminado exitosamente');
    } catch (e) { next(e); }
  }
}
