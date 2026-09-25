import { VentasService } from '../services/ventas.service.js';
import { successResponse, errorResponse } from '../utils/response.js';

const SOLO_LECTURA =
  'Las ventas son de solo lectura: una venta se registra marcando un pedido como Entregado (y se anula anulando el pedido).';

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

  /** POST, PUT y DELETE: 405 con la explicación para la web. */
  static soloLectura(req, res) {
    res.set('Allow', 'GET');
    return errorResponse(res, SOLO_LECTURA, 405);
  }
}
