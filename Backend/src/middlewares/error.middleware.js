import { errorResponse } from '../utils/response.js';

export const errorHandler = (err, req, res, next) => {
  console.error('[Unhandled Server Error]:', err);

  const status = err.statusCode || err.status || 500;
  const message = err.message || 'Error interno en el servidor';

  return errorResponse(res, message, status, err.details || null);
};

export const notFoundHandler = (req, res) => {
  return errorResponse(res, `Ruta no encontrada: [${req.method}] ${req.originalUrl}`, 404);
};
