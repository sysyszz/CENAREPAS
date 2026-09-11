import { createContext, useContext, useMemo, useState } from 'react';

export const mockPermisos = [
  { id_permiso: 1, modulo: 'dashboard', accion: 'ver', estado: 'activo' },
  { id_permiso: 2, modulo: 'roles', accion: 'ver', estado: 'activo' },
  { id_permiso: 3, modulo: 'roles', accion: 'crear', estado: 'activo' },
  { id_permiso: 4, modulo: 'roles', accion: 'editar', estado: 'activo' },
  { id_permiso: 5, modulo: 'roles', accion: 'eliminar', estado: 'activo' },
  { id_permiso: 6, modulo: 'usuarios', accion: 'ver', estado: 'activo' },
  { id_permiso: 7, modulo: 'usuarios', accion: 'crear', estado: 'activo' },
  { id_permiso: 8, modulo: 'usuarios', accion: 'editar', estado: 'activo' },
  { id_permiso: 9, modulo: 'usuarios', accion: 'eliminar', estado: 'activo' },
  ...['proveedores', 'clientes', 'compras', 'categorias', 'fichas-tecnicas', 'insumos', 'produccion', 'productos', 'pedidos', 'ventas', 'configuracion'].flatMap((modulo, offset) =>
    ['ver', 'crear', 'editar', 'eliminar'].map((accion, index) => ({
      id_permiso: 10 + offset * 4 + index,
      modulo,
      accion,
      estado: 'activo',
    }))
  ),
];

const defaultRolePermissions = {
  1: mockPermisos.map((p) => p.id_permiso), // Admin: total
  2: mockPermisos.filter((p) => ['dashboard', 'compras', 'pedidos', 'ventas', 'insumos', 'productos', 'produccion', 'categorias', 'proveedores', 'clientes', 'fichas-tecnicas'].includes(p.modulo)).map((p) => p.id_permiso), // Secretaria
  3: mockPermisos.filter((p) => ['dashboard', 'pedidos', 'ventas', 'clientes', 'productos'].includes(p.modulo)).map((p) => p.id_permiso), // Vendedor
  4: mockPermisos.filter((p) => ['dashboard', 'pedidos'].includes(p.modulo)).map((p) => p.id_permiso), // Domiciliario
};

export const mockRolPermisos = [
  ...mockPermisos.map((permission) => ({ id_rol: 1, id_permiso: permission.id_permiso })),
];

const PermissionContext = createContext(null);

export function PermissionProvider({ children }) {
  const getInitialRoleId = () => {
    try {
      const stored = localStorage.getItem('cenarepas_role_id');
      if (stored) return Number(stored);
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user && user.id_rol) return Number(user.id_rol);
    } catch {
      // ignore
    }
    return 1;
  };

  const [roleId, setRoleId] = useState(getInitialRoleId);
  const [rolePermissions, setRolePermissions] = useState(() => {
    try {
      const stored = localStorage.getItem('cenarepas_role_permissions');
      return stored ? JSON.parse(stored) : defaultRolePermissions;
    } catch {
      return defaultRolePermissions;
    }
  });

  const permissions = useMemo(() => {
    if (roleId === 1) return mockPermisos;
    const allowedIds = rolePermissions[roleId] || defaultRolePermissions[roleId] || [];
    return mockPermisos.filter((permission) => allowedIds.includes(permission.id_permiso));
  }, [roleId, rolePermissions]);

  const can = (modulo, accion = 'ver') => {
    // Si es Administrador (Rol 1), conceder acceso a todos los módulos y acciones
    if (roleId === 1) return true;

    return permissions.some(
      (permission) =>
        permission.modulo === modulo &&
        permission.accion === accion &&
        String(permission.estado).toLowerCase() === 'activo'
    );
  };

  const setActiveRole = (nextRoleId) => {
    localStorage.setItem('cenarepas_role_id', String(nextRoleId));
    setRoleId(Number(nextRoleId));
  };

  const updateRolePermissions = (nextRoleId, permissionIds) => {
    const next = { ...rolePermissions, [nextRoleId]: permissionIds };
    localStorage.setItem('cenarepas_role_permissions', JSON.stringify(next));
    setRolePermissions(next);
  };

  return (
    <PermissionContext.Provider
      value={{ roleId, setActiveRole, permissions, can, updateRolePermissions, rolePermissions }}
    >
      {children}
    </PermissionContext.Provider>
  );
}

export function usePermissions() {
  const context = useContext(PermissionContext);
  if (!context) throw new Error('usePermissions debe usarse dentro de PermissionProvider');
  return context;
}

export function PermissionGate({ modulo, accion = 'ver', children }) {
  const { can } = usePermissions();
  return can(modulo, accion) ? children : null;
}
