// clientesService.js - Servicio para la gestión de clientes en Masarepas
export const mockClientes = [
  {
    id_cliente: 1,
    nombre: "Supermercados Mercacentro S.A.",
    documento: "8907012341",
    telefono: "+57 (608) 261-0000",
    correo: "compras@mercacentro.com.co",
    direccion: "Ibagué",
    estado: "activo",
    fecha_creacion: "2024-01-15T00:00:00",
  },
  {
    id_cliente: 2,
    nombre: "Tiendas D1 Regional Tolima",
    documento: "9002345678",
    telefono: "+57 (601) 742-0000",
    correo: "proveedores@koba-group.com",
    direccion: "Ibagué / Espinal",
    estado: "activo",
    fecha_creacion: "2024-01-20T00:00:00",
  },
  {
    id_cliente: 3,
    nombre: "Distribuidora Arepas Don Juan",
    documento: "9011123345",
    telefono: "+57 312 456 7890",
    correo: "ventas@donjuanarepas.com",
    direccion: "Espinal",
    estado: "activo",
    fecha_creacion: "2024-02-01T00:00:00",
  },
  {
    id_cliente: 4,
    nombre: "Restaurantes El Arriero Tradicional",
    documento: "8005567789",
    telefono: "+57 310 987 6543",
    correo: "contacto@elarrierorestaurante.com",
    direccion: "Girardot",
    estado: "activo",
    fecha_creacion: "2024-02-10T00:00:00",
  },
];

export const getClientes = async () => {
  return [...mockClientes];
};

export const createCliente = async (cliente) => ({ id_cliente: Date.now(), ...cliente });
export const updateCliente = async (id_cliente, cliente) => ({ id_cliente, ...cliente });
export const deleteCliente = async (id_cliente) => true;

