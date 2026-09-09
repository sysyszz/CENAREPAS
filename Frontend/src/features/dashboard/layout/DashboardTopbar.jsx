import { useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { Menu, Search, Bell, Settings, Plus } from 'lucide-react';

export function DashboardTopbar({ onMenuClick, userName = 'Admin User', userEmail = 'admin@sistema.com' }) {
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();

  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-3 border-b border-[#e8dcc0] bg-[#fffbf0]/90 px-4 backdrop-blur sm:px-6 shadow-xs">
      <div className="flex min-w-0 items-center gap-3">
        <button
          onClick={onMenuClick}
          className="-ml-1 shrink-0 rounded-lg p-2 text-slate-700 transition-colors hover:bg-black/5 lg:hidden cursor-pointer"
          aria-label="Abrir menú"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#C1502D] text-sm font-bold text-white shadow-xs">
          AD
        </div>
        <div className="hidden min-w-0 sm:block">
          <p className="truncate text-sm font-bold text-slate-900">{userName}</p>
          <p className="truncate text-xs text-slate-500">{userEmail}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <motion.button
          type="button"
          onClick={() => navigate('/admin/pedidos')}
          whileHover={shouldReduceMotion ? undefined : { y: -1, backgroundColor: '#8a3418', scale: 1.02 }}
          whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 400, damping: 28 }}
          className="flex items-center gap-1.5 rounded-full bg-[#C1502D] px-4 py-2 text-xs sm:text-sm font-bold text-white shadow-md shadow-[#C1502D]/25 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Nuevo Pedido</span>
        </motion.button>

        <button className="hidden rounded-lg p-2 text-slate-600 transition-colors hover:bg-black/5 sm:block cursor-pointer" aria-label="Buscar">
          <Search className="h-[18px] w-[18px]" />
        </button>
        <button className="relative rounded-lg p-2 text-slate-600 transition-colors hover:bg-black/5 cursor-pointer" aria-label="Notificaciones">
          <Bell className="h-[18px] w-[18px]" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[#E8B23D] ring-2 ring-white" />
        </button>
        <button
          onClick={() => navigate('/admin/configuracion')}
          className="hidden rounded-lg p-2 text-slate-600 transition-colors hover:bg-black/5 sm:block cursor-pointer"
          aria-label="Ajustes"
        >
          <Settings className="h-[18px] w-[18px]" />
        </button>
      </div>
    </header>
  );
}
