import { useState, useEffect, useMemo } from 'react';
import { getFichasTecnicas, createFichaTecnica, updateFichaTecnica, deleteFichaTecnica } from '../services/fichasTecnicasService';

export function useFichasTecnicas() {
  const [fichas, setFichas] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [estadoFilter, setEstadoFilter] = useState('Todos');
  const [showModal, setShowModal] = useState(false);
  const [detailModal, setDetailModal] = useState({ isOpen: false, data: null });
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, id: null, nombre: '' });
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState({ isOpen: false, type: 'success', message: '' });

  useEffect(() => {
    getFichasTecnicas().then((data) => setFichas(data));
  }, []);

  const filteredFichas = useMemo(() => {
    return fichas.filter((f) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        f.nombre.toLowerCase().includes(q) ||
        (f.descripcion || '').toLowerCase().includes(q);
      const isTodos = estadoFilter === 'Todos' || estadoFilter === 'Todos los estados';
      const matchesEstado = isTodos || String(f.estado).toLowerCase() === String(estadoFilter).toLowerCase();
      return matchesSearch && matchesEstado;
    });
  }, [fichas, searchQuery, estadoFilter]);

  const handleSave = async (formData) => {
    setIsSaving(true);
    try {
      if (formData.id_ficha) {
        const updated = await updateFichaTecnica(formData.id_ficha, formData);
        setFichas((prev) =>
          prev.map((f) => (f.id_ficha === formData.id_ficha ? { ...f, ...updated } : f))
        );
        setToast({ isOpen: true, type: 'success', message: 'Ficha técnica actualizada correctamente' });
      } else {
        const created = await createFichaTecnica(formData);
        setFichas((prev) => [created, ...prev]);
        setToast({ isOpen: true, type: 'success', message: 'Ficha técnica creada correctamente' });
      }
      setShowModal(false);
    } catch (error) {
      setToast({ isOpen: true, type: 'error', message: 'Error al guardar la ficha técnica' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteDialog.id) return;
    setIsDeleting(true);
    try {
      await deleteFichaTecnica(deleteDialog.id);
      setFichas((prev) => prev.filter((f) => f.id_ficha !== deleteDialog.id));
      setToast({ isOpen: true, type: 'success', message: 'Ficha técnica eliminada correctamente' });
    } catch (error) {
      setToast({ isOpen: true, type: 'error', message: 'Error al eliminar la ficha técnica' });
    } finally {
      setIsDeleting(false);
      setDeleteDialog({ isOpen: false, id: null, nombre: '' });
    }
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
    isSaving,
    toast,
    setToast,
    handleSave,
    handleDelete,
  };
}
