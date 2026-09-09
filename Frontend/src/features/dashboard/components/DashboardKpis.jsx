import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, ClipboardList, Package, Factory, TrendingUp, TrendingDown } from 'lucide-react';

const fmtCO = (n) => Math.round(n).toLocaleString('es-CO');
const clamp01 = (v) => Math.max(0, Math.min(1, v));
const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

function buildSparkPaths(vals) {
  const w = 72, h = 26, pad = 2;
  const max = Math.max(...vals), min = Math.min(...vals);
  const range = max - min || 1;
  const pts = vals.map((v, i) => {
    const x = (i / (vals.length - 1)) * w;
    const y = h - pad - ((v - min) / range) * (h - pad * 2);
    return [x, y];
  });
  const line = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');
  const fill = `${line} L${w},${h} L0,${h} Z`;
  return { line, fill };
}

const KPI_SPARKS = {
  ventas: [14, 16, 15, 18, 17, 20, 22, 24],
  pedidos: [10, 12, 11, 15, 14, 17, 19, 21],
  insumos: [22, 20, 21, 18, 19, 16, 15, 14],
  produccion: [12, 13, 15, 14, 17, 19, 20, 23],
};

export function DashboardKpis({ kpisData }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const duration = 1200;
    const start = performance.now();
    let rafId;

    const tick = (now) => {
      const t = clamp01((now - start) / duration);
      setProgress(easeOutCubic(t));
      if (t < 1) {
        rafId = requestAnimationFrame(tick);
      }
    };

    const timer = setTimeout(() => {
      rafId = requestAnimationFrame(tick);
    }, 150);

    return () => {
      clearTimeout(timer);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [kpisData]);

  const rawKpis = kpisData || {
    ventasHoy: 2450000,
    ventasHoyCambio: 12.5,
    pedidosProcesados: 84,
    pedidosCambio: 8.0,
    insumosActivos: 37,
    insumosCambio: -3.0,
    produccionDia: 1240,
    produccionCambio: 5.0,
  };

  const cards = [
    {
      id: 'ventas',
      label: 'Ventas Hoy',
      icon: DollarSign,
      target: rawKpis.ventasHoy,
      trend: rawKpis.ventasHoyCambio,
      chipBg: '#FDE8B8',
      chipColor: '#78350F',
      fmt: (v) => `$${fmtCO(v)}`,
      sparks: KPI_SPARKS.ventas,
    },
    {
      id: 'pedidos',
      label: 'Pedidos Procesados',
      icon: ClipboardList,
      target: rawKpis.pedidosProcesados,
      trend: rawKpis.pedidosCambio,
      chipBg: '#FFE1D0',
      chipColor: '#8C491A',
      fmt: (v) => fmtCO(v),
      sparks: KPI_SPARKS.pedidos,
    },
    {
      id: 'insumos',
      label: 'Insumos Activos',
      icon: Package,
      target: rawKpis.insumosActivos,
      trend: rawKpis.insumosCambio,
      chipBg: '#FFC6A5',
      chipColor: '#643312',
      fmt: (v) => fmtCO(v),
      sparks: KPI_SPARKS.insumos,
    },
    {
      id: 'produccion',
      label: 'Producción del Día',
      icon: Factory,
      target: rawKpis.produccionDia,
      trend: rawKpis.produccionCambio,
      chipBg: '#E1EECC',
      chipColor: '#3D472B',
      fmt: (v) => `${fmtCO(v)} un.`,
      sparks: KPI_SPARKS.produccion,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4.5 mb-7">
      {cards.map((kpi, idx) => {
        const animatedVal = kpi.target * progress;
        const spark = buildSparkPaths(kpi.sparks);
        const isPositive = kpi.trend >= 0;
        const IconComponent = kpi.icon;

        return (
          <motion.div
            key={kpi.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: idx * 0.08, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="bg-card dark:bg-[#111820] rounded-3xl p-4.5 sm:p-5.5 shadow-[0_2px_10px_rgba(46,43,37,0.06)] dark:shadow-none border border-border dark:border-[rgba(148,163,184,0.14)] hover:shadow-md transition-shadow duration-300 flex flex-col justify-between"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-3.5">
              <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">{kpi.label}</span>
              <div 
                className="size-9 rounded-full flex items-center justify-center transition-transform hover:scale-110"
                style={{ backgroundColor: kpi.chipBg }}
              >
                <IconComponent className="size-4.5" style={{ color: kpi.chipColor }} />
              </div>
            </div>

            {/* Main Value con count-up */}
            <div className="font-mono text-[28px] sm:text-[30px] font-bold text-slate-900 dark:text-foreground tracking-tight mb-2.5 tabular-nums">
              {kpi.fmt(animatedVal)}
            </div>

            {/* Trend & Sparkline */}
            <div className="flex items-center justify-between pt-1">
              <span 
                className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                  isPositive 
                    ? 'bg-[#E1EECC] dark:bg-[#5A7A3A]/25 text-[#3D472B] dark:text-[#AEC094]' 
                    : 'bg-[#FFE1D0] dark:bg-[#C1502D]/25 text-[#8C491A] dark:text-[#E2895F]'
                }`}
              >
                {isPositive ? (
                  <TrendingUp className="size-3" />
                ) : (
                  <TrendingDown className="size-3" />
                )}
                {isPositive ? `+${kpi.trend.toFixed(1)}%` : `${kpi.trend.toFixed(1)}%`}
              </span>

              {/* Sparkline SVG */}
              <svg width="72" height="26" viewBox="0 0 72 26" className="overflow-visible">
                <path 
                  d={spark.fill} 
                  fill={isPositive ? 'rgba(114, 129, 87, 0.2)' : 'rgba(193, 80, 45, 0.18)'} 
                />
                <path 
                  d={spark.line} 
                  fill="none" 
                  stroke={isPositive ? '#728157' : '#C1502D'} 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                />
              </svg>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
