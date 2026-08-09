// insumosService.js - Servicio para la gestión de insumos
export const getInsumos = async () => {
  return [];
};

export const createInsumo = async (insumo) => ({ id: Date.now(), ...insumo });
export const updateInsumo = async (id, insumo) => ({ id, ...insumo });
export const deleteInsumo = async (id) => true;
