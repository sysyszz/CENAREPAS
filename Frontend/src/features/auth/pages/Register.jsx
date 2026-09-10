import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useGoogleLogin } from '@react-oauth/google';
import {
  User, Mail, Lock, Eye, EyeOff, Sparkles, ShieldCheck, ArrowRight,
  TrendingUp, CheckCircle2, Factory, Package, Award, BarChart3,
  Check, AlertCircle, Sun, Moon, Cpu
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../../../shared/contexts/ThemeContext';
import cenarepasLogo from '../../../assets/cenarepas-icon.svg';

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

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const { isLoading, handleLogin, handleGoogleAuth, navigate } = useAuth();
  const { theme, toggleTheme } = useTheme();

  // Cálculo visual de fortaleza de contraseña (sin añadir campos nuevos)
  const passwordStrength = useMemo(() => {
    if (!password) return { score: 0, label: '', color: 'bg-muted' };
    let score = 0;
    if (password.length >= 6) score += 1;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password) || /[^A-Za-z0-9]/.test(password)) score += 1;

    if (score <= 1) return { score: 1, label: 'Débil', color: 'bg-destructive text-destructive' };
    if (score === 2 || score === 3) return { score: 2, label: 'Media', color: 'bg-[#E8B23D] text-[#8A5A14] dark:text-[#E8B23D]' };
    return { score: 3, label: 'Fuerte y segura', color: 'bg-[#5A7A3A] text-[#5A7A3A] dark:text-[#AEC094]' };
  }, [password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    // Preservar la lógica de envío y feedback
    console.log('Registro enviado:', { name, email, password });
    if (handleLogin) {
      const success = await handleLogin(email, password);
      if (success) {
        navigate('/admin');
      }
    }
  };

  // Autenticación con Google
  const registerWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      if (handleGoogleAuth) {
        const success = await handleGoogleAuth(tokenResponse.access_token);
        if (success) {
          navigate('/admin');
        }
      } else {
        navigate('/admin');
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
              className="p-1.5 rounded-xl border border-border bg-card text-foreground hover:bg-muted transition-colors cursor-pointer"
              title={theme === 'dark' ? 'Modo Claro' : 'Modo Oscuro'}
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
            className="w-full h-11 flex items-center justify-center gap-2.5 bg-card dark:bg-[#111820] border border-border dark:border-[rgba(148,163,184,0.14)] text-foreground font-semibold text-xs sm:text-[13px] rounded-xl hover:bg-muted hover:border-[#C1502D]/40 dark:hover:border-[#E8B23D]/40 hover:shadow-xs transition-all duration-200 cursor-pointer shadow-xs"
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
          <form onSubmit={handleSubmit} className="space-y-3.5">
            
            {/* Campo 1: Nombre Completo */}
            <div>
              <label className="block text-[11.5px] font-bold text-foreground/90 mb-1">
                Nombre Completo <span className="text-[#C1502D] dark:text-[#E8B23D]">*</span>
              </label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej: Carlos Mario Restrepo" 
                  autoComplete="name"
                  className="w-full h-11 bg-[#FFFBF0]/60 dark:bg-[#0E141B] border border-[#E8DCC0] dark:border-[rgba(148,163,184,0.18)] text-foreground text-xs sm:text-sm placeholder:text-muted-foreground/60 rounded-xl pl-10 pr-3.5 transition-all duration-200 focus:bg-white dark:focus:bg-[#111820] focus:border-[#C1502D] dark:focus:border-[#E8B23D] focus:ring-2 focus:ring-[#C1502D]/15 dark:focus:ring-[#E8B23D]/20 focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* Campo 2: Correo Electrónico */}
            <div>
              <label className="block text-[11.5px] font-bold text-foreground/90 mb-1">
                Correo Electrónico <span className="text-[#C1502D] dark:text-[#E8B23D]">*</span>
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="usuario@cenarepas.com" 
                  autoComplete="email"
                  className="w-full h-11 bg-[#FFFBF0]/60 dark:bg-[#0E141B] border border-[#E8DCC0] dark:border-[rgba(148,163,184,0.18)] text-foreground text-xs sm:text-sm placeholder:text-muted-foreground/60 rounded-xl pl-10 pr-3.5 transition-all duration-200 focus:bg-white dark:focus:bg-[#111820] focus:border-[#C1502D] dark:focus:border-[#E8B23D] focus:ring-2 focus:ring-[#C1502D]/15 dark:focus:ring-[#E8B23D]/20 focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* Campo 3: Contraseña con Indicador Visual de Fortaleza */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11.5px] font-bold text-foreground/90">
                  Contraseña <span className="text-[#C1502D] dark:text-[#E8B23D]">*</span>
                </label>
                {password && (
                  <span className={`text-[10px] font-bold ${passwordStrength.color}`}>
                    {passwordStrength.label}
                  </span>
                )}
              </div>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres" 
                  autoComplete="new-password"
                  className="w-full h-11 bg-[#FFFBF0]/60 dark:bg-[#0E141B] border border-[#E8DCC0] dark:border-[rgba(148,163,184,0.18)] text-foreground text-xs sm:text-sm placeholder:text-muted-foreground/60 rounded-xl pl-10 pr-11 transition-all duration-200 focus:bg-white dark:focus:bg-[#111820] focus:border-[#C1502D] dark:focus:border-[#E8B23D] focus:ring-2 focus:ring-[#C1502D]/15 dark:focus:ring-[#E8B23D]/20 focus:outline-none"
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-muted-foreground hover:text-[#C1502D] dark:hover:text-[#E8B23D] transition-colors cursor-pointer"
                  aria-label="Mostrar u ocultar contraseña"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>

              {/* Barra de progreso de fortaleza */}
              {password && (
                <div className="grid grid-cols-3 gap-1 mt-1.5">
                  <div className={`h-1 rounded-full transition-colors duration-300 ${passwordStrength.score >= 1 ? 'bg-[#C1502D]' : 'bg-muted'}`} />
                  <div className={`h-1 rounded-full transition-colors duration-300 ${passwordStrength.score >= 2 ? 'bg-[#E8B23D]' : 'bg-muted'}`} />
                  <div className={`h-1 rounded-full transition-colors duration-300 ${passwordStrength.score >= 3 ? 'bg-[#5A7A3A]' : 'bg-muted'}`} />
                </div>
              )}
            </div>

            {/* Micro-aviso de Seguridad */}
            <div className="flex items-start gap-2 bg-[#5A7A3A]/10 dark:bg-[#5A7A3A]/20 border border-[#5A7A3A]/25 rounded-xl p-2.5">
              <ShieldCheck className="size-4 text-[#5A7A3A] dark:text-[#AEC094] shrink-0 mt-0.5" />
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Tus accesos están protegidos con cifrado de grado empresarial y registro de auditoría.
              </p>
            </div>

            {/* Botón Principal de Envío */}
            <motion.button
              whileHover={{ scale: 1.01, y: -1 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={isLoading}
              className="w-full h-11 mt-1.5 flex items-center justify-center gap-2 rounded-xl bg-[#C1502D] hover:bg-[#A84223] active:bg-[#8C341A] text-white font-bold text-xs sm:text-[13px] tracking-wide shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
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
              className="text-[#C1502D] dark:text-[#E8B23D] font-bold hover:underline bg-transparent border-0 cursor-pointer"
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

      {/* ════════════════════ PANEL DERECHO — BRANDING & SHOWCASE VISUAL ════════════════════ */}
      <div className="hidden lg:flex lg:w-[50%] xl:w-[52%] h-screen relative overflow-hidden bg-gradient-to-br from-[#8C341A] via-[#C1502D] to-[#2D1B13] p-8 xl:p-12 flex-col justify-between">
        
        {/* Resplandores ambientales de marca */}
        <div className="pointer-events-none absolute -top-24 -right-24 size-96 rounded-full bg-[radial-gradient(circle,rgba(232,178,61,0.3)_0%,transparent_70%)] blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-20 size-80 rounded-full bg-[radial-gradient(circle,rgba(90,122,58,0.25)_0%,transparent_70%)] blur-3xl" />

        {/* Encabezado del Showcase */}
        <div className="relative z-10 max-w-lg">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.08] px-3.5 py-1 text-white/90 backdrop-blur-md mb-3 shadow-xs">
            <Cpu className="size-3.5 text-[#E8B23D]" />
            <span className="text-[10.5px] font-bold uppercase tracking-wider text-[#E8B23D]">
              Ecosistema Integrado
            </span>
          </div>
          <h2 className="text-2xl xl:text-3xl font-bold text-white leading-tight tracking-tight">
            Todo el control de tu planta
            <span 
              className="block font-serif italic font-normal text-[#FBD28A] text-[1.02em] mt-0.5 tracking-normal"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              en una sola plataforma
            </span>
          </h2>
          <p className="text-[#FFFBF0]/85 text-xs sm:text-[13px] leading-relaxed mt-2 max-w-md font-normal">
            Estandariza fórmulas de arepas de maíz, controla compras de materia prima y sincroniza la logística de entregas.
          </p>
        </div>

        {/* ─── Mockup Visual Interactivo ─── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10 flex-1 w-full bg-[#FFFBF0] rounded-2xl border border-[#E8DCC0] shadow-2xl overflow-hidden flex transform translate-y-3 hover:translate-y-1 transition-transform duration-500 ease-out mt-5"
        >
          
          {/* Sidebar del Mockup */}
          <div className="w-16 md:w-44 bg-[#F5ECD8] border-r border-[#E8DCC0] p-3.5 flex flex-col gap-2.5">
            <div className="w-7 h-7 bg-[#C1502D] rounded-xl mb-1 flex items-center justify-center text-white shadow-xs">
              <Factory className="size-4" />
            </div>
            <div className="w-full h-2.5 bg-[#C1502D]/25 rounded-full" />
            <div className="w-3/4 h-2 bg-slate-400/30 rounded-full" />
            <div className="w-5/6 h-2 bg-slate-400/30 rounded-full" />
            <div className="w-2/3 h-2 bg-slate-400/30 rounded-full" />
            <div className="w-full h-2 bg-slate-400/20 rounded-full mt-auto" />
          </div>

          {/* Contenido Principal del Mockup */}
          <div className="flex-1 p-4 sm:p-5 flex flex-col gap-4 bg-[#FFFBF0] overflow-hidden">
            
            {/* Top Header Mockup */}
            <motion.div variants={itemVariants} className="flex justify-between items-center pb-2 border-b border-[#E8DCC0]/70">
              <div className="flex items-center gap-2">
                <div className="size-2 rounded-full bg-[#5A7A3A] animate-pulse" />
                <span className="text-[11px] font-bold text-slate-800 tracking-tight">Alta de Operaciones</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-full bg-[#5A7A3A]/15 border border-[#5A7A3A]/30 px-2.5 py-0.5 text-[10px] font-bold text-[#5A7A3A]">
                <Check className="size-3" />
                <span>Acceso Inmediato</span>
              </div>
            </motion.div>

            {/* 3 Metric Cards con Stagger */}
            <motion.div variants={itemVariants} className="grid grid-cols-3 gap-2.5">
              
              {/* Card 1: Insumos */}
              <div className="bg-white p-2.5 sm:p-3 rounded-2xl shadow-xs border border-[#E8DCC0] flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="size-6 rounded-lg bg-[#5A7A3A]/15 text-[#5A7A3A] flex items-center justify-center">
                    <TrendingUp className="size-3.5" />
                  </span>
                  <span className="text-[9px] font-bold text-[#5A7A3A]">16 Activos</span>
                </div>
                <span className="text-[10px] text-slate-500 font-medium mt-1">Materia Prima</span>
                <span className="text-xs sm:text-[13px] font-extrabold text-slate-900">Maíz y Queso</span>
              </div>

              {/* Card 2: Recetas */}
              <div className="bg-white p-2.5 sm:p-3 rounded-2xl shadow-xs border border-[#E8DCC0] flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="size-6 rounded-lg bg-[#E8B23D]/20 text-[#8A5A14] flex items-center justify-center">
                    <Award className="size-3.5" />
                  </span>
                  <span className="text-[9px] font-bold text-[#8A5A14]">8 Fichas</span>
                </div>
                <span className="text-[10px] text-slate-500 font-medium mt-1">Estandarización</span>
                <span className="text-xs sm:text-[13px] font-extrabold text-slate-900">100% Calidad</span>
              </div>

              {/* Card 3: Producción */}
              <div className="bg-white p-2.5 sm:p-3 rounded-2xl shadow-xs border border-[#E8DCC0] flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="size-6 rounded-lg bg-[#C1502D]/15 text-[#C1502D] flex items-center justify-center">
                    <Package className="size-3.5" />
                  </span>
                  <span className="text-[9px] font-bold text-[#C1502D]">16 Lotes</span>
                </div>
                <span className="text-[10px] text-slate-500 font-medium mt-1">Despacho</span>
                <span className="text-xs sm:text-[13px] font-extrabold text-slate-900">En Tiempo Real</span>
              </div>

            </motion.div>

            {/* Muestra gráfica de flujo y checklist */}
            <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-xs border border-[#E8DCC0] p-3 flex flex-col justify-between flex-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10.5px] font-bold text-slate-700">Módulos habilitados con tu usuario</span>
                <BarChart3 className="size-3.5 text-slate-400" />
              </div>
              
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs p-1.5 rounded-lg bg-[#FFFBF0] border border-[#E8DCC0]/60">
                  <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                    <CheckCircle2 className="size-3.5 text-[#5A7A3A]" />
                    Control de Producción y Lotes
                  </span>
                  <span className="text-[10px] font-bold text-[#5A7A3A]">Sincronizado</span>
                </div>
                <div className="flex items-center justify-between text-xs p-1.5 rounded-lg bg-[#FFFBF0] border border-[#E8DCC0]/60">
                  <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                    <CheckCircle2 className="size-3.5 text-[#5A7A3A]" />
                    Fórmulas y Fichas Técnicas
                  </span>
                  <span className="text-[10px] font-bold text-[#5A7A3A]">Activo</span>
                </div>
                <div className="flex items-center justify-between text-xs p-1.5 rounded-lg bg-[#FFFBF0] border border-[#E8DCC0]/60">
                  <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                    <CheckCircle2 className="size-3.5 text-[#5A7A3A]" />
                    Pedidos y Facturación de Ventas
                  </span>
                  <span className="text-[10px] font-bold text-[#5A7A3A]">Habilitado</span>
                </div>
              </div>
            </motion.div>

          </div>
        </motion.div>

        {/* Badge inferior de garantía */}
        <div className="relative z-10 flex items-center justify-between pt-4 border-t border-white/10 text-[11px] text-[#FFFBF0]/75">
          <div className="flex items-center gap-2">
            <ShieldCheck className="size-3.5 text-[#E8B23D]" />
            <span>Seguridad y control de roles por usuario</span>
          </div>
          <span className="font-semibold text-[#FBD28A]">CENAREPAS v2.0</span>
        </div>
      </div>

    </div>
  );
}