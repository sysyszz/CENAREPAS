// proveedoresService.js - Servicio para la gestión de proveedores
export const getProveedores = async () => {
  return [];
};

export const createProveedor = async (proveedor) => ({ id: Date.now(), ...proveedor });
export const updateProveedor = async (id, proveedor) => ({ id, ...proveedor });
export const deleteProveedor = async (id) => true;
