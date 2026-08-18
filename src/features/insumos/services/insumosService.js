// insumosService.js - Servicio para la gestión de insumos en Masarepas
export const mockInsumos = [
  {
    id: 1,
    codigo: "INS-001",
    nombre: "Maíz Blanco Trillado",
    unidadMedida: "Saco x 50kg",
    categoria: "Granos y Cereales",
    stock: 120,
    stockMinimo: 30,
    precioUnitario: "$145.000",
    proveedor: "Agrícola del Valle S.A.",
    estado: "Disponible",
  },
  {
    id: 2,
    codigo: "INS-002",
    nombre: "Maíz Amarillo Chócolo Tierno",
    unidadMedida: "Saco x 40kg",
    categoria: "Granos y Cereales",
    stock: 85,
    stockMinimo: 25,
    precioUnitario: "$130.000",
    proveedor: "Distribuidora del Campo",
    estado: "Disponible",
  },
  {
    id: 3,
    codigo: "INS-003",
    nombre: "Queso Doble Crema Industrial",
    unidadMedida: "Bloque x 15kg",
    categoria: "Lácteos y Quesos",
    stock: 40,
    stockMinimo: 10,
    precioUnitario: "$220.000",
    proveedor: "Lácteos El Campesino",
    estado: "Disponible",
  },
  {
    id: 4,
    codigo: "INS-004",
    nombre: "Mantequilla Industrial con Sal",
    unidadMedida: "Caja x 20kg",
    categoria: "Lácteos y Grasas",
    stock: 12,
    stockMinimo: 15,
    precioUnitario: "$180.000",
    proveedor: "Lácteos El Campesino",
    estado: "Bajo Stock",
  },
  {
    id: 5,
    codigo: "INS-005",
    nombre: "Bolsas Polipropileno Impresas",
    unidadMedida: "Millar (1000 un)",
    categoria: "Empaques y Embalajes",
    stock: 50,
    stockMinimo: 10,
    precioUnitario: "$95.000",
    proveedor: "Plásticos San José Ltda.",
    estado: "Disponible",
  },
];

export const getInsumos = async () => {
  return [...mockInsumos];
};

export const createInsumo = async (insumo) => ({ id: Date.now(), ...insumo });
export const updateInsumo = async (id, insumo) => ({ id, ...insumo });
export const deleteInsumo = async (id) => true;

