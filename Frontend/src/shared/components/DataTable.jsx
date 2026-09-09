import { useState } from 'react';
import { motion } from 'framer-motion';
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
import { EmptyState } from './EmptyState';
import { TableSkeletonRows } from './Skeleton';
import { Plus } from 'lucide-react';

export function DataTable({
  columns,
  data = [],
  isLoading = false,
  onAdd,
  addLabel = 'Nuevo Registro',
  addDisabled = false,
  onEdit,
  onDelete,
  onView,
  searchPlaceholder = 'Buscar...',
  title,
  filters,
  searchValue,
  onSearchChange,
  emptyIcon,
  emptyTitle,
  emptyDescription,
  entityName = 'registros',
  isFiltered,
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

  const computedIsFiltered = isFiltered !== undefined ? isFiltered : Boolean(searchTerm && searchTerm.trim() !== '');

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
            disabled={addDisabled}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg hover:opacity-90 text-sm font-medium transition-colors shrink-0 shadow-xs h-10 disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
            {addLabel}
          </button>
        )}
      </div>

      {/* Table */}
      <div className="records-table-shell bg-card rounded-xl border border-border overflow-hidden shadow-xs">
        <Table className="min-w-[600px] w-full">
          <TableHeader>
            <TableRow className="bg-muted text-muted-foreground font-semibold">
              {columns.map((column) => (
                <TableHead key={column.key} className="px-3 sm:px-6 py-3 font-semibold text-foreground">
                  {column.label}
                </TableHead>
              ))}
              {hasRowActions && (
                <TableHead className="px-3 sm:px-6 py-3 font-semibold text-foreground">Acciones</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-border">
            {isLoading ? (
              <TableSkeletonRows
                columnsCount={columns.length}
                rowsCount={5}
                hasRowActions={hasRowActions}
              />
            ) : pagination.paginatedData.length > 0 ? (
              pagination.paginatedData.map((row, index) => (
                <motion.tr
                  key={index}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: index * 0.04, ease: 'easeOut' }}
                  className="hover:bg-[#C1502D]/[0.04] dark:hover:bg-[#C1502D]/10 transition-colors duration-150 border-b border-border/80"
                >
                  {columns.map((column) => (
                    <TableCell key={column.key} className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm">
                      {column.render
                        ? column.render(row[column.key], row)
                        : row[column.key]}
                    </TableCell>
                  ))}
                  {hasRowActions && (
                    <TableCell className="px-3 sm:px-6 py-3 sm:py-4">
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
                </motion.tr>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (hasRowActions ? 1 : 0)}
                  className="p-0"
                >
                  <EmptyState
                    icon={emptyIcon}
                    title={emptyTitle}
                    description={emptyDescription}
                    isFiltered={computedIsFiltered}
                    entityName={entityName}
                    onAdd={onAdd}
                    addLabel={addLabel}
                    addDisabled={addDisabled}
                  />
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
