import { useState } from "react";
import { usePagination } from "../hooks/usePagination";
import { PaginationControls } from "./PaginationControls";
import SearchBar from "./SearchBar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
} from "lucide-react";

export function DataTable({
  columns,
  data = [],
  onAdd,
  onEdit,
  onDelete,
  onView,
  searchPlaceholder = "Buscar...",
  title,
  filters,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const filteredData = data.filter((row) =>
    Object.values(row).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const pagination = usePagination(filteredData);

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
          <SearchBar
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={searchPlaceholder}
            wrapperClassName="flex-1 max-w-sm"
            inputClassName="bg-white border-slate-200"
          />
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
            {pagination.paginatedData.length > 0 ? (
              pagination.paginatedData.map((row, index) => (
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
      <PaginationControls {...pagination} />

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
