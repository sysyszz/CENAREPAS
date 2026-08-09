// categoriasService.js - Servicio para la gestión de categorías
export const getCategorias = async () => {
  return [];
};

export const createCategoria = async (categoria) => ({ id: Date.now(), ...categoria });
export const updateCategoria = async (id, categoria) => ({ id, ...categoria });
export const deleteCategoria = async (id) => true;
