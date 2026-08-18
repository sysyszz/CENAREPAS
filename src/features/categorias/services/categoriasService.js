// categoriasService.js - Servicio para la gestión de categorías en Masarepas
export const mockCategorias = [
  {
    id: 1,
    codigo: "CAT-001",
    nombre: "Arepas Dulces",
    descripcion: "Arepas a base de chócolo tierno, queso y toques dulces",
    productosCount: 4,
    estado: "Activo",
  },
  {
    id: 2,
    codigo: "CAT-002",
    nombre: "Arepas Blancas",
    descripcion: "Arepas tradicionales de maíz blanco trillado y pilado",
    productosCount: 6,
    estado: "Activo",
  },
  {
    id: 3,
    codigo: "CAT-003",
    nombre: "Arepas Rellenas",
    descripcion: "Arepas precocidas rellenas de queso doble crema y quesillo",
    productosCount: 5,
    estado: "Activo",
  },
  {
    id: 4,
    codigo: "CAT-004",
    nombre: "Arepas Especiales",
    descripcion: "Arepas saborizadas con chicharrón, especias y recetas de casa",
    productosCount: 3,
    estado: "Activo",
  },
  {
    id: 5,
    codigo: "CAT-005",
    nombre: "Derivados de Maíz",
    descripcion: "Masa molienda, peto cocido listo e insumos preelaborados",
    productosCount: 8,
    estado: "Activo",
  },
];

export const getCategorias = async () => {
  return [...mockCategorias];
};

export const createCategoria = async (categoria) => ({ id: Date.now(), ...categoria });
export const updateCategoria = async (id, categoria) => ({ id, ...categoria });
export const deleteCategoria = async (id) => true;

