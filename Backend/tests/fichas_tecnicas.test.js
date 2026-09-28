// GET /fichas-tecnicas/:id devuelve los insumos igual que el listado
// con las mismas propiedades estándar (nombre, cantidad y unidad),
// audita el acceso a la receta (Opción D) y respeta permisos por rol.
//
// Corre contra el backend de Staging en marcha (npm run dev:staging):
//   npm run test:staging

import { before, test } from 'node:test';
import assert from 'node:assert/strict';

const BASE = process.env.API_URL || 'http://localhost:4000/api/v1';

async function login(correo) {
  const res = await fetch(`${BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ correo, contrasena: 'Staging123*' }),
  });
  assert.equal(res.status, 200, `login de ${correo}`);
  return (await res.json()).data.token;
}

async function api(token, metodo, ruta, cuerpo) {
  const res = await fetch(`${BASE}${ruta}`, {
    method: metodo,
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: cuerpo === undefined ? undefined : JSON.stringify(cuerpo),
  });
  return { status: res.status, body: await res.json() };
}

let vendedor;
let fichas;

before(async () => {
  vendedor = await login('vendedor@staging.test');
  const { status, body } = await api(vendedor, 'GET', '/fichas-tecnicas');
  assert.equal(status, 200);
  fichas = body.data;
  assert.ok(fichas.some((f) => f.insumos.length > 0), 'hace falta al menos una ficha con insumos en Staging');
});

test('el detalle trae los mismos insumos que el listado general con idéntica estructura', async () => {
  for (const ficha of fichas) {
    const { status, body } = await api(vendedor, 'GET', `/fichas-tecnicas/${ficha.id_ficha}`);
    assert.equal(status, 200, `ficha ${ficha.id_ficha}`);
    assert.equal(body.data.nombre, ficha.nombre);
    assert.deepEqual(body.data.insumos, ficha.insumos, `insumos de la ficha ${ficha.id_ficha}`);
  }
});

test('cada insumo en GET /fichas-tecnicas/:id tiene explícitamente nombre, cantidad y unidad', async () => {
  const conInsumos = fichas.find((f) => f.insumos.length > 0);
  const { status, body } = await api(vendedor, 'GET', `/fichas-tecnicas/${conInsumos.id_ficha}`);
  assert.equal(status, 200);
  assert.ok(Array.isArray(body.data.insumos), 'insumos debe ser un arreglo');
  assert.ok(body.data.insumos.length > 0, 'debe tener insumos');

  for (const insumo of body.data.insumos) {
    assert.ok(insumo.nombre, 'el insumo debe tener propiedad nombre');
    assert.ok(insumo.cantidad !== undefined && insumo.cantidad !== null, 'el insumo debe tener propiedad cantidad');
    assert.ok(Number(insumo.cantidad) > 0, 'cantidad debe ser numérica positiva');
    assert.ok(insumo.unidad, 'el insumo debe tener propiedad unidad');
    assert.ok(insumo.insumo_nombre, 'mantiene insumo_nombre por compatibilidad');
    assert.ok(insumo.unidad_medida, 'mantiene unidad_medida por compatibilidad');
  }
});

test('Opción D: GET /fichas-tecnicas/:id registra auditoría de acceso', async () => {
  const ficha = fichas[0];
  const { status: getStatus } = await api(vendedor, 'GET', `/fichas-tecnicas/${ficha.id_ficha}`);
  assert.equal(getStatus, 200);

  // Dar tiempo al microtask asíncrono
  await new Promise((r) => setTimeout(r, 100));

  const { status: auditStatus, body: auditBody } = await api(vendedor, 'GET', `/fichas-tecnicas/${ficha.id_ficha}/auditoria`);
  assert.equal(auditStatus, 200);
  assert.ok(Array.isArray(auditBody.data), 'el historial de auditoría debe ser un array');
  assert.ok(auditBody.data.length > 0, 'debe registrar al menos un evento de auditoría de acceso');
  
  const ultimoAcceso = auditBody.data[0];
  assert.equal(Number(ultimoAcceso.id_ficha), Number(ficha.id_ficha));
  assert.ok(ultimoAcceso.fecha_acceso, 'debe registrar fecha_acceso');
  assert.ok(ultimoAcceso.detalle, 'debe registrar detalle del acceso');
});

test('ficha inexistente -> 404', async () => {
  const { status } = await api(vendedor, 'GET', '/fichas-tecnicas/999999');
  assert.equal(status, 404);
});

test('el Vendedor solo ve: crear y editar -> 403', async () => {
  const id = fichas[0].id_ficha;
  assert.equal((await api(vendedor, 'POST', '/fichas-tecnicas', { nombre: 'No se crea' })).status, 403);
  assert.equal((await api(vendedor, 'PUT', `/fichas-tecnicas/${id}`, { nombre: 'No se edita' })).status, 403);
});