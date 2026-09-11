import { Router } from 'express';
import { VentasController } from '../controllers/ventas.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/', VentasController.getAll);
router.get('/:id', VentasController.getById);
router.post('/', authenticate, VentasController.create);
router.put('/:id', authenticate, VentasController.update);
router.delete('/:id', authenticate, VentasController.delete);

export default router;
