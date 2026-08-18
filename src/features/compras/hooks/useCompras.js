import { useState, useEffect } from 'react';
import { getCompras, anularCompra } from '../services/comprasService';

export function useCompras() {
  const [compras, setCompras] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [estadoFilter, setEstadoFilter] = useState('Todos');
  const [showModal, setShowModal] = useState(false);
  const [detailModal, setDetailModal] = useState({ isOpen: false, data: null });
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, id: null, nombre: '' });
  const [isDeleting, setIsDeleting] = useState(false);
  const [toast, setToast] = useState({ isOpen: false, type: 'success', message: '' });

  useEffect(() => {
    getCompras().then((data) => setCompras(data));
  }, []);

  const filteredCompras = compras.filter((c) => {
    const matchesSearch =
      c.codigo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.proveedor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.insumo.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesEstado = estadoFilter === 'Todos' || c.estado === estadoFilter;
    return matchesSearch && matchesEstado;
  });

  const handleAnular = async () => {
    if (!deleteDialog.id) return;
    setIsDeleting(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    await anularCompra(deleteDialog.id);
    setCompras((prev) => prev.map((c) => (c.id === deleteDialog.id ? { ...c, estado: 'Anulada' } : c)));
    setIsDeleting(false);
    setDeleteDialog({ isOpen: false, id: null, nombre: '' });
    setToast({ isOpen: true, type: 'success', message: 'Orden de compra anulada correctamente' });
  };

  return {
    compras: filteredCompras,
    rawCompras: compras,
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
    handleAnular,
  };
}

