import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  CheckCheck,
  AlertTriangle,
  PackageX,
  CheckCircle2,
  ShoppingCart,
  Sparkles,
  ChevronRight,
  Inbox,
  X
} from 'lucide-react';

const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif-1',
    tipo: 'alerta_stock',
    titulo: 'Stock crítico de insumo',
    descripcion: 'Harina de Maíz Amarillo por debajo del umbral mínimo en Sede Bello Oriente (180 kg restantes).',
    tiempo: 'hace 5 min',
    leida: false,
    path: '/admin/insumos',
    icono: AlertTriangle,
    bgIcono: '#FFE1D0',
    colorIcono: '#C1502D',
  },
  {
    id: 'notif-2',
    tipo: 'pedido_retrasado',
    titulo: 'Pedido #4821 con retraso',
    descripcion: 'Panadería La Espiga espera 3.200 unidades. Producción pendiente por iniciar.',
    tiempo: 'hace 25 min',
    leida: false,
    path: '/admin/pedidos',
    icono: PackageX,
    bgIcono: '#FDE8B8',
    colorIcono: '#78350F',
  },
  {
    id: 'notif-3',
    tipo: 'produccion_completada',
    titulo: 'Lote #204 finalizado',
    descripcion: 'Producción de 1.000 paquetes de arepas amarillas completada con 99.2% de calidad.',
    tiempo: 'hace 2 h',
    leida: false,
    path: '/admin/produccion',
    icono: CheckCircle2,
    bgIcono: '#E1EECC',
    colorIcono: '#3D472B',
  },
  {
    id: 'notif-4',
    tipo: 'asistente_ia',
    titulo: 'Alerta del Asistente de Reportes',
    descripcion: 'Se proyecta cuello de botella en línea de empaque para el turno de la tarde.',
    tiempo: 'hace 4 h',
    leida: true,
    path: '/admin',
    icono: Sparkles,
    bgIcono: '#F5ECD8',
    colorIcono: '#C1502D',
  },
  {
    id: 'notif-5',
    tipo: 'nuevo_pedido',
    titulo: 'Nuevo pedido recibido',
    descripcion: 'Restaurante Sabor Antioqueño generó pedido #4825 por 960 unidades.',
    tiempo: 'ayer',
    leida: true,
    path: '/admin/pedidos',
    icono: ShoppingCart,
    bgIcono: '#FFE1D0',
    colorIcono: '#8C491A',
  },
];

export function NotificationCenter() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState('todas'); // 'todas' | 'no_leidas'
  const [notificaciones, setNotificaciones] = useState(INITIAL_NOTIFICATIONS);
  const containerRef = useRef(null);

  const noLeidasCount = notificaciones.filter((n) => !n.leida).length;

  // Cerrar con Escape o click exterior
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const marcarComoLeida = (id, path) => {
    setNotificaciones((prev) =>
      prev.map((n) => (n.id === id ? { ...n, leida: true } : n))
    );
    if (path) {
      setIsOpen(false);
      navigate(path);
    }
  };

  const marcarTodasComoLeidas = () => {
    setNotificaciones((prev) => prev.map((n) => ({ ...n, leida: true })));
  };

  const listaFiltrada = notificaciones.filter((n) => {
    if (filter === 'no_leidas') return !n.leida;
    return true;
  });

  return (
    <div className="relative" ref={containerRef}>
      {/* Botón de la Campana */}
      <motion.button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative p-2.5 rounded-xl hover:bg-muted text-foreground transition-colors cursor-pointer flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary/20"
        aria-label="Abrir centro de notificaciones"
        aria-expanded={isOpen}
      >
        <Bell className="size-5" />
        
        {/* Badge Numérico con Pulso */}
        {noLeidasCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-1.5 right-1.5 min-w-[18px] h-[18px] px-1 bg-[#C1502D] text-white text-[10px] font-extrabold rounded-full flex items-center justify-center shadow-xs ring-2 ring-card tabular-nums"
          >
            {noLeidasCount}
          </motion.span>
        )}
      </motion.button>

      {/* Popover / Dropdown Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-0 mt-2.5 w-[360px] sm:w-[410px] max-w-[calc(100vw-2rem)] bg-card border border-border rounded-3xl shadow-2xl z-50 overflow-hidden flex flex-col"
          >
            {/* Cabecera del Panel */}
            <div className="p-4 sm:p-5 border-b border-border bg-card">
              <div className="flex items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-base text-foreground m-0">Notificaciones</h3>
                  {noLeidasCount > 0 && (
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#FFE1D0] text-[#8C491A] dark:bg-[#8C491A]/30 dark:text-[#E2895F]">
                      {noLeidasCount} nuevas
                    </span>
                  )}
                </div>

                {noLeidasCount > 0 && (
                  <button
                    type="button"
                    onClick={marcarTodasComoLeidas}
                    className="text-[11.5px] font-semibold text-[#C1502D] hover:text-[#8A3418] dark:text-[#E2895F] flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <CheckCheck className="size-3.5" />
                    <span>Marcar todas</span>
                  </button>
                )}
              </div>

              {/* Tabs de Filtro */}
              <div className="flex rounded-xl bg-muted p-1 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setFilter('todas')}
                  className={`flex-1 py-1.5 rounded-lg text-center transition-all cursor-pointer ${
                    filter === 'todas'
                      ? 'bg-card text-foreground shadow-xs font-bold'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Todas ({notificaciones.length})
                </button>
                <button
                  type="button"
                  onClick={() => setFilter('no_leidas')}
                  className={`flex-1 py-1.5 rounded-lg text-center transition-all cursor-pointer ${
                    filter === 'no_leidas'
                      ? 'bg-card text-foreground shadow-xs font-bold'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  No leídas ({noLeidasCount})
                </button>
              </div>
            </div>

            {/* Lista de Notificaciones */}
            <div className="max-h-[380px] overflow-y-auto divide-y divide-border/60">
              {listaFiltrada.length > 0 ? (
                listaFiltrada.map((item) => {
                  const IconComp = item.icono;
                  return (
                    <motion.div
                      key={item.id}
                      layout
                      onClick={() => marcarComoLeida(item.id, item.path)}
                      className={`p-4 flex items-start gap-3.5 transition-colors cursor-pointer group ${
                        item.leida
                          ? 'bg-card hover:bg-muted/60 opacity-80 hover:opacity-100'
                          : 'bg-[#FFFBF0]/90 dark:bg-[#382920]/40 hover:bg-[#FFFBF0] dark:hover:bg-[#382920]/70'
                      }`}
                    >
                      {/* Icono temático */}
                      <div
                        className="size-9 rounded-2xl flex items-center justify-center shrink-0 shadow-2xs transition-transform group-hover:scale-105"
                        style={{ backgroundColor: item.bgIcono }}
                      >
                        <IconComp className="size-4.5" style={{ color: item.colorIcono }} />
                      </div>

                      {/* Contenido */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-0.5">
                          <h4 className="text-xs sm:text-[13px] font-bold text-foreground truncate m-0">
                            {item.titulo}
                          </h4>
                          <span className="text-[10.5px] font-medium text-muted-foreground shrink-0">
                            {item.tiempo}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 m-0">
                          {item.descripcion}
                        </p>
                      </div>

                      {/* Indicador de No Leída / Flecha */}
                      <div className="flex items-center self-center shrink-0 pl-1">
                        {!item.leida ? (
                          <span className="size-2 rounded-full bg-[#C1502D] animate-pulse" />
                        ) : (
                          <ChevronRight className="size-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        )}
                      </div>
                    </motion.div>
                  );
                })
              ) : (
                /* Estado Vacío */
                <div className="p-8 text-center flex flex-col items-center justify-center">
                  <div className="size-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground mb-3">
                    <Inbox className="size-6" />
                  </div>
                  <p className="text-sm font-bold text-foreground mb-1">¡Estás al día!</p>
                  <p className="text-xs text-muted-foreground max-w-[220px]">
                    {filter === 'no_leidas'
                      ? 'No tienes notificaciones pendientes por leer.'
                      : 'No hay notificaciones registradas en este momento.'}
                  </p>
                </div>
              )}
            </div>

            {/* Footer con Acceso Rápido */}
            <div className="p-3 border-t border-border bg-muted/30 text-center">
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  navigate('/admin');
                }}
                className="text-xs font-bold text-[#C1502D] hover:text-[#8A3418] dark:text-[#E2895F] transition-colors cursor-pointer"
              >
                Ver Panel de Monitoreo General
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
