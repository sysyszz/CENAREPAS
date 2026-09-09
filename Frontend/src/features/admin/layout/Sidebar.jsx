import { useEffect, useState } from 'react';
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
  X,
} from 'lucide-react';
import { usePermissions } from '../../../shared/contexts/PermissionContext';
import { useConfiguracion } from '../../../shared/contexts/ConfiguracionContext';

export const menuGroups = [
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

export default function Sidebar({ sidebarOpen, setSidebarOpen, mobileOpen, setMobileOpen, onLogout }) {
  const location = useLocation();
  const { can } = usePermissions();
  const { nombreProyecto, logoUrl } = useConfiguracion();
  const [collapsedSections, setCollapsedSections] = useState({});
  // Nav body is shared between the desktop rail and the mobile drawer: when the
  // mobile drawer is open it must always show full labels, regardless of the
  // desktop icon-only collapse preference (which is meaningless off-canvas).
  const expanded = sidebarOpen || mobileOpen;

  const toggleSection = (category) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  useEffect(() => {
    setMobileOpen?.(false);
  }, [location.pathname, setMobileOpen]);

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden transition-opacity"
          onClick={() => setMobileOpen?.(false)}
          aria-hidden="true"
        />
      )}
      <aside
        className={`${sidebarOpen ? 'lg:w-64' : 'lg:w-20'} ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] bg-sidebar text-sidebar-foreground transition-all duration-300 flex flex-col h-screen lg:sticky lg:top-0 lg:z-auto lg:translate-x-0 shadow-2xl lg:shadow-none border-r border-sidebar-border`}
      >
        {/* Mobile header: always full width, closes the drawer */}
        <div className="flex items-center justify-between border-b border-sidebar-border h-16 shrink-0 p-4 lg:hidden">
          <div className="flex items-center gap-2.5 min-w-0">
            <img src={logoUrl} alt={nombreProyecto} className="h-9 w-9 object-contain shrink-0 rounded-lg drop-shadow-sm" />
            <h2 className="text-base font-bold tracking-wide truncate" title={nombreProyecto}>
              {nombreProyecto}
            </h2>
          </div>
          <button
            onClick={() => setMobileOpen?.(false)}
            className="p-2 hover:bg-sidebar-accent rounded-lg text-sidebar-foreground transition-colors cursor-pointer"
            aria-label="Cerrar menú"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Desktop header: collapsible icon-only / full width */}
        <div className="hidden lg:flex p-4 items-center justify-between border-b border-sidebar-border h-16 shrink-0">
          {sidebarOpen ? (
            <div className="flex items-center gap-2.5 min-w-0">
              <img src={logoUrl} alt={nombreProyecto} className="h-9 w-9 object-contain shrink-0 rounded-lg drop-shadow-sm" />
              <h2 className="text-base font-bold tracking-wide truncate" title={nombreProyecto}>
                {nombreProyecto}
              </h2>
            </div>
          ) : (
            <img src={logoUrl} alt={nombreProyecto} className="h-9 w-9 object-contain mx-auto rounded-lg drop-shadow-sm" />
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-sidebar-accent rounded-lg text-sidebar-foreground transition-colors cursor-pointer"
            aria-label={sidebarOpen ? 'Contraer menú' : 'Expandir menú'}
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
              {expanded ? (
                <button
                  type="button"
                  onClick={() => toggleSection(group.category)}
                  className="w-full flex items-center justify-between px-3 pt-1.5 pb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground/90 hover:text-sidebar-foreground transition-colors group cursor-pointer select-none rounded-md"
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

              {(!isCollapsed || !expanded) && (
                <div className="space-y-1">
                  {visibleItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        title={!expanded ? item.label : undefined}
                        className={`flex items-center gap-3 h-10 px-3 rounded-lg text-sm font-medium transition-all ${
                          isActive
                            ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-sm'
                            : 'hover:bg-sidebar-accent text-sidebar-foreground'
                        }`}
                      >
                        <Icon className="w-5 h-5 flex-shrink-0" />
                        {expanded && <span>{item.label}</span>}
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
          title={!expanded ? 'Cerrar Sesión' : undefined}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {expanded && <span>Cerrar Sesión</span>}
        </button>
      </div>
      </aside>
    </>
  );
}