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
import { Textarea } from "../components/ui/textarea";

const mockProveedores = [
  { id: 1, nombre: "Distribuidora ABC", contacto: "Pedro González", email: "contacto@abc.com", telefono: "+1234567890", direccion: "Av. Principal 123", estado: "activo" },
  { id: 2, nombre: "Insumos XYZ", contacto: "María López", email: "ventas@xyz.com", telefono: "+1234567891", direccion: "Calle Comercio 456", estado: "activo" },
  { id: 3, nombre: "Materias Primas S.A.", contacto: "Carlos Ruiz", email: "info@materias.com", telefono: "+1234567892", direccion: "Zona Industrial 789", estado: "activo" },
  { id: 4, nombre: "Envases del Norte", contacto: "Ana Torres", email: "ventas@envases.com", telefono: "+1234567893", direccion: "Polígono Industrial 321", estado: "inactivo" },
  { id: 5, nombre: "Etiquetas Premium", contacto: "Luis Mendoza", email: "contacto@etiquetas.com", telefono: "+1234567894", direccion: "Av. Industrial 654", estado: "activo" },
];

export function Proveedores() {
  const [proveedores, setProveedores] = useState(mockProveedores);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedProveedor, setSelectedProveedor] = useState<any>(null);

  const columns = [
    { key: "id", label: "ID" },
    { key: "nombre", label: "Nombre" },
    { key: "contacto", label: "Contacto" },
    { key: "email", label: "Email" },
    { key: "telefono", label: "Teléfono" },
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
    setSelectedProveedor(null);
    setShowDialog(true);
  };

  const handleEdit = (proveedor: any) => {
    setSelectedProveedor(proveedor);
    setShowDialog(true);
  };

  const handleDelete = (proveedor: any) => {
    setProveedores(proveedores.filter((p) => p.id !== proveedor.id));
  };

  return (
    <div>
      <DataTable
        columns={columns}
        data={proveedores}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Buscar proveedores..."
      />

      {/* Dialog para agregar/editar */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle style={{ color: "#0F172A" }}>
              {selectedProveedor ? "Editar Proveedor" : "Nuevo Proveedor"}
            </DialogTitle>
            <DialogDescription style={{ color: "#64748B" }}>
              Complete la información del proveedor
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Nombre de la Empresa</Label>
              <Input placeholder="Distribuidora ABC" style={{ backgroundColor: "#FFFFFF" }} />
            </div>
            <div>
              <Label>Persona de Contacto</Label>
              <Input placeholder="Juan Pérez" style={{ backgroundColor: "#FFFFFF" }} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Email</Label>
                <Input type="email" placeholder="contacto@empresa.com" style={{ backgroundColor: "#FFFFFF" }} />
              </div>
              <div>
                <Label>Teléfono</Label>
                <Input placeholder="+1234567890" style={{ backgroundColor: "#FFFFFF" }} />
              </div>
            </div>
            <div>
              <Label>Dirección</Label>
              <Textarea placeholder="Dirección completa" style={{ backgroundColor: "#FFFFFF" }} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Cancelar
            </Button>
            <Button style={{ backgroundColor: "#2563EB", color: "#FFFFFF" }}>
              {selectedProveedor ? "Actualizar" : "Crear Proveedor"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
