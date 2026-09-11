import { Router } from 'express';
import { PedidosController } from '../controllers/pedidos.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(authenticate);

router.get('/', PedidosController.getAll);
router.get('/:id', PedidosController.getById);
router.post('/', PedidosController.create);
router.put('/:id', PedidosController.update);
router.delete('/:id', PedidosController.delete);

export default router;
