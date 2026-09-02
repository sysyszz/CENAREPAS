// hooks/useAuth.js
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const simulateApiCall = async (duration = 1500) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, duration));
    setIsLoading(false);
  };

  const handleLogin = async (email, password) => {
    setError('');
    await simulateApiCall();
    // Aquí iría la lógica real de autenticación
    return true;
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