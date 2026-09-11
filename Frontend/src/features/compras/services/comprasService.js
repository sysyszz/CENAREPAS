// comprasService.js - Servicio para la gestión de compras en Masarepas
export let mockCompras = [
  {
    id_compra: 1,
    id_proveedor: 1,
    id_usuario: 3,
    fecha_compra: "2026-08-25",
    valor_total: 4500000,
    medio_pago: "transferencia",
    comprobante_url: "https://facturacion.masarepas.com/comprobantes/compra-001.pdf",
    estado: "recibida",
    fecha_registro: "2026-08-25T08:30:00",
  },
  {
    id_compra: 2,
    id_proveedor: 2,
    id_usuario: 3,
    fecha_compra: "2026-08-28",
    valor_total: 3600000,
    medio_pago: "transferencia",
    comprobante_url: "https://facturacion.masarepas.com/comprobantes/compra-002.pdf",
    estado: "recibida",
    fecha_registro: "2026-08-28T10:15:00",
  },
  {
    id_compra: 3,
    id_proveedor: 3,
    id_usuario: 10,
    fecha_compra: "2026-09-01",
    valor_total: 1850000,
    medio_pago: "credito",
    comprobante_url: null,
    estado: "recibida",
    fecha_registro: "2026-09-01T09:00:00",
  },
  {
    id_compra: 4,
    id_proveedor: 4,
    id_usuario: 3,
    fecha_compra: "2026-09-02",
    valor_total: 2800000,
    medio_pago: "transferencia",
    comprobante_url: "https://facturacion.masarepas.com/comprobantes/compra-004.pdf",
    estado: "recibida",
    fecha_registro: "2026-09-02T11:45:00",
  },
  {
    id_compra: 5,
    id_proveedor: 8,
    id_usuario: 10,
    fecha_compra: "2026-09-04",
    valor_total: 1400000,
    medio_pago: "efectivo",
    comprobante_url: null,
    estado: "recibida",
    fecha_registro: "2026-09-04T14:20:00",
  },
  {
    id_compra: 6,
    id_proveedor: 10,
    id_usuario: 3,
    fecha_compra: "2026-09-05",
    valor_total: 950000,
    medio_pago: "transferencia",
    comprobante_url: "https://facturacion.masarepas.com/comprobantes/compra-006.pdf",
    estado: "recibida",
    fecha_registro: "2026-09-05T08:00:00",
  },
  {
    id_compra: 7,
    id_proveedor: 1,
    id_usuario: 3,
    fecha_compra: "2026-09-06",
    valor_total: 5200000,
    medio_pago: "transferencia",
    comprobante_url: "https://facturacion.masarepas.com/comprobantes/compra-007.pdf",
    estado: "recibida",
    fecha_registro: "2026-09-06T15:30:00",
  },
  {
    id_compra: 8,
    id_proveedor: 2,
    id_usuario: 10,
    fecha_compra: "2026-09-07",
    valor_total: 4200000,
    medio_pago: "credito",
    comprobante_url: null,
    estado: "recibida",
    fecha_registro: "2026-09-07T09:10:00",
  },
  {
    id_compra: 9,
    id_proveedor: 6,
    id_usuario: 3,
    fecha_compra: "2026-09-08",
    valor_total: 2100000,
    medio_pago: "transferencia",
    comprobante_url: "https://facturacion.masarepas.com/comprobantes/compra-009.pdf",
    estado: "activo",
    fecha_registro: "2026-09-08T10:00:00",
  },
  {
    id_compra: 10,
    id_proveedor: 7,
    id_usuario: 10,
    fecha_compra: "2026-09-08",
    valor_total: 750000,
    medio_pago: "efectivo",
    comprobante_url: null,
    estado: "activo",
    fecha_registro: "2026-09-08T13:40:00",
  },
  {
    id_compra: 11,
    id_proveedor: 14,
    id_usuario: 3,
    fecha_compra: "2026-09-09",
    valor_total: 1680000,
    medio_pago: "transferencia",
    comprobante_url: "https://facturacion.masarepas.com/comprobantes/compra-011.pdf",
    estado: "activo",
    fecha_registro: "2026-09-09T08:15:00",
  },
  {
    id_compra: 12,
    id_proveedor: 3,
    id_usuario: 10,
    fecha_compra: "2026-09-09",
    valor_total: 2300000,
    medio_pago: "credito",
    comprobante_url: null,
    estado: "pendiente",
    fecha_registro: "2026-09-09T16:00:00",
  },
  {
    id_compra: 13,
    id_proveedor: 5,
    id_usuario: 3,
    fecha_compra: "2026-09-10",
    valor_total: 3100000,
    medio_pago: "transferencia",
    comprobante_url: null,
    estado: "pendiente",
    fecha_registro: "2026-09-10T09:30:00",
  },
  {
    id_compra: 14,
    id_proveedor: 11,
    id_usuario: 10,
    fecha_compra: "2026-09-10",
    valor_total: 620000,
    medio_pago: "transferencia",
    comprobante_url: null,
    estado: "pendiente",
    fecha_registro: "2026-09-10T11:00:00",
  },
  {
    id_compra: 15,
    id_proveedor: 16,
    id_usuario: 3,
    fecha_compra: "2026-09-03",
    valor_total: 480000,
    medio_pago: "efectivo",
    comprobante_url: null,
    estado: "recibida",
    fecha_registro: "2026-09-03T14:00:00",
  },
  {
    id_compra: 16,
    id_proveedor: 4,
    id_usuario: 3,
    fecha_compra: "2026-08-20",
    valor_total: 1200000,
    medio_pago: "transferencia",
    comprobante_url: null,
    estado: "anulado",
    fecha_registro: "2026-08-20T10:00:00",
  },
];

import { api } from '../../../shared/services/api.js';

export const getCompras = async () => {
  return api.get('/compras', () => [...mockCompras]);
};

export const mockDetallesCompra = [
  { id_detalle_compra: 1, id_compra: 1, id_insumo: 1, cantidad: 1500, valor_unitario: 3000, subtotal: 4500000 },
  { id_detalle_compra: 2, id_compra: 2, id_insumo: 3, cantidad: 200, valor_unitario: 18000, subtotal: 3600000 },
  { id_detalle_compra: 3, id_compra: 3, id_insumo: 5, cantidad: 5000, valor_unitario: 180, subtotal: 900000 },
  { id_detalle_compra: 4, id_compra: 3, id_insumo: 6, cantidad: 5000, valor_unitario: 190, subtotal: 950000 },
  { id_detalle_compra: 5, id_compra: 4, id_insumo: 2, cantidad: 800, valor_unitario: 3500, subtotal: 2800000 },
  { id_detalle_compra: 6, id_compra: 5, id_insumo: 4, cantidad: 100, valor_unitario: 14000, subtotal: 1400000 },
  { id_detalle_compra: 7, id_compra: 6, id_insumo: 9, cantidad: 50, valor_unitario: 19000, subtotal: 950000 },
  { id_detalle_compra: 8, id_compra: 7, id_insumo: 1, cantidad: 1733, valor_unitario: 3000, subtotal: 5200000 },
  { id_detalle_compra: 9, id_compra: 8, id_insumo: 3, cantidad: 233, valor_unitario: 18000, subtotal: 4200000 },
  { id_detalle_compra: 10, id_compra: 9, id_insumo: 7, cantidad: 105, valor_unitario: 20000, subtotal: 2100000 },
  { id_detalle_compra: 11, id_compra: 10, id_insumo: 8, cantidad: 500, valor_unitario: 1500, subtotal: 750000 },
  { id_detalle_compra: 12, id_compra: 11, id_insumo: 10, cantidad: 700, valor_unitario: 2400, subtotal: 1680000 },
  { id_detalle_compra: 13, id_compra: 12, id_insumo: 14, cantidad: 10000, valor_unitario: 120, subtotal: 1200000 },
  { id_detalle_compra: 14, id_compra: 12, id_insumo: 15, cantidad: 10000, valor_unitario: 110, subtotal: 1100000 },
  { id_detalle_compra: 15, id_compra: 13, id_insumo: 12, cantidad: 500, valor_unitario: 6200, subtotal: 3100000 },
  { id_detalle_compra: 16, id_compra: 14, id_insumo: 13, cantidad: 20, valor_unitario: 31000, subtotal: 620000 },
];

export const createCompra = async (compra) => {
  return api.post('/compras', compra, async () => {
    const newObj = { id_compra: Date.now(), ...compra };
    mockCompras = [newObj, ...mockCompras];
    return newObj;
  });
};

export const updateCompra = async (id_compra, compra) => {
  return api.put(`/compras/${id_compra}`, compra, async () => {
    mockCompras = mockCompras.map((c) => (c.id_compra === id_compra ? { ...c, ...compra } : c));
    return { id_compra, ...compra };
  });
};

export const anularCompra = async (id_compra) => {
  return api.delete(`/compras/${id_compra}`, async () => {
    mockCompras = mockCompras.map((c) => (c.id_compra === id_compra ? { ...c, estado: 'anulado' } : c));
    return true;
  });
};
