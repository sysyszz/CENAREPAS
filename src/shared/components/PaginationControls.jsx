import { ChevronLeft, ChevronRight } from 'lucide-react';

export function PaginationControls({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  goToPage,
  nextPage,
  prevPage,
}) {
  const start = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const end = Math.min(currentPage * itemsPerPage, totalItems);
  const visiblePages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <div className="flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between">
      <p className="text-muted-foreground">
        Mostrando {start}-{end} de {totalItems} resultados
      </p>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={prevPage}
          disabled={currentPage === 1}
          aria-label="Página anterior"
          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border bg-background text-foreground transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-50"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        {visiblePages.map((page) => (
          <button
            type="button"
            key={page}
            onClick={() => goToPage(page)}
            aria-label={`Página ${page}`}
            aria-current={currentPage === page ? 'page' : undefined}
            className={`inline-flex h-8 w-8 items-center justify-center rounded-md border border-border text-sm transition-colors ${currentPage === page ? 'border-primary bg-primary text-primary-foreground' : 'bg-background text-foreground hover:bg-muted'}`}
          >
            {page}
          </button>
        ))}
        <button
          type="button"
          onClick={nextPage}
          disabled={currentPage === totalPages}
          aria-label="Página siguiente"
          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border bg-background text-foreground transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-50"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}