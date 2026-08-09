// usuariosService.js - Servicio para la gestión de usuarios
export const getUsuarios = async () => {
  return [];
};

export const createUsuario = async (usuario) => ({ id: Date.now(), ...usuario });
export const updateUsuario = async (id, usuario) => ({ id, ...usuario });
export const deleteUsuario = async (id) => true;
