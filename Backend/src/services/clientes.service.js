import { query } from '../config/db.js';

export class ClientesService {
  static async getAll() {
    try {
      const res = await query('SELECT * FROM cliente ORDER BY id_cliente ASC');
      return res.rows || [];
    } catch (error) {
      console.warn('[ClientesService.getAll] Fallback:', error.message);
      return [];
    }
  }

  static async getById(id) {
    const res = await query('SELECT * FROM cliente WHERE id_cliente = $1', [id]);
    return res.rows[0] || null;
  }

  static async create(data) {
    const { nombre, documento, telefono, correo, direccion, estado = 'activo' } = data;
    const res = await query(
      `INSERT INTO cliente (nombre, documento, telefono, correo, direccion, estado)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [nombre, documento, telefono, correo, direccion, estado]
    );
    return res.rows[0];
  }

  static async update(id, data) {
    const { nombre, documento, telefono, correo, direccion, estado } = data;
    const res = await query(
      `UPDATE cliente 
       SET nombre = COALESCE($1, nombre),
           documento = COALESCE($2, documento),
           telefono = COALESCE($3, telefono),
           correo = COALESCE($4, correo),
           direccion = COALESCE($5, direccion),
           estado = COALESCE($6, estado)
       WHERE id_cliente = $7
       RETURNING *`,
      [nombre, documento, telefono, correo, direccion, estado, id]
    );
    return res.rows[0] || { id_cliente: id, ...data };
  }

  static async delete(id) {
    await query('DELETE FROM cliente WHERE id_cliente = $1', [id]);
    return true;
  }
}
