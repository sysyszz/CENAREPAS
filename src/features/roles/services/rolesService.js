// rolesService.js - Servicio para la gestión de roles en Masarepas
export const mockRoles = [
  {
    id: 1,
    codigo: "ROL-001",
    nombre: "Administrador de Planta",
    descripcion: "Acceso total al sistema, configuración general y auditoría",
    permisos: 18,
    usuariosCount: 3,
    estado: "Activo",
    fechaCreacion: "2024-01-15",
  },
  {
    id: 2,
    codigo: "ROL-002",
    nombre: "Supervisor de Producción",
    descripcion: "Gestión de lotes de arepas, fichas técnicas e insumos de molienda",
    permisos: 14,
    usuariosCount: 5,
    estado: "Activo",
    fechaCreacion: "2024-01-20",
  },
  {
    id: 3,
    codigo: "ROL-003",
    nombre: "Gestor de Compras y Proveedores",
    descripcion: "Órdenes de compra de maíz, queso y materia prima con proveedores",
    permisos: 10,
    usuariosCount: 4,
    estado: "Activo",
    fechaCreacion: "2024-02-01",
  },
  {
    id: 4,
    codigo: "ROL-004",
    nombre: "Vendedor y Distribución",
    descripcion: "Registro de ventas de arepas, pedidos de clientes y facturación",
    permisos: 8,
    usuariosCount: 8,
    estado: "Activo",
    fechaCreacion: "2024-02-10",
  },
  {
    id: 5,
    codigo: "ROL-005",
    nombre: "Auditor de Calidad",
    descripcion: "Verificación de vida útil, registro sanitario e higiene en planta",
    permisos: 6,
    usuariosCount: 2,
    estado: "Inactivo",
    fechaCreacion: "2024-03-05",
  },
];

export const getRoles = async () => {
  return [...mockRoles];
};

export const createRol = async (rol) => ({ id: Date.now(), ...rol });
export const updateRol = async (id, rol) => ({ id, ...rol });
export const deleteRol = async (id) => true;

