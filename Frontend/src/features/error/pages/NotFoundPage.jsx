import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Compass, 
  ArrowLeft, 
  Home, 
  LayoutDashboard, 
  Sparkles,
  Wheat
} from 'lucide-react';
import cenarepasLogo from '../../../assets/cenarepas-icon.svg';
import { useConfiguracion } from '../../../shared/contexts/ConfiguracionContext';

export default function NotFoundPage({ isAuthenticated = false }) {
  const navigate = useNavigate();
  const { nombreProyecto, logoUrl } = useConfiguracion();

  const targetPath = isAuthenticated ? '/admin' : '/';
  const targetLabel = isAuthenticated ? 'Volver al Dashboard' : 'Volver al Inicio';
  const TargetIcon = isAuthenticated ? LayoutDashboard : Home;

  return (
    <div className="min-h-screen w-full bg-[#0B0F14] text-[#F1F5F9] flex flex-col justify-between p-4 sm:p-6 lg:p-8 relative overflow-hidden selection:bg-[#C1502D]/30">
      
      {/* ─── Resplandores ambientales de fondo (Neón de Fábrica) ─── */}
      <div className="pointer-events-none absolute -top-32 -left-32 size-96 rounded-full bg-[radial-gradient(circle,rgba(193,80,45,0.22)_0%,transparent_70%)] blur-3xl" />
      <div className="pointer-events-none absolute top-1/2 -right-32 size-96 rounded-full bg-[radial-gradient(circle,rgba(232,178,61,0.18)_0%,transparent_70%)] blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 left-1/3 size-96 rounded-full bg-[radial-gradient(circle,rgba(90,122,58,0.16)_0%,transparent_70%)] blur-3xl" />

      {/* Grid sutil de fondo */}
      <div 
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
          backgroundSize: '48px 48px'
        }}
      />

      {/* ─── 1. Header Superior con Marca ─── */}
      <motion.header
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-6xl mx-auto flex items-center justify-between"
      >
        <button
          onClick={() => navigate(targetPath)}
          className="flex items-center gap-3 bg-transparent border-0 cursor-pointer p-0 text-left group"
        >
          <img
            src={logoUrl || cenarepasLogo}
            alt={nombreProyecto || 'CENAREPAS'}
            className="h-9 sm:h-10 w-9 sm:w-10 object-contain rounded-xl drop-shadow-md transition-transform duration-200 group-hover:scale-105"
          />
          <div className="flex flex-col leading-none">
            <span className="text-sm sm:text-base font-extrabold tracking-tight text-white group-hover:text-[#E8B23D] transition-colors">
              {nombreProyecto || 'CENAREPAS'}
            </span>
            <span className="text-[9px] font-bold tracking-[0.16em] uppercase text-[#E8B23D] mt-0.5">
              FÁBRICA DE ALIMENTOS
            </span>
          </div>
        </button>

        <div className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-medium text-slate-400 backdrop-blur-sm">
          <span className="size-1.5 rounded-full bg-[#C1502D] animate-ping" />
          <span>Error 404</span>
        </div>
      </motion.header>

      {/* ─── 2. Contenido Central 404 ─── */}
      <main className="relative z-10 w-full max-w-2xl mx-auto my-auto py-8 sm:py-12 flex flex-col items-center text-center">
        
        {/* Eyebrow con Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="inline-flex items-center gap-2 rounded-full border border-[#C1502D]/30 bg-[#C1502D]/10 px-3.5 py-1 text-[#E2895F] mb-6 shadow-[0_0_16px_rgba(193,80,45,0.15)]"
        >
          <Compass className="size-3.5 text-[#E8B23D] animate-spin" style={{ animationDuration: '12s' }} />
          <span className="text-xs font-bold tracking-wider uppercase">Ruta no encontrada</span>
        </motion.div>

        {/* Gran Número 404 con Gradiente de Marca */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="relative select-none"
        >
          <span className="font-mono text-8xl sm:text-[11rem] md:text-[13rem] font-black tracking-tighter leading-none block text-transparent bg-clip-text bg-gradient-to-b from-white via-[#F5ECD8] to-[#C1502D]/60 drop-shadow-[0_10px_35px_rgba(193,80,45,0.25)]">
            404
          </span>
          
          {/* Detalle flotante artesanal */}
          <div className="absolute -top-2 right-4 sm:right-8 size-8 sm:size-10 rounded-full bg-[#E8B23D]/20 border border-[#E8B23D]/40 flex items-center justify-center text-[#E8B23D] shadow-[0_0_14px_rgba(232,178,61,0.3)]">
            <Wheat className="size-4 sm:size-5" />
          </div>
        </motion.div>

        {/* Títulos y Explicación */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-3 mt-2 max-w-lg"
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Esta página no existe en nuestra fábrica
          </h1>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed font-normal">
            La dirección a la que intentas acceder no fue encontrada, ha sido reubicada o nunca estuvo horneada.
          </p>
        </motion.div>

        {/* Acciones de Navegación */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mt-8 w-full sm:w-auto"
        >
          {/* Botón Principal (Dashboard o Landing según sesión) */}
          <motion.button
            type="button"
            onClick={() => navigate(targetPath)}
            whileHover={{ scale: 1.025, y: -1 }}
            whileTap={{ scale: 0.98 }}
            className="w-full sm:w-auto h-12 px-7 rounded-full bg-[#C1502D] hover:bg-[#8A3418] text-white font-bold text-sm shadow-lg shadow-[#C1502D]/30 flex items-center justify-center gap-2.5 transition-all duration-200 cursor-pointer"
          >
            <TargetIcon className="size-4.5" />
            <span>{targetLabel}</span>
          </motion.button>

          {/* Botón Secundario: Retroceder */}
          <motion.button
            type="button"
            onClick={() => navigate(-1)}
            whileHover={{ scale: 1.025, y: -1 }}
            whileTap={{ scale: 0.98 }}
            className="w-full sm:w-auto h-12 px-6 rounded-full bg-[#111820] hover:bg-[#16202A] border border-white/10 hover:border-white/20 text-slate-300 hover:text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer"
          >
            <ArrowLeft className="size-4" />
            <span>Página Anterior</span>
          </motion.button>
        </motion.div>

      </main>

      {/* ─── 3. Footer Sutil ─── */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.45 }}
        className="relative z-10 w-full max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-[11.5px] text-slate-500 pt-4 border-t border-white/[0.06]"
      >
        <span>© {new Date().getFullYear()} {nombreProyecto || 'CENAREPAS'} · Sistema de Gestión de Alimentos</span>
        <span className="text-slate-600">Código de estado: HTTP 404 Not Found</span>
      </motion.footer>

    </div>
  );
}
