import { Link, useLocation } from 'react-router-dom';
import logoIcon from '../../../assets/logo-icon.png';
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
} from 'lucide-react';
import { usePermissions } from '../../../shared/contexts/PermissionContext';

const menuGroups = [
  {
    category: 'Principal',
    items: [
      { path: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    ],
  },
  {
    category: 'Configuración',
    items: [
      { path: '/admin/roles', icon: Shield, label: 'Roles' },
      { path: '/admin/usuarios', icon: Users, label: 'Usuarios' },
    ],
  },
  {
    category: 'Inventario',
    items: [
      { path: '/admin/categorias', icon: FolderTree, label: 'Categorías' },
      { path: '/admin/productos', icon: Box, label: 'Productos' },
      { path: '/admin/insumos', icon: Package, label: 'Insumos' },
      { path: '/admin/fichas-tecnicas', icon: BookOpen, label: 'Fichas Técnicas' },
    ],
  },
  {
    category: 'Operaciones',
    items: [
      { path: '/admin/produccion', icon: Factory, label: 'Producción' },
      { path: '/admin/compras', icon: ShoppingCart, label: 'Compras' },
      { path: '/admin/pedidos', icon: ClipboardList, label: 'Pedidos' },
      { path: '/admin/ventas', icon: DollarSign, label: 'Ventas' },
    ],
  },
  {
    category: 'Terceros',
    items: [
      { path: '/admin/clientes', icon: UserCircle, label: 'Clientes' },
      { path: '/admin/proveedores', icon: Truck, label: 'Proveedores' },
    ],
  },
];

export default function Sidebar({ sidebarOpen, setSidebarOpen, onLogout }) {
  const location = useLocation();
  const { can } = usePermissions();

  return (
    <aside
      className={`${
        sidebarOpen ? 'w-64' : 'w-20'
      } bg-sidebar text-sidebar-foreground transition-all duration-300 flex flex-col h-screen sticky top-0`}
    >
      <div className="p-4 flex items-center justify-between border-b border-sidebar-border h-16 shrink-0">
        {sidebarOpen ? (
          <div className="flex items-center gap-2">
            <img src={logoIcon} alt="CENAREPAS" className="h-8 w-8 object-contain" />
            <h2 className="text-lg font-bold tracking-wide">CENAREPAS</h2>
          </div>
        ) : (
          <img src={logoIcon} alt="CENAREPAS" className="h-8 w-8 object-contain mx-auto" />
        )}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 hover:bg-sidebar-accent rounded-lg text-sidebar-foreground transition-colors"
          title={sidebarOpen ? 'Colapsar menú' : 'Expandir menú'}
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto custom-scrollbar scroll-smooth p-3 space-y-4">
        {menuGroups.map((group, groupIdx) => (
          <div key={group.category} className="space-y-1.5">
            {sidebarOpen ? (
              <h3 className="px-3 pt-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70 mb-1.5">
                {group.category}
              </h3>
            ) : (
              groupIdx > 0 && <div className="border-t border-sidebar-border/50 my-2" />
            )}

            {group.items.filter((item) => can(item.permission || (item.path === '/admin' ? 'dashboard' : item.path.split('/').pop()), 'ver')).map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  title={!sidebarOpen ? item.label : undefined}
                  className={`flex items-center gap-3 h-10 px-3 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-sm'
                      : 'hover:bg-sidebar-accent text-sidebar-foreground'
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {sidebarOpen && <span>{item.label}</span>}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="p-3 border-t border-sidebar-border shrink-0">
        <button
          onClick={onLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-destructive/10 hover:text-destructive w-full text-left text-sm font-medium transition-colors"
          title={!sidebarOpen ? 'Cerrar Sesión' : undefined}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {sidebarOpen && <span>Cerrar Sesión</span>}
        </button>
      </div>
    </aside>
  );
}