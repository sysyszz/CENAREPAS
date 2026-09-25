/** Error con código HTTP; el errorHandler global responde con ese status. */
export class HttpError extends Error {
  constructor(statusCode, message, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
  }
}

export const badRequest = (message, details) => new HttpError(400, message, details);
export const forbidden = (message = 'No tienes permiso para realizar esta acción') => new HttpError(403, message);
export const notFound = (message = 'Recurso no encontrado') => new HttpError(404, message);
export const conflict = (message) => new HttpError(409, message);
