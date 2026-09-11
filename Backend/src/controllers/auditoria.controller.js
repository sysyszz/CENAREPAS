import { AuditoriaService } from '../services/auditoria.service.js';
import { successResponse } from '../utils/response.js';

export class AuditoriaController {
  static async getAll(req, res, next) {
    try {
      const data = await AuditoriaService.getAll();
      return successResponse(res, data, 'Registros de auditoría recuperados correctamente');
    } catch (e) { next(e); }
  }
}
