import { Router } from 'express';
import { FichasTecnicasController } from '../controllers/fichasTecnicas.controller.js';
import { protegerModulo } from '../middlewares/auth.middleware.js';

const router = Router();

// GET->ver, POST->crear, PUT->editar, DELETE->cambiar_estado (sin borrado físico)
router.use(protegerModulo('fichas-tecnicas', 'cambiar_estado'));

router.get('/', FichasTecnicasController.getAll);
router.get('/:id/auditoria', FichasTecnicasController.getAuditoria);
router.get('/:id', FichasTecnicasController.getById);
router.post('/', FichasTecnicasController.create);
router.put('/:id', FichasTecnicasController.update);
router.delete('/:id', FichasTecnicasController.delete);

export default router;