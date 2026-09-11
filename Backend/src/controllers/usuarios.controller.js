import { UsuariosService } from '../services/usuarios.service.js';
import { successResponse, errorResponse } from '../utils/response.js';

export class UsuariosController {
  static async getAll(req, res, next) {
    try {
      const data = await UsuariosService.getAll();
      return successResponse(res, data, 'Usuarios recuperados correctamente');
    } catch (e) { next(e); }
  }

  static async getById(req, res, next) {
    try {
      const data = await UsuariosService.getById(req.params.id);
      if (!data) return errorResponse(res, 'Usuario no encontrado', 404);
      return successResponse(res, data);
    } catch (e) { next(e); }
  }

  static async create(req, res, next) {
    try {
      const data = await UsuariosService.create(req.body);
      return successResponse(res, data, 'Usuario creado exitosamente', 201);
    } catch (e) { next(e); }
  }

  static async update(req, res, next) {
    try {
      const data = await UsuariosService.update(req.params.id, req.body);
      return successResponse(res, data, 'Usuario actualizado exitosamente');
    } catch (e) { next(e); }
  }

  static async delete(req, res, next) {
    try {
      await UsuariosService.delete(req.params.id);
      return successResponse(res, null, 'Usuario eliminado exitosamente');
    } catch (e) { next(e); }
  }
}
