import { Router } from 'express';
import { ClientesController } from '../controllers/clientes.controller.js';

const router = Router();

router.get('/', ClientesController.getAll);
router.get('/:id', ClientesController.getById);
router.post('/', ClientesController.create);
router.put('/:id', ClientesController.update);
router.delete('/:id', ClientesController.delete);

export default router;
