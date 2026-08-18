import { useState, useEffect } from 'react';
import { getPedidos, deletePedido } from '../services/pedidosService';

export function usePedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [estadoFilter, setEstadoFilter] = useState('Todos');
  const [showModal, setShowModal] = useState(false);
  const [detailModal, setDetailModal] = useState({ isOpen: false, data: null });
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, id: null, nombre: '' });
  const [isDeleting, setIsDeleting] = useState(false);
  const [toast, setToast] = useState({ isOpen: false, type: 'success', message: '' });

  useEffect(() => {
    getPedidos().then((data) => setPedidos(data));
  }, []);

  const filteredPedidos = pedidos.filter((p) => {
    const matchesSearch =
      p.codigo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.cliente.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.itemsResumen.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesEstado = estadoFilter === 'Todos' || p.estado === estadoFilter;
    return matchesSearch && matchesEstado;
  });

  const handleDelete = async () => {
    if (!deleteDialog.id) return;
    setIsDeleting(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    await deletePedido(deleteDialog.id);
    setPedidos((prev) => prev.filter((p) => p.id !== deleteDialog.id));
    setIsDeleting(false);
    setDeleteDialog({ isOpen: false, id: null, nombre: '' });
    setToast({ isOpen: true, type: 'success', message: 'Pedido eliminado correctamente' });
  };

  return {
    pedidos: filteredPedidos,
    rawPedidos: pedidos,
    searchQuery,
    setSearchQuery,
    estadoFilter,
    setEstadoFilter,
    showModal,
    setShowModal,
    detailModal,
    setDetailModal,
    deleteDialog,
    setDeleteDialog,
    isDeleting,
    toast,
    setToast,
    handleDelete,
  };
}

