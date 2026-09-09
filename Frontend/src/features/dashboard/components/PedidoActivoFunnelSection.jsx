import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ClipboardList, CheckCircle2, Eye, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function PedidoActivoFunnelSection({ pedidoData }) {
  const navigate = useNavigate();
  const [completado, setCompletado] = useState(false);
  const [hoveredStage, setHoveredStage] = useState(null);

  const pedido = pedidoData || {
    id: '#4821',
    cliente: 'Panadería La Espiga',
    sede: 'Bello Oriente',
    estado: 'retrasado',
    unidades: 3200,
  };

  const funnelStages = [
    { name: 'Insumos', unidades: 3200, current: false },
    { name: 'Producción', unidades: 3200, current: true },
    { name: 'Empaque', unidades: 2450, current: false },
    { name: 'Despacho', unidades: 1800, current: false },
  ];

  const maxUnidades = funnelStages[0].unidades;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1.25fr_1fr] gap-4.5 mb-7">
      
      {/* ─── Card 1: Pedido Activo #4821 ─── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        whileHover={{ y: -3, transition: { duration: 0.2 } }}
        className="bg-card dark:bg-[#111820] rounded-3xl p-4.5 sm:p-6 shadow-[0_2px_10px_rgba(46,43,37,0.06)] dark:shadow-none border-t-4 border-t-[#C1502D] dark:border-t-[#E8B23D] border-x border-b border-border dark:border-[rgba(148,163,184,0.14)] flex flex-col justify-between"
      >
        <div>
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-full bg-[#FFE1D0] dark:bg-[#C1502D]/20 flex items-center justify-center text-[#8C491A] dark:text-[#E2895F]">
                <ClipboardList className="size-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-foreground leading-tight">
                  Pedido {pedido.id} · {pedido.cliente}
                </h4>
                <p className="text-xs text-slate-500 dark:text-muted-foreground mt-0.5">{pedido.sede}</p>
              </div>
            </div>

            <motion.span 
              layout
              className={`text-xs font-bold px-3 py-1 rounded-full ${
                completado 
                  ? 'bg-[#E1EECC] dark:bg-[#5A7A3A]/25 text-[#3D472B] dark:text-[#AEC094]' 
                  : 'bg-[#FFE1D0] dark:bg-[#C1502D]/25 text-[#C1502D] dark:text-[#E2895F]'
              }`}
            >
              {completado ? 'Completado' : 'Retrasado'}
            </motion.span>
          </div>

          {/* Gran número de unidades */}
          <div className="font-mono text-4xl sm:text-[46px] font-extrabold text-slate-900 dark:text-foreground mb-6 tracking-tight tabular-nums">
            {pedido.unidades.toLocaleString('es-CO')}
            <span className="ml-2 text-base font-semibold text-slate-500 dark:text-muted-foreground">un.</span>
          </div>
        </div>

        {/* Acciones */}
        <div className="flex flex-wrap items-center gap-2.5 pt-2">
          <motion.button
            type="button"
            onClick={() => navigate('/admin/pedidos')}
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
            className="h-10 px-5 rounded-full bg-[#C1502D] text-white font-bold text-xs sm:text-[13px] shadow-md shadow-[#C1502D]/20 hover:bg-[#8A3418] transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Eye className="size-4" />
            <span>Ver Detalle</span>
          </motion.button>

          <motion.button
            type="button"
            onClick={() => setCompletado(!completado)}
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
            className={`h-10 px-5 rounded-full font-bold text-xs sm:text-[13px] border transition-all flex items-center gap-1.5 cursor-pointer ${
              completado 
                ? 'bg-[#E1EECC] dark:bg-[#5A7A3A]/25 border-[#AEC094] dark:border-[#5A7A3A]/40 text-[#3D472B] dark:text-[#AEC094]' 
                : 'bg-card dark:bg-[#111820] border-border dark:border-[rgba(148,163,184,0.14)] text-foreground hover:bg-muted'
            }`}
          >
            {completado ? <Check className="size-4" /> : <CheckCircle2 className="size-4 text-[#5A7A3A] dark:text-[#AEC094]" />}
            <span>{completado ? 'Marcado como Listo' : 'Marcar Completado'}</span>
          </motion.button>
        </div>
      </motion.div>

      {/* ─── Card 2: Ciclo de Producción (Funnel 4 Etapas) ─── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
        whileHover={{ y: -3, transition: { duration: 0.2 } }}
        className="bg-card dark:bg-[#111820] rounded-3xl p-4.5 sm:p-6 shadow-[0_2px_10px_rgba(46,43,37,0.06)] dark:shadow-none border border-border dark:border-[rgba(148,163,184,0.14)] flex flex-col justify-between"
      >
        <div>
          <h4 className="text-[15px] font-bold text-slate-900 dark:text-foreground leading-tight mb-1">
            Ciclo de Producción
          </h4>
          <p className="text-xs text-slate-500 dark:text-muted-foreground mb-5">
            Unidades por etapa · Pedido {pedido.id}
          </p>
        </div>

        {/* Funnel Bars Container */}
        <div className="flex items-end justify-between gap-3 h-40 pt-4 px-2">
          {funnelStages.map((stage, idx) => {
            const heightPct = Math.round((stage.unidades / maxUnidades) * 100);
            const advancePct = Math.round((stage.unidades / maxUnidades) * 100);
            const isHovered = hoveredStage === idx;
            const isCurrent = stage.current;

            return (
              <div
                key={stage.name}
                className="flex-1 flex flex-col items-center justify-end h-full relative cursor-pointer group"
                onMouseEnter={() => setHoveredStage(idx)}
                onMouseLeave={() => setHoveredStage(null)}
              >
                {/* Floating Tooltip */}
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      initial={{ opacity: 0, y: 4, scale: 0.95 }}
                      animate={{ opacity: 1, y: -6, scale: 1 }}
                      exit={{ opacity: 0, y: 2, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute bottom-full mb-2 bg-slate-900 text-white text-[11px] font-semibold px-2.5 py-1.5 rounded-xl whitespace-nowrap shadow-lg z-20 pointer-events-none"
                    >
                      {stage.unidades.toLocaleString('es-CO')} un. · {advancePct}% del total
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Number above bar */}
                <span className="font-mono text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 tabular-nums">
                  {stage.unidades.toLocaleString('es-CO')}
                </span>

                {/* Animated Growing Bar */}
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${heightPct}%` }}
                  transition={{ duration: 0.85, delay: idx * 0.12, ease: [0.22, 1, 0.36, 1] }}
                  className={`w-full max-w-[48px] rounded-t-xl transition-all duration-300 ${
                    isCurrent
                      ? 'bg-gradient-to-t from-[#8C491A] to-[#E2895F] shadow-sm shadow-[#C1502D]/30'
                      : 'bg-[#DCD3C4] dark:bg-[#1E293B] group-hover:bg-[#C0B6A5] dark:group-hover:bg-[#334155]'
                  }`}
                />

                {/* Stage Label */}
                <span 
                  className={`mt-2.5 text-[11.5px] font-medium transition-colors ${
                    isCurrent ? 'font-bold text-[#C1502D] dark:text-[#E8B23D]' : 'text-slate-600 dark:text-muted-foreground'
                  }`}
                >
                  {stage.name}
                </span>
              </div>
            );
          })}
        </div>
      </motion.div>

    </div>
  );
}
