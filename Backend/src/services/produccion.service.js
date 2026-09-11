import { query } from '../config/db.js';

export class ProduccionService {
  static async getAll() {
    try {
      const res = await query(`
        SELECT lp.*, f.nombre AS ficha_nombre, u.nombre AS responsable_nombre,
               COALESCE(
                 json_agg(
                   json_build_object(
                     'id_lote_insumo', lpi.id_lote_insumo,
                     'id_insumo', lpi.id_insumo,
                     'insumo_nombre', i.nombre,
                     'cantidad_consumida', lpi.cantidad_consumida
                   )
                 ) FILTER (WHERE lpi.id_lote_insumo IS NOT NULL),
                 '[]'
               ) AS insumos_consumidos
        FROM lote_produccion lp
        LEFT JOIN ficha_tecnica f ON lp.id_ficha = f.id_ficha
        LEFT JOIN usuario u ON lp.id_usuario_responsable = u.id_usuario
        LEFT JOIN lote_produccion_insumo lpi ON lp.id_lote = lpi.id_lote
        LEFT JOIN insumo i ON lpi.id_insumo = i.id_insumo
        GROUP BY lp.id_lote, f.nombre, u.nombre
        ORDER BY lp.id_lote ASC
      `);
      return res.rows || [];
    } catch (error) {
      console.warn('[ProduccionService.getAll] Fallback:', error.message);
      return [];
    }
  }

  static async getById(id) {
    const res = await query('SELECT * FROM lote_produccion WHERE id_lote = $1', [id]);
    return res.rows[0] || null;
  }

  static async create(data) {
    const { id_ficha, id_usuario_responsable, fecha_produccion = new Date(), cantidad_producida, estado = 'en_proceso', observaciones } = data;
    const res = await query(
      `INSERT INTO lote_produccion (id_ficha, id_usuario_responsable, fecha_produccion, cantidad_producida, estado, observaciones)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [id_ficha, id_usuario_responsable, fecha_produccion, cantidad_producida, estado, observaciones]
    );
    return res.rows[0];
  }

  static async update(id, data) {
    const { id_ficha, id_usuario_responsable, fecha_produccion, cantidad_producida, estado, observaciones } = data;
    const res = await query(
      `UPDATE lote_produccion 
       SET id_ficha = COALESCE($1, id_ficha),
           id_usuario_responsable = COALESCE($2, id_usuario_responsable),
           fecha_produccion = COALESCE($3, fecha_produccion),
           cantidad_producida = COALESCE($4, cantidad_producida),
           estado = COALESCE($5, estado),
           observaciones = COALESCE($6, observaciones)
       WHERE id_lote = $7
       RETURNING *`,
      [id_ficha, id_usuario_responsable, fecha_produccion, cantidad_producida, estado, observaciones, id]
    );
    return res.rows[0] || { id_lote: id, ...data };
  }

  static async delete(id) {
    await query('DELETE FROM lote_produccion WHERE id_lote = $1', [id]);
    return true;
  }
}
