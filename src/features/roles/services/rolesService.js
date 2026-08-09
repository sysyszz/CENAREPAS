// rolesService.js - Servicio para la gestión de roles
export const getRoles = async () => {
  return [];
};

export const createRol = async (rol) => ({ id: Date.now(), ...rol });
export const updateRol = async (id, rol) => ({ id, ...rol });
export const deleteRol = async (id) => true;
