import { Router } from 'express';
import { uploadProductImage } from '../middlewares/upload.middleware.js';
import { successResponse, errorResponse } from '../utils/response.js';

const router = Router();

router.post('/imagen', (req, res, next) => {
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
