import { AuthService } from '../services/auth.service.js';
import { successResponse, errorResponse } from '../utils/response.js';

export class AuthController {
  static async login(req, res, next) {
    try {
      const { email, correo, password, contrasena } = req.body;
      const userEmail = correo || email;
      const userPassword = contrasena || password;

      if (!userEmail || !userPassword) {
        return errorResponse(res, 'El correo y la contraseña son requeridos', 400);
      }

      const result = await AuthService.login(userEmail, userPassword);
      return successResponse(res, result, 'Inicio de sesión exitoso');
    } catch (error) {
      return errorResponse(res, error.message, 401);
    }
  }

  static async register(req, res, next) {
    try {
      const { name, nombre, email, correo, password, contrasena, id_rol } = req.body;
      const userName = nombre || name;
      const userEmail = correo || email;
      const userPassword = contrasena || password;

      if (!userName || !userEmail || !userPassword) {
        return errorResponse(res, 'Todos los campos (nombre, correo, contraseña) son obligatorios', 400);
      }

      const result = await AuthService.register({
        nombre: userName,
        correo: userEmail,
        contrasena: userPassword,
        id_rol,
      });

      return successResponse(res, result, 'Usuario registrado exitosamente', 201);
    } catch (error) {
      return errorResponse(res, error.message, 400);
    }
  }

  static async getProfile(req, res) {
    return successResponse(res, req.user, 'Perfil obtenido correctamente');
  }
}
