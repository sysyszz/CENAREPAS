import { motion, useReducedMotion } from 'framer-motion';
import { Sparkles, Check, MessageCircle, ArrowUp } from 'lucide-react';

const ESTADO_STYLES = {
  critico: { bg: 'rgba(193,80,45,0.12)', text: '#8a3418', dot: '#c1502d', label: 'Crítico' },
  atencion: { bg: 'rgba(232,178,61,0.18)', text: '#8a6a1a', dot: null, label: 'Atención' },
  optimo: { bg: 'rgba(90,122,58,0.12)', text: '#5a7a3a', dot: null, label: 'Óptimo' },
};

const CHECKLIST = [
  'Analizando rotación de inventario en Insumos (últimos 30 días)',
  'Cruzando datos de Producción contra Pedidos pendientes',
  'Identificando cuellos de botella en el flujo de pedidos',
];

export function AsistenteReportesPanel({ rotacion = [] }) {
  const shouldReduceMotion = useReducedMotion();
  const critico = rotacion.find((r) => r.estado === 'critico');

  return (
    <motion.div
      className="relative overflow-hidden rounded-[1.5rem] border border-[#e8dcc0] bg-white p-6 sm:p-8"
      whileHover={shouldReduceMotion ? undefined : { y: -4, boxShadow: '0 20px 32px -18px rgba(61,42,23,0.22)' }}
      whileTap={shouldReduceMotion ? undefined : { y: -1 }}
      transition={{ type: 'spring', stiffness: 360, damping: 28 }}
    >
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 800 400"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path d="M-20,80 C150,40 250,140 420,90 C560,50 650,150 820,100" fill="none" stroke="#e8b23d" strokeWidth="1" opacity="0.14" />
        <path d="M-20,220 C150,180 260,280 420,230 C560,190 650,290 820,240" fill="none" stroke="#c1502d" strokeWidth="1" opacity="0.1" />
        <path d="M-20,340 C150,300 260,370 420,330 C560,300 650,370 820,340" fill="none" stroke="#e8b23d" strokeWidth="1" opacity="0.1" />
      </svg>

      <div className="relative">
        <div className="mb-1.5 flex items-center gap-2.5">
          <div className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[#c1502d]">
            <Sparkles className="h-[15px] w-[15px] text-[#fffbf0]" />
          </div>
          <p className="text-[1.05rem] font-semibold text-[#2a1206]">Asistente de Reportes CENAREPAS</p>
        </div>
        <p className="mb-5 ml-10 text-[0.8rem] text-[#78633f]">
          Analizando rotación de inventario y cuellos de botella en pedidos
        </p>

        <div className="mb-[18px] ml-10 flex flex-col gap-2">
          {CHECKLIST.map((item) => (
            <div key={item} className="flex items-start gap-2">
              <Check className="mt-0.5 h-[14px] w-[14px] shrink-0 text-[#5a7a3a]" />
              <span className="text-[0.85rem] text-[#6b5636]">{item}</span>
            </div>
          ))}
        </div>

        {critico && (
          <p className="mb-[22px] ml-10 max-w-[70ch] text-[0.92rem] leading-relaxed text-[#3d2a17]">
            <strong className="text-[#8a3418]">
              La {critico.insumo.toLowerCase()} tiene una rotación de {critico.rotacionDias} días
            </strong>
            , muy por debajo del promedio de 9 días — es el insumo con mayor riesgo de desabasto esta semana.
          </p>
        )}

        <div className="mb-6 ml-10 overflow-hidden overflow-x-auto rounded-2xl border border-[#e8dcc0]">
          <table className="w-full min-w-[480px] border-collapse text-[0.85rem]">
            <thead>
              <tr className="bg-[#f5ecd8]">
                <th className="px-4 py-2.5 text-left text-[0.75rem] font-semibold uppercase tracking-[0.04em] text-[#6b5636]">Insumo</th>
                <th className="px-4 py-2.5 text-right text-[0.75rem] font-semibold uppercase tracking-[0.04em] text-[#6b5636]">Rotación</th>
                <th className="px-4 py-2.5 text-right text-[0.75rem] font-semibold uppercase tracking-[0.04em] text-[#6b5636]">Stock</th>
                <th className="px-4 py-2.5 text-left text-[0.75rem] font-semibold uppercase tracking-[0.04em] text-[#6b5636]">Estado</th>
              </tr>
            </thead>
            <tbody>
              {rotacion.map((r) => {
                const estilo = ESTADO_STYLES[r.estado] ?? ESTADO_STYLES.optimo;
                return (
                  <tr key={r.insumo} className="border-t border-[#e8dcc0]">
                    <td className="px-4 py-[11px] text-[#2a1206]">{r.insumo}</td>
                    <td className="px-4 py-[11px] text-right font-mono text-[#2a1206]">{r.rotacionDias} días</td>
                    <td className="px-4 py-[11px] text-right font-mono text-[#2a1206]">{r.stock}</td>
                    <td className="px-4 py-[11px]">
                      <span
                        className="inline-flex items-center gap-1.5 rounded-full py-[3px] text-[0.75rem] font-semibold"
                        style={{ backgroundColor: estilo.bg, color: estilo.text, paddingLeft: estilo.dot ? '8px' : '10px', paddingRight: '10px' }}
                      >
                        {estilo.dot && <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: estilo.dot }} />}
                        {estilo.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="ml-10 flex items-center gap-2.5 rounded-xl border border-[#e8dcc0] bg-[#fffbf0] py-2.5 pl-4 pr-2.5">
          <MessageCircle className="h-4 w-4 shrink-0 text-[#78633f]" />
          <input
            type="text"
            placeholder="Pregúntale al asistente sobre tus insumos o producción..."
            className="flex-1 border-none bg-transparent text-[0.87rem] text-[#3d2a17] outline-none placeholder:text-[#78633f]"
          />
          <button
            type="button"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#c1502d] text-[#fffbf0] transition-colors hover:bg-[#8a3418] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c1502d]"
            aria-label="Enviar pregunta al asistente"
          >
            <ArrowUp className="h-[15px] w-[15px]" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
