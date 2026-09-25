import { Router } from 'express';
import { ComprasController } from '../controllers/compras.controller.js';
import { protegerModulo } from '../middlewares/auth.middleware.js';

const router = Router();

// GET→ver, POST→crear, PUT→editar, DELETE→anular (sin borrado físico)
router.use(protegerModulo('compras', 'anular'));

router.get('/', ComprasController.getAll);
router.get('/:id', ComprasController.getById);
router.post('/', ComprasController.create);
router.put('/:id', ComprasController.update);
router.delete('/:id', ComprasController.delete);

export default router;
