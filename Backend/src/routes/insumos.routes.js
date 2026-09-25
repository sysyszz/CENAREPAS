import { Router } from 'express';
import { InsumosController } from '../controllers/insumos.controller.js';
import { protegerModulo } from '../middlewares/auth.middleware.js';

const router = Router();

// GET→ver, POST→crear, PUT→editar, DELETE→cambiar_estado (sin borrado físico)
router.use(protegerModulo('insumos', 'cambiar_estado'));

router.get('/', InsumosController.getAll);
router.get('/:id', InsumosController.getById);
router.post('/', InsumosController.create);
router.put('/:id', InsumosController.update);
router.delete('/:id', InsumosController.delete);

export default router;
