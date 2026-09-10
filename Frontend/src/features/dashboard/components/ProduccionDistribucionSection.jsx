import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function hash(i, seed) {
  const x = Math.sin(i * 12.9898 + seed * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

function genDots(seed, weights) {
  const dots = [];
  for (let i = 0; i < 36; i++) {
    const h = hash(i, seed);
    let color = weights[weights.length - 1].color;
    let acc = 0;
    for (const w of weights) {
      acc += w.p;
      if (h <= acc) { color = w.color; break; }
    }
    dots.push({ id: i, color });
  }
  return dots;
}

export function ProduccionDistribucionSection({ lineasData, pedidosFlow }) {
  const [hoveredBar, setHoveredBar] = useState(null);

  const defaultLineas = [
    { linea: 'Blanca', unidades: 620, destacada: false },
    { linea: 'Amarilla', unidades: 980, destacada: true },
    { linea: 'Integral', unidades: 410, destacada: false },
    { linea: 'Queso', unidades: 710, destacada: false },
  ];

  const lineas = lineasData || defaultLineas;
  const maxLineUnidades = Math.max(...lineas.map((l) => l.unidades)) + 150;

  const dotsA = genDots(11, [
    { p: 0.42, color: '#D67F48' },
    { p: 0.3, color: '#E8B23D' },
    { p: 0.16, color: '#728157' },
    { p: 0.12, color: '#DCD3C4' }
  ]);

  const dotsB = genDots(47, [
    { p: 0.4, color: '#728157' },
    { p: 0.24, color: '#D67F48' },
    { p: 0.22, color: '#E8B23D' },
    { p: 0.14, color: '#DCD3C4' }
  ]);

  const flow = pedidosFlow || { belloOriente: 48, aranjuez: 36 };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-4.5 mb-7 items-stretch">
      
      {/* ─── Card 1: Producción por Línea ─── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.24, ease: [0.22, 1, 0.36, 1] }}
        whileHover={{ y: -3, transition: { duration: 0.2 } }}
        className="bg-card dark:bg-[#111820] rounded-3xl p-4.5 sm:p-6 shadow-[0_2px_10px_rgba(46,43,37,0.06)] dark:shadow-none border border-border dark:border-[rgba(148,163,184,0.14)] flex flex-col justify-between h-full"
      >
        <div>
          <h4 className="text-[15px] font-bold text-slate-900 dark:text-foreground leading-tight mb-1">
            Producción por Línea
          </h4>
          <p className="text-xs text-slate-500 dark:text-muted-foreground mb-6">
            Unidades elaboradas esta semana
          </p>
        </div>

        {/* Bar Chart Container */}
        <div className="flex items-end justify-between gap-4 h-48 px-3 mt-auto">
          {lineas.map((l, idx) => {
            const heightPct = Math.round((l.unidades / maxLineUnidades) * 100);
            const isHovered = hoveredBar === idx;
            const isHot = l.destacada || isHovered;

            return (
              <div
                key={l.linea}
                className="flex-1 flex flex-col items-center justify-end h-full relative cursor-pointer"
                onMouseEnter={() => setHoveredBar(idx)}
                onMouseLeave={() => setHoveredBar(null)}
              >
                {/* Floating Tooltip */}
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      initial={{ opacity: 0, y: 4, scale: 0.95 }}
                      animate={{ opacity: 1, y: -6, scale: 1 }}
                      exit={{ opacity: 0, y: 2, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute bottom-full mb-2 bg-slate-900 text-white text-xs font-bold px-2.5 py-1.5 rounded-xl whitespace-nowrap shadow-lg z-20 pointer-events-none"
                    >
                      {l.linea}: {l.unidades.toLocaleString('es-CO')} un.
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Animated Growing Bar */}
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${heightPct}%` }}
                  transition={{ duration: 0.9, delay: idx * 0.12, ease: [0.22, 1, 0.36, 1] }}
                  className={`w-full max-w-[54px] rounded-t-2xl transition-all duration-300 ${
                    isHot
                      ? 'bg-gradient-to-t from-[#8C491A] to-[#F6A06B] shadow-md shadow-[#C1502D]/35'
                      : 'bg-gradient-to-t from-[#C0B6A5] to-[#EEE7DB] dark:from-[#1E293B] dark:to-[#334155]'
                  }`}
                />

                {/* Line Name */}
                <span 
                  className={`mt-2.5 text-xs transition-colors ${
                    l.destacada ? 'font-bold text-[#C1502D] dark:text-[#E8B23D]' : 'font-medium text-slate-600 dark:text-muted-foreground'
                  }`}
                >
                  {l.linea}
                </span>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* ─── Card 2: Distribución de Pedidos (Dots Matrix) ─── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.32, ease: [0.22, 1, 0.36, 1] }}
        whileHover={{ y: -3, transition: { duration: 0.2 } }}
        className="bg-card dark:bg-[#111820] rounded-3xl p-4.5 sm:p-6 shadow-[0_2px_10px_rgba(46,43,37,0.06)] dark:shadow-none border border-border dark:border-[rgba(148,163,184,0.14)] flex flex-col justify-between h-full"
      >
        <div>
          <h4 className="text-[15px] font-bold text-slate-900 dark:text-foreground leading-tight mb-1">
            Distribución de Pedidos
          </h4>
          <p className="text-xs text-slate-500 dark:text-muted-foreground mb-5">
            Concentración de pedidos activos por sede
          </p>
        </div>

        {/* 2 Sede Matrix Columns */}
        <div className="flex items-center gap-7 flex-wrap pt-1">
          
          {/* Sede Bello Oriente */}
          <div className="flex-1 min-w-[130px]">
            <div className="grid grid-cols-6 gap-1.5 mb-3">
              {dotsA.map((d, i) => (
                <motion.span
                  key={d.id}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3, delay: i * 0.01 + 0.2 }}
                  className="aspect-square rounded-full block shadow-2xs"
                  style={{ backgroundColor: d.color }}
                />
              ))}
            </div>
            <p className="text-[13.5px] font-bold text-slate-900 dark:text-foreground leading-tight">Bello Oriente</p>
            <p className="text-xs text-slate-500 dark:text-muted-foreground">{flow.belloOriente} pedidos activos</p>
          </div>

          {/* Sede Aranjuez */}
          <div className="flex-1 min-w-[130px]">
            <div className="grid grid-cols-6 gap-1.5 mb-3">
              {dotsB.map((d, i) => (
                <motion.span
                  key={d.id}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3, delay: i * 0.01 + 0.3 }}
                  className="aspect-square rounded-full block shadow-2xs"
                  style={{ backgroundColor: d.color }}
                />
              ))}
            </div>
            <p className="text-[13.5px] font-bold text-slate-900 dark:text-foreground leading-tight">Aranjuez</p>
            <p className="text-xs text-slate-500 dark:text-muted-foreground">{flow.aranjuez} pedidos activos</p>
          </div>

        </div>
      </motion.div>

    </div>
  );
}
