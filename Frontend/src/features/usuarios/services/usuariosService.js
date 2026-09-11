// usuariosService.js - Servicio para la gestión de usuarios en Masarepas
export let mockUsuarios = [
  {
    id_usuario: 1,
    nombre: "Carlos Eduardo Gómez",
    correo: "carlos.gomez@masarepas.com",
    contrasena_hash: "$2b$10$mockHashCarlos",
    id_rol: 1,
    estado: "activo",
    token_recuperacion: null,
    token_expiracion: null,
    fecha_creacion: "2024-01-15T08:00:00",
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
    fecha_creacion: "2024-01-20T09:30:00",
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
    fecha_creacion: "2024-02-01T10:15:00",
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
    fecha_creacion: "2024-02-10T11:00:00",
  },
  {
    id_usuario: 5,
    nombre: "Andrés Felipe Morales",
    correo: "andres.morales@masarepas.com",
    contrasena_hash: "$2b$10$mockHashAndres",
    id_rol: 5,
    estado: "activo",
    token_recuperacion: null,
    token_expiracion: null,
    fecha_creacion: "2024-02-18T14:20:00",
  },
  {
    id_usuario: 6,
    nombre: "Claudia Patricia Henao",
    correo: "claudia.henao@masarepas.com",
    contrasena_hash: "$2b$10$mockHashClaudia",
    id_rol: 6,
    estado: "activo",
    token_recuperacion: null,
    token_expiracion: null,
    fecha_creacion: "2024-03-01T08:45:00",
  },
  {
    id_usuario: 7,
    nombre: "Guillermo León Pineda",
    correo: "guillermo.pineda@masarepas.com",
    contrasena_hash: "$2b$10$mockHashGuillermo",
    id_rol: 7,
    estado: "activo",
    token_recuperacion: null,
    token_expiracion: null,
    fecha_creacion: "2024-03-05T07:00:00",
  },
  {
    id_usuario: 8,
    nombre: "Diana Marcela Osorio",
    correo: "diana.osorio@masarepas.com",
    contrasena_hash: "$2b$10$mockHashDiana",
    id_rol: 4,
    estado: "activo",
    token_recuperacion: null,
    token_expiracion: null,
    fecha_creacion: "2024-03-10T09:15:00",
  },
  {
    id_usuario: 9,
    nombre: "Héctor Fabio Valencia",
    correo: "hector.valencia@masarepas.com",
    contrasena_hash: "$2b$10$mockHashHector",
    id_rol: 2,
    estado: "activo",
    token_recuperacion: null,
    token_expiracion: null,
    fecha_creacion: "2024-03-15T10:00:00",
  },
  {
    id_usuario: 10,
    nombre: "Sandra Milena Cárdenas",
    correo: "sandra.cardenas@masarepas.com",
    contrasena_hash: "$2b$10$mockHashSandra",
    id_rol: 3,
    estado: "activo",
    token_recuperacion: null,
    token_expiracion: null,
    fecha_creacion: "2024-03-20T11:30:00",
  },
  {
    id_usuario: 11,
    nombre: "Julián Alberto Montoya",
    correo: "julian.montoya@masarepas.com",
    contrasena_hash: "$2b$10$mockHashJulian",
    id_rol: 6,
    estado: "activo",
    token_recuperacion: null,
    token_expiracion: null,
    fecha_creacion: "2024-03-25T08:00:00",
  },
  {
    id_usuario: 12,
    nombre: "Paola Andrea Velásquez",
    correo: "paola.velasquez@masarepas.com",
    contrasena_hash: "$2b$10$mockHashPaola",
    id_rol: 4,
    estado: "activo",
    token_recuperacion: null,
    token_expiracion: null,
    fecha_creacion: "2024-04-01T09:00:00",
  },
  {
    id_usuario: 13,
    nombre: "Rodrigo Antonio Silva",
    correo: "rodrigo.silva@masarepas.com",
    contrasena_hash: "$2b$10$mockHashRodrigo",
    id_rol: 7,
    estado: "activo",
    token_recuperacion: null,
    token_expiracion: null,
    fecha_creacion: "2024-04-05T07:30:00",
  },
  {
    id_usuario: 14,
    nombre: "Laura Camila Gutiérrez",
    correo: "laura.gutierrez@masarepas.com",
    contrasena_hash: "$2b$10$mockHashLaura",
    id_rol: 5,
    estado: "activo",
    token_recuperacion: null,
    token_expiracion: null,
    fecha_creacion: "2024-04-10T14:00:00",
  },
  {
    id_usuario: 15,
    nombre: "Óscar Mauricio Duque",
    correo: "oscar.duque@masarepas.com",
    contrasena_hash: "$2b$10$mockHashOscar",
    id_rol: 8,
    estado: "inactivo",
    token_recuperacion: null,
    token_expiracion: null,
    fecha_creacion: "2024-04-15T16:00:00",
  },
  {
    id_usuario: 16,
    nombre: "Natalia Sofía Castaño",
    correo: "natalia.castano@masarepas.com",
    contrasena_hash: "$2b$10$mockHashNatalia",
    id_rol: 4,
    estado: "activo",
    token_recuperacion: null,
    token_expiracion: null,
    fecha_creacion: "2024-04-20T08:30:00",
  },
];

import { api } from '../../../shared/services/api.js';

export const getUsuarios = async () => {
  return api.get('/usuarios', () => [...mockUsuarios]);
};

export const createUsuario = async (usuario) => {
  return api.post('/usuarios', usuario, async () => {
    const newObj = {
      id_usuario: Date.now(),
      fecha_creacion: new Date().toISOString(),
      estado: 'activo',
      ...usuario,
    };
    mockUsuarios = [newObj, ...mockUsuarios];
    return newObj;
  });
};

export const updateUsuario = async (id_usuario, usuario) => {
  return api.put(`/usuarios/${id_usuario}`, usuario, async () => {
    mockUsuarios = mockUsuarios.map((u) => (u.id_usuario === id_usuario ? { ...u, ...usuario } : u));
    return { id_usuario, ...usuario };
  });
};

export const deleteUsuario = async (id_usuario) => {
  return api.delete(`/usuarios/${id_usuario}`, async () => {
    mockUsuarios = mockUsuarios.filter((u) => u.id_usuario !== id_usuario);
    return true;
  });
};

