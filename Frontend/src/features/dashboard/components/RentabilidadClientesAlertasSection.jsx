import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  Package, 
  Clock, 
  TrendingDown, 
  UserX, 
  AlertTriangle, 
  ShieldAlert, 
  BarChart3, 
  AlertCircle 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const RENTA_WEEKS = ['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8'];
const RENTA_VALS = [28.1, 29.4, 28.9, 30.2, 31.0, 30.5, 31.8, 32.4];

const ALERT_STYLES = {
  terracota: {
    lightBg: 'bg-[#FFF5F0] border-[#FCD9C6]',
    darkBg: 'dark:bg-[#C1502D]/12 dark:border-[#C1502D]/25',
    iconBg: 'bg-[#FFE1D0] dark:bg-[#C1502D]/25',
    iconColor: 'text-[#C1502D] dark:text-[#FF8A65]',
  },
  maiz: {
    lightBg: 'bg-[#FEFAF0] border-[#FDE8B8]',
    darkBg: 'dark:bg-[#E8B23D]/12 dark:border-[#E8B23D]/25',
    iconBg: 'bg-[#FDE8B8] dark:bg-[#E8B23D]/25',
    iconColor: 'text-[#B45309] dark:text-[#FCD34D]',
  },
  beige: {
    lightBg: 'bg-[#FFF7F2] border-[#FED7AA]',
    darkBg: 'dark:bg-[#E2895F]/12 dark:border-[#E2895F]/25',
    iconBg: 'bg-[#FFEDD5] dark:bg-[#E2895F]/25',
    iconColor: 'text-[#C2410C] dark:text-[#FDBA74]',
  },
  verde: {
    lightBg: 'bg-[#F4F8EE] border-[#D6E6C3]',
    darkBg: 'dark:bg-[#5A7A3A]/15 dark:border-[#5A7A3A]/25',
    iconBg: 'bg-[#E1EECC] dark:bg-[#5A7A3A]/25',
    iconColor: 'text-[#5A7A3A] dark:text-[#AEC094]',
  },
};

function getAlertMeta(a, index) {
  const tone = a.tono || (
    a.id === 1 ? 'terracota' :
    a.id === 2 ? 'maiz' :
    a.id === 3 ? 'beige' :
    a.id === 4 ? 'verde' :
    ['terracota', 'maiz', 'beige', 'verde'][index % 4]
  );

  let IconComp = Package;
  if (typeof a.icono === 'function') {
    IconComp = a.icono;
  } else if (typeof a.icono === 'string') {
    const k = a.icono.toLowerCase();
    if (k.includes('insumo') || k.includes('package') || k.includes('triangle') || k.includes('box')) {
      IconComp = Package;
    } else if (k.includes('prod') || k.includes('pedid') || k.includes('clock') || k.includes('retras') || k.includes('time')) {
      IconComp = Clock;
    } else if (k.includes('vent') || k.includes('trend') || k.includes('chart') || k.includes('caida') || k.includes('down')) {
      IconComp = TrendingDown;
    } else if (k.includes('user') || k.includes('rol') || k.includes('shield') || k.includes('person')) {
      IconComp = UserX;
    }
  } else {
    const t = (a.titulo || '').toLowerCase();
    if (t.includes('insumo') || t.includes('stock') || t.includes('harina')) {
      IconComp = Package;
    } else if (t.includes('pedido') || t.includes('producci') || t.includes('retras')) {
      IconComp = Clock;
    } else if (t.includes('vent') || t.includes('caíd') || t.includes('caid')) {
      IconComp = TrendingDown;
    } else if (t.includes('usuario') || t.includes('rol')) {
      IconComp = UserX;
    }
  }

  const path = a.path || (
    a.id === 1 ? '/admin/insumos' :
    a.id === 2 ? '/admin/pedidos' :
    a.id === 3 ? '/admin/ventas' :
    a.id === 4 ? '/admin/usuarios' :
    '/admin'
  );

  return { tone, IconComp, path };
}

export function RentabilidadClientesAlertasSection({ topClientesData, alertasData }) {
  const navigate = useNavigate();
  const [hoverSpark, setHoverSpark] = useState(null);

  const defaultClientes = [
    { id: 1, iniciales: 'PE', nombre: 'Panadería La Espiga', pedidos: 132, bg: '#C1502D', fg: '#FFFFFF' },
    { id: 2, iniciales: 'ET', nombre: 'Supermercado El Trigal', pedidos: 118, bg: '#E8B23D', fg: '#78350F' },
    { id: 3, iniciales: 'SA', nombre: 'Restaurante Sabor Antioqueño', pedidos: 96, bg: '#5A7A3A', fg: '#FFFFFF' },
    { id: 4, iniciales: 'DR', nombre: 'Tienda Doña Rosa', pedidos: 84, bg: '#E2895F', fg: '#402310' },
    { id: 5, iniciales: 'CC', nombre: 'Cafetería Central', pedidos: 71, bg: '#F5ECD8', fg: '#2E2B25' },
  ];

  const defaultAlertas = [
    { id: 1, icono: 'package', titulo: 'Stock bajo de harina de maíz', detalle: 'Por debajo del mínimo en Bello Oriente', accion: 'Ver Insumos', path: '/admin/insumos', tono: 'terracota' },
    { id: 2, icono: 'clock', titulo: 'Pedido #4821 retrasado', detalle: 'Producción sin iniciar, vence hoy', accion: 'Ver Pedido', path: '/admin/pedidos', tono: 'maiz' },
    { id: 3, icono: 'trending-down', titulo: 'Caída en ventas — Aranjuez', detalle: '-9% frente a la semana anterior', accion: 'Ver Ventas', path: '/admin/ventas', tono: 'beige' },
    { id: 4, icono: 'user-x', titulo: 'Usuario sin rol asignado', detalle: 'jvargas@cenarepas.com', accion: 'Asignar Rol', path: '/admin/usuarios', tono: 'verde' },
  ];

  const topClientes = topClientesData || defaultClientes;
  const alertas = alertasData || defaultAlertas;

  // Curva de Rentabilidad
  const rentaMax = Math.max(...RENTA_VALS) + 0.6;
  const rentaMin = Math.min(...RENTA_VALS) - 0.6;
  const rentaRange = rentaMax - rentaMin;
  const rentaPts = RENTA_VALS.map((v, i) => ({
    x: (i / (RENTA_VALS.length - 1)) * 100,
    y: 100 - ((v - rentaMin) / rentaRange) * 82 - 8,
    v,
    w: RENTA_WEEKS[i],
  }));

  const rentaLine = rentaPts.map((pt, i) => `${i === 0 ? 'M' : 'L'}${pt.x.toFixed(1)},${pt.y.toFixed(1)}`).join(' ');
  const rentaFill = `${rentaLine} L100,100 L0,100 Z`;
  const rentaHoverPoint = hoverSpark != null ? rentaPts[hoverSpark] : null;

  return (
    <div className="space-y-7">
      
      {/* ─── Grid 2 Columnas: Rentabilidad & Top Clientes ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4.5 items-stretch">
        
        {/* Card 1: Rentabilidad */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.38, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ y: -3, transition: { duration: 0.2 } }}
          className="bg-card dark:bg-[#111820] rounded-3xl p-4.5 sm:p-6 shadow-[0_2px_10px_rgba(46,43,37,0.06)] dark:shadow-none border border-border dark:border-[rgba(148,163,184,0.14)] flex flex-col justify-between h-full"
        >
          <div>
            <div className="flex items-start justify-between mb-1">
              <div>
                <h4 className="text-[15px] font-bold text-slate-900 dark:text-foreground leading-tight">Rentabilidad</h4>
                <p className="text-xs text-slate-500 dark:text-muted-foreground mt-0.5">Margen bruto · últimas 8 semanas</p>
              </div>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#E1EECC] dark:bg-[#5A7A3A]/25 text-[#3D472B] dark:text-[#AEC094]">
                <TrendingUp className="size-3" />
                +2.3pp
              </span>
            </div>

            <div className="font-mono text-3xl sm:text-[34px] font-bold text-slate-900 dark:text-foreground tracking-tight my-2 tabular-nums">
              32.4%
            </div>
          </div>

          {/* Area Chart SVG con Tooltip Interactivo */}
          <div className="relative h-24 mt-auto pt-2">
            <svg width="100%" height="96" viewBox="0 0 100 100" preserveAspectRatio="none" className="block overflow-visible">
              <defs>
                <linearGradient id="rentaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#728157" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#728157" stopOpacity="0.02" />
                </linearGradient>
              </defs>
              <path d={rentaFill} fill="url(#rentaGrad)" />
              <path d={rentaLine} fill="none" stroke="#5A7A3A" strokeWidth="2.2" vectorEffect="non-scaling-stroke" strokeLinecap="round" />

              {/* Point hover */}
              {rentaHoverPoint && (
                <circle 
                  cx={rentaHoverPoint.x} 
                  cy={rentaHoverPoint.y} 
                  r="3.5" 
                  fill="#3D472B" 
                  stroke="#FFFFFF" 
                  strokeWidth="2" 
                />
              )}
            </svg>

            {/* Hover trigger invisible columns */}
            <div className="absolute inset-0 flex">
              {RENTA_WEEKS.map((w, i) => (
                <div
                  key={w}
                  className="flex-1 h-full cursor-pointer"
                  onMouseEnter={() => setHoverSpark(i)}
                  onMouseLeave={() => setHoverSpark(null)}
                />
              ))}
            </div>

            {/* Floating Tooltip */}
            <AnimatePresence>
              {rentaHoverPoint && (
                <motion.div
                  initial={{ opacity: 0, y: 4, scale: 0.95 }}
                  animate={{ opacity: 1, y: -4, scale: 1 }}
                  exit={{ opacity: 0, y: 2, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  style={{ left: `${rentaHoverPoint.x}%` }}
                  className="absolute -top-3 -translate-x-1/2 -translate-y-full bg-slate-900 text-white text-[11px] font-bold px-2.5 py-1 rounded-xl whitespace-nowrap shadow-lg pointer-events-none z-20"
                >
                  {rentaHoverPoint.w} · {rentaHoverPoint.v}%
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Card 2: Top Clientes */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.42, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ y: -3, transition: { duration: 0.2 } }}
          className="bg-card dark:bg-[#111820] rounded-3xl p-4.5 sm:p-6 shadow-[0_2px_10px_rgba(46,43,37,0.06)] dark:shadow-none border border-border dark:border-[rgba(148,163,184,0.14)] flex flex-col justify-between h-full"
        >
          <div>
            <h4 className="text-[15px] font-bold text-slate-900 dark:text-foreground leading-tight">Top Clientes</h4>
            <p className="text-xs text-slate-500 dark:text-muted-foreground mt-0.5 mb-4">Por volumen de pedidos este mes</p>
          </div>

          <div className="flex flex-col gap-3">
            {topClientes.map((c) => (
              <div 
                key={c.id} 
                className="flex items-center gap-3 p-1.5 rounded-2xl hover:bg-[#FFFBF0] dark:hover:bg-[#16202A] transition-colors cursor-pointer"
                onClick={() => navigate('/admin/clientes')}
              >
                <div 
                  className="size-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 shadow-2xs"
                  style={{ backgroundColor: c.bg || '#C1502D', color: c.fg || '#FFFFFF' }}
                >
                  {c.iniciales}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-[13px] font-bold text-slate-900 dark:text-foreground truncate m-0">
                    {c.nombre}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-muted-foreground m-0">
                    {c.pedidos} pedidos
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

      </div>

      {/* ─── Bloque Completo: Alertas y Disparadores del Sistema ─── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.46, ease: [0.22, 1, 0.36, 1] }}
        className="bg-card dark:bg-[#111820] rounded-3xl p-4.5 sm:p-7 shadow-[0_2px_10px_rgba(46,43,37,0.06)] dark:shadow-none border border-border dark:border-[rgba(148,163,184,0.14)]"
      >
        <h4 className="text-base font-bold text-slate-900 dark:text-foreground leading-tight">
          Alertas y Disparadores del Sistema
        </h4>
        <p className="text-xs text-slate-500 dark:text-muted-foreground mt-0.5 mb-4">
          Eventos operativos que requieren atención
        </p>

        <div className="flex flex-col gap-2.5">
          {alertas.map((a, idx) => {
            const { tone, IconComp, path } = getAlertMeta(a, idx);
            const st = ALERT_STYLES[tone] || ALERT_STYLES.terracota;

            return (
              <div
                key={a.id || idx}
                className={`flex items-center gap-3.5 rounded-2xl p-3 sm:px-4 transition-transform duration-200 hover:scale-[1.008] border ${st.lightBg} ${st.darkBg}`}
              >
                {/* Ícono de Alerta Semántico */}
                <div className={`size-8 rounded-xl flex items-center justify-center shrink-0 ${st.iconBg} ${st.iconColor}`}>
                  <IconComp className="size-4.5" />
                </div>

                {/* Textos con Alto Contraste */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-[13px] font-bold text-slate-900 dark:text-slate-100 truncate m-0">
                    {a.titulo}
                  </p>
                  <p className="text-[11.5px] text-slate-600 dark:text-slate-300 font-medium truncate m-0 mt-0.5">
                    {a.detalle}
                  </p>
                </div>

                {/* Botón Pill Legible con Alto Contraste en Claro y Oscuro */}
                <motion.button
                  type="button"
                  onClick={() => path && navigate(path)}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className="bg-white dark:bg-[#1A232F] text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-[#233040] text-xs font-bold px-3.5 py-1.5 rounded-full shadow-xs border border-slate-200/80 dark:border-[rgba(148,163,184,0.22)] shrink-0 whitespace-nowrap transition-colors cursor-pointer"
                >
                  {a.accion}
                </motion.button>
              </div>
            );
          })}
        </div>
      </motion.div>

    </div>
  );
}
