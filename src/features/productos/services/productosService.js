// productosService.js - Servicio para la gestión de productos
export const getProductos = async () => {
  return [];
};

export const createProducto = async (producto) => ({ id: Date.now(), ...producto });
export const updateProducto = async (id, producto) => ({ id, ...producto });
export const deleteProducto = async (id) => true;
