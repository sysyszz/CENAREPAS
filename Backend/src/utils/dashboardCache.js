/**
 * Caché corto en memoria para las consultas agregadas del dashboard.
 * Se invalida automáticamente al expirar el TTL (15 s) o al ocurrir
 * mutaciones en pedidos/ventas, compras, insumos o producción.
 */
const DEFAULT_TTL_MS = 15_000;
const store = new Map();

export function obtenerCacheDashboard(clave) {
  const entry = store.get(clave);
  if (!entry) return null;
  if (Date.now() > entry.expira) {
    store.delete(clave);
    return null;
  }
  return entry.valor;
}

export function guardarCacheDashboard(clave, valor, ttlMs = DEFAULT_TTL_MS) {
  store.set(clave, { valor, expira: Date.now() + ttlMs });
}

export function invalidarCacheDashboard() {
  store.clear();
}
