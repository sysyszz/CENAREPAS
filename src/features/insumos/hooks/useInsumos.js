import { useState, useEffect } from 'react';
import { getInsumos, deleteInsumo } from '../services/insumosService';

export function useInsumos() {
  const [insumos, setInsumos] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoriaFilter, setCategoriaFilter] = useState('Todas');
  const [estadoFilter, setEstadoFilter] = useState('Todos');
  const [showModal, setShowModal] = useState(false);
  const [detailModal, setDetailModal] = useState({ isOpen: false, data: null });
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, id: null, nombre: '' });
  const [isDeleting, setIsDeleting] = useState(false);
  const [toast, setToast] = useState({ isOpen: false, type: 'success', message: '' });

  useEffect(() => {
    getInsumos().then((data) => setInsumos(data));
  }, []);

  const filteredInsumos = insumos.filter((i) => {
    const matchesSearch =
      i.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.codigo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.proveedor.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = categoriaFilter === 'Todas' || i.categoria === categoriaFilter;
    const matchesEstado = estadoFilter === 'Todos' || i.estado === estadoFilter;
    return matchesSearch && matchesCat && matchesEstado;
  });

  const handleDelete = async () => {
    if (!deleteDialog.id) return;
    setIsDeleting(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    await deleteInsumo(deleteDialog.id);
    setInsumos((prev) => prev.filter((i) => i.id !== deleteDialog.id));
    setIsDeleting(false);
    setDeleteDialog({ isOpen: false, id: null, nombre: '' });
    setToast({ isOpen: true, type: 'success', message: 'Insumo eliminado correctamente' });
  };

  return {
    insumos: filteredInsumos,
    rawInsumos: insumos,
    searchQuery,
    setSearchQuery,
    categoriaFilter,
    setCategoriaFilter,
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

