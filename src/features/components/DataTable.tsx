import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Badge } from "./ui/badge";
import {
  Search,
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
  Filter,
} from "lucide-react";

interface Column {
  key: string;
  label: string;
  render?: (value: any, row: any) => React.ReactNode;
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  onAdd?: () => void;
  onEdit?: (row: any) => void;
  onDelete?: (row: any) => void;
  onView?: (row: any) => void;
  searchPlaceholder?: string;
  title?: string;
  filters?: React.ReactNode;
}

export function DataTable({
  columns,
  data,
  onAdd,
  onEdit,
  onDelete,
  onView,
  searchPlaceholder = "Buscar...",
  title,
  filters,
}: DataTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const itemsPerPage = 10;

  const filteredData = data.filter((row) =>
    Object.values(row).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDelete = () => {
    if (onDelete && selectedRow) {
      onDelete(selectedRow);
    }
    setShowDeleteDialog(false);
    setSelectedRow(null);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex-1 flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative flex-1 max-w-sm">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
              style={{ color: "#64748B" }}
            />
            <Input
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              style={{ backgroundColor: "#FFFFFF", borderColor: "#E2E8F0" }}
            />
          </div>
          {filters}
        </div>
        {onAdd && (
          <Button
            onClick={onAdd}
            className="text-white"
            style={{ backgroundColor: "#2563EB" }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Agregar
          </Button>
        )}
      </div>

      {/* Table */}
      <div
        className="rounded-lg border overflow-hidden"
        style={{ backgroundColor: "#FFFFFF", borderColor: "#E2E8F0" }}
      >
        <Table>
          <TableHeader>
            <TableRow style={{ backgroundColor: "#F8FAFC" }}>
              {columns.map((column) => (
                <TableHead key={column.key} style={{ color: "#0F172A", fontWeight: 600 }}>
                  {column.label}
                </TableHead>
              ))}
              {(onEdit || onDelete || onView) && (
                <TableHead style={{ color: "#0F172A", fontWeight: 600 }}>Acciones</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row, index) => (
                <TableRow key={index}>
                  {columns.map((column) => (
                    <TableCell key={column.key} style={{ color: "#0F172A" }}>
                      {column.render
                        ? column.render(row[column.key], row)
                        : row[column.key]}
                    </TableCell>
                  ))}
                  {(onEdit || onDelete || onView) && (
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {onView && (
                            <DropdownMenuItem onClick={() => onView(row)}>
                              <Eye className="w-4 h-4 mr-2" />
                              Ver Detalle
                            </DropdownMenuItem>
                          )}
                          {onEdit && (
                            <DropdownMenuItem onClick={() => onEdit(row)}>
                              <Edit className="w-4 h-4 mr-2" />
                              Editar
                            </DropdownMenuItem>
                          )}
                          {onDelete && (
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedRow(row);
                                setShowDeleteDialog(true);
                              }}
                              style={{ color: "#EF4444" }}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Eliminar
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length + 1}
                  className="text-center py-8"
                  style={{ color: "#64748B" }}
                >
                  No se encontraron resultados
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm" style={{ color: "#64748B" }}>
            Mostrando {(currentPage - 1) * itemsPerPage + 1} -{" "}
            {Math.min(currentPage * itemsPerPage, filteredData.length)} de{" "}
            {filteredData.length} registros
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="icon"
                  onClick={() => setCurrentPage(page)}
                  style={
                    currentPage === page
                      ? { backgroundColor: "#2563EB", color: "#FFFFFF" }
                      : {}
                  }
                >
                  {page}
                </Button>
              ))}
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle style={{ color: "#0F172A" }}>Confirmar Eliminación</DialogTitle>
            <DialogDescription style={{ color: "#64748B" }}>
              ¿Estás seguro de que deseas eliminar este registro? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleDelete}
              style={{ backgroundColor: "#EF4444", color: "#FFFFFF" }}
            >
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
