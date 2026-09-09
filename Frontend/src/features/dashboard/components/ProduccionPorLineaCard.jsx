import { BarChart, Bar, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { motion, useReducedMotion } from 'framer-motion';
import { CustomTooltip } from './CustomTooltip';

function LineaTick({ x, y, payload, data }) {
  const item = data.find((d) => d.linea === payload.value);
  return (
    <text
      x={x}
      y={y + 14}
      textAnchor="middle"
      fontSize={11}
      fontFamily="Poppins, sans-serif"
      fontWeight={item?.destacada ? 600 : 400}
      fill={item?.destacada ? '#8a3418' : '#6b5636'}
    >
      {payload.value}
    </text>
  );
}

export function ProduccionPorLineaCard({ lineas = [] }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div>
      <p
        className="mb-4 -ml-0.5 font-['Oswald',sans-serif] text-[clamp(1.9rem,3vw,2.6rem)] font-bold uppercase tracking-[0.01em] text-[#8a3418]"
      >
        Producción
      </p>
      <motion.div
        className="rounded-[1.5rem] border border-[#e8dcc0] bg-white px-6 pb-4 pt-6 shadow-[0_1px_2px_rgba(61,42,23,0.04)]"
        whileHover={shouldReduceMotion ? undefined : { y: -4, boxShadow: '0 20px 32px -18px rgba(61,42,23,0.22)' }}
        whileTap={shouldReduceMotion ? undefined : { y: -1 }}
        transition={{ type: 'spring', stiffness: 360, damping: 28 }}
      >
        <p className="mb-1 text-[0.85rem] font-medium text-[#6b5636]">Producción por Línea</p>
        <p className="mb-3.5 text-[0.8rem] text-[#78633f]">Unidades esta semana</p>

        <div className="h-[220px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={lineas} margin={{ top: 8, right: 8, left: 8, bottom: 0 }} barSize={44}>
              <defs>
                <linearGradient id="barNeutral" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#fbf3e4" />
                  <stop offset="45%" stopColor="#f5ecd8" />
                  <stop offset="100%" stopColor="#ecdcc0" />
                </linearGradient>
                <linearGradient id="barHot" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#d9714f" />
                  <stop offset="45%" stopColor="#c1502d" />
                  <stop offset="100%" stopColor="#8a3418" />
                </linearGradient>
                <filter id="barGlow" x="-40%" y="-40%" width="180%" height="180%">
                  <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#c1502d" floodOpacity="0.35" />
                </filter>
              </defs>
              <XAxis
                dataKey="linea"
                tickLine={false}
                axisLine={false}
                interval={0}
                tick={(props) => <LineaTick {...props} data={lineas} />}
              />
              <YAxis hide domain={[0, 'dataMax + 150']} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#fffbf0', opacity: 0.6 }} />
              <Bar dataKey="unidades" name="Unidades" radius={[10, 10, 4, 4]} isAnimationActive={!shouldReduceMotion} animationDuration={1200}>
                {lineas.map((d) => (
                  <Cell
                    key={d.linea}
                    fill={d.destacada ? 'url(#barHot)' : 'url(#barNeutral)'}
                    stroke={d.destacada ? 'none' : '#e8dcc0'}
                    filter={d.destacada ? 'url(#barGlow)' : undefined}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
}
