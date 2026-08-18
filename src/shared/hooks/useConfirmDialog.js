import { useState, useCallback } from 'react';

export function useConfirmDialog() {
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, id: null, nombre: '' });
  const [isDeleting, setIsDeleting] = useState(false);

  const openDeleteDialog = useCallback((id, nombre = '') => {
    setDeleteDialog({ isOpen: true, id, nombre });
  }, []);

  const closeDeleteDialog = useCallback(() => {
    setDeleteDialog({ isOpen: false, id: null, nombre: '' });
  }, []);

  return {
    deleteDialog,
    setDeleteDialog,
    isDeleting,
    setIsDeleting,
    openDeleteDialog,
    closeDeleteDialog,
  };
}
