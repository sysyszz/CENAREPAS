// categoriasService.js - Servicio para la gestión de categorías en Masarepas
export let mockCategorias = [
  {
    id_categoria: 1,
    nombre: "Arepas Dulces de Chócolo",
    descripcion: "Arepas a base de maíz chócolo tierno, queso campesino y toques de mantequilla artesanal",
    estado: "activo",
  },
  {
    id_categoria: 2,
    nombre: "Arepas Blancas Tradicionales",
    descripcion: "Arepas tradicionales de puro maíz blanco trillado, pilado y asado a fuego lento",
    estado: "activo",
  },
  {
    id_categoria: 3,
    nombre: "Arepas Rellenas de Queso",
    descripcion: "Arepas precocidas con abundante relleno de queso doble crema y quesillo fundente",
    estado: "activo",
  },
  {
    id_categoria: 4,
    nombre: "Arepas Especiales y Gourmet",
    descripcion: "Arepas saborizadas con chicharrón crocante, tocineta, finas hierbas y recetas de casa",
    estado: "activo",
  },
  {
    id_categoria: 5,
    nombre: "Derivados y Masas de Maíz",
    descripcion: "Masa fresca molienda de maíz blanco y amarillo, peto cocido listo e insumos base",
    estado: "activo",
  },
  {
    id_categoria: 6,
    nombre: "Arepas Integrales y Saludables",
    descripcion: "Arepas de maíz con semillas de chía, linaza, quinua y bajo contenido de sodio",
    estado: "activo",
  },
  {
    id_categoria: 7,
    nombre: "Arepas de Yuca y Especialidades",
    descripcion: "Arepas artesanales elaboradas a base de yuca y queso costeño rallado",
    estado: "activo",
  },
  {
    id_categoria: 8,
    nombre: "Línea Institucional y HORECA",
    descripcion: "Presentaciones al por mayor para restaurantes, hoteles y distribuidores mayoristas",
    estado: "activo",
  },
];

import { api } from '../../../shared/services/api.js';

export const getCategorias = async () => {
  return api.get('/categorias', () => [...mockCategorias]);
};

export const createCategoria = async (categoria) => {
  return api.post('/categorias', categoria, async () => {
    const newObj = {
      id_categoria: Date.now(),
      estado: 'activo',
      ...categoria,
    };
    mockCategorias.push(newObj);
    return newObj;
  });
};

export const updateCategoria = async (id_categoria, categoria) => {
  return api.put(`/categorias/${id_categoria}`, categoria, async () => {
    return { id_categoria, ...categoria };
  });
};

export const deleteCategoria = async (id_categoria) => {
  return api.delete(`/categorias/${id_categoria}`, async () => true);
};

