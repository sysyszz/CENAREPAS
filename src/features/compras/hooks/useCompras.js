import { useState, useEffect } from 'react';
import { getCompras, anularCompra } from '../services/comprasService';

export function useCompras() {
  const [compras, setCompras] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, id: null, nombre: '' });
  const [isDeleting, setIsDeleting] = useState(false);
  const [toast, setToast] = useState({ isOpen: false, type: 'success', message: '' });

  useEffect(() => {
    getCompras().then((data) => setCompras(data));
  }, []);

  const handleAnular = async () => {
    if (!deleteDialog.id) return;
    setIsDeleting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await anularCompra(deleteDialog.id);
    setCompras((prev) => prev.map((c) => (c.id === deleteDialog.id ? { ...c, estado: 'Anulada' } : c)));
    setIsDeleting(false);
    setDeleteDialog({ isOpen: false, id: null, nombre: '' });
    setToast({ isOpen: true, type: 'success', message: 'Compra anulada correctamente' });
  };

  return {
    compras,
    showModal,
    setShowModal,
    deleteDialog,
    setDeleteDialog,
    isDeleting,
    toast,
    setToast,
    handleAnular,
  };
}
