import { Router } from 'express';
import { ProduccionController } from '../controllers/produccion.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(authenticate);

router.get('/', ProduccionController.getAll);
router.get('/:id', ProduccionController.getById);
router.post('/', ProduccionController.create);
router.put('/:id', ProduccionController.update);
router.delete('/:id', ProduccionController.delete);

export default router;
