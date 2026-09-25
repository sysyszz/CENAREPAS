import { Router } from 'express';
import { ProveedoresController } from '../controllers/proveedores.controller.js';
import { protegerModulo } from '../middlewares/auth.middleware.js';

const router = Router();

// GET→ver, POST→crear, PUT→editar, DELETE→cambiar_estado (sin borrado físico)
router.use(protegerModulo('proveedores', 'cambiar_estado'));

router.get('/', ProveedoresController.getAll);
router.get('/:id', ProveedoresController.getById);
router.post('/', ProveedoresController.create);
router.put('/:id', ProveedoresController.update);
router.delete('/:id', ProveedoresController.delete);

export default router;
