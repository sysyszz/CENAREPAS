import { LineChart, Line, XAxis, ResponsiveContainer } from 'recharts';
import { motion, useReducedMotion } from 'framer-motion';
import { Shield, ScrollText, Database, Lock, MapPin } from 'lucide-react';

const STAT_TILES = (data) => [
  { label: 'Disponibilidad', value: data.disponibilidad },
  { label: 'Usuarios Activos', value: data.usuariosActivos },
  { label: 'Último Respaldo', value: data.ultimoRespaldo },
  { label: 'Accesos Denegados', value: data.accesosDenegados, highlight: true },
];

const FEATURE_TILES = [
  { Icon: Shield, title: 'Roles y Permisos', desc: 'Control de acceso por rol y módulo' },
  { Icon: ScrollText, title: 'Auditoría', desc: 'Registro de cambios por usuario' },
  { Icon: Database, title: 'Respaldo de Datos', desc: 'Copias automáticas diarias' },
  { Icon: Lock, title: 'Restricciones por Rol', desc: 'Límites de edición y borrado' },
  { Icon: MapPin, title: 'Accesos por Sede', desc: 'Bello Oriente y Aranjuez' },
];

export function ControlMonitoreoSection({ data }) {
  const shouldReduceMotion = useReducedMotion();
  if (!data) return null;
  const comparativa = data.produccionComparativa || [];
  const riesgoIndex = comparativa.findIndex((d) => d.riesgo);
  const riesgoLeftPct = riesgoIndex >= 0 ? (riesgoIndex / (comparativa.length - 1)) * 100 : null;

  return (
    <div
      className="-mx-6 mt-10 pt-16"
      style={{ background: 'linear-gradient(180deg,#fffbf0 0%,#5c3a20 30%,#1c120a 62%,#1c120a 100%)' }}
    >
      <div className="mx-auto max-w-[1440px] px-6 pb-14 sm:px-10">
        <p className="mb-7 -ml-0.5 font-['Oswald',sans-serif] text-[clamp(2rem,3.4vw,3rem)] font-bold uppercase tracking-[0.01em] text-[#fbd28a]">
          Control y Monitoreo
        </p>

        <div className="mb-7 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {STAT_TILES(data).map((tile) => (
            <div key={tile.label}>
              <p className="mb-1 text-[0.75rem] text-[#c9a97e]">{tile.label}</p>
              <p
                className="font-mono text-[1.5rem] font-bold"
                style={{ color: tile.highlight ? '#fde8b8' : '#fffbf0' }}
              >
                {tile.value}
              </p>
            </div>
          ))}
        </div>

        <div
          className="relative mb-7 rounded-2xl border border-white/[0.08] p-6"
          style={{
            background: 'rgba(255,255,255,0.04)',
            backgroundImage: 'radial-gradient(circle at 62% 18%, rgba(232,178,61,0.16), transparent 60%)',
          }}
        >
          <p className="mb-3.5 text-[0.85rem] font-medium text-[#fffbf0]">Producción — Esta semana vs. anterior</p>

          <div className="relative">
            <div className="h-[190px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={comparativa} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                  <XAxis dataKey="dia" hide />
                  <Line
                    type="monotone"
                    dataKey="semanaAnterior"
                    name="Semana anterior"
                    stroke="rgba(255,255,255,0.3)"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={false}
                    isAnimationActive={!shouldReduceMotion}
                    animationDuration={1200}
                  />
                  <Line
                    type="monotone"
                    dataKey="semanaActual"
                    name="Esta semana"
                    stroke="#e8b23d"
                    strokeWidth={2.5}
                    dot={false}
                    activeDot={{ r: 4.5, fill: '#e8b23d', stroke: '#1c120a', strokeWidth: 2 }}
                    isAnimationActive={!shouldReduceMotion}
                    animationDuration={1400}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {riesgoLeftPct != null && (
              <div
                className="absolute top-[4%] min-w-[190px] -translate-x-1/2 rounded-xl bg-[#fffbf0] px-3.5 py-2.5 text-[#3d2a17] shadow-[0_12px_24px_rgba(0,0,0,0.35)]"
                style={{ left: `${riesgoLeftPct}%` }}
              >
                <p className="mb-0.5 text-[0.7rem] font-semibold uppercase tracking-[0.04em] text-[#a8471f]">
                  En riesgo · Bello Oriente
                </p>
                <p className="font-mono text-[0.85rem] font-semibold">+8% sobrecosto proyectado</p>
              </div>
            )}

            <div className="mt-1.5 flex gap-[18px]">
              <span className="flex items-center gap-1.5 text-[0.75rem] text-[#c9a97e]">
                <span className="h-2 w-2 rounded-full bg-[#e8b23d]" />
                Esta semana
              </span>
              <span className="flex items-center gap-1.5 text-[0.75rem] text-[#c9a97e]">
                <span className="h-2 w-2 rounded-full bg-white/40" />
                Semana anterior
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-5">
          {FEATURE_TILES.map(({ Icon, title, desc }) => (
            <motion.div
              key={title}
              className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-[18px]"
              whileHover={shouldReduceMotion ? undefined : { y: -3, backgroundColor: 'rgba(255,255,255,0.07)' }}
              whileTap={shouldReduceMotion ? undefined : { y: -1 }}
              transition={{ type: 'spring', stiffness: 360, damping: 28 }}
            >
              <Icon className="mb-2.5 h-[18px] w-[18px] text-[#e8b23d]" />
              <p className="mb-1 text-[0.85rem] font-semibold text-[#fffbf0]">{title}</p>
              <p className="text-[0.75rem] leading-snug text-[#a8916f]">{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
