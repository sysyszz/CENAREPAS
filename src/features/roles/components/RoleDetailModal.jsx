import { useMemo } from 'react';
import { X, Check, Shield, Calendar, Hash, Info, Layers } from 'lucide-react';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '../../../shared/ui/table';
import { mockPermisos, usePermissions } from '../../../shared/contexts/PermissionContext';

const MODULE_DEFINITIONS = [
  { key: 'dashboard', label: 'Dashboard', actions: ['ver'] },
  { key: 'roles', label: 'Roles', actions: ['ver', 'crear', 'editar', 'eliminar'] },
  { key: 'usuarios', label: 'Usuarios', actions: ['ver', 'crear', 'editar', 'eliminar'] },
  { key: 'categorias', label: 'Categorías', actions: ['ver', 'crear', 'editar', 'eliminar'] },
  { key: 'productos', label: 'Productos', actions: ['ver', 'crear', 'editar', 'eliminar'] },
  { key: 'insumos', label: 'Insumos', actions: ['ver', 'crear', 'editar', 'eliminar'] },
  { key: 'fichas-tecnicas', label: 'Fichas Técnicas', actions: ['ver', 'crear', 'editar', 'eliminar'] },
  { key: 'produccion', label: 'Producción', actions: ['ver', 'crear', 'editar', 'eliminar'] },
  { key: 'compras', label: 'Compras', actions: ['ver', 'crear', 'editar', 'eliminar'] },
  { key: 'pedidos', label: 'Pedidos', actions: ['ver', 'crear', 'editar', 'eliminar'] },
  { key: 'ventas', label: 'Ventas', actions: ['ver', 'crear', 'editar', 'eliminar'] },
  { key: 'clientes', label: 'Clientes', actions: ['ver', 'crear', 'editar', 'eliminar'] },
  { key: 'proveedores', label: 'Proveedores', actions: ['ver', 'crear', 'editar', 'eliminar'] },
  { key: 'configuracion', label: 'Configuración', actions: ['ver', 'crear', 'editar', 'eliminar'] },
];

const ACTIONS = [
  { key: 'ver', label: 'Ver' },
  { key: 'crear', label: 'Crear' },
  { key: 'editar', label: 'Editar' },
  { key: 'eliminar', label: 'Eliminar' },
];

// Permisos por defecto para roles predefinidos si aún no se han personalizado
const DEFAULT_ROLE_PERMISSIONS = {
  1: mockPermisos.map((p) => p.id_permiso), // Admin: Todos los permisos
  2: [1, 10, 11, 12, 13, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41], // Supervisor Producción
  3: [1, 10, 11, 12, 13, 18, 19, 20, 21, 30, 31, 32, 33], // Gestor Compras
  4: [1, 14, 15, 16, 17, 38, 42, 43, 44, 45, 46, 47, 48, 49], // Ventas y Distribución
  5: [1, 26, 30, 34, 38], // Auditor Calidad
};

export default function RoleDetailModal({ isOpen, onClose, role }) {
  const { rolePermissions } = usePermissions();

  const activePermissionIds = useMemo(() => {
    if (!role) return [];

    // 1. Si el rol tiene permisos explícitos en su objeto
    if (Array.isArray(role.permisos) && role.permisos.length > 0) {
      return role.permisos.map((p) => (typeof p === 'object' ? p.id_permiso : p));
    }

    // 2. Si existen permisos guardados en el contexto para este id_rol
    if (rolePermissions && rolePermissions[role.id_rol]) {
      return rolePermissions[role.id_rol];
    }

    // 3. Fallback a permisos predeterminados por id_rol
    if (DEFAULT_ROLE_PERMISSIONS[role.id_rol]) {
      return DEFAULT_ROLE_PERMISSIONS[role.id_rol];
    }

    return [];
  }, [role, rolePermissions]);

  if (!isOpen || !role) return null;

  const isActive = String(role.estado || '').toLowerCase() === 'activo';
  const totalSystemPermissions = mockPermisos.length;
  const activeCount = activePermissionIds.length;

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('es-CO', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-card text-card-foreground p-6 rounded-xl max-w-3xl w-full border border-border shadow-2xl space-y-6 max-h-[90vh] flex flex-col animate-in fade-in-50 zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-border shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold tracking-tight">{role.nombre}</h2>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    isActive
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                      : 'bg-muted text-muted-foreground border border-border'
                  }`}
                >
                  {isActive ? 'Activo' : 'Inactivo'}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Información general y matriz de permisos configurados
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto space-y-5 pr-1 flex-1 custom-scrollbar">
          {/* Metadata Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-lg bg-muted/40 border border-border/60">
              <div className="flex items-center gap-2 text-muted-foreground text-xs font-medium mb-1">
                <Hash className="w-3.5 h-3.5" />
                <span>Identificador</span>
              </div>
              <p className="text-sm font-semibold font-mono text-foreground">
                #{role.id_rol}
              </p>
            </div>

            <div className="p-3 rounded-lg bg-muted/40 border border-border/60">
              <div className="flex items-center gap-2 text-muted-foreground text-xs font-medium mb-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>Fecha de Creación</span>
              </div>
              <p className="text-sm font-semibold text-foreground">
                {formatDate(role.fecha_creacion)}
              </p>
            </div>

            <div className="p-3 rounded-lg bg-muted/40 border border-border/60">
              <div className="flex items-center gap-2 text-muted-foreground text-xs font-medium mb-1">
                <Layers className="w-3.5 h-3.5" />
                <span>Permisos Asignados</span>
              </div>
              <p className="text-sm font-semibold text-foreground">
                <span className="text-primary font-bold">{activeCount}</span>
                <span className="text-muted-foreground font-normal text-xs"> / {totalSystemPermissions} activos</span>
              </p>
            </div>
          </div>

          {/* Description */}
          {role.descripcion && (
            <div className="p-3 rounded-lg bg-muted/20 border border-border/50 text-xs">
              <div className="flex items-center gap-1.5 text-muted-foreground font-medium mb-1">
                <Info className="w-3.5 h-3.5" />
                <span>Descripción del Rol</span>
              </div>
              <p className="text-foreground leading-relaxed">
                {role.descripcion}
              </p>
            </div>
          )}

          {/* Permissions Table Section */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-foreground">
                  Matriz de Permisos por Módulo
                </h3>
                <p className="text-xs text-muted-foreground">
                  Nivel de acceso autorizado para las diferentes áreas del sistema
                </p>
              </div>
            </div>

            <div className="rounded-lg border border-border bg-card overflow-hidden shadow-xs">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/70 hover:bg-muted/70 border-b border-border">
                    <TableHead className="py-2.5 px-4 font-semibold text-xs text-foreground uppercase tracking-wider">
                      Módulo
                    </TableHead>
                    {ACTIONS.map((action) => (
                      <TableHead
                        key={action.key}
                        className="py-2.5 px-4 font-semibold text-xs text-foreground uppercase tracking-wider text-center w-24"
                      >
                        {action.label}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {MODULE_DEFINITIONS.map((moduleItem, index) => {
                    return (
                      <TableRow
                        key={moduleItem.key}
                        className={`hover:bg-muted/30 transition-colors ${
                          index % 2 === 0 ? 'bg-transparent' : 'bg-muted/15'
                        }`}
                      >
                        <TableCell className="py-2.5 px-4 font-medium text-xs text-foreground">
                          <span className="capitalize">{moduleItem.label}</span>
                        </TableCell>

                        {ACTIONS.map((action) => {
                          const systemPermission = mockPermisos.find(
                            (p) => p.modulo === moduleItem.key && p.accion === action.key
                          );

                          // Si la acción no existe para este módulo (ej. crear en dashboard)
                          if (!systemPermission) {
                            return (
                              <TableCell
                                key={action.key}
                                className="py-2.5 px-4 text-center text-muted-foreground/30 text-xs font-mono select-none"
                              >
                                —
                              </TableCell>
                            );
                          }

                          const hasPermission = activePermissionIds.includes(
                            systemPermission.id_permiso
                          );

                          return (
                            <TableCell key={action.key} className="py-2.5 px-4 text-center">
                              <div className="flex items-center justify-center">
                                {hasPermission ? (
                                  <span
                                    className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                                    aria-label={`Permiso de ${action.label} en ${moduleItem.label} activo`}
                                  >
                                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                                  </span>
                                ) : (
                                  <span
                                    className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-muted/50 text-muted-foreground/40 border border-border/40"
                                    aria-label={`Permiso de ${action.label} en ${moduleItem.label} inactivo`}
                                  >
                                    <X className="w-3 h-3 stroke-[2]" />
                                  </span>
                                )}
                              </div>
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-border flex justify-end shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-primary text-primary-foreground hover:opacity-90 rounded-lg text-sm font-medium transition-opacity shadow-xs"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
