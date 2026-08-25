import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage = 10,
  onPageChange,
  onNextPage,
  onPrevPage,
  className = '',
  showSummary = true,
}) {
  const safeCurrentPage = Math.max(1, currentPage || 1);
  const safeTotalPages = Math.max(1, totalPages || 1);
  const start = totalItems === 0 ? 0 : (safeCurrentPage - 1) * itemsPerPage + 1;
  const end = Math.min(safeCurrentPage * itemsPerPage, totalItems);

  const goToPage = (page) => {
    const normalizedPage = Math.max(1, Math.min(page, safeTotalPages));
    onPageChange?.(normalizedPage);
  };

  const handlePrevPage = () => {
    if (safeCurrentPage > 1) {
      onPrevPage?.();
      goToPage(safeCurrentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (safeCurrentPage < safeTotalPages) {
      onNextPage?.();
      goToPage(safeCurrentPage + 1);
    }
  };

  return (
    <div className={`flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between ${className}`.trim()}>
      {showSummary && (
        <p className="text-muted-foreground">
          Mostrando {start}-{end} de {totalItems} resultados
        </p>
      )}
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={handlePrevPage}
          disabled={safeCurrentPage === 1}
          aria-label="Página anterior"
          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border bg-background text-foreground transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-50"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {Array.from({ length: safeTotalPages }, (_, index) => index + 1).map((page) => (
          <button
            type="button"
            key={page}
            onClick={() => goToPage(page)}
            aria-label={`Página ${page}`}
            aria-current={safeCurrentPage === page ? 'page' : undefined}
            className={`inline-flex h-8 w-8 items-center justify-center rounded-md border border-border text-sm transition-colors ${safeCurrentPage === page ? 'border-primary bg-primary text-primary-foreground' : 'bg-background text-foreground hover:bg-muted'}`}
          >
            {page}
          </button>
        ))}

        <button
          type="button"
          onClick={handleNextPage}
          disabled={safeCurrentPage === safeTotalPages}
          aria-label="Página siguiente"
          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border bg-background text-foreground transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-50"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
