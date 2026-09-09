import { useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';

export function GradientCTACard() {
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();

  return (
    <div
      className="relative flex h-full flex-col justify-between overflow-hidden rounded-2xl p-6"
      style={{ background: 'linear-gradient(135deg, #c1502d 0%, #a8471f 55%, #6b5636 100%)' }}
    >
      <svg className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 opacity-20" viewBox="0 0 100 100" aria-hidden="true">
        <circle cx="50" cy="50" r="45" fill="none" stroke="#fffbf0" strokeWidth="1.5" />
        <circle cx="50" cy="50" r="30" fill="none" stroke="#fffbf0" strokeWidth="1.5" />
      </svg>

      <div className="relative">
        <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-[#fffbf0]">
          <Sparkles className="h-3 w-3" />
          Nuevo
        </div>
        <p className="mb-1.5 text-lg font-bold text-[#fffbf0]">Asistente de Reportes</p>
        <p className="text-sm leading-relaxed text-[#fde8b8]">
          Detecta riesgos de desabasto y cuellos de botella en producción antes de que te afecten.
        </p>
      </div>

      <div className="relative mt-6 flex flex-col gap-2">
        <motion.button
          type="button"
          onClick={() => navigate('/admin/insumos')}
          whileHover={shouldReduceMotion ? undefined : { y: -2 }}
          whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 400, damping: 28 }}
          className="flex items-center justify-center gap-1.5 rounded-full bg-[#fffbf0] px-4 py-2.5 text-sm font-semibold text-[#8a3418] shadow-lg"
        >
          Ver Insumos en Riesgo
          <ArrowRight className="h-4 w-4" />
        </motion.button>
        <motion.button
          type="button"
          whileHover={shouldReduceMotion ? undefined : { y: -2 }}
          whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 400, damping: 28 }}
          className="rounded-full border border-white/30 bg-white/10 px-4 py-2.5 text-sm font-medium text-[#fffbf0] backdrop-blur-sm"
        >
          Más tarde
        </motion.button>
      </div>
    </div>
  );
}
