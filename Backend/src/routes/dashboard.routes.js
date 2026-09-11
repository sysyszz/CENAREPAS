import { Router } from 'express';
import { DashboardController } from '../controllers/dashboard.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(authenticate);

router.get('/', DashboardController.getSummary);
router.get('/metrics', DashboardController.getMetrics);
router.get('/charts', DashboardController.getCharts);

export default router;
