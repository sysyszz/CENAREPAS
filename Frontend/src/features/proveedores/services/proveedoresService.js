// proveedoresService.js - Servicio para la gestión de proveedores en Masarepas
export let mockProveedores = [
  {
    id_proveedor: 1,
    nombre: "Agrícola del Valle & Maíz del Tolima S.A.S.",
    nit: "890.123.456-7",
    telefono: "+57 (608) 264-5566",
    correo: "ventas@agricoladelvalle.com.co",
    direccion: "Km 4 Vía Espinal - Ibagué, Tolima",
    estado: "activo",
    fecha_creacion: "2024-01-15T08:00:00",
  },
  {
    id_proveedor: 2,
    nombre: "Lácteos y Quesillos El Campesino",
    nit: "900.567.890-1",
    telefono: "+57 (608) 248-2211",
    correo: "pedidos@lacteoselcampesino.com",
    direccion: "Carrera 5 # 18-42, Espinal, Tolima",
    estado: "activo",
    fecha_creacion: "2024-01-20T09:30:00",
  },
  {
    id_proveedor: 3,
    nombre: "Plásticos & Empaques San José Ltda.",
    nit: "800.998.877-6",
    telefono: "+57 (601) 555-9988",
    correo: "comercial@plasticossanjose.com",
    direccion: "Zona Industrial Cazucá, Soacha",
    estado: "activo",
    fecha_creacion: "2024-02-01T10:15:00",
  },
  {
    id_proveedor: 4,
    nombre: "Distribuidora Agropecuaria Los Andes",
    nit: "901.345.678-2",
    telefono: "+57 315 777 8899",
    correo: "contacto@distribuidoradelcampo.co",
    direccion: "Calle 14 # 8-30, Girardot, Cundinamarca",
    estado: "activo",
    fecha_creacion: "2024-02-10T11:00:00",
  },
  {
    id_proveedor: 5,
    nombre: "Molinos & Granos de Colombia S.A.",
    nit: "860.002.314-5",
    telefono: "+57 (601) 360-1200",
    correo: "institucional@molinoscolombia.com",
    direccion: "Av. Américas # 65-10, Bogotá D.C.",
    estado: "activo",
    fecha_creacion: "2024-02-18T14:20:00",
  },
  {
    id_proveedor: 6,
    nombre: "Quesos del Caquetá & Sabana",
    nit: "900.812.443-9",
    telefono: "+57 318 654 3210",
    correo: "pedidos@quesosdelcaqueta.com",
    direccion: "Km 2 Vía Neiva, Aipe, Huila",
    estado: "activo",
    fecha_creacion: "2024-03-01T08:45:00",
  },
  {
    id_proveedor: 7,
    nombre: "Salinera & Condimentos del Caribe",
    nit: "800.221.789-0",
    telefono: "+57 (605) 385-4400",
    correo: "ventas@salineradelcaribe.com.co",
    direccion: "Vía 40 # 73-290, Barranquilla",
    estado: "activo",
    fecha_creacion: "2024-03-05T07:00:00",
  },
  {
    id_proveedor: 8,
    nombre: "Mantequillas & Grasas El Trébol S.A.S.",
    nit: "901.112.980-3",
    telefono: "+57 (602) 667-8890",
    correo: "servicio@grasaseltrebol.com",
    direccion: "Parque Industrial Yumbo, Valle",
    estado: "activo",
    fecha_creacion: "2024-03-10T09:15:00",
  },
  {
    id_proveedor: 9,
    nombre: "Envases Biodegradables Ecofresh",
    nit: "901.445.670-8",
    telefono: "+57 320 890 1234",
    correo: "eco@ecofreshpackaging.com",
    direccion: "Calle 80 # 69-45, Bogotá D.C.",
    estado: "activo",
    fecha_creacion: "2024-03-15T10:00:00",
  },
  {
    id_proveedor: 10,
    nombre: "Carnes & Chicharrones La Granja S.A.",
    nit: "890.334.551-2",
    telefono: "+57 (604) 448-9900",
    correo: "abastecimiento@lagranjacarnicos.com",
    direccion: "Autopista Norte Km 18, Copacabana, Antioquia",
    estado: "activo",
    fecha_creacion: "2024-03-20T11:30:00",
  },
  {
    id_proveedor: 11,
    nombre: "Aditivos e Insumos Alimenticios Prodal",
    nit: "830.098.112-4",
    telefono: "+57 (601) 412-5566",
    correo: "calidad@prodalquimicos.com",
    direccion: "Calle 17 # 38-20, Paloquemao, Bogotá",
    estado: "activo",
    fecha_creacion: "2024-03-25T08:00:00",
  },
  {
    id_proveedor: 12,
    nombre: "Transportes & Refrigerados Tolima Express",
    nit: "900.672.339-1",
    telefono: "+57 311 450 7890",
    correo: "operaciones@tolimaexpress.com",
    direccion: "Terminal de Carga Bodega 4, Ibagué",
    estado: "activo",
    fecha_creacion: "2024-04-01T09:00:00",
  },
  {
    id_proveedor: 13,
    nombre: "Gas & Energía Industrial del Centro",
    nit: "800.145.890-7",
    telefono: "+57 (608) 270-3000",
    correo: "cuentas@gasdelcentro.com.co",
    direccion: "Cra 5 # 39-50, Ibagué",
    estado: "activo",
    fecha_creacion: "2024-04-05T07:30:00",
  },
  {
    id_proveedor: 14,
    nombre: "Agroinsumos La Cosecha Dorada",
    nit: "901.789.234-5",
    telefono: "+57 314 567 8901",
    correo: "pedidos@cosechadorada.com",
    direccion: "Vereda La Chamba, Guamo, Tolima",
    estado: "activo",
    fecha_creacion: "2024-04-10T14:00:00",
  },
  {
    id_proveedor: 15,
    nombre: "Suministros Industriales & Limpieza CleanPro",
    nit: "900.456.123-0",
    telefono: "+57 (608) 261-7788",
    correo: "ventas@cleanproind.com",
    direccion: "Calle 25 # 4A-12, Ibagué",
    estado: "inactivo",
    fecha_creacion: "2024-04-15T16:00:00",
  },
  {
    id_proveedor: 16,
    nombre: "Etiquetas & Rotulados Gráficos del Tolima",
    nit: "890.702.445-6",
    telefono: "+57 (608) 263-1122",
    correo: "graficas@graficastolima.com",
    direccion: "Cra 3 # 12-40, Centro, Ibagué",
    estado: "activo",
    fecha_creacion: "2024-04-20T08:30:00",
  },
];

import { api } from '../../../shared/services/api.js';

export const getProveedores = async () => {
  return api.get('/proveedores', () => [...mockProveedores]);
};

export const createProveedor = async (proveedor) => {
  return api.post('/proveedores', proveedor, async () => {
    const newObj = {
      id_proveedor: Date.now(),
      fecha_creacion: new Date().toISOString(),
      estado: 'activo',
      ...proveedor,
    };
    mockProveedores = [newObj, ...mockProveedores];
    return newObj;
  });
};

export const updateProveedor = async (id_proveedor, proveedor) => {
  return api.put(`/proveedores/${id_proveedor}`, proveedor, async () => {
    mockProveedores = mockProveedores.map((p) => (p.id_proveedor === id_proveedor ? { ...p, ...proveedor } : p));
    return { id_proveedor, ...proveedor };
  });
};

export const deleteProveedor = async (id_proveedor) => {
  return api.delete(`/proveedores/${id_proveedor}`, async () => {
    mockProveedores = mockProveedores.filter((p) => p.id_proveedor !== id_proveedor);
    return true;
  });
};

