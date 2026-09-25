import { CreditosService } from '../services/creditos.service.js';
import { successResponse, errorResponse } from '../utils/response.js';

/** Abonos y créditos para el personal (HU-117, HU-171). */
export class AbonosController {
  /** GET /abonos?estado=En revisión&id_pedido=&id_credito= */
  static async getAll(req, res, next) {
    try {
      const data = await CreditosService.listarAbonos({
        estado: req.query.estado,
        idPedido: req.query.id_pedido ? Number(req.query.id_pedido) : null,
        idCredito: req.query.id_credito ? Number(req.query.id_credito) : null,
      });
      return successResponse(res, data, 'Abonos recuperados correctamente');
    } catch (e) { next(e); }
  }

  static async getById(req, res, next) {
    try {
      const data = await CreditosService.obtenerAbono(req.params.id);
      if (!data) return errorResponse(res, 'Abono no encontrado', 404);
      return successResponse(res, data);
    } catch (e) { next(e); }
  }

  /** POST /abonos { id_pedido, valor_abonado, medio_pago, comprobante_url? } → Aprobado */
  static async create(req, res, next) {
    try {
      const data = await CreditosService.registrarPorPersonal(req.user, req.body || {});
      return successResponse(res, data, 'Abono registrado exitosamente', 201);
    } catch (e) { next(e); }
  }

  static async aprobar(req, res, next) {
    try {
      const data = await CreditosService.aprobar(req.user, req.params.id);
      return successResponse(res, data, 'Abono aprobado: se actualizó el saldo y se notificó al cliente');
    } catch (e) { next(e); }
  }

  static async rechazar(req, res, next) {
    try {
      const data = await CreditosService.rechazar(req.user, req.params.id, req.body?.motivo);
      return successResponse(res, data, 'Abono rechazado y cliente notificado');
    } catch (e) { next(e); }
  }

  static async anular(req, res, next) {
    try {
      const data = await CreditosService.anular(req.user, req.params.id, req.body?.motivo);
      return successResponse(res, data, 'Abono anulado');
    } catch (e) { next(e); }
  }

  /** GET /abonos/creditos?estado=&id_cliente= */
  static async creditos(req, res, next) {
    try {
      const data = await CreditosService.listarCreditos({
        estado: req.query.estado,
        idCliente: req.query.id_cliente ? Number(req.query.id_cliente) : null,
      });
      return successResponse(res, data, 'Créditos recuperados correctamente');
    } catch (e) { next(e); }
  }
}
