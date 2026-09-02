import { useState } from 'react';
import { usePagination } from '../hooks/usePagination';
import { PaginationControls } from './PaginationControls';
import { SearchFilterBar } from './SearchFilterBar';
import { RowActions } from './RowActions';
import ConfirmDialog from './ConfirmDialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { Plus } from 'lucide-react';

export function DataTable({
  columns,
  data = [],
  onAdd,
  onEdit,
  onDelete,
  onView,
  searchPlaceholder = 'Buscar...',
  title,
  filters,
  searchValue,
  onSearchChange,
}) {
  const [internalSearchTerm, setInternalSearchTerm] = useState('');
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, row: null });

  const isControlled = searchValue !== undefined;
  const searchTerm = isControlled ? searchValue : internalSearchTerm;

  const handleSearchChange = (e) => {
    const val = e.target.value;
    if (isControlled) {
      onSearchChange?.(val);
    } else {
      setInternalSearchTerm(val);
    }
  };

  const filteredData = isControlled
    ? data
    : data.filter((row) =>
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
      {/* Header con SearchFilterBar compartido */}
      <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
        <div className="flex-1">
          <SearchFilterBar
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={handleSearchChange}
          >
            {filters}
          </SearchFilterBar>
        </div>
        {onAdd && (
          <button
            type="button"
            onClick={onAdd}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg hover:opacity-90 text-sm font-medium transition-colors shrink-0 shadow-xs h-10"
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

      {/* Pagination con PaginationControls compartido */}
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
