import { Router } from 'express';
import { InsumosController } from '../controllers/insumos.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/', InsumosController.getAll);
router.get('/:id', InsumosController.getById);
router.post('/', authenticate, InsumosController.create);
router.put('/:id', authenticate, InsumosController.update);
router.delete('/:id', authenticate, InsumosController.delete);

export default router;
