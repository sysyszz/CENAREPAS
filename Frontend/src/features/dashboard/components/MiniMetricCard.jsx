import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Maximize2, TrendingUp, TrendingDown } from 'lucide-react';

export function MiniMetricCard({ label, valor, deltaPct, periodo, negativoEsMalo = false, detalle }) {
  const shouldReduceMotion = useReducedMotion();
  const [expanded, setExpanded] = useState(false);
  const isGood = negativoEsMalo ? deltaPct < 0 : deltaPct >= 0;
  const TrendIcon = deltaPct >= 0 ? TrendingUp : TrendingDown;
  const accent = isGood ? '#8fa870' : '#e2895f';

  return (
    <motion.div
      className="rounded-2xl border border-white/[0.08] bg-[#241610] p-4"
      whileHover={shouldReduceMotion ? undefined : { y: -3, backgroundColor: '#2c1b13' }}
      transition={{ type: 'spring', stiffness: 360, damping: 28 }}
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase leading-tight tracking-wide text-[#a8916f]">{label}</p>
        <motion.button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          whileTap={shouldReduceMotion ? undefined : { scale: 0.9 }}
          className="shrink-0 rounded-md p-1 text-[#a8916f] transition-colors hover:bg-white/[0.08] hover:text-[#fffbf0] cursor-pointer"
          aria-label={expanded ? 'Contraer detalle' : 'Expandir detalle'}
          aria-expanded={expanded}
        >
          <Maximize2 className="h-3.5 w-3.5" />
        </motion.button>
      </div>

      <p className="mb-1.5 font-mono text-xl font-bold text-[#fffbf0]">{valor}</p>

      <div className="flex items-center gap-2">
        <span
          className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[0.7rem] font-semibold"
          style={{ color: accent, backgroundColor: `${accent}1f` }}
        >
          <TrendIcon className="h-3 w-3" />
          {deltaPct >= 0 ? '+' : ''}
          {deltaPct.toFixed(1)}%
        </span>
        <span className="text-[0.7rem] text-[#a8916f]">{periodo}</span>
      </div>

      <AnimatePresence initial={false}>
        {expanded && detalle && (
          <motion.p
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: 'auto', marginTop: 10 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.25 }}
            className="overflow-hidden text-xs leading-relaxed text-[#c9a97e]"
          >
            {detalle}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
