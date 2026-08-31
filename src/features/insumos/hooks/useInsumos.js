import { useState, useEffect, useMemo } from 'react';
import { getInsumos, createInsumo, updateInsumo, deleteInsumo } from '../services/insumosService';

export function useInsumos() {
  const [insumos, setInsumos] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoriaFilter, setCategoriaFilter] = useState('Todas');
  const [estadoFilter, setEstadoFilter] = useState('Todos');
  const [showModal, setShowModal] = useState(false);
  const [detailModal, setDetailModal] = useState({ isOpen: false, data: null });
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, id: null, nombre: '' });
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState({ isOpen: false, type: 'success', message: '' });

  useEffect(() => {
    getInsumos().then((data) => setInsumos(data));
  }, []);

  const filteredInsumos = useMemo(() => {
    return insumos.filter((i) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        i.nombre.toLowerCase().includes(q) ||
        String(i.id_proveedor).includes(q);
      const isTodosCat = categoriaFilter === 'Todas' || categoriaFilter === 'Todas las categorías';
      const matchesCat = isTodosCat || String(i.id_proveedor) === categoriaFilter;
      const isTodosEstado = estadoFilter === 'Todos' || estadoFilter === 'Todos los estados';
      const matchesEstado = isTodosEstado || String(i.estado).toLowerCase() === String(estadoFilter).toLowerCase();
      return matchesSearch && matchesCat && matchesEstado;
    });
  }, [insumos, searchQuery, categoriaFilter, estadoFilter]);

  const handleSave = async (formData) => {
    setIsSaving(true);
    try {
      if (formData.id_insumo) {
        const updated = await updateInsumo(formData.id_insumo, formData);
        setInsumos((prev) =>
          prev.map((i) => (i.id_insumo === formData.id_insumo ? { ...i, ...updated } : i))
        );
        setToast({ isOpen: true, type: 'success', message: 'Insumo actualizado correctamente' });
      } else {
        const created = await createInsumo(formData);
        setInsumos((prev) => [created, ...prev]);
        setToast({ isOpen: true, type: 'success', message: 'Insumo creado correctamente' });
      }
      setShowModal(false);
    } catch (error) {
      setToast({ isOpen: true, type: 'error', message: 'Error al guardar el insumo' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteDialog.id) return;
    setIsDeleting(true);
    try {
      await deleteInsumo(deleteDialog.id);
      setInsumos((prev) => prev.filter((i) => i.id_insumo !== deleteDialog.id));
      setToast({ isOpen: true, type: 'success', message: 'Insumo eliminado correctamente' });
    } catch (error) {
      setToast({ isOpen: true, type: 'error', message: 'Error al eliminar el insumo' });
    } finally {
      setIsDeleting(false);
      setDeleteDialog({ isOpen: false, id: null, nombre: '' });
    }
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
    isSaving,
    toast,
    setToast,
    handleSave,
    handleDelete,
  };
}
