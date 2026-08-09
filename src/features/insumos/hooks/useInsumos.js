import { useState, useEffect } from 'react';
import { getInsumos, deleteInsumo } from '../services/insumosService';

export function useInsumos() {
  const [insumos, setInsumos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, id: null, nombre: '' });
  const [isDeleting, setIsDeleting] = useState(false);
  const [toast, setToast] = useState({ isOpen: false, type: 'success', message: '' });

  useEffect(() => {
    getInsumos().then((data) => setInsumos(data));
  }, []);

  const handleDelete = async () => {
    if (!deleteDialog.id) return;
    setIsDeleting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await deleteInsumo(deleteDialog.id);
    setInsumos((prev) => prev.filter((i) => i.id !== deleteDialog.id));
    setIsDeleting(false);
    setDeleteDialog({ isOpen: false, id: null, nombre: '' });
    setToast({ isOpen: true, type: 'success', message: 'Insumo eliminado correctamente' });
  };

  return {
    insumos,
    showModal,
    setShowModal,
    deleteDialog,
    setDeleteDialog,
    isDeleting,
    toast,
    setToast,
    handleDelete,
  };
}
