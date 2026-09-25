import { Router } from 'express';
import { SedesController } from '../controllers/sedes.controller.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(authenticate);

// Pedidos y ventas necesitan la lista de sedes para asignar la entrega.
const verSedes = authorize(['sedes', 'ver'], ['pedidos', 'ver'], ['ventas', 'ver']);
router.get('/', verSedes, SedesController.getAll);
router.get('/:id', verSedes, SedesController.getById);
router.post('/', authorize('sedes', 'crear'), SedesController.create);
router.put('/:id', authorize('sedes', 'editar'), SedesController.update);
router.delete('/:id', authorize('sedes', 'cambiar_estado'), SedesController.delete);

export default router;
