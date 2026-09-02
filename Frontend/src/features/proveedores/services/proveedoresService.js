// proveedoresService.js - Servicio para la gestión de proveedores en Masarepas
export let mockProveedores = [
  {
    id_proveedor: 1,
    nombre: "Agrícola del Valle S.A.",
    nit: "890.123.456-7",
    telefono: "+57 (602) 444-5566",
    correo: "ventas@agricoladelvalle.com",
    direccion: "Calle 1 #2-3",
    estado: "activo",
    fecha_creacion: "2024-01-15T00:00:00",
  },
  {
    id_proveedor: 2,
    nombre: "Lácteos El Campesino",
    nit: "900.567.890-1",
    telefono: "+57 (604) 333-2211",
    correo: "pedidos@lacteoselcampesino.com",
    direccion: "Carrera 4 #5-6",
    estado: "activo",
    fecha_creacion: "2024-01-20T00:00:00",
  },
  {
    id_proveedor: 3,
    nombre: "Plásticos San José Ltda.",
    nit: "800.998.877-6",
    telefono: "+57 (601) 555-9988",
    correo: "comercial@plasticossanjose.com",
    direccion: "Calle 7 #8-9",
    estado: "activo",
    fecha_creacion: "2024-02-01T00:00:00",
  },
  {
    id_proveedor: 4,
    nombre: "Distribuidora del Campo",
    nit: "901.345.678-2",
    telefono: "+57 315 777 8899",
    correo: "campo@distribuidoradelcampo.co",
    direccion: "Carrera 10 #11-12",
    estado: "activo",
    fecha_creacion: "2024-02-10T00:00:00",
  },
];

export const getProveedores = async () => {
  return [...mockProveedores];
};

export const createProveedor = async (proveedor) => {
  const newObj = {
    id_proveedor: Date.now(),
    fecha_creacion: new Date().toISOString(),
    estado: 'activo',
    ...proveedor,
  };
  mockProveedores = [newObj, ...mockProveedores];
  return newObj;
};

export const updateProveedor = async (id_proveedor, proveedor) => {
  mockProveedores = mockProveedores.map((p) => (p.id_proveedor === id_proveedor ? { ...p, ...proveedor } : p));
  return { id_proveedor, ...proveedor };
};

export const deleteProveedor = async (id_proveedor) => {
  mockProveedores = mockProveedores.filter((p) => p.id_proveedor !== id_proveedor);
  return true;
};


