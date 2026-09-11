import { query } from '../config/db.js';

export class RolesService {
  static async getAll() {
    try {
      const res = await query(`
        SELECT r.*, 
               COALESCE(json_agg(p.modulo || ':' || p.accion) FILTER (WHERE p.id_permiso IS NOT NULL), '[]') AS permisos
        FROM rol r
        LEFT JOIN rol_permiso rp ON r.id_rol = rp.id_rol
        LEFT JOIN permiso p ON rp.id_permiso = p.id_permiso
        GROUP BY r.id_rol
        ORDER BY r.id_rol ASC
      `);
      if (res.rows && res.rows.length > 0) return res.rows;
      return [];
    } catch (error) {
      console.warn('[RolesService.getAll] Fallback:', error.message);
      return [];
    }
  }

  static async getById(id) {
    const res = await query('SELECT * FROM rol WHERE id_rol = $1', [id]);
    return res.rows[0] || null;
  }

  static async create(data) {
    const { nombre, descripcion, estado = 'activo' } = data;
    const res = await query(
      `INSERT INTO rol (nombre, descripcion, estado)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [nombre, descripcion, estado]
    );
    return res.rows[0];
  }

  static async update(id, data) {
    const { nombre, descripcion, estado } = data;
    const res = await query(
      `UPDATE rol 
       SET nombre = COALESCE($1, nombre),
           descripcion = COALESCE($2, descripcion),
           estado = COALESCE($3, estado)
       WHERE id_rol = $4
       RETURNING *`,
      [nombre, descripcion, estado, id]
    );
    return res.rows[0] || { id_rol: id, ...data };
  }

  static async delete(id) {
    await query('DELETE FROM rol WHERE id_rol = $1', [id]);
    return true;
  }
}
