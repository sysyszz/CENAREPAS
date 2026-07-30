import { createBrowserRouter } from "react-router";
import { MainLayout } from "./components/layouts/MainLayout";
import { Dashboard } from "./pages/Dashboard";
import { Login } from "./pages/Login";
import { Usuarios } from "./pages/Usuarios";
import { Roles } from "./pages/Roles";
import { Proveedores } from "./pages/Proveedores";
import { Compras } from "./pages/Compras";
import { CategoriasProducto } from "./pages/CategoriasProducto";
import { FichasTecnicas } from "./pages/FichasTecnicas";
import { Insumos } from "./pages/Insumos";
import { Produccion } from "./pages/Produccion";
import { Productos } from "./pages/Productos";
import { Clientes } from "./pages/Clientes";
import { Pedidos } from "./pages/Pedidos";
import { Ventas } from "./pages/Ventas";

export const router = createBrowserRouter([
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/",
    Component: MainLayout,
    children: [
      { index: true, Component: Dashboard },
      { path: "usuarios", Component: Usuarios },
      { path: "roles", Component: Roles },
      { path: "proveedores", Component: Proveedores },
      { path: "compras", Component: Compras },
      { path: "categorias", Component: CategoriasProducto },
      { path: "fichas-tecnicas", Component: FichasTecnicas },
      { path: "insumos", Component: Insumos },
      { path: "produccion", Component: Produccion },
      { path: "productos", Component: Productos },
      { path: "clientes", Component: Clientes },
      { path: "pedidos", Component: Pedidos },
      { path: "ventas", Component: Ventas },
    ],
  },
]);
