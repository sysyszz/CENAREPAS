import { useState, useEffect } from 'react';
import { getLotes, anularLote } from '../services/produccionService';

export function useProduccion() {
  const [lotes, setLotes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, id: null, nombre: '' });
  const [isDeleting, setIsDeleting] = useState(false);
  const [toast, setToast] = useState({ isOpen: false, type: 'success', message: '' });

  useEffect(() => {
    getLotes().then((data) => setLotes(data));
  }, []);

  const handleAnular = async () => {
    if (!deleteDialog.id) return;
    setIsDeleting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await anularLote(deleteDialog.id);
    setLotes((prev) => prev.map((l) => (l.id === deleteDialog.id ? { ...l, estado: 'Anulado' } : l)));
    setIsDeleting(false);
    setDeleteDialog({ isOpen: false, id: null, nombre: '' });
    setToast({ isOpen: true, type: 'success', message: 'Lote anulado correctamente' });
  };

  return {
    lotes,
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
