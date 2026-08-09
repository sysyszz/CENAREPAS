// fichasTecnicasService.js - Servicio para la gestión de fichas técnicas
export const getFichasTecnicas = async () => {
  return [];
};

export const createFichaTecnica = async (ficha) => ({ id: Date.now(), ...ficha });
export const updateFichaTecnica = async (id, ficha) => ({ id, ...ficha });
export const deleteFichaTecnica = async (id) => true;
