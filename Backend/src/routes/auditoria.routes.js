import { Router } from 'express';
import { AuditoriaController } from '../controllers/auditoria.controller.js';

const router = Router();

router.get('/', AuditoriaController.getAll);

export default router;
