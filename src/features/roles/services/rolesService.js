// rolesService.js - Servicio para la gestión de roles en Masarepas
export const mockRoles = [
  {
    id_rol: 1,
    nombre: "Administrador de Planta",
    descripcion: "Acceso total al sistema, configuración general y auditoría",
    estado: "activo",
    fecha_creacion: "2024-01-15T00:00:00",
  },
  {
    id_rol: 2,
    nombre: "Supervisor de Producción",
    descripcion: "Gestión de lotes de arepas, fichas técnicas e insumos de molienda",
    estado: "activo",
    fecha_creacion: "2024-01-20T00:00:00",
  },
  {
    id_rol: 3,
    nombre: "Gestor de Compras y Proveedores",
    descripcion: "Órdenes de compra de maíz, queso y materia prima con proveedores",
    estado: "activo",
    fecha_creacion: "2024-02-01T00:00:00",
  },
  {
    id_rol: 4,
    nombre: "Vendedor y Distribución",
    descripcion: "Registro de ventas de arepas, pedidos de clientes y facturación",
    estado: "activo",
    fecha_creacion: "2024-02-10T00:00:00",
  },
  {
    id_rol: 5,
    nombre: "Auditor de Calidad",
    descripcion: "Verificación de vida útil, registro sanitario e higiene en planta",
    estado: "inactivo",
    fecha_creacion: "2024-03-05T00:00:00",
  },
];

export const getRoles = async () => {
  return [...mockRoles];
};

export const createRol = async (rol) => ({ id_rol: Date.now(), ...rol });
export const updateRol = async (id_rol, rol) => ({ id_rol, ...rol });
export const deleteRol = async (id) => true;

