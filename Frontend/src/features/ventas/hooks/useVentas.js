import { useState, useEffect } from 'react';
import { getVentas, updateVenta } from '../services/ventasService';

export function useVentas() {
  const [ventas, setVentas] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, id: null, nombre: '' });
  const [isDeleting, setIsDeleting] = useState(false);
  const [toast, setToast] = useState({ isOpen: false, type: 'success', message: '' });

  useEffect(() => {
    getVentas().then((data) => setVentas(data));
  }, []);

  const handleAnular = async () => {
    setIsDeleting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    await updateVenta(deleteDialog.id, { estado: 'anulada' });
    setVentas(ventas.map(v => v.id_venta === deleteDialog.id ? { ...v, estado: 'anulada' } : v));
    setIsDeleting(false);
    setDeleteDialog({ isOpen: false, id: null, nombre: '' });
    setToast({ isOpen: true, type: 'success', message: 'Venta anulada correctamente' });
  };

  return {
    ventas,
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
