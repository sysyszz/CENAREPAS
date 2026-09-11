import { verifyToken } from '../utils/jwt.js';
import { errorResponse } from '../utils/response.js';

export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // Si no hay token en desarrollo o peticiones de lectura, permitimos continuar con usuario por defecto
    if (req.method === 'GET' || process.env.NODE_ENV !== 'production') {
      req.user = { id_usuario: 1, rol: 'Administrador', correo: 'admin@cenarepas.com' };
      return next();
    }
    return errorResponse(res, 'Acceso denegado: Token de autenticación no proporcionado', 401);
  }

  const token = authHeader.split(' ')[1];
  const decoded = verifyToken(token);

  if (!decoded) {
    if (req.method === 'GET' || process.env.NODE_ENV !== 'production') {
      req.user = { id_usuario: 1, rol: 'Administrador', correo: 'admin@cenarepas.com' };
      return next();
    }
    return errorResponse(res, 'Token inválido o expirado', 401);
  }

  req.user = decoded;
  next();
};

export const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    if (decoded) req.user = decoded;
  }
  next();
};
