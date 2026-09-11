import { useState, useEffect } from 'react';
import { getCompras, createCompra, updateCompra, anularCompra } from '../services/comprasService';
import { toast } from '../../../shared/utils/toast';

export function useCompras() {
  const [compras, setCompras] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [estadoFilter, setEstadoFilter] = useState('Todos');
  const [showModal, setShowModal] = useState(false);
  const [detailModal, setDetailModal] = useState({ isOpen: false, data: null });
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, id: null, nombre: '' });
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    getCompras()
      .then((data) => setCompras(Array.isArray(data) ? data : []))
      .catch(() => setCompras([]));
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
        toast.success('Cambios guardados');
      } else {
        const created = await createCompra(formData);
        setCompras((prev) => [created, ...prev]);
        toast.success('Orden de compra creada');
      }
      setShowModal(false);
    } catch (error) {
      toast.error('No se pudo guardar la compra');
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
      toast.success('Orden de compra anulada');
    } catch (error) {
      toast.error('No se pudo anular la compra');
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
    handleSave,
    handleAnular,
  };
}
