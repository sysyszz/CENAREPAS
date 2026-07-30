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
import { Upload, FileText } from "lucide-react";

const mockCompras = [
  { id: 1, factura: "FC-001", proveedor: "Distribuidora ABC", fecha: "2026-05-20", total: 5400, estado: "completada" },
  { id: 2, factura: "FC-002", proveedor: "Insumos XYZ", fecha: "2026-05-22", total: 3200, estado: "completada" },
  { id: 3, factura: "FC-003", proveedor: "Materias Primas S.A.", fecha: "2026-05-24", total: 7800, estado: "pendiente" },
  { id: 4, factura: "FC-004", proveedor: "Envases del Norte", fecha: "2026-05-25", total: 2100, estado: "completada" },
  { id: 5, factura: "FC-005", proveedor: "Etiquetas Premium", fecha: "2026-05-26", total: 1500, estado: "pendiente" },
  { id: 6, factura: "FC-006", proveedor: "Distribuidora ABC", fecha: "2026-05-27", total: 4300, estado: "completada" },
];

export function Compras() {
  const [compras, setCompras] = useState(mockCompras);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedCompra, setSelectedCompra] = useState<any>(null);
  const [filtroProveedor, setFiltroProveedor] = useState<string>("todos");

  const columns = [
    { key: "factura", label: "Factura" },
    { key: "proveedor", label: "Proveedor" },
    { key: "fecha", label: "Fecha" },
    {
      key: "total",
      label: "Total",
      render: (value: number) => (
        <span style={{ color: "#0F172A", fontWeight: 600 }}>
          ${value.toLocaleString()}
        </span>
      ),
    },
    {
      key: "estado",
      label: "Estado",
      render: (value: string) => (
        <Badge
          style={{
            backgroundColor: value === "completada" ? "#22C55E" : "#F59E0B",
            color: "#FFFFFF",
          }}
        >
          {value}
        </Badge>
      ),
    },
  ];

  const handleAdd = () => {
    setSelectedCompra(null);
    setShowDialog(true);
  };

  const handleEdit = (compra: any) => {
    setSelectedCompra(compra);
    setShowDialog(true);
  };

  const handleDelete = (compra: any) => {
    setCompras(compras.filter((c) => c.id !== compra.id));
  };

  const dataFiltrada = filtroProveedor === "todos"
    ? compras
    : compras.filter((c) => c.proveedor === filtroProveedor);

  const filters = (
    <Select value={filtroProveedor} onValueChange={setFiltroProveedor}>
      <SelectTrigger className="w-[200px]" style={{ backgroundColor: "#FFFFFF" }}>
        <SelectValue placeholder="Filtrar por proveedor" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="todos">Todos los proveedores</SelectItem>
        <SelectItem value="Distribuidora ABC">Distribuidora ABC</SelectItem>
        <SelectItem value="Insumos XYZ">Insumos XYZ</SelectItem>
        <SelectItem value="Materias Primas S.A.">Materias Primas S.A.</SelectItem>
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
        searchPlaceholder="Buscar compras..."
        filters={filters}
      />

      {/* Dialog para agregar/editar */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle style={{ color: "#0F172A" }}>
              {selectedCompra ? "Editar Compra" : "Registrar Compra"}
            </DialogTitle>
            <DialogDescription style={{ color: "#64748B" }}>
              Complete los detalles de la compra
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Número de Factura</Label>
              <Input placeholder="FC-001" style={{ backgroundColor: "#FFFFFF" }} />
            </div>
            <div>
              <Label>Proveedor</Label>
              <Select>
                <SelectTrigger style={{ backgroundColor: "#FFFFFF" }}>
                  <SelectValue placeholder="Seleccionar proveedor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Distribuidora ABC</SelectItem>
                  <SelectItem value="2">Insumos XYZ</SelectItem>
                  <SelectItem value="3">Materias Primas S.A.</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Fecha</Label>
                <Input type="date" style={{ backgroundColor: "#FFFFFF" }} />
              </div>
              <div>
                <Label>Total</Label>
                <Input type="number" placeholder="0.00" style={{ backgroundColor: "#FFFFFF" }} />
              </div>
            </div>
            <div>
              <Label>Cargar Factura (PDF/Imagen)</Label>
              <div
                className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors"
                style={{ borderColor: "#E2E8F0" }}
              >
                <Upload className="w-8 h-8 mx-auto mb-2" style={{ color: "#64748B" }} />
                <p className="text-sm" style={{ color: "#64748B" }}>
                  Click para cargar o arrastra el archivo aquí
                </p>
                <p className="text-xs mt-1" style={{ color: "#64748B" }}>
                  PDF, PNG, JPG (máx. 5MB)
                </p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Cancelar
            </Button>
            <Button style={{ backgroundColor: "#2563EB", color: "#FFFFFF" }}>
              {selectedCompra ? "Actualizar" : "Registrar Compra"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
