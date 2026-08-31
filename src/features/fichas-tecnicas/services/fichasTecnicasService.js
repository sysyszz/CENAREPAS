// fichasTecnicasService.js - Servicio para la gestión de fichas técnicas en Masarepas
export let mockFichasTecnicas = [
  {
    id_ficha: 1,
    nombre: "Arepa de Chócolo con Queso",
    descripcion: "Ficha de producción de arepa de chócolo con queso",
    instrucciones_preparacion: "Mezclar, moldear y cocinar.",
    tiempo_estimado_minutos: 90,
    rendimiento_lote: 100,
    estado: "activo",
  },
  {
    id_ficha: 2,
    nombre: "Arepa Telita Tradicional",
    descripcion: "Ficha de producción de arepa telita",
    instrucciones_preparacion: "Mezclar, moldear y cocinar.",
    tiempo_estimado_minutos: 90,
    rendimiento_lote: 150,
    estado: "activo",
  },
];

export const getFichasTecnicas = async () => {
  return [...mockFichasTecnicas];
};

export const mockFichaTecnicaInsumos = [
  { id_ficha_insumo: 1, id_ficha: 1, id_insumo: 1, cantidad: 40, unidad_medida: 'kg' },
  { id_ficha_insumo: 2, id_ficha: 1, id_insumo: 3, cantidad: 15, unidad_medida: 'kg' },
];

export const createFichaTecnica = async (ficha) => {
  const newObj = { id_ficha: Date.now(), ...ficha };
  mockFichasTecnicas = [newObj, ...mockFichasTecnicas];
  return newObj;
};

export const updateFichaTecnica = async (id_ficha, ficha) => {
  mockFichasTecnicas = mockFichasTecnicas.map((f) => (f.id_ficha === id_ficha ? { ...f, ...ficha } : f));
  return { id_ficha, ...ficha };
};

export const deleteFichaTecnica = async (id_ficha) => {
  mockFichasTecnicas = mockFichasTecnicas.filter((f) => f.id_ficha !== id_ficha);
  return true;
};
