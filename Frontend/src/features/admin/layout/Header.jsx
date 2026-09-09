import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Sun, Moon, User, Settings, LogOut, Menu } from 'lucide-react';
import { useTheme } from '../../../shared/contexts/ThemeContext';
import { NotificationCenter } from '../components/NotificationCenter';

export default function Header({ onLogout, onMenuClick }) {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="bg-card border-b border-border px-3.5 py-2.5 sm:px-6 sm:py-3.5 flex items-center justify-between gap-2 sm:gap-4">
      <button
        onClick={onMenuClick}
        className="p-1.5 sm:p-2 -ml-1 sm:-ml-2 hover:bg-muted rounded-lg transition-colors lg:hidden shrink-0 cursor-pointer text-foreground"
        aria-label="Abrir menú"
      >
        <Menu className="w-5 h-5" />
      </button>
      <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0 sm:max-w-2xl">
        <Search className="w-4 sm:w-5 h-4 sm:h-5 text-muted-foreground shrink-0 hidden sm:block" />
        <input
          type="search"
          placeholder="Buscar..."
          className="w-full min-w-0 px-3 py-1.5 sm:px-4 sm:py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-xs sm:text-sm"
        />
      </div>
      <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
        <button
          onClick={toggleTheme}
          className="p-1.5 sm:p-2 hover:bg-muted rounded-xl transition-colors cursor-pointer text-foreground"
          title={theme === 'dark' ? 'Modo Claro' : 'Modo Oscuro'}
        >
          {theme === 'dark' ? <Sun className="w-4.5 sm:w-5 h-4.5 sm:h-5 text-[#E8B23D]" /> : <Moon className="w-4.5 sm:w-5 h-4.5 sm:h-5 text-muted-foreground" />}
        </button>

        {/* Centro de Notificaciones */}
        <NotificationCenter />
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 sm:gap-3 p-1 sm:p-2 hover:bg-muted rounded-lg transition-colors cursor-pointer"
          >
            <div className="size-8 sm:size-10 bg-primary rounded-full flex items-center justify-center shrink-0">
              <span className="text-primary-foreground text-xs sm:text-sm font-semibold">AD</span>
            </div>
            <div className="text-left hidden md:block">
              <p className="text-xs sm:text-sm font-semibold text-foreground leading-tight">Admin User</p>
              <p className="text-[11px] text-muted-foreground">admin@sistema.com</p>
            </div>
          </button>

          {showUserMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowUserMenu(false)}
              ></div>
              <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg z-20 overflow-hidden">
                <button
                  onClick={() => {
                    navigate('/admin/profile');
                    setShowUserMenu(false);
                  }}
                  className="flex items-center gap-3 w-full px-4 py-3 hover:bg-muted text-left"
                >
                  <User className="w-4 h-4" />
                  Mi Perfil
                </button>
                <button
                  onClick={() => {
                    navigate('/admin/configuracion');
                    setShowUserMenu(false);
                  }}
                  className="flex items-center gap-3 w-full px-4 py-3 hover:bg-muted text-left cursor-pointer"
                >
                  <Settings className="w-4 h-4" />
                  Configuración
                </button>
                <div className="border-t border-border"></div>
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    onLogout();
                  }}
                  className="flex items-center gap-3 w-full px-4 py-3 hover:bg-muted text-destructive text-left"
                >
                  <LogOut className="w-4 h-4" />
                  Cerrar Sesión
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}