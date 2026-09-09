// pages/Register.jsx
import { useState } from 'react';
import { UserPlus } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import { AuthCard } from '../components/AuthCard';
import { AuthHeader } from '../components/AuthHeader';
import { AuthInput } from '../components/AuthInput';
import { LoadingButton } from '../components/LoadingButton';
import { useAuth } from '../hooks/useAuth';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { isLoading, navigate } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Lógica de registro aquí
    console.log({ name, email, password });
  };

  return (
    <AuthCard>
      <AuthHeader
        icon={UserPlus}
        title="Crear una cuenta"
        subtitle="Regístrate para comenzar a usar el sistema"
      />

      {/* Botón de Google */}
      <button
        type="button"
        onClick={() => console.log("Google register")}
        className="w-full flex items-center justify-center gap-3 py-2.5 px-4 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition-all shadow-sm mb-6"
      >
        <FcGoogle className="w-5 h-5" />
        <span>Registrarse con Google</span>
      </button>

      <div className="relative flex py-2 items-center mb-6">
        <div className="flex-grow border-t border-slate-200"></div>
        <span className="flex-shrink mx-4 text-xs font-medium text-slate-600 uppercase tracking-wider">o regístrate con email</span>
        <div className="flex-grow border-t border-slate-200"></div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <AuthInput
          label="Nombre Completo"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Tu Nombre"
        />

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
          autoComplete="new-password"
        />

        <LoadingButton isLoading={isLoading}>
          Registrarse
        </LoadingButton>
      </form>

      <p className="text-center text-sm text-slate-500 mt-6">
        ¿Ya tienes una cuenta?{' '}
        <button 
          type="button"
          onClick={() => navigate('/login')} 
          className="text-primary font-semibold hover:underline bg-transparent border-0 cursor-pointer"
        >
          Inicia sesión
        </button>
      </p>
    </AuthCard>
  );
}