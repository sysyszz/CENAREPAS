import { Router } from 'express';
import { SedesController } from '../controllers/sedes.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/', SedesController.getAll);
router.get('/:id', SedesController.getById);
router.post('/', authenticate, SedesController.create);
router.put('/:id', authenticate, SedesController.update);
router.delete('/:id', authenticate, SedesController.delete);

export default router;
