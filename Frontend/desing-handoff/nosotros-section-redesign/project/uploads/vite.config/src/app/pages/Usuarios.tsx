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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

const mockUsuarios = [
  { id: 1, nombre: "Juan Pérez", email: "juan@email.com", rol: "Administrador", estado: "activo", telefono: "+1234567890" },
  { id: 2, nombre: "María García", email: "maria@email.com", rol: "Vendedor", estado: "activo", telefono: "+1234567891" },
  { id: 3, nombre: "Carlos López", email: "carlos@email.com", rol: "Supervisor", estado: "activo", telefono: "+1234567892" },
  { id: 4, nombre: "Ana Martínez", email: "ana@email.com", rol: "Vendedor", estado: "inactivo", telefono: "+1234567893" },
  { id: 5, nombre: "Luis Rodríguez", email: "luis@email.com", rol: "Administrador", estado: "activo", telefono: "+1234567894" },
  { id: 6, nombre: "Sofia Hernández", email: "sofia@email.com", rol: "Vendedor", estado: "activo", telefono: "+1234567895" },
  { id: 7, nombre: "Miguel Torres", email: "miguel@email.com", rol: "Supervisor", estado: "activo", telefono: "+1234567896" },
  { id: 8, nombre: "Laura Ramírez", email: "laura@email.com", rol: "Vendedor", estado: "inactivo", telefono: "+1234567897" },
];

export function Usuarios() {
  const [usuarios, setUsuarios] = useState(mockUsuarios);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedUsuario, setSelectedUsuario] = useState<any>(null);
  const [filtroRol, setFiltroRol] = useState<string>("todos");

  const columns = [
    { key: "id", label: "ID" },
    { key: "nombre", label: "Nombre" },
    { key: "email", label: "Email" },
    { key: "telefono", label: "Teléfono" },
    {
      key: "rol",
      label: "Rol",
      render: (value: string) => (
        <Badge style={{ backgroundColor: "#38BDF8", color: "#FFFFFF" }}>
          {value}
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
    setSelectedUsuario(null);
    setShowDialog(true);
  };

  const handleEdit = (usuario: any) => {
    setSelectedUsuario(usuario);
    setShowDialog(true);
  };

  const handleDelete = (usuario: any) => {
    setUsuarios(usuarios.filter((u) => u.id !== usuario.id));
  };

  const dataFiltrada = filtroRol === "todos" 
    ? usuarios 
    : usuarios.filter((u) => u.rol === filtroRol);

  const filters = (
    <Select value={filtroRol} onValueChange={setFiltroRol}>
      <SelectTrigger className="w-[180px]" style={{ backgroundColor: "#FFFFFF" }}>
        <SelectValue placeholder="Filtrar por rol" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="todos">Todos los roles</SelectItem>
        <SelectItem value="Administrador">Administrador</SelectItem>
        <SelectItem value="Supervisor">Supervisor</SelectItem>
        <SelectItem value="Vendedor">Vendedor</SelectItem>
      </SelectContent>
    </Select>
  );

  return (
    <div>
      <DataTable
        columns={columns}
        data={dataFiltrada}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Buscar usuarios..."
        filters={filters}
      />

      {/* Dialog para agregar/editar */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle style={{ color: "#0F172A" }}>
              {selectedUsuario ? "Editar Usuario" : "Nuevo Usuario"}
            </DialogTitle>
            <DialogDescription style={{ color: "#64748B" }}>
              Complete los datos del usuario
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Nombre Completo</Label>
              <Input placeholder="Juan Pérez" style={{ backgroundColor: "#FFFFFF" }} />
            </div>
            <div>
              <Label>Email</Label>
              <Input type="email" placeholder="juan@email.com" style={{ backgroundColor: "#FFFFFF" }} />
            </div>
            <div>
              <Label>Teléfono</Label>
              <Input placeholder="+1234567890" style={{ backgroundColor: "#FFFFFF" }} />
            </div>
            <div>
              <Label>Rol</Label>
              <Select>
                <SelectTrigger style={{ backgroundColor: "#FFFFFF" }}>
                  <SelectValue placeholder="Seleccionar rol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrador</SelectItem>
                  <SelectItem value="supervisor">Supervisor</SelectItem>
                  <SelectItem value="vendedor">Vendedor</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Contraseña</Label>
              <Input type="password" placeholder="••••••••" style={{ backgroundColor: "#FFFFFF" }} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Cancelar
            </Button>
            <Button style={{ backgroundColor: "#2563EB", color: "#FFFFFF" }}>
              {selectedUsuario ? "Actualizar" : "Crear Usuario"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
