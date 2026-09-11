import { query } from '../config/db.js';

export class UsuariosService {
  static async getAll() {
    try {
      const res = await query(`
        SELECT u.id_usuario, u.nombre, u.correo, u.contrasena_hash, u.id_rol, u.estado, 
               u.token_recuperacion, u.token_expiracion, u.fecha_creacion,
               r.nombre AS rol_nombre
        FROM usuario u
        LEFT JOIN rol r ON u.id_rol = r.id_rol
        ORDER BY u.id_usuario ASC
      `);
      if (res.rows && res.rows.length > 0) return res.rows;
      return [];
    } catch (error) {
      console.warn('[UsuariosService.getAll] Fallback:', error.message);
      return [];
    }
  }

  static async getById(id) {
    const res = await query('SELECT * FROM usuario WHERE id_usuario = $1', [id]);
    return res.rows[0] || null;
  }

  static async create(data) {
    const { nombre, correo, contrasena_hash, id_rol, estado = 'activo' } = data;
    const res = await query(
      `INSERT INTO usuario (nombre, correo, contrasena_hash, id_rol, estado)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [nombre, correo, contrasena_hash || '$2b$10$defaultHash', id_rol, estado]
    );
    return res.rows[0];
  }

  static async update(id, data) {
    const { nombre, correo, id_rol, estado } = data;
    const res = await query(
      `UPDATE usuario 
       SET nombre = COALESCE($1, nombre),
           correo = COALESCE($2, correo),
           id_rol = COALESCE($3, id_rol),
           estado = COALESCE($4, estado)
       WHERE id_usuario = $5
       RETURNING *`,
      [nombre, correo, id_rol, estado, id]
    );
    return res.rows[0] || { id_usuario: id, ...data };
  }

  static async delete(id) {
    await query('DELETE FROM usuario WHERE id_usuario = $1', [id]);
    return true;
  }
}
