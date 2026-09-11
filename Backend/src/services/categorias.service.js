import { query } from '../config/db.js';

export class CategoriasService {
  static async getAll() {
    try {
      const res = await query('SELECT * FROM categoria_producto ORDER BY id_categoria ASC');
      return res.rows || [];
    } catch (error) {
      console.warn('[CategoriasService.getAll] Fallback:', error.message);
      return [];
    }
  }

  static async getById(id) {
    const res = await query('SELECT * FROM categoria_producto WHERE id_categoria = $1', [id]);
    return res.rows[0] || null;
  }

  static async create(data) {
    const { nombre, descripcion, estado = 'activo' } = data;
    const res = await query(
      `INSERT INTO categoria_producto (nombre, descripcion, estado)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [nombre, descripcion, estado]
    );
    return res.rows[0];
  }

  static async update(id, data) {
    const { nombre, descripcion, estado } = data;
    const res = await query(
      `UPDATE categoria_producto 
       SET nombre = COALESCE($1, nombre),
           descripcion = COALESCE($2, descripcion),
           estado = COALESCE($3, estado)
       WHERE id_categoria = $4
       RETURNING *`,
      [nombre, descripcion, estado, id]
    );
    return res.rows[0] || { id_categoria: id, ...data };
  }

  static async delete(id) {
    await query('DELETE FROM categoria_producto WHERE id_categoria = $1', [id]);
    return true;
  }
}
