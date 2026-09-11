import { Router } from 'express';
import { DashboardController } from '../controllers/dashboard.controller.js';

const router = Router();

router.get('/', DashboardController.getSummary);
router.get('/metrics', DashboardController.getMetrics);
router.get('/charts', DashboardController.getCharts);

export default router;
