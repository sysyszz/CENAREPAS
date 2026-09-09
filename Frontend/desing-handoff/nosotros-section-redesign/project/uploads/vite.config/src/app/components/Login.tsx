import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin();
    navigate('/admin');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-lg shadow-lg p-8">
          <div className="flex items-center justify-center mb-8">
            <div className="bg-primary p-3 rounded-lg">
              <LogIn className="w-8 h-8 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-center mb-2">Sistema Administrativo</h1>
          <p className="text-center text-muted-foreground mb-6">Ingresa tus credenciales para continuar</p>

          <div className="bg-accent/10 border border-accent rounded-lg p-3 mb-6">
            <p className="text-sm text-muted-foreground text-center">
              <span className="block mb-1">Credenciales de prueba:</span>
              <span className="block">Email: <strong>admin@sistema.com</strong></span>
              <span className="block">Contraseña: <strong>123456</strong></span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-2">Correo Electrónico</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="usuario@ejemplo.com"
                required
              />
            </div>
            <div>
              <label className="block mb-2">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="••••••••"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-primary text-primary-foreground py-2 rounded-lg hover:opacity-90 transition-opacity"
            >
              Iniciar Sesión
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin/forgot-password')}
              className="w-full text-primary text-sm hover:underline"
            >
              ¿Olvidaste tu contraseña?
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
