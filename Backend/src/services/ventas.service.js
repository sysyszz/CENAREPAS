import { query } from '../config/db.js';

export class VentasService {
  static async getAll() {
    try {
      const res = await query(`
        SELECT v.*, s.nombre AS sede_nombre, c.nombre AS cliente_nombre, u.nombre AS usuario_nombre,
               COALESCE(
                 json_agg(
                   json_build_object(
                     'id_detalle_venta', dv.id_detalle_venta,
                     'id_producto', dv.id_producto,
                     'producto_nombre', pr.nombre,
                     'cantidad', dv.cantidad,
                     'precio_unitario', dv.precio_unitario,
                     'subtotal', dv.subtotal
                   )
                 ) FILTER (WHERE dv.id_detalle_venta IS NOT NULL),
                 '[]'
               ) AS detalles
        FROM venta v
        LEFT JOIN sede s ON v.id_sede = s.id_sede
        LEFT JOIN cliente c ON v.id_cliente = c.id_cliente
        LEFT JOIN usuario u ON v.id_usuario = u.id_usuario
        LEFT JOIN detalle_venta dv ON v.id_venta = dv.id_venta
        LEFT JOIN producto pr ON dv.id_producto = pr.id_producto
        GROUP BY v.id_venta, s.nombre, c.nombre, u.nombre
        ORDER BY v.id_venta ASC
      `);
      return res.rows || [];
    } catch (error) {
      console.warn('[VentasService.getAll] Fallback:', error.message);
      return [];
    }
  }

  static async getById(id) {
    const res = await query('SELECT * FROM venta WHERE id_venta = $1', [id]);
    return res.rows[0] || null;
  }

  static async create(data) {
    const { id_sede, id_cliente, id_usuario, id_pedido, fecha_venta = new Date(), valor_total, medio_pago, comprobante_url, estado = 'completada', detalles = [] } = data;
    const res = await query(
      `INSERT INTO venta (id_sede, id_cliente, id_usuario, id_pedido, fecha_venta, valor_total, medio_pago, comprobante_url, estado)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [id_sede, id_cliente, id_usuario, id_pedido, fecha_venta, valor_total, medio_pago, comprobante_url, estado]
    );
    const newVenta = res.rows[0];

    if (detalles && detalles.length > 0) {
      for (const d of detalles) {
        await query(
          `INSERT INTO detalle_venta (id_venta, id_producto, cantidad, precio_unitario, subtotal)
           VALUES ($1, $2, $3, $4, $5)`,
          [newVenta.id_venta, d.id_producto, d.cantidad, d.precio_unitario, d.subtotal || (d.cantidad * d.precio_unitario)]
        );
      }
    }
    return newVenta;
  }

  static async update(id, data) {
    const { id_sede, id_cliente, id_usuario, id_pedido, valor_total, medio_pago, comprobante_url, estado } = data;
    const res = await query(
      `UPDATE venta 
       SET id_sede = COALESCE($1, id_sede),
           id_cliente = COALESCE($2, id_cliente),
           id_usuario = COALESCE($3, id_usuario),
           id_pedido = COALESCE($4, id_pedido),
           valor_total = COALESCE($5, valor_total),
           medio_pago = COALESCE($6, medio_pago),
           comprobante_url = COALESCE($7, comprobante_url),
           estado = COALESCE($8, estado)
       WHERE id_venta = $9
       RETURNING *`,
      [id_sede, id_cliente, id_usuario, id_pedido, valor_total, medio_pago, comprobante_url, estado, id]
    );
    return res.rows[0] || { id_venta: id, ...data };
  }

  static async delete(id) {
    await query('DELETE FROM venta WHERE id_venta = $1', [id]);
    return true;
  }
}
