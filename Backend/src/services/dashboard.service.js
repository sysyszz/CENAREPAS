import { query } from '../config/db.js';
import {
  DIAS_ALERTA_VENCIMIENTO,
  ESTADOS_COMPRA,
  ESTADOS_PEDIDO,
  ZONA_HORARIA_NEGOCIO,
} from '../config/negocio.js';
import {
  guardarCacheDashboard,
  invalidarCacheDashboard,
  obtenerCacheDashboard,
} from '../utils/dashboardCache.js';

const ESTADO_VENTA = ESTADOS_PEDIDO[2]; // 'Entregado'
const ESTADO_PENDIENTE = ESTADOS_PEDIDO[0]; // 'Pendiente'
const ESTADO_EN_PROCESO = ESTADOS_PEDIDO[1]; // 'En proceso'
const ESTADO_ANULADO = ESTADOS_PEDIDO[3]; // 'Anulado'
const ESTADO_COMPRA_VALIDA = ESTADOS_COMPRA[0]; // 'Registrada'

const DIAS_SEMANA_ETIQUETAS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
const MESES_ETIQUETAS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

const CLIENTE_PALETA = [
  { bg: '#C1502D', fg: '#FFFFFF' },
  { bg: '#E8B23D', fg: '#78350F' },
  { bg: '#5A7A3A', fg: '#FFFFFF' },
  { bg: '#E2895F', fg: '#402310' },
  { bg: '#F5ECD8', fg: '#2E2B25' },
];

const PERIODOS_VALIDOS = {
  semana: { clave: 'semana', etiqueta: 'Esta semana' },
  'esta semana': { clave: 'semana', etiqueta: 'Esta semana' },
  mes: { clave: 'mes', etiqueta: 'Este mes' },
  'este mes': { clave: 'mes', etiqueta: 'Este mes' },
  '30d': { clave: '30d', etiqueta: 'Últimos 30 días' },
  'ultimos 30 dias': { clave: '30d', etiqueta: 'Últimos 30 días' },
  'últimos 30 días': { clave: '30d', etiqueta: 'Últimos 30 días' },
  anio: { clave: 'anio', etiqueta: 'Año actual' },
  'ano actual': { clave: 'anio', etiqueta: 'Año actual' },
  'año actual': { clave: 'anio', etiqueta: 'Año actual' },
};

const round1 = (n) => Math.round((Number(n) || 0) * 10) / 10;
const round2 = (n) => Math.round((Number(n) || 0) * 100) / 100;
const num = (v) => {
  const parsed = Number(v);
  return Number.isFinite(parsed) ? parsed : 0;
};

/**
 * Calcula el porcentaje de variación manejando división por cero.
 * Nunca devuelve NaN ni Infinity.
 */
export function calcularVariacion(actual, anterior) {
  const a = num(actual);
  const b = num(anterior);
  if (b === 0) {
    return {
      variacionPct: a > 0 ? 100 : 0,
      sinBaseAnterior: a > 0,
    };
  }
  return {
    variacionPct: round1(((a - b) / b) * 100),
    sinBaseAnterior: false,
  };
}

export function normalizarPeriodo(raw) {
  const limpio = String(raw || '').trim().toLowerCase();
  return PERIODOS_VALIDOS[limpio] || PERIODOS_VALIDOS.semana;
}

function inicialesDe(nombre) {
  const partes = String(nombre || '').trim().split(/\s+/).filter(Boolean);
  if (partes.length === 0) return 'CL';
  if (partes.length === 1) return partes[0].slice(0, 2).toUpperCase();
  return (partes[0][0] + partes[1][0]).toUpperCase();
}

function formatearFechaHoraBogota(date = new Date()) {
  const fecha = new Intl.DateTimeFormat('es-CO', {
    timeZone: ZONA_HORARIA_NEGOCIO,
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
  const hora = new Intl.DateTimeFormat('es-CO', {
    timeZone: ZONA_HORARIA_NEGOCIO,
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(date);
  return `${fecha} ${hora}`;
}

/**
 * Resuelve en SQL las fechas límite (en zona horaria America/Bogota)
 * para el período seleccionado y su período comparativo inmediatamente anterior.
 */
async function obtenerRangoPeriodo(clavePeriodo) {
  const res = await query(
    `WITH ref AS (
       SELECT (NOW() AT TIME ZONE $1)::date AS hoy
     )
     SELECT
       hoy,
       (hoy - 1) AS ayer,
       date_trunc('week', hoy::timestamp)::date AS inicio_semana,
       (date_trunc('week', hoy::timestamp)::date - 7) AS inicio_semana_anterior,
       date_trunc('month', hoy::timestamp)::date AS inicio_mes,
       (date_trunc('month', hoy::timestamp) - INTERVAL '1 month')::date AS inicio_mes_anterior,
       (date_trunc('month', hoy::timestamp) - INTERVAL '1 day')::date AS fin_mes_anterior,
       EXTRACT(YEAR FROM hoy)::int AS anio_actual,
       (EXTRACT(YEAR FROM hoy)::int - 1) AS anio_anterior,
       CASE $2
         WHEN 'mes' THEN date_trunc('month', hoy::timestamp)::date
         WHEN '30d' THEN (hoy - 29)
         WHEN 'anio' THEN date_trunc('year', hoy::timestamp)::date
         ELSE date_trunc('week', hoy::timestamp)::date
       END AS desde,
       hoy AS hasta,
       CASE $2
         WHEN 'mes' THEN (date_trunc('month', hoy::timestamp) - INTERVAL '1 month')::date
         WHEN '30d' THEN (hoy - 59)
         WHEN 'anio' THEN (date_trunc('year', hoy::timestamp) - INTERVAL '1 year')::date
         ELSE (date_trunc('week', hoy::timestamp)::date - 7)
       END AS prev_desde,
       CASE $2
         WHEN 'mes' THEN (date_trunc('month', hoy::timestamp) - INTERVAL '1 day')::date
         WHEN '30d' THEN (hoy - 30)
         WHEN 'anio' THEN (hoy - INTERVAL '1 year')::date
         ELSE (date_trunc('week', hoy::timestamp)::date - 1)
       END AS prev_hasta
     FROM ref`,
    [ZONA_HORARIA_NEGOCIO, clavePeriodo]
  );
  return res.rows[0];
}

const isoDate = (d) => {
  if (!d) return null;
  if (typeof d === 'string') return d.slice(0, 10);
  const dt = new Date(d);
  const y = dt.getFullYear();
  const m = String(dt.getMonth() + 1).padStart(2, '0');
  const day = String(dt.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

export class DashboardService {
  static invalidarCache() {
    invalidarCacheDashboard();
  }

  /**
   * Genera el resumen completo del Dashboard desde PostgreSQL sin mocks ni fallbacks fijos.
   * Cubre HU-133 a HU-149 y todos los bloques consumidos por la vista web.
   */
  static async getSummary({ periodo: periodoRaw, nocache = false } = {}) {
    const periodo = normalizarPeriodo(periodoRaw);
    const cacheKey = `summary:${periodo.clave}`;

    if (!nocache) {
      const cached = obtenerCacheDashboard(cacheKey);
      if (cached) return cached;
    }

    const r = await obtenerRangoPeriodo(periodo.clave);
    const hoy = isoDate(r.hoy);
    const ayer = isoDate(r.ayer);
    const inicioSemana = isoDate(r.inicio_semana);
    const inicioSemanaAnterior = isoDate(r.inicio_semana_anterior);
    const inicioMes = isoDate(r.inicio_mes);
    const inicioMesAnterior = isoDate(r.inicio_mes_anterior);
    const finMesAnterior = isoDate(r.fin_mes_anterior);
    const desde = isoDate(r.desde);
    const hasta = isoDate(r.hasta);
    const prevDesde = isoDate(r.prev_desde);
    const prevHasta = isoDate(r.prev_hasta);
    const anioActual = Number(r.anio_actual);
    const anioAnterior = Number(r.anio_anterior);

    // Ejecutar consultas agregadas en paralelo (todas en SQL, sin traer tablas enteras a memoria)
    const [
      ventasComparativasRes,
      pedidosKpiRes,
      clientesKpiRes,
      insumosKpiRes,
      produccionKpiRes,
      sparklinesRes,
      ventasPorDiaRes,
      ventasPorSemanaRes,
      ventasPorMesRes,
      comprasPorDiaRes,
      comprasPorSemanaRes,
      comprasPorMesRes,
      ventasDiaSemanaRes,
      ultimasVentasRes,
      productosMasVendidosRes,
      ventasPorCategoriaRes,
      gastoMensualAnualRes,
      topProveedoresRes,
      stockInsumosAgrupadoRes,
      alertasStockBajoRes,
      alertasProximosVencerRes,
      pedidosRetrasadosRes,
      pedidoActivoRes,
      funnelPedidosRes,
      produccionLineasRes,
      pedidosFlowRes,
      insumosRotacionRes,
      consumoInsumos7dRes,
      rentabilidadSemanalRes,
      rentabilidadPeriodoRes,
      topClientesRes,
    ] = await Promise.all([
      // 1. Ventas hoy vs ayer (HU-135) y mes actual vs mes anterior (HU-136) — solo Entregado
      query(
        `SELECT
           COALESCE(SUM(valor_total) FILTER (WHERE COALESCE(fecha_entregado, fecha_pedido)::date = $2::date), 0) AS ventas_hoy,
           COALESCE(SUM(valor_total) FILTER (WHERE COALESCE(fecha_entregado, fecha_pedido)::date = $3::date), 0) AS ventas_ayer,
           COALESCE(SUM(valor_total) FILTER (WHERE COALESCE(fecha_entregado, fecha_pedido)::date BETWEEN $4::date AND $2::date), 0) AS ventas_mes_actual,
           COALESCE(SUM(valor_total) FILTER (WHERE COALESCE(fecha_entregado, fecha_pedido)::date BETWEEN $5::date AND $6::date), 0) AS ventas_mes_anterior,
           COALESCE(SUM(valor_total) FILTER (WHERE COALESCE(fecha_entregado, fecha_pedido)::date BETWEEN $7::date AND $8::date), 0) AS ventas_periodo
         FROM pedido
         WHERE estado = $1`,
        [ESTADO_VENTA, hoy, ayer, inicioMes, inicioMesAnterior, finMesAnterior, desde, hasta]
      ),

      // 2. Pedidos procesados (no anulados) en periodo actual vs anterior, más hoy vs ayer
      query(
        `SELECT
           COUNT(*) FILTER (WHERE fecha_pedido::date BETWEEN $2::date AND $3::date) AS pedidos_periodo,
           COUNT(*) FILTER (WHERE fecha_pedido::date BETWEEN $4::date AND $5::date) AS pedidos_periodo_anterior,
           COUNT(*) FILTER (WHERE fecha_pedido::date = $6::date) AS pedidos_hoy,
           COUNT(*) FILTER (WHERE fecha_pedido::date = $7::date) AS pedidos_ayer
         FROM pedido
         WHERE estado <> $1`,
        [ESTADO_ANULADO, desde, hasta, prevDesde, prevHasta, hoy, ayer]
      ),

      // 3. Clientes activos
      query(
        `SELECT
           COUNT(*) FILTER (WHERE estado = 'Activo') AS total_activos,
           COUNT(*) FILTER (WHERE estado = 'Activo' AND fecha_creacion::date >= $1::date) AS nuevos_semana
         FROM cliente`,
        [inicioSemana]
      ),

      // 4. Insumos activos, bajo stock (< stock_minimo) y próximos a vencer (<= 30 días)
      query(
        `SELECT
           COUNT(*) AS total_activos,
           COUNT(*) FILTER (WHERE stock_actual < stock_minimo) AS total_stock_bajo,
           COUNT(*) FILTER (WHERE fecha_vencimiento IS NOT NULL AND fecha_vencimiento <= ($1::date + $2::int)) AS total_proximos_vencer
         FROM insumo
         WHERE estado = 'Activo'`,
        [hoy, DIAS_ALERTA_VENCIMIENTO]
      ),

      // 5. Producción del día vs ayer (excluyendo lotes anulados)
      query(
        `SELECT
           COALESCE(SUM(cantidad_producida) FILTER (WHERE fecha_produccion = $1::date), 0) AS produccion_hoy,
           COALESCE(SUM(cantidad_producida) FILTER (WHERE fecha_produccion = $2::date), 0) AS produccion_ayer
         FROM lote_produccion
         WHERE LOWER(estado) <> 'anulado'`,
        [hoy, ayer]
      ),

      // 6. Sparklines reales de los últimos 7 días (ventas, pedidos, compras, producción)
      query(
        `WITH dias AS (
           SELECT generate_series(($1::date - 6), $1::date, INTERVAL '1 day')::date AS dia
         )
         SELECT
           d.dia,
           COALESCE((
             SELECT SUM(p.valor_total)
             FROM pedido p
             WHERE p.estado = $2 AND COALESCE(p.fecha_entregado, p.fecha_pedido)::date = d.dia
           ), 0) AS ventas,
           COALESCE((
             SELECT COUNT(*)
             FROM pedido p
             WHERE p.estado <> $3 AND p.fecha_pedido::date = d.dia
           ), 0) AS pedidos,
           COALESCE((
             SELECT SUM(c.valor_total)
             FROM compra c
             WHERE c.estado = $4 AND c.fecha_compra = d.dia
           ), 0) AS compras,
           COALESCE((
             SELECT SUM(lp.cantidad_producida)
             FROM lote_produccion lp
             WHERE LOWER(lp.estado) <> 'anulado' AND lp.fecha_produccion = d.dia
           ), 0) AS produccion
         FROM dias d
         ORDER BY d.dia ASC`,
        [hoy, ESTADO_VENTA, ESTADO_ANULADO, ESTADO_COMPRA_VALIDA]
      ),

      // 7. HU-133 Ventas diarias (últimos 14 días)
      query(
        `WITH dias AS (
           SELECT generate_series(($1::date - 13), $1::date, INTERVAL '1 day')::date AS dia
         )
         SELECT
           d.dia,
           to_char(d.dia, 'DD/MM/YYYY') AS etiqueta,
           COALESCE(SUM(p.valor_total), 0) AS total,
           COUNT(p.id_pedido) AS cantidad
         FROM dias d
         LEFT JOIN pedido p
           ON p.estado = $2 AND COALESCE(p.fecha_entregado, p.fecha_pedido)::date = d.dia
         GROUP BY d.dia
         ORDER BY d.dia ASC`,
        [hoy, ESTADO_VENTA]
      ),

      // 8. HU-133 Ventas semanales (últimas 8 semanas ISO)
      query(
        `WITH semanas AS (
           SELECT generate_series(
             ($1::date - INTERVAL '7 weeks')::date,
             $1::date,
             INTERVAL '1 week'
           )::date AS semana_inicio
         )
         SELECT
           s.semana_inicio,
           to_char(s.semana_inicio, 'DD/MM/YYYY') AS etiqueta,
           COALESCE(SUM(p.valor_total), 0) AS total,
           COUNT(p.id_pedido) AS cantidad
         FROM semanas s
         LEFT JOIN pedido p
           ON p.estado = $2
          AND COALESCE(p.fecha_entregado, p.fecha_pedido)::date >= s.semana_inicio
          AND COALESCE(p.fecha_entregado, p.fecha_pedido)::date < (s.semana_inicio + 7)
         GROUP BY s.semana_inicio
         ORDER BY s.semana_inicio ASC`,
        [inicioSemana, ESTADO_VENTA]
      ),

      // 9. HU-133 Ventas mensuales (últimos 12 meses)
      query(
        `WITH meses AS (
           SELECT generate_series(
             (date_trunc('month', $1::date) - INTERVAL '11 months')::date,
             date_trunc('month', $1::date)::date,
             INTERVAL '1 month'
           )::date AS mes_inicio
         )
         SELECT
           to_char(m.mes_inicio, 'YYYY-MM') AS mes,
           to_char(m.mes_inicio, 'MM/YYYY') AS etiqueta,
           COALESCE(SUM(p.valor_total), 0) AS total,
           COUNT(p.id_pedido) AS cantidad
         FROM meses m
         LEFT JOIN pedido p
           ON p.estado = $2
          AND date_trunc('month', COALESCE(p.fecha_entregado, p.fecha_pedido))::date = m.mes_inicio
         GROUP BY m.mes_inicio
         ORDER BY m.mes_inicio ASC`,
        [hoy, ESTADO_VENTA]
      ),

      // 10. HU-134 Compras diarias (últimos 14 días, solo Registrada)
      query(
        `WITH dias AS (
           SELECT generate_series(($1::date - 13), $1::date, INTERVAL '1 day')::date AS dia
         )
         SELECT
           d.dia,
           to_char(d.dia, 'DD/MM/YYYY') AS etiqueta,
           COALESCE(SUM(c.valor_total), 0) AS total,
           COUNT(c.id_compra) AS cantidad
         FROM dias d
         LEFT JOIN compra c
           ON c.estado = $2 AND c.fecha_compra = d.dia
         GROUP BY d.dia
         ORDER BY d.dia ASC`,
        [hoy, ESTADO_COMPRA_VALIDA]
      ),

      // 11. HU-134 Compras semanales (últimas 8 semanas ISO, solo Registrada)
      query(
        `WITH semanas AS (
           SELECT generate_series(
             ($1::date - INTERVAL '7 weeks')::date,
             $1::date,
             INTERVAL '1 week'
           )::date AS semana_inicio
         )
         SELECT
           s.semana_inicio,
           to_char(s.semana_inicio, 'DD/MM/YYYY') AS etiqueta,
           COALESCE(SUM(c.valor_total), 0) AS total,
           COUNT(c.id_compra) AS cantidad
         FROM semanas s
         LEFT JOIN compra c
           ON c.estado = $2
          AND c.fecha_compra >= s.semana_inicio
          AND c.fecha_compra < (s.semana_inicio + 7)
         GROUP BY s.semana_inicio
         ORDER BY s.semana_inicio ASC`,
        [inicioSemana, ESTADO_COMPRA_VALIDA]
      ),

      // 12. HU-134 Compras mensuales (últimos 12 meses, solo Registrada)
      query(
        `WITH meses AS (
           SELECT generate_series(
             (date_trunc('month', $1::date) - INTERVAL '11 months')::date,
             date_trunc('month', $1::date)::date,
             INTERVAL '1 month'
           )::date AS mes_inicio
         )
         SELECT
           to_char(m.mes_inicio, 'YYYY-MM') AS mes,
           to_char(m.mes_inicio, 'MM/YYYY') AS etiqueta,
           COALESCE(SUM(c.valor_total), 0) AS total,
           COUNT(c.id_compra) AS cantidad
         FROM meses m
         LEFT JOIN compra c
           ON c.estado = $2
          AND date_trunc('month', c.fecha_compra)::date = m.mes_inicio
         GROUP BY m.mes_inicio
         ORDER BY m.mes_inicio ASC`,
        [hoy, ESTADO_COMPRA_VALIDA]
      ),

      // 13. HU-140 Ventas por día de la semana (semana actual vs anterior, ISO Lun=1..Dom=7)
      query(
        `SELECT
           EXTRACT(ISODOW FROM COALESCE(fecha_entregado, fecha_pedido)::date)::int AS dow,
           COALESCE(SUM(valor_total) FILTER (
             WHERE COALESCE(fecha_entregado, fecha_pedido)::date >= $2::date
               AND COALESCE(fecha_entregado, fecha_pedido)::date < ($2::date + 7)
           ), 0) AS semana_actual,
           COALESCE(SUM(valor_total) FILTER (
             WHERE COALESCE(fecha_entregado, fecha_pedido)::date >= $3::date
               AND COALESCE(fecha_entregado, fecha_pedido)::date < $2::date
           ), 0) AS semana_anterior
         FROM pedido
         WHERE estado = $1
           AND COALESCE(fecha_entregado, fecha_pedido)::date >= $3::date
           AND COALESCE(fecha_entregado, fecha_pedido)::date < ($2::date + 7)
         GROUP BY dow
         ORDER BY dow ASC`,
        [ESTADO_VENTA, inicioSemana, inicioSemanaAnterior]
      ),

      // 14. HU-137 Últimas 5 ventas (pedidos Entregados más recientes)
      query(
        `SELECT
           p.id_pedido,
           COALESCE(c.nombre, 'Cliente General') AS cliente_nombre,
           COALESCE(s.nombre, 'Sede') AS sede_nombre,
           p.valor_total AS monto,
           COALESCE(p.fecha_entregado, p.fecha_pedido) AS fecha_venta,
           to_char(COALESCE(p.fecha_entregado, p.fecha_pedido), 'DD/MM/YYYY') AS fecha_formato,
           to_char(COALESCE(p.fecha_entregado, p.fecha_pedido), 'HH12:MI AM') AS hora_formato,
           CASE WHEN cr.estado = 'Activo' THEN 'Pendiente' ELSE 'Pagada' END AS estado_pago
         FROM pedido p
         LEFT JOIN cliente c ON c.id_cliente = p.id_cliente
         LEFT JOIN sede s ON s.id_sede = p.id_sede
         LEFT JOIN credito cr ON cr.id_pedido = p.id_pedido
         WHERE p.estado = $1
         ORDER BY COALESCE(p.fecha_entregado, p.fecha_pedido) DESC, p.id_pedido DESC
         LIMIT 5`,
        [ESTADO_VENTA]
      ),

      // 15. HU-138 Productos más vendidos en el período (pedidos Entregados)
      query(
        `SELECT
           pr.id_producto,
           pr.nombre,
           COALESCE(SUM(dp.cantidad), 0) AS cantidad,
           COALESCE(SUM(dp.subtotal), 0) AS monto
         FROM detalle_pedido dp
         JOIN pedido p ON p.id_pedido = dp.id_pedido
         JOIN producto pr ON pr.id_producto = dp.id_producto
         WHERE p.estado = $1
           AND COALESCE(p.fecha_entregado, p.fecha_pedido)::date BETWEEN $2::date AND $3::date
         GROUP BY pr.id_producto, pr.nombre
         ORDER BY cantidad DESC, monto DESC, pr.id_producto ASC
         LIMIT 10`,
        [ESTADO_VENTA, desde, hasta]
      ),

      // 16. HU-139 y HU-141 Ventas por categoría y % de participación en el período
      query(
        `SELECT
           cp.id_categoria,
           cp.nombre AS categoria,
           COALESCE(SUM(dp.cantidad), 0) AS cantidad,
           COALESCE(SUM(dp.subtotal), 0) AS total
         FROM detalle_pedido dp
         JOIN pedido p ON p.id_pedido = dp.id_pedido
         JOIN producto pr ON pr.id_producto = dp.id_producto
         JOIN categoria_producto cp ON cp.id_categoria = pr.id_categoria
         WHERE p.estado = $1
           AND COALESCE(p.fecha_entregado, p.fecha_pedido)::date BETWEEN $2::date AND $3::date
         GROUP BY cp.id_categoria, cp.nombre
         ORDER BY total DESC, cp.id_categoria ASC`,
        [ESTADO_VENTA, desde, hasta]
      ),

      // 17. HU-142 Gasto acumulado mensual y HU-144 Compras año actual vs año anterior
      query(
        `WITH meses AS (
           SELECT generate_series(1, 12) AS mes_num
         )
         SELECT
           m.mes_num,
           COALESCE(SUM(c.valor_total) FILTER (WHERE EXTRACT(YEAR FROM c.fecha_compra)::int = $2::int), 0) AS total_actual,
           COALESCE(SUM(c.valor_total) FILTER (WHERE EXTRACT(YEAR FROM c.fecha_compra)::int = $3::int), 0) AS total_anterior
         FROM meses m
         LEFT JOIN compra c
           ON c.estado = $1
          AND EXTRACT(MONTH FROM c.fecha_compra)::int = m.mes_num
          AND EXTRACT(YEAR FROM c.fecha_compra)::int IN ($2::int, $3::int)
         GROUP BY m.mes_num
         ORDER BY m.mes_num ASC`,
        [ESTADO_COMPRA_VALIDA, anioActual, anioAnterior]
      ),

      // 18. HU-143 Top 5 proveedores por monto total de compras Registradas
      query(
        `SELECT
           pr.id_proveedor,
           pr.nombre,
           COALESCE(SUM(c.valor_total), 0) AS monto_total,
           COUNT(c.id_compra) AS total_compras
         FROM compra c
         JOIN proveedor pr ON pr.id_proveedor = c.id_proveedor
         WHERE c.estado = $1
         GROUP BY pr.id_proveedor, pr.nombre
         ORDER BY monto_total DESC, pr.id_proveedor ASC
         LIMIT 5`,
        [ESTADO_COMPRA_VALIDA]
      ),

      // 19. HU-145 Stock por categoría de insumo -> insumo no tiene categoría; se agrupa por unidad_medida (solo Activos)
      query(
        `SELECT
           i.unidad_medida AS categoria,
           COALESCE(SUM(i.stock_actual), 0) AS stock_total,
           COUNT(*) AS cantidad_insumos,
           COUNT(*) FILTER (WHERE i.stock_actual < i.stock_minimo) AS insumos_bajo_stock
         FROM insumo i
         WHERE i.estado = 'Activo'
         GROUP BY i.unidad_medida
         ORDER BY stock_total DESC, i.unidad_medida ASC`
      ),

      // 20. HU-146 Alertas de insumos activos con bajo stock (stock_actual < stock_minimo)
      query(
        `SELECT
           i.id_insumo,
           i.nombre,
           i.unidad_medida,
           i.stock_actual,
           i.stock_minimo,
           (i.stock_minimo - i.stock_actual) AS deficit,
           pr.nombre AS proveedor_nombre
         FROM insumo i
         LEFT JOIN proveedor pr ON pr.id_proveedor = i.id_proveedor
         WHERE i.estado = 'Activo'
           AND i.stock_actual < i.stock_minimo
         ORDER BY (i.stock_minimo - i.stock_actual) DESC, i.id_insumo ASC`
      ),

      // 21. HU-147 Alertas de insumos activos próximos a vencer (con días restantes)
      query(
        `SELECT
           i.id_insumo,
           i.nombre,
           i.unidad_medida,
           i.stock_actual,
           i.fecha_vencimiento,
           to_char(i.fecha_vencimiento, 'DD/MM/YYYY') AS fecha_formato,
           (i.fecha_vencimiento - $1::date)::int AS dias_restantes
         FROM insumo i
         WHERE i.estado = 'Activo'
           AND i.fecha_vencimiento IS NOT NULL
           AND i.fecha_vencimiento <= ($1::date + $2::int)
         ORDER BY i.fecha_vencimiento ASC, i.id_insumo ASC`,
        [hoy, DIAS_ALERTA_VENCIMIENTO]
      ),

      // 22. Pedidos activos retrasados (para alertas operativas reales)
      query(
        `SELECT
           p.id_pedido,
           c.nombre AS cliente_nombre,
           s.nombre AS sede_nombre,
           p.estado,
           to_char(p.fecha_entrega, 'DD/MM/YYYY') AS fecha_entrega_formato,
           ($1::date - p.fecha_entrega)::int AS dias_retraso
         FROM pedido p
         LEFT JOIN cliente c ON c.id_cliente = p.id_cliente
         LEFT JOIN sede s ON s.id_sede = p.id_sede
         WHERE p.estado IN ($2, $3)
           AND p.fecha_entrega < $1::date
         ORDER BY p.fecha_entrega ASC, p.id_pedido ASC
         LIMIT 5`,
        [hoy, ESTADO_PENDIENTE, ESTADO_EN_PROCESO]
      ),

      // 23. Pedido activo prioritario (para PedidoActivoFunnelSection)
      query(
        `SELECT
           p.id_pedido,
           COALESCE(c.nombre, 'Cliente General') AS cliente_nombre,
           COALESCE(s.nombre, 'Sin sede') AS sede_nombre,
           p.estado,
           p.fecha_entrega,
           (p.fecha_entrega < $1::date) AS retrasado,
           COALESCE(SUM(dp.cantidad), 0) AS unidades
         FROM pedido p
         LEFT JOIN cliente c ON c.id_cliente = p.id_cliente
         LEFT JOIN sede s ON s.id_sede = p.id_sede
         LEFT JOIN detalle_pedido dp ON dp.id_pedido = p.id_pedido
         WHERE p.estado IN ($2, $3)
         GROUP BY p.id_pedido, c.nombre, s.nombre
         ORDER BY (p.fecha_entrega < $1::date) DESC, p.fecha_entrega ASC, p.id_pedido ASC
         LIMIT 1`,
        [hoy, ESTADO_PENDIENTE, ESTADO_EN_PROCESO]
      ),

      // 24. Funnel real de pedidos por estado en el período (Pendiente -> En proceso -> Entregado, + Anulado)
      query(
        `SELECT
           COUNT(*) FILTER (WHERE estado = $1) AS pendiente,
           COUNT(*) FILTER (WHERE estado = $2) AS en_proceso,
           COUNT(*) FILTER (WHERE estado = $3) AS entregado,
           COUNT(*) FILTER (WHERE estado = $4) AS anulado
         FROM pedido
         WHERE fecha_pedido::date BETWEEN $5::date AND $6::date`,
        [ESTADO_PENDIENTE, ESTADO_EN_PROCESO, ESTADO_VENTA, ESTADO_ANULADO, desde, hasta]
      ),

      // 25. Producción por línea (categoría de producto de la ficha técnica) en el período
      query(
        `SELECT
           COALESCE(cp.nombre, ft.nombre, 'Sin categoría') AS linea,
           COALESCE(SUM(lp.cantidad_producida), 0) AS unidades
         FROM lote_produccion lp
         LEFT JOIN ficha_tecnica ft ON ft.id_ficha = lp.id_ficha
         LEFT JOIN LATERAL (
           SELECT p.id_categoria
           FROM producto p
           WHERE p.id_ficha = lp.id_ficha
           ORDER BY p.id_producto ASC
           LIMIT 1
         ) pr ON TRUE
         LEFT JOIN categoria_producto cp ON cp.id_categoria = pr.id_categoria
         WHERE LOWER(lp.estado) <> 'anulado'
           AND lp.fecha_produccion BETWEEN $1::date AND $2::date
         GROUP BY COALESCE(cp.nombre, ft.nombre, 'Sin categoría')
         ORDER BY unidades DESC, linea ASC
         LIMIT 6`,
        [desde, hasta]
      ),

      // 26. Distribución de pedidos activos por sede (Bello Oriente / Aranjuez y todas)
      query(
        `SELECT
           s.id_sede,
           s.nombre AS sede_nombre,
           COUNT(p.id_pedido) AS activos
         FROM sede s
         LEFT JOIN pedido p
           ON p.id_sede = s.id_sede AND p.estado IN ($1, $2)
         WHERE s.estado = 'Activo'
         GROUP BY s.id_sede, s.nombre
         ORDER BY s.id_sede ASC`,
        [ESTADO_PENDIENTE, ESTADO_EN_PROCESO]
      ),

      // 27. Rotación y estado de insumos activos (consumo real en lotes últimos 30 días)
      query(
        `SELECT
           i.id_insumo,
           i.nombre,
           i.unidad_medida,
           i.stock_actual,
           i.stock_minimo,
           i.fecha_vencimiento,
           CASE WHEN i.fecha_vencimiento IS NOT NULL
                THEN (i.fecha_vencimiento - $1::date)::int
                ELSE NULL END AS dias_restantes,
           COALESCE(SUM(lpi.cantidad_consumida) FILTER (
             WHERE LOWER(lp.estado) <> 'anulado' AND lp.fecha_produccion >= ($1::date - 29)
           ), 0) AS consumo_30d,
           COALESCE(SUM(lpi.cantidad_consumida) FILTER (
             WHERE LOWER(lp.estado) <> 'anulado' AND lp.fecha_produccion BETWEEN ($1::date - 6) AND $1::date
           ), 0) AS consumo_7d,
           COALESCE(SUM(lpi.cantidad_consumida) FILTER (
             WHERE LOWER(lp.estado) <> 'anulado' AND lp.fecha_produccion BETWEEN ($1::date - 13) AND ($1::date - 7)
           ), 0) AS consumo_7d_prev
         FROM insumo i
         LEFT JOIN lote_produccion_insumo lpi ON lpi.id_insumo = i.id_insumo
         LEFT JOIN lote_produccion lp ON lp.id_lote = lpi.id_lote
         WHERE i.estado = 'Activo'
         GROUP BY i.id_insumo
         ORDER BY
           (i.stock_actual < i.stock_minimo) DESC,
           (i.stock_actual / NULLIF(i.stock_minimo, 0)) ASC NULLS LAST,
           i.fecha_vencimiento ASC NULLS LAST,
           i.id_insumo ASC
         LIMIT 10`,
        [hoy]
      ),

      // 28. Tendencia diaria de consumo de insumos (últimos 7 días) para sparkline de featuredInsumos
      query(
        `WITH dias AS (
           SELECT generate_series(($1::date - 6), $1::date, INTERVAL '1 day')::date AS dia
         )
         SELECT
           lpi.id_insumo,
           d.dia,
           COALESCE(SUM(lpi.cantidad_consumida), 0) AS consumido
         FROM dias d
         JOIN lote_produccion lp
           ON lp.fecha_produccion = d.dia AND LOWER(lp.estado) <> 'anulado'
         JOIN lote_produccion_insumo lpi ON lpi.id_lote = lp.id_lote
         GROUP BY lpi.id_insumo, d.dia
         ORDER BY lpi.id_insumo, d.dia ASC`,
        [hoy]
      ),

      // 29. Rentabilidad semanal (últimas 8 semanas): ventas Entregadas menos compras Registradas
      query(
        `WITH semanas AS (
           SELECT
             ROW_NUMBER() OVER (ORDER BY s.semana_inicio) AS idx,
             s.semana_inicio::date AS semana_inicio
           FROM generate_series(
             ($1::date - INTERVAL '7 weeks')::date,
             $1::date,
             INTERVAL '1 week'
           ) AS s(semana_inicio)
         )
         SELECT
           s.idx,
           s.semana_inicio,
           COALESCE((
             SELECT SUM(p.valor_total)
             FROM pedido p
             WHERE p.estado = $2
               AND COALESCE(p.fecha_entregado, p.fecha_pedido)::date >= s.semana_inicio
               AND COALESCE(p.fecha_entregado, p.fecha_pedido)::date < (s.semana_inicio + 7)
           ), 0) AS ventas,
           COALESCE((
             SELECT SUM(c.valor_total)
             FROM compra c
             WHERE c.estado = $3
               AND c.fecha_compra >= s.semana_inicio
               AND c.fecha_compra < (s.semana_inicio + 7)
           ), 0) AS compras
         FROM semanas s
         ORDER BY s.idx ASC`,
        [inicioSemana, ESTADO_VENTA, ESTADO_COMPRA_VALIDA]
      ),

      // 30. Rentabilidad del período seleccionado: ventas Entregadas menos compras Registradas
      query(
        `SELECT
           COALESCE((
             SELECT SUM(valor_total) FROM pedido
             WHERE estado = $1 AND COALESCE(fecha_entregado, fecha_pedido)::date BETWEEN $3::date AND $4::date
           ), 0) AS ventas_periodo,
           COALESCE((
             SELECT SUM(valor_total) FROM compra
             WHERE estado = $2 AND fecha_compra BETWEEN $3::date AND $4::date
           ), 0) AS compras_periodo`,
        [ESTADO_VENTA, ESTADO_COMPRA_VALIDA, desde, hasta]
      ),

      // 31. Top 5 clientes por volumen de pedidos no anulados en el período
      query(
        `SELECT
           c.id_cliente,
           c.nombre,
           COUNT(p.id_pedido) AS pedidos,
           COALESCE(SUM(p.valor_total), 0) AS monto_total
         FROM pedido p
         JOIN cliente c ON c.id_cliente = p.id_cliente
         WHERE p.estado <> $1
           AND p.fecha_pedido::date BETWEEN $2::date AND $3::date
         GROUP BY c.id_cliente, c.nombre
         ORDER BY pedidos DESC, monto_total DESC, c.id_cliente ASC
         LIMIT 5`,
        [ESTADO_ANULADO, desde, hasta]
      ),
    ]);

    // ─── Ensamblaje de métricas reales ───

    const vc = ventasComparativasRes.rows[0] || {};
    const ventasHoy = num(vc.ventas_hoy);
    const ventasAyer = num(vc.ventas_ayer);
    const ventasMesActual = num(vc.ventas_mes_actual);
    const ventasMesAnterior = num(vc.ventas_mes_anterior);
    const varDiaria = calcularVariacion(ventasHoy, ventasAyer);
    const varMensual = calcularVariacion(ventasMesActual, ventasMesAnterior);

    const pk = pedidosKpiRes.rows[0] || {};
    const pedidosProcesados = num(pk.pedidos_periodo);
    const pedidosPeriodoAnterior = num(pk.pedidos_periodo_anterior);
    const pedidosHoy = num(pk.pedidos_hoy);
    const pedidosAyer = num(pk.pedidos_ayer);
    const varPedidos = calcularVariacion(pedidosProcesados, pedidosPeriodoAnterior);

    const ck = clientesKpiRes.rows[0] || {};
    const clientesActivos = num(ck.total_activos);
    const clientesNuevosSemana = num(ck.nuevos_semana);

    const ik = insumosKpiRes.rows[0] || {};
    const insumosActivos = num(ik.total_activos);
    const insumosStockBajo = num(ik.total_stock_bajo);
    const insumosProximosVencer = num(ik.total_proximos_vencer);
    const insumosCambio = insumosActivos > 0
      ? round1(-((insumosStockBajo / insumosActivos) * 100))
      : 0;

    const prk = produccionKpiRes.rows[0] || {};
    const produccionDia = num(prk.produccion_hoy);
    const produccionAyer = num(prk.produccion_ayer);
    const varProduccion = calcularVariacion(produccionDia, produccionAyer);

    const sparklines = {
      ventas: sparklinesRes.rows.map((row) => num(row.ventas)),
      pedidos: sparklinesRes.rows.map((row) => num(row.pedidos)),
      insumos: sparklinesRes.rows.map((row) => num(row.compras)),
      produccion: sparklinesRes.rows.map((row) => num(row.produccion)),
    };

    // HU-133 y HU-134
    const ventasPorPeriodo = {
      diarias: ventasPorDiaRes.rows.map((row) => ({
        fecha: isoDate(row.dia),
        etiqueta: row.etiqueta,
        total: num(row.total),
        cantidad: num(row.cantidad),
      })),
      semanales: ventasPorSemanaRes.rows.map((row) => ({
        semanaInicio: isoDate(row.semana_inicio),
        etiqueta: row.etiqueta,
        total: num(row.total),
        cantidad: num(row.cantidad),
      })),
      mensuales: ventasPorMesRes.rows.map((row) => ({
        mes: row.mes,
        etiqueta: row.etiqueta,
        total: num(row.total),
        cantidad: num(row.cantidad),
      })),
    };

    const comprasPorPeriodo = {
      diarias: comprasPorDiaRes.rows.map((row) => ({
        fecha: isoDate(row.dia),
        etiqueta: row.etiqueta,
        total: num(row.total),
        cantidad: num(row.cantidad),
      })),
      semanales: comprasPorSemanaRes.rows.map((row) => ({
        semanaInicio: isoDate(row.semana_inicio),
        etiqueta: row.etiqueta,
        total: num(row.total),
        cantidad: num(row.cantidad),
      })),
      mensuales: comprasPorMesRes.rows.map((row) => ({
        mes: row.mes,
        etiqueta: row.etiqueta,
        total: num(row.total),
        cantidad: num(row.cantidad),
      })),
    };

    // HU-140 Ventas por día de la semana (Lun..Dom)
    const mapaDow = new Map(ventasDiaSemanaRes.rows.map((row) => [Number(row.dow), row]));
    const semanaActualArr = [];
    const semanaAnteriorArr = [];
    const porDia = [];
    for (let dow = 1; dow <= 7; dow++) {
      const fila = mapaDow.get(dow);
      const act = num(fila?.semana_actual);
      const ant = num(fila?.semana_anterior);
      semanaActualArr.push(act);
      semanaAnteriorArr.push(ant);
      porDia.push({ dia: DIAS_SEMANA_ETIQUETAS[dow - 1], semanaActual: act, semanaAnterior: ant });
    }
    const totalSemanaActual = semanaActualArr.reduce((acc, v) => acc + v, 0);
    const ventasSemanales = {
      total: round2(totalSemanaActual),
      promedioDiario: round2(totalSemanaActual / 7),
      dias: DIAS_SEMANA_ETIQUETAS,
      semanaActual: semanaActualArr,
      semanaAnterior: semanaAnteriorArr,
      porDia,
    };

    // HU-137 Últimas 5 ventas (Entregado)
    const ultimasVentas = ultimasVentasRes.rows.map((row) => ({
      id_venta: row.id_pedido,
      id_pedido: row.id_pedido,
      cliente: row.cliente_nombre,
      cliente_nombre: row.cliente_nombre,
      sede_nombre: row.sede_nombre,
      monto: num(row.monto),
      fecha: row.fecha_formato,
      hora: row.hora_formato,
      estado: row.estado_pago,
      info_corta: `${row.sede_nombre} • #${row.id_pedido}`,
    }));

    // HU-138 Productos más vendidos
    const productosMasVendidos = productosMasVendidosRes.rows.map((row) => ({
      id_producto: row.id_producto,
      nombre: row.nombre,
      cantidad: num(row.cantidad),
      monto: num(row.monto),
    }));

    // HU-139 y HU-141 Ventas por categoría + % participación
    const totalCategorias = ventasPorCategoriaRes.rows.reduce((acc, row) => acc + num(row.total), 0);
    const ventasPorCategoria = ventasPorCategoriaRes.rows.map((row) => {
      const total = num(row.total);
      return {
        id_categoria: row.id_categoria,
        categoria: row.categoria,
        cantidad: num(row.cantidad),
        total,
        porcentaje: totalCategorias > 0 ? round1((total / totalCategorias) * 100) : 0,
      };
    });

    // HU-142 Gasto acumulado mensual y HU-144 Compras año anterior vs vigente
    let acumulado = 0;
    let totalComprasAnioActual = 0;
    let totalComprasAnioAnterior = 0;
    const gastoAcumuladoMensual = [];
    const comprasAnualPorMes = [];
    for (const row of gastoMensualAnualRes.rows) {
      const mesNum = Number(row.mes_num);
      const montoActual = num(row.total_actual);
      const montoAnterior = num(row.total_anterior);
      acumulado = round2(acumulado + montoActual);
      totalComprasAnioActual = round2(totalComprasAnioActual + montoActual);
      totalComprasAnioAnterior = round2(totalComprasAnioAnterior + montoAnterior);
      const mesEtiqueta = MESES_ETIQUETAS[mesNum - 1];
      gastoAcumuladoMensual.push({
        mes: `${anioActual}-${String(mesNum).padStart(2, '0')}`,
        mesNumero: mesNum,
        etiqueta: mesEtiqueta,
        montoMensual: montoActual,
        acumulado,
      });
      comprasAnualPorMes.push({
        mesNumero: mesNum,
        etiqueta: mesEtiqueta,
        anioActual: montoActual,
        anioAnterior: montoAnterior,
      });
    }
    const varComprasAnual = calcularVariacion(totalComprasAnioActual, totalComprasAnioAnterior);
    const comparativaComprasAnual = {
      anioActual,
      anioAnterior,
      totalActual: totalComprasAnioActual,
      totalAnterior: totalComprasAnioAnterior,
      variacionPct: varComprasAnual.variacionPct,
      sinBaseAnterior: varComprasAnual.sinBaseAnterior,
      porMes: comprasAnualPorMes,
    };

    // HU-143 Top 5 proveedores por monto de compras
    const topProveedores = topProveedoresRes.rows.map((row) => ({
      id_proveedor: row.id_proveedor,
      nombre: row.nombre,
      montoTotal: num(row.monto_total),
      totalCompras: num(row.total_compras),
    }));

    // HU-145 Stock por categoría de insumo (agrupado por unidad_medida)
    const stockInsumosPorCategoria = {
      agrupadoPor: 'unidad_medida',
      nota: 'La tabla insumo no tiene columna de categoría en el esquema; se agrupa por unidad_medida (solo insumos activos).',
      items: stockInsumosAgrupadoRes.rows.map((row) => ({
        categoria: row.categoria,
        stockTotal: round2(row.stock_total),
        cantidadInsumos: num(row.cantidad_insumos),
        insumosBajoStock: num(row.insumos_bajo_stock),
      })),
    };

    // HU-146 Alertas de bajo stock
    const alertasStockBajo = alertasStockBajoRes.rows.map((row) => ({
      id_insumo: row.id_insumo,
      nombre: row.nombre,
      unidad_medida: row.unidad_medida,
      stock_actual: num(row.stock_actual),
      stock_minimo: num(row.stock_minimo),
      deficit: round2(row.deficit),
      proveedor_nombre: row.proveedor_nombre || null,
    }));

    // HU-147 Alertas de próximos a vencer
    const alertasProximosVencer = alertasProximosVencerRes.rows.map((row) => {
      const dias = Number(row.dias_restantes);
      return {
        id_insumo: row.id_insumo,
        nombre: row.nombre,
        unidad_medida: row.unidad_medida,
        stock_actual: num(row.stock_actual),
        fecha_vencimiento: row.fecha_formato,
        fecha_vencimiento_iso: isoDate(row.fecha_vencimiento),
        dias_restantes: dias,
        vencido: dias < 0,
      };
    });

    // Alertas unificadas para el bloque visual del dashboard
    const alertas = [];
    for (const item of alertasStockBajo) {
      alertas.push({
        id: `stock-${item.id_insumo}`,
        icono: 'package',
        titulo: `Stock bajo: ${item.nombre}`,
        detalle: `Disponible: ${item.stock_actual} ${item.unidad_medida} (mínimo: ${item.stock_minimo} ${item.unidad_medida})`,
        accion: 'Ver Insumos',
        path: '/admin/insumos',
        tono: 'terracota',
      });
    }
    for (const item of alertasProximosVencer) {
      const detalleVenc = item.dias_restantes < 0
        ? `Venció hace ${Math.abs(item.dias_restantes)} día(s) (${item.fecha_vencimiento})`
        : item.dias_restantes === 0
          ? `Vence hoy (${item.fecha_vencimiento})`
          : `Faltan ${item.dias_restantes} día(s) para vencer (${item.fecha_vencimiento})`;
      alertas.push({
        id: `venc-${item.id_insumo}`,
        icono: 'clock',
        titulo: item.dias_restantes < 0
          ? `Insumo vencido: ${item.nombre}`
          : `Próximo a vencer: ${item.nombre}`,
        detalle: detalleVenc,
        accion: 'Ver Insumos',
        path: '/admin/insumos',
        tono: 'maiz',
      });
    }
    for (const ped of pedidosRetrasadosRes.rows) {
      alertas.push({
        id: `ped-${ped.id_pedido}`,
        icono: 'clock',
        titulo: `Pedido #${ped.id_pedido} retrasado`,
        detalle: `${ped.cliente_nombre || 'Cliente'} · Entrega ${ped.fecha_entrega_formato} (${ped.estado})`,
        accion: 'Ver Pedido',
        path: '/admin/pedidos',
        tono: 'beige',
      });
    }

    // Insumos de rotación (tabla + top 3 destacados)
    const dias7 = sparklinesRes.rows.map((row) => isoDate(row.dia));
    const consumoPorInsumoDia = new Map();
    for (const row of consumoInsumos7dRes.rows) {
      const id = Number(row.id_insumo);
      if (!consumoPorInsumoDia.has(id)) consumoPorInsumoDia.set(id, new Map());
      consumoPorInsumoDia.get(id).set(isoDate(row.dia), num(row.consumido));
    }

    const insumosRotacion = insumosRotacionRes.rows.map((row) => {
      const stockActual = num(row.stock_actual);
      const stockMinimo = num(row.stock_minimo);
      const consumo30d = num(row.consumo_30d);
      const consumoDiario = consumo30d / 30;
      const rotacionDias = consumoDiario > 0 ? round1(stockActual / consumoDiario) : 0;
      const diasRestantes = row.dias_restantes === null ? null : Number(row.dias_restantes);

      let estado = 'optimo';
      if (stockActual < stockMinimo || (diasRestantes !== null && diasRestantes <= 0)) {
        estado = 'critico';
      } else if (
        (stockMinimo > 0 && stockActual <= stockMinimo * 1.25) ||
        (diasRestantes !== null && diasRestantes <= 15)
      ) {
        estado = 'atencion';
      }

      const consumo7d = num(row.consumo_7d);
      const consumo7dPrev = num(row.consumo_7d_prev);
      const varConsumo = calcularVariacion(consumo7d, consumo7dPrev);
      const mapaDias = consumoPorInsumoDia.get(Number(row.id_insumo)) || new Map();
      const tendencia = dias7.map((dia) => mapaDias.get(dia) || 0);

      return {
        id: `insumo-${row.id_insumo}`,
        id_insumo: row.id_insumo,
        insumo: row.nombre,
        nombre: row.nombre,
        rotacionDias,
        stock: `${stockActual} ${row.unidad_medida}`,
        stockActual,
        stockMinimo,
        unidadMedida: row.unidad_medida,
        estado,
        deltaPct: varConsumo.variacionPct,
        deltaAbs: `${stockActual} ${row.unidad_medida}`,
        tendencia,
      };
    });

    const featuredInsumos = insumosRotacion.slice(0, 3).map((ins) => ({
      id: ins.id,
      id_insumo: ins.id_insumo,
      nombre: ins.nombre,
      rotacionDias: ins.rotacionDias,
      deltaPct: ins.deltaPct,
      deltaAbs: ins.deltaAbs,
      tendencia: ins.tendencia,
    }));

    // Pedido activo prioritario
    const pedActRow = pedidoActivoRes.rows[0];
    const pedidoActivo = pedActRow
      ? {
          id: `#${pedActRow.id_pedido}`,
          id_pedido: pedActRow.id_pedido,
          cliente: pedActRow.cliente_nombre,
          sede: pedActRow.sede_nombre,
          estado: pedActRow.retrasado ? 'retrasado' : pedActRow.estado,
          unidades: num(pedActRow.unidades),
        }
      : null;

    // Funnel de pedidos por estado real (Pendiente -> En proceso -> Entregado, Anulado aparte)
    const fp = funnelPedidosRes.rows[0] || {};
    const funnelRaw = [
      { name: ESTADO_PENDIENTE, unidades: num(fp.pendiente) },
      { name: ESTADO_EN_PROCESO, unidades: num(fp.en_proceso) },
      { name: ESTADO_VENTA, unidades: num(fp.entregado) },
      { name: ESTADO_ANULADO, unidades: num(fp.anulado) },
    ];
    const maxActivoFunnel = Math.max(funnelRaw[0].unidades, funnelRaw[1].unidades, funnelRaw[2].unidades);
    const funnelPedidos = funnelRaw.map((stage, idx) => ({
      ...stage,
      current: idx < 3 && maxActivoFunnel > 0 && stage.unidades === maxActivoFunnel,
    }));

    // Producción por línea
    const maxProdLinea = produccionLineasRes.rows.reduce((m, row) => Math.max(m, num(row.unidades)), 0);
    const produccionLineas = produccionLineasRes.rows.map((row) => {
      const unidades = num(row.unidades);
      return {
        linea: row.linea,
        unidades,
        destacada: maxProdLinea > 0 && unidades === maxProdLinea,
      };
    });

    // Distribución de pedidos activos por sede
    let belloOriente = 0;
    let aranjuez = 0;
    const porSede = pedidosFlowRes.rows.map((row) => {
      const activos = num(row.activos);
      const nombreLower = String(row.sede_nombre || '').toLowerCase();
      if (nombreLower.includes('bello oriente')) belloOriente += activos;
      if (nombreLower.includes('aranjuez')) aranjuez += activos;
      return { id_sede: row.id_sede, sede: row.sede_nombre, activos };
    });
    const pedidosFlow = { belloOriente, aranjuez, porSede };

    // Rentabilidad: ventas Entregadas menos compras Registradas (sin inventar costo de producción)
    const rp = rentabilidadPeriodoRes.rows[0] || {};
    const ventasRentPeriodo = num(rp.ventas_periodo);
    const comprasRentPeriodo = num(rp.compras_periodo);
    const resultadoPeriodo = round2(ventasRentPeriodo - comprasRentPeriodo);
    const margenPeriodoPct = ventasRentPeriodo > 0
      ? round1((resultadoPeriodo / ventasRentPeriodo) * 100)
      : 0;

    const rentabilidadSemanas = rentabilidadSemanalRes.rows.map((row) => {
      const v = num(row.ventas);
      const c = num(row.compras);
      const resSemana = round2(v - c);
      const pct = v > 0 ? round1((resSemana / v) * 100) : 0;
      return {
        etiqueta: `S${row.idx}`,
        semanaInicio: isoDate(row.semana_inicio),
        ventas: v,
        compras: c,
        resultado: resSemana,
        margenPct: pct,
      };
    });
    const ultSem = rentabilidadSemanas[rentabilidadSemanas.length - 1];
    const prevSem = rentabilidadSemanas[rentabilidadSemanas.length - 2];
    const variacionPp = ultSem && prevSem ? round1(ultSem.margenPct - prevSem.margenPct) : 0;

    const rentabilidad = {
      ventasPeriodo: ventasRentPeriodo,
      comprasPeriodo: comprasRentPeriodo,
      resultadoPeriodo,
      margenPct: margenPeriodoPct,
      variacionPp,
      semanas: rentabilidadSemanas,
    };

    // Top Clientes (por volumen de pedidos no anulados en el período)
    const topClientes = topClientesRes.rows.map((row, idx) => {
      const pal = CLIENTE_PALETA[idx % CLIENTE_PALETA.length];
      return {
        id: row.id_cliente,
        iniciales: inicialesDe(row.nombre),
        nombre: row.nombre,
        pedidos: num(row.pedidos),
        montoTotal: num(row.monto_total),
        bg: pal.bg,
        fg: pal.fg,
      };
    });

    // Hallazgo clave generado dinámicamente desde datos reales (null si no hay datos)
    let hallazgoClave = null;
    if (alertasStockBajo.length > 0) {
      const topCritico = alertasStockBajo[0];
      hallazgoClave = {
        destacado: `${topCritico.nombre} está por debajo del stock mínimo (${topCritico.stock_actual} ${topCritico.unidad_medida} disponibles de ${topCritico.stock_minimo} ${topCritico.unidad_medida})`,
        detalle: `Actualmente hay ${alertasStockBajo.length} insumo(s) con bajo stock que requieren reposición.`,
      };
    } else if (ventasPorCategoria.length > 0) {
      const lider = ventasPorCategoria[0];
      hallazgoClave = {
        destacado: `${lider.categoria} lidera las ventas en ${periodo.etiqueta.toLowerCase()} con $${Math.round(lider.total).toLocaleString('es-CO')}`,
        detalle: `Representa el ${lider.porcentaje}% de los pedidos entregados en el período.`,
      };
    } else if (ventasMesActual > 0 || ventasMesAnterior > 0) {
      const signo = varMensual.variacionPct >= 0 ? '+' : '';
      hallazgoClave = {
        destacado: `Las ventas del mes actual suman $${Math.round(ventasMesActual).toLocaleString('es-CO')}`,
        detalle: `Variación de ${signo}${varMensual.variacionPct}% frente al mes anterior (solo pedidos entregados).`,
      };
    }

    const ahora = new Date();
    const signoDiaria = varDiaria.variacionPct >= 0 ? '+' : '';
    const diffPedidosHoy = pedidosHoy - pedidosAyer;

    const resultado = {
      periodo: {
        clave: periodo.clave,
        etiqueta: periodo.etiqueta,
        desde,
        hasta,
      },
      generadoEn: ahora.toISOString(),
      fechaGeneracion: formatearFechaHoraBogota(ahora),
      kpis: {
        // Campos que consume DashboardKpis.jsx
        ventasHoy,
        ventasAyer,
        ventasHoyCambio: varDiaria.variacionPct,
        pedidosProcesados,
        pedidosCambio: varPedidos.variacionPct,
        insumosActivos,
        insumosStockBajo,
        insumosProximosVencer,
        insumosCambio,
        produccionDia,
        produccionAyer,
        produccionCambio: varProduccion.variacionPct,
        sparklines,
        // Compatibilidad con el contrato previo de getSummary()
        ventasDelDia: {
          titulo: 'Ventas del Día',
          valor: ventasHoy,
          cambio: `${signoDiaria}${varDiaria.variacionPct}% vs. ayer`,
          positivo: varDiaria.variacionPct >= 0,
        },
        pedidosHoy: {
          titulo: 'Pedidos Hoy',
          valor: pedidosHoy,
          cambio: `${diffPedidosHoy >= 0 ? '+' : ''}${diffPedidosHoy} vs. ayer`,
          positivo: diffPedidosHoy >= 0,
        },
        clientesActivos: {
          titulo: 'Clientes Activos',
          valor: clientesActivos,
          cambio: `+${clientesNuevosSemana} esta semana`,
          positivo: true,
        },
        stockBajo: {
          titulo: 'Stock Bajo',
          valor: insumosStockBajo,
          cambio: `${insumosStockBajo} insumo(s) crítico(s)`,
          positivo: insumosStockBajo === 0,
        },
      },
      // Indicadores HU-133 a HU-147
      ventasPorPeriodo,
      comprasPorPeriodo,
      comparativaDiaria: {
        hoy: ventasHoy,
        ayer: ventasAyer,
        variacionPct: varDiaria.variacionPct,
        sinBaseAnterior: varDiaria.sinBaseAnterior,
      },
      comparativaMensual: {
        mesActual: ventasMesActual,
        mesAnterior: ventasMesAnterior,
        variacionPct: varMensual.variacionPct,
        sinBaseAnterior: varMensual.sinBaseAnterior,
      },
      ultimasVentas,
      pedidosRecientes: ultimasVentas,
      productosMasVendidos,
      ventasPorCategoria,
      ventasSemanales,
      gastoAcumuladoMensual,
      topProveedores,
      comparativaComprasAnual,
      stockInsumosPorCategoria,
      alertasStockBajo,
      alertasProximosVencer,
      // Bloques consumidos por la UI actual del Dashboard
      featuredInsumos,
      pedidoActivo,
      funnelPedidos,
      produccionLineas,
      pedidosFlow,
      insumosRotacion,
      hallazgoClave,
      rentabilidad,
      topClientes,
      alertas,
    };

    guardarCacheDashboard(cacheKey, resultado);
    return resultado;
  }
}
