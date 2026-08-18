// fichasTecnicasService.js - Servicio para la gestión de fichas técnicas en Masarepas
export const mockFichasTecnicas = [
  {
    id: 1,
    codigo: "FT-001",
    producto: "Arepa de Chócolo con Queso",
    version: "v2.1",
    rendimientoEsperado: "100 paquetes (500 un)",
    vidaUtil: "30 días congelado (-18°C)",
    insumosClave: "Chócolo (40kg), Queso Doble Crema (15kg), Mantequilla (2kg)",
    estado: "Vigente",
    fechaActualizacion: "2024-02-15",
  },
  {
    id: 2,
    codigo: "FT-002",
    producto: "Arepa Telita Tradicional",
    version: "v1.5",
    rendimientoEsperado: "150 paquetes (1500 un)",
    vidaUtil: "45 días al vacío (-18°C)",
    insumosClave: "Maíz Blanco Trillado (50kg), Sal industrial (1.5kg)",
    estado: "Vigente",
    fechaActualizacion: "2024-01-20",
  },
  {
    id: 3,
    codigo: "FT-003",
    producto: "Arepa con Queso Doble Crema",
    version: "v3.0",
    rendimientoEsperado: "120 paquetes (600 un)",
    vidaUtil: "30 días congelado (-18°C)",
    insumosClave: "Maíz Blanco (40kg), Queso Doble Crema (20kg)",
    estado: "Vigente",
    fechaActualizacion: "2024-03-01",
  },
  {
    id: 4,
    codigo: "FT-004",
    producto: "Peto Cocido Congelado",
    version: "v1.0",
    rendimientoEsperado: "80 bolsas (1kg c/u)",
    vidaUtil: "60 días congelado (-18°C)",
    insumosClave: "Maíz Peto Blanco (30kg), Bicarbonato de sodio (0.2kg)",
    estado: "Vigente",
    fechaActualizacion: "2024-02-10",
  },
];

export const getFichasTecnicas = async () => {
  return [...mockFichasTecnicas];
};

export const createFichaTecnica = async (ficha) => ({ id: Date.now(), ...ficha });
export const updateFichaTecnica = async (id, ficha) => ({ id, ...ficha });
export const deleteFichaTecnica = async (id) => true;

