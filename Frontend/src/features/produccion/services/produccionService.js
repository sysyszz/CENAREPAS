// produccionService.js - Servicio para la gestión de lotes de producción en Masarepas
export let mockLotesProduccion = [
  {
    id_lote: 1,
    id_ficha: 1,
    id_usuario_responsable: 2,
    fecha_produccion: "2026-09-08",
    cantidad_producida: 500,
    estado: "finalizado",
    observaciones: "Turno mañana. Molienda óptima de chócolo tierno con queso campesino.",
  },
  {
    id_lote: 2,
    id_ficha: 2,
    id_usuario_responsable: 9,
    fecha_produccion: "2026-09-08",
    cantidad_producida: 1200,
    estado: "finalizado",
    observaciones: "Lote de arepa telita despachado a empaque primario sin novedades.",
  },
  {
    id_lote: 3,
    id_ficha: 3,
    id_usuario_responsable: 2,
    fecha_produccion: "2026-09-09",
    cantidad_producida: 600,
    estado: "finalizado",
    observaciones: "Temperatura de horno continuo calibrada a 200°C. Buena elasticidad de queso.",
  },
  {
    id_lote: 4,
    id_ficha: 4,
    id_usuario_responsable: 9,
    fecha_produccion: "2026-09-09",
    cantidad_producida: 400,
    estado: "finalizado",
    observaciones: "Chicharrón crocante con molienda homogénea.",
  },
  {
    id_lote: 5,
    id_ficha: 5,
    id_usuario_responsable: 7,
    fecha_produccion: "2026-09-09",
    cantidad_producida: 440,
    estado: "finalizado",
    observaciones: "Yuca con humedad adecuada, reposo de masa de 20 minutos.",
  },
  {
    id_lote: 6,
    id_ficha: 1,
    id_usuario_responsable: 2,
    fecha_produccion: "2026-09-10",
    cantidad_producida: 750,
    estado: "en_proceso",
    observaciones: "En etapa de asado y sellado térmico para entrega a Mercacentro.",
  },
  {
    id_lote: 7,
    id_ficha: 2,
    id_usuario_responsable: 9,
    fecha_produccion: "2026-09-10",
    cantidad_producida: 1500,
    estado: "en_proceso",
    observaciones: "Laminado continuo en marcha. Verificación de gramaje por unidad.",
  },
  {
    id_lote: 8,
    id_ficha: 6,
    id_usuario_responsable: 7,
    fecha_produccion: "2026-09-10",
    cantidad_producida: 350,
    estado: "en_proceso",
    observaciones: "Formulación integral hidratando chía y linaza.",
  },
  {
    id_lote: 9,
    id_ficha: 8,
    id_usuario_responsable: 13,
    fecha_produccion: "2026-09-11",
    cantidad_producida: 1200,
    estado: "programado",
    observaciones: "Programado para turno de madrugada 4:00 AM para abastecer panaderías.",
  },
  {
    id_lote: 10,
    id_ficha: 3,
    id_usuario_responsable: 2,
    fecha_produccion: "2026-09-11",
    cantidad_producida: 800,
    estado: "programado",
    observaciones: "Recepción de bloque de queso doble crema confirmada para la mañana.",
  },
  {
    id_lote: 11,
    id_ficha: 7,
    id_usuario_responsable: 7,
    fecha_produccion: "2026-09-11",
    cantidad_producida: 2000,
    estado: "programado",
    observaciones: "Masa fresca de maíz para distribución a piqueteaderos y asaderos.",
  },
  {
    id_lote: 12,
    id_ficha: 1,
    id_usuario_responsable: 9,
    fecha_produccion: "2026-09-12",
    cantidad_producida: 600,
    estado: "programado",
    observaciones: "Producción especial de fin de semana para Tiendas D1.",
  },
  {
    id_lote: 13,
    id_ficha: 5,
    id_usuario_responsable: 13,
    fecha_produccion: "2026-09-12",
    cantidad_producida: 450,
    estado: "programado",
    observaciones: "Arepas de yuca solicitadas por Restaurante El Arriero.",
  },
  {
    id_lote: 14,
    id_ficha: 4,
    id_usuario_responsable: 7,
    fecha_produccion: "2026-09-07",
    cantidad_producida: 300,
    estado: "finalizado",
    observaciones: "Prueba de calidad aprobada con 100% de cumplimiento sensorial.",
  },
  {
    id_lote: 15,
    id_ficha: 2,
    id_usuario_responsable: 2,
    fecha_produccion: "2026-09-06",
    cantidad_producida: 1000,
    estado: "finalizado",
    observaciones: "Lote completado y almacenado en cava de refrigeración a 4°C.",
  },
  {
    id_lote: 16,
    id_ficha: 1,
    id_usuario_responsable: 9,
    fecha_produccion: "2026-09-05",
    cantidad_producida: 200,
    estado: "anulado",
    observaciones: "Falla de suministro eléctrico en la paila de cocción. Lote descartado por control de calidad.",
  },
];

import { api } from '../../../shared/services/api.js';

export const getLotes = async () => {
  return api.get('/produccion', () => [...mockLotesProduccion]);
};

export const mockLotesProduccionInsumos = [
  { id_lote_insumo: 1, id_lote: 1, id_insumo: 2, cantidad_consumida: 70.0 },
  { id_lote_insumo: 2, id_lote: 1, id_insumo: 3, cantidad_consumida: 24.0 },
  { id_lote_insumo: 3, id_lote: 2, id_insumo: 1, cantidad_consumida: 120.0 },
  { id_lote_insumo: 4, id_lote: 3, id_insumo: 1, cantidad_consumida: 60.0 },
  { id_lote_insumo: 5, id_lote: 3, id_insumo: 3, cantidad_consumida: 36.0 },
  { id_lote_insumo: 6, id_lote: 4, id_insumo: 2, cantidad_consumida: 50.0 },
  { id_lote_insumo: 7, id_lote: 4, id_insumo: 9, cantidad_consumida: 16.0 },
  { id_lote_insumo: 8, id_lote: 5, id_insumo: 10, cantidad_consumida: 56.0 },
  { id_lote_insumo: 9, id_lote: 5, id_insumo: 7, cantidad_consumida: 20.0 },
  { id_lote_insumo: 10, id_lote: 6, id_insumo: 2, cantidad_consumida: 105.0 },
  { id_lote_insumo: 11, id_lote: 7, id_insumo: 1, cantidad_consumida: 150.0 },
  { id_lote_insumo: 12, id_lote: 8, id_insumo: 1, cantidad_consumida: 32.0 },
];

export const createLote = async (lote) => {
  return api.post('/produccion', lote, async () => {
    const newObj = {
      id_lote: Date.now(),
      fecha_produccion: new Date().toISOString().split('T')[0],
      estado: 'en_proceso',
      ...lote,
    };
    mockLotesProduccion = [newObj, ...mockLotesProduccion];
    return newObj;
  });
};

export const updateLote = async (id_lote, lote) => {
  return api.put(`/produccion/${id_lote}`, lote, async () => {
    mockLotesProduccion = mockLotesProduccion.map((l) => (l.id_lote === id_lote ? { ...l, ...lote } : l));
    return { id_lote, ...lote };
  });
};

export const anularLote = async (id_lote) => {
  return api.delete(`/produccion/${id_lote}`, async () => {
    mockLotesProduccion = mockLotesProduccion.map((l) =>
      l.id_lote === id_lote ? { ...l, estado: 'anulado' } : l
    );
    return true;
  });
};
