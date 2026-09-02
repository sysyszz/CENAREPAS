// ventasService.js - Servicio para la gestión de ventas
export let mockVentas = [
  {
    id_venta: 1, id_sede: 1, id_cliente: 1, id_usuario: 4, id_pedido: 1,
    fecha_venta: "2024-03-16T00:00:00", valor_total: 2475000,
    medio_pago: "transferencia", comprobante_url: null, estado: "completada",
  },
  {
    id_venta: 2, id_sede: 1, id_cliente: 2, id_usuario: 2, id_pedido: null,
    fecha_venta: "2024-03-17T10:30:00", valor_total: 1850000,
    medio_pago: "efectivo", comprobante_url: null, estado: "completada",
  },
];

export const getVentas = async () => {
  return [...mockVentas];
};

export const mockDetallesVenta = [
  { id_detalle_venta: 1, id_venta: 1, id_producto: 1, cantidad: 150, precio_unitario: 8500, subtotal: 1275000 },
];

export const createVenta = async (venta) => {
  const newObj = {
    id_venta: Date.now(),
    fecha_venta: new Date().toISOString(),
    estado: 'completada',
    ...venta,
  };
  mockVentas = [newObj, ...mockVentas];
  return newObj;
};

export const updateVenta = async (id_venta, venta) => {
  mockVentas = mockVentas.map((v) => (v.id_venta === id_venta ? { ...v, ...venta } : v));
  return { id_venta, ...venta };
};

export const deleteVenta = async (id_venta) => {
  mockVentas = mockVentas.filter((v) => v.id_venta !== id_venta);
  return true;
};

