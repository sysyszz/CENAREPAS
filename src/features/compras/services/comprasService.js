// comprasService.js - Servicio para la gestión de compras
export const getCompras = async () => {
  return [];
};

export const createCompra = async (compra) => ({ id: Date.now(), ...compra });
export const updateCompra = async (id, compra) => ({ id, ...compra });
export const anularCompra = async (id) => true;
