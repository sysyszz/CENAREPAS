import { pool } from '../config/db.js';

export class ProduccionService {
  static async getAll() {
    const res = await pool.query(`
      SELECT lp.*, f.nombre AS ficha_nombre, u.nombre AS responsable_nombre,
             COALESCE(
               json_agg(
                 json_build_object(
                   'id_lote_insumo', lpi.id_lote_insumo,
                   'id_insumo', lpi.id_insumo,
                   'insumo_nombre', i.nombre,
                   'unidad_medida', i.unidad_medida,
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
  }

  static async getById(id) {
    const res = await pool.query(`
      SELECT lp.*, f.nombre AS ficha_nombre, u.nombre AS responsable_nombre,
             COALESCE(
               json_agg(
                 json_build_object(
                   'id_lote_insumo', lpi.id_lote_insumo,
                   'id_insumo', lpi.id_insumo,
                   'insumo_nombre', i.nombre,
                   'unidad_medida', i.unidad_medida,
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
      WHERE lp.id_lote = $1
      GROUP BY lp.id_lote, f.nombre, u.nombre
    `, [id]);
    return res.rows[0] || null;
  }

  static async create(data) {
    const { id_ficha, id_usuario_responsable, fecha_produccion = new Date(), cantidad_producida, estado = 'en_proceso', observaciones } = data;
    const producedQuantity = Number(cantidad_producida);
    if (!Number.isSafeInteger(Number(id_ficha)) || Number(id_ficha) <= 0 ||
        !Number.isFinite(producedQuantity) || producedQuantity <= 0) {
      const error = new Error('La ficha técnica y la cantidad producida deben ser válidas');
      error.statusCode = 400;
      throw error;
    }

    const consumedInsumos = [];
    if (data.insumos !== undefined && !Array.isArray(data.insumos)) {
      const error = new Error('La lista de insumos consumidos no es válida');
      error.statusCode = 400;
      throw error;
    }

    for (const item of data.insumos || []) {
      if (!item || typeof item !== 'object') {
        const error = new Error('Cada insumo consumido debe ser un objeto válido');
        error.statusCode = 400;
        throw error;
      }
      const idInsumo = Number(item.id_insumo);
      const cantidad = Number(item.cantidad_consumida ?? item.cantidad);
      if (!Number.isSafeInteger(idInsumo) || idInsumo <= 0 || !Number.isFinite(cantidad) || cantidad <= 0) {
        const error = new Error('Cada insumo debe tener un identificador y una cantidad consumida válidos');
        error.statusCode = 400;
        throw error;
      }
      consumedInsumos.push({ idInsumo, cantidad });
    }
    consumedInsumos.sort((a, b) => a.idInsumo - b.idInsumo);

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const fichaResult = await client.query(
        'SELECT id_ficha FROM ficha_tecnica WHERE id_ficha = $1 FOR UPDATE',
        [id_ficha]
      );
      if (fichaResult.rowCount === 0) {
        const error = new Error('La ficha técnica seleccionada no existe');
        error.statusCode = 404;
        throw error;
      }

      const productoResult = await client.query(
        'SELECT id_producto FROM producto WHERE id_ficha = $1 ORDER BY id_producto FOR UPDATE',
        [id_ficha]
      );
      if (productoResult.rowCount !== 1) {
        const error = new Error(
          productoResult.rowCount === 0
            ? 'La ficha técnica debe estar asociada a un único producto para registrar producción'
            : 'La ficha técnica está asociada a varios productos; debe quedar asociada a uno solo para registrar producción'
        );
        error.statusCode = 409;
        throw error;
      }

      for (const { idInsumo, cantidad } of consumedInsumos) {
        const insumoResult = await client.query(
          'SELECT nombre, stock_actual FROM insumo WHERE id_insumo = $1 FOR UPDATE',
          [idInsumo]
        );
        if (insumoResult.rowCount === 0) {
          const error = new Error(`El insumo #${idInsumo} no existe`);
          error.statusCode = 404;
          throw error;
        }
        if (Number(insumoResult.rows[0].stock_actual) < cantidad) {
          const error = new Error(`Stock insuficiente para el insumo "${insumoResult.rows[0].nombre}"`);
          error.statusCode = 409;
          throw error;
        }
        await client.query(
          'UPDATE insumo SET stock_actual = stock_actual - $1 WHERE id_insumo = $2',
          [cantidad, idInsumo]
        );
      }

      const loteResult = await client.query(
        `INSERT INTO lote_produccion (id_ficha, id_usuario_responsable, fecha_produccion, cantidad_producida, estado, observaciones)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [id_ficha, id_usuario_responsable, fecha_produccion, producedQuantity, estado, observaciones]
      );
      const lote = loteResult.rows[0];

      for (const { idInsumo, cantidad } of consumedInsumos) {
        await client.query(
          `INSERT INTO lote_produccion_insumo (id_lote, id_insumo, cantidad_consumida)
           VALUES ($1, $2, $3)`,
          [lote.id_lote, idInsumo, cantidad]
        );
      }

      await client.query(
        'UPDATE producto SET stock_actual = stock_actual + $1 WHERE id_producto = $2',
        [producedQuantity, productoResult.rows[0].id_producto]
      );
      const insumosResult = await client.query(
        `SELECT lpi.id_lote_insumo, lpi.id_insumo, i.nombre AS insumo_nombre,
                i.unidad_medida, lpi.cantidad_consumida
         FROM lote_produccion_insumo lpi
         JOIN insumo i ON i.id_insumo = lpi.id_insumo
         WHERE lpi.id_lote = $1
         ORDER BY lpi.id_lote_insumo`,
        [lote.id_lote]
      );
      lote.insumos_consumidos = insumosResult.rows;
      await client.query('COMMIT');
      return lote;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  static async update(id, data) {
    const { id_ficha, id_usuario_responsable, fecha_produccion, cantidad_producida, estado, observaciones } = data;
    const res = await pool.query(
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
    return res.rows[0] || null;
  }

  static async delete(id) {
    const res = await pool.query('DELETE FROM lote_produccion WHERE id_lote = $1 RETURNING id_lote', [id]);
    return res.rowCount > 0;
  }
}
