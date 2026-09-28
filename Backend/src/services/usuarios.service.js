import bcrypt from 'bcryptjs';
import { query } from '../config/db.js';
import { CONTRASENA_MIN } from '../config/negocio.js';
import { badRequest } from '../utils/httpError.js';

const SALT_ROUNDS = 10;
// f: el mínimo del personal pasa de 6 a CONTRASENA_MIN (8). Solo aplica a
// contraseñas nuevas o cambiadas; el login no valida la longitud.
// El formulario web de usuarios (UsuarioFormModal.jsx) usa el mismo mínimo.
const COLUMNAS_PUBLICAS = 'id_usuario, nombre, correo, id_rol, estado, fecha_creacion';

export class UsuariosService {
  /** resumido: solo id, nombre y rol (para quien no administra usuarios). */
  static async getAll({ resumido = false } = {}) {
    const res = await query(`
      SELECT u.id_usuario, u.nombre, u.correo, u.id_rol, u.estado,
             u.fecha_creacion,
             r.nombre AS rol_nombre
      FROM usuario u
      LEFT JOIN rol r ON u.id_rol = r.id_rol
      ORDER BY u.id_usuario ASC
    `);
    if (!resumido) return res.rows;
    return res.rows.map(({ id_usuario, nombre, id_rol, rol_nombre, estado }) => ({
      id_usuario, nombre, id_rol, rol_nombre, estado,
    }));
  }

  static async getById(id) {
    const res = await query(`
      SELECT u.id_usuario, u.nombre, u.correo, u.id_rol, u.estado, u.fecha_creacion,
             r.nombre AS rol_nombre
      FROM usuario u
      LEFT JOIN rol r ON u.id_rol = r.id_rol
      WHERE u.id_usuario = $1
    `, [id]);
    return res.rows[0] || null;
  }

  static async create(data) {
    const { nombre, correo, id_rol, estado = 'Activo' } = data;
    const rawPassword = String(data.contrasena || data.password || data.contrasena_hash || '').trim();
    if (rawPassword.length < CONTRASENA_MIN) {
      throw badRequest(`La contraseña debe tener al menos ${CONTRASENA_MIN} caracteres`);
    }
    const contrasena_hash = await bcrypt.hash(rawPassword, SALT_ROUNDS);

    const res = await query(
      `INSERT INTO usuario (nombre, correo, contrasena_hash, id_rol, estado)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING ${COLUMNAS_PUBLICAS}`,
      [nombre, correo, contrasena_hash, id_rol, estado]
    );
    return res.rows[0];
  }

  static async update(id, data) {
    const { nombre, correo, id_rol, estado } = data;
    const rawPassword = data.contrasena || data.password || data.contrasena_hash;
    const hasNewPassword = typeof rawPassword === 'string' && rawPassword.trim().length > 0;
    if (hasNewPassword && rawPassword.trim().length < CONTRASENA_MIN) {
      throw badRequest(`La contraseña debe tener al menos ${CONTRASENA_MIN} caracteres`);
    }
    const contrasena_hash = hasNewPassword ? await bcrypt.hash(rawPassword.trim(), SALT_ROUNDS) : null;

    const res = await query(
      `UPDATE usuario 
       SET nombre = COALESCE($1, nombre),
           correo = COALESCE($2, correo),
           id_rol = COALESCE($3, id_rol),
           estado = COALESCE($4, estado),
           contrasena_hash = COALESCE($5, contrasena_hash)
       WHERE id_usuario = $6
       RETURNING ${COLUMNAS_PUBLICAS}`,
      [nombre, correo, id_rol, estado, contrasena_hash, id]
    );
    return res.rows[0] || null;
  }

  /** Inactiva el registro (sin borrado físico: conserva el historial). */
  static async delete(id) {
    const res = await query(
      `UPDATE usuario SET estado = 'Inactivo' WHERE id_usuario = $1 RETURNING id_usuario`,
      [id]
    );
    return res.rows.length > 0;
  }
}
