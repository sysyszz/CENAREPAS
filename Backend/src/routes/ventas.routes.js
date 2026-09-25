import { Router } from 'express';
import { VentasController } from '../controllers/ventas.controller.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';

const router = Router();

// Vista de solo lectura: una venta es un pedido Entregado.
router.use(authenticate);

router.get('/', authorize('ventas', 'ver'), VentasController.getAll);
router.get('/:id', authorize('ventas', 'ver'), VentasController.getById);
router.post('/', VentasController.soloLectura);
router.put('/:id', VentasController.soloLectura);
router.delete('/:id', VentasController.soloLectura);

export default router;
