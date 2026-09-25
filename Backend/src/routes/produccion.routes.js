import { Router } from 'express';
import { ProduccionController } from '../controllers/produccion.controller.js';
import { protegerModulo } from '../middlewares/auth.middleware.js';

const router = Router();

// GET→ver, POST→crear, PUT→editar, DELETE→anular (sin borrado físico)
router.use(protegerModulo('produccion', 'anular'));

router.get('/', ProduccionController.getAll);
router.get('/:id', ProduccionController.getById);
router.post('/', ProduccionController.create);
router.put('/:id', ProduccionController.update);
router.delete('/:id', ProduccionController.delete);

export default router;
