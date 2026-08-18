import { useState, useEffect } from 'react';
import { getClientes, deleteCliente } from '../services/clientesService';

export function useClientes() {
  const [clientes, setClientes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [estadoFilter, setEstadoFilter] = useState('Todos');
  const [showModal, setShowModal] = useState(false);
  const [detailModal, setDetailModal] = useState({ isOpen: false, data: null });
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, id: null, nombre: '' });
  const [isDeleting, setIsDeleting] = useState(false);
  const [toast, setToast] = useState({ isOpen: false, type: 'success', message: '' });

  useEffect(() => {
    getClientes().then((data) => setClientes(data));
  }, []);

  const filteredClientes = clientes.filter((c) => {
    const matchesSearch =
      c.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.codigo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.ciudad.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.nit.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesEstado = estadoFilter === 'Todos' || c.estado === estadoFilter;
    return matchesSearch && matchesEstado;
  });

  const handleDelete = async () => {
    if (!deleteDialog.id) return;
    setIsDeleting(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    await deleteCliente(deleteDialog.id);
    setClientes((prev) => prev.filter((c) => c.id !== deleteDialog.id));
    setIsDeleting(false);
    setDeleteDialog({ isOpen: false, id: null, nombre: '' });
    setToast({ isOpen: true, type: 'success', message: 'Cliente eliminado correctamente' });
  };

  return {
    clientes: filteredClientes,
    rawClientes: clientes,
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

