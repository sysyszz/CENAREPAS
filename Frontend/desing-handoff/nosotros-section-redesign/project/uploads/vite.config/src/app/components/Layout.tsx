import { ReactNode, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Shield,
  Truck,
  ShoppingCart,
  FolderTree,
  BookOpen,
  Package,
  Factory,
  Box,
  UserCircle,
  ClipboardList,
  DollarSign,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  Moon,
  Sun,
  User,
  Settings
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface LayoutProps {
  children: ReactNode;
  onLogout: () => void;
}

export default function Layout({ children, onLogout }: LayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const menuItems = [
    { path: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/usuarios', icon: Users, label: 'Usuarios' },
    { path: '/admin/roles', icon: Shield, label: 'Roles' },
    { path: '/admin/proveedores', icon: Truck, label: 'Proveedores' },
    { path: '/admin/compras', icon: ShoppingCart, label: 'Compras' },
    { path: '/admin/categorias', icon: FolderTree, label: 'Categorías' },
    { path: '/admin/fichas-tecnicas', icon: BookOpen, label: 'Fichas Técnicas' },
    { path: '/admin/insumos', icon: Package, label: 'Insumos' },
    { path: '/admin/produccion', icon: Factory, label: 'Producción' },
    { path: '/admin/productos', icon: Box, label: 'Productos' },
    { path: '/admin/clientes', icon: UserCircle, label: 'Clientes' },
    { path: '/admin/pedidos', icon: ClipboardList, label: 'Pedidos' },
    { path: '/admin/ventas', icon: DollarSign, label: 'Ventas' },
  ];

  return (
    <div className="flex h-screen bg-background">
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-sidebar text-sidebar-foreground transition-all duration-300 flex flex-col`}
      >
        <div className="p-4 flex items-center justify-between border-b border-sidebar-border">
          {sidebarOpen && <h2 className="text-lg">Admin System</h2>}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-sidebar-accent rounded-lg"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                    : 'hover:bg-sidebar-accent text-sidebar-foreground'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-sidebar-border">
          <button
            onClick={onLogout}
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-sidebar-accent w-full text-left transition-colors"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span>Cerrar Sesión</span>}
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
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

        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
