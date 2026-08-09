// clientesService.js - Servicio para la gestión de clientes
export const getClientes = async () => {
  return [];
};

export const createCliente = async (cliente) => ({ id: Date.now(), ...cliente, compras: 0, total: '$0.00', estado: 'Activo' });
export const updateCliente = async (id, cliente) => ({ id, ...cliente });
export const deleteCliente = async (id) => true;
