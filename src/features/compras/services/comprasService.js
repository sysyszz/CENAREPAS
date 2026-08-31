// comprasService.js - Servicio para la gestión de compras en Masarepas
export let mockCompras = [
  {
    id_compra: 1, id_proveedor: 1, id_usuario: 3, fecha_compra: "2024-03-10",
    valor_total: 14500000, medio_pago: "transferencia", comprobante_url: null,
    estado: "activo", fecha_registro: "2024-03-10T00:00:00",
  },
  {
    id_compra: 2, id_proveedor: 2, id_usuario: 3, fecha_compra: "2024-03-12",
    valor_total: 11000000, medio_pago: "transferencia", comprobante_url: null,
    estado: "activo", fecha_registro: "2024-03-12T00:00:00",
  },
];

export const getCompras = async () => {
  return [...mockCompras];
};

export const mockDetallesCompra = [
  { id_detalle_compra: 1, id_compra: 1, id_insumo: 1, cantidad: 100, valor_unitario: 145000, subtotal: 14500000 },
  { id_detalle_compra: 2, id_compra: 2, id_insumo: 3, cantidad: 50, valor_unitario: 220000, subtotal: 11000000 },
];

export const createCompra = async (compra) => {
  const newObj = { id_compra: Date.now(), ...compra };
  mockCompras = [newObj, ...mockCompras];
  return newObj;
};

export const updateCompra = async (id_compra, compra) => {
  mockCompras = mockCompras.map((c) => (c.id_compra === id_compra ? { ...c, ...compra } : c));
  return { id_compra, ...compra };
};

export const anularCompra = async (id_compra) => {
  mockCompras = mockCompras.map((c) => (c.id_compra === id_compra ? { ...c, estado: 'Anulada' } : c));
  return true;
};
