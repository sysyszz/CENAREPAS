import { Router } from 'express';
import { MiController } from '../controllers/mi.controller.js';
import { authenticate, requireRol } from '../middlewares/auth.middleware.js';

const router = Router();

// Solo el rol Cliente; los datos salen siempre del token.
router.use(authenticate, requireRol('Cliente'));

router.get('/pedidos', MiController.pedidos);
router.post('/pedidos', MiController.crearPedido);
router.get('/pedidos/:id', MiController.pedido);
router.post('/pedidos/:id/anular', MiController.anularPedido);

router.get('/creditos', MiController.creditos);
router.get('/creditos/:id', MiController.credito);
router.post('/creditos/:id/abonos', MiController.registrarAbono);

router.get('/notificaciones', MiController.notificaciones);
router.patch('/notificaciones/leidas', MiController.marcarTodasLeidas);
router.patch('/notificaciones/:id/leida', MiController.marcarLeida);

router.get('/perfil', MiController.perfil);
router.put('/perfil', MiController.actualizarPerfil);
router.put('/contrasena', MiController.cambiarContrasena);

export default router;
