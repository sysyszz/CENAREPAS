import { Router } from 'express';
import { authenticate, tienePermiso } from '../middlewares/auth.middleware.js';
import {
  archivoComprobante, uploadComprobante, urlComprobante, verificarFirma,
} from '../middlewares/comprobante.middleware.js';
import { successResponse, errorResponse } from '../utils/response.js';

const router = Router();

router.use(authenticate);

/**
 * POST /comprobantes (multipart, campo "comprobante"): JPG, PNG o PDF de
 * máximo 5 MB (CA-159-002). Lo sube el cliente o el personal que registra
 * abonos o pedidos.
 */
router.post('/', async (req, res, next) => {
  try {
    const puede = req.user.rol === 'Cliente'
      || (await tienePermiso(req.user.id_rol, [['abonos', 'crear'], ['pedidos', 'crear']]));
    if (!puede) return errorResponse(res, 'No tienes permiso para realizar esta acción', 403);
  } catch (error) {
    return next(error);
  }

  return uploadComprobante.single('comprobante')(req, res, (err) => {
    if (err) {
      const mensaje = err.code === 'LIMIT_FILE_SIZE' ? 'El comprobante supera el máximo de 5 MB' : err.message;
      return errorResponse(res, mensaje || 'No se pudo subir el comprobante', 400);
    }
    if (!req.file) return errorResponse(res, 'Adjunta el comprobante en el campo "comprobante"', 400);
    try {
      verificarFirma(req.file);
    } catch (error) {
      return errorResponse(res, error.message, 400);
    }
    return successResponse(res, {
      url: urlComprobante(req.file.filename),
      nombre_original: req.file.originalname,
      tipo: req.file.mimetype,
      tamano: req.file.size,
    }, 'Comprobante subido', 201);
  });
});

/** GET /comprobantes/:archivo — solo quien lo subió o el personal con abonos:ver o pedidos:ver. */
router.get('/:archivo', async (req, res, next) => {
  try {
    const archivo = archivoComprobante(req.params.archivo);
    if (!archivo) return errorResponse(res, 'Comprobante no encontrado', 404);
    const esDuenio = archivo.idUsuario === req.user.id_usuario;
    const esPersonal = req.user.rol !== 'Cliente'
      && (await tienePermiso(req.user.id_rol, [['abonos', 'ver'], ['pedidos', 'ver']]));
    if (!esDuenio && !esPersonal) return errorResponse(res, 'Comprobante no encontrado', 404);
    res.set('Cache-Control', 'private, max-age=300');
    return res.sendFile(archivo.ruta, (err) => {
      if (err && !res.headersSent) errorResponse(res, 'Comprobante no encontrado', 404);
    });
  } catch (error) {
    return next(error);
  }
});

export default router;
