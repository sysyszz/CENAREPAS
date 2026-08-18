// produccionService.js - Servicio para la gestión de lotes de producción en Masarepas
export const mockLotesProduccion = [
  {
    id: 1,
    codigo: "LOT-2024-001",
    producto: "Arepa de Chócolo con Queso",
    cantidadProgramada: "500 paquetes",
    cantidadObtenida: "498 paquetes",
    fechaProduccion: "2024-03-15",
    turno: "Mañana (06:00 - 14:00)",
    supervisor: "María Fernanda Rojas",
    estado: "Finalizado",
  },
  {
    id: 2,
    codigo: "LOT-2024-002",
    producto: "Arepa Telita Tradicional",
    cantidadProgramada: "1.200 paquetes",
    cantidadObtenida: "En proceso...",
    fechaProduccion: "2024-03-15",
    turno: "Tarde (14:00 - 22:00)",
    supervisor: "Carlos Eduardo Gómez",
    estado: "En Proceso",
  },
  {
    id: 3,
    codigo: "LOT-2024-003",
    producto: "Arepa con Queso Doble Crema",
    cantidadProgramada: "800 paquetes",
    cantidadObtenida: "Pendiente",
    fechaProduccion: "2024-03-16",
    turno: "Mañana (06:00 - 14:00)",
    supervisor: "María Fernanda Rojas",
    estado: "Programado",
  },
  {
    id: 4,
    codigo: "LOT-2024-004",
    producto: "Peto Cocido Congelado",
    cantidadProgramada: "300 bolsas",
    cantidadObtenida: "300 bolsas",
    fechaProduccion: "2024-03-14",
    turno: "Noche (22:00 - 06:00)",
    supervisor: "Jorge Eliecer Restrepo",
    estado: "Finalizado",
  },
];

export const getLotes = async () => {
  return [...mockLotesProduccion];
};

export const createLote = async (lote) => ({ id: Date.now(), ...lote });
export const updateLote = async (id, lote) => ({ id, ...lote });
export const anularLote = async (id) => true;

