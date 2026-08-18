// productosService.js - Servicio para la gestión de productos en Masarepas
export const mockProductos = [
  {
    id: 1,
    codigo: "PROD-001",
    nombre: "Arepa de Chócolo con Queso",
    categoria: "Arepas Dulces",
    unidadMedida: "Paquete x 5 un (500g)",
    precio: "$8.500",
    precioNum: 8500,
    stock: 450,
    stockMinimo: 100,
    estado: "Disponible",
  },
  {
    id: 2,
    codigo: "PROD-002",
    nombre: "Arepa Telita Tradicional",
    categoria: "Arepas Blancas",
    unidadMedida: "Paquete x 10 un (800g)",
    precio: "$6.000",
    precioNum: 6000,
    stock: 1200,
    stockMinimo: 300,
    estado: "Disponible",
  },
  {
    id: 3,
    codigo: "PROD-003",
    nombre: "Arepa con Queso Doble Crema",
    categoria: "Arepas Rellenas",
    unidadMedida: "Paquete x 5 un (600g)",
    precio: "$11.000",
    precioNum: 11000,
    stock: 850,
    stockMinimo: 150,
    estado: "Disponible",
  },
  {
    id: 4,
    codigo: "PROD-004",
    nombre: "Arepa Santandereana con Chicharrón",
    categoria: "Arepas Especiales",
    unidadMedida: "Paquete x 5 un (550g)",
    precio: "$9.500",
    precioNum: 9500,
    stock: 80,
    stockMinimo: 100,
    estado: "Bajo Stock",
  },
  {
    id: 5,
    codigo: "PROD-005",
    nombre: "Peto Cocido Congelado",
    categoria: "Derivados de Maíz",
    unidadMedida: "Bolsa x 1kg",
    precio: "$4.500",
    precioNum: 4500,
    stock: 300,
    stockMinimo: 50,
    estado: "Disponible",
  },
];

export const getProductos = async () => {
  return [...mockProductos];
};

export const createProducto = async (producto) => ({ id: Date.now(), ...producto });
export const updateProducto = async (id, producto) => ({ id, ...producto });
export const deleteProducto = async (id) => true;

