import { useEffect, useMemo, useState } from 'react';

export function usePagination(data = [], itemsPerPage = 10) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(data.length / itemsPerPage));
  const dataSignature = data
    .map((item) => {
      if (item && typeof item === 'object') {
        return item.id ?? JSON.stringify(item);
      }
      return String(item);
    })
    .join('|');

  useEffect(() => {
    setCurrentPage(1);
  }, [dataSignature, itemsPerPage]);

  useEffect(() => {
    setCurrentPage((page) => Math.min(page, totalPages));
  }, [totalPages]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return data.slice(start, start + itemsPerPage);
  }, [data, currentPage, itemsPerPage]);

  const goToPage = (page) => {
    const pageNumber = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(pageNumber);
  };

  const nextPage = () => goToPage(currentPage + 1);
  const prevPage = () => goToPage(currentPage - 1);

  return {
    currentPage,
    totalPages,
    paginatedData,
    goToPage,
    nextPage,
    prevPage,
    totalItems: data.length,
    itemsPerPage,
  };
}
