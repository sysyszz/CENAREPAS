import { Router } from 'express';
import { ComprasController } from '../controllers/compras.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/', ComprasController.getAll);
router.get('/:id', ComprasController.getById);
router.post('/', authenticate, ComprasController.create);
router.put('/:id', authenticate, ComprasController.update);
router.delete('/:id', authenticate, ComprasController.delete);

export default router;
