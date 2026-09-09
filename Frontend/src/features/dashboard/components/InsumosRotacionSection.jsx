import React from 'react';
import { motion } from 'framer-motion';
import { Wheat, Package, TrendingUp, TrendingDown, Sparkles, ArrowRight } from 'lucide-react';

function buildSparkPath(vals) {
  const w = 72, h = 44, pad = 3;
  const max = Math.max(...vals), min = Math.min(...vals);
  const range = max - min || 1;
  const pts = vals.map((v, i) => {
    const x = (i / (vals.length - 1)) * w;
    const y = h - pad - ((v - min) / range) * (h - pad * 2);
    return [x, y];
  });
  return pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');
}

export function InsumosRotacionSection({ insumosData, onOpenAsistente }) {
  const defaultInsumos = [
    {
      id: 'harina-amarilla',
      nombre: 'Harina Maíz Amarillo',
      icon: Wheat,
      rotacionDias: 4.2,
      deltaPct: -14.3,
      deltaAbs: '-0.7d',
      tendencia: [5.6, 5.4, 5.1, 4.9, 4.6, 4.4, 4.2],
    },
    {
      id: 'harina-blanca',
      nombre: 'Harina Maíz Blanco',
      icon: Wheat,
      rotacionDias: 7.8,
      deltaPct: 6.8,
      deltaAbs: '+0.5d',
      tendencia: [7.1, 7.2, 7.0, 7.4, 7.5, 7.6, 7.8],
    },
    {
      id: 'sal-refinada',
      nombre: 'Sal Refinada',
      icon: Package,
      rotacionDias: 21.5,
      deltaPct: 2.1,
      deltaAbs: '+0.4d',
      tendencia: [20.8, 21.0, 20.9, 21.1, 21.2, 21.3, 21.5],
    },
  ];

  const list = insumosData || defaultInsumos;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4.5 mb-7">
      {/* 3 Insumos Cards */}
      {list.map((ins, idx) => {
        const isPositive = ins.deltaPct >= 0;
        const IconComp = ins.icon || (ins.id.includes('harina') ? Wheat : Package);
        const sparkLine = buildSparkPath(ins.tendencia || [5, 6, 5, 7, 6, 8]);
        const lineColor = isPositive ? '#728157' : '#C1502D';

        return (
          <motion.div
            key={ins.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: idx * 0.08 + 0.1, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="bg-card dark:bg-[#111820] rounded-3xl p-4.5 sm:p-5.5 shadow-[0_2px_10px_rgba(46,43,37,0.06)] dark:shadow-none border border-border dark:border-[rgba(148,163,184,0.14)] hover:shadow-md transition-shadow duration-300 flex flex-col justify-between"
          >
            {/* Header del Insumo */}
            <div className="flex items-center gap-2.5 mb-3.5">
              <div className="size-8.5 rounded-full flex items-center justify-center bg-[#FFE1D0] dark:bg-[#C1502D]/20 text-[#8C491A] dark:text-[#E2895F]">
                <IconComp className="size-4" />
              </div>
              <span className="text-[13.5px] font-bold text-slate-800 dark:text-foreground truncate">{ins.nombre}</span>
            </div>

            {/* Rotación en Días & Delta Tag */}
            <div className="flex items-baseline justify-between mb-2.5">
              <div className="font-mono text-[24px] sm:text-[26px] font-bold text-slate-900 dark:text-foreground tabular-nums">
                {ins.rotacionDias}
                <span className="ml-1.5 text-xs font-medium text-slate-500 dark:text-muted-foreground">días</span>
              </div>
              <span 
                className={`inline-flex items-center gap-1 text-[10.5px] font-bold px-2.5 py-0.5 rounded-full ${
                  isPositive 
                    ? 'bg-[#E1EECC] dark:bg-[#5A7A3A]/25 text-[#3D472B] dark:text-[#AEC094]' 
                    : 'bg-[#FFE1D0] dark:bg-[#C1502D]/25 text-[#8C491A] dark:text-[#E2895F]'
                }`}
              >
                {isPositive ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
                {isPositive ? `+${ins.deltaPct.toFixed(1)}%` : `${ins.deltaPct.toFixed(1)}%`}
              </span>
            </div>

            {/* Sparkline con Badge Flotante de Delta Absoluto */}
            <div className="relative h-11 pt-1">
              <span 
                className="absolute -top-1.5 right-0 font-mono text-[10.5px] font-bold px-2 py-0.5 rounded-md border border-border dark:border-[rgba(148,163,184,0.2)] bg-[#FFFBF0] dark:bg-[#0B0F14]"
                style={{ color: lineColor }}
              >
                {ins.deltaAbs}
              </span>
              <svg width="100%" height="44" viewBox="0 0 72 44" preserveAspectRatio="none" className="block overflow-visible">
                <path d={sparkLine} fill="none" stroke={lineColor} strokeWidth="2.2" strokeLinecap="round" />
              </svg>
            </div>
          </motion.div>
        );
      })}

      {/* 4th Card: Asistente Banner CTA Gradiente */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
        whileHover={{ y: -4, transition: { duration: 0.2 } }}
        className="relative overflow-hidden rounded-3xl p-4.5 sm:p-5.5 flex flex-col justify-between shadow-md bg-gradient-to-br from-[#D67F48] via-[#C1502D] to-[#8C491A] text-white"
      >
        {/* Anillos ambientales decorativos */}
        <svg className="absolute -top-7 -right-7 size-36 opacity-20 pointer-events-none" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="none" stroke="#FFFFFF" strokeWidth="1.5" />
          <circle cx="50" cy="50" r="30" fill="none" stroke="#FFFFFF" strokeWidth="1.5" />
        </svg>

        <div className="relative z-10">
          <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md text-white text-[10px] font-bold tracking-wider uppercase rounded-full px-2.5 py-0.5 mb-2.5 shadow-xs">
            <Sparkles className="size-3" />
            Nuevo
          </span>
          <h3 className="text-base sm:text-[17px] font-bold text-white mb-1.5 leading-tight">
            Asistente de Reportes
          </h3>
          <p className="text-xs text-white/90 leading-relaxed">
            Detecta riesgos de desabasto y cuellos de botella en producción antes de que te afecten.
          </p>
        </div>

        <div className="relative z-10 flex flex-col gap-2 mt-4">
          <motion.button
            type="button"
            onClick={onOpenAsistente}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full h-9 rounded-full bg-white text-[#8C491A] font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm hover:bg-[#FFFBF0] transition-colors cursor-pointer"
          >
            <span>Ver Insumos en Riesgo</span>
            <ArrowRight className="size-3.5" />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
