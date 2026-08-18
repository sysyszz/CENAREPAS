// usuariosService.js - Servicio para la gestión de usuarios en Masarepas
export const mockUsuarios = [
  {
    id_usuario: 1,
    nombre: "Carlos Eduardo Gómez",
    correo: "carlos.gomez@masarepas.com",
    contrasena_hash: "$2b$10$mockHashCarlos",
    id_rol: 1,
    estado: "activo",
    token_recuperacion: null,
    token_expiracion: null,
    fecha_creacion: "2024-01-15T00:00:00",
  },
  {
    id_usuario: 2,
    nombre: "María Fernanda Rojas",
    correo: "maria.rojas@masarepas.com",
    contrasena_hash: "$2b$10$mockHashMaria",
    id_rol: 2,
    estado: "activo",
    token_recuperacion: null,
    token_expiracion: null,
    fecha_creacion: "2024-01-20T00:00:00",
  },
  {
    id_usuario: 3,
    nombre: "Jorge Eliecer Restrepo",
    correo: "jorge.restrepo@masarepas.com",
    contrasena_hash: "$2b$10$mockHashJorge",
    id_rol: 3,
    estado: "activo",
    token_recuperacion: null,
    token_expiracion: null,
    fecha_creacion: "2024-02-01T00:00:00",
  },
  {
    id_usuario: 4,
    nombre: "Ana Lucía Benítez",
    correo: "ana.benitez@masarepas.com",
    contrasena_hash: "$2b$10$mockHashAna",
    id_rol: 4,
    estado: "activo",
    token_recuperacion: null,
    token_expiracion: null,
    fecha_creacion: "2024-02-10T00:00:00",
  },
  {
    id_usuario: 5,
    nombre: "Andrés Felipe Morales",
    correo: "andres.morales@masarepas.com",
    contrasena_hash: "$2b$10$mockHashAndres",
    id_rol: 5,
    estado: "inactivo",
    token_recuperacion: null,
    token_expiracion: null,
    fecha_creacion: "2024-03-05T00:00:00",
  },
];

export const getUsuarios = async () => {
  return [...mockUsuarios];
};

export const createUsuario = async (usuario) => ({ id_usuario: Date.now(), ...usuario });
export const updateUsuario = async (id_usuario, usuario) => ({ id_usuario, ...usuario });
export const deleteUsuario = async (id_usuario) => true;

