import { useState, useEffect } from 'react';
import { getFichasTecnicas, deleteFichaTecnica } from '../services/fichasTecnicasService';

export function useFichasTecnicas() {
  const [fichas, setFichas] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, id: null, nombre: '' });
  const [isDeleting, setIsDeleting] = useState(false);
  const [toast, setToast] = useState({ isOpen: false, type: 'success', message: '' });

  useEffect(() => {
    getFichasTecnicas().then((data) => setFichas(data));
  }, []);

  const handleDelete = async () => {
    if (!deleteDialog.id) return;
    setIsDeleting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await deleteFichaTecnica(deleteDialog.id);
    setFichas((prev) => prev.filter((f) => f.id !== deleteDialog.id));
    setIsDeleting(false);
    setDeleteDialog({ isOpen: false, id: null, nombre: '' });
    setToast({ isOpen: true, type: 'success', message: 'Ficha técnica eliminada correctamente' });
  };

  return {
    fichas,
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
