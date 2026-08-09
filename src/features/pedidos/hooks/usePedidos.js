import { useState, useEffect } from 'react';
import { getPedidos, deletePedido } from '../services/pedidosService';

export function usePedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, id: null, nombre: '' });
  const [isDeleting, setIsDeleting] = useState(false);
  const [toast, setToast] = useState({ isOpen: false, type: 'success', message: '' });

  useEffect(() => {
    getPedidos().then((data) => setPedidos(data));
  }, []);

  const handleDelete = async () => {
    setIsDeleting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    await deletePedido(deleteDialog.id);
    setPedidos(pedidos.filter(p => p.id !== deleteDialog.id));
    setIsDeleting(false);
    setDeleteDialog({ isOpen: false, id: null, nombre: '' });
    setToast({ isOpen: true, type: 'success', message: 'Pedido eliminado correctamente' });
  };

  return {
    pedidos,
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
