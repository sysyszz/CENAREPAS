import { Router } from 'express';
import { ProveedoresController } from '../controllers/proveedores.controller.js';

const router = Router();

router.get('/', ProveedoresController.getAll);
router.get('/:id', ProveedoresController.getById);
router.post('/', ProveedoresController.create);
router.put('/:id', ProveedoresController.update);
router.delete('/:id', ProveedoresController.delete);

export default router;
