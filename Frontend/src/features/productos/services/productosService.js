// productosService.js - Servicio para la gestión de productos en Masarepas
export let mockProductos = [
  {
    id_producto: 1,
    nombre: "Arepa de Chócolo con Queso",
    descripcion: "Arepa de chócolo con queso tierno y mantequilla",
    id_categoria: 1,
    id_ficha: 1,
    id_proveedor: 1,
    precio_venta: 8500,
    imagen_url: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    stock_actual: 450,
    stock_minimo: 100,
    fecha_vencimiento: "2026-09-25",
    estado: "activo",
  },
  {
    id_producto: 2,
    nombre: "Arepa Telita Tradicional",
    descripcion: "Arepa telita tradicional de maíz blanco",
    id_categoria: 2,
    id_ficha: null,
    id_proveedor: 1,
    precio_venta: 6000,
    imagen_url: "https://images.unsplash.com/photo-1710018349908-39d998a519b0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    stock_actual: 1200,
    stock_minimo: 300,
    fecha_vencimiento: "2026-09-04",
    estado: "activo",
  },
  {
    id_producto: 3,
    nombre: "Arepa con Queso Doble Crema",
    descripcion: "Arepa precocida rellena de queso doble crema",
    id_categoria: 3,
    id_ficha: null,
    id_proveedor: 2,
    precio_venta: 11000,
    imagen_url: "https://images.unsplash.com/photo-1587603366933-aa6947174c65?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    stock_actual: 850,
    stock_minimo: 150,
    fecha_vencimiento: "2026-10-15",
    estado: "activo",
  },
  {
    id_producto: 4,
    nombre: "Arepa Santandereana con Chicharrón",
    descripcion: "Arepa artesanal con trozos de chicharrón crocante",
    id_categoria: 4,
    id_ficha: null,
    id_proveedor: 1,
    precio_venta: 9500,
    imagen_url: "https://images.unsplash.com/photo-1644753787067-d62ae70f303d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    stock_actual: 80,
    stock_minimo: 100,
    fecha_vencimiento: "2026-08-25",
    estado: "activo",
  },
  {
    id_producto: 5,
    nombre: "Peto Cocido Congelado",
    descripcion: "Maíz peto cocido listo para preparar",
    id_categoria: 5,
    id_ficha: null,
    id_proveedor: 1,
    precio_venta: 4500,
    imagen_url: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    stock_actual: 300,
    stock_minimo: 50,
    fecha_vencimiento: "2026-12-01",
    estado: "activo",
  },
];

export const getProductos = async () => {
  return [...mockProductos];
};

export const createProducto = async (producto) => {
  const newObj = {
    id_producto: Date.now(),
    estado: 'activo',
    ...producto,
  };
  mockProductos = [newObj, ...mockProductos];
  return newObj;
};

export const updateProducto = async (id_producto, producto) => {
  mockProductos = mockProductos.map((p) => (p.id_producto === id_producto ? { ...p, ...producto } : p));
  return { id_producto, ...producto };
};

export const deleteProducto = async (id_producto) => {
  mockProductos = mockProductos.filter((p) => p.id_producto !== id_producto);
  return true;
};


