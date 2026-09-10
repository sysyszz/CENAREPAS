// rolesService.js - Servicio para la gestión de roles en Masarepas
export let mockRoles = [
  {
    id_rol: 1,
    nombre: "Administrador de Planta",
    descripcion: "Control total del sistema ERP, auditoría, configuración de sedes y gestión de accesos",
    estado: "activo",
    fecha_creacion: "2024-01-15T08:00:00",
  },
  {
    id_rol: 2,
    nombre: "Supervisor de Producción",
    descripcion: "Gestión y balance de lotes de arepas, fichas técnicas, rendimientos y molienda de maíz",
    estado: "activo",
    fecha_creacion: "2024-01-20T09:30:00",
  },
  {
    id_rol: 3,
    nombre: "Gestor de Compras y Proveedores",
    descripcion: "Órdenes de compra de materias primas, recepción de maíz, queso y empaques con proveedores",
    estado: "activo",
    fecha_creacion: "2024-02-01T10:15:00",
  },
  {
    id_rol: 4,
    nombre: "Asesor Comercial y Facturación",
    descripcion: "Registro de ventas en mostrador, liquidación de pedidos de clientes y gestión de cobranza",
    estado: "activo",
    fecha_creacion: "2024-02-10T11:00:00",
  },
  {
    id_rol: 5,
    nombre: "Auditor de Calidad e Inocuidad",
    descripcion: "Inspección de tiempos de cocción, temperaturas, vida útil y cumplimiento del registro sanitario",
    estado: "activo",
    fecha_creacion: "2024-02-18T14:20:00",
  },
  {
    id_rol: 6,
    nombre: "Coordinador de Logística y Despachos",
    descripcion: "Control de despachos entre sedes (Ibagué, Espinal, Girardot) y rutas de entrega mayorista",
    estado: "activo",
    fecha_creacion: "2024-03-01T08:45:00",
  },
  {
    id_rol: 7,
    nombre: "Operario Maestro de Masa y Cocción",
    descripcion: "Manejo de pailas de cocción, molienda continua y moldeado de arepas en línea",
    estado: "activo",
    fecha_creacion: "2024-03-05T07:00:00",
  },
  {
    id_rol: 8,
    nombre: "Auxiliar de Inventario y Almacén",
    descripcion: "Kardex de materia prima, conteos cíclicos de empaques y alerta de stock mínimo",
    estado: "inactivo",
    fecha_creacion: "2024-03-12T16:00:00",
  },
];

export const getRoles = async () => {
  return [...mockRoles];
};

export const createRol = async (rol) => {
  const newObj = {
    id_rol: Date.now(),
    fecha_creacion: new Date().toISOString(),
    estado: 'activo',
    ...rol,
  };
  mockRoles = [newObj, ...mockRoles];
  return newObj;
};

export const updateRol = async (id_rol, rol) => {
  mockRoles = mockRoles.map((r) => (r.id_rol === id_rol ? { ...r, ...rol } : r));
  return { id_rol, ...rol };
};

export const deleteRol = async (id) => {
  mockRoles = mockRoles.filter((r) => r.id_rol !== id);
  return true;
};
