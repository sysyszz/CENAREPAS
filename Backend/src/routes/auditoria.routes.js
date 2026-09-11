import { Router } from 'express';
import { AuditoriaController } from '../controllers/auditoria.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(authenticate);

router.get('/', AuditoriaController.getAll);

export default router;
