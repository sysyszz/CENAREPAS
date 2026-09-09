import { useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const GOLDEN_ANGLE = 137.50776;

function makeCluster(cx, cy, count, seed) {
  const list = [];
  for (let i = 0; i < count; i++) {
    const angle = ((i * GOLDEN_ANGLE + seed) * Math.PI) / 180;
    const r = 6.4 * Math.sqrt(i + 1);
    const ex = cx + Math.cos(angle) * r;
    const ey = cy + Math.sin(angle) * r * 0.6;
    const hash = Math.abs(Math.sin(i * 12.9898 + seed * 0.7233));
    const dist = 70 + hash * 90;
    const angle2 = hash * Math.PI * 2 + i * 0.7;
    list.push({
      id: `${cx}-${i}`,
      ex,
      ey,
      rx: 3.6 + hash * 1.4,
      ry: 2.6 + hash,
      dx: Math.cos(angle2) * dist,
      dy: Math.sin(angle2) * dist - 30,
      delay: i * 0.016,
    });
  }
  return list;
}

export function PedidosFlowHeader({ belloOriente = 0, aranjuez = 0 }) {
  const shouldReduceMotion = useReducedMotion();
  const kernelsA = useMemo(() => makeCluster(210, 108, 22, 0), []);
  const kernelsB = useMemo(() => makeCluster(690, 108, 22, 300), []);

  const kernelInitial = (k) =>
    shouldReduceMotion
      ? { opacity: 0 }
      : { opacity: 0, x: k.dx, y: k.dy, scale: 0.3 };
  const kernelAnimate = { opacity: 1, x: 0, y: 0, scale: 1 };
  const kernelTransition = (k) => ({
    x: { duration: shouldReduceMotion ? 0 : 1.6, delay: k.delay, ease: [0.16, 1, 0.3, 1] },
    y: { duration: shouldReduceMotion ? 0 : 1.6, delay: k.delay, ease: [0.16, 1, 0.3, 1] },
    scale: { duration: shouldReduceMotion ? 0 : 1.6, delay: k.delay, ease: [0.16, 1, 0.3, 1] },
    opacity: { duration: shouldReduceMotion ? 0.3 : 1, delay: k.delay },
  });

  return (
    <div className="relative rounded-3xl border border-[#e8dcc0] bg-white px-6 pb-3 pt-6 sm:px-8">
      <div className="mb-0.5 flex flex-wrap items-baseline justify-between gap-2">
        <span className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-[#6b5636]">
          Flujo de Pedidos en Tiempo Real
        </span>
        <span className="text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-[#78633f]">
          Bello Oriente ↔ Aranjuez
        </span>
      </div>

      <svg viewBox="0 0 900 220" width="100%" height="220" preserveAspectRatio="xMidYMid meet" role="img" aria-label={`Flujo de pedidos: ${belloOriente} activos en Bello Oriente, ${aranjuez} activos en Aranjuez`}>
        <defs>
          <radialGradient id="kernelGrad" cx="35%" cy="30%" r="75%">
            <stop offset="0%" stopColor="#fbd28a" />
            <stop offset="55%" stopColor="#e8b23d" />
            <stop offset="100%" stopColor="#a8471f" />
          </radialGradient>
        </defs>

        {!shouldReduceMotion &&
          [210, 690].map((cx) => (
            <motion.circle
              key={cx}
              cx={cx}
              cy={108}
              r={18}
              fill="none"
              stroke="#e8b23d"
              strokeWidth={1}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.35, 0], scale: [0.9, 1.7, 1.7] }}
              transition={{ duration: 2.6, repeat: Infinity, ease: 'easeOut', delay: 2.6, repeatDelay: 0.4 }}
              style={{ transformOrigin: `${cx}px 108px` }}
            />
          ))}

        <motion.path
          d="M232,108 Q450,44 668,108"
          fill="none"
          stroke="#e8b23d"
          strokeWidth="1.5"
          strokeLinecap="round"
          initial={shouldReduceMotion ? { opacity: 0 } : { pathLength: 0 }}
          animate={shouldReduceMotion ? { opacity: 1 } : { pathLength: 1 }}
          transition={{ duration: shouldReduceMotion ? 0.3 : 0.7, delay: shouldReduceMotion ? 0 : 0.9, ease: [0.22, 1, 0.36, 1] }}
        />

        {kernelsA.map((k) => (
          <motion.ellipse
            key={k.id}
            cx={k.ex}
            cy={k.ey}
            rx={k.rx}
            ry={k.ry}
            fill="url(#kernelGrad)"
            initial={kernelInitial(k)}
            animate={kernelAnimate}
            transition={kernelTransition(k)}
          />
        ))}
        {kernelsB.map((k) => (
          <motion.ellipse
            key={k.id}
            cx={k.ex}
            cy={k.ey}
            rx={k.rx}
            ry={k.ry}
            fill="url(#kernelGrad)"
            initial={kernelInitial(k)}
            animate={kernelAnimate}
            transition={kernelTransition(k)}
          />
        ))}

        <text x="210" y="182" textAnchor="middle" fontFamily="Oswald, sans-serif" fontSize="14" fontWeight="600" fill="#8a3418" letterSpacing="1.2">
          BELLO ORIENTE
        </text>
        <text x="210" y="200" textAnchor="middle" fontFamily="Poppins, sans-serif" fontSize="11" fill="#78633f">
          {belloOriente} pedidos activos
        </text>
        <text x="690" y="182" textAnchor="middle" fontFamily="Oswald, sans-serif" fontSize="14" fontWeight="600" fill="#8a3418" letterSpacing="1.2">
          ARANJUEZ
        </text>
        <text x="690" y="200" textAnchor="middle" fontFamily="Poppins, sans-serif" fontSize="11" fill="#78633f">
          {aranjuez} pedidos activos
        </text>
      </svg>
    </div>
  );
}
