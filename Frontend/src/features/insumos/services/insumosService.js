// insumosService.js - Servicio para la gestión de insumos en Masarepas
export let mockInsumos = [
  {
    id_insumo: 1,
    nombre: "Maíz Blanco Trillado Seleccionado",
    unidad_medida: "kg",
    stock_actual: 450.0,
    stock_minimo: 100.0,
    fecha_vencimiento: "2026-12-31",
    id_proveedor: 1,
    estado: "activo",
  },
  {
    id_insumo: 2,
    nombre: "Maíz Amarillo Chócolo Tierno en Grano",
    unidad_medida: "kg",
    stock_actual: 320.0,
    stock_minimo: 80.0,
    fecha_vencimiento: "2026-11-30",
    id_proveedor: 4,
    estado: "activo",
  },
  {
    id_insumo: 3,
    nombre: "Queso Doble Crema Bloque Industrial",
    unidad_medida: "kg",
    stock_actual: 180.0,
    stock_minimo: 50.0,
    fecha_vencimiento: "2026-10-15",
    id_proveedor: 2,
    estado: "activo",
  },
  {
    id_insumo: 4,
    nombre: "Mantequilla Industrial Pasteurizada con Sal",
    unidad_medida: "kg",
    stock_actual: 65.0,
    stock_minimo: 20.0,
    fecha_vencimiento: "2026-09-30",
    id_proveedor: 8,
    estado: "activo",
  },
  {
    id_insumo: 5,
    nombre: "Bolsas de Polipropileno Impresas x5 Arepas",
    unidad_medida: "unidad",
    stock_actual: 4500.0,
    stock_minimo: 1000.0,
    fecha_vencimiento: null,
    id_proveedor: 3,
    estado: "activo",
  },
  {
    id_insumo: 6,
    nombre: "Bolsas de Polipropileno Impresas x10 Arepas",
    unidad_medida: "unidad",
    stock_actual: 3800.0,
    stock_minimo: 800.0,
    fecha_vencimiento: null,
    id_proveedor: 3,
    estado: "activo",
  },
  {
    id_insumo: 7,
    nombre: "Queso Costeño Rallado Salado",
    unidad_medida: "kg",
    stock_actual: 110.0,
    stock_minimo: 30.0,
    fecha_vencimiento: "2026-10-20",
    id_proveedor: 6,
    estado: "activo",
  },
  {
    id_insumo: 8,
    nombre: "Sal Marina Refinada Yodada Grado Alimenticio",
    unidad_medida: "kg",
    stock_actual: 250.0,
    stock_minimo: 50.0,
    fecha_vencimiento: "2027-12-31",
    id_proveedor: 7,
    estado: "activo",
  },
  {
    id_insumo: 9,
    nombre: "Chicharrón de Cerdo Prensado y Deshidratado",
    unidad_medida: "kg",
    stock_actual: 45.0,
    stock_minimo: 15.0,
    fecha_vencimiento: "2026-11-15",
    id_proveedor: 10,
    estado: "activo",
  },
  {
    id_insumo: 10,
    nombre: "Yuca Fresca Lavada y Pelada",
    unidad_medida: "kg",
    stock_actual: 140.0,
    stock_minimo: 40.0,
    fecha_vencimiento: "2026-09-28",
    id_proveedor: 14,
    estado: "activo",
  },
  {
    id_insumo: 11,
    nombre: "Semillas de Chía y Linaza Molida",
    unidad_medida: "kg",
    stock_actual: 35.0,
    stock_minimo: 10.0,
    fecha_vencimiento: "2027-03-31",
    id_proveedor: 5,
    estado: "activo",
  },
  {
    id_insumo: 12,
    nombre: "Almidón Agrio de Yuca",
    unidad_medida: "kg",
    stock_actual: 90.0,
    stock_minimo: 25.0,
    fecha_vencimiento: "2027-01-30",
    id_proveedor: 5,
    estado: "activo",
  },
  {
    id_insumo: 13,
    nombre: "Conservante Grado Alimenticio Sorbato de Potasio",
    unidad_medida: "kg",
    stock_actual: 18.0,
    stock_minimo: 5.0,
    fecha_vencimiento: "2027-06-30",
    id_proveedor: 11,
    estado: "activo",
  },
  {
    id_insumo: 14,
    nombre: "Papel Separador Grasa Parafina",
    unidad_medida: "unidad",
    stock_actual: 8200.0,
    stock_minimo: 1500.0,
    fecha_vencimiento: null,
    id_proveedor: 9,
    estado: "activo",
  },
  {
    id_insumo: 15,
    nombre: "Etiquetas Autoadhesivas con Fecha y Lote",
    unidad_medida: "unidad",
    stock_actual: 6000.0,
    stock_minimo: 1200.0,
    fecha_vencimiento: null,
    id_proveedor: 16,
    estado: "activo",
  },
  {
    id_insumo: 16,
    nombre: "Azúcar Blanco Refinado",
    unidad_medida: "kg",
    stock_actual: 80.0,
    stock_minimo: 20.0,
    fecha_vencimiento: "2027-08-31",
    id_proveedor: 4,
    estado: "inactivo",
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
