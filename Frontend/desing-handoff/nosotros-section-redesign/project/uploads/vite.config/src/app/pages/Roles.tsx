import { useState } from "react";
import { DataTable } from "../components/DataTable";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Checkbox } from "../components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";

const mockRoles = [
  { id: 1, nombre: "Administrador", descripcion: "Acceso total al sistema", permisos: 45, estado: "activo" },
  { id: 2, nombre: "Supervisor", descripcion: "Gestión de operaciones", permisos: 28, estado: "activo" },
  { id: 3, nombre: "Vendedor", descripcion: "Gestión de ventas y clientes", permisos: 15, estado: "activo" },
  { id: 4, nombre: "Almacenero", descripcion: "Gestión de inventario", permisos: 12, estado: "activo" },
  { id: 5, nombre: "Contador", descripcion: "Gestión financiera", permisos: 18, estado: "inactivo" },
];

const permisosPorModulo = [
  {
    modulo: "Usuarios",
    permisos: ["Crear", "Leer", "Actualizar", "Eliminar"],
  },
  {
    modulo: "Ventas",
    permisos: ["Crear", "Leer", "Actualizar", "Anular"],
  },
  {
    modulo: "Productos",
    permisos: ["Crear", "Leer", "Actualizar", "Eliminar"],
  },
  {
    modulo: "Inventario",
    permisos: ["Crear", "Leer", "Actualizar", "Eliminar"],
  },
  {
    modulo: "Reportes",
    permisos: ["Visualizar", "Exportar"],
  },
];

export function Roles() {
  const [roles, setRoles] = useState(mockRoles);
  const [showDialog, setShowDialog] = useState(false);
  const [showPermisosDialog, setShowPermisosDialog] = useState(false);
  const [selectedRol, setSelectedRol] = useState<any>(null);

  const columns = [
    { key: "id", label: "ID" },
    { key: "nombre", label: "Nombre del Rol" },
    { key: "descripcion", label: "Descripción" },
    {
      key: "permisos",
      label: "Permisos",
      render: (value: number) => (
        <Badge style={{ backgroundColor: "#38BDF8", color: "#FFFFFF" }}>
          {value} permisos
        </Badge>
      ),
    },
    {
      key: "estado",
      label: "Estado",
      render: (value: string) => (
        <Badge
          style={{
            backgroundColor: value === "activo" ? "#22C55E" : "#64748B",
            color: "#FFFFFF",
          }}
        >
          {value}
        </Badge>
      ),
    },
  ];

  const handleAdd = () => {
    setSelectedRol(null);
    setShowDialog(true);
  };

  const handleEdit = (rol: any) => {
    setSelectedRol(rol);
    setShowDialog(true);
  };

  const handleDelete = (rol: any) => {
    setRoles(roles.filter((r) => r.id !== rol.id));
  };

  const handleAsignarPermisos = (rol: any) => {
    setSelectedRol(rol);
    setShowPermisosDialog(true);
  };

  return (
    <div>
      <DataTable
        columns={columns}
        data={roles}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleAsignarPermisos}
        searchPlaceholder="Buscar roles..."
      />

      {/* Dialog para agregar/editar rol */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle style={{ color: "#0F172A" }}>
              {selectedRol ? "Editar Rol" : "Nuevo Rol"}
            </DialogTitle>
            <DialogDescription style={{ color: "#64748B" }}>
              Configure el rol y sus permisos
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Nombre del Rol</Label>
              <Input placeholder="Ej: Administrador" style={{ backgroundColor: "#FFFFFF" }} />
            </div>
            <div>
              <Label>Descripción</Label>
              <Input placeholder="Descripción del rol" style={{ backgroundColor: "#FFFFFF" }} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Cancelar
            </Button>
            <Button
              style={{ backgroundColor: "#2563EB", color: "#FFFFFF" }}
              onClick={() => {
                setShowDialog(false);
                if (!selectedRol) {
                  setSelectedRol({ nombre: "Nuevo Rol" });
                  setShowPermisosDialog(true);
                }
              }}
            >
              {selectedRol ? "Actualizar" : "Continuar a Permisos"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog para asignar permisos */}
      <Dialog open={showPermisosDialog} onOpenChange={setShowPermisosDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle style={{ color: "#0F172A" }}>
              Asignar Permisos - {selectedRol?.nombre}
            </DialogTitle>
            <DialogDescription style={{ color: "#64748B" }}>
              Seleccione los permisos para este rol
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {permisosPorModulo.map((modulo) => (
              <Card key={modulo.modulo} style={{ borderColor: "#E2E8F0" }}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base" style={{ color: "#0F172A" }}>
                    {modulo.modulo}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {modulo.permisos.map((permiso) => (
                      <div key={permiso} className="flex items-center space-x-2">
                        <Checkbox id={`${modulo.modulo}-${permiso}`} />
                        <label
                          htmlFor={`${modulo.modulo}-${permiso}`}
                          className="text-sm cursor-pointer"
                          style={{ color: "#0F172A" }}
                        >
                          {permiso}
                        </label>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPermisosDialog(false)}>
              Cancelar
            </Button>
            <Button style={{ backgroundColor: "#2563EB", color: "#FFFFFF" }}>
              Guardar Permisos
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
