import { Link, useLocation } from 'react-router-dom';
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

export default function Sidebar({ sidebarOpen, setSidebarOpen, onLogout }) {
  const location = useLocation();

  return (
    <aside
      className={`${
        sidebarOpen ? 'w-64' : 'w-20'
      } bg-sidebar text-sidebar-foreground transition-all duration-300 flex flex-col`}
    >
      <div className="p-4 flex items-center justify-between border-b border-sidebar-border">
        {sidebarOpen && <h2 className="text-lg">CenArepas</h2>}
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
  );
}