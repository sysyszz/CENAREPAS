// productosService.js - Servicio para la gestión de productos en Masarepas
export const mockProductos = [
  {
    id_producto: 1,
    nombre: "Arepa de Chócolo con Queso",
    descripcion: "Arepa de chócolo con queso",
    id_categoria: 1,
    id_ficha: 1,
    id_proveedor: 1,
    precio_venta: 8500,
    imagen_url: null,
    stock_actual: 450,
    stock_minimo: 100,
    fecha_vencimiento: null,
    estado: "activo",
  },
  {
    id_producto: 2,
    nombre: "Arepa Telita Tradicional",
    descripcion: "Arepa telita tradicional",
    id_categoria: 2,
    id_ficha: null,
    id_proveedor: 1,
    precio_venta: 6000,
    imagen_url: null,
    stock_actual: 1200,
    stock_minimo: 300,
    fecha_vencimiento: null,
    estado: "activo",
  },
  {
    id_producto: 3,
    nombre: "Arepa con Queso Doble Crema",
    descripcion: "Arepa con queso doble crema",
    id_categoria: 3,
    id_ficha: null,
    id_proveedor: 2,
    precio_venta: 11000,
    imagen_url: null,
    stock_actual: 850,
    stock_minimo: 150,
    fecha_vencimiento: null,
    estado: "activo",
  },
  {
    id_producto: 4,
    nombre: "Arepa Santandereana con Chicharrón",
    descripcion: "Arepa santandereana con chicharrón",
    id_categoria: 4,
    id_ficha: null,
    id_proveedor: 1,
    precio_venta: 9500,
    imagen_url: null,
    stock_actual: 80,
    stock_minimo: 100,
    fecha_vencimiento: null,
    estado: "activo",
  },
  {
    id_producto: 5,
    nombre: "Peto Cocido Congelado",
    descripcion: "Peto cocido congelado",
    id_categoria: 5,
    id_ficha: null,
    id_proveedor: 1,
    precio_venta: 4500,
    imagen_url: null,
    stock_actual: 300,
    stock_minimo: 50,
    fecha_vencimiento: null,
    estado: "activo",
  },
];

export const getProductos = async () => {
  return [...mockProductos];
};

export const createProducto = async (producto) => ({ id_producto: Date.now(), ...producto });
export const updateProducto = async (id_producto, producto) => ({ id_producto, ...producto });
export const deleteProducto = async (id_producto) => true;

