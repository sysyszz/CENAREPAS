import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Check, MessageCircle, ArrowUp, Send } from 'lucide-react';

const ESTADO_STYLES = {
  critico: { bg: '#FFE1D0', color: '#8C491A', label: 'Crítico' },
  atencion: { bg: '#FDE8B8', color: '#78350F', label: 'Atención' },
  optimo: { bg: '#E1EECC', color: '#3D472B', label: 'Óptimo' },
};

export function AsistenteReportesSection({ rotacionData, onSendMessage }) {
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState([]);

  const defaultRotacion = [
    { insumo: 'Harina de Maíz Amarillo', rotacionDias: 4.2, stock: '180 kg', estado: 'critico' },
    { insumo: 'Harina de Maíz Blanco', rotacionDias: 7.8, stock: '340 kg', estado: 'atencion' },
    { insumo: 'Sal Refinada', rotacionDias: 21.5, stock: '90 kg', estado: 'optimo' },
    { insumo: 'Empaques x100', rotacionDias: 12.1, stock: '2.400 un.', estado: 'optimo' },
  ];

  const rotacion = rotacionData || defaultRotacion;

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    setMessages((prev) => [...prev, inputValue]);
    setInputValue('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden bg-card dark:bg-[#111820] rounded-3xl p-4.5 sm:p-7 md:p-8 shadow-[0_2px_10px_rgba(46,43,37,0.06)] dark:shadow-none border border-border dark:border-[rgba(148,163,184,0.14)] mb-7"
    >
      {/* Ondas decorativas de fondo */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40 dark:opacity-20" viewBox="0 0 800 400" preserveAspectRatio="none">
        <path d="M-20,80 C150,40 250,140 420,90 C560,50 650,150 820,100" fill="none" stroke="#E8B23D" strokeWidth="1" opacity="0.25" />
        <path d="M-20,220 C150,180 260,280 420,230 C560,190 650,290 820,240" fill="none" stroke="#C1502D" strokeWidth="1" opacity="0.2" />
        <path d="M-20,340 C150,300 260,370 420,330 C560,300 650,370 820,340" fill="none" stroke="#5A7A3A" strokeWidth="1" opacity="0.15" />
      </svg>

      <div className="relative z-10">
        
        {/* Encabezado con Icono Chispas */}
        <div className="flex items-center gap-3 mb-1.5">
          <div className="size-9 rounded-full bg-[#C1502D] dark:bg-[#C1502D]/90 flex items-center justify-center text-white shadow-xs">
            <Sparkles className="size-4.5" />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-foreground">
            Asistente de Reportes CENAREPAS
          </h3>
        </div>
        <p className="text-xs sm:text-[13px] text-slate-500 dark:text-muted-foreground mb-5 ml-0 sm:ml-12">
          Análisis automatizado de rotación de inventario y cuellos de botella en pedidos
        </p>

        {/* 3 Bullets de diagnóstico */}
        <div className="ml-0 sm:ml-12 mb-5 flex flex-col gap-2">
          <div className="flex items-start gap-2.5">
            <div className="size-4 rounded-full bg-[#E1EECC] dark:bg-[#5A7A3A]/25 flex items-center justify-center text-[#3D472B] dark:text-[#AEC094] mt-0.5 shrink-0">
              <Check className="size-3" />
            </div>
            <span className="text-xs sm:text-[13px] text-slate-700 dark:text-slate-300">
              Analizando rotación de inventario en Insumos (últimos 30 días)
            </span>
          </div>
          <div className="flex items-start gap-2.5">
            <div className="size-4 rounded-full bg-[#E1EECC] dark:bg-[#5A7A3A]/25 flex items-center justify-center text-[#3D472B] dark:text-[#AEC094] mt-0.5 shrink-0">
              <Check className="size-3" />
            </div>
            <span className="text-xs sm:text-[13px] text-slate-700 dark:text-slate-300">
              Cruzando datos de Producción contra Pedidos pendientes
            </span>
          </div>
          <div className="flex items-start gap-2.5">
            <div className="size-4 rounded-full bg-[#E1EECC] dark:bg-[#5A7A3A]/25 flex items-center justify-center text-[#3D472B] dark:text-[#AEC094] mt-0.5 shrink-0">
              <Check className="size-3" />
            </div>
            <span className="text-xs sm:text-[13px] text-slate-700 dark:text-slate-300">
              Identificando cuellos de botella en el flujo de pedidos
            </span>
          </div>
        </div>

        {/* Hallazgo Clave en Recuadro Cálido */}
        <div className="ml-0 sm:ml-12 mb-6 p-4 rounded-2xl bg-[#FFFBF0] dark:bg-[#0B0F14] border border-[#E8DCC0]/80 dark:border-[rgba(148,163,184,0.18)]">
          <p className="text-xs sm:text-[13.5px] leading-relaxed text-slate-800 dark:text-slate-200 m-0">
            <strong className="font-bold text-[#C1502D] dark:text-[#E8B23D]">La harina de maíz amarillo tiene una rotación de 4.2 días</strong>, muy por debajo del promedio general de 9 días — es el insumo con mayor riesgo de desabasto esta semana.
          </p>
        </div>

        {/* Tabla de Rotación de Insumos */}
        <div className="ml-0 sm:ml-12 mb-6 overflow-x-auto rounded-2xl border border-[#E8DCC0]/80 dark:border-[rgba(148,163,184,0.14)]">
          <table className="w-full min-w-[480px] text-left border-collapse text-xs sm:text-[13px]">
            <thead>
              <tr className="bg-[#FFE1D0]/60 dark:bg-[#1E293B]/70 border-b border-[#E8DCC0] dark:border-[rgba(148,163,184,0.14)]">
                <th className="py-2.5 px-4 font-bold text-[#8C491A] dark:text-[#E8B23D] uppercase tracking-wider text-[11px]">Insumo</th>
                <th className="py-2.5 px-4 font-bold text-[#8C491A] dark:text-[#E8B23D] uppercase tracking-wider text-[11px] text-right">Rotación</th>
                <th className="py-2.5 px-4 font-bold text-[#8C491A] dark:text-[#E8B23D] uppercase tracking-wider text-[11px] text-right">Stock</th>
                <th className="py-2.5 px-4 font-bold text-[#8C491A] dark:text-[#E8B23D] uppercase tracking-wider text-[11px]">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8DCC0]/60 dark:divide-[rgba(148,163,184,0.1)] bg-card dark:bg-[#111820]">
              {rotacion.map((r) => {
                const estilo = ESTADO_STYLES[r.estado] || ESTADO_STYLES.optimo;
                return (
                  <tr key={r.insumo} className="hover:bg-[#FFFBF0]/60 dark:hover:bg-[#16202A] transition-colors">
                    <td className="py-2.5 px-4 font-medium text-slate-900 dark:text-foreground">{r.insumo}</td>
                    <td className="py-2.5 px-4 font-mono font-semibold text-slate-800 dark:text-foreground text-right">{r.rotacionDias} días</td>
                    <td className="py-2.5 px-4 font-mono text-slate-700 dark:text-slate-300 text-right">{r.stock}</td>
                    <td className="py-2.5 px-4">
                      <span 
                        className="inline-flex items-center text-[11px] font-bold px-2.5 py-0.5 rounded-full"
                        style={{ backgroundColor: estilo.bg, color: estilo.color }}
                      >
                        {estilo.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Input Interactivo del Asistente */}
        <form onSubmit={handleSend} className="ml-0 sm:ml-12 flex items-center gap-2 rounded-2xl border border-border dark:border-[rgba(148,163,184,0.18)] bg-[#FFFBF0] dark:bg-[#0E141B] p-1.5 pl-3.5 shadow-xs">
          <MessageCircle className="size-4 text-muted-foreground shrink-0" />
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Pregúntale al asistente sobre tus insumos o producción..."
            className="flex-1 bg-transparent border-none text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="size-8.5 rounded-xl bg-[#C1502D] text-white flex items-center justify-center shrink-0 shadow-xs hover:bg-[#8A3418] transition-colors cursor-pointer"
            aria-label="Enviar consulta"
          >
            <ArrowUp className="size-4 stroke-[2.5]" />
          </motion.button>
        </form>

      </div>
    </motion.div>
  );
}
