// pages/Login.jsx
import { useState } from 'react';
import { LogIn } from 'lucide-react';
import { AuthCard } from '../components/AuthCard';
import { AuthHeader } from '../components/AuthHeader';
import { AuthInput } from '../components/AuthInput';
import { LoadingButton } from '../components/LoadingButton';
import { useAuth } from '../hooks/useAuth';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { isLoading, handleLogin, navigate } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await handleLogin(email, password);
    if (success) {
      onLogin();
      navigate('/admin');
    }
  };

  return (
    <AuthCard>
      <AuthHeader
        icon={LogIn}
        title="Sistema Administrativo"
        subtitle="Ingresa tus credenciales para continuar"
      />

      <div className="bg-accent/10 border border-accent rounded-lg p-3 mb-6">
        <p className="text-sm text-muted-foreground text-center">
          <span className="block mb-1">Credenciales de prueba:</span>
          <span className="block">Email: <strong>admin@sistema.com</strong></span>
          <span className="block">Contraseña: <strong>123456</strong></span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <AuthInput
          label="Correo Electrónico"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="usuario@ejemplo.com"
          autoComplete="email"
        />

        <AuthInput
          label="Contraseña"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          autoComplete="current-password"
        />

        <LoadingButton isLoading={isLoading}>
          Iniciar Sesión
        </LoadingButton>

        <button
          type="button"
          onClick={() => navigate('/admin/forgot-password')}
          className="w-full text-primary text-sm hover:underline"
        >
          ¿Olvidaste tu contraseña?
        </button>
      </form>
    </AuthCard>
  );
}