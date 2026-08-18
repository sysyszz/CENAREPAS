// ventasService.js - Servicio para la gestión de ventas
export const getVentas = async () => {
  return [{
    id_venta: 1, id_sede: 1, id_cliente: 1, id_usuario: 4, id_pedido: 1,
    fecha_venta: "2024-03-16T00:00:00", valor_total: 2475000,
    medio_pago: "transferencia", comprobante_url: null, estado: "completada",
  }];
};

export const mockDetallesVenta = [
  { id_detalle_venta: 1, id_venta: 1, id_producto: 1, cantidad: 150, precio_unitario: 8500, subtotal: 1275000 },
];

export const createVenta = async (venta) => ({ id_venta: Date.now(), ...venta });
export const updateVenta = async (id_venta, venta) => ({ id_venta, ...venta });
export const deleteVenta = async (id_venta) => true;
