import { Router } from 'express';
import { ClientesController } from '../controllers/clientes.controller.js';
import { protegerModulo } from '../middlewares/auth.middleware.js';

const router = Router();

// GET→ver, POST→crear, PUT→editar, DELETE→cambiar_estado (sin borrado físico)
router.use(protegerModulo('clientes', 'cambiar_estado'));

router.get('/', ClientesController.getAll);
router.get('/:id', ClientesController.getById);
router.post('/', ClientesController.create);
router.put('/:id', ClientesController.update);
router.delete('/:id', ClientesController.delete);

export default router;
