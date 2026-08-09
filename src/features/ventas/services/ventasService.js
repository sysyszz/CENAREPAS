// ventasService.js - Servicio para la gestión de ventas
export const getVentas = async () => {
  return [];
};

export const createVenta = async (venta) => ({ id: Date.now(), ...venta });
export const updateVenta = async (id, venta) => ({ id, ...venta });
export const deleteVenta = async (id) => true;
