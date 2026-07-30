import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';

import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import ForgotPassword from './components/ForgotPassword';
import Profile from './components/Profile';
import Usuarios from './components/Usuarios';
import Roles from './components/Roles';
import Proveedores from './components/Proveedores';
import Compras from './components/Compras';
import Categorias from './components/Categorias';
import FichasTecnicas from './components/FichasTecnicas';
import Insumos from './components/Insumos';
import Produccion from './components/Produccion';
import Productos from './components/Productos';
import Clientes from './components/Clientes';
import Pedidos from './components/Pedidos';
import Ventas from './components/Ventas';



import LandingPage from '../features/landing/pages/LandingPage';


export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/admin/login" element={<Login onLogin={() => setIsAuthenticated(true)} />} />
          <Route path="/admin/forgot-password" element={<ForgotPassword />} />
          <Route
            path="/admin/*"
            element={
              isAuthenticated ? (
                <Layout onLogout={() => setIsAuthenticated(false)}>
                  <Routes>
                    <Route index element={<Dashboard />} />
                    <Route path="profile" element={<Profile />} />
                    <Route path="usuarios" element={<Usuarios />} />
                    <Route path="roles" element={<Roles />} />
                    <Route path="proveedores" element={<Proveedores />} />
                    <Route path="compras" element={<Compras />} />
                    <Route path="categorias" element={<Categorias />} />
                    <Route path="fichas-tecnicas" element={<FichasTecnicas />} />
                    <Route path="insumos" element={<Insumos />} />
                    <Route path="produccion" element={<Produccion />} />
                    <Route path="productos" element={<Productos />} />
                    <Route path="clientes" element={<Clientes />} />
                    <Route path="pedidos" element={<Pedidos />} />
                    <Route path="ventas" element={<Ventas />} />
                  </Routes>
                </Layout>
              ) : (
                <Navigate to="/admin/login" replace />
              )
            }
          />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
