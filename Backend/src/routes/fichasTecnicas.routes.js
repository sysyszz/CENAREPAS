import { Router } from 'express';
import { FichasTecnicasController } from '../controllers/fichasTecnicas.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(authenticate);

router.get('/', FichasTecnicasController.getAll);
router.get('/:id', FichasTecnicasController.getById);
router.post('/', FichasTecnicasController.create);
router.put('/:id', FichasTecnicasController.update);
router.delete('/:id', FichasTecnicasController.delete);

export default router;
