import { useState } from "react";
import { usePagination } from "../hooks/usePagination";
import { PaginationControls } from "./PaginationControls";
import { RowActions } from "./RowActions";
import ConfirmDialog from "./ConfirmDialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Input } from "../ui/input";
import { Search, Plus } from "lucide-react";

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
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, row: null });

  const filteredData = data.filter((row) =>
    Object.values(row).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const pagination = usePagination(filteredData);

  const hasRowActions = Boolean(onEdit || onDelete || onView);

  const handleConfirmDelete = () => {
    if (onDelete && deleteDialog.row) {
      onDelete(deleteDialog.row);
    }
    setDeleteDialog({ isOpen: false, row: null });
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex-1 flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-card border-border"
            />
          </div>
          {filters}
        </div>
        {onAdd && (
          <button
            type="button"
            onClick={onAdd}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            Agregar
          </button>
        )}
      </div>

      {/* Table */}
      <div className="records-table-shell bg-card rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted text-muted-foreground font-semibold">
              {columns.map((column) => (
                <TableHead key={column.key} className="px-6 py-3 font-semibold text-foreground">
                  {column.label}
                </TableHead>
              ))}
              {hasRowActions && (
                <TableHead className="px-6 py-3 font-semibold text-foreground">Acciones</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-border">
            {pagination.paginatedData.length > 0 ? (
              pagination.paginatedData.map((row, index) => (
                <TableRow key={index} className="hover:bg-muted/50 transition-colors">
                  {columns.map((column) => (
                    <TableCell key={column.key} className="px-6 py-4">
                      {column.render
                        ? column.render(row[column.key], row)
                        : row[column.key]}
                    </TableCell>
                  ))}
                  {hasRowActions && (
                    <TableCell className="px-6 py-4">
                      <RowActions
                        onView={onView ? () => onView(row) : undefined}
                        onEdit={onEdit ? () => onEdit(row) : undefined}
                        onDelete={
                          onDelete
                            ? () => setDeleteDialog({ isOpen: true, row })
                            : undefined
                        }
                      />
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (hasRowActions ? 1 : 0)}
                  className="px-6 py-8 text-center text-muted-foreground"
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
      {hasRowActions && (
        <ConfirmDialog
          isOpen={deleteDialog.isOpen}
          title="Confirmar Eliminación"
          message="¿Estás seguro de que deseas eliminar este registro? Esta acción no se puede deshacer."
          confirmText="Eliminar"
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteDialog({ isOpen: false, row: null })}
        />
      )}
    </div>
  );
}
