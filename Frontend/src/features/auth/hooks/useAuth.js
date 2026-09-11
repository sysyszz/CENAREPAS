import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../../shared/services/api.js';

export const useAuth = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const simulateApiCall = async (duration = 500) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, duration));
    setIsLoading(false);
  };

  const handleLogin = async (email, password) => {
    setError('');
    setIsLoading(true);
    try {
      const res = await api.post('/auth/login', { correo: email, contrasena: password }, async () => {
        await simulateApiCall(300);
        return {
          token: 'mock-jwt-token-cenarepas-admin',
          usuario: {
            id_usuario: 1,
            nombre: 'Carlos Gómez',
            correo: email || 'carlos.gomez@masarepas.com',
            rol: 'Administrador de Planta'
          }
        };
      });

      if (res?.token) {
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.usuario || { correo: email }));
      }
      setIsLoading(false);
      return true;
    } catch (err) {
      setIsLoading(false);
      setError(err.message || 'Credenciales inválidas');
      return false;
    }
  };


  const handleForgotPassword = async (email) => {
    setError('');
    await simulateApiCall();
    return true;
  };

  const handleVerifyCode = async (code) => {
    setError('');
    await simulateApiCall();
    return true;
  };

  const handleResetPassword = async (newPassword, confirmPassword) => {
    setError('');
    
    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return false;
    }

    if (newPassword.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return false;
    }

    await simulateApiCall();
    return true;
  };

  return {
    isLoading,
    error,
    setError,
    handleLogin,
    handleForgotPassword,
    handleVerifyCode,
    handleResetPassword,
    navigate,
  };
};