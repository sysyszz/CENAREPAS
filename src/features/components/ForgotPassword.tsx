import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, Check } from 'lucide-react';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState<'email' | 'code' | 'password' | 'success'>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    setStep('code');
  };

  const handleCodeChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      if (value && index < 5) {
        const nextInput = document.getElementById(`code-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    setStep('password');
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (newPassword.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    setStep('success');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-lg shadow-lg p-8">
          {step !== 'success' && (
            <button
              onClick={() => step === 'email' ? navigate('/admin/login') : setStep(step === 'code' ? 'email' : 'code')}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver
            </button>
          )}

          {step === 'email' && (
            <>
              <div className="flex items-center justify-center mb-8">
                <div className="bg-primary/10 p-3 rounded-lg">
                  <Mail className="w-8 h-8 text-primary" />
                </div>
              </div>
              <h1 className="text-center mb-2">¿Olvidaste tu contraseña?</h1>
              <p className="text-center text-muted-foreground mb-6">
                Ingresa tu correo electrónico y te enviaremos un código de verificación
              </p>

              <form onSubmit={handleEmailSubmit} className="space-y-4">
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
                {error && <p className="text-destructive text-sm">{error}</p>}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-primary text-primary-foreground py-2 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Enviando...
                    </>
                  ) : (
                    'Enviar Código'
                  )}
                </button>
              </form>
            </>
          )}

          {step === 'code' && (
            <>
              <div className="flex items-center justify-center mb-8">
                <div className="bg-accent/10 p-3 rounded-lg">
                  <Mail className="w-8 h-8 text-accent" />
                </div>
              </div>
              <h1 className="text-center mb-2">Verificar Código</h1>
              <p className="text-center text-muted-foreground mb-6">
                Hemos enviado un código de 6 dígitos a<br />
                <strong>{email}</strong>
              </p>

              <form onSubmit={handleCodeSubmit} className="space-y-4">
                <div className="flex gap-2 justify-center">
                  {code.map((digit, index) => (
                    <input
                      key={index}
                      id={`code-${index}`}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleCodeChange(index, e.target.value)}
                      className="w-12 h-12 text-center text-xl border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                      required
                    />
                  ))}
                </div>
                {error && <p className="text-destructive text-sm text-center">{error}</p>}
                <button
                  type="submit"
                  disabled={isLoading || code.some(d => !d)}
                  className="w-full bg-primary text-primary-foreground py-2 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Verificando...
                    </>
                  ) : (
                    'Verificar'
                  )}
                </button>
                <button
                  type="button"
                  className="w-full text-primary text-sm hover:underline"
                >
                  Reenviar código
                </button>
              </form>
            </>
          )}

          {step === 'password' && (
            <>
              <h1 className="text-center mb-2">Nueva Contraseña</h1>
              <p className="text-center text-muted-foreground mb-6">
                Ingresa tu nueva contraseña
              </p>

              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                  <label className="block mb-2">Nueva Contraseña</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="••••••••"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2">Confirmar Contraseña</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="••••••••"
                    required
                  />
                </div>
                {error && <p className="text-destructive text-sm">{error}</p>}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-primary text-primary-foreground py-2 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Guardando...
                    </>
                  ) : (
                    'Cambiar Contraseña'
                  )}
                </button>
              </form>
            </>
          )}

          {step === 'success' && (
            <>
              <div className="flex items-center justify-center mb-8">
                <div className="bg-success/10 p-3 rounded-full">
                  <Check className="w-12 h-12 text-success" />
                </div>
              </div>
              <h1 className="text-center mb-2">¡Contraseña Actualizada!</h1>
              <p className="text-center text-muted-foreground mb-6">
                Tu contraseña ha sido cambiada exitosamente
              </p>
              <button
                onClick={() => navigate('/admin/login')}
                className="w-full bg-primary text-primary-foreground py-2 rounded-lg hover:opacity-90 transition-opacity"
              >
                Iniciar Sesión
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
