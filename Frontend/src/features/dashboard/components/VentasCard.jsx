import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { motion, useReducedMotion } from 'framer-motion';
import { CustomTooltip } from './CustomTooltip';

export function VentasCard({ dias = [], total = 0, rango = '' }) {
  const shouldReduceMotion = useReducedMotion();
  const promedio = dias.length ? dias.reduce((sum, d) => sum + d.ventas, 0) / dias.length : 0;

  return (
    <div>
      <p
        className="mb-4 -ml-0.5 font-['Oswald',sans-serif] text-[clamp(1.9rem,3vw,2.6rem)] font-bold uppercase tracking-[0.01em] text-[#8a3418]"
      >
        Ventas
      </p>
      <motion.div
        className="rounded-[1.5rem] border border-[#e8dcc0] border-t-[3px] border-t-[#c1502d] bg-white px-6 pb-5 pt-7 shadow-[0_24px_48px_-20px_rgba(61,42,23,0.22)] sm:px-7"
        whileHover={shouldReduceMotion ? undefined : { y: -4, boxShadow: '0 28px 52px -18px rgba(61,42,23,0.3)' }}
        whileTap={shouldReduceMotion ? undefined : { y: -1 }}
        transition={{ type: 'spring', stiffness: 360, damping: 28 }}
      >
        <div className="mb-0.5 flex items-baseline justify-between">
          <div>
            <p className="mb-1 text-[0.85rem] font-medium text-[#6b5636]">Ventas de la Semana</p>
            <p className="font-mono text-[2rem] font-bold text-[#2a1206]">
              ${Math.round(total).toLocaleString('es-CO')}
            </p>
          </div>
          <span className="text-xs font-medium text-[#78633f]">{rango}</span>
        </div>

        <div className="mt-4 h-[210px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={dias} margin={{ top: 8, right: 4, left: 4, bottom: 0 }}>
              <defs>
                <linearGradient id="ventasAreaFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#c1502d" stopOpacity={0.32} />
                  <stop offset="55%" stopColor="#c1502d" stopOpacity={0.1} />
                  <stop offset="100%" stopColor="#c1502d" stopOpacity={0} />
                </linearGradient>
              </defs>
              <ReferenceLine y={promedio} stroke="#3d2a17" strokeOpacity={0.14} strokeDasharray="4 4" />
              <XAxis
                dataKey="dia"
                stroke="#78633f"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tickMargin={10}
              />
              <YAxis hide domain={['dataMin - 300000', 'dataMax + 300000']} />
              <Tooltip
                content={<CustomTooltip valuePrefix="$" />}
                cursor={{ stroke: '#c1502d', strokeOpacity: 0.25, strokeWidth: 1.5 }}
              />
              <Area
                type="monotone"
                dataKey="ventas"
                name="Ventas"
                stroke="#c1502d"
                strokeWidth={2.5}
                fill="url(#ventasAreaFill)"
                dot={false}
                activeDot={{ r: 4.5, fill: '#c1502d', stroke: '#fffbf0', strokeWidth: 2 }}
                isAnimationActive={!shouldReduceMotion}
                animationDuration={1400}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
}
