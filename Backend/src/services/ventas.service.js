import { query } from '../config/db.js';

/**
 * Vista de SOLO LECTURA de ventas: una venta es un pedido Entregado.
 * Mantiene la forma que espera la web (id_venta, fecha_venta, estado
 * Pagada/Pendiente, detalles con id_detalle_venta) mientras se actualiza.
 * id_venta = id_pedido; id_venta_origen guarda el número de la venta antigua.
 */
const SELECT_VENTA = `
  SELECT p.id_pedido AS id_venta,
         p.id_pedido,
         p.id_venta_origen,
         p.id_sede, p.id_cliente, p.id_usuario,
         COALESCE(p.fecha_entregado, p.fecha_pedido) AS fecha_venta,
         p.valor_total, p.medio_pago, p.comprobante_url,
         CASE WHEN cr.estado = 'Activo' THEN 'Pendiente' ELSE 'Pagada' END AS estado,
         COALESCE(cr.saldo_pendiente, 0) AS saldo_pendiente,
         s.nombre AS sede_nombre, c.nombre AS cliente_nombre, u.nombre AS usuario_nombre,
         COALESCE(
           json_agg(
             json_build_object(
               'id_detalle_venta', dp.id_detalle_pedido,
               'id_producto', dp.id_producto,
               'producto_nombre', pr.nombre,
               'cantidad', dp.cantidad,
               'precio_unitario', dp.precio_unitario,
               'subtotal', dp.subtotal
             ) ORDER BY dp.id_detalle_pedido
           ) FILTER (WHERE dp.id_detalle_pedido IS NOT NULL),
           '[]'
         ) AS detalles
  FROM pedido p
  LEFT JOIN credito cr ON cr.id_pedido = p.id_pedido
  LEFT JOIN sede s ON p.id_sede = s.id_sede
  LEFT JOIN cliente c ON p.id_cliente = c.id_cliente
  LEFT JOIN usuario u ON p.id_usuario = u.id_usuario
  LEFT JOIN detalle_pedido dp ON p.id_pedido = dp.id_pedido
  LEFT JOIN producto pr ON dp.id_producto = pr.id_producto
  WHERE p.estado = 'Entregado'`;

const GROUP_VENTA = 'GROUP BY p.id_pedido, cr.id_credito, s.id_sede, c.id_cliente, u.id_usuario';

export class VentasService {
  static async getAll() {
    const res = await query(`${SELECT_VENTA} ${GROUP_VENTA} ORDER BY fecha_venta DESC, p.id_pedido DESC`);
    return res.rows;
  }

  static async getById(id) {
    const res = await query(`${SELECT_VENTA} AND p.id_pedido = $1 ${GROUP_VENTA}`, [id]);
    return res.rows[0] || null;
  }
}
