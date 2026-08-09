import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Search, Sun, Moon, User, Settings, LogOut } from 'lucide-react';
import { useTheme } from '../../../shared/contexts/ThemeContext';

export default function Header({ onLogout }) {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="bg-card border-b border-border px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4 flex-1 max-w-2xl">
        <Search className="w-5 h-5 text-muted-foreground" />
        <input
          type="search"
          placeholder="Buscar..."
          className="flex-1 px-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={toggleTheme}
          className="p-2 hover:bg-muted rounded-lg transition-colors"
          title={theme === 'dark' ? 'Modo Claro' : 'Modo Oscuro'}
        >
          {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
        <button className="relative p-2 hover:bg-muted rounded-lg transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full"></span>
        </button>
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-3 p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <span className="text-primary-foreground">AD</span>
            </div>
            <div className="text-left">
              <p className="text-sm">Admin User</p>
              <p className="text-xs text-muted-foreground">admin@sistema.com</p>
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
                    setShowUserMenu(false);
                  }}
                  className="flex items-center gap-3 w-full px-4 py-3 hover:bg-muted text-left"
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