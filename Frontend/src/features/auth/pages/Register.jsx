import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useGoogleLogin } from '@react-oauth/google';
import {
  User, Mail, Lock, Eye, EyeOff, Sparkles, ShieldCheck, ArrowRight,
  TrendingUp, CheckCircle2, Package, Award, BarChart3,
  Check, AlertCircle, Sun, Moon, Cpu,
  Building2, Droplets, Gauge
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../../../shared/contexts/ThemeContext';
import cenarepasLogo from '../../../assets/cenarepas-icon.svg';
import authRegisterBg from '../../../assets/auth/auth-register-bg.png';

// Variantes de animación escalonada para el panel de branding derecho
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.09,
      delayChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
};

// Roles operativos de planta capturados en el alta (metadatos de onboarding,
// independientes del rol RBAC que asigna permisos en shared/config/permisos.js).
export default function Register() {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [confirmarContrasena, setConfirmarContrasena] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const { isLoading, error, setError, handleRegister, handleGoogleAuth, navigate } = useAuth();
  const { theme, toggleTheme } = useTheme();

  // Cálculo visual de fortaleza de contraseña
  const passwordStrength = useMemo(() => {
    if (!contrasena) return { score: 0, label: '', color: 'bg-muted' };
    let score = 0;
    if (contrasena.length >= 6) score += 1;
    if (contrasena.length >= 8) score += 1;
    if (/[A-Z]/.test(contrasena)) score += 1;
    if (/[0-9]/.test(contrasena) || /[^A-Za-z0-9]/.test(contrasena)) score += 1;

    if (score <= 1) return { score: 1, label: 'Débil', color: 'bg-destructive text-destructive' };
    if (score === 2 || score === 3) return { score: 2, label: 'Media', color: 'bg-[#E8B23D] text-[#8A5A14] dark:text-[#E8B23D]' };
    return { score: 3, label: 'Fuerte y segura', color: 'bg-[#5A7A3A] text-[#5A7A3A] dark:text-[#AEC094]' };
  }, [contrasena]);

  const validate = () => {
    const errors = {};
    if (!nombre.trim()) errors.nombre = 'Ingresa tu nombre completo';
    if (!correo.trim()) errors.correo = 'Ingresa tu correo electrónico';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) errors.correo = 'Ingresa un correo electrónico válido';
    if (!contrasena) errors.contrasena = 'Ingresa una contraseña';
    else if (contrasena.length < 6) errors.contrasena = 'Debe tener al menos 6 caracteres';
    if (!confirmarContrasena) errors.confirmarContrasena = 'Confirma tu contraseña';
    else if (confirmarContrasena !== contrasena) errors.confirmarContrasena = 'Las contraseñas no coinciden';
    if (!acceptTerms) errors.terms = 'Debes aceptar los Términos y la Política de Privacidad';
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const errors = validate();
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setSubmitted(true);
    if (handleRegister) {
      const success = await handleRegister({
        nombre: nombre.trim(),
        correo: correo.trim(),
        contrasena,
        id_rol: 3,
      });
      if (success) {
        navigate('/admin/pedidos');
      }
    }
  };

  // Autenticación con Google
  const registerWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      if (handleGoogleAuth) {
        const success = await handleGoogleAuth(tokenResponse.access_token);
        if (success) {
          navigate('/admin/pedidos');
        }
      } else {
        navigate('/admin/pedidos');
      }
    },
    onError: (error) => {
      console.error('Error en autenticación con Google:', error);
    },
  });

  return (
    <div className="min-h-screen lg:h-screen w-full flex bg-background font-sans text-foreground overflow-y-auto lg:overflow-hidden selection:bg-[#C1502D]/15 selection:text-[#C1502D] transition-colors duration-200">
      
      {/* ════════════════════ PANEL IZQUIERDO — FORMULARIO DE REGISTRO ════════════════════ */}
      <motion.div
        initial={{ opacity: 0, x: -24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="w-full lg:w-[50%] xl:w-[48%] min-h-screen lg:h-screen overflow-y-auto flex flex-col justify-between px-4 sm:px-8 md:px-12 lg:px-14 xl:px-18 py-6 sm:py-7 lg:py-8 bg-background text-foreground"
      >
        
        {/* Top bar / Logo + Badge de Estado + Theme Toggle */}
        <div className="w-full max-w-[440px] mx-auto flex items-center justify-between gap-3 mb-4">
          <motion.a
            href="/"
            whileHover={{ scale: 1.02 }}
            className="flex items-center gap-2.5 cursor-pointer"
          >
            <img
              src={cenarepasLogo}
              alt="CENAREPAS"
              className="h-8 sm:h-9 w-8 sm:w-9 object-contain rounded-lg drop-shadow-sm"
            />
            <div className="flex flex-col leading-none">
              <span className="text-sm sm:text-base font-extrabold tracking-tight text-foreground">
                CENAREPAS
              </span>
              <span className="text-[8.5px] sm:text-[9px] font-bold tracking-[0.16em] uppercase text-[#C1502D] dark:text-[#E8B23D] mt-0.5">
                SISTEMA DE GESTIÓN
              </span>
            </div>
          </motion.a>
          
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-[#5A7A3A]/10 border border-[#5A7A3A]/20 dark:bg-[#5A7A3A]/25 dark:border-[#5A7A3A]/40 px-2.5 py-0.5 text-[10px] font-semibold text-[#5A7A3A] dark:text-[#AEC094]">
              <span className="size-1.5 rounded-full bg-[#5A7A3A] dark:bg-[#E8B23D] animate-pulse" />
              Alta de Usuarios
            </span>

            <button
              type="button"
              onClick={toggleTheme}
              className="p-1.5 rounded-xl border border-border bg-card text-foreground hover:bg-muted transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C1502D] dark:focus-visible:ring-[#E8B23D] focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              title={theme === 'dark' ? 'Modo Claro' : 'Modo Oscuro'}
              aria-label={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            >
              {theme === 'dark' ? <Sun className="size-3.5 text-[#E8B23D]" /> : <Moon className="size-3.5 text-muted-foreground" />}
            </button>
          </div>
        </div>

        {/* Contenedor Central del Formulario */}
        <div className="w-full max-w-[440px] mx-auto my-auto py-2">

          {/* Eyebrow de Marca */}
          <div className="inline-flex items-center gap-1.5 rounded-full border border-[#C1502D]/20 bg-[#C1502D]/10 px-2.5 py-0.5 text-[#C1502D] mb-2.5">
            <Sparkles className="size-3 text-[#C1502D]" />
            <span className="text-[10px] font-bold tracking-wider uppercase text-[#C1502D] dark:text-[#E8B23D]">
              Registro de Usuario
            </span>
          </div>

          {/* Encabezado con Acento Tipográfico Elegante Scoped */}
          <div className="mb-4">
            <h1 className="text-2xl sm:text-[1.75rem] font-bold text-foreground tracking-tight leading-tight">
              Crear tu Cuenta
              <span 
                className="block font-serif italic font-normal text-[#C1502D] dark:text-[#E8B23D] text-[0.96em] mt-0.5 tracking-normal"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                en la plataforma de producción
              </span>
            </h1>
            <p className="text-muted-foreground text-xs sm:text-[13px] mt-1.5 leading-relaxed font-normal">
              Gestiona insumos, recetas y pedidos con total trazabilidad en tiempo real.
            </p>
          </div>

          {/* Botón Google con Microinteracciones */}
          <motion.button 
            onClick={() => registerWithGoogle()}
            whileHover={{ scale: 1.01, y: -1 }}
            whileTap={{ scale: 0.99 }}
            type="button"
            className="w-full h-11 flex items-center justify-center gap-2.5 bg-card dark:bg-[#111820] border border-border dark:border-[rgba(148,163,184,0.14)] text-foreground font-semibold text-xs sm:text-[13px] rounded-xl hover:bg-muted hover:border-[#C1502D]/40 dark:hover:border-[#E8B23D]/40 hover:shadow-xs transition-all duration-200 cursor-pointer shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C1502D] dark:focus-visible:ring-[#E8B23D] focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <svg className="size-4.5 shrink-0" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.58c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            <span>Registrarse con Google</span>
          </motion.button>

          {/* Divisor Visual */}
          <div className="flex items-center my-3.5">
            <div className="flex-grow border-t border-border dark:border-[rgba(148,163,184,0.14)]"></div>
            <span className="mx-3 text-[10.5px] text-muted-foreground font-medium uppercase tracking-wider">o completa tus datos</span>
            <div className="flex-grow border-t border-border dark:border-[rgba(148,163,184,0.14)]"></div>
          </div>

          {/* Formulario Estructurado con los Campos Existentes */}
          <form onSubmit={handleSubmit} className="space-y-3.5" noValidate>

            {/* Mensaje de Error General (fallo de creación de cuenta) */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                id="register-error"
                className="flex items-start gap-2.5 p-3 rounded-xl bg-[#C1502D]/10 dark:bg-[#C1502D]/20 border border-[#C1502D]/30 text-[#C1502D] dark:text-[#FFAAA0] text-xs leading-snug"
                role="alert"
              >
                <AlertCircle className="size-4 shrink-0 text-[#C1502D] dark:text-[#FFAAA0] mt-0.5" />
                <p className="font-semibold flex-1">{error}</p>
              </motion.div>
            )}

            {/* Campo 1: Nombre Completo */}
            <div>
              <label htmlFor="register-nombre" className="block text-[11.5px] font-bold text-foreground/90 mb-1">
                Nombre Completo <span className="text-[#C1502D] dark:text-[#E8B23D]">*</span>
              </label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <input
                  id="register-nombre"
                  name="nombre"
                  type="text"
                  maxLength={100}
                  value={nombre}
                  onChange={(e) => {
                    setNombre(e.target.value);
                    if (fieldErrors.nombre) setFieldErrors((prev) => ({ ...prev, nombre: undefined }));
                  }}
                  placeholder="Ej: Carlos Mario Restrepo"
                  autoComplete="name"
                  aria-invalid={!!fieldErrors.nombre}
                  aria-describedby={fieldErrors.nombre ? 'register-nombre-error' : undefined}
                  className={`w-full h-11 bg-[#FFFBF0]/60 dark:bg-[#0E141B] border text-foreground text-xs sm:text-sm placeholder:text-muted-foreground/60 rounded-xl pl-10 pr-3.5 transition-all duration-200 focus:bg-white dark:focus:bg-[#111820] focus:outline-none focus:ring-2 ${
                    fieldErrors.nombre
                      ? 'border-[#C1502D] dark:border-[#E05238] focus:border-[#C1502D] dark:focus:border-[#E05238] focus:ring-[#C1502D]/20 dark:focus:ring-[#E05238]/25'
                      : 'border-[#E8DCC0] dark:border-[rgba(148,163,184,0.18)] focus:border-[#C1502D] dark:focus:border-[#E8B23D] focus:ring-[#C1502D]/15 dark:focus:ring-[#E8B23D]/20'
                  }`}
                />
              </div>
              {fieldErrors.nombre && (
                <p id="register-nombre-error" className="flex items-center gap-1 text-[11px] font-semibold text-[#C1502D] dark:text-[#FFAAA0] mt-1">
                  <AlertCircle className="size-3 shrink-0" /> {fieldErrors.nombre}
                </p>
              )}
            </div>

            {/* Campo 2: Correo Electrónico */}
            <div>
              <label htmlFor="register-correo" className="block text-[11.5px] font-bold text-foreground/90 mb-1">
                Correo Electrónico <span className="text-[#C1502D] dark:text-[#E8B23D]">*</span>
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <input
                  id="register-correo"
                  name="correo"
                  type="email"
                  maxLength={100}
                  value={correo}
                  onChange={(e) => {
                    setCorreo(e.target.value);
                    if (fieldErrors.correo) setFieldErrors((prev) => ({ ...prev, correo: undefined }));
                  }}
                  placeholder="usuario@cenarepas.com"
                  autoComplete="email"
                  aria-invalid={!!fieldErrors.correo}
                  aria-describedby={fieldErrors.correo ? 'register-correo-error' : undefined}
                  className={`w-full h-11 bg-[#FFFBF0]/60 dark:bg-[#0E141B] border text-foreground text-xs sm:text-sm placeholder:text-muted-foreground/60 rounded-xl pl-10 pr-3.5 transition-all duration-200 focus:bg-white dark:focus:bg-[#111820] focus:outline-none focus:ring-2 ${
                    fieldErrors.correo
                      ? 'border-[#C1502D] dark:border-[#E05238] focus:border-[#C1502D] dark:focus:border-[#E05238] focus:ring-[#C1502D]/20 dark:focus:ring-[#E05238]/25'
                      : 'border-[#E8DCC0] dark:border-[rgba(148,163,184,0.18)] focus:border-[#C1502D] dark:focus:border-[#E8B23D] focus:ring-[#C1502D]/15 dark:focus:ring-[#E8B23D]/20'
                  }`}
                />
              </div>
              {fieldErrors.correo && (
                <p id="register-correo-error" className="flex items-center gap-1 text-[11px] font-semibold text-[#C1502D] dark:text-[#FFAAA0] mt-1">
                  <AlertCircle className="size-3 shrink-0" /> {fieldErrors.correo}
                </p>
              )}
            </div>

            {/* Campo 3: Contraseña con Indicador Visual de Fortaleza */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="register-contrasena" className="text-[11.5px] font-bold text-foreground/90">
                  Contraseña <span className="text-[#C1502D] dark:text-[#E8B23D]">*</span>
                </label>
                {contrasena && (
                  <span className={`text-[10px] font-bold ${passwordStrength.color}`}>
                    {passwordStrength.label}
                  </span>
                )}
              </div>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <input
                  id="register-contrasena"
                  name="contrasena"
                  type={showPassword ? 'text' : 'password'}
                  maxLength={255}
                  value={contrasena}
                  onChange={(e) => {
                    setContrasena(e.target.value);
                    if (fieldErrors.contrasena) setFieldErrors((prev) => ({ ...prev, contrasena: undefined }));
                  }}
                  placeholder="Mínimo 6 caracteres"
                  autoComplete="new-password"
                  aria-invalid={!!fieldErrors.contrasena}
                  aria-describedby={fieldErrors.contrasena ? 'register-contrasena-error' : undefined}
                  className={`w-full h-11 bg-[#FFFBF0]/60 dark:bg-[#0E141B] border text-foreground text-xs sm:text-sm placeholder:text-muted-foreground/60 rounded-xl pl-10 pr-11 transition-all duration-200 focus:bg-white dark:focus:bg-[#111820] focus:outline-none focus:ring-2 ${
                    fieldErrors.contrasena
                      ? 'border-[#C1502D] dark:border-[#E05238] focus:border-[#C1502D] dark:focus:border-[#E05238] focus:ring-[#C1502D]/20 dark:focus:ring-[#E05238]/25'
                      : 'border-[#E8DCC0] dark:border-[rgba(148,163,184,0.18)] focus:border-[#C1502D] dark:focus:border-[#E8B23D] focus:ring-[#C1502D]/15 dark:focus:ring-[#E8B23D]/20'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-muted-foreground hover:text-[#C1502D] dark:hover:text-[#E8B23D] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C1502D] dark:focus-visible:ring-[#E8B23D] rounded-md"
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>

              {/* Barra de progreso de fortaleza */}
              {contrasena && (
                <div className="grid grid-cols-3 gap-1 mt-1.5">
                  <div className={`h-1 rounded-full transition-colors duration-300 ${passwordStrength.score >= 1 ? 'bg-[#C1502D]' : 'bg-muted'}`} />
                  <div className={`h-1 rounded-full transition-colors duration-300 ${passwordStrength.score >= 2 ? 'bg-[#E8B23D]' : 'bg-muted'}`} />
                  <div className={`h-1 rounded-full transition-colors duration-300 ${passwordStrength.score >= 3 ? 'bg-[#5A7A3A]' : 'bg-muted'}`} />
                </div>
              )}
              {fieldErrors.contrasena && (
                <p id="register-contrasena-error" className="flex items-center gap-1 text-[11px] font-semibold text-[#C1502D] dark:text-[#FFAAA0] mt-1">
                  <AlertCircle className="size-3 shrink-0" /> {fieldErrors.contrasena}
                </p>
              )}
            </div>

            {/* Campo 4: Confirmar Contraseña */}
            <div>
              <label htmlFor="register-confirmar-contrasena" className="block text-[11.5px] font-bold text-foreground/90 mb-1">
                Confirmar Contraseña <span className="text-[#C1502D] dark:text-[#E8B23D]">*</span>
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <input
                  id="register-confirmar-contrasena"
                  name="confirmarContrasena"
                  type={showConfirmPassword ? 'text' : 'password'}
                  maxLength={255}
                  value={confirmarContrasena}
                  onChange={(e) => {
                    setConfirmarContrasena(e.target.value);
                    if (fieldErrors.confirmarContrasena) setFieldErrors((prev) => ({ ...prev, confirmarContrasena: undefined }));
                  }}
                  placeholder="Repite tu contraseña"
                  autoComplete="new-password"
                  aria-invalid={!!fieldErrors.confirmarContrasena}
                  aria-describedby={fieldErrors.confirmarContrasena ? 'register-confirmar-contrasena-error' : undefined}
                  className={`w-full h-11 bg-[#FFFBF0]/60 dark:bg-[#0E141B] border text-foreground text-xs sm:text-sm placeholder:text-muted-foreground/60 rounded-xl pl-10 pr-11 transition-all duration-200 focus:bg-white dark:focus:bg-[#111820] focus:outline-none focus:ring-2 ${
                    fieldErrors.confirmarContrasena
                      ? 'border-[#C1502D] dark:border-[#E05238] focus:border-[#C1502D] dark:focus:border-[#E05238] focus:ring-[#C1502D]/20 dark:focus:ring-[#E05238]/25'
                      : 'border-[#E8DCC0] dark:border-[rgba(148,163,184,0.18)] focus:border-[#C1502D] dark:focus:border-[#E8B23D] focus:ring-[#C1502D]/15 dark:focus:ring-[#E8B23D]/20'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-muted-foreground hover:text-[#C1502D] dark:hover:text-[#E8B23D] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C1502D] dark:focus-visible:ring-[#E8B23D] rounded-md"
                  aria-label={showConfirmPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              {fieldErrors.confirmarContrasena && (
                <p id="register-confirmar-contrasena-error" className="flex items-center gap-1 text-[11px] font-semibold text-[#C1502D] dark:text-[#FFAAA0] mt-1">
                  <AlertCircle className="size-3 shrink-0" /> {fieldErrors.confirmarContrasena}
                </p>
              )}
            </div>

            {/* Micro-aviso de Seguridad */}
            <div className="flex items-start gap-2 bg-[#5A7A3A]/10 dark:bg-[#5A7A3A]/20 border border-[#5A7A3A]/25 rounded-xl p-2.5">
              <ShieldCheck className="size-4 text-[#5A7A3A] dark:text-[#AEC094] shrink-0 mt-0.5" />
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Tus accesos están protegidos con cifrado de grado empresarial y registro de auditoría.
              </p>
            </div>

            {/* Aceptación de Términos y Política de Privacidad */}
            <div>
              <label htmlFor="register-terms" className="flex items-start gap-2.5 cursor-pointer select-none group">
                <input
                  id="register-terms"
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => {
                    setAcceptTerms(e.target.checked);
                    if (fieldErrors.terms) setFieldErrors((prev) => ({ ...prev, terms: undefined }));
                  }}
                  aria-invalid={!!fieldErrors.terms}
                  aria-describedby={fieldErrors.terms ? 'register-terms-error' : undefined}
                  className={`mt-0.5 size-3.5 shrink-0 rounded border-border text-[#C1502D] dark:text-[#E8B23D] accent-[#C1502D] dark:accent-[#E8B23D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C1502D] dark:focus-visible:ring-[#E8B23D] focus-visible:ring-offset-2 focus-visible:ring-offset-background cursor-pointer ${
                    fieldErrors.terms ? 'outline outline-1 outline-[#C1502D] dark:outline-[#E05238]' : ''
                  }`}
                />
                <span className="text-[11.5px] text-muted-foreground leading-relaxed">
                  Acepto los{' '}
                  <a
                    href="#"
                    onClick={(e) => e.stopPropagation()}
                    className="text-[#C1502D] dark:text-[#E8B23D] font-semibold hover:underline rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C1502D] dark:focus-visible:ring-[#E8B23D]"
                  >
                    Términos de Servicio
                  </a>{' '}
                  y la{' '}
                  <a
                    href="#"
                    onClick={(e) => e.stopPropagation()}
                    className="text-[#C1502D] dark:text-[#E8B23D] font-semibold hover:underline rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C1502D] dark:focus-visible:ring-[#E8B23D]"
                  >
                    Política de Privacidad
                  </a>{' '}
                  de CENAREPAS. <span className="text-[#C1502D] dark:text-[#E8B23D]">*</span>
                </span>
              </label>
              {fieldErrors.terms && (
                <p id="register-terms-error" className="flex items-center gap-1 text-[11px] font-semibold text-[#C1502D] dark:text-[#FFAAA0] mt-1 ml-6">
                  <AlertCircle className="size-3 shrink-0" /> {fieldErrors.terms}
                </p>
              )}
            </div>

            {/* Botón Principal de Envío */}
            <motion.button
              whileHover={{ scale: 1.01, y: -1 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={isLoading}
              className="w-full h-11 mt-1.5 flex items-center justify-center gap-2 rounded-xl bg-[#C1502D] hover:bg-[#A84223] active:bg-[#8C341A] text-white font-bold text-xs sm:text-[13px] tracking-wide shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C1502D] dark:focus-visible:ring-[#E8B23D] focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              {isLoading ? (
                <>
                  <div className="size-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  <span>Creando cuenta...</span>
                </>
              ) : (
                <>
                  <span>Completar Registro</span>
                  <ArrowRight className="size-4" />
                </>
              )}
            </motion.button>
          </form>

          {/* Enlace al Login */}
          <p className="text-center text-xs text-muted-foreground mt-5">
            ¿Ya tienes una cuenta registrada?{' '}
            <button
              type="button"
              onClick={() => navigate('/admin/login')}
              className="text-[#C1502D] dark:text-[#E8B23D] font-bold hover:underline bg-transparent border-0 cursor-pointer rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C1502D] dark:focus-visible:ring-[#E8B23D] focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Inicia sesión aquí
            </button>
          </p>
        </div>

        {/* Footer Scoped */}
        <div className="w-full max-w-[440px] mx-auto pt-3 border-t border-border flex items-center justify-between text-[11px] text-muted-foreground">
          <span>&copy; {new Date().getFullYear()} CENAREPAS</span>
          <span className="font-semibold text-foreground/80">Plataforma Masarepas</span>
        </div>
      </motion.div>

      {/* ════════════════════ PANEL DERECHO — EDITORIAL ONBOARDING & INDUSTRIAL SHOWCASE ════════════════════ */}
      <div className="hidden lg:flex lg:w-[48%] xl:w-[52%] relative flex-col justify-between p-8 sm:p-12 lg:p-14 xl:p-16 overflow-hidden min-h-screen bg-[#110d0b]">
        {/* Fotografía de fondo: arepas listas para despacho/empaque */}
        <img
          src={authRegisterBg}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />

        {/* Degradado orgánico con overlay ligero para mantener nitidez de la foto */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#2a1308] via-[#241b07] to-[#0d1d13] opacity-45 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0C0402]/65 via-transparent to-[#1E0E07]/35 pointer-events-none" />

        {/* Halos ambientales */}
        <div className="pointer-events-none absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#f66018]/15 blur-3xl" />
        <div className="pointer-events-none absolute top-1/2 left-10 w-80 h-80 rounded-full bg-[#cea700]/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 right-1/4 w-80 h-80 rounded-full bg-[#00b954]/15 blur-3xl" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.03] bg-[radial-gradient(#ffb599_1px,transparent_1px)] [background-size:24px_24px]" />

        {/* Encabezado Superior: Badge de Telemetría de Planta */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3 backdrop-blur-md bg-[#161310]/50 border border-white/10 px-4 py-2 rounded-2xl shadow-lg">
            <Building2 className="size-5 text-[#efc200]" />
            <div className="flex flex-col">
              <span className="text-[10px] font-mono text-white/70 uppercase tracking-wider">Malla de Plantas Activas</span>
              <span className="text-[11.5px] font-mono text-white font-semibold">14 Molinos en Red · Colombia & México</span>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-mono text-[#4ae176] bg-[#00b954]/20 border border-[#4ae176]/30 backdrop-blur-md px-3 py-1.5 rounded-xl">
            <span className="w-2 h-2 rounded-full bg-[#4ae176] animate-pulse"></span>
            <span>Sincronización en vivo</span>
          </div>
        </div>

        {/* Sección Central: Títulos Editoriales y Tarjetas Flotantes */}
        <div className="relative z-10 my-auto py-6 space-y-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 mb-2.5">
              <span className="h-px w-8 bg-[#efc200]"></span>
              <span className="text-[11px] font-mono tracking-widest uppercase text-[#efc200] font-bold">Arquitectura de Molienda 4.0</span>
            </div>
            <h2 className="text-2xl sm:text-3xl xl:text-[34px] font-bold tracking-tight text-white leading-tight">
              Únete y digitaliza tu operación de arepas.
            </h2>
            <p className="text-sm sm:text-[14.5px] text-[#e2bfb2] mt-3 leading-relaxed max-w-lg font-light">
              Desde el silo de maíz hasta la entrega final en puntos de venta. Trazabilidad total de molienda y formulación precisa en tiempo real.
            </p>
          </div>

          {/* Cluster de Métricas Flotantes con Glassmorphism */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-12 gap-3.5 pt-2"
          >
            {/* Tarjeta 1: Monitoreo de Calidad / Humedad (7 Cols) */}
            <motion.div
              variants={itemVariants}
              className="sm:col-span-7 rounded-2xl bg-[#161310]/60 backdrop-blur-xl border border-white/15 p-4 sm:p-5 shadow-2xl relative overflow-hidden transition-all hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-white/10 text-[#ffb599]">
                    <Droplets className="size-4" />
                  </span>
                  <span className="text-[10.5px] font-mono uppercase tracking-wider text-white/70">Monitoreo de Calidad</span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-[#00b954]/20 text-[#4ae176] border border-[#4ae176]/30 font-semibold">
                  Lote #M-902
                </span>
              </div>
              <div className="flex items-baseline justify-between mt-1">
                <div>
                  <span className="text-xl sm:text-2xl font-bold text-white tracking-tight">42.5%</span>
                  <span className="text-[11px] font-mono text-[#4ae176] ml-1.5 font-medium">Humedad Óptima</span>
                </div>
                <span className="text-[10px] font-mono text-white/60">Meta: 42.0 - 43.0%</span>
              </div>
              {/* Barra de calibración segmentada */}
              <div className="mt-3 grid grid-cols-6 gap-1 h-2">
                <div className="rounded-full bg-[#4ae176]/40"></div>
                <div className="rounded-full bg-[#4ae176]/70"></div>
                <div className="rounded-full bg-[#4ae176] shadow-[0_0_10px_#4ae176]"></div>
                <div className="rounded-full bg-[#4ae176] shadow-[0_0_10px_#4ae176]"></div>
                <div className="rounded-full bg-[#4ae176]/70"></div>
                <div className="rounded-full bg-white/15"></div>
              </div>
              <div className="flex items-center justify-between mt-3 text-[10.5px] font-mono text-white/80">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="size-3.5 text-[#4ae176]" />
                  Viscosidad en tolva aprobada
                </span>
                <span className="text-white/60">Sensor S-4B</span>
              </div>
            </motion.div>

            {/* Tarjeta 2: Eficiencia OEE con Sparkline (5 Cols) */}
            <motion.div
              variants={itemVariants}
              className="sm:col-span-5 rounded-2xl bg-[#161310]/60 backdrop-blur-xl border border-white/15 p-4 sm:p-5 shadow-2xl relative overflow-hidden transition-all hover:-translate-y-0.5 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-white/10 text-[#efc200]">
                    <Gauge className="size-4" />
                  </span>
                  <span className="text-[10.5px] font-mono uppercase tracking-wider text-white/70">Eficiencia OEE</span>
                </div>
                <span className="w-2 h-2 rounded-full bg-[#efc200] shadow-[0_0_8px_#efc200]"></span>
              </div>
              <div className="my-2">
                <div className="text-xl sm:text-2xl font-bold text-white tracking-tight">99.4%</div>
                <span className="text-[10.5px] font-mono text-white/70">Línea de Formado 3</span>
              </div>
              {/* Sparkline vectorial con brillo dorado */}
              <div className="w-full pt-1">
                <svg className="w-full h-8 stroke-[#efc200] fill-none" viewBox="0 0 140 36">
                  <defs>
                    <linearGradient id="registerTertiaryGlow" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#efc200" stopOpacity="0.35" />
                      <stop offset="100%" stopColor="#efc200" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  <path d="M0,28 Q15,22 30,26 T60,18 T90,20 T115,10 T140,6 L140,36 L0,36 Z" fill="url(#registerTertiaryGlow)" stroke="none" />
                  <path d="M0,28 Q15,22 30,26 T60,18 T90,20 T115,10 T140,6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
                  <circle cx="140" cy="6" fill="#efc200" r="3.5" stroke="#161310" strokeWidth="2" />
                </svg>
              </div>
            </motion.div>

            {/* Tarjeta 3: Certificación HACCP (12 Cols) */}
            <motion.div
              variants={itemVariants}
              className="sm:col-span-12 rounded-2xl bg-[#161310]/60 backdrop-blur-xl border border-white/15 p-4 shadow-xl flex items-center justify-between flex-wrap sm:flex-nowrap gap-3.5"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#00b954]/20 border border-[#4ae176]/30 flex items-center justify-center text-[#4ae176] shrink-0">
                  <ShieldCheck className="size-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-white">Certificación de Lotes HACCP</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#00b954]/20 text-[#4ae176] uppercase font-bold border border-[#4ae176]/30">Activo</span>
                  </div>
                  <p className="text-xs text-white/70 mt-0.5">
                    Protocolo térmico de precocido y esterilización validado para exportación FDA/INVIMA.
                  </p>
                </div>
              </div>
              <div className="shrink-0 flex items-center gap-2 text-[10.5px] font-mono text-white/60">
                <Lock className="size-3.5 text-[#efc200]" />
                <span>Inmutable Blockchain Hash</span>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Pie de Panel Editorial */}
        <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2 overflow-hidden">
              <div className="inline-block h-7 w-7 rounded-full bg-white/20 border border-white/30 flex items-center justify-center text-[10px] font-mono text-[#ffb599] font-bold shadow-md">
                MV
              </div>
              <div className="inline-block h-7 w-7 rounded-full bg-[#f66018] flex items-center justify-center text-[10px] font-mono text-white font-bold shadow-md">
                CR
              </div>
              <div className="inline-block h-7 w-7 rounded-full bg-[#efc200] flex items-center justify-center text-[10px] font-mono text-black font-bold shadow-md">
                SL
              </div>
            </div>
            <span className="text-xs text-white/80">
              Utilizado por <strong className="text-white font-semibold">+85 plantas</strong> de arepas líderes en la región
            </span>
          </div>
          <div className="flex items-center gap-2 text-[10.5px] font-mono text-white/60">
            <span>Seguridad ISO 22000</span>
            <span>•</span>
            <span>99.98% Uptime</span>
          </div>
        </div>
      </div>

    </div>
  );
}