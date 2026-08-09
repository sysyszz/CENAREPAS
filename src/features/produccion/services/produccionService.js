// produccionService.js - Servicio para la gestión de lotes de producción
export const getLotes = async () => {
  return [];
};

export const createLote = async (lote) => ({ id: Date.now(), ...lote });
export const updateLote = async (id, lote) => ({ id, ...lote });
export const anularLote = async (id) => true;
