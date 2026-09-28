/**
 * Reglas de negocio configurables en un solo lugar.
 */

/** Horas mínimas antes de la fecha de entrega para que el cliente anule (CA-164-001). */
export const ANTICIPACION_ANULAR_HORAS = Number(process.env.ANTICIPACION_ANULAR_HORAS || 24);

/** Sede asignada por defecto a los pedidos hechos por clientes desde la app. */
export const SEDE_PEDIDOS_CLIENTE = process.env.SEDE_PEDIDOS_CLIENTE || 'Aranjuez';

/** Costo de envío de los pedidos de la app. Desactivado (0); cambiar aquí para reactivarlo. */
export const COSTO_ENVIO = 0;

/** Municipios del Área Metropolitana del Valle de Aburrá donde se entrega (CA-158-001). */
export const MUNICIPIOS_ENTREGA = [
  'Medellín', 'Bello', 'Itagüí', 'Envigado', 'Sabaneta', 'La Estrella',
  'Caldas', 'Copacabana', 'Girardota', 'Barbosa',
];

export const ESTADOS_PEDIDO = ['Pendiente', 'En proceso', 'Entregado', 'Anulado'];

/** Transiciones permitidas del pedido (el personal). Entregado → Anulado repone stock. */
export const TRANSICIONES_PEDIDO = {
  Pendiente: ['En proceso', 'Anulado'],
  'En proceso': ['Entregado', 'Anulado'],
  Entregado: ['Anulado'],
  Anulado: [],
};

export const MEDIOS_PAGO = ['Efectivo', 'Tarjeta', 'Transferencia'];

/**
 * Días hacia atrás que el personal puede poner como fecha de un abono (e).
 * La fecha tampoco puede ser futura ni anterior a la fecha del pedido.
 */
export const ABONO_DIAS_ATRAS_MAX = 7;

export const TIPOS_DOCUMENTO = ['CC', 'CE', 'NIT', 'PP', 'TI'];

/** Comprobantes de pago (CA-159-002). */
export const COMPROBANTE_MAX_BYTES = 5 * 1024 * 1024;
export const COMPROBANTE_MIME = ['image/jpeg', 'image/png', 'application/pdf'];

export const CONTRASENA_MIN = 8;
