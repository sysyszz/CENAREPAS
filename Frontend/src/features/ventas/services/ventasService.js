// ventasService.js - Servicio para la gestión de ventas en Masarepas
export let mockVentas = [
  {
    id_venta: 1,
    id_sede: 1,
    id_cliente: 1,
    id_usuario: 4,
    id_pedido: 1,
    fecha_venta: "2026-09-08T09:00:00",
    valor_total: 2475000,
    medio_pago: "transferencia",
    comprobante_url: "https://comprobantes.masarepas.com/vouchers/v-001.pdf",
    estado: "completada",
  },
  {
    id_venta: 2,
    id_sede: 2,
    id_cliente: 2,
    id_usuario: 4,
    id_pedido: 2,
    fecha_venta: "2026-09-09T10:30:00",
    valor_total: 3300000,
    medio_pago: "transferencia",
    comprobante_url: "https://comprobantes.masarepas.com/vouchers/v-002.pdf",
    estado: "completada",
  },
  {
    id_venta: 3,
    id_sede: 1,
    id_cliente: 7,
    id_usuario: 8,
    id_pedido: null,
    fecha_venta: "2026-09-09T11:15:00",
    valor_total: 425000,
    medio_pago: "efectivo",
    comprobante_url: null,
    estado: "completada",
  },
  {
    id_venta: 4,
    id_sede: 2,
    id_cliente: 3,
    id_usuario: 4,
    id_pedido: 3,
    fecha_venta: "2026-09-09T14:20:00",
    valor_total: 1540000,
    medio_pago: "transferencia",
    comprobante_url: "https://comprobantes.masarepas.com/vouchers/v-004.pdf",
    estado: "completada",
  },
  {
    id_venta: 5,
    id_sede: 1,
    id_cliente: 5,
    id_usuario: 8,
    id_pedido: null,
    fecha_venta: "2026-09-09T16:45:00",
    valor_total: 680000,
    medio_pago: "tarjeta",
    comprobante_url: "https://comprobantes.masarepas.com/vouchers/v-005.pdf",
    estado: "completada",
  },
  {
    id_venta: 6,
    id_sede: 3,
    id_cliente: 4,
    id_usuario: 12,
    id_pedido: 4,
    fecha_venta: "2026-09-10T08:15:00",
    valor_total: 1980000,
    medio_pago: "transferencia",
    comprobante_url: "https://comprobantes.masarepas.com/vouchers/v-006.pdf",
    estado: "completada",
  },
  {
    id_venta: 7,
    id_sede: 1,
    id_cliente: 10,
    id_usuario: 4,
    id_pedido: null,
    fecha_venta: "2026-09-10T09:00:00",
    valor_total: 340000,
    medio_pago: "efectivo",
    comprobante_url: null,
    estado: "completada",
  },
  {
    id_venta: 8,
    id_sede: 1,
    id_cliente: 12,
    id_usuario: 8,
    id_pedido: null,
    fecha_venta: "2026-09-10T09:45:00",
    valor_total: 510000,
    medio_pago: "tarjeta",
    comprobante_url: "https://comprobantes.masarepas.com/vouchers/v-008.pdf",
    estado: "completada",
  },
  {
    id_venta: 9,
    id_sede: 1,
    id_cliente: 6,
    id_usuario: 4,
    id_pedido: 6,
    fecha_venta: "2026-09-10T10:15:00",
    valor_total: 3820000,
    medio_pago: "transferencia",
    comprobante_url: "https://comprobantes.masarepas.com/vouchers/v-009.pdf",
    estado: "completada",
  },
  {
    id_venta: 10,
    id_sede: 3,
    id_cliente: 9,
    id_usuario: 12,
    id_pedido: null,
    fecha_venta: "2026-09-10T10:50:00",
    valor_total: 720000,
    medio_pago: "tarjeta",
    comprobante_url: "https://comprobantes.masarepas.com/vouchers/v-010.pdf",
    estado: "completada",
  },
  {
    id_venta: 11,
    id_sede: 2,
    id_cliente: 15,
    id_usuario: 4,
    id_pedido: null,
    fecha_venta: "2026-09-10T11:20:00",
    valor_total: 485000,
    medio_pago: "efectivo",
    comprobante_url: null,
    estado: "completada",
  },
  {
    id_venta: 12,
    id_sede: 1,
    id_cliente: 14,
    id_usuario: 8,
    id_pedido: 14,
    fecha_venta: "2026-09-07T12:00:00",
    valor_total: 1120000,
    medio_pago: "transferencia",
    comprobante_url: "https://comprobantes.masarepas.com/vouchers/v-012.pdf",
    estado: "completada",
  },
  {
    id_venta: 13,
    id_sede: 1,
    id_cliente: 16,
    id_usuario: 4,
    id_pedido: 15,
    fecha_venta: "2026-09-08T15:30:00",
    valor_total: 2200000,
    medio_pago: "transferencia",
    comprobante_url: "https://comprobantes.masarepas.com/vouchers/v-013.pdf",
    estado: "completada",
  },
  {
    id_venta: 14,
    id_sede: 3,
    id_cliente: 8,
    id_usuario: 12,
    id_pedido: null,
    fecha_venta: "2026-09-09T17:00:00",
    valor_total: 825000,
    medio_pago: "efectivo",
    comprobante_url: null,
    estado: "completada",
  },
  {
    id_venta: 15,
    id_sede: 1,
    id_cliente: 11,
    id_usuario: 4,
    id_pedido: null,
    fecha_venta: "2026-09-07T08:30:00",
    valor_total: 1850000,
    medio_pago: "transferencia",
    comprobante_url: "https://comprobantes.masarepas.com/vouchers/v-015.pdf",
    estado: "completada",
  },
  {
    id_venta: 16,
    id_sede: 2,
    id_cliente: 3,
    id_usuario: 8,
    id_pedido: null,
    fecha_venta: "2026-09-05T16:00:00",
    valor_total: 350000,
    medio_pago: "efectivo",
    comprobante_url: null,
    estado: "anulada",
  },
];

import { api } from '../../../shared/services/api.js';

export const getVentas = async () => {
  return api.get('/ventas', () => [...mockVentas]);
};

export const mockDetallesVenta = [
  { id_detalle_venta: 1, id_venta: 1, id_producto: 1, cantidad: 150, precio_unitario: 8500, subtotal: 1275000 },
  { id_detalle_venta: 2, id_venta: 1, id_producto: 2, cantidad: 200, precio_unitario: 6000, subtotal: 1200000 },
  { id_detalle_venta: 3, id_venta: 2, id_producto: 3, cantidad: 300, precio_unitario: 11000, subtotal: 3300000 },
  { id_detalle_venta: 4, id_venta: 3, id_producto: 1, cantidad: 50, precio_unitario: 8500, subtotal: 425000 },
  { id_detalle_venta: 5, id_venta: 4, id_producto: 2, cantidad: 140, precio_unitario: 6000, subtotal: 840000 },
  { id_detalle_venta: 6, id_venta: 4, id_producto: 7, cantidad: 127, precio_unitario: 5500, subtotal: 700000 },
  { id_detalle_venta: 7, id_venta: 5, id_producto: 3, cantidad: 40, precio_unitario: 11000, subtotal: 440000 },
  { id_detalle_venta: 8, id_venta: 5, id_producto: 8, cantidad: 30, precio_unitario: 8000, subtotal: 240000 },
  { id_detalle_venta: 9, id_venta: 6, id_producto: 4, cantidad: 120, precio_unitario: 9500, subtotal: 1140000 },
  { id_detalle_venta: 10, id_venta: 6, id_producto: 1, cantidad: 100, precio_unitario: 8400, subtotal: 840000 },
  { id_detalle_venta: 11, id_venta: 7, id_producto: 2, cantidad: 40, precio_unitario: 6000, subtotal: 240000 },
  { id_detalle_venta: 12, id_venta: 7, id_producto: 9, cantidad: 22, precio_unitario: 4500, subtotal: 100000 },
  { id_detalle_venta: 13, id_venta: 8, id_producto: 1, cantidad: 60, precio_unitario: 8500, subtotal: 510000 },
  { id_detalle_venta: 14, id_venta: 9, id_producto: 1, cantidad: 200, precio_unitario: 8500, subtotal: 1700000 },
  { id_detalle_venta: 15, id_venta: 9, id_producto: 3, cantidad: 120, precio_unitario: 11000, subtotal: 1320000 },
  { id_detalle_venta: 16, id_venta: 9, id_producto: 6, cantidad: 102, precio_unitario: 7800, subtotal: 800000 },
];

export const createVenta = async (venta) => {
  return api.post('/ventas', venta, async () => {
    const newObj = {
      id_venta: Date.now(),
      fecha_venta: new Date().toISOString(),
      estado: 'completada',
      ...venta,
    };
    mockVentas = [newObj, ...mockVentas];
    return newObj;
  });
};

export const updateVenta = async (id_venta, venta) => {
  return api.put(`/ventas/${id_venta}`, venta, async () => {
    mockVentas = mockVentas.map((v) => (v.id_venta === id_venta ? { ...v, ...venta } : v));
    return { id_venta, ...venta };
  });
};

export const deleteVenta = async (id_venta) => {
  return api.delete(`/ventas/${id_venta}`, async () => {
    mockVentas = mockVentas.filter((v) => v.id_venta !== id_venta);
    return true;
  });
};