import { Router } from 'express';
import { uploadProductImage } from '../middlewares/upload.middleware.js';
import { successResponse, errorResponse } from '../utils/response.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';

const router = Router();

const puedeSubirImagen = authorize(
  ['productos', 'crear'], ['productos', 'editar'], ['categorias', 'crear'], ['categorias', 'editar']
);

router.post('/imagen', authenticate, puedeSubirImagen, (req, res, next) => {
  uploadProductImage.single('imagen')(req, res, (err) => {
    if (err) {
      return errorResponse(res, err.message || 'Error al subir la imagen', 400);
    }
    if (!req.file) {
      return errorResponse(res, 'No se proporcionó ningún archivo de imagen', 400);
    }

    const relativeUrl = `/uploads/productos/${req.file.filename}`;
    return successResponse(
      res,
      {
        url: relativeUrl,
        filename: req.file.filename,
        mimetype: req.file.mimetype,
        size: req.file.size,
      },
      'Imagen subida exitosamente',
      201
    );
  });
});

export default router;
