// fichasTecnicasService.js - Servicio para la gestión de fichas técnicas en Masarepas
export let mockFichasTecnicas = [
  {
    id_ficha: 1,
    nombre: "Arepa de Chócolo con Queso Campesino",
    descripcion: "Formulación tradicional de maíz chócolo tierno desgranado con mantequilla y queso fundente",
    instrucciones_preparacion: "1. Molienda de maíz chócolo con mantequilla y sal marina.\n2. Reposar la masa durante 15 minutos.\n3. Porcionar bolas de 120g y colocar centro de queso campesino.\n4. Asar a la plancha a 180°C por 8 minutos por lado hasta dorar.",
    tiempo_estimado_minutos: 60,
    rendimiento_lote: 250,
    estado: "activo",
  },
  {
    id_ficha: 2,
    nombre: "Arepa Telita Tradicional de Maíz Blanco",
    descripcion: "Arepa delgada y flexible elaborada 100% con maíz blanco trillado y pilado",
    instrucciones_preparacion: "1. Cocción de maíz blanco trillado por 45 minutos a fuego medio.\n2. Molienda fina en molino de rodillos.\n3. Amasado con agua tibia y sal refinada.\n4. Moldeo en laminadora automática y pre-asado por 4 minutos.",
    tiempo_estimado_minutos: 90,
    rendimiento_lote: 500,
    estado: "activo",
  },
  {
    id_ficha: 3,
    nombre: "Arepa Rellena de Queso Doble Crema",
    descripcion: "Arepa semigruesa precocida con núcleo abundante de queso hilado doble crema",
    instrucciones_preparacion: "1. Preparar masa homogénea de maíz blanco con mantequilla.\n2. Troquelar bases circulares de 80g.\n3. Dosificar 40g de bloque de queso doble crema central.\n4. Sellado de bordes y pre-cocción en horno continuo a 200°C.",
    tiempo_estimado_minutos: 75,
    rendimiento_lote: 300,
    estado: "activo",
  },
  {
    id_ficha: 4,
    nombre: "Arepa Santandereana con Chicharrón Crocante",
    descripcion: "Receta típica de maíz amarillo pelado con ceniza y chicharrón molido crocante",
    instrucciones_preparacion: "1. Molienda conjunta de maíz amarillo cocido y chicharrón crocante.\n2. Amasado enérgico hasta incorporar grasa natural del chicharrón.\n3. Moldeo manual rústico de 100g.\n4. Asado lento sobre tiesto refractario.",
    tiempo_estimado_minutos: 80,
    rendimiento_lote: 200,
    estado: "activo",
  },
  {
    id_ficha: 5,
    nombre: "Arepa de Yuca con Queso Costeño",
    descripcion: "Formulación suave y elástica a base de yuca fresca cocida y queso costeño curado",
    instrucciones_preparacion: "1. Cocinar la yuca hasta punto suave y retirar fibra central.\n2. Moler la yuca caliente junto con el queso costeño rallado.\n3. Agregar mantequilla y punto de sal.\n4. Formar discos de 110g y refrigerar 20 minutos antes de asar.",
    tiempo_estimado_minutos: 70,
    rendimiento_lote: 220,
    estado: "activo",
  },
  {
    id_ficha: 6,
    nombre: "Arepa Integral Multigranos y Chía",
    descripcion: "Arepa funcional baja en sodio adicionada con semillas de chía, linaza y salvado",
    instrucciones_preparacion: "1. Hidratar semillas de chía y linaza en agua tibia por 20 minutos.\n2. Mezclar con masa de maíz blanco y almidón de yuca.\n3. Laminar a espesor de 6mm y troquelar.\n4. Pre-asado sellado para empaque al vacío.",
    tiempo_estimado_minutos: 55,
    rendimiento_lote: 350,
    estado: "activo",
  },
  {
    id_ficha: 7,
    nombre: "Masa Fresca de Maíz para Molienda",
    descripcion: "Base de masa fresca lista para repostería típica y despachos a restaurantes",
    instrucciones_preparacion: "1. Lavado y cocción corta de maíz blanco seleccionado.\n2. Molienda con humedad controlada al 48%.\n3. Adición de conservante sorbato de potasio.\n4. Empaque en bloques de 2kg y 5kg sellados.",
    tiempo_estimado_minutos: 45,
    rendimiento_lote: 1000,
    estado: "activo",
  },
  {
    id_ficha: 8,
    nombre: "Arepa Paisa Asada Redonda Tradicional",
    descripcion: "Arepa neutra y delgada ideal para acompañar bandeja paisa y desayunos",
    instrucciones_preparacion: "1. Cocción de maíz blanco con agua pura sin sal añadida.\n2. Doble pasada por molino de discos.\n3. Moldeado rápido y asado en parrilla rotativa.\n4. Enfriamiento en túnel de aire antes de empaque.",
    tiempo_estimado_minutos: 85,
    rendimiento_lote: 600,
    estado: "activo",
  },
];

export const getFichasTecnicas = async () => {
  return [...mockFichasTecnicas];
};

export const mockFichaTecnicaInsumos = [
  // Ficha 1: Arepa de Chócolo
  { id_ficha_insumo: 1, id_ficha: 1, id_insumo: 2, cantidad: 35.0, unidad_medida: 'kg' },
  { id_ficha_insumo: 2, id_ficha: 1, id_insumo: 3, cantidad: 12.0, unidad_medida: 'kg' },
  { id_ficha_insumo: 3, id_ficha: 1, id_insumo: 4, cantidad: 4.5, unidad_medida: 'kg' },
  { id_ficha_insumo: 4, id_ficha: 1, id_insumo: 8, cantidad: 0.8, unidad_medida: 'kg' },
  // Ficha 2: Arepa Telita
  { id_ficha_insumo: 5, id_ficha: 2, id_insumo: 1, cantidad: 50.0, unidad_medida: 'kg' },
  { id_ficha_insumo: 6, id_ficha: 2, id_insumo: 8, cantidad: 1.2, unidad_medida: 'kg' },
  { id_ficha_insumo: 7, id_ficha: 2, id_insumo: 13, cantidad: 0.15, unidad_medida: 'kg' },
  // Ficha 3: Arepa Rellena
  { id_ficha_insumo: 8, id_ficha: 3, id_insumo: 1, cantidad: 30.0, unidad_medida: 'kg' },
  { id_ficha_insumo: 9, id_ficha: 3, id_insumo: 3, cantidad: 18.0, unidad_medida: 'kg' },
  { id_ficha_insumo: 10, id_ficha: 3, id_insumo: 4, cantidad: 3.0, unidad_medida: 'kg' },
  // Ficha 4: Arepa Santandereana
  { id_ficha_insumo: 11, id_ficha: 4, id_insumo: 2, cantidad: 25.0, unidad_medida: 'kg' },
  { id_ficha_insumo: 12, id_ficha: 4, id_insumo: 9, cantidad: 8.0, unidad_medida: 'kg' },
  { id_ficha_insumo: 13, id_ficha: 4, id_insumo: 8, cantidad: 0.6, unidad_medida: 'kg' },
  // Ficha 5: Arepa de Yuca
  { id_ficha_insumo: 14, id_ficha: 5, id_insumo: 10, cantidad: 28.0, unidad_medida: 'kg' },
  { id_ficha_insumo: 15, id_ficha: 5, id_insumo: 7, cantidad: 10.0, unidad_medida: 'kg' },
  { id_ficha_insumo: 16, id_ficha: 5, id_insumo: 4, cantidad: 2.5, unidad_medida: 'kg' },
  // Ficha 6: Arepa Integral
  { id_ficha_insumo: 17, id_ficha: 6, id_insumo: 1, cantidad: 32.0, unidad_medida: 'kg' },
  { id_ficha_insumo: 18, id_ficha: 6, id_insumo: 11, cantidad: 5.0, unidad_medida: 'kg' },
  { id_ficha_insumo: 19, id_ficha: 6, id_insumo: 12, cantidad: 3.0, unidad_medida: 'kg' },
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
