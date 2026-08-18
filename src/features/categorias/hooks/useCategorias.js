import { useState, useEffect } from 'react';
import { getCategorias, deleteCategoria } from '../services/categoriasService';

export function useCategorias() {
  const [categorias, setCategorias] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [estadoFilter, setEstadoFilter] = useState('Todos');
  const [showModal, setShowModal] = useState(false);
  const [detailModal, setDetailModal] = useState({ isOpen: false, data: null });
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, id: null, nombre: '' });
  const [isDeleting, setIsDeleting] = useState(false);
  const [toast, setToast] = useState({ isOpen: false, type: 'success', message: '' });

  useEffect(() => {
    getCategorias().then((data) => setCategorias(data));
  }, []);

  const filteredCategorias = categorias.filter((c) => {
    const matchesSearch =
      c.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.codigo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.descripcion.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesEstado = estadoFilter === 'Todos' || c.estado === estadoFilter;
    return matchesSearch && matchesEstado;
  });

  const handleDelete = async () => {
    if (!deleteDialog.id) return;
    setIsDeleting(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    await deleteCategoria(deleteDialog.id);
    setCategorias((prev) => prev.filter((c) => c.id !== deleteDialog.id));
    setIsDeleting(false);
    setDeleteDialog({ isOpen: false, id: null, nombre: '' });
    setToast({ isOpen: true, type: 'success', message: 'Categoría eliminada correctamente' });
  };

  return {
    categorias: filteredCategorias,
    rawCategorias: categorias,
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

