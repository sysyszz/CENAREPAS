import { Router } from 'express';
import { FichasTecnicasController } from '../controllers/fichasTecnicas.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/', FichasTecnicasController.getAll);
router.get('/:id', FichasTecnicasController.getById);
router.post('/', authenticate, FichasTecnicasController.create);
router.put('/:id', authenticate, FichasTecnicasController.update);
router.delete('/:id', authenticate, FichasTecnicasController.delete);

export default router;
