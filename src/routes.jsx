import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './features/landing/pages/LandingPage';
import Login from './features/auth/pages/Login';
import ForgotPassword from './features/auth/pages/ForgotPassword';
import AdminLayout from './features/admin/layout/AdminLayout';

import DashboardPage from './features/dashboard/pages/DashboardPage';
import ProfilePage from './features/profile/pages/ProfilePage';
import UsuariosPage from './features/usuarios/pages/UsuariosPage';
import RolesPage from './features/roles/pages/RolesPage';
import ProveedoresPage from './features/proveedores/pages/ProveedoresPage';
import ClientesPage from './features/clientes/pages/ClientesPage';
import ComprasPage from './features/compras/pages/ComprasPage';
import CategoriasPage from './features/categorias/pages/CategoriasPage';
import FichasTecnicasPage from './features/fichas-tecnicas/pages/FichasTecnicasPage';
import InsumosPage from './features/insumos/pages/InsumosPage';
import ProduccionPage from './features/produccion/pages/ProduccionPage';
import ProductosPage from './features/productos/pages/ProductosPage';
import PedidosPage from './features/pedidos/pages/PedidosPage';
import VentasPage from './features/ventas/pages/VentasPage';
import { usePermissions } from './shared/contexts/PermissionContext';

function ProtectedModule({ modulo, children }) {
  const { can } = usePermissions();
  return can(modulo, 'ver') ? children : <Navigate to="/admin" replace />;
}

export function AppRoutes({ isAuthenticated, setIsAuthenticated }) {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route
        path="/admin/login"
        element={<Login onLogin={() => setIsAuthenticated(true)} />}
      />
      <Route path="/admin/forgot-password" element={<ForgotPassword />} />
      <Route
        path="/admin/*"
        element={
          isAuthenticated ? (
            <AdminLayout onLogout={() => setIsAuthenticated(false)} />
          ) : (
            <Navigate to="/admin/login" replace />
          )
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="usuarios" element={<ProtectedModule modulo="usuarios"><UsuariosPage /></ProtectedModule>} />
        <Route path="roles" element={<ProtectedModule modulo="roles"><RolesPage /></ProtectedModule>} />
        <Route path="proveedores" element={<ProtectedModule modulo="proveedores"><ProveedoresPage /></ProtectedModule>} />
        <Route path="compras" element={<ProtectedModule modulo="compras"><ComprasPage /></ProtectedModule>} />
        <Route path="categorias" element={<ProtectedModule modulo="categorias"><CategoriasPage /></ProtectedModule>} />
        <Route path="fichas-tecnicas" element={<ProtectedModule modulo="fichas-tecnicas"><FichasTecnicasPage /></ProtectedModule>} />
        <Route path="insumos" element={<ProtectedModule modulo="insumos"><InsumosPage /></ProtectedModule>} />
        <Route path="produccion" element={<ProtectedModule modulo="produccion"><ProduccionPage /></ProtectedModule>} />
        <Route path="productos" element={<ProtectedModule modulo="productos"><ProductosPage /></ProtectedModule>} />
        <Route path="clientes" element={<ProtectedModule modulo="clientes"><ClientesPage /></ProtectedModule>} />
        <Route path="pedidos" element={<ProtectedModule modulo="pedidos"><PedidosPage /></ProtectedModule>} />
        <Route path="ventas" element={<ProtectedModule modulo="ventas"><VentasPage /></ProtectedModule>} />
      </Route>
    </Routes>
  );
}