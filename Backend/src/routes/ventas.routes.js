import { Router } from 'express';
import { VentasController } from '../controllers/ventas.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(authenticate);

router.get('/', VentasController.getAll);
router.get('/:id', VentasController.getById);
router.post('/', VentasController.create);
router.put('/:id', VentasController.update);
router.delete('/:id', VentasController.delete);

export default router;
