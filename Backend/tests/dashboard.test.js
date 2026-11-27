// Pruebas del Dashboard (HU-133 a HU-149):
// - Permisos por rol intactos (Admin/Secretaria 200, Vendedor 403, sin token 401).
// - Cálculo de variación con denominador 0 (sin NaN ni Infinity).
// - Pedido Pendiente o En proceso NO suma como venta; Entregado SÍ suma; venta Anulada NO suma.
// - Compra Registrada SÍ suma; compra Anulada NO suma.
// - Alertas de insumos con bajo stock (stock_actual < stock_minimo) y próximos a vencer (días restantes);
//   insumos inactivos se ignoran por completo.
// - Estructura completa y ausencia de valores mock/hardcodeados.
//
// Corre contra el backend de Staging en marcha (npm run dev:staging):
//   npm run test:staging

import { after, before, test } from 'node:test';
import assert from 'node:assert/strict';
import { api, login, unico } from './helpers/api.js';
import { calcularVariacion } from '../src/services/dashboard.service.js';

let admin;
let secretaria;
let vendedor;
let clienteActivo;
let productoActivo;
let sedeActiva;
let proveedorActivo;
let insumoCompra;

const insumosCreados = [];

function fechaMasDiasBogota(dias) {
  const d = new Date(Date.now() + dias * 86400000);
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Bogota',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(d);
  return parts;
}

before(async () => {
  admin = await login('admin@staging.test');
  secretaria = await login('secretaria@staging.test');
  vendedor = await login('vendedor@staging.test');

  const [clRes, prRes, seRes, pvRes, inRes] = await Promise.all([
    api(admin, 'GET', '/clientes'),
    api(admin, 'GET', '/productos'),
    api(admin, 'GET', '/sedes'),
    api(admin, 'GET', '/proveedores'),
    api(admin, 'GET', '/insumos'),
  ]);

  assert.equal(clRes.status, 200);
  assert.equal(prRes.status, 200);
  assert.equal(seRes.status, 200);
  assert.equal(pvRes.status, 200);
  assert.equal(inRes.status, 200);

  clienteActivo = clRes.body.data.find((c) => c.estado === 'Activo');
  productoActivo = prRes.body.data.find((p) => p.estado === 'Activo' && Number(p.stock_actual) >= 2 && Number(p.precio_venta) > 0);
  sedeActiva = seRes.body.data.find((s) => s.estado === 'Activo');
  proveedorActivo = pvRes.body.data.find((p) => p.estado === 'Activo');
  insumoCompra = inRes.body.data.find((i) => i.estado === 'Activo');

  assert.ok(clienteActivo, 'hace falta al menos un cliente activo en Staging');
  assert.ok(productoActivo, 'hace falta al menos un producto activo con stock >= 2 en Staging');
  assert.ok(sedeActiva, 'hace falta al menos una sede activa en Staging');
  assert.ok(proveedorActivo, 'hace falta al menos un proveedor activo en Staging');
  assert.ok(insumoCompra, 'hace falta al menos un insumo activo en Staging');
});

after(async () => {
  for (const idInsumo of insumosCreados) {
    await api(admin, 'PATCH', `/insumos/${idInsumo}/estado`, { estado: 'Inactivo' }).catch(() => {});
  }
});

test('calcularVariacion maneja división por cero sin NaN ni Infinity', () => {
  const ceroCero = calcularVariacion(0, 0);
  assert.equal(ceroCero.variacionPct, 0);
  assert.equal(ceroCero.sinBaseAnterior, false);
  assert.ok(Number.isFinite(ceroCero.variacionPct));

  const positivoCero = calcularVariacion(250000, 0);
  assert.equal(positivoCero.variacionPct, 100);
  assert.equal(positivoCero.sinBaseAnterior, true);
  assert.ok(Number.isFinite(positivoCero.variacionPct));

  const bajaTotal = calcularVariacion(0, 100000);
  assert.equal(bajaTotal.variacionPct, -100);
  assert.equal(bajaTotal.sinBaseAnterior, false);

  const alza = calcularVariacion(150000, 100000);
  assert.equal(alza.variacionPct, 50);
  assert.equal(alza.sinBaseAnterior, false);
});

test('permisos del dashboard intactos: Admin y Secretaria 200, Vendedor 403, sin token 401', async () => {
  const sinToken = await api(null, 'GET', '/dashboard');
  assert.equal(sinToken.status, 401);

  const resAdmin = await api(admin, 'GET', '/dashboard');
  assert.equal(resAdmin.status, 200, JSON.stringify(resAdmin.body));

  const resSec = await api(secretaria, 'GET', '/dashboard');
  assert.equal(resSec.status, 200, JSON.stringify(resSec.body));

  const resVend = await api(vendedor, 'GET', '/dashboard');
  assert.equal(resVend.status, 403, JSON.stringify(resVend.body));

  const resMetrics = await api(admin, 'GET', '/dashboard/metrics?periodo=mes');
  assert.equal(resMetrics.status, 200);
  assert.equal(resMetrics.body.data.periodo.clave, 'mes');

  const resCharts = await api(admin, 'GET', '/dashboard/charts?periodo=anio');
  assert.equal(resCharts.status, 200);
  assert.equal(resCharts.body.data.periodo.clave, 'anio');
  assert.equal(resCharts.body.data.stockInsumosPorCategoria.agrupadoPor, 'unidad_medida');
});

test('pedido Pendiente/En proceso NO suma, Entregado SÍ suma y venta Anulada NO suma', async () => {
  const baseRes = await api(admin, 'GET', '/dashboard?periodo=semana');
  assert.equal(baseRes.status, 200);
  const base = baseRes.body.data;

  const ventasHoyBase = Number(base.kpis.ventasHoy);
  const mesActualBase = Number(base.comparativaMensual.mesActual);
  const semanaTotalBase = Number(base.ventasSemanales.total);

  // 1. Crear pedido Pendiente
  const creado = await api(admin, 'POST', '/pedidos', {
    id_cliente: clienteActivo.id_cliente,
    id_sede: sedeActiva.id_sede,
    fecha_entrega: fechaMasDiasBogota(0),
    medio_pago: 'Efectivo',
    detalles: [{ id_producto: productoActivo.id_producto, cantidad: 1 }],
  });
  assert.equal(creado.status, 201, JSON.stringify(creado.body));
  const pedido = creado.body.data;
  const monto = Number(pedido.valor_total);
  assert.ok(monto > 0, 'el pedido debe tener valor_total > 0');

  // 2. Pedido Pendiente NO suma en ventas
  const trasPendiente = (await api(admin, 'GET', '/dashboard?periodo=semana')).body.data;
  assert.equal(Number(trasPendiente.kpis.ventasHoy), ventasHoyBase);
  assert.equal(Number(trasPendiente.comparativaMensual.mesActual), mesActualBase);
  assert.equal(Number(trasPendiente.ventasSemanales.total), semanaTotalBase);

  // 3. Pasar a En proceso → tampoco suma en ventas
  const enProceso = await api(admin, 'PATCH', `/pedidos/${pedido.id_pedido}/estado`, { estado: 'En proceso' });
  assert.equal(enProceso.status, 200, JSON.stringify(enProceso.body));

  const trasProceso = (await api(admin, 'GET', '/dashboard?periodo=semana')).body.data;
  assert.equal(Number(trasProceso.kpis.ventasHoy), ventasHoyBase);
  assert.equal(Number(trasProceso.ventasSemanales.total), semanaTotalBase);

  // 4. Pasar a Entregado → SÍ suma como venta en todos los indicadores y aparece en últimas 5 ventas
  const entregado = await api(admin, 'PATCH', `/pedidos/${pedido.id_pedido}/estado`, { estado: 'Entregado' });
  assert.equal(entregado.status, 200, JSON.stringify(entregado.body));

  const trasEntregado = (await api(admin, 'GET', '/dashboard?periodo=semana')).body.data;
  assert.equal(Number(trasEntregado.kpis.ventasHoy), ventasHoyBase + monto);
  assert.equal(Number(trasEntregado.comparativaDiaria.hoy), ventasHoyBase + monto);
  assert.equal(Number(trasEntregado.comparativaMensual.mesActual), mesActualBase + monto);
  assert.equal(Number(trasEntregado.ventasSemanales.total), semanaTotalBase + monto);

  const ventaReciente = trasEntregado.ultimasVentas.find((v) => Number(v.id_pedido) === Number(pedido.id_pedido));
  assert.ok(ventaReciente, 'el pedido Entregado debe aparecer en ultimasVentas (HU-137)');
  assert.equal(Number(ventaReciente.monto), monto);
  assert.ok(ventaReciente.hora, 'ultimasVentas debe incluir hora');

  const prodTop = trasEntregado.productosMasVendidos.find((p) => Number(p.id_producto) === Number(productoActivo.id_producto));
  assert.ok(prodTop && Number(prodTop.cantidad) >= 1, 'el producto vendido debe aparecer en productosMasVendidos');

  assert.ok(trasEntregado.ventasPorCategoria.length > 0, 'debe haber ventasPorCategoria');
  const sumaPct = trasEntregado.ventasPorCategoria.reduce((acc, c) => acc + Number(c.porcentaje), 0);
  assert.ok(sumaPct >= 99 && sumaPct <= 101, `los porcentajes por categoría deben sumar ~100% (fue ${sumaPct})`);

  // 5. Anular la venta → deja de sumar en todos los totales y sale de ultimasVentas
  const anulada = await api(admin, 'POST', `/ventas/${pedido.id_pedido}/anular`, {
    motivo: 'Prueba automatizada dashboard anulacion de venta',
  });
  assert.equal(anulada.status, 200, JSON.stringify(anulada.body));

  const trasAnular = (await api(admin, 'GET', '/dashboard?periodo=semana')).body.data;
  assert.equal(Number(trasAnular.kpis.ventasHoy), ventasHoyBase);
  assert.equal(Number(trasAnular.comparativaDiaria.hoy), ventasHoyBase);
  assert.equal(Number(trasAnular.comparativaMensual.mesActual), mesActualBase);
  assert.equal(Number(trasAnular.ventasSemanales.total), semanaTotalBase);
  assert.equal(
    trasAnular.ultimasVentas.some((v) => Number(v.id_pedido) === Number(pedido.id_pedido)),
    false,
    'una venta Anulada no debe aparecer en ultimasVentas'
  );
});

test('compra Registrada suma en indicadores de compras y compra Anulada NO suma', async () => {
  const base = (await api(admin, 'GET', '/dashboard?periodo=anio')).body.data;
  const totalAnualBase = Number(base.comparativaComprasAnual.totalActual);
  const montoCompra = 17500;

  // 1. Registrar compra
  const creada = await api(admin, 'POST', '/compras', {
    id_proveedor: proveedorActivo.id_proveedor,
    fecha_compra: fechaMasDiasBogota(0),
    valor_total: montoCompra,
    medio_pago: 'Efectivo',
    estado: 'Registrada',
    detalles: [
      { id_insumo: insumoCompra.id_insumo, cantidad: 1, valor_unitario: montoCompra, subtotal: montoCompra },
    ],
  });
  assert.equal(creada.status, 201, JSON.stringify(creada.body));
  const compra = creada.body.data;

  const trasCrear = (await api(admin, 'GET', '/dashboard?periodo=anio')).body.data;
  assert.equal(Number(trasCrear.comparativaComprasAnual.totalActual), totalAnualBase + montoCompra);
  const ultimoAcumulado = trasCrear.gastoAcumuladoMensual[trasCrear.gastoAcumuladoMensual.length - 1]?.acumulado;
  assert.equal(Number(ultimoAcumulado), totalAnualBase + montoCompra);

  // 2. Anular compra → NO debe sumar
  const anulada = await api(admin, 'DELETE', `/compras/${compra.id_compra}`);
  assert.equal(anulada.status, 200, JSON.stringify(anulada.body));

  const trasAnular = (await api(admin, 'GET', '/dashboard?periodo=anio')).body.data;
  assert.equal(Number(trasAnular.comparativaComprasAnual.totalActual), totalAnualBase);
});

test('alertas detectan insumos activos con bajo stock y próximos a vencer, ignorando inactivos', async () => {
  const sufijo = unico();
  const venceEn5Dias = fechaMasDiasBogota(5);

  // Insumo activo en bajo stock (2 < 10) y próximo a vencer (+5 días)
  const insActivoRes = await api(admin, 'POST', '/insumos', {
    nombre: `PRUEBA - Dash Insumo Critico ${sufijo}`,
    unidad_medida: 'kg',
    stock_actual: 2,
    stock_minimo: 10,
    fecha_vencimiento: venceEn5Dias,
    id_proveedor: proveedorActivo.id_proveedor,
    estado: 'Activo',
  });
  assert.equal(insActivoRes.status, 201, JSON.stringify(insActivoRes.body));
  const insActivo = insActivoRes.body.data;
  insumosCreados.push(insActivo.id_insumo);

  // Insumo inactivo con bajo stock (0 < 20) y vencimiento próximo (+3 días) → debe ser ignorado
  const insInactivoRes = await api(admin, 'POST', '/insumos', {
    nombre: `PRUEBA - Dash Insumo Inactivo ${sufijo}`,
    unidad_medida: 'kg',
    stock_actual: 0,
    stock_minimo: 20,
    fecha_vencimiento: fechaMasDiasBogota(3),
    id_proveedor: proveedorActivo.id_proveedor,
    estado: 'Inactivo',
  });
  assert.equal(insInactivoRes.status, 201, JSON.stringify(insInactivoRes.body));
  const insInactivo = insInactivoRes.body.data;
  insumosCreados.push(insInactivo.id_insumo);

  const dash = (await api(admin, 'GET', '/dashboard')).body.data;

  const alertaBajo = dash.alertasStockBajo.find((a) => Number(a.id_insumo) === Number(insActivo.id_insumo));
  assert.ok(alertaBajo, 'el insumo activo con stock_actual < stock_minimo debe aparecer en alertasStockBajo');
  assert.equal(Number(alertaBajo.deficit), 8);

  const alertaVenc = dash.alertasProximosVencer.find((a) => Number(a.id_insumo) === Number(insActivo.id_insumo));
  assert.ok(alertaVenc, 'el insumo activo próximo a vencer debe aparecer en alertasProximosVencer');
  assert.equal(Number(alertaVenc.dias_restantes), 5);
  assert.match(alertaVenc.fecha_vencimiento, /^\d{2}\/\d{2}\/\d{4}$/, 'la fecha debe venir en formato DD/MM/YYYY');

  assert.equal(
    dash.alertasStockBajo.some((a) => Number(a.id_insumo) === Number(insInactivo.id_insumo)),
    false,
    'un insumo inactivo NO debe aparecer en alertasStockBajo'
  );
  assert.equal(
    dash.alertasProximosVencer.some((a) => Number(a.id_insumo) === Number(insInactivo.id_insumo)),
    false,
    'un insumo inactivo NO debe aparecer en alertasProximosVencer'
  );
  assert.ok(
    dash.alertas.some((a) => a.id === `stock-${insActivo.id_insumo}`) &&
      dash.alertas.some((a) => a.id === `venc-${insActivo.id_insumo}`),
    'las alertas unificadas del dashboard deben incluir bajo stock y próximo vencimiento del insumo activo'
  );
});
