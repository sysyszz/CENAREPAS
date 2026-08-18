import { useState, useEffect } from 'react';
import { getFichasTecnicas, deleteFichaTecnica } from '../services/fichasTecnicasService';

export function useFichasTecnicas() {
  const [fichas, setFichas] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [estadoFilter, setEstadoFilter] = useState('Todos');
  const [showModal, setShowModal] = useState(false);
  const [detailModal, setDetailModal] = useState({ isOpen: false, data: null });
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, id: null, nombre: '' });
  const [isDeleting, setIsDeleting] = useState(false);
  const [toast, setToast] = useState({ isOpen: false, type: 'success', message: '' });

  useEffect(() => {
    getFichasTecnicas().then((data) => setFichas(data));
  }, []);

  const filteredFichas = fichas.filter((f) => {
    const matchesSearch =
      f.producto.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.codigo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.insumosClave.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesEstado = estadoFilter === 'Todos' || f.estado === estadoFilter;
    return matchesSearch && matchesEstado;
  });

  const handleDelete = async () => {
    if (!deleteDialog.id) return;
    setIsDeleting(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    await deleteFichaTecnica(deleteDialog.id);
    setFichas((prev) => prev.filter((f) => f.id !== deleteDialog.id));
    setIsDeleting(false);
    setDeleteDialog({ isOpen: false, id: null, nombre: '' });
    setToast({ isOpen: true, type: 'success', message: 'Ficha técnica eliminada correctamente' });
  };

  return {
    fichas: filteredFichas,
    rawFichas: fichas,
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

