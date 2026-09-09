import { motion, useReducedMotion } from 'framer-motion';

export function CycleSliderCard({ ciclo }) {
  const shouldReduceMotion = useReducedMotion();
  if (!ciclo) return null;
  const { etapas, etapaActualIndex } = ciclo;
  const progressPct = etapas.length > 1 ? (etapaActualIndex / (etapas.length - 1)) * 100 : 0;

  return (
    <div className="flex h-full flex-col justify-between rounded-2xl border border-white/[0.08] bg-[#241610] p-6">
      <div>
        <p className="text-sm font-medium text-[#fffbf0]">Ciclo de Producción</p>
        <p className="text-xs text-[#a8916f]">Etapa actual: {etapas[etapaActualIndex]}</p>
      </div>

      <div className="relative mt-8 px-1">
        <div className="absolute left-1 right-1 top-1.5 h-0.5 bg-white/10" />
        <motion.div
          className="absolute left-1 top-1.5 h-0.5 bg-[#c1502d]"
          initial={{ width: 0 }}
          animate={{ width: `calc(${progressPct}% - ${progressPct > 0 ? '2px' : '0px'})` }}
          transition={{ duration: shouldReduceMotion ? 0 : 1, ease: [0.22, 1, 0.36, 1], delay: shouldReduceMotion ? 0 : 0.3 }}
        />
        <div className="relative flex justify-between">
          {etapas.map((etapa, index) => {
            const done = index < etapaActualIndex;
            const current = index === etapaActualIndex;
            return (
              <div key={etapa} className="flex flex-col items-center gap-2" style={{ width: `${100 / etapas.length}%` }}>
                <span
                  className={`block h-3.5 w-3.5 rounded-full border-2 ${current ? 'shadow-[0_0_0_4px_rgba(193,80,45,0.25)]' : ''}`}
                  style={{
                    backgroundColor: done || current ? '#c1502d' : '#1c120a',
                    borderColor: done || current ? '#c1502d' : 'rgba(255,255,255,0.2)',
                  }}
                />
                <span
                  className={`text-center text-[0.7rem] leading-tight ${current ? 'font-semibold text-[#fffbf0]' : 'text-[#a8916f]'}`}
                >
                  {etapa}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
