import { Router } from 'express';
import { PedidosController } from '../controllers/pedidos.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/', PedidosController.getAll);
router.get('/:id', PedidosController.getById);
router.post('/', authenticate, PedidosController.create);
router.put('/:id', authenticate, PedidosController.update);
router.delete('/:id', authenticate, PedidosController.delete);

export default router;
