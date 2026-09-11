import { PedidosService } from '../services/pedidos.service.js';
import { successResponse, errorResponse } from '../utils/response.js';

export class PedidosController {
  static async getAll(req, res, next) {
    try {
      const data = await PedidosService.getAll();
      return successResponse(res, data, 'Pedidos recuperados correctamente');
    } catch (e) { next(e); }
  }

  static async getById(req, res, next) {
    try {
      const data = await PedidosService.getById(req.params.id);
      if (!data) return errorResponse(res, 'Pedido no encontrado', 404);
      return successResponse(res, data);
    } catch (e) { next(e); }
  }

  static async create(req, res, next) {
    try {
      const data = await PedidosService.create(req.body);
      return successResponse(res, data, 'Pedido creado exitosamente', 201);
    } catch (e) { next(e); }
  }

  static async update(req, res, next) {
    try {
      const data = await PedidosService.update(req.params.id, req.body);
      return successResponse(res, data, 'Pedido actualizado exitosamente');
    } catch (e) { next(e); }
  }

  static async delete(req, res, next) {
    try {
      await PedidosService.delete(req.params.id);
      return successResponse(res, null, 'Pedido eliminado exitosamente');
    } catch (e) { next(e); }
  }
}
