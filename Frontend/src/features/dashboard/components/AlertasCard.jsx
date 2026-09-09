import { Package, Clock, TrendingDown, UserX, AlertTriangle, ShieldAlert, PackageX } from 'lucide-react';

const ICONS = {
  'package': Package,
  'alert-triangle': Package,
  'clock': Clock,
  'package-x': Clock,
  'trending-down': TrendingDown,
  'user-x': UserX,
  'shield-alert': UserX,
};

const TONES = {
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

export function AlertasCard({ alertas = [] }) {
  return (
    <div className="rounded-3xl border border-border dark:border-[rgba(148,163,184,0.14)] bg-card dark:bg-[#111820] p-4.5 sm:p-7 shadow-[0_2px_10px_rgba(46,43,37,0.06)] dark:shadow-none">
      <h4 className="text-base font-bold text-slate-900 dark:text-foreground leading-tight">Alertas y Disparadores del Sistema</h4>
      <p className="text-xs text-slate-500 dark:text-muted-foreground mt-0.5 mb-4">Eventos operativos que requieren atención</p>
      <div className="flex flex-col gap-2.5">
        {alertas.map((alerta) => {
          const Icon = ICONS[alerta.icono] ?? Package;
          const tone = TONES[alerta.tono] ?? TONES.terracota;
          return (
            <div
              key={alerta.id}
              className={`flex items-center gap-3.5 rounded-2xl p-3 sm:px-4 border transition-transform duration-200 hover:scale-[1.008] ${tone.lightBg} ${tone.darkBg}`}
            >
              <div className={`size-8 rounded-xl flex items-center justify-center shrink-0 ${tone.iconBg} ${tone.iconColor}`}>
                <Icon className="size-4.5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs sm:text-[13px] font-bold text-slate-900 dark:text-slate-100 m-0">{alerta.titulo}</p>
                <p className="truncate text-[11.5px] font-medium text-slate-600 dark:text-slate-300 m-0 mt-0.5">{alerta.detalle}</p>
              </div>
              <button
                type="button"
                className="shrink-0 whitespace-nowrap rounded-full bg-white dark:bg-[#1A232F] px-3.5 py-1.5 text-xs font-bold text-slate-800 dark:text-slate-100 border border-slate-200/80 dark:border-[rgba(148,163,184,0.22)] shadow-xs transition-colors hover:bg-slate-100 dark:hover:bg-[#233040] cursor-pointer"
              >
                {alerta.accion}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
