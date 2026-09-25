import bcrypt from 'bcryptjs';
import { pool, query } from '../config/db.js';
import { generateToken } from '../utils/jwt.js';
import { HttpError, badRequest, conflict } from '../utils/httpError.js';
import { CONTRASENA_MIN, MUNICIPIOS_ENTREGA, TIPOS_DOCUMENTO } from '../config/negocio.js';

const SALT_ROUNDS = 10;
const CORREO_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const texto = (valor) => (typeof valor === 'string' ? valor.trim() : '');

/** Arma la respuesta de sesión: token + datos públicos del usuario. */
const crearSesion = (user) => {
  const payload = {
    id_usuario: user.id_usuario,
    nombre: user.nombre,
    correo: user.correo,
    id_rol: user.id_rol,
    rol: user.rol_nombre,
  };
  return {
    token: generateToken(payload),
    usuario: {
      ...payload,
      estado: user.estado,
      id_cliente: user.id_cliente || null,
    },
  };
};

export class AuthService {
  /** Login con correo y contraseña (CA-001-001). Solo bcrypt; sin claves demo. */
  static async login(correo, contrasena) {
    const res = await query(
      `SELECT u.*, r.nombre AS rol_nombre, r.estado AS rol_estado, c.id_cliente
       FROM usuario u
       JOIN rol r ON u.id_rol = r.id_rol
       LEFT JOIN cliente c ON c.id_usuario = u.id_usuario
       WHERE LOWER(u.correo) = LOWER($1)`,
      [texto(correo)]
    );
    const user = res.rows[0];

    // Mismo mensaje si el correo no existe o la contraseña no coincide.
    const valida = user ? await bcrypt.compare(String(contrasena), user.contrasena_hash).catch(() => false) : false;
    if (!valida) {
      throw new HttpError(401, 'Correo o contraseña incorrectos');
    }
    if (String(user.estado).toLowerCase() !== 'activo' || String(user.rol_estado).toLowerCase() !== 'activo') {
      throw new HttpError(403, 'Tu cuenta está inactiva. Comunícate con CENAREPAS.');
    }
    return crearSesion(user);
  }

  /**
   * Registro público de clientes (HU-150). Siempre asigna el rol Cliente,
   * ignora cualquier id_rol recibido y crea usuario + cliente en una transacción.
   */
  static async registrarCliente(datos) {
    const nombre = texto(datos.nombre);
    const tipoDocumento = texto(datos.tipo_documento).toUpperCase();
    const documento = texto(datos.documento);
    const telefono = texto(datos.telefono);
    const correo = texto(datos.correo).toLowerCase();
    const municipio = texto(datos.municipio);
    const barrio = texto(datos.barrio);
    const direccion = texto(datos.direccion);
    const contrasena = typeof datos.contrasena === 'string' ? datos.contrasena : '';

    const errores = {};
    if (nombre.length < 3) errores.nombre = 'Ingresa tu nombre completo';
    if (!TIPOS_DOCUMENTO.includes(tipoDocumento)) errores.tipo_documento = 'Selecciona un tipo de documento válido';
    if (!/^[0-9A-Za-z.-]{5,20}$/.test(documento)) errores.documento = 'Ingresa un número de documento válido';
    if (!/^[0-9+ ]{7,15}$/.test(telefono)) errores.telefono = 'Ingresa un teléfono válido';
    if (!CORREO_REGEX.test(correo)) errores.correo = 'Ingresa un correo válido';
    if (!MUNICIPIOS_ENTREGA.includes(municipio)) errores.municipio = 'Selecciona un municipio del Área Metropolitana';
    if (!barrio) errores.barrio = 'Ingresa tu barrio';
    if (direccion.length < 5) errores.direccion = 'Ingresa tu dirección';
    if (contrasena.length < CONTRASENA_MIN) errores.contrasena = `La contraseña debe tener al menos ${CONTRASENA_MIN} caracteres`;
    if (Object.keys(errores).length > 0) {
      throw badRequest('Revisa los datos del registro', errores);
    }

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const duplicadoCorreo = await client.query(
        `SELECT 1 FROM usuario WHERE LOWER(correo) = $1
         UNION ALL SELECT 1 FROM cliente WHERE LOWER(correo) = $1`,
        [correo]
      );
      if (duplicadoCorreo.rows.length > 0) {
        throw conflict('Ya existe una cuenta registrada con ese correo');
      }
      const duplicadoDocumento = await client.query('SELECT 1 FROM cliente WHERE documento = $1', [documento]);
      if (duplicadoDocumento.rows.length > 0) {
        throw conflict('Ya existe un cliente registrado con ese número de documento');
      }

      const rol = await client.query(`SELECT id_rol, nombre FROM rol WHERE nombre = 'Cliente' AND estado = 'Activo'`);
      if (rol.rows.length === 0) {
        throw new HttpError(500, 'El rol Cliente no está configurado');
      }

      const hash = await bcrypt.hash(contrasena, SALT_ROUNDS);
      const usuario = await client.query(
        `INSERT INTO usuario (nombre, correo, contrasena_hash, id_rol, estado)
         VALUES ($1, $2, $3, $4, 'Activo')
         RETURNING id_usuario, nombre, correo, id_rol, estado`,
        [nombre, correo, hash, rol.rows[0].id_rol]
      );
      const nuevoUsuario = usuario.rows[0];

      const cliente = await client.query(
        `INSERT INTO cliente (nombre, tipo_documento, documento, telefono, correo, direccion, municipio, barrio, estado, id_usuario)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'Activo', $9)
         RETURNING id_cliente`,
        [nombre, tipoDocumento, documento, telefono, correo, direccion, municipio, barrio, nuevoUsuario.id_usuario]
      );

      await client.query('COMMIT');
      return crearSesion({
        ...nuevoUsuario,
        rol_nombre: rol.rows[0].nombre,
        id_cliente: cliente.rows[0].id_cliente,
      });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
}
