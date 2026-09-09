import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { motion, useReducedMotion } from 'framer-motion';
import { Wheat, Package, TrendingUp, TrendingDown } from 'lucide-react';

const ICONS = { wheat: Wheat, package: Package };

export function FeaturedInsumoCard({ nombre, icono, rotacionDias, deltaPct, deltaAbs, tendencia = [] }) {
  const shouldReduceMotion = useReducedMotion();
  const Icon = ICONS[icono] ?? Package;
  const positive = deltaPct >= 0;
  const TrendIcon = positive ? TrendingUp : TrendingDown;
  const accent = positive ? '#8fa870' : '#e2895f';
  const data = tendencia.map((v, i) => ({ i, v }));

  return (
    <motion.div
      className="rounded-2xl border border-white/[0.08] bg-[#241610] p-5"
      whileHover={shouldReduceMotion ? undefined : { y: -4, backgroundColor: '#2c1b13' }}
      whileTap={shouldReduceMotion ? undefined : { y: -1 }}
      transition={{ type: 'spring', stiffness: 360, damping: 28 }}
    >
      <div className="mb-4 flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.06]">
          <Icon className="h-[18px] w-[18px] text-[#e8b23d]" />
        </div>
        <p className="text-sm font-medium text-[#e8dcc8]">{nombre}</p>
      </div>

      <div className="mb-3 flex items-baseline justify-between">
        <p className="font-mono text-2xl font-bold text-[#fffbf0]">
          {rotacionDias}
          <span className="ml-1 text-sm font-medium text-[#a8916f]">días</span>
        </p>
        <span
          className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold"
          style={{ color: accent, backgroundColor: `${accent}1f` }}
        >
          <TrendIcon className="h-3 w-3" />
          {positive ? '+' : ''}
          {deltaPct.toFixed(1)}%
        </span>
      </div>

      <div className="relative h-14 w-full">
        <span
          className="absolute -top-1 right-0 z-10 rounded-md bg-white/[0.08] px-1.5 py-0.5 font-mono text-[0.65rem] font-semibold"
          style={{ color: accent }}
        >
          {deltaAbs}
        </span>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 12, right: 0, left: 0, bottom: 0 }}>
            <Line
              type="monotone"
              dataKey="v"
              stroke={accent}
              strokeWidth={2}
              dot={false}
              isAnimationActive={!shouldReduceMotion}
              animationDuration={1200}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
