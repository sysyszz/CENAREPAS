import { Router } from 'express';
import { SedesController } from '../controllers/sedes.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(authenticate);

router.get('/', SedesController.getAll);
router.get('/:id', SedesController.getById);
router.post('/', SedesController.create);
router.put('/:id', SedesController.update);
router.delete('/:id', SedesController.delete);

export default router;
