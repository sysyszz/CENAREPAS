// produccionService.js - Servicio para la gestión de lotes de producción en Masarepas
export const mockLotesProduccion = [
  {
    id_lote: 1, id_ficha: 1, id_usuario_responsable: 2,
    fecha_produccion: "2024-03-15", cantidad_producida: 500,
    estado: "finalizado", observaciones: null,
  },
  {
    id_lote: 2, id_ficha: 2, id_usuario_responsable: 1,
    fecha_produccion: "2024-03-15", cantidad_producida: 1200,
    estado: "en_proceso", observaciones: null,
  },
];

export const getLotes = async () => {
  return [...mockLotesProduccion];
};

export const mockLotesProduccionInsumos = [
  { id_lote_insumo: 1, id_lote: 1, id_insumo: 1, cantidad_consumida: 40 },
  { id_lote_insumo: 2, id_lote: 1, id_insumo: 3, cantidad_consumida: 15 },
];

export const createLote = async (lote) => ({ id_lote: Date.now(), ...lote });
export const updateLote = async (id_lote, lote) => ({ id_lote, ...lote });
export const anularLote = async (id_lote) => true;

