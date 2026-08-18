// comprasService.js - Servicio para la gestión de compras en Masarepas
export const mockCompras = [
  {
    id: 1,
    codigo: "CMP-2024-001",
    proveedor: "Agrícola del Valle S.A.",
    insumo: "Maíz Blanco Trillado (100 sacos)",
    fecha: "2024-03-10",
    total: "$14.500.000",
    totalNum: 14500000,
    comprador: "Jorge Eliecer Restrepo",
    estado: "Recibida",
  },
  {
    id: 2,
    codigo: "CMP-2024-002",
    proveedor: "Lácteos El Campesino",
    insumo: "Queso Doble Crema (50 bloques)",
    fecha: "2024-03-12",
    total: "$11.000.000",
    totalNum: 11000000,
    comprador: "Jorge Eliecer Restrepo",
    estado: "Recibida",
  },
  {
    id: 3,
    codigo: "CMP-2024-003",
    proveedor: "Plásticos San José Ltda.",
    insumo: "Bolsas Impresas Polipropileno (30 millares)",
    fecha: "2024-03-14",
    total: "$2.850.000",
    totalNum: 2850000,
    comprador: "Jorge Eliecer Restrepo",
    estado: "Pendiente",
  },
  {
    id: 4,
    codigo: "CMP-2024-004",
    proveedor: "Distribuidora del Campo",
    insumo: "Maíz Amarillo Chócolo (60 sacos)",
    fecha: "2024-03-15",
    total: "$7.800.000",
    totalNum: 7800000,
    comprador: "Jorge Eliecer Restrepo",
    estado: "Recibida",
  },
];

export const getCompras = async () => {
  return [...mockCompras];
};

export const createCompra = async (compra) => ({ id: Date.now(), ...compra });
export const updateCompra = async (id, compra) => ({ id, ...compra });
export const anularCompra = async (id) => true;

