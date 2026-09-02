import { useState } from 'react';
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
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Settings,
} from 'lucide-react';
import { usePermissions } from '../../../shared/contexts/PermissionContext';
import { useConfiguracion } from '../../../shared/contexts/ConfiguracionContext';

const menuGroups = [
  {
    category: 'Principal',
    items: [
      { path: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    ],
  },
  {
    category: 'Operaciones',
    items: [
      { path: '/admin/productos', icon: Box, label: 'Productos' },
      { path: '/admin/insumos', icon: Package, label: 'Insumos' },
      { path: '/admin/produccion', icon: Factory, label: 'Producción' },
      { path: '/admin/ventas', icon: DollarSign, label: 'Ventas' },
      { path: '/admin/pedidos', icon: ClipboardList, label: 'Pedidos' },
      { path: '/admin/compras', icon: ShoppingCart, label: 'Compras' },
    ],
  },
  {
    category: 'Catálogos y Terceros',
    items: [
      { path: '/admin/categorias', icon: FolderTree, label: 'Categorías' },
      { path: '/admin/proveedores', icon: Truck, label: 'Proveedores' },
      { path: '/admin/clientes', icon: UserCircle, label: 'Clientes' },
      { path: '/admin/fichas-tecnicas', icon: BookOpen, label: 'Fichas Técnicas' },
    ],
  },
  {
    category: 'Configuración',
    items: [
      { path: '/admin/configuracion', icon: Settings, label: 'Configuración', permission: 'configuracion' },
      { path: '/admin/usuarios', icon: Users, label: 'Usuarios' },
      { path: '/admin/roles', icon: Shield, label: 'Roles' },
    ],
  },
];

export default function Sidebar({ sidebarOpen, setSidebarOpen, onLogout }) {
  const location = useLocation();
  const { can } = usePermissions();
  const { nombreProyecto, logoUrl } = useConfiguracion();
  const [collapsedSections, setCollapsedSections] = useState({});

  const toggleSection = (category) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  return (
    <aside
      className={`${
        sidebarOpen ? 'w-64' : 'w-20'
      } bg-sidebar text-sidebar-foreground transition-all duration-300 flex flex-col h-screen sticky top-0`}
    >
      <div className="p-4 flex items-center justify-between border-b border-sidebar-border h-16 shrink-0">
        {sidebarOpen ? (
          <div className="flex items-center gap-2.5 min-w-0">
            <img src={logoUrl} alt={nombreProyecto} className="h-8 w-8 object-contain shrink-0" />
            <h2 className="text-base font-bold tracking-wide truncate" title={nombreProyecto}>
              {nombreProyecto}
            </h2>
          </div>
        ) : (
          <img src={logoUrl} alt={nombreProyecto} className="h-8 w-8 object-contain mx-auto" />
        )}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 hover:bg-sidebar-accent rounded-lg text-sidebar-foreground transition-colors cursor-pointer"
        >
          {sidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto custom-scrollbar scroll-smooth p-3 space-y-3">
        {menuGroups.map((group, groupIdx) => {
          const isCollapsed = Boolean(collapsedSections[group.category]);
          const visibleItems = group.items.filter((item) =>
            can(
              item.permission ||
                (item.path === '/admin' ? 'dashboard' : item.path.split('/').pop()),
              'ver'
            )
          );

          if (visibleItems.length === 0) return null;

          return (
            <div key={group.category} className="space-y-1">
              {sidebarOpen ? (
                <button
                  type="button"
                  onClick={() => toggleSection(group.category)}
                  className="w-full flex items-center justify-between px-3 pt-1.5 pb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70 hover:text-sidebar-foreground transition-colors group cursor-pointer select-none rounded-md"
                  aria-expanded={!isCollapsed}
                >
                  <span>{group.category}</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 text-muted-foreground/50 group-hover:text-sidebar-foreground ${
                      isCollapsed ? '-rotate-90' : 'rotate-0'
                    }`}
                  />
                </button>
              ) : (
                groupIdx > 0 && <div className="border-t border-sidebar-border/50 my-2" />
              )}

              {(!isCollapsed || !sidebarOpen) && (
                <div className="space-y-1">
                  {visibleItems.map((item) => {
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
              )}
            </div>
          );
        })}
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