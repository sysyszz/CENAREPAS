import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ChevronDown, Calendar, RefreshCw } from 'lucide-react';
import { useDashboard } from '../hooks/useDashboard';
import { DashboardKpis } from '../components/DashboardKpis';
import { InsumosRotacionSection } from '../components/InsumosRotacionSection';
import { PedidoActivoFunnelSection } from '../components/PedidoActivoFunnelSection';
import { ProduccionDistribucionSection } from '../components/ProduccionDistribucionSection';
import { AsistenteReportesSection } from '../components/AsistenteReportesSection';
import { RentabilidadClientesAlertasSection } from '../components/RentabilidadClientesAlertasSection';
import { DashboardSkeleton } from '../../../shared/components/Skeleton';
import '../styles/dashboard.css';

const PERIODOS = ['Esta semana', 'Este mes', 'Últimos 30 días', 'Año actual'];

export default function DashboardPage() {
  const { data, loading } = useDashboard();
  const shouldReduceMotion = useReducedMotion();
  const [selectedPeriodo, setSelectedPeriodo] = useState('Esta semana');
  const [menuOpen, setMenuOpen] = useState(false);

  if (loading || !data) {
    return <DashboardSkeleton />;
  }

  const handleScrollToAsistente = () => {
    const el = document.getElementById('asistente-reportes-panel');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="dashboard-panel pb-8">
      
      {/* ─── Top Header del Dashboard ─── */}
      <div className="flex flex-wrap items-end justify-between gap-4 mb-7">
        <div>
          <span className="text-[11px] font-bold tracking-[0.14em] uppercase text-[#8C491A] dark:text-[#E8B23D] block mb-1">
            Panel General
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-foreground tracking-tight leading-tight m-0">
            Insumos, producción y pedidos en tiempo real
          </h1>
        </div>

        {/* Selector de Período con Microinteracciones */}
        <div className="relative">
          <motion.button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="h-10 px-4 rounded-full bg-card dark:bg-[#111820] border border-border dark:border-[rgba(148,163,184,0.14)] text-foreground text-xs sm:text-[13px] font-bold shadow-xs hover:border-[#C1502D]/40 dark:hover:border-[#E8B23D]/40 flex items-center gap-2 cursor-pointer transition-colors"
          >
            <Calendar className="size-3.5 text-[#C1502D] dark:text-[#E8B23D]" />
            <span>{selectedPeriodo}</span>
            <ChevronDown className={`size-3.5 text-muted-foreground transition-transform duration-200 ${menuOpen ? 'rotate-180' : 'rotate-0'}`} />
          </motion.button>

          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, y: 6, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 w-44 bg-card dark:bg-[#111820] border border-border dark:border-[rgba(148,163,184,0.14)] rounded-2xl shadow-xl p-1.5 z-30 flex flex-col gap-0.5"
              >
                {PERIODOS.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => {
                      setSelectedPeriodo(p);
                      setMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-xl transition-colors cursor-pointer ${
                      selectedPeriodo === p
                        ? 'bg-[#FFE1D0] dark:bg-[#1E293B] text-[#8C491A] dark:text-[#E8B23D] font-bold'
                        : 'text-foreground hover:bg-[#FFFBF0] dark:hover:bg-[#16202A]'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ─── 1. KPIs con Conteo Progresivo y Sparklines ─── */}
      <DashboardKpis kpisData={data.kpis} />

      {/* ─── 2. Insumos de Rotación + Asistente CTA Banner ─── */}
      <InsumosRotacionSection 
        insumosData={data.featuredInsumos} 
        onOpenAsistente={handleScrollToAsistente}
      />

      {/* ─── 3. Pedido Activo #4821 + Ciclo de Producción (Funnel) ─── */}
      <PedidoActivoFunnelSection pedidoData={data.pedidoActivo} />

      {/* ─── 4. Producción por Línea + Distribución de Pedidos (Dots Matrix) ─── */}
      <ProduccionDistribucionSection 
        lineasData={data.produccionLineas} 
        pedidosFlow={data.pedidosFlow}
      />

      {/* ─── 5. Asistente de Reportes CENAREPAS (Panel Extendido) ─── */}
      <div id="asistente-reportes-panel">
        <AsistenteReportesSection rotacionData={data.insumosRotacion} />
      </div>

      {/* ─── 6. Rentabilidad, Top Clientes y Alertas del Sistema ─── */}
      <RentabilidadClientesAlertasSection 
        topClientesData={data.topClientes}
        alertasData={data.alertas}
      />

    </div>
  );
}
