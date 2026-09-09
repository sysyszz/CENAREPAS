import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { ClipboardList, Check } from 'lucide-react';

const ESTADO_STYLES = {
  retrasado: { bg: 'rgba(193,80,45,0.16)', text: '#e2895f', label: 'Retrasado' },
  completado: { bg: 'rgba(90,122,58,0.18)', text: '#8fa870', label: 'Completado' },
};

export function ActivePedidoPanel({ pedido }) {
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();
  const [completado, setCompletado] = useState(false);

  if (!pedido) return null;
  const estadoKey = completado ? 'completado' : pedido.estado;
  const estilo = ESTADO_STYLES[estadoKey] ?? ESTADO_STYLES.retrasado;

  return (
    <div className="rounded-2xl border border-t-[3px] border-white/[0.08] border-t-[#c1502d] bg-[#241610] p-6 shadow-[0_24px_48px_-24px_rgba(0,0,0,0.5)] sm:p-7">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/[0.06]">
            <ClipboardList className="h-5 w-5 text-[#e8b23d]" />
          </div>
          <div>
            <p className="text-sm font-semibold text-[#fffbf0]">
              Pedido {pedido.id} · {pedido.cliente}
            </p>
            <p className="text-xs text-[#a8916f]">{pedido.sede}</p>
          </div>
        </div>
        <span
          className="rounded-full px-3 py-1 text-xs font-semibold"
          style={{ backgroundColor: estilo.bg, color: estilo.text }}
        >
          {estilo.label}
        </span>
      </div>

      <p className="mb-6 font-mono text-5xl font-bold tabular-nums text-[#fffbf0] sm:text-6xl">
        {pedido.unidades.toLocaleString('es-CO')}
        <span className="ml-2 text-lg font-medium text-[#a8916f]">un.</span>
      </p>

      <div className="flex flex-wrap gap-3">
        <motion.button
          type="button"
          onClick={() => navigate('/admin/pedidos')}
          whileHover={shouldReduceMotion ? undefined : { y: -2 }}
          whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 400, damping: 28 }}
          className="rounded-full bg-[#c1502d] px-5 py-2.5 text-sm font-semibold text-[#fffbf0] shadow-[0_8px_20px_-8px_rgba(193,80,45,0.6)]"
        >
          Ver Detalle
        </motion.button>
        <motion.button
          type="button"
          onClick={() => setCompletado(true)}
          disabled={completado}
          whileHover={shouldReduceMotion || completado ? undefined : { y: -2 }}
          whileTap={shouldReduceMotion || completado ? undefined : { scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 400, damping: 28 }}
          className="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.06] px-5 py-2.5 text-sm font-medium text-[#e8dcc8] disabled:opacity-60"
        >
          {completado && <Check className="h-4 w-4" />}
          {completado ? 'Marcado como Completado' : 'Marcar Completado'}
        </motion.button>
      </div>
    </div>
  );
}
