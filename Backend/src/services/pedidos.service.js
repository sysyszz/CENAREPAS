import { query } from '../config/db.js';

export class PedidosService {
  static async getAll() {
    try {
      const res = await query(`
        SELECT p.*, c.nombre AS cliente_nombre, s.nombre AS sede_nombre, u.nombre AS usuario_nombre,
               COALESCE(
                 json_agg(
                   json_build_object(
                     'id_detalle_pedido', dp.id_detalle_pedido,
                     'id_producto', dp.id_producto,
                     'producto_nombre', pr.nombre,
                     'cantidad', dp.cantidad,
                     'precio_unitario', dp.precio_unitario,
                     'subtotal', dp.subtotal
                   )
                 ) FILTER (WHERE dp.id_detalle_pedido IS NOT NULL),
                 '[]'
               ) AS detalles
        FROM pedido p
        LEFT JOIN cliente c ON p.id_cliente = c.id_cliente
        LEFT JOIN sede s ON p.id_sede = s.id_sede
        LEFT JOIN usuario u ON p.id_usuario = u.id_usuario
        LEFT JOIN detalle_pedido dp ON p.id_pedido = dp.id_pedido
        LEFT JOIN producto pr ON dp.id_producto = pr.id_producto
        GROUP BY p.id_pedido, c.nombre, s.nombre, u.nombre
        ORDER BY p.id_pedido ASC
      `);
      return res.rows || [];
    } catch (error) {
      console.warn('[PedidosService.getAll] Fallback:', error.message);
      return [];
    }
  }

  static async getById(id) {
    const res = await query('SELECT * FROM pedido WHERE id_pedido = $1', [id]);
    return res.rows[0] || null;
  }

  static async create(data) {
    const { id_cliente, id_sede, id_usuario, fecha_pedido = new Date(), fecha_entrega, valor_total, estado = 'Pendiente', observaciones, motivo_anulacion, detalles = [] } = data;
    const res = await query(
      `INSERT INTO pedido (id_cliente, id_sede, id_usuario, fecha_pedido, fecha_entrega, valor_total, estado, observaciones, motivo_anulacion)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [id_cliente, id_sede, id_usuario, fecha_pedido, fecha_entrega, valor_total, estado, observaciones, motivo_anulacion]
    );
    const newPedido = res.rows[0];

    if (detalles && detalles.length > 0) {
      for (const d of detalles) {
        await query(
          `INSERT INTO detalle_pedido (id_pedido, id_producto, cantidad, precio_unitario, subtotal)
           VALUES ($1, $2, $3, $4, $5)`,
          [newPedido.id_pedido, d.id_producto, d.cantidad, d.precio_unitario, d.subtotal || (d.cantidad * d.precio_unitario)]
        );
      }
    }
    return newPedido;
  }

  static async update(id, data) {
    const { id_cliente, id_sede, id_usuario, fecha_entrega, valor_total, estado, observaciones, motivo_anulacion } = data;
    const res = await query(
      `UPDATE pedido 
       SET id_cliente = COALESCE($1, id_cliente),
           id_sede = COALESCE($2, id_sede),
           id_usuario = COALESCE($3, id_usuario),
           fecha_entrega = COALESCE($4, fecha_entrega),
           valor_total = COALESCE($5, valor_total),
           estado = COALESCE($6, estado),
           observaciones = COALESCE($7, observaciones),
           motivo_anulacion = COALESCE($8, motivo_anulacion)
       WHERE id_pedido = $9
       RETURNING *`,
      [id_cliente, id_sede, id_usuario, fecha_entrega, valor_total, estado, observaciones, motivo_anulacion, id]
    );
    return res.rows[0] || { id_pedido: id, ...data };
  }

  static async delete(id) {
    await query('DELETE FROM pedido WHERE id_pedido = $1', [id]);
    return true;
  }
}
