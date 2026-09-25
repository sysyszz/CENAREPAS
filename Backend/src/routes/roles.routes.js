import { Router } from 'express';
import { RolesController } from '../controllers/roles.controller.js';
import { protegerModulo } from '../middlewares/auth.middleware.js';

const router = Router();

// GET→ver, POST→crear, PUT→editar, DELETE→eliminar (sin borrado físico)
router.use(protegerModulo('roles', 'eliminar'));

router.get('/', RolesController.getAll);
router.get('/:id', RolesController.getById);
router.post('/', RolesController.create);
router.put('/:id', RolesController.update);
router.delete('/:id', RolesController.delete);

export default router;
