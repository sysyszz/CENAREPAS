// clientesService.js - Servicio para la gestión de clientes en Masarepas
export const mockClientes = [
  {
    id: 1,
    codigo: "CLI-001",
    nombre: "Supermercados Mercacentro S.A.",
    nit: "890.701.234-1",
    telefono: "+57 (608) 261-0000",
    email: "compras@mercacentro.com.co",
    ciudad: "Ibagué",
    tipoCliente: "Cadena de Supermercados",
    pedidosRealizados: 48,
    totalComprado: "$125.000.000",
    totalCompradoNum: 125000000,
    estado: "Activo",
  },
  {
    id: 2,
    codigo: "CLI-002",
    nombre: "Tiendas D1 Regional Tolima",
    nit: "900.234.567-8",
    telefono: "+57 (601) 742-0000",
    email: "proveedores@koba-group.com",
    ciudad: "Ibagué / Espinal",
    tipoCliente: "Cadena de Descuento",
    pedidosRealizados: 85,
    totalComprado: "$240.000.000",
    totalCompradoNum: 240000000,
    estado: "Activo",
  },
  {
    id: 3,
    codigo: "CLI-003",
    nombre: "Distribuidora Arepas Don Juan",
    nit: "901.112.334-5",
    telefono: "+57 312 456 7890",
    email: "ventas@donjuanarepas.com",
    ciudad: "Espinal",
    tipoCliente: "Distribuidor Mayorista",
    pedidosRealizados: 32,
    totalComprado: "$45.800.000",
    totalCompradoNum: 45800000,
    estado: "Activo",
  },
  {
    id: 4,
    codigo: "CLI-004",
    nombre: "Restaurantes El Arriero Tradicional",
    nit: "800.556.778-9",
    telefono: "+57 310 987 6543",
    email: "contacto@elarrierorestaurante.com",
    ciudad: "Girardot",
    tipoCliente: "HORECA / Institucional",
    pedidosRealizados: 19,
    totalComprado: "$18.200.000",
    totalCompradoNum: 18200000,
    estado: "Activo",
  },
];

export const getClientes = async () => {
  return [...mockClientes];
};

export const createCliente = async (cliente) => ({ id: Date.now(), ...cliente });
export const updateCliente = async (id, cliente) => ({ id, ...cliente });
export const deleteCliente = async (id) => true;

