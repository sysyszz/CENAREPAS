import { useState, useEffect } from 'react';
import { getCompras, createCompra, updateCompra, anularCompra } from '../services/comprasService';

export function useCompras() {
  const [compras, setCompras] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [estadoFilter, setEstadoFilter] = useState('Todos');
  const [showModal, setShowModal] = useState(false);
  const [detailModal, setDetailModal] = useState({ isOpen: false, data: null });
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, id: null, nombre: '' });
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState({ isOpen: false, type: 'success', message: '' });

  useEffect(() => {
    getCompras().then((data) => setCompras(data));
  }, []);

  const filteredCompras = compras.filter((c) => {
    const matchesSearch =
      String(c.id_compra).includes(searchQuery.toLowerCase()) ||
      String(c.id_proveedor).includes(searchQuery.toLowerCase()) ||
      String(c.id_usuario).includes(searchQuery.toLowerCase());
    const matchesEstado = estadoFilter === 'Todos' || String(c.estado).toLowerCase() === String(estadoFilter).toLowerCase();
    return matchesSearch && matchesEstado;
  });

  const handleSave = async (formData) => {
    setIsSaving(true);
    try {
      if (formData.id_compra) {
        const updated = await updateCompra(formData.id_compra, formData);
        setCompras((prev) =>
          prev.map((c) => (c.id_compra === formData.id_compra ? { ...c, ...updated } : c))
        );
        setToast({ isOpen: true, type: 'success', message: 'Orden de compra actualizada correctamente' });
      } else {
        const created = await createCompra(formData);
        setCompras((prev) => [created, ...prev]);
        setToast({ isOpen: true, type: 'success', message: 'Orden de compra creada correctamente' });
      }
      setShowModal(false);
    } catch (error) {
      setToast({ isOpen: true, type: 'error', message: 'Error al guardar la compra' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleAnular = async () => {
    if (!deleteDialog.id) return;
    setIsDeleting(true);
    try {
      await anularCompra(deleteDialog.id);
      setCompras((prev) =>
        prev.map((c) => (c.id_compra === deleteDialog.id ? { ...c, estado: 'Anulada' } : c))
      );
      setToast({ isOpen: true, type: 'success', message: 'Orden de compra anulada correctamente' });
    } catch (error) {
      setToast({ isOpen: true, type: 'error', message: 'Error al anular la compra' });
    } finally {
      setIsDeleting(false);
      setDeleteDialog({ isOpen: false, id: null, nombre: '' });
    }
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
    isSaving,
    toast,
    setToast,
    handleSave,
    handleAnular,
  };
}
