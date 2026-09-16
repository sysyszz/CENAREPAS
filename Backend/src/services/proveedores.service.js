import { query } from '../config/db.js';

export class ProveedoresService {
  static async getAll() {
    try {
      const res = await query('SELECT * FROM proveedor ORDER BY id_proveedor ASC');
      return res.rows || [];
    } catch (error) {
      console.warn('[ProveedoresService.getAll] Fallback:', error.message);
      return [];
    }
  }

  static async getById(id) {
    const res = await query('SELECT * FROM proveedor WHERE id_proveedor = $1', [id]);
    return res.rows[0] || null;
  }

  static async create(data) {
    const { nombre, nit, telefono, correo, direccion, estado = 'Activo' } = data;
    const res = await query(
      `INSERT INTO proveedor (nombre, nit, telefono, correo, direccion, estado)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [nombre, nit, telefono, correo, direccion, estado]
    );
    return res.rows[0];
  }

  static async update(id, data) {
    const { nombre, nit, telefono, correo, direccion, estado } = data;
    const res = await query(
      `UPDATE proveedor 
       SET nombre = COALESCE($1, nombre),
           nit = COALESCE($2, nit),
           telefono = COALESCE($3, telefono),
           correo = COALESCE($4, correo),
           direccion = COALESCE($5, direccion),
           estado = COALESCE($6, estado)
       WHERE id_proveedor = $7
       RETURNING *`,
      [nombre, nit, telefono, correo, direccion, estado, id]
    );
    return res.rows[0] || { id_proveedor: id, ...data };
  }

  static async delete(id) {
    await query('DELETE FROM proveedor WHERE id_proveedor = $1', [id]);
    return true;
  }
}
