import { pool, query } from '../config/db.js';

export class RolesService {
  static async getAll() {
    try {
      const res = await query(`
        SELECT r.*, 
               COALESCE(json_agg(p.id_permiso ORDER BY p.id_permiso) FILTER (WHERE p.id_permiso IS NOT NULL), '[]') AS permisos
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
    const res = await query(`
      SELECT r.*, 
             COALESCE(json_agg(p.id_permiso ORDER BY p.id_permiso) FILTER (WHERE p.id_permiso IS NOT NULL), '[]') AS permisos
      FROM rol r
      LEFT JOIN rol_permiso rp ON r.id_rol = rp.id_rol
      LEFT JOIN permiso p ON rp.id_permiso = p.id_permiso
      WHERE r.id_rol = $1
      GROUP BY r.id_rol
    `, [id]);
    return res.rows[0] || null;
  }

  static async create(data) {
    const { nombre, descripcion, estado = 'Activo', permisos = [] } = data;
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const res = await client.query(
        `INSERT INTO rol (nombre, descripcion, estado)
         VALUES ($1, $2, $3)
         RETURNING *`,
        [nombre, descripcion, estado]
      );
      const newRol = res.rows[0];

      const cleanPermisos = Array.isArray(permisos)
        ? permisos.map(Number).filter((id) => !isNaN(id) && id > 0)
        : [];

      for (const id_permiso of cleanPermisos) {
        await client.query(
          `INSERT INTO rol_permiso (id_rol, id_permiso)
           VALUES ($1, $2)
           ON CONFLICT DO NOTHING`,
          [newRol.id_rol, id_permiso]
        );
      }

      await client.query('COMMIT');
      newRol.permisos = cleanPermisos;
      return newRol;
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('[RolesService.create] Error en transacción:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  static async update(id, data) {
    const { nombre, descripcion, estado, permisos } = data;
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const res = await client.query(
        `UPDATE rol 
         SET nombre = COALESCE($1, nombre),
             descripcion = COALESCE($2, descripcion),
             estado = COALESCE($3, estado)
         WHERE id_rol = $4
         RETURNING *`,
        [nombre, descripcion, estado, id]
      );
      const updatedRol = res.rows[0] || { id_rol: id, ...data };

      if (Array.isArray(permisos)) {
        const cleanPermisos = permisos.map(Number).filter((pId) => !isNaN(pId) && pId > 0);

        // Sincronización completa: eliminar permisos existentes e insertar la nueva selección
        await client.query('DELETE FROM rol_permiso WHERE id_rol = $1', [id]);

        for (const id_permiso of cleanPermisos) {
          await client.query(
            `INSERT INTO rol_permiso (id_rol, id_permiso)
             VALUES ($1, $2)
             ON CONFLICT DO NOTHING`,
            [id, id_permiso]
          );
        }
        updatedRol.permisos = cleanPermisos;
      }

      await client.query('COMMIT');
      return updatedRol;
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('[RolesService.update] Error en transacción:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  static async delete(id) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      await client.query('DELETE FROM rol_permiso WHERE id_rol = $1', [id]);
      await client.query('DELETE FROM rol WHERE id_rol = $1', [id]);
      await client.query('COMMIT');
      return true;
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('[RolesService.delete] Error:', error);
      throw error;
    } finally {
      client.release();
    }
  }
}
