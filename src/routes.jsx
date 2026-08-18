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
        <Route path="usuarios" element={<UsuariosPage />} />
        <Route path="roles" element={<RolesPage />} />
        <Route path="proveedores" element={<ProveedoresPage />} />
        <Route path="compras" element={<ComprasPage />} />
        <Route path="categorias" element={<CategoriasPage />} />
        <Route path="fichas-tecnicas" element={<FichasTecnicasPage />} />
        <Route path="insumos" element={<InsumosPage />} />
        <Route path="produccion" element={<ProduccionPage />} />
        <Route path="productos" element={<ProductosPage />} />
        <Route path="clientes" element={<ClientesPage />} />
        <Route path="pedidos" element={<PedidosPage />} />
        <Route path="ventas" element={<VentasPage />} />
      </Route>
    </Routes>
  );
}