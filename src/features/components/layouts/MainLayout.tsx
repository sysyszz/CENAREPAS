import { Outlet, Link, useLocation } from "react-router";
import { 
  LayoutDashboard, 
  Users, 
  Shield, 
  Package, 
  ShoppingCart,
  FolderTree,
  FileText,
  Boxes,
  Factory,
  Store,
  UserCircle,
  ShoppingBag,
  TrendingUp,
  LogOut,
  Menu,
  X
} from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";

const menuItems = [
  { path: "/", icon: LayoutDashboard, label: "Dashboard" },
  { path: "/usuarios", icon: Users, label: "Usuarios" },
  { path: "/roles", icon: Shield, label: "Roles" },
  { path: "/proveedores", icon: Store, label: "Proveedores" },
  { path: "/compras", icon: ShoppingCart, label: "Compras" },
  { path: "/categorias", icon: FolderTree, label: "Categorías" },
  { path: "/fichas-tecnicas", icon: FileText, label: "Fichas Técnicas" },
  { path: "/insumos", icon: Package, label: "Insumos" },
  { path: "/produccion", icon: Factory, label: "Producción" },
  { path: "/productos", icon: Boxes, label: "Productos" },
  { path: "/clientes", icon: UserCircle, label: "Clientes" },
  { path: "/pedidos", icon: ShoppingBag, label: "Pedidos" },
  { path: "/ventas", icon: TrendingUp, label: "Ventas" },
];

export function MainLayout() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: '#F8FAFC' }}>
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-0"
        } transition-all duration-300 overflow-hidden`}
        style={{ backgroundColor: '#1E293B' }}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b" style={{ borderColor: '#334155' }}>
            <h1 className="text-white text-xl" style={{ fontWeight: 600 }}>
              Sistema Administrativo
            </h1>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        isActive
                          ? "text-white"
                          : "text-gray-300 hover:text-white hover:bg-opacity-10 hover:bg-white"
                      }`}
                      style={
                        isActive
                          ? { backgroundColor: '#2563EB' }
                          : {}
                      }
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* User Section */}
          <div className="p-4 border-t" style={{ borderColor: '#334155' }}>
            <div className="flex items-center gap-3 px-4 py-3 text-gray-300">
              <UserCircle className="w-5 h-5" />
              <div className="flex-1">
                <p className="text-white text-sm">Admin User</p>
                <p className="text-gray-400 text-xs">admin@sistema.com</p>
              </div>
            </div>
            <Link to="/login">
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 text-gray-300 hover:text-white hover:bg-white hover:bg-opacity-10"
              >
                <LogOut className="w-5 h-5" />
                <span>Cerrar Sesión</span>
              </Button>
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b px-6 py-4 flex items-center gap-4" style={{ borderColor: '#E2E8F0' }}>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-600"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
          
          <div className="flex-1">
            <h2 className="text-xl" style={{ color: '#0F172A', fontWeight: 600 }}>
              {menuItems.find((item) => item.path === location.pathname)?.label || "Dashboard"}
            </h2>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
