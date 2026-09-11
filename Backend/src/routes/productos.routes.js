import { Router } from 'express';
import { ProductosController } from '../controllers/productos.controller.js';

const router = Router();

router.get('/', ProductosController.getAll);
router.get('/:id', ProductosController.getById);
router.post('/', ProductosController.create);
router.put('/:id', ProductosController.update);
router.delete('/:id', ProductosController.delete);

export default router;
