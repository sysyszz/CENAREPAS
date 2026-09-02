// pages/ForgotPassword.jsx
import { useState } from 'react';
import { Mail, ArrowLeft, Check } from 'lucide-react';
import { AuthCard } from '../components/AuthCard';
import { AuthHeader } from '../components/AuthHeader';
import { AuthInput } from '../components/AuthInput';
import { CodeInput } from '../components/CodeInput';
import { LoadingButton } from '../components/LoadingButton';
import { useAuth } from '../hooks/useAuth';

export default function ForgotPassword() {
  const [step, setStep] = useState('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { isLoading, error, setError, handleForgotPassword, handleVerifyCode, handleResetPassword, navigate } = useAuth();

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const success = await handleForgotPassword(email);
    if (success) setStep('code');
  };

  const handleCodeSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const success = await handleVerifyCode(code);
    if (success) setStep('password');
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    const success = await handleResetPassword(newPassword, confirmPassword);
    if (success) setStep('success');
  };

  const renderBackButton = () => (
    <button
      onClick={() => step === 'email' ? navigate('/admin/login') : setStep(step === 'code' ? 'email' : 'code')}
      className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
    >
      <ArrowLeft className="w-4 h-4" />
      Volver
    </button>
  );

  const renderEmailStep = () => (
    <>
      <AuthHeader
        icon={Mail}
        title="¿Olvidaste tu contraseña?"
        subtitle="Ingresa tu correo electrónico y te enviaremos un código de verificación"
      />
      <form onSubmit={handleEmailSubmit} className="space-y-4">
        <AuthInput
          label="Correo Electrónico"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="usuario@ejemplo.com"
        />
        {error && <p className="text-destructive text-sm">{error}</p>}
        <LoadingButton isLoading={isLoading}>
          Enviar Código
        </LoadingButton>
      </form>
    </>
  );

  const renderCodeStep = () => (
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
        <CodeInput code={code} setCode={setCode} error={error} />
        <LoadingButton
          isLoading={isLoading}
          disabled={code.some(d => !d)}
        >
          Verificar
        </LoadingButton>
        <button
          type="button"
          className="w-full text-primary text-sm hover:underline"
          onClick={() => handleForgotPassword(email)}
        >
          Reenviar código
        </button>
      </form>
    </>
  );

  const renderPasswordStep = () => (
    <>
      <h1 className="text-center mb-2">Nueva Contraseña</h1>
      <p className="text-center text-muted-foreground mb-6">
        Ingresa tu nueva contraseña
      </p>
      <form onSubmit={handlePasswordSubmit} className="space-y-4">
        <AuthInput
          label="Nueva Contraseña"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="••••••••"
        />
        <AuthInput
          label="Confirmar Contraseña"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="••••••••"
        />
        {error && <p className="text-destructive text-sm">{error}</p>}
        <LoadingButton isLoading={isLoading}>
          Cambiar Contraseña
        </LoadingButton>
      </form>
    </>
  );

  const renderSuccessStep = () => (
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
  );

  return (
    <AuthCard>
      {step !== 'success' && renderBackButton()}
      
      {step === 'email' && renderEmailStep()}
      {step === 'code' && renderCodeStep()}
      {step === 'password' && renderPasswordStep()}
      {step === 'success' && renderSuccessStep()}
    </AuthCard>
  );
}