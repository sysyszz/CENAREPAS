// insumosService.js - Servicio para la gestión de insumos en Masarepas
export let mockInsumos = [
  {
    id_insumo: 1,
    nombre: "Maíz Blanco Trillado",
    unidad_medida: "kg",
    stock_actual: 120,
    stock_minimo: 30,
    fecha_vencimiento: "2026-12-31",
    id_proveedor: 1,
    estado: "activo",
  },
  {
    id_insumo: 2,
    nombre: "Maíz Amarillo Chócolo Tierno",
    unidad_medida: "kg",
    stock_actual: 85,
    stock_minimo: 25,
    fecha_vencimiento: "2026-12-31",
    id_proveedor: 4,
    estado: "activo",
  },
  {
    id_insumo: 3,
    nombre: "Queso Doble Crema Industrial",
    unidad_medida: "kg",
    stock_actual: 40,
    stock_minimo: 10,
    fecha_vencimiento: "2026-12-31",
    id_proveedor: 2,
    estado: "activo",
  },
  {
    id_insumo: 4,
    nombre: "Mantequilla Industrial con Sal",
    unidad_medida: "kg",
    stock_actual: 12,
    stock_minimo: 15,
    fecha_vencimiento: "2026-12-31",
    id_proveedor: 2,
    estado: "activo",
  },
  {
    id_insumo: 5,
    nombre: "Bolsas Polipropileno Impresas",
    unidad_medida: "unidad",
    stock_actual: 50,
    stock_minimo: 10,
    fecha_vencimiento: null,
    id_proveedor: 3,
    estado: "activo",
  },
];

export const getInsumos = async () => {
  return [...mockInsumos];
};

export const createInsumo = async (insumo) => {
  const newObj = { id_insumo: Date.now(), ...insumo };
  mockInsumos = [newObj, ...mockInsumos];
  return newObj;
};

export const updateInsumo = async (id_insumo, insumo) => {
  mockInsumos = mockInsumos.map((i) => (i.id_insumo === id_insumo ? { ...i, ...insumo } : i));
  return { id_insumo, ...insumo };
};

export const deleteInsumo = async (id_insumo) => {
  mockInsumos = mockInsumos.filter((i) => i.id_insumo !== id_insumo);
  return true;
};
