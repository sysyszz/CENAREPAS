import { Router } from 'express';
import { InsumosController } from '../controllers/insumos.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(authenticate);

router.get('/', InsumosController.getAll);
router.get('/:id', InsumosController.getById);
router.post('/', InsumosController.create);
router.put('/:id', InsumosController.update);
router.delete('/:id', InsumosController.delete);

export default router;
