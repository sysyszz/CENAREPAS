import { Router } from 'express';
import { PedidosController } from '../controllers/pedidos.controller.js';
import { protegerModulo } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(protegerModulo('pedidos', 'anular'));

router.get('/', PedidosController.getAll);
router.get('/:id', PedidosController.getById);
router.post('/', PedidosController.create);
router.put('/:id', PedidosController.update);
router.delete('/:id', PedidosController.delete);

export default router;
