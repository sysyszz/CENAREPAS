import { useState, useEffect } from 'react';
import { getLotes, anularLote } from '../services/produccionService';

export function useProduccion() {
  const [lotes, setLotes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [estadoFilter, setEstadoFilter] = useState('Todos');
  const [showModal, setShowModal] = useState(false);
  const [detailModal, setDetailModal] = useState({ isOpen: false, data: null });
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, id: null, nombre: '' });
  const [isDeleting, setIsDeleting] = useState(false);
  const [toast, setToast] = useState({ isOpen: false, type: 'success', message: '' });

  useEffect(() => {
    getLotes().then((data) => setLotes(data));
  }, []);

  const filteredLotes = lotes.filter((l) => {
    const matchesSearch =
      String(l.id_lote).includes(searchQuery.toLowerCase()) ||
      String(l.id_ficha).includes(searchQuery.toLowerCase()) ||
      String(l.id_usuario_responsable).includes(searchQuery.toLowerCase());
    const matchesEstado = estadoFilter === 'Todos' || l.estado === estadoFilter;
    return matchesSearch && matchesEstado;
  });

  const handleAnular = async () => {
    if (!deleteDialog.id) return;
    setIsDeleting(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    await anularLote(deleteDialog.id);
    setLotes((prev) => prev.map((l) => (l.id_lote === deleteDialog.id ? { ...l, estado: 'anulado' } : l)));
    setIsDeleting(false);
    setDeleteDialog({ isOpen: false, id: null, nombre: '' });
    setToast({ isOpen: true, type: 'success', message: 'Lote de producción anulado correctamente' });
  };

  return {
    lotes: filteredLotes,
    rawLotes: lotes,
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

