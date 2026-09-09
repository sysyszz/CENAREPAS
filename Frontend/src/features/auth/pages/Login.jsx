import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useGoogleLogin } from '@react-oauth/google';
import {
  Eye, EyeOff, Sparkles, ShieldCheck, ArrowRight,
  TrendingUp, CheckCircle2, Lock, Mail, Factory,
  Package, Laptop, Award, BarChart3, Activity
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../../../shared/contexts/ThemeContext';
import cenarepasLogo from '../../../assets/cenarepas-icon.svg';
import { Sun, Moon } from 'lucide-react';

// Variantes de animación para la entrada escalonada (Stagger) del panel derecho
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

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const { isLoading, handleLogin, handleGoogleAuth, navigate } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await handleLogin(email, password);
    if (success) {
      if (onLogin) onLogin();
      navigate('/admin');
    }
  };

  // Manejador del flujo de Google Login
  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      if (handleGoogleAuth) {
        const success = await handleGoogleAuth(tokenResponse.access_token);
        if (success) {
          if (onLogin) onLogin();
          navigate('/admin');
        }
      } else {
        if (onLogin) onLogin();
        navigate('/admin');
      }
    },
    onError: (error) => {
      console.error('Error en la autenticación con Google:', error);
    },
  });
  return (
    <div className="min-h-screen lg:h-screen w-full flex bg-background font-sans text-foreground overflow-y-auto lg:overflow-hidden selection:bg-[#C1502D]/15 selection:text-[#C1502D] transition-colors duration-200">
      
      {/* ════════════════════ PANEL IZQUIERDO — FORMULARIO PROPORCIONADO ════════════════════ */}
      <motion.div
        initial={{ opacity: 0, x: -24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="w-full lg:w-[50%] xl:w-[48%] min-h-screen lg:h-screen overflow-y-auto flex flex-col justify-between px-4 sm:px-8 md:px-12 lg:px-14 xl:px-18 py-6 sm:py-7 lg:py-8 bg-background text-foreground"
      >
        
        {/* Top bar / Logo + Badge de Estado + Theme Toggle */}
        <div className="w-full max-w-[420px] mx-auto flex items-center justify-between gap-3 mb-4">
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
              Sistema en Línea
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
        <div className="w-full max-w-[420px] mx-auto my-auto py-2">

          {/* Eyebrow de Marca */}
          <div className="inline-flex items-center gap-1.5 rounded-full border border-[#C1502D]/20 bg-[#C1502D]/10 px-2.5 py-0.5 text-[#C1502D] mb-2.5">
            <Sparkles className="size-3 text-[#C1502D]" />
            <span className="landing-eyebrow text-[10px] text-[#C1502D]">Portal Administrativo</span>
          </div>

          {/* Encabezado con Acento Tipográfico Elegante Scoped al Login */}
          <div className="mb-4">
            <h1 className="text-2xl sm:text-[1.75rem] font-bold text-foreground tracking-tight leading-tight">
              Sistema de Gestión
              <span 
                className="block font-serif italic font-normal text-[#C1502D] dark:text-[#E8B23D] text-[0.96em] mt-0.5 tracking-normal"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                para fábricas de alimentos
              </span>
            </h1>
            <p className="text-muted-foreground text-xs sm:text-[13px] mt-1.5 leading-relaxed font-normal">
              Ingresa tus credenciales para acceder al panel de control en tiempo real.
            </p>
          </div>

          {/* Bloque Estilizado de Credenciales de Prueba */}
          <div className="bg-card dark:bg-[#111820] border border-border dark:border-[rgba(148,163,184,0.14)] rounded-2xl p-3 sm:p-3.5 mb-4 shadow-[0_2px_8px_rgba(45,41,38,0.03)] dark:shadow-none">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-[#C1502D]/10 dark:bg-[#E8B23D]/15 px-2 py-0.5 text-[9.5px] font-bold text-[#C1502D] dark:text-[#E8B23D] uppercase tracking-wider">
                <ShieldCheck className="size-3 text-[#C1502D] dark:text-[#E8B23D]" />
                Credenciales de prueba
              </span>
              <span className="text-[10px] font-semibold text-[#5A7A3A] dark:text-[#AEC094]">Acceso Demo</span>
            </div>
            <div className="space-y-1 text-xs text-muted-foreground">
              <p className="flex items-center justify-between">
                <span className="text-muted-foreground font-medium">Email:</span>
                <strong className="font-semibold text-foreground font-mono text-[11.5px] bg-[#FFFBF0] dark:bg-[#0B0F14] px-2 py-0.5 rounded border border-[#E8DCC0] dark:border-[rgba(148,163,184,0.18)]">admin@sistema.com</strong>
              </p>
              <p className="flex items-center justify-between">
                <span className="text-muted-foreground font-medium">Contraseña:</span>
                <strong className="font-semibold text-foreground font-mono text-[11.5px] bg-[#FFFBF0] dark:bg-[#0B0F14] px-2 py-0.5 rounded border border-[#E8DCC0] dark:border-[rgba(148,163,184,0.18)]">123456</strong>
              </p>
            </div>
          </div>

          {/* Botón Google con Microinteracciones */}
          <motion.button 
            onClick={() => loginWithGoogle()}
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
            <span>Continuar con Google</span>
          </motion.button>

          {/* Divisor Visual */}
          <div className="flex items-center my-3.5">
            <div className="flex-grow border-t border-border dark:border-[rgba(148,163,184,0.14)]"></div>
            <span className="mx-3 text-[10.5px] text-muted-foreground font-medium uppercase tracking-wider">o con tu correo</span>
            <div className="flex-grow border-t border-border dark:border-[rgba(148,163,184,0.14)]"></div>
          </div>

          {/* Formulario Estándar */}
          <form onSubmit={handleSubmit} className="space-y-3">
            
            {/* Campo Correo */}
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
                  placeholder="admin@sistema.com" 
                  autoComplete="email"
                  className="w-full h-11 bg-[#FFFBF0]/60 dark:bg-[#0E141B] border border-[#E8DCC0] dark:border-[rgba(148,163,184,0.18)] text-foreground text-xs sm:text-sm placeholder:text-muted-foreground rounded-xl pl-10 pr-3.5 transition-all duration-200 focus:bg-white dark:focus:bg-[#111820] focus:border-[#C1502D] dark:focus:border-[#E8B23D] focus:ring-2 focus:ring-[#C1502D]/15 dark:focus:ring-[#E8B23D]/20 focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* Campo Contraseña */}
            <div>
              <label className="block text-[11.5px] font-bold text-foreground/90 mb-1">
                Contraseña <span className="text-[#C1502D] dark:text-[#E8B23D]">*</span>
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" 
                  autoComplete="current-password"
                  className="w-full h-11 bg-[#FFFBF0]/60 dark:bg-[#0E141B] border border-[#E8DCC0] dark:border-[rgba(148,163,184,0.18)] text-foreground text-xs sm:text-sm placeholder:text-muted-foreground rounded-xl pl-10 pr-11 transition-all duration-200 focus:bg-white dark:focus:bg-[#111820] focus:border-[#C1502D] dark:focus:border-[#E8B23D] focus:ring-2 focus:ring-[#C1502D]/15 dark:focus:ring-[#E8B23D]/20 focus:outline-none"
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-muted-foreground hover:text-[#C1502D] dark:hover:text-[#E8B23D] transition-colors cursor-pointer"
                  aria-label="Mostrar u ocultar contraseña"
                >
                  {showPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Opciones Recordarme / Olvidó Contraseña */}
            <div className="flex items-center justify-between pt-0.5">
              <label className="flex items-center text-[11.5px] text-muted-foreground cursor-pointer select-none">
                <input 
                  type="checkbox" 
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="size-3.5 rounded border-border text-[#C1502D] dark:text-[#E8B23D] accent-[#C1502D] dark:accent-[#E8B23D] focus:ring-0 mr-1.5 cursor-pointer" 
                />
                Recordarme
              </label>
              
              <button
                type="button"
                onClick={() => navigate('/admin/forgot-password')}
                className="text-[11.5px] font-semibold text-[#C1502D] dark:text-[#E8B23D] hover:text-[#8A3418] dark:hover:text-[#F0C05E] transition-colors bg-transparent border-0 cursor-pointer p-0"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            {/* Botón Principal Iniciar Sesión (Sólido Terracota #C1502D) */}
            <motion.button 
              type="submit" 
              disabled={isLoading}
              whileHover={{ scale: isLoading ? 1 : 1.012, y: -1 }}
              whileTap={{ scale: 0.988 }}
              className={`w-full h-11 text-white font-bold rounded-full text-xs sm:text-[13px] px-6 transition-all duration-200 flex justify-center items-center gap-2 cursor-pointer mt-3.5 shadow-md shadow-[#C1502D]/25 dark:shadow-[#C1502D]/40 ${
                isLoading 
                  ? 'bg-[#C1502D]/70 cursor-not-allowed shadow-none' 
                  : 'bg-[#C1502D] hover:bg-[#8A3418] active:translate-y-[1px]'
              }`}
            >
              {isLoading && (
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 0.7, ease: 'linear' }}
                  className="size-3.5 border-2 border-white/30 border-t-white rounded-full"
                />
              )}
              <span>{isLoading ? 'Iniciando sesión…' : 'Iniciar Sesión'}</span>
              {!isLoading && <ArrowRight className="size-3.5" />}
            </motion.button>
          </form>

          {/* Registro Link */}
          <div className="text-center mt-3.5">
            <p className="text-xs text-muted-foreground">
              ¿Aún no tienes una cuenta?{' '}
              <button 
                type="button"
                onClick={() => navigate('/register')} 
                className="text-[#C1502D] dark:text-[#E8B23D] font-bold hover:text-[#8A3418] dark:hover:text-[#F0C05E] hover:underline bg-transparent border-0 cursor-pointer p-0 ml-1 transition-colors"
              >
                Regístrate aquí
              </button>
            </p>
          </div>

        </div>

        {/* Footer del Panel */}
        <div className="w-full max-w-[420px] mx-auto mt-2 text-center lg:text-left text-[11px] text-muted-foreground font-normal">
          © {new Date().getFullYear()} CENAREPAS · Todos los derechos reservados.
        </div>

      </motion.div>

      {/* ════════════════════ PANEL DERECHO — BRANDING / DASHBOARD MOCKUP ════════════════════ */}
      <motion.div
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.65, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        className="hidden lg:flex lg:w-[50%] xl:w-[52%] p-5 xl:p-6 h-screen overflow-hidden"
      >
        <div className="w-full h-full bg-gradient-to-br from-[#1E0E07] via-[#160803] to-[#0C0402] rounded-3xl xl:rounded-[2.25rem] p-7 xl:p-9 flex flex-col justify-between relative overflow-hidden border border-white/10 shadow-[0_25px_70px_-15px_rgba(25,12,6,0.35)]">
          
          {/* Resplandores ambientales de marca */}
          <div className="pointer-events-none absolute -top-24 -right-24 size-96 rounded-full bg-[radial-gradient(circle,rgba(193,80,45,0.35)_0%,transparent_70%)] blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-20 size-80 rounded-full bg-[radial-gradient(circle,rgba(232,178,61,0.2)_0%,transparent_70%)] blur-3xl" />

          {/* Encabezado del Showcase con Acento Tipográfico Elegante Scoped al Login */}
          <div className="relative z-10 max-w-lg">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-3.5 py-1 text-white/90 backdrop-blur-md mb-3 shadow-xs">
              <Activity className="size-3.5 text-[#E8B23D]" />
              <span className="landing-eyebrow text-[10.5px] text-[#E8B23D]">Monitoreo Operativo</span>
            </div>
            <h2 className="text-2xl xl:text-3xl font-bold text-white leading-tight tracking-tight">
              Gestión inteligente para
              <span 
                className="block font-serif italic font-normal text-[#FBD28A] text-[1.02em] mt-0.5 tracking-normal"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                tu fábrica de alimentos
              </span>
            </h2>
            <p className="text-[#FFFBF0]/80 text-xs sm:text-[13px] leading-relaxed mt-2 max-w-md font-normal">
              Métricas en tiempo real, control de recetas, trazabilidad de lotes y despacho diario en una plataforma unificada.
            </p>
          </div>

          {/* ─── Mockup Interactivo con Animación Escalonada (Stagger) ─── */}
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
                  <span className="text-[11px] font-bold text-slate-800 tracking-tight">Planta Bello Oriente</span>
                </div>
                <div className="flex items-center gap-1.5 rounded-full bg-[#E8B23D]/20 border border-[#E8B23D]/40 px-2.5 py-0.5 text-[10px] font-bold text-[#8A5A14]">
                  <span>En Producción</span>
                </div>
              </motion.div>

              {/* 3 Metric Cards con Stagger */}
              <motion.div variants={itemVariants} className="grid grid-cols-3 gap-2.5">
                
                {/* Card 1: Verde */}
                <div className="bg-white p-2.5 sm:p-3 rounded-2xl shadow-xs border border-[#E8DCC0] flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span className="size-6 rounded-lg bg-[#5A7A3A]/15 text-[#5A7A3A] flex items-center justify-center">
                      <TrendingUp className="size-3.5" />
                    </span>
                    <span className="text-[9px] font-bold text-[#5A7A3A]">+14%</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-medium mt-1">Producción</span>
                  <span className="text-xs sm:text-[13px] font-extrabold text-slate-900">1,000 pqt</span>
                </div>

                {/* Card 2: Oro */}
                <div className="bg-white p-2.5 sm:p-3 rounded-2xl shadow-xs border border-[#E8DCC0] flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span className="size-6 rounded-lg bg-[#E8B23D]/20 text-[#8A5A14] flex items-center justify-center">
                      <Award className="size-3.5" />
                    </span>
                    <span className="text-[9px] font-bold text-[#8A5A14]">99.2%</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-medium mt-1">Calidad</span>
                  <span className="text-xs sm:text-[13px] font-extrabold text-slate-900">Lote #204</span>
                </div>

                {/* Card 3: Terracota */}
                <div className="bg-white p-2.5 sm:p-3 rounded-2xl shadow-xs border border-[#E8DCC0] flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span className="size-6 rounded-lg bg-[#C1502D]/15 text-[#C1502D] flex items-center justify-center">
                      <Package className="size-3.5" />
                    </span>
                    <span className="text-[9px] font-bold text-[#C1502D]">Activo</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-medium mt-1">Despacho</span>
                  <span className="text-xs sm:text-[13px] font-extrabold text-slate-900">12 Rutas</span>
                </div>

              </motion.div>

              {/* Gráficos de barras y radial simulados */}
              <motion.div variants={itemVariants} className="flex gap-2.5 flex-1 min-h-[125px]">
                
                {/* Gráfico de Barras con 5 barras completas */}
                <div className="flex-1 bg-white rounded-2xl shadow-xs border border-[#E8DCC0] p-3 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-[10.5px] font-bold text-slate-700">Rendimiento por Turno</span>
                    <BarChart3 className="size-3.5 text-slate-400" />
                  </div>
                  
                  {/* Las 5 barras restauradas con colores sólidos explícitos y alturas porcentuales */}
                  <div className="flex items-end justify-between gap-1.5 h-20 px-1 pt-2">
                    {/* Lun */}
                    <div className="flex-1 h-full flex flex-col justify-end items-center gap-1">
                      <div className="w-full bg-[#E8B23D] h-[45%] rounded-t-sm" />
                      <span className="text-[8.5px] font-semibold text-slate-500">Lun</span>
                    </div>

                    {/* Mar */}
                    <div className="flex-1 h-full flex flex-col justify-end items-center gap-1">
                      <div className="w-full bg-[#5A7A3A] h-[85%] rounded-t-sm" />
                      <span className="text-[8.5px] font-semibold text-slate-500">Mar</span>
                    </div>

                    {/* Mié */}
                    <div className="flex-1 h-full flex flex-col justify-end items-center gap-1">
                      <div className="w-full bg-[#E2895F] h-[40%] rounded-t-sm" />
                      <span className="text-[8.5px] font-semibold text-slate-500">Mié</span>
                    </div>

                    {/* Jue */}
                    <div className="flex-1 h-full flex flex-col justify-end items-center gap-1">
                      <div className="w-full bg-[#C1502D] h-[95%] rounded-t-sm" />
                      <span className="text-[8.5px] font-semibold text-slate-500">Jue</span>
                    </div>

                    {/* Vie */}
                    <div className="flex-1 h-full flex flex-col justify-end items-center gap-1">
                      <div className="w-full bg-[#5A7A3A]/85 h-[65%] rounded-t-sm" />
                      <span className="text-[8.5px] font-semibold text-slate-500">Vie</span>
                    </div>
                  </div>
                </div>

                {/* Gráfico Circular de Progreso */}
                <div className="w-[38%] bg-white rounded-2xl shadow-xs border border-[#E8DCC0] p-3 flex flex-col items-center justify-center">
                  <div className="relative size-14 flex items-center justify-center">
                    <motion.div
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                      className="size-full rounded-full border-[5px] border-[#E8B23D]/30 border-t-[#C1502D] border-r-[#5A7A3A]"
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-[10px] font-extrabold text-slate-900">94%</span>
                    </div>
                  </div>
                  <span className="text-[9.5px] font-bold text-slate-700 mt-2 text-center">Meta Cumplida</span>
                </div>

              </motion.div>

            </div>
          </motion.div>
          
        </div>
      </motion.div>

    </div>
  );
}