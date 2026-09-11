import { Router } from 'express';
import { ComprasController } from '../controllers/compras.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(authenticate);

router.get('/', ComprasController.getAll);
router.get('/:id', ComprasController.getById);
router.post('/', ComprasController.create);
router.put('/:id', ComprasController.update);
router.delete('/:id', ComprasController.delete);

export default router;
