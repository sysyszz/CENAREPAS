// Reglas de Proveedores, Compras e Insumos:
// - Proveedor con compras asociadas no se puede eliminar (409).
// - Compra solo admite estados Registrada o Anulada (y nueva solo Registrada).
// - Crear compra suma en insumo.stock_actual; editar detalles aplica el delta;
//   anular descuenta el stock sumado (dejando el stock del insumo igual que al inicio)
//   y bloquea modificaciones/reactivaciones posteriores (409).
//
// Corre contra el backend de Staging en marcha (npm run dev:staging):
//   npm run test:staging

import { before, test } from 'node:test';
import assert from 'node:assert/strict';
import { api, login } from './helpers/api.js';

let admin;
let proveedorConCompra;
let insumoPrueba;

before(async () => {
  admin = await login('admin@staging.test');

  const { status: sc, body: bc } = await api(admin, 'GET', '/compras');
  assert.equal(sc, 200, JSON.stringify(bc));
  assert.ok(Array.isArray(bc.data), 'GET /compras debe devolver un arreglo');

  const { status: sp, body: bp } = await api(admin, 'GET', '/proveedores');
  assert.equal(sp, 200, JSON.stringify(bp));
  const idsConCompra = new Set(bc.data.map((c) => Number(c.id_proveedor)));
  proveedorConCompra = bp.data.find((p) => idsConCompra.has(Number(p.id_proveedor))) || bp.data[0];
  assert.ok(proveedorConCompra, 'hace falta al menos un proveedor en Staging');

  const { status: si, body: bi } = await api(admin, 'GET', '/insumos');
  assert.equal(si, 200, JSON.stringify(bi));
  insumoPrueba = bi.data.find((i) => String(i.estado).toLowerCase() === 'activo') || bi.data[0];
  assert.ok(insumoPrueba, 'hace falta al menos un insumo en Staging');
});

test('POST /compras rechaza estados inválidos o crear directamente como Anulada (400)', async () => {
  for (const estadoInvalido of ['Pendiente', 'Completada', 'Anulada']) {
    const res = await api(admin, 'POST', '/compras', {
      id_proveedor: proveedorConCompra.id_proveedor,
      valor_total: 1000,
      medio_pago: 'Efectivo',
      estado: estadoInvalido,
      detalles: [
        { id_insumo: insumoPrueba.id_insumo, cantidad: 1, valor_unitario: 1000, subtotal: 1000 },
      ],
    });
    assert.equal(res.status, 400, `estado ${estadoInvalido}: ${JSON.stringify(res.body)}`);
  }
});

test('crear compra suma stock, editar ajusta delta, anular descuenta stock y bloquea cambios posteriores', async () => {
  const antesRes = await api(admin, 'GET', `/insumos/${insumoPrueba.id_insumo}`);
  assert.equal(antesRes.status, 200);
  const stockInicial = Number(antesRes.body.data.stock_actual);

  // 1. Crear compra (+5)
  const creada = await api(admin, 'POST', '/compras', {
    id_proveedor: proveedorConCompra.id_proveedor,
    valor_total: 5000,
    medio_pago: 'Transferencia',
    estado: 'Registrada',
    detalles: [
      { id_insumo: insumoPrueba.id_insumo, cantidad: 5, valor_unitario: 1000, subtotal: 5000 },
    ],
  });
  assert.equal(creada.status, 201, JSON.stringify(creada.body));
  const compra = creada.body.data;
  assert.equal(compra.estado, 'Registrada');
  assert.ok(compra.proveedor_nombre, 'la compra creada devuelve proveedor_nombre');
  assert.equal(compra.detalles.length, 1);

  const trasCrear = await api(admin, 'GET', `/insumos/${insumoPrueba.id_insumo}`);
  assert.equal(Number(trasCrear.body.data.stock_actual), stockInicial + 5);

  // 2. Proveedor conectado a la compra no se puede eliminar (409)
  const delProv = await api(admin, 'DELETE', `/proveedores/${proveedorConCompra.id_proveedor}`);
  assert.equal(delProv.status, 409, JSON.stringify(delProv.body));
  assert.equal(
    delProv.body.message,
    'Este proveedor tiene compras asociadas; no se puede eliminar, puedes inactivarlo.'
  );

  // 3. PUT con estado inválido → 400
  const estadoMalo = await api(admin, 'PUT', `/compras/${compra.id_compra}`, { estado: 'Pendiente' });
  assert.equal(estadoMalo.status, 400, JSON.stringify(estadoMalo.body));

  // 4. Editar cantidad de 5 a 8 → suma delta +3 (total +8)
  const editada = await api(admin, 'PUT', `/compras/${compra.id_compra}`, {
    valor_total: 8000,
    detalles: [
      { id_insumo: insumoPrueba.id_insumo, cantidad: 8, valor_unitario: 1000, subtotal: 8000 },
    ],
  });
  assert.equal(editada.status, 200, JSON.stringify(editada.body));
  const trasEditar = await api(admin, 'GET', `/insumos/${insumoPrueba.id_insumo}`);
  assert.equal(Number(trasEditar.body.data.stock_actual), stockInicial + 8);

  // 5. Anular compra → descuenta los 8 y deja el stock exactamente en stockInicial
  const anulada = await api(admin, 'DELETE', `/compras/${compra.id_compra}`);
  assert.equal(anulada.status, 200, JSON.stringify(anulada.body));
  const trasAnular = await api(admin, 'GET', `/insumos/${insumoPrueba.id_insumo}`);
  assert.equal(Number(trasAnular.body.data.stock_actual), stockInicial);

  // 6. Compra ya Anulada no se puede reactivar, editar ni volver a anular (409)
  const reactivar = await api(admin, 'PUT', `/compras/${compra.id_compra}`, { estado: 'Registrada' });
  assert.equal(reactivar.status, 409, JSON.stringify(reactivar.body));

  const reAnular = await api(admin, 'DELETE', `/compras/${compra.id_compra}`);
  assert.equal(reAnular.status, 409, JSON.stringify(reAnular.body));
});
