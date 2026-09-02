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
  ...['proveedores', 'clientes', 'compras', 'categorias', 'fichas-tecnicas', 'insumos', 'produccion', 'productos', 'pedidos', 'ventas'].flatMap((modulo, offset) =>
    ['ver', 'crear', 'editar', 'eliminar'].map((accion, index) => ({
      id_permiso: 10 + offset * 4 + index,
      modulo,
      accion,
      estado: 'activo',
    }))
  ),
];

export const mockRolPermisos = [
  ...mockPermisos.map((permission) => ({ id_rol: 1, id_permiso: permission.id_permiso })),
];

const PermissionContext = createContext(null);

export function PermissionProvider({ children }) {
  const [roleId, setRoleId] = useState(() => Number(localStorage.getItem('cenarepas_role_id') || 1));
  const [rolePermissions, setRolePermissions] = useState(() => {
    try { return JSON.parse(localStorage.getItem('cenarepas_role_permissions')) || { 1: mockPermisos.map((permission) => permission.id_permiso) }; } catch { return { 1: mockPermisos.map((permission) => permission.id_permiso) }; }
  });

  const permissions = useMemo(() => {
    const allowedIds = rolePermissions[roleId] || [];
    return mockPermisos.filter((permission) => allowedIds.includes(permission.id_permiso));
  }, [roleId, rolePermissions]);

  const can = (modulo, accion = 'ver') => permissions.some((permission) => permission.modulo === modulo && permission.accion === accion && permission.estado === 'activo');
  const setActiveRole = (nextRoleId) => {
    localStorage.setItem('cenarepas_role_id', String(nextRoleId));
    setRoleId(Number(nextRoleId));
  };
  const updateRolePermissions = (nextRoleId, permissionIds) => {
    const next = { ...rolePermissions, [nextRoleId]: permissionIds };
    localStorage.setItem('cenarepas_role_permissions', JSON.stringify(next));
    setRolePermissions(next);
  };

  return <PermissionContext.Provider value={{ roleId, setActiveRole, permissions, can, updateRolePermissions, rolePermissions }}>{children}</PermissionContext.Provider>;
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
