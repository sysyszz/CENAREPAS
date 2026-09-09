import { useState } from 'react';
import { motion } from 'framer-motion';
import { usePagination } from '../../../shared/hooks/usePagination';
import { PaginationControls } from '../../../shared/components/PaginationControls';
import { SearchFilterBar } from '../../../shared/components/SearchFilterBar';
import ConfirmDialog from '../../../shared/components/ConfirmDialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../shared/ui/table';
import { EmptyState } from '../../../shared/components/EmptyState';
import { TableSkeletonRows } from '../../../shared/components/Skeleton';
import { Plus, Eye, Edit, Trash2 } from 'lucide-react';

export function ProductosTable({
  columns,
  data = [],
  isLoading = false,
  onAdd,
  addLabel = 'Nuevo Producto',
  addDisabled = false,
  onEdit,
  onDelete,
  onView,
  searchPlaceholder = 'Buscar por código o producto...',
  filters,
  searchValue,
  onSearchChange,
  emptyIcon,
  emptyTitle,
  emptyDescription,
  entityName = 'productos',
  isFiltered,
  editDisabled = false,
  deleteDisabled = false,
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
      {/* Header con SearchFilterBar y Botón Nuevo */}
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
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg hover:opacity-90 text-sm font-medium transition-all shrink-0 shadow-xs h-10 disabled:opacity-50 hover:shadow-sm"
          >
            <Plus className="w-4 h-4" />
            {addLabel}
          </button>
        )}
      </div>

      {/* Table con animaciones escalonadas y hover estilizado */}
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
                  key={row.id_producto || index}
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
                      <div className="flex items-center gap-1">
                        {onView && (
                          <button
                            type="button"
                            onClick={() => onView(row)}
                            className="inline-flex items-center justify-center p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/10 transition-all duration-150 cursor-pointer"
                            title="Ver detalle"
                            aria-label="Ver detalle"
                          >
                            <Eye className="w-4 h-4 shrink-0" />
                          </button>
                        )}
                        {onEdit && (
                          <button
                            type="button"
                            onClick={() => onEdit(row)}
                            disabled={editDisabled}
                            className="inline-flex items-center justify-center p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/10 transition-all duration-150 disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
                            title="Editar"
                            aria-label="Editar"
                          >
                            <Edit className="w-4 h-4 shrink-0" />
                          </button>
                        )}
                        {onDelete && (
                          <button
                            type="button"
                            onClick={() => setDeleteDialog({ isOpen: true, row })}
                            disabled={deleteDisabled}
                            className="inline-flex items-center justify-center p-1.5 rounded-full text-destructive hover:bg-destructive/10 transition-all duration-150 disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
                            title="Eliminar"
                            aria-label="Eliminar"
                          >
                            <Trash2 className="w-4 h-4 shrink-0" />
                          </button>
                        )}
                      </div>
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

export default ProductosTable;
