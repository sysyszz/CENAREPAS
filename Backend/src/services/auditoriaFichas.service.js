import { query } from '../config/db.js';

export class AuditoriaFichasService {
  /**
   * Registra de manera asíncrona y no bloqueante el acceso a una ficha técnica.
   */
  static async registrarAcceso({ id_usuario, id_ficha, ip_origen, user_agent, detalle = 'Consulta de ficha técnica' }) {
    try {
      await query(
        `INSERT INTO auditoria_acceso_fichas (id_usuario, id_ficha, ip_origen, user_agent, detalle)
         VALUES ($1, $2, $3, $4, $5)`,
        [id_usuario || null, id_ficha, ip_origen || null, user_agent || null, detalle]
      );
    } catch (err) {
      console.warn('[AuditoriaFichasService.registrarAcceso] Error al registrar acceso:', err.message);
    }
  }

  /**
   * Obtiene el historial de auditoría de accesos a una ficha técnica específica.
   */
  static async getAccesosPorFicha(id_ficha, limit = 50) {
    try {
      const res = await query(
        `SELECT a.*, u.nombre AS usuario_nombre, u.correo AS usuario_correo, r.nombre AS rol_nombre
         FROM auditoria_acceso_fichas a
         LEFT JOIN usuario u ON a.id_usuario = u.id_usuario
         LEFT JOIN rol r ON u.id_rol = r.id_rol
         WHERE a.id_ficha = $1
         ORDER BY a.fecha_acceso DESC
         LIMIT $2`,
        [id_ficha, limit]
      );
      return res.rows || [];
    } catch (err) {
      console.warn('[AuditoriaFichasService.getAccesosPorFicha] Fallback:', err.message);
      return [];
    }
  }
}