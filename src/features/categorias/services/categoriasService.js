// categoriasService.js - Servicio para la gestión de categorías en Masarepas
export const mockCategorias = [
  {
    id_categoria: 1,
    nombre: "Arepas Dulces",
    descripcion: "Arepas a base de chócolo tierno, queso y toques dulces",
    estado: "activo",
  },
  {
    id_categoria: 2,
    nombre: "Arepas Blancas",
    descripcion: "Arepas tradicionales de maíz blanco trillado y pilado",
    estado: "activo",
  },
  {
    id_categoria: 3,
    nombre: "Arepas Rellenas",
    descripcion: "Arepas precocidas rellenas de queso doble crema y quesillo",
    estado: "activo",
  },
  {
    id_categoria: 4,
    nombre: "Arepas Especiales",
    descripcion: "Arepas saborizadas con chicharrón, especias y recetas de casa",
    estado: "activo",
  },
  {
    id_categoria: 5,
    nombre: "Derivados de Maíz",
    descripcion: "Masa molienda, peto cocido listo e insumos preelaborados",
    estado: "activo",
  },
];

export const getCategorias = async () => {
  return [...mockCategorias];
};

export const createCategoria = async (categoria) => ({ id_categoria: Date.now(), ...categoria });
export const updateCategoria = async (id_categoria, categoria) => ({ id_categoria, ...categoria });
export const deleteCategoria = async (id_categoria) => true;

