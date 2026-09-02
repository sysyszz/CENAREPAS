import { useState, useEffect, useMemo } from 'react';
import { getLotes, createLote, updateLote, anularLote } from '../services/produccionService';

export function useProduccion() {
  const [lotes, setLotes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [estadoFilter, setEstadoFilter] = useState('Todos');
  const [showModal, setShowModal] = useState(false);
  const [detailModal, setDetailModal] = useState({ isOpen: false, data: null });
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, id: null, nombre: '' });
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState({ isOpen: false, type: 'success', message: '' });

  useEffect(() => {
    getLotes().then((data) => setLotes(data));
  }, []);

  const filteredLotes = useMemo(() => {
    return lotes.filter((l) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        String(l.id_lote).toLowerCase().includes(q) ||
        String(l.id_ficha).toLowerCase().includes(q) ||
        String(l.id_usuario_responsable).toLowerCase().includes(q);
      const isTodosEstado = estadoFilter === 'Todos' || estadoFilter === 'Todos los estados';
      const matchesEstado = isTodosEstado || String(l.estado).toLowerCase() === String(estadoFilter).toLowerCase();
      return matchesSearch && matchesEstado;
    });
  }, [lotes, searchQuery, estadoFilter]);

  const handleSave = async (formData) => {
    setIsSaving(true);
    try {
      if (formData.id_lote) {
        const updated = await updateLote(formData.id_lote, formData);
        setLotes((prev) =>
          prev.map((l) => (l.id_lote === formData.id_lote ? { ...l, ...updated } : l))
        );
        setToast({ isOpen: true, type: 'success', message: 'Lote de producción actualizado correctamente' });
      } else {
        const created = await createLote(formData);
        setLotes((prev) => [created, ...prev]);
        setToast({ isOpen: true, type: 'success', message: 'Lote de producción creado correctamente' });
      }
      setShowModal(false);
    } catch (error) {
      setToast({ isOpen: true, type: 'error', message: 'Error al guardar el lote de producción' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleAnular = async () => {
    if (!deleteDialog.id) return;
    setIsDeleting(true);
    try {
      await anularLote(deleteDialog.id);
      setLotes((prev) => prev.map((l) => (l.id_lote === deleteDialog.id ? { ...l, estado: 'anulado' } : l)));
      setToast({ isOpen: true, type: 'success', message: 'Lote de producción anulado correctamente' });
    } catch (error) {
      setToast({ isOpen: true, type: 'error', message: 'Error al anular el lote de producción' });
    } finally {
      setIsDeleting(false);
      setDeleteDialog({ isOpen: false, id: null, nombre: '' });
    }
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
    isSaving,
    toast,
    setToast,
    handleSave,
    handleAnular,
  };
}


