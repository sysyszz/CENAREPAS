import fs from 'fs';
import { query } from '../config/db.js';
import { enTransaccion } from '../utils/transaccion.js';
import { badRequest, conflict, notFound } from '../utils/httpError.js';
import { borrarArchivo, cloudinaryConfigurado, rutaLocal, urlTemporal } from '../utils/almacenamiento.js';
import { ESTADOS_COMPRA } from '../config/negocio.js';
import { invalidarCacheDashboard } from '../utils/dashboardCache.js';

const SELECT_COMPRA = `
  SELECT c.*, p.nombre AS proveedor_nombre, u.nombre AS usuario_nombre,
         COALESCE(
           json_agg(
             json_build_object(
               'id_detalle_compra', dc.id_detalle_compra,
               'id_insumo', dc.id_insumo,
               'insumo_nombre', i.nombre,
               'unidad_medida', i.unidad_medida,
               'cantidad', dc.cantidad,
               'valor_unitario', dc.valor_unitario,
               'subtotal', dc.subtotal
             ) ORDER BY dc.id_detalle_compra
           ) FILTER (WHERE dc.id_detalle_compra IS NOT NULL),
           '[]'
         ) AS detalles
  FROM compra c
  LEFT JOIN proveedor p ON c.id_proveedor = p.id_proveedor
  LEFT JOIN usuario u ON c.id_usuario = u.id_usuario
  LEFT JOIN detalle_compra dc ON c.id_compra = dc.id_compra
  LEFT JOIN insumo i ON dc.id_insumo = i.id_insumo`;

const GROUP_COMPRA = 'GROUP BY c.id_compra, p.nombre, u.nombre';

/** Valida que el estado (si se envía) sea únicamente Registrada o Anulada. */
function validarEstadoCompra(estado) {
  if (estado === undefined || estado === null || estado === '') return undefined;
  const limpio = String(estado).trim();
  if (!ESTADOS_COMPRA.includes(limpio)) {
    throw badRequest('El estado de la compra solo puede ser Registrada o Anulada');
  }
  return limpio;
}

/** Valida y normaliza el arreglo de detalles de una compra. */
function normalizarDetalles(detalles) {
  if (!Array.isArray(detalles)) {
    throw badRequest('Los detalles de la compra deben enviarse como una lista');
  }
  return detalles.map((d) => {
    const id_insumo = Number(d.id_insumo);
    const cantidad = Number(d.cantidad);
    const valor_unitario = Number(d.valor_unitario);
    if (!Number.isInteger(id_insumo) || id_insumo <= 0) {
      throw badRequest('Cada insumo de la compra debe tener un identificador válido');
    }
    if (!Number.isFinite(cantidad) || cantidad <= 0) {
      throw badRequest('La cantidad de cada insumo debe ser mayor a 0');
    }
    if (!Number.isFinite(valor_unitario) || valor_unitario < 0) {
      throw badRequest('El valor unitario de cada insumo no puede ser negativo');
    }
    const subtotal = d.subtotal !== undefined && d.subtotal !== null && Number.isFinite(Number(d.subtotal))
      ? Number(d.subtotal)
      : cantidad * valor_unitario;
    return { id_insumo, cantidad, valor_unitario, subtotal };
  });
}

/** Agrupa cantidades totales por id_insumo para ajustar stock sin duplicaciones. */
function sumarCantidadesPorInsumo(detalles) {
  const mapa = new Map();
  for (const d of detalles) {
    const id = Number(d.id_insumo);
    const cant = Number(d.cantidad) || 0;
    mapa.set(id, (mapa.get(id) || 0) + cant);
  }
  return mapa;
}

/**
 * Aplica deltas de stock sobre la tabla insumo dentro de la transacción activa.
 * delta > 0 suma al inventario; delta < 0 descuenta validando que no quede negativo.
 */
async function aplicarDeltasInsumo(db, deltas, motivoFaltaStock) {
  const ids = [...deltas.keys()].sort((a, b) => a - b);
  for (const idInsumo of ids) {
    const delta = deltas.get(idInsumo);
    if (!delta) continue;
    const insumoRes = await db.query(
      'SELECT id_insumo, nombre, stock_actual FROM insumo WHERE id_insumo = $1 FOR UPDATE',
      [idInsumo]
    );
    const insumo = insumoRes.rows[0];
    if (!insumo) throw badRequest(`El insumo #${idInsumo} no existe`);
    if (delta > 0) {
      await db.query(
        'UPDATE insumo SET stock_actual = stock_actual + $1 WHERE id_insumo = $2',
        [delta, idInsumo]
      );
    } else {
      const descuento = Math.abs(delta);
      const upd = await db.query(
        `UPDATE insumo
         SET stock_actual = stock_actual - $1
         WHERE id_insumo = $2 AND stock_actual >= $1
         RETURNING id_insumo`,
        [descuento, idInsumo]
      );
      if (upd.rows.length === 0) {
        throw conflict(`No hay stock suficiente del insumo "${insumo.nombre}" ${motivoFaltaStock}`);
      }
    }
  }
}

/**
 * Factura o soporte de la compra subido con POST /uploads (tipo "compra"):
 * public_id "local:compras/<archivo>" (disco) o "cenarepas/compras/..."
 * (Cloudinary, privado). Devuelve los campos a guardar, o undefined si la
 * petición no trae archivo. Un comprobante_url suelto (antiguo) se acepta tal cual.
 */
function comprobanteDe(data) {
  if (data.quitar_comprobante === true) return { url: null, publicId: null, recurso: null };
  const publicId = data.comprobante_public_id;
  if (publicId === undefined || publicId === null || publicId === '') {
    return data.comprobante_url !== undefined ? { url: data.comprobante_url || null, publicId: null, recurso: null } : undefined;
  }
  const local = String(publicId).startsWith('local:compras/');
  if (local) {
    const ruta = rutaLocal(publicId);
    if (!ruta || !fs.existsSync(ruta)) throw badRequest('El soporte de la compra no existe; súbelo de nuevo');
  } else if (!String(publicId).startsWith('cenarepas/compras/') || !cloudinaryConfigurado()) {
    throw badRequest('El soporte de la compra no es válido: súbelo con la opción de adjuntar');
  }
  const recurso = data.comprobante_recurso === 'raw' ? 'raw' : 'image';
  return { url: local ? null : data.comprobante_url || null, publicId: String(publicId), recurso };
}

export class ComprasService {
  static async getAll() {
    const res = await query(`${SELECT_COMPRA} ${GROUP_COMPRA} ORDER BY c.id_compra ASC`);
    return res.rows || [];
  }

  static async getById(id, db = null) {
    const executor = db || { query };
    const res = await executor.query(
      `${SELECT_COMPRA} WHERE c.id_compra = $1 ${GROUP_COMPRA}`,
      [id]
    );
    return res.rows[0] || null;
  }

  /**
   * Crea una orden de compra en estado Registrada y suma al stock_actual de
   * cada insumo comprado dentro de la misma transacción.
   */
  static async create(data) {
    const { id_proveedor, id_usuario, fecha_compra = new Date(), valor_total, medio_pago, detalles = [] } = data;
    const estadoValidado = validarEstadoCompra(data.estado);
    if (estadoValidado && estadoValidado !== 'Registrada') {
      throw badRequest('Una compra nueva solo se puede crear en estado Registrada');
    }
    const estado = 'Registrada';
    const detallesNorm = normalizarDetalles(detalles);
    const totalCalculado = valor_total !== undefined && valor_total !== null && valor_total !== ''
      ? Number(valor_total)
      : detallesNorm.reduce((acc, d) => acc + d.subtotal, 0);
    const soporte = comprobanteDe(data);

    return enTransaccion(async (db) => {
      const res = await db.query(
        `INSERT INTO compra (id_proveedor, id_usuario, fecha_compra, valor_total, medio_pago, comprobante_url, estado,
                             comprobante_public_id, comprobante_recurso)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         RETURNING id_compra`,
        [id_proveedor, id_usuario, fecha_compra, totalCalculado, medio_pago, soporte?.url ?? null, estado,
          soporte?.publicId ?? null, soporte?.recurso ?? null]
      );
      const idCompra = res.rows[0].id_compra;

      if (detallesNorm.length > 0) {
        const deltas = sumarCantidadesPorInsumo(detallesNorm);
        await aplicarDeltasInsumo(db, deltas, 'para registrar esta compra');
        for (const d of detallesNorm) {
          await db.query(
            `INSERT INTO detalle_compra (id_compra, id_insumo, cantidad, valor_unitario, subtotal)
             VALUES ($1, $2, $3, $4, $5)`,
            [idCompra, d.id_insumo, d.cantidad, d.valor_unitario, d.subtotal]
          );
        }
      }

      const creada = await this.getById(idCompra, db);
      return creada;
    }).then((creada) => {
      invalidarCacheDashboard();
      return creada;
    });
  }

  /**
   * Actualiza una compra Registrada (o la pasa a Anulada).
   * - Una compra Anulada no se puede modificar ni reactivar.
   * - Si pasa a Anulada, descuenta de insumo.stock_actual las cantidades registradas.
   * - Si sigue Registrada y trae detalles, actualiza detalle_compra y aplica la diferencia en insumo.stock_actual.
   */
  static async update(id, data) {
    const { id_proveedor, id_usuario, fecha_compra, valor_total, medio_pago } = data;
    const estadoValidado = validarEstadoCompra(data.estado);
    const soporte = comprobanteDe(data);
    const detallesEnviados = data.detalles !== undefined ? normalizarDetalles(data.detalles) : null;

    let archivoAnterior = null;

    const actualizada = await enTransaccion(async (db) => {
      const actualRes = await db.query(
        'SELECT * FROM compra WHERE id_compra = $1 FOR UPDATE',
        [id]
      );
      const actual = actualRes.rows[0];
      if (!actual) throw notFound('Compra no encontrada');
      if (actual.estado === 'Anulada') {
        throw conflict('Una compra anulada no se puede modificar ni reactivar');
      }

      if (soporte !== undefined) {
        archivoAnterior = {
          publicId: actual.comprobante_public_id,
          recurso: actual.comprobante_recurso,
        };
      }

      const nuevoEstado = estadoValidado ?? actual.estado;
      const detallesActuales = (
        await db.query('SELECT id_insumo, cantidad FROM detalle_compra WHERE id_compra = $1', [id])
      ).rows;

      let totalFinal = valor_total;

      if (nuevoEstado === 'Anulada') {
        // Anular revierte en insumo las cantidades originalmente registradas en la compra.
        const actualesPorInsumo = sumarCantidadesPorInsumo(detallesActuales);
        const deltas = new Map();
        for (const [idInsumo, cant] of actualesPorInsumo.entries()) {
          deltas.set(idInsumo, -cant);
        }
        await aplicarDeltasInsumo(db, deltas, 'para anular esta compra');
      } else if (detallesEnviados !== null) {
        // Compra sigue Registrada y se editaron sus líneas: aplicar solo la diferencia de stock.
        const actualesPorInsumo = sumarCantidadesPorInsumo(detallesActuales);
        const nuevosPorInsumo = sumarCantidadesPorInsumo(detallesEnviados);
        const todosIds = new Set([...actualesPorInsumo.keys(), ...nuevosPorInsumo.keys()]);
        const deltas = new Map();
        for (const idInsumo of todosIds) {
          const diff = (nuevosPorInsumo.get(idInsumo) || 0) - (actualesPorInsumo.get(idInsumo) || 0);
          if (diff !== 0) deltas.set(idInsumo, diff);
        }
        await aplicarDeltasInsumo(db, deltas, 'para reducir la cantidad en esta compra');

        await db.query('DELETE FROM detalle_compra WHERE id_compra = $1', [id]);
        for (const d of detallesEnviados) {
          await db.query(
            `INSERT INTO detalle_compra (id_compra, id_insumo, cantidad, valor_unitario, subtotal)
             VALUES ($1, $2, $3, $4, $5)`,
            [id, d.id_insumo, d.cantidad, d.valor_unitario, d.subtotal]
          );
        }
        if (totalFinal === undefined || totalFinal === null || totalFinal === '') {
          totalFinal = detallesEnviados.reduce((acc, d) => acc + d.subtotal, 0);
        }
      }

      await db.query(
        `UPDATE compra
         SET id_proveedor = COALESCE($1, id_proveedor),
             id_usuario = COALESCE($2, id_usuario),
             fecha_compra = COALESCE($3, fecha_compra),
             valor_total = COALESCE($4, valor_total),
             medio_pago = COALESCE($5, medio_pago),
             comprobante_url = CASE WHEN $9::boolean THEN $6 ELSE comprobante_url END,
             comprobante_public_id = CASE WHEN $9::boolean THEN $10 ELSE comprobante_public_id END,
             comprobante_recurso = CASE WHEN $9::boolean THEN $11 ELSE comprobante_recurso END,
             estado = COALESCE($7, estado)
         WHERE id_compra = $8`,
        [id_proveedor, id_usuario, fecha_compra, totalFinal, medio_pago, soporte?.url ?? null, nuevoEstado, id,
          soporte !== undefined, soporte?.publicId ?? null, soporte?.recurso ?? null]
      );

      return this.getById(id, db);
    });

    // El soporte anterior se borra solo si se reemplazó y el cambio se guardó.
    if (archivoAnterior?.publicId && archivoAnterior.publicId !== soporte?.publicId) {
      await borrarArchivo(archivoAnterior.publicId, archivoAnterior.recurso);
    }
    invalidarCacheDashboard();
    return actualizada;
  }

  /**
   * Cómo abrir el soporte de la compra: { tipo, url }. tipo "temporal" (URL
   * firmada de Cloudinary, 10 minutos), "local" (ruta autenticada que entrega
   * el archivo) o "externo" (URL antigua escrita a mano). null si no tiene.
   */
  static async enlaceComprobante(id) {
    const compra = await this.getById(id);
    if (!compra) throw notFound('Compra no encontrada');
    const { comprobante_public_id: publicId, comprobante_recurso: recurso, comprobante_url: url } = compra;
    if (publicId?.startsWith('local:')) return { tipo: 'local', url: `/api/v1/compras/${compra.id_compra}/comprobante/archivo` };
    if (publicId) {
      const formato = (url || '').split('?')[0].split('.').pop();
      return { tipo: 'temporal', url: urlTemporal(publicId, recurso, formato) };
    }
    return url ? { tipo: 'externo', url } : null;
  }

  /** Ruta en disco del soporte local (para GET /compras/:id/comprobante/archivo). */
  static async rutaComprobanteLocal(id) {
    const compra = await this.getById(id);
    const ruta = compra?.comprobante_public_id?.startsWith('local:') ? rutaLocal(compra.comprobante_public_id) : null;
    return ruta && fs.existsSync(ruta) ? ruta : null;
  }

  /**
   * Anula la compra (sin borrado físico) y revierte el stock que sumó en insumo.
   * Si ya estaba Anulada responde 409 para evitar descontar dos veces.
   */
  static async delete(id) {
    return enTransaccion(async (db) => {
      const res = await db.query(
        'SELECT id_compra, estado FROM compra WHERE id_compra = $1 FOR UPDATE',
        [id]
      );
      const compra = res.rows[0];
      if (!compra) return false;
      if (compra.estado === 'Anulada') {
        throw conflict('Esta compra ya se encuentra anulada');
      }

      const detalles = (
        await db.query('SELECT id_insumo, cantidad FROM detalle_compra WHERE id_compra = $1', [id])
      ).rows;
      const porInsumo = sumarCantidadesPorInsumo(detalles);
      const deltas = new Map();
      for (const [idInsumo, cant] of porInsumo.entries()) {
        deltas.set(idInsumo, -cant);
      }
      await aplicarDeltasInsumo(db, deltas, 'para anular esta compra');

      await db.query(`UPDATE compra SET estado = 'Anulada' WHERE id_compra = $1`, [id]);
      return true;
    }).then((anulada) => {
      if (anulada) invalidarCacheDashboard();
      return anulada;
    });
  }
}
