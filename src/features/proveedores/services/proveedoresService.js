// proveedoresService.js - Servicio para la gestión de proveedores en Masarepas
export const mockProveedores = [
  {
    id: 1,
    codigo: "PRV-001",
    nombre: "Agrícola del Valle S.A.",
    nit: "890.123.456-7",
    contacto: "Fernando Gómez",
    telefono: "+57 (602) 444-5566",
    email: "ventas@agricoladelvalle.com",
    categoriaInsumo: "Granos y Maíz Trillado",
    comprasRealizadas: 24,
    totalComprado: "$145.000.000",
    totalCompradoNum: 145000000,
    estado: "Activo",
  },
  {
    id: 2,
    codigo: "PRV-002",
    nombre: "Lácteos El Campesino",
    nit: "900.567.890-1",
    contacto: "Elena Restrepo",
    telefono: "+57 (604) 333-2211",
    email: "pedidos@lacteoselcampesino.com",
    categoriaInsumo: "Quesos y Lácteos",
    comprasRealizadas: 36,
    totalComprado: "$180.000.000",
    totalCompradoNum: 180000000,
    estado: "Activo",
  },
  {
    id: 3,
    codigo: "PRV-003",
    nombre: "Plásticos San José Ltda.",
    nit: "800.998.877-6",
    contacto: "Roberto Páez",
    telefono: "+57 (601) 555-9988",
    email: "comercial@plasticossanjose.com",
    categoriaInsumo: "Empaques y Embalajes",
    comprasRealizadas: 18,
    totalComprado: "$32.500.000",
    totalCompradoNum: 32500000,
    estado: "Activo",
  },
  {
    id: 4,
    codigo: "PRV-004",
    nombre: "Distribuidora del Campo",
    nit: "901.345.678-2",
    contacto: "Alvaro Benavides",
    telefono: "+57 315 777 8899",
    email: "campo@distribuidoradelcampo.co",
    categoriaInsumo: "Chócolo y Verduras Frescas",
    comprasRealizadas: 15,
    totalComprado: "$28.000.000",
    totalCompradoNum: 28000000,
    estado: "Activo",
  },
];

export const getProveedores = async () => {
  return [...mockProveedores];
};

export const createProveedor = async (proveedor) => ({ id: Date.now(), ...proveedor });
export const updateProveedor = async (id, proveedor) => ({ id, ...proveedor });
export const deleteProveedor = async (id) => true;

