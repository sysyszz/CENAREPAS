// usuariosService.js - Servicio para la gestión de usuarios en Masarepas
export const mockUsuarios = [
  {
    id: 1,
    codigo: "USR-001",
    nombre: "Carlos Eduardo Gómez",
    email: "carlos.gomez@masarepas.com",
    telefono: "+57 300 123 4567",
    rol: "Administrador de Planta",
    estado: "Activo",
    fechaRegistro: "2024-01-15",
  },
  {
    id: 2,
    codigo: "USR-002",
    nombre: "María Fernanda Rojas",
    email: "maria.rojas@masarepas.com",
    telefono: "+57 311 987 6543",
    rol: "Supervisor de Producción",
    estado: "Activo",
    fechaRegistro: "2024-01-20",
  },
  {
    id: 3,
    codigo: "USR-003",
    nombre: "Jorge Eliecer Restrepo",
    email: "jorge.restrepo@masarepas.com",
    telefono: "+57 315 456 7890",
    rol: "Gestor de Compras y Proveedores",
    estado: "Activo",
    fechaRegistro: "2024-02-01",
  },
  {
    id: 4,
    codigo: "USR-004",
    nombre: "Ana Lucía Benítez",
    email: "ana.benitez@masarepas.com",
    telefono: "+57 320 654 3210",
    rol: "Vendedor y Distribución",
    estado: "Activo",
    fechaRegistro: "2024-02-10",
  },
  {
    id: 5,
    codigo: "USR-005",
    nombre: "Andrés Felipe Morales",
    email: "andres.morales@masarepas.com",
    telefono: "+57 318 789 0123",
    rol: "Auditor de Calidad",
    estado: "Inactivo",
    fechaRegistro: "2024-03-05",
  },
];

export const getUsuarios = async () => {
  return [...mockUsuarios];
};

export const createUsuario = async (usuario) => ({ id: Date.now(), ...usuario });
export const updateUsuario = async (id, usuario) => ({ id, ...usuario });
export const deleteUsuario = async (id) => true;

